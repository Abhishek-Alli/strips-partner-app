-- ============================================================================
-- SHREE OM PLATFORM - ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
-- Run this AFTER the main schema has been created
-- This file enables RLS and creates policies for role-based access
-- Safe to re-run: drops existing policies before creating new ones
-- ============================================================================

-- ============================================================================
-- HELPER FUNCTIONS FOR RLS (in PUBLIC schema)
-- ============================================================================

-- Function to get current user's role from JWT
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN COALESCE(
    current_setting('request.jwt.claims', true)::json->>'role',
    'GENERAL_USER'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current user's ID from JWT
CREATE OR REPLACE FUNCTION public.get_user_id()
RETURNS UUID AS $$
BEGIN
  RETURN COALESCE(
    (current_setting('request.jwt.claims', true)::json->>'sub')::uuid,
    (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.get_user_role() = 'ADMIN';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if current user is dealer
CREATE OR REPLACE FUNCTION public.is_dealer()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.get_user_role() = 'DEALER';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if current user is partner
CREATE OR REPLACE FUNCTION public.is_partner()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.get_user_role() = 'PARTNER';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================

-- Core tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_enquiries ENABLE ROW LEVEL SECURITY;

-- Product tables
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_products ENABLE ROW LEVEL SECURITY;

-- Order & Payment tables
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Enquiry tables
ALTER TABLE general_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_enquiries ENABLE ROW LEVEL SECURITY;

-- Feedback tables
ALTER TABLE dealer_feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Admin portal tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_works ENABLE ROW LEVEL SECURITY;
ALTER TABLE steel_market_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_lectures ENABLE ROW LEVEL SECURITY;
ALTER TABLE trading_advices ENABLE ROW LEVEL SECURITY;
ALTER TABLE upcoming_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE education_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE visualization_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE shortcuts_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealership_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;

-- Notification tables
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;

-- Messaging tables
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- File & Activity tables
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Other tables
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cost_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USERS TABLE POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "admin_all_users" ON users;
CREATE POLICY "admin_all_users" ON users
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "users_read_own" ON users;
CREATE POLICY "users_read_own" ON users
  FOR SELECT
  TO authenticated
  USING (id = public.get_user_id());

DROP POLICY IF EXISTS "users_update_own" ON users;
CREATE POLICY "users_update_own" ON users
  FOR UPDATE
  TO authenticated
  USING (id = public.get_user_id())
  WITH CHECK (id = public.get_user_id() AND role = (SELECT role FROM users WHERE id = public.get_user_id()));

DROP POLICY IF EXISTS "public_read_dealers_partners" ON users;
CREATE POLICY "public_read_dealers_partners" ON users
  FOR SELECT
  TO authenticated
  USING (role IN ('DEALER', 'PARTNER') AND is_active = true);

-- ============================================================================
-- PROFILES TABLE POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "admin_all_profiles" ON profiles;
CREATE POLICY "admin_all_profiles" ON profiles
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "users_own_profile" ON profiles;
CREATE POLICY "users_own_profile" ON profiles
  FOR ALL
  TO authenticated
  USING (user_id = public.get_user_id())
  WITH CHECK (user_id = public.get_user_id());

DROP POLICY IF EXISTS "public_read_business_profiles" ON profiles;
CREATE POLICY "public_read_business_profiles" ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = profiles.user_id
      AND users.role IN ('DEALER', 'PARTNER')
      AND users.is_active = true
    )
  );

-- ============================================================================
-- OTP TABLE POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "service_all_otps" ON otps;
CREATE POLICY "service_all_otps" ON otps
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- PRODUCT CATEGORIES POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "public_read_categories" ON product_categories;
CREATE POLICY "public_read_categories" ON product_categories
  FOR SELECT
  TO authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "admin_all_categories" ON product_categories;
CREATE POLICY "admin_all_categories" ON product_categories
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- MASTER PRODUCTS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "public_read_products" ON master_products;
CREATE POLICY "public_read_products" ON master_products
  FOR SELECT
  TO authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "admin_all_products" ON master_products;
CREATE POLICY "admin_all_products" ON master_products
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- DEALER PRODUCTS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "public_read_dealer_products" ON dealer_products;
CREATE POLICY "public_read_dealer_products" ON dealer_products
  FOR SELECT
  TO authenticated
  USING (status = 'active');

DROP POLICY IF EXISTS "dealers_own_products" ON dealer_products;
CREATE POLICY "dealers_own_products" ON dealer_products
  FOR ALL
  TO authenticated
  USING (public.is_dealer() AND dealer_id = public.get_user_id())
  WITH CHECK (public.is_dealer() AND dealer_id = public.get_user_id());

DROP POLICY IF EXISTS "admin_all_dealer_products" ON dealer_products;
CREATE POLICY "admin_all_dealer_products" ON dealer_products
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- ORDERS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "users_read_own_orders" ON orders;
CREATE POLICY "users_read_own_orders" ON orders
  FOR SELECT
  TO authenticated
  USING (user_id = public.get_user_id());

DROP POLICY IF EXISTS "dealers_read_assigned_orders" ON orders;
CREATE POLICY "dealers_read_assigned_orders" ON orders
  FOR SELECT
  TO authenticated
  USING (public.is_dealer() AND dealer_id = public.get_user_id());

DROP POLICY IF EXISTS "partners_read_assigned_orders" ON orders;
CREATE POLICY "partners_read_assigned_orders" ON orders
  FOR SELECT
  TO authenticated
  USING (public.is_partner() AND partner_id = public.get_user_id());

DROP POLICY IF EXISTS "dealers_update_orders" ON orders;
CREATE POLICY "dealers_update_orders" ON orders
  FOR UPDATE
  TO authenticated
  USING (public.is_dealer() AND dealer_id = public.get_user_id())
  WITH CHECK (public.is_dealer() AND dealer_id = public.get_user_id());

DROP POLICY IF EXISTS "admin_all_orders" ON orders;
CREATE POLICY "admin_all_orders" ON orders
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "users_create_orders" ON orders;
CREATE POLICY "users_create_orders" ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = public.get_user_id());

