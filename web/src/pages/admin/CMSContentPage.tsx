/**
 * CMS Content Management Page
 *
 * ERP-grade CMS admin page (FINAL)
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  TextField,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';

import { AdminLayout } from '../../components/layout/AdminLayout';
import { InfoCard } from '../../components/dashboard/InfoCard';
import { SkeletonLoader } from '../../components/dashboard/SkeletonLoader';

import { apiClient } from '../../services/apiClient';
import { useDebounce } from '../../hooks/useDebounce';

interface CMSContent {
  id: string;
  title: string;
  description: string;
  category?: string;
  isActive: boolean;
}

interface CMSContentPageProps {
  contentType:
    | 'offers'
    | 'steel-market'
    | 'lectures'
    | 'trading-advice'
    | 'projects'
    | 'tenders'
    | 'education'
    | 'quiz';
  title: string;
  apiEndpoint: string;
}

const ITEMS_PER_PAGE = 12;

const CMSContentPage: React.FC<CMSContentPageProps> = ({
  title,
  apiEndpoint
}) => {
  const [items, setItems] = useState<CMSContent[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [editItem, setEditItem] = useState<CMSContent | null>(null);
  const [deleteItem, setDeleteItem] = useState<CMSContent | null>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: ''
  });

  useEffect(() => {
    loadItems();
  }, [page, debouncedSearch]);

  const loadItems = async () => {
    setLoading(true);
    try {
      if (apiClient.isMockMode()) {
        const mock = Array.from({ length: 12 }, (_, i) => ({
          id: `${i + 1}`,
          title: `${title} ${i + 1}`,
          description: 'Sample description',
          category: 'General',
          isActive: true
        }));
        setItems(mock);
        setTotalPages(3);
      } else {
        const res = await apiClient.get<any>(apiEndpoint, {
          params: { page, limit: ITEMS_PER_PAGE, search: debouncedSearch }
        });
        setItems(res.items);
        setTotalPages(res.pagination.pages);
      }
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditItem(null);
    setForm({ title: '', description: '', category: '' });
  };

  const openEdit = (item: CMSContent) => {
    setEditItem(item);
    setForm({
      title: item.title,
      description: item.description,
      category: item.category || ''
    });
  };

  const saveItem = async () => {
    if (!apiClient.isMockMode()) {
      editItem
        ? await apiClient.patch(`${apiEndpoint}/${editItem.id}`, form)
        : await apiClient.post(apiEndpoint, form);
    }
    setEditItem(null);
    loadItems();
  };

  const confirmDelete = async () => {
    if (!deleteItem) return;
    if (!apiClient.isMockMode()) {
      await apiClient.delete(`${apiEndpoint}/${deleteItem.id}`);
    }
    setDeleteItem(null);
    loadItems();
  };

  return (
    <AdminLayout title={title}>
      {/* Header actions */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          size="small"
          placeholder={`Search ${title}`}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <Button variant="contained" onClick={openAdd}>
          Add New
        </Button>
      </Box>

      {/* Content */}
      {loading ? (
        <SkeletonLoader variant="list" count={8} />
      ) : (
        <Grid container spacing={3}>
          {items.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <InfoCard
                title={item.title}
                action={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" onClick={() => openEdit(item)}>
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => setDeleteItem(item)}
                    >
                      Delete
                    </Button>
                  </Box>
                }
              >
                <Typography variant="body2">
                  {item.description}
                </Typography>
                {item.category && (
                  <Typography variant="caption" color="text.secondary">
                    Category: {item.category}
                  </Typography>
                )}
              </InfoCard>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, p) => setPage(p)}
          />
        </Box>
      )}

      {/* Add / Edit Modal */}
      <Dialog
        open={editItem !== null || form.title !== ''}
        onClose={() => setEditItem(null)}
      >
        <DialogTitle>{editItem ? `Edit ${title}` : `Add ${title}`}</DialogTitle>
        <DialogContent sx={{ minWidth: 400, pt: 2 }}>
          <TextField
            fullWidth
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditItem(null)}>Cancel</Button>
          <Button onClick={saveItem} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Modal */}
      <Dialog
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deleteItem?.title}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteItem(null)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
};

export default CMSContentPage;
