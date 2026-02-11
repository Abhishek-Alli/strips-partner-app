-- ============================================================================
-- SHREE OM PLATFORM - COMPLETE DATABASE SCHEMA
-- ============================================================================
-- Run this entire script in Supabase SQL Editor
-- This creates ALL tables, indexes, functions, triggers, RLS policies, and seed data
-- ============================================================================

-- ============================================================================
-- PART 1: EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- PART 2: ENUM TYPES
-- ============================================================================

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('GENERAL_USER', 'PARTNER', 'DEALER', 'ADMIN');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM ('push', 'email', 'sms', 'in_app');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE enquiry_status AS ENUM ('new', 'viewed', 'responded', 'closed');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE application_status AS ENUM ('pending', 'under_review', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- PART 3: HELPER FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.referral_code IS NULL THEN
        NEW.referral_code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number := 'SOM' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
                        LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PART 4: CORE TABLES
-- ============================================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255),
    role VARCHAR(50) NOT NULL DEFAULT 'GENERAL_USER',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_role CHECK (role IN ('GENERAL_USER', 'PARTNER', 'DEALER', 'ADMIN'))
);

-- OTP table
CREATE TABLE IF NOT EXISTS otps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(20) NOT NULL,
    code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact Enquiries
CREATE TABLE IF NOT EXISTS contact_enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- PART 5: PROFILES (Extended user information)
-- ============================================================================

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    avatar_url VARCHAR(500),
    date_of_birth DATE,
    gender VARCHAR(20),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    country VARCHAR(100) DEFAULT 'India',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    location_name VARCHAR(255),
    business_name VARCHAR(255),
    business_type VARCHAR(100),
    gst_number VARCHAR(20),
    pan_number VARCHAR(15),
    business_license VARCHAR(100),
    alternate_phone VARCHAR(20),
    whatsapp_number VARCHAR(20),
    website_url VARCHAR(500),
    facebook_url VARCHAR(500),
    instagram_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    referral_code VARCHAR(20) UNIQUE,
    referred_by UUID REFERENCES users(id),
    commission_rate DECIMAL(5, 2) DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    total_revenue DECIMAL(12, 2) DEFAULT 0,
    average_rating DECIMAL(3, 2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    is_email_verified BOOLEAN DEFAULT false,
    is_phone_verified BOOLEAN DEFAULT false,
    is_business_verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMP,
    notification_preferences JSONB DEFAULT '{"email": true, "push": true, "sms": true}',
    language_preference VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- PART 6: PRODUCT TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    parent_id UUID REFERENCES product_categories(id),
    description TEXT,
    image_url VARCHAR(500),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS master_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    category_id UUID REFERENCES product_categories(id),
    description TEXT,
    unit VARCHAR(50),
    specifications JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dealer_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dealer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES master_products(id) ON DELETE CASCADE,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    unit VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    images TEXT[],
    specifications JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(dealer_id, product_id)
);