-- ============================================================================
-- ORDER ITEMS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "users_read_order_items" ON order_items;
CREATE POLICY "users_read_order_items" ON order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = public.get_user_id())
  );

DROP POLICY IF EXISTS "admin_all_order_items" ON order_items;
CREATE POLICY "admin_all_order_items" ON order_items
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- PAYMENTS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "users_read_own_payments" ON payments;
CREATE POLICY "users_read_own_payments" ON payments
  FOR SELECT
  TO authenticated
  USING (user_id = public.get_user_id());

DROP POLICY IF EXISTS "admin_all_payments" ON payments;
CREATE POLICY "admin_all_payments" ON payments
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- TRANSACTIONS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "users_read_own_transactions" ON transactions;
CREATE POLICY "users_read_own_transactions" ON transactions
  FOR SELECT
  TO authenticated
  USING (user_id = public.get_user_id());

DROP POLICY IF EXISTS "admin_all_transactions" ON transactions;
CREATE POLICY "admin_all_transactions" ON transactions
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- GENERAL ENQUIRIES POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "users_own_general_enquiries" ON general_enquiries;
CREATE POLICY "users_own_general_enquiries" ON general_enquiries
  FOR ALL
  TO authenticated
  USING (user_id = public.get_user_id() OR user_id IS NULL)
  WITH CHECK (user_id = public.get_user_id() OR user_id IS NULL);

DROP POLICY IF EXISTS "public_create_enquiries" ON general_enquiries;
CREATE POLICY "public_create_enquiries" ON general_enquiries
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

DROP POLICY IF EXISTS "admin_all_general_enquiries" ON general_enquiries;
CREATE POLICY "admin_all_general_enquiries" ON general_enquiries
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- DEALER ENQUIRIES POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "users_own_dealer_enquiries" ON dealer_enquiries;
CREATE POLICY "users_own_dealer_enquiries" ON dealer_enquiries
  FOR SELECT
  TO authenticated
  USING (user_id = public.get_user_id());

DROP POLICY IF EXISTS "users_create_dealer_enquiries" ON dealer_enquiries;
CREATE POLICY "users_create_dealer_enquiries" ON dealer_enquiries
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = public.get_user_id());

DROP POLICY IF EXISTS "dealers_own_enquiries" ON dealer_enquiries;
CREATE POLICY "dealers_own_enquiries" ON dealer_enquiries
  FOR ALL
  TO authenticated
  USING (public.is_dealer() AND dealer_id = public.get_user_id())
  WITH CHECK (public.is_dealer() AND dealer_id = public.get_user_id());

