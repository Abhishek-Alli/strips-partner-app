/**
 * Upload Controller
 *
 * Handles file uploads using Supabase Storage
 * Falls back to local storage if Supabase is not configured
 */

import { query } from '../config/database.js';
import crypto from 'crypto';
import path from 'path';

// Lazy-loaded Supabase client
let supabase = null;

const getSupabaseClient = async () => {
  if (supabase) return supabase;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Supabase storage not configured. File uploads will use database-only mode.');
    return null;
  }

  try {
    const { createClient } = await import('@supabase/supabase-js');
    supabase = createClient(supabaseUrl, supabaseServiceKey);
    return supabase;
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    return null;
  }
};

// Bucket mapping by role
const BUCKET_MAP = {
  ADMIN: 'admin-uploads',
  DEALER: 'dealer-uploads',
  PARTNER: 'partner-uploads',
  GENERAL_USER: 'user-uploads'
};

// Generate unique filename
const generateFilename = (originalName) => {
  const ext = path.extname(originalName);
  const hash = crypto.randomBytes(16).toString('hex');
  const timestamp = Date.now();
  return `${timestamp}_${hash}${ext}`;
};

// Get file folder path based on context
const getFilePath = (userId, entityType, filename) => {
  return `${userId}/${entityType || 'general'}/${filename}`;
};

/**
 * Upload a single file
 */
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const { entityType, entityId } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Determine bucket based on user role
    const bucket = BUCKET_MAP[userRole] || 'user-uploads';

    // Generate unique filename
    const filename = generateFilename(req.file.originalname);
    const filePath = getFilePath(userId, entityType, filename);

    let fileUrl = null;

    // Try to upload to Supabase Storage
    const supabaseClient = await getSupabaseClient();
    if (supabaseClient) {
      const { data: uploadData, error: uploadError } = await supabaseClient.storage
        .from(bucket)
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Supabase upload error:', uploadError);
        return res.status(500).json({ error: 'Failed to upload file to storage' });
      }

      // Get public URL
      const { data: urlData } = supabaseClient.storage
        .from(bucket)
        .getPublicUrl(filePath);

      fileUrl = urlData.publicUrl;
    } else {
      // Database-only mode - store base64 or just metadata
      fileUrl = `local://${bucket}/${filePath}`;
    }

    // Save file record to database
    const result = await query(`
      INSERT INTO files (
        user_id, filename, original_filename, file_path, file_url,
        mime_type, file_size, entity_type, entity_id, is_public
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
      RETURNING *
    `, [
      userId,
      filename,
      req.file.originalname,
      `${bucket}/${filePath}`,
      fileUrl,
      req.file.mimetype,
      req.file.size,
      entityType || null,
      entityId || null
    ]);

    res.status(201).json({
      file: result.rows[0],
      url: fileUrl
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
};

/**
 * Upload multiple files
 */
export const uploadMultipleFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    const { entityType, entityId } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;
    const bucket = BUCKET_MAP[userRole] || 'user-uploads';

    const supabaseClient = await getSupabaseClient();
    const uploadedFiles = [];

    for (const file of req.files) {
      const filename = generateFilename(file.originalname);
      const filePath = getFilePath(userId, entityType, filename);
      let fileUrl = null;

      if (supabaseClient) {
        // Upload to Supabase
        const { data: uploadData, error: uploadError } = await supabaseClient.storage
          .from(bucket)
          .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Upload error for file:', file.originalname, uploadError);
          continue;
        }

        const { data: urlData } = supabaseClient.storage
          .from(bucket)
          .getPublicUrl(filePath);

        fileUrl = urlData.publicUrl;
      } else {
        fileUrl = `local://${bucket}/${filePath}`;
      }

      // Save to database
      const result = await query(`
        INSERT INTO files (
          user_id, filename, original_filename, file_path, file_url,
          mime_type, file_size, entity_type, entity_id, is_public
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
        RETURNING *
      `, [
        userId,
        filename,
        file.originalname,
        `${bucket}/${filePath}`,
        fileUrl,
        file.mimetype,
        file.size,
        entityType || null,
        entityId || null
      ]);

      uploadedFiles.push({
        ...result.rows[0],
        url: fileUrl
      });
    }

    res.status(201).json({
      files: uploadedFiles,
      count: uploadedFiles.length
    });
  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({ error: 'Failed to upload files' });
  }
};

/**
 * Delete a file
 */