-- ============================================================================
-- PART 7: ORDER & PAYMENT TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE,
    user_id UUID NOT NULL REFERENCES users(id),
    dealer_id UUID REFERENCES users(id),
    partner_id UUID REFERENCES users(id),
    status order_status DEFAULT 'pending',
    total_amount DECIMAL(12, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    shipping_amount DECIMAL(10, 2) DEFAULT 0,
    final_amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    shipping_name VARCHAR(255),
    shipping_phone VARCHAR(20),
    shipping_address_line1 VARCHAR(255),
    shipping_address_line2 VARCHAR(255),
    shipping_city VARCHAR(100),
    shipping_state VARCHAR(100),
    shipping_pincode VARCHAR(10),
    billing_name VARCHAR(255),
    billing_phone VARCHAR(20),
    billing_address_line1 VARCHAR(255),
    billing_address_line2 VARCHAR(255),
    billing_city VARCHAR(100),
    billing_state VARCHAR(100),
    billing_pincode VARCHAR(10),
    tracking_number VARCHAR(100),
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT,
    customer_notes TEXT,
    admin_notes TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES master_products(id),
    dealer_product_id UUID REFERENCES dealer_products(id),
    product_name VARCHAR(255) NOT NULL,
    product_description TEXT,
    product_image VARCHAR(500),
    unit_price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    discount_percent DECIMAL(5, 2) DEFAULT 0,
    tax_percent DECIMAL(5, 2) DEFAULT 0,
    total_price DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(50),
    specifications JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id),
    user_id UUID NOT NULL REFERENCES users(id),
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    status payment_status DEFAULT 'pending',
    payment_gateway VARCHAR(50),
    gateway_order_id VARCHAR(100),
    gateway_payment_id VARCHAR(100),
    gateway_signature VARCHAR(255),
    payment_method VARCHAR(50),
    payment_method_details JSONB,
    initiated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    failed_at TIMESTAMP,
    refunded_at TIMESTAMP,
    error_code VARCHAR(50),
    error_message TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    order_id UUID REFERENCES orders(id),
    payment_id UUID REFERENCES payments(id),
    transaction_type VARCHAR(50) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    balance_before DECIMAL(12, 2),
    balance_after DECIMAL(12, 2),
    description TEXT,
    reference_number VARCHAR(100),
    status VARCHAR(20) DEFAULT 'completed',
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- PART 8: ENQUIRY TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS general_enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(100),
    status enquiry_status DEFAULT 'new',
    priority VARCHAR(20) DEFAULT 'normal',
    assigned_to UUID REFERENCES users(id),
    response TEXT,
    responded_at TIMESTAMP,
    responded_by UUID REFERENCES users(id),
    source VARCHAR(50),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dealer_enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enquiry_id UUID,
    dealer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_name VARCHAR(255),
    user_email VARCHAR(255),
    user_phone VARCHAR(20),
    topic VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'responded', 'closed')),
    response TEXT,
    responded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS partner_enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    service_type VARCHAR(100),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    budget_range VARCHAR(100),
    timeline VARCHAR(100),
    project_location VARCHAR(255),
    project_type VARCHAR(100),
    status enquiry_status DEFAULT 'new',
    response TEXT,
    responded_at TIMESTAMP,
    attachments TEXT[],
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- PART 9: FEEDBACK & RATING TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS dealer_feedbacks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dealer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_name VARCHAR(255),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_reported BOOLEAN DEFAULT false,
    reported_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS partner_feedbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
    service_rating INTEGER CHECK (service_rating >= 1 AND service_rating <= 5),
    value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
    images TEXT[],
    is_verified_purchase BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT true,
    is_reported BOOLEAN DEFAULT false,
    reported_reason TEXT,
    partner_response TEXT,
    partner_responded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES master_products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    pros TEXT,
    cons TEXT,
    images TEXT[],
    is_verified_purchase BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT true,
    is_reported BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, user_id, order_id)
);

-- ============================================================================
-- PART 10: ADMIN PORTAL TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    event_date TIMESTAMP,
    created_by UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS event_invites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_role VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    responded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, user_id)
);

CREATE TABLE IF NOT EXISTS partner_works (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    images TEXT[],
    videos TEXT[],
    links TEXT[],
    category VARCHAR(100),
    is_approved BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS steel_market_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    created_by UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS guest_lectures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    meeting_link VARCHAR(500),
    lecture_date TIMESTAMP,
    created_by UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trading_advices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    visible_to_dealers BOOLEAN DEFAULT false,
    visible_to_partners BOOLEAN DEFAULT false,
    created_by UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS upcoming_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    created_by UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tenders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    attachments TEXT[],
    created_by UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS education_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    video_links TEXT[],
    documents TEXT[],
    images TEXT[],
    created_by UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    questions JSONB NOT NULL,
    created_by UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    answers JSONB NOT NULL,
    score INTEGER,
    total_questions INTEGER,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(quiz_id, user_id)
);

CREATE TABLE IF NOT EXISTS admin_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    visible_to_partners BOOLEAN DEFAULT false,
    visible_to_dealers BOOLEAN DEFAULT false,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10, 2),
    valid_until TIMESTAMP,
    applicable_to VARCHAR(50) CHECK (applicable_to IN ('partners', 'dealers', 'both')),
    created_by UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dealer_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    offer_id UUID NOT NULL,
    dealer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_liked BOOLEAN DEFAULT false,
    liked_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(dealer_id, offer_id)
);