DROP POLICY IF EXISTS "admin_all_dealer_enquiries" ON dealer_enquiries;
CREATE POLICY "admin_all_dealer_enquiries" ON dealer_enquiries
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- PARTNER ENQUIRIES POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "users_own_partner_enquiries" ON partner_enquiries;
CREATE POLICY "users_own_partner_enquiries" ON partner_enquiries
  FOR SELECT
  TO authenticated
  USING (user_id = public.get_user_id());

DROP POLICY IF EXISTS "users_create_partner_enquiries" ON partner_enquiries;
CREATE POLICY "users_create_partner_enquiries" ON partner_enquiries
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = public.get_user_id());

DROP POLICY IF EXISTS "partners_own_enquiries" ON partner_enquiries;
CREATE POLICY "partners_own_enquiries" ON partner_enquiries
  FOR ALL
  TO authenticated
  USING (public.is_partner() AND partner_id = public.get_user_id())
  WITH CHECK (public.is_partner() AND partner_id = public.get_user_id());

DROP POLICY IF EXISTS "admin_all_partner_enquiries" ON partner_enquiries;
CREATE POLICY "admin_all_partner_enquiries" ON partner_enquiries
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- DEALER FEEDBACKS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "public_read_dealer_feedbacks" ON dealer_feedbacks;
CREATE POLICY "public_read_dealer_feedbacks" ON dealer_feedbacks
  FOR SELECT
  TO authenticated
  USING (is_reported = false);

DROP POLICY IF EXISTS "users_create_dealer_feedback" ON dealer_feedbacks;
CREATE POLICY "users_create_dealer_feedback" ON dealer_feedbacks
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = public.get_user_id());

DROP POLICY IF EXISTS "users_update_own_feedback" ON dealer_feedbacks;
CREATE POLICY "users_update_own_feedback" ON dealer_feedbacks
  FOR UPDATE
  TO authenticated
  USING (user_id = public.get_user_id())
  WITH CHECK (user_id = public.get_user_id());

DROP POLICY IF EXISTS "admin_all_dealer_feedbacks" ON dealer_feedbacks;
CREATE POLICY "admin_all_dealer_feedbacks" ON dealer_feedbacks
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "dealers_read_own_feedbacks" ON dealer_feedbacks;
CREATE POLICY "dealers_read_own_feedbacks" ON dealer_feedbacks
  FOR SELECT
  TO authenticated
  USING (public.is_dealer() AND dealer_id = public.get_user_id());

-- ============================================================================
-- PARTNER FEEDBACKS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "public_read_partner_feedbacks" ON partner_feedbacks;
CREATE POLICY "public_read_partner_feedbacks" ON partner_feedbacks
  FOR SELECT
  TO authenticated
  USING (is_approved = true AND is_reported = false);

DROP POLICY IF EXISTS "users_create_partner_feedback" ON partner_feedbacks;
CREATE POLICY "users_create_partner_feedback" ON partner_feedbacks
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = public.get_user_id());

DROP POLICY IF EXISTS "partners_own_feedbacks" ON partner_feedbacks;
CREATE POLICY "partners_own_feedbacks" ON partner_feedbacks
  FOR ALL
  TO authenticated
  USING (public.is_partner() AND partner_id = public.get_user_id())
  WITH CHECK (public.is_partner() AND partner_id = public.get_user_id());

DROP POLICY IF EXISTS "admin_all_partner_feedbacks" ON partner_feedbacks;
CREATE POLICY "admin_all_partner_feedbacks" ON partner_feedbacks
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- PRODUCT REVIEWS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "public_read_reviews" ON product_reviews;
CREATE POLICY "public_read_reviews" ON product_reviews
  FOR SELECT
  TO authenticated
  USING (is_approved = true AND is_reported = false);

DROP POLICY IF EXISTS "users_create_reviews" ON product_reviews;
CREATE POLICY "users_create_reviews" ON product_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = public.get_user_id());

DROP POLICY IF EXISTS "users_update_own_reviews" ON product_reviews;
CREATE POLICY "users_update_own_reviews" ON product_reviews
  FOR UPDATE
  TO authenticated
  USING (user_id = public.get_user_id())
  WITH CHECK (user_id = public.get_user_id());

DROP POLICY IF EXISTS "admin_all_reviews" ON product_reviews;
CREATE POLICY "admin_all_reviews" ON product_reviews
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- EVENTS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "public_read_events" ON events;
CREATE POLICY "public_read_events" ON events
  FOR SELECT
  TO authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "admin_all_events" ON events;