export const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Get file record
    const fileResult = await query(
      'SELECT * FROM files WHERE id = $1',
      [id]
    );

    if (fileResult.rows.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    const file = fileResult.rows[0];

    // Check ownership (admin can delete any)
    if (userRole !== 'ADMIN' && file.user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this file' });
    }

    // Try to delete from Supabase Storage
    const supabaseClient = await getSupabaseClient();
    if (supabaseClient && !file.file_url.startsWith('local://')) {
      const pathParts = file.file_path.split('/');
      const bucket = pathParts[0];
      const storagePath = pathParts.slice(1).join('/');

      const { error: deleteError } = await supabaseClient.storage
        .from(bucket)
        .remove([storagePath]);

      if (deleteError) {
        console.error('Supabase delete error:', deleteError);
      }
    }

    // Delete from database
    await query('DELETE FROM files WHERE id = $1', [id]);

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
};

/**
 * Get files by entity
 */
export const getFilesByEntity = async (req, res) => {
  try {
    const { entityType, entityId } = req.params;

    const result = await query(`
      SELECT * FROM files
      WHERE entity_type = $1 AND entity_id = $2
      ORDER BY created_at DESC
    `, [entityType, entityId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
};

/**
 * Get user's files
 */
export const getUserFiles = async (req, res) => {
  try {
    const userId = req.user.id;
    const { entityType } = req.query;

    let sql = 'SELECT * FROM files WHERE user_id = $1';
    const params = [userId];

    if (entityType) {
      sql += ' AND entity_type = $2';
      params.push(entityType);
    }

    sql += ' ORDER BY created_at DESC';

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get user files error:', error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
};

/**
 * Admin: Upload to specific bucket
 */
export const adminUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const { bucket = 'admin-uploads', folder, entityType, entityId } = req.body;
    const userId = req.user.id;

    // Validate bucket
    const validBuckets = ['admin-uploads', 'tenders', 'dealer-uploads', 'partner-uploads', 'user-uploads'];
    if (!validBuckets.includes(bucket)) {
      return res.status(400).json({ error: 'Invalid bucket' });
    }

    const filename = generateFilename(req.file.originalname);
    const filePath = folder ? `${folder}/${filename}` : `admin/${filename}`;
    let fileUrl = null;

    const supabaseClient = await getSupabaseClient();
    if (supabaseClient) {
      // Upload to Supabase
      const { data: uploadData, error: uploadError } = await supabaseClient.storage
        .from(bucket)
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Admin upload error:', uploadError);
        return res.status(500).json({ error: 'Failed to upload file' });
      }

      const { data: urlData } = supabaseClient.storage
        .from(bucket)
        .getPublicUrl(filePath);

      fileUrl = urlData.publicUrl;
    } else {
      fileUrl = `local://${bucket}/${filePath}`;
    }

    // Save to database
    const result = await query(`
      INSERT INTO files (
        user_id, filename, original_filename, file_path, file_url,
        mime_type, file_size, entity_type, entity_id, is_public
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
      RETURNING *
    `, [
      userId,
      filename,
      req.file.originalname,
      `${bucket}/${filePath}`,
      fileUrl,
      req.file.mimetype,
      req.file.size,
      entityType || null,
      entityId || null
    ]);

    res.status(201).json({
      file: result.rows[0],
      url: fileUrl
    });
  } catch (error) {
    console.error('Admin upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
};

/**
 * Get signed URL for private files
 */
export const getSignedUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const fileResult = await query('SELECT * FROM files WHERE id = $1', [id]);

    if (fileResult.rows.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    const file = fileResult.rows[0];

    // Check access
    if (!file.is_public && userRole !== 'ADMIN' && file.user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // If public, return the public URL
    if (file.is_public) {
      return res.json({ url: file.file_url, expiresIn: null });
    }

    // For local files, just return the URL
    if (file.file_url.startsWith('local://')) {
      return res.json({ url: file.file_url, expiresIn: null });
    }

    // Generate signed URL for private files in Supabase
    const supabaseClient = await getSupabaseClient();
    if (!supabaseClient) {
      return res.json({ url: file.file_url, expiresIn: null });
    }

    const pathParts = file.file_path.split('/');
    const bucket = pathParts[0];
    const storagePath = pathParts.slice(1).join('/');

    const { data, error } = await supabaseClient.storage
      .from(bucket)
      .createSignedUrl(storagePath, 3600); // 1 hour expiry

    if (error) {
      console.error('Signed URL error:', error);
      return res.status(500).json({ error: 'Failed to generate signed URL' });
    }

    res.json({ url: data.signedUrl, expiresIn: 3600 });
  } catch (error) {
    console.error('Get signed URL error:', error);
    res.status(500).json({ error: 'Failed to get signed URL' });
  }
};