CREATE TABLE IF NOT EXISTS checklists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    items JSONB NOT NULL,
    created_by UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS visualization_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    request_type VARCHAR(50) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'rejected')),
    response_video VARCHAR(500),
    response_image VARCHAR(500),
    response_message TEXT,
    responded_by UUID REFERENCES users(id),
    responded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS shortcuts_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    link_url VARCHAR(500) NOT NULL,
    description TEXT,
    created_by UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    youtube_url VARCHAR(500) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    created_by UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dealership_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    location VARCHAR(255),
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS loyalty_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    points INTEGER NOT NULL DEFAULT 0,
    source VARCHAR(50),
    description TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- PART 11: NOTIFICATION TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS notification_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    title_template VARCHAR(255) NOT NULL,
    body_template TEXT NOT NULL,
    send_push BOOLEAN DEFAULT true,
    send_email BOOLEAN DEFAULT false,
    send_sms BOOLEAN DEFAULT false,
    email_subject VARCHAR(255),
    email_html_template TEXT,
    sms_template VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    type notification_type DEFAULT 'in_app',
    category VARCHAR(50),
    action_url VARCHAR(500),
    action_data JSONB,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    is_sent BOOLEAN DEFAULT false,
    sent_at TIMESTAMP,
    delivery_status VARCHAR(20),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS push_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL,
    device_type VARCHAR(20),
    device_id VARCHAR(255),
    device_name VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    last_used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, token)
);

-- ============================================================================
-- PART 12: MESSAGING TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant1_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    participant2_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    context_type VARCHAR(50),
    context_id UUID,
    is_active BOOLEAN DEFAULT true,
    last_message_id UUID,
    last_message_at TIMESTAMP,
    last_message_preview VARCHAR(255),
    participant1_unread INTEGER DEFAULT 0,
    participant2_unread INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(participant1_id, participant2_id)
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message_type VARCHAR(20) DEFAULT 'text',
    content TEXT,
    media_url VARCHAR(500),
    media_type VARCHAR(50),
    media_size INTEGER,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMP,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- PART 13: FILES & ACTIVITY TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100),
    file_size BIGINT,
    width INTEGER,
    height INTEGER,
    thumbnail_url VARCHAR(500),
    entity_type VARCHAR(50),
    entity_id UUID,
    is_public BOOLEAN DEFAULT false,
    is_processed BOOLEAN DEFAULT true,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    description TEXT,
    changes JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- PART 14: FAVORITES & REFERRAL TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, entity_type, entity_id)
);

CREATE TABLE IF NOT EXISTS referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    referred_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    referral_code VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    reward_points INTEGER DEFAULT 0,
    reward_amount DECIMAL(10, 2) DEFAULT 0,
    rewarded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(referrer_id, referred_id)
);

CREATE TABLE IF NOT EXISTS loyalty_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) NOT NULL,
    points INTEGER NOT NULL,
    balance_before INTEGER,
    balance_after INTEGER,
    source VARCHAR(50),
    reference_type VARCHAR(50),
    reference_id UUID,
    description TEXT,
    expires_at TIMESTAMP,
    adjusted_by UUID REFERENCES users(id),
    adjustment_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- PART 15: CONFIGURATION & ANALYTICS TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS cost_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_name VARCHAR(255) NOT NULL,
    config_value DECIMAL(12, 2),
    config_unit VARCHAR(50),
    config_type VARCHAR(50),
    tier_values JSONB,
    applicable_to VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    description TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    session_id VARCHAR(100),
    event_type VARCHAR(100) NOT NULL,
    event_name VARCHAR(255),
    page_url VARCHAR(500),
    page_title VARCHAR(255),
    referrer_url VARCHAR(500),
    entity_type VARCHAR(50),
    entity_id UUID,
    search_query VARCHAR(500),
    search_results_count INTEGER,
    device_type VARCHAR(20),
    browser VARCHAR(100),
    os VARCHAR(100),
    country VARCHAR(100),
    city VARCHAR(100),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS daily_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stat_date DATE NOT NULL,
    new_users INTEGER DEFAULT 0,
    active_users INTEGER DEFAULT 0,
    new_dealers INTEGER DEFAULT 0,
    new_partners INTEGER DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    total_revenue DECIMAL(12, 2) DEFAULT 0,
    average_order_value DECIMAL(10, 2) DEFAULT 0,
    total_enquiries INTEGER DEFAULT 0,
    total_feedbacks INTEGER DEFAULT 0,
    total_page_views INTEGER DEFAULT 0,
    new_products INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(stat_date)
);