CREATE POLICY "admin_all_events" ON events
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- EVENT INVITES POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "users_read_own_invites" ON event_invites;
CREATE POLICY "users_read_own_invites" ON event_invites
  FOR SELECT
  TO authenticated
  USING (user_id = public.get_user_id());

DROP POLICY IF EXISTS "users_respond_invites" ON event_invites;
CREATE POLICY "users_respond_invites" ON event_invites
  FOR UPDATE
  TO authenticated
  USING (user_id = public.get_user_id())
  WITH CHECK (user_id = public.get_user_id());

DROP POLICY IF EXISTS "admin_all_event_invites" ON event_invites;
CREATE POLICY "admin_all_event_invites" ON event_invites
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- PARTNER WORKS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "public_read_partner_works" ON partner_works;
CREATE POLICY "public_read_partner_works" ON partner_works
  FOR SELECT
  TO authenticated
  USING (is_approved = true AND is_active = true);

DROP POLICY IF EXISTS "partners_own_works" ON partner_works;
CREATE POLICY "partners_own_works" ON partner_works
  FOR ALL
  TO authenticated
  USING (public.is_partner() AND partner_id = public.get_user_id())
  WITH CHECK (public.is_partner() AND partner_id = public.get_user_id());

DROP POLICY IF EXISTS "admin_all_partner_works" ON partner_works;
CREATE POLICY "admin_all_partner_works" ON partner_works
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- CMS CONTENT POLICIES (Steel Market, Lectures, Trading, Projects, Tenders, Education)
-- ============================================================================

-- Steel Market Updates
DROP POLICY IF EXISTS "public_read_steel_updates" ON steel_market_updates;
CREATE POLICY "public_read_steel_updates" ON steel_market_updates
  FOR SELECT
  TO authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "admin_all_steel_updates" ON steel_market_updates;
CREATE POLICY "admin_all_steel_updates" ON steel_market_updates
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Guest Lectures
DROP POLICY IF EXISTS "public_read_lectures" ON guest_lectures;
CREATE POLICY "public_read_lectures" ON guest_lectures
  FOR SELECT
  TO authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "admin_all_lectures" ON guest_lectures;
CREATE POLICY "admin_all_lectures" ON guest_lectures
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Trading Advices
DROP POLICY IF EXISTS "read_trading_advices" ON trading_advices;
CREATE POLICY "read_trading_advices" ON trading_advices
  FOR SELECT
  TO authenticated
  USING (
    is_active = true AND (
      public.is_admin() OR
      (public.is_dealer() AND visible_to_dealers = true) OR
      (public.is_partner() AND visible_to_partners = true)
    )
  );

DROP POLICY IF EXISTS "admin_all_trading_advices" ON trading_advices;
CREATE POLICY "admin_all_trading_advices" ON trading_advices
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Upcoming Projects
DROP POLICY IF EXISTS "public_read_projects" ON upcoming_projects;
CREATE POLICY "public_read_projects" ON upcoming_projects
  FOR SELECT
  TO authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "admin_all_projects" ON upcoming_projects;
CREATE POLICY "admin_all_projects" ON upcoming_projects
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Tenders
DROP POLICY IF EXISTS "public_read_tenders" ON tenders;
CREATE POLICY "public_read_tenders" ON tenders
  FOR SELECT
  TO authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "admin_all_tenders" ON tenders;
CREATE POLICY "admin_all_tenders" ON tenders
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Education Posts
DROP POLICY IF EXISTS "public_read_education" ON education_posts;
CREATE POLICY "public_read_education" ON education_posts
  FOR SELECT
  TO authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "admin_all_education" ON education_posts;
CREATE POLICY "admin_all_education" ON education_posts
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- QUIZZES POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "public_read_quizzes" ON quizzes;
CREATE POLICY "public_read_quizzes" ON quizzes
  FOR SELECT
  TO authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "admin_all_quizzes" ON quizzes;
CREATE POLICY "admin_all_quizzes" ON quizzes
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Quiz Attempts
DROP POLICY IF EXISTS "users_own_attempts" ON quiz_attempts;
CREATE POLICY "users_own_attempts" ON quiz_attempts
  FOR ALL
  TO authenticated
  USING (user_id = public.get_user_id())
  WITH CHECK (user_id = public.get_user_id());

DROP POLICY IF EXISTS "admin_read_all_attempts" ON quiz_attempts;
CREATE POLICY "admin_read_all_attempts" ON quiz_attempts
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- ============================================================================
-- ADMIN NOTES POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "admin_all_notes" ON admin_notes;
CREATE POLICY "admin_all_notes" ON admin_notes
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "dealers_read_visible_notes" ON admin_notes;
CREATE POLICY "dealers_read_visible_notes" ON admin_notes
  FOR SELECT
  TO authenticated
  USING (public.is_dealer() AND visible_to_dealers = true);

DROP POLICY IF EXISTS "partners_read_visible_notes" ON admin_notes;
CREATE POLICY "partners_read_visible_notes" ON admin_notes
  FOR SELECT
  TO authenticated
  USING (public.is_partner() AND visible_to_partners = true);

-- ============================================================================
-- OFFERS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "public_read_offers" ON offers;
CREATE POLICY "public_read_offers" ON offers
  FOR SELECT
  TO authenticated
  USING (
    is_active = true AND (
      applicable_to = 'both' OR
      (public.is_dealer() AND applicable_to = 'dealers') OR
      (public.is_partner() AND applicable_to = 'partners')
    )
  );

DROP POLICY IF EXISTS "admin_all_offers" ON offers;
CREATE POLICY "admin_all_offers" ON offers
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Dealer Offers (likes)
DROP POLICY IF EXISTS "dealers_own_offer_likes" ON dealer_offers;
CREATE POLICY "dealers_own_offer_likes" ON dealer_offers
  FOR ALL
  TO authenticated
  USING (public.is_dealer() AND dealer_id = public.get_user_id())
  WITH CHECK (public.is_dealer() AND dealer_id = public.get_user_id());

-- ============================================================================
-- CHECKLISTS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "public_read_checklists" ON checklists;
CREATE POLICY "public_read_checklists" ON checklists
  FOR SELECT
  TO authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "admin_all_checklists" ON checklists;
CREATE POLICY "admin_all_checklists" ON checklists
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- VISUALIZATION REQUESTS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "users_own_viz_requests" ON visualization_requests;
CREATE POLICY "users_own_viz_requests" ON visualization_requests
  FOR ALL
  TO authenticated
  USING (user_id = public.get_user_id())
  WITH CHECK (user_id = public.get_user_id());

DROP POLICY IF EXISTS "admin_all_viz_requests" ON visualization_requests;
CREATE POLICY "admin_all_viz_requests" ON visualization_requests
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- SHORTCUTS & LINKS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "public_read_shortcuts" ON shortcuts_links;
CREATE POLICY "public_read_shortcuts" ON shortcuts_links
  FOR SELECT
  TO authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "admin_all_shortcuts" ON shortcuts_links;
CREATE POLICY "admin_all_shortcuts" ON shortcuts_links
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- VIDEOS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "public_read_videos" ON videos;
CREATE POLICY "public_read_videos" ON videos
  FOR SELECT
  TO authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "admin_all_videos" ON videos;
CREATE POLICY "admin_all_videos" ON videos
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- DEALERSHIP APPLICATIONS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "users_own_applications" ON dealership_applications;
CREATE POLICY "users_own_applications" ON dealership_applications
  FOR ALL
  TO authenticated
  USING (user_id = public.get_user_id())
  WITH CHECK (user_id = public.get_user_id());

DROP POLICY IF EXISTS "admin_all_applications" ON dealership_applications;
CREATE POLICY "admin_all_applications" ON dealership_applications
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- LOYALTY POINTS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "users_read_own_points" ON loyalty_points;
CREATE POLICY "users_read_own_points" ON loyalty_points
  FOR SELECT
  TO authenticated
  USING (user_id = public.get_user_id());

DROP POLICY IF EXISTS "admin_all_loyalty_points" ON loyalty_points;
CREATE POLICY "admin_all_loyalty_points" ON loyalty_points
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- NOTIFICATION POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "admin_all_templates" ON notification_templates;
CREATE POLICY "admin_all_templates" ON notification_templates
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "users_own_notifications" ON notifications;
CREATE POLICY "users_own_notifications" ON notifications
  FOR ALL
  TO authenticated
  USING (user_id = public.get_user_id())
  WITH CHECK (user_id = public.get_user_id());

DROP POLICY IF EXISTS "admin_all_notifications" ON notifications;
CREATE POLICY "admin_all_notifications" ON notifications
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "users_own_push_tokens" ON push_tokens;
CREATE POLICY "users_own_push_tokens" ON push_tokens
  FOR ALL
  TO authenticated
  USING (user_id = public.get_user_id())
  WITH CHECK (user_id = public.get_user_id());