CREATE TABLE IF NOT EXISTS search_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    search_query VARCHAR(500) NOT NULL,
    search_type VARCHAR(50),
    results_count INTEGER,
    filters JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- PART 16: ALL INDEXES
-- ============================================================================

-- Core indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_otps_phone ON otps(phone);
CREATE INDEX IF NOT EXISTS idx_otps_code ON otps(code);
CREATE INDEX IF NOT EXISTS idx_contact_enquiries_email ON contact_enquiries(email);
CREATE INDEX IF NOT EXISTS idx_contact_enquiries_created_at ON contact_enquiries(created_at);

-- Profile indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON profiles(referral_code);

-- Product indexes
CREATE INDEX IF NOT EXISTS idx_product_categories_parent_id ON product_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_product_categories_slug ON product_categories(slug);
CREATE INDEX IF NOT EXISTS idx_dealer_products_dealer_id ON dealer_products(dealer_id);
CREATE INDEX IF NOT EXISTS idx_dealer_products_product_id ON dealer_products(product_id);
CREATE INDEX IF NOT EXISTS idx_dealer_products_status ON dealer_products(status);

-- Order indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_dealer_id ON orders(dealer_id);
CREATE INDEX IF NOT EXISTS idx_orders_partner_id ON orders(partner_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Payment indexes
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_gateway_payment_id ON payments(gateway_payment_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_order_id ON transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);

-- Enquiry indexes
CREATE INDEX IF NOT EXISTS idx_general_enquiries_user_id ON general_enquiries(user_id);
CREATE INDEX IF NOT EXISTS idx_general_enquiries_status ON general_enquiries(status);
CREATE INDEX IF NOT EXISTS idx_dealer_enquiries_dealer_id ON dealer_enquiries(dealer_id);
CREATE INDEX IF NOT EXISTS idx_dealer_enquiries_user_id ON dealer_enquiries(user_id);
CREATE INDEX IF NOT EXISTS idx_dealer_enquiries_status ON dealer_enquiries(status);
CREATE INDEX IF NOT EXISTS idx_partner_enquiries_partner_id ON partner_enquiries(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_enquiries_user_id ON partner_enquiries(user_id);
CREATE INDEX IF NOT EXISTS idx_partner_enquiries_status ON partner_enquiries(status);

-- Feedback indexes
CREATE INDEX IF NOT EXISTS idx_dealer_feedbacks_dealer_id ON dealer_feedbacks(dealer_id);
CREATE INDEX IF NOT EXISTS idx_dealer_feedbacks_user_id ON dealer_feedbacks(user_id);
CREATE INDEX IF NOT EXISTS idx_partner_feedbacks_partner_id ON partner_feedbacks(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_feedbacks_user_id ON partner_feedbacks(user_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_user_id ON product_reviews(user_id);

-- Admin portal indexes
CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);
CREATE INDEX IF NOT EXISTS idx_events_is_active ON events(is_active);
CREATE INDEX IF NOT EXISTS idx_event_invites_event_id ON event_invites(event_id);
CREATE INDEX IF NOT EXISTS idx_event_invites_user_id ON event_invites(user_id);
CREATE INDEX IF NOT EXISTS idx_partner_works_partner_id ON partner_works(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_works_is_approved ON partner_works(is_approved);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_visualization_requests_user_id ON visualization_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_visualization_requests_status ON visualization_requests(status);
CREATE INDEX IF NOT EXISTS idx_dealership_applications_user_id ON dealership_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_dealership_applications_status ON dealership_applications(status);
CREATE INDEX IF NOT EXISTS idx_loyalty_points_user_id ON loyalty_points(user_id);
CREATE INDEX IF NOT EXISTS idx_dealer_offers_dealer_id ON dealer_offers(dealer_id);
CREATE INDEX IF NOT EXISTS idx_dealer_offers_offer_id ON dealer_offers(offer_id);

-- Notification indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_push_tokens_user_id ON push_tokens(user_id);

-- Messaging indexes
CREATE INDEX IF NOT EXISTS idx_conversations_participant1 ON conversations(participant1_id);
CREATE INDEX IF NOT EXISTS idx_conversations_participant2 ON conversations(participant2_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- File indexes
CREATE INDEX IF NOT EXISTS idx_files_user_id ON files(user_id);
CREATE INDEX IF NOT EXISTS idx_files_entity ON files(entity_type, entity_id);

-- Activity indexes
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);

-- Favorites & referral indexes
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_entity ON favorites(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_id ON referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_user_id ON loyalty_transactions(user_id);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON daily_stats(stat_date);
CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_query ON search_history(search_query);

-- ============================================================================
-- PART 17: ALL TRIGGERS
-- ============================================================================

-- Users trigger
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Profiles trigger
DROP TRIGGER IF EXISTS set_referral_code ON profiles;
CREATE TRIGGER set_referral_code BEFORE INSERT ON profiles
    FOR EACH ROW EXECUTE FUNCTION generate_referral_code();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Orders trigger
DROP TRIGGER IF EXISTS set_order_number ON orders;
CREATE TRIGGER set_order_number BEFORE INSERT ON orders
    FOR EACH ROW WHEN (NEW.order_number IS NULL)
    EXECUTE FUNCTION generate_order_number();

-- Apply updated_at trigger to all relevant tables
DO $$
DECLARE
    t text;
BEGIN
    FOREACH t IN ARRAY ARRAY[
        'master_products', 'dealer_products', 'dealer_enquiries', 'product_categories',
        'orders', 'payments', 'general_enquiries', 'partner_enquiries', 'partner_feedbacks',
        'product_reviews', 'events', 'partner_works', 'steel_market_updates', 'guest_lectures',
        'trading_advices', 'upcoming_projects', 'tenders', 'education_posts', 'quizzes',
        'admin_notes', 'offers', 'checklists', 'visualization_requests', 'shortcuts_links',
        'videos', 'dealership_applications', 'notification_templates', 'conversations',
        'cost_configurations', 'daily_stats'
    ]
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS update_%I_updated_at ON %I;
            CREATE TRIGGER update_%I_updated_at
            BEFORE UPDATE ON %I
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        ', t, t, t, t);
    END LOOP;
END $$;

-- ============================================================================
-- PART 18: DASHBOARD VIEWS
-- ============================================================================

CREATE OR REPLACE VIEW dealer_dashboard_stats AS
SELECT
    u.id as dealer_id,
    p.business_name,
    p.average_rating,
    p.total_reviews,
    p.total_orders,
    p.total_revenue,
    (SELECT COUNT(*) FROM dealer_products dp WHERE dp.dealer_id = u.id AND dp.status = 'active') as active_products,
    (SELECT COUNT(*) FROM dealer_enquiries de WHERE de.dealer_id = u.id AND de.status = 'new') as pending_enquiries,
    (SELECT COUNT(*) FROM orders o WHERE o.dealer_id = u.id AND o.status = 'pending') as pending_orders
FROM users u
LEFT JOIN profiles p ON u.id = p.user_id
WHERE u.role = 'DEALER' AND u.is_active = true;

CREATE OR REPLACE VIEW partner_dashboard_stats AS
SELECT
    u.id as partner_id,
    p.business_name,
    p.average_rating,
    p.total_reviews,
    p.total_orders,
    p.total_revenue,
    (SELECT COUNT(*) FROM partner_works pw WHERE pw.partner_id = u.id AND pw.is_active = true) as total_works,
    (SELECT COUNT(*) FROM partner_enquiries pe WHERE pe.partner_id = u.id AND pe.status = 'new') as pending_enquiries,
    (SELECT COUNT(*) FROM orders o WHERE o.partner_id = u.id AND o.status = 'pending') as pending_orders
FROM users u
LEFT JOIN profiles p ON u.id = p.user_id
WHERE u.role = 'PARTNER' AND u.is_active = true;

CREATE OR REPLACE VIEW admin_dashboard_stats AS
SELECT
    (SELECT COUNT(*) FROM users WHERE role = 'GENERAL_USER' AND is_active = true) as total_users,
    (SELECT COUNT(*) FROM users WHERE role = 'DEALER' AND is_active = true) as total_dealers,
    (SELECT COUNT(*) FROM users WHERE role = 'PARTNER' AND is_active = true) as total_partners,
    (SELECT COUNT(*) FROM orders WHERE created_at >= CURRENT_DATE) as orders_today,
    (SELECT COALESCE(SUM(final_amount), 0) FROM orders WHERE created_at >= CURRENT_DATE AND status != 'cancelled') as revenue_today,
    (SELECT COUNT(*) FROM general_enquiries WHERE status = 'new') as pending_enquiries,
    (SELECT COUNT(*) FROM dealership_applications WHERE status = 'pending') as pending_applications,
    (SELECT COUNT(*) FROM users WHERE created_at >= CURRENT_DATE) as new_users_today;

-- ============================================================================
-- PART 19: DEFAULT DATA
-- ============================================================================

-- Default notification templates
INSERT INTO notification_templates (code, name, title_template, body_template, send_push, send_email, send_sms)
VALUES
    ('order_placed', 'Order Placed', 'Order Confirmed!', 'Your order {{order_number}} has been placed successfully.', true, true, true),
    ('order_shipped', 'Order Shipped', 'Order Shipped!', 'Your order {{order_number}} has been shipped. Tracking: {{tracking_number}}', true, true, true),
    ('order_delivered', 'Order Delivered', 'Order Delivered!', 'Your order {{order_number}} has been delivered.', true, true, false),
    ('enquiry_received', 'New Enquiry', 'New Enquiry Received', 'You have received a new enquiry from {{user_name}}.', true, true, false),
    ('enquiry_response', 'Enquiry Response', 'Response to Your Enquiry', '{{dealer_name}} has responded to your enquiry.', true, true, false),
    ('new_feedback', 'New Feedback', 'New Review Received', 'You have received a new {{rating}}-star review.', true, true, false),
    ('loyalty_earned', 'Points Earned', 'You Earned Points!', 'You have earned {{points}} loyalty points.', true, false, false),
    ('offer_new', 'New Offer', 'New Offer Available!', '{{offer_title}} - {{offer_description}}', true, true, false),
    ('password_reset', 'Password Reset', 'Password Reset Request', 'Your OTP for password reset is {{otp}}.', false, true, true)
ON CONFLICT (code) DO NOTHING;

-- Default cost configurations
INSERT INTO cost_configurations (config_key, config_name, config_value, config_unit, config_type, applicable_to, description)
VALUES
    ('dealer_commission', 'Dealer Commission Rate', 5.00, 'percent', 'percentage', 'dealer', 'Default commission rate for dealers'),
    ('partner_commission', 'Partner Commission Rate', 10.00, 'percent', 'percentage', 'partner', 'Default commission rate for partners'),
    ('min_order_value', 'Minimum Order Value', 500.00, 'INR', 'fixed', 'all', 'Minimum order value for checkout'),
    ('loyalty_earn_rate', 'Loyalty Points Earn Rate', 1.00, 'points_per_100', 'fixed', 'all', '1 point per 100 INR spent'),
    ('loyalty_redeem_rate', 'Loyalty Points Redemption Rate', 0.25, 'INR_per_point', 'fixed', 'all', '1 point = 0.25 INR'),
    ('referral_bonus_referrer', 'Referral Bonus (Referrer)', 100, 'points', 'fixed', 'all', 'Points awarded to referrer'),
    ('referral_bonus_referred', 'Referral Bonus (Referred)', 50, 'points', 'fixed', 'all', 'Points awarded to new user')
ON CONFLICT (config_key) DO NOTHING;

-- Default product categories
INSERT INTO product_categories (name, slug, description, display_order)
VALUES
    ('Cement', 'cement', 'Cement and binding materials', 1),
    ('Steel', 'steel', 'Steel and metal products', 2),
    ('Electrical', 'electrical', 'Electrical items and accessories', 3),
    ('Plumbing', 'plumbing', 'Pipes, fittings and plumbing materials', 4),
    ('Paint', 'paint', 'Paints and coatings', 5),
    ('Hardware', 'hardware', 'Hardware and tools', 6),
    ('Tiles', 'tiles', 'Tiles and flooring', 7),
    ('Sanitary', 'sanitary', 'Bathroom and sanitary ware', 8),
    ('Wood', 'wood', 'Wood and timber products', 9),
    ('Others', 'others', 'Other construction materials', 10)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- COMPLETE!
-- ============================================================================
-- Now run the seed.js script to create test users:
-- cd backend && node src/database/seed.js
-- ============================================================================