-- ============================================================================
-- MESSAGING POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "users_own_conversations" ON conversations;
CREATE POLICY "users_own_conversations" ON conversations
  FOR ALL
  TO authenticated
  USING (participant1_id = public.get_user_id() OR participant2_id = public.get_user_id())
  WITH CHECK (participant1_id = public.get_user_id() OR participant2_id = public.get_user_id());

DROP POLICY IF EXISTS "users_conversation_messages" ON messages;
CREATE POLICY "users_conversation_messages" ON messages
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND (conversations.participant1_id = public.get_user_id() OR conversations.participant2_id = public.get_user_id())
    )
  )
  WITH CHECK (sender_id = public.get_user_id());

-- ============================================================================
-- FILES POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "users_own_files" ON files;
CREATE POLICY "users_own_files" ON files
  FOR ALL
  TO authenticated
  USING (user_id = public.get_user_id())
  WITH CHECK (user_id = public.get_user_id());

DROP POLICY IF EXISTS "public_read_public_files" ON files;
CREATE POLICY "public_read_public_files" ON files
  FOR SELECT
  TO authenticated
  USING (is_public = true);

DROP POLICY IF EXISTS "admin_all_files" ON files;
CREATE POLICY "admin_all_files" ON files
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- ACTIVITY & AUDIT LOGS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "users_own_activity" ON activity_logs;
CREATE POLICY "users_own_activity" ON activity_logs
  FOR SELECT
  TO authenticated
  USING (user_id = public.get_user_id());

DROP POLICY IF EXISTS "admin_all_activity" ON activity_logs;
CREATE POLICY "admin_all_activity" ON activity_logs
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin_all_audit_logs" ON admin_audit_logs;
CREATE POLICY "admin_all_audit_logs" ON admin_audit_logs
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- FAVORITES POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "users_own_favorites" ON favorites;
CREATE POLICY "users_own_favorites" ON favorites
  FOR ALL
  TO authenticated
  USING (user_id = public.get_user_id())
  WITH CHECK (user_id = public.get_user_id());

-- ============================================================================
-- REFERRALS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "users_own_referrals" ON referrals;
CREATE POLICY "users_own_referrals" ON referrals
  FOR SELECT
  TO authenticated
  USING (referrer_id = public.get_user_id() OR referred_id = public.get_user_id());

DROP POLICY IF EXISTS "admin_all_referrals" ON referrals;
CREATE POLICY "admin_all_referrals" ON referrals
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- LOYALTY TRANSACTIONS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "users_own_loyalty_transactions" ON loyalty_transactions;
CREATE POLICY "users_own_loyalty_transactions" ON loyalty_transactions
  FOR SELECT
  TO authenticated
  USING (user_id = public.get_user_id());

DROP POLICY IF EXISTS "admin_all_loyalty_transactions" ON loyalty_transactions;
CREATE POLICY "admin_all_loyalty_transactions" ON loyalty_transactions
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- CONFIGURATION POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "public_read_cost_config" ON cost_configurations;
CREATE POLICY "public_read_cost_config" ON cost_configurations
  FOR SELECT
  TO authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "admin_all_cost_config" ON cost_configurations;
CREATE POLICY "admin_all_cost_config" ON cost_configurations
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- ANALYTICS POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "admin_all_analytics" ON analytics_events;
CREATE POLICY "admin_all_analytics" ON analytics_events
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "users_log_analytics" ON analytics_events;
CREATE POLICY "users_log_analytics" ON analytics_events
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = public.get_user_id() OR user_id IS NULL);

DROP POLICY IF EXISTS "admin_all_daily_stats" ON daily_stats;
CREATE POLICY "admin_all_daily_stats" ON daily_stats
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "users_own_search_history" ON search_history;
CREATE POLICY "users_own_search_history" ON search_history
  FOR ALL
  TO authenticated
  USING (user_id = public.get_user_id())
  WITH CHECK (user_id = public.get_user_id());

-- ============================================================================
-- CONTACT ENQUIRIES POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "public_create_contact" ON contact_enquiries;
CREATE POLICY "public_create_contact" ON contact_enquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_all_contact" ON contact_enquiries;
CREATE POLICY "admin_all_contact" ON contact_enquiries
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- END OF RLS POLICIES
-- ============================================================================
