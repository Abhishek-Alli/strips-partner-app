# Intent-Driven Dashboard Structure

## Design Philosophy

Every dashboard must answer: **"What should the user do RIGHT NOW?"**

Dashboards are NOT data dumps. They are action centers.

---

## General User Dashboard

### Primary Card (60% visual weight)
**Search Prompt**
- Large, clear search input
- Two options: "Search Partners" or "Search Dealers"
- Visual distinction between the two
- Recent search suggestions (if available)

**Why**: Finding partners/dealers is the primary job. Everything else is secondary.

### Supporting Cards (30% visual weight)
1. **Pending Enquiries** (if any)
   - Count badge
   - "View Responses" CTA
   - Only show if > 0

2. **Recent Searches** (if any)
   - Last 3 searches
   - Quick re-search action
   - Only show if user has history

3. **Favorites** (if any)
   - Count badge
   - "View Favorites" CTA
   - Only show if > 0

### Hidden by Default
- Detailed analytics
- Historical search data
- Advanced filters
- Account settings
- All tools (behind navigation)

### Empty State (New User)
- Friendly welcome message
- Clear "Get Started" CTA pointing to search
- Brief explanation: "Find trusted construction partners near you"

---

## Partner Dashboard

### Primary Card (60% visual weight)
**New Enquiries** (if any)
- Count badge (prominent)
- List of new enquiries (max 3)
- "Respond" CTA for each
- Time since enquiry received

**OR** (if no new enquiries)

**Add Work**
- "Showcase your best work" message
- "Add Work" primary CTA
- Brief explanation of value

**Why**: Enquiries = revenue. Works = credibility. Both drive business.

### Supporting Cards (30% visual weight)
1. **Response Rate**
   - Percentage with trend
   - "View All Enquiries" link
   - Only show if > 0 enquiries

2. **Recent Works** (if any)
   - Last 3 works with thumbnails
   - "Add More" CTA
   - Only show if works exist

3. **Feedback Summary**
   - Average rating
   - Recent feedback count
   - "View All" link

### Hidden by Default
- Detailed analytics (show on demand)
- Historical enquiry data
- Advanced portfolio management
- Account settings
- All tools (behind navigation)

### Empty State (New Partner)
- "Welcome! Start by adding your first work"
- "Add Work" primary CTA
- Brief explanation: "Showcase your expertise to attract clients"

---

## Dealer Dashboard

### Primary Card (60% visual weight)
**New Enquiries** (if any)
- Count badge (prominent)
- List of new enquiries (max 3)
- "Respond" CTA for each
- Product mentioned in enquiry

**OR** (if no new enquiries)

**Add Product**
- "Expand your catalogue" message
- "Add Product" primary CTA
- Brief explanation of value

**Why**: Enquiries = sales. Products = inventory. Both drive revenue.

### Supporting Cards (30% visual weight)
1. **Product Catalogue**
   - Total products count
   - "Manage Products" CTA
   - Only show if > 0 products

2. **Enquiry Conversion**
   - Conversion rate percentage
   - "View All Enquiries" link
   - Only show if > 0 enquiries

3. **Recent Feedback**
   - Average rating
   - Feedback count
   - "View All" link

### Hidden by Default
- Detailed analytics (show on demand)
- Historical sales data
- Advanced product management
- Account settings
- All tools (behind navigation)

### Empty State (New Dealer)
- "Welcome! Start by adding your first product"
- "Add Product" primary CTA
- Brief explanation: "Showcase your products to attract customers"

---

## Admin Dashboard

### Primary Card (60% visual weight)
**Pending Actions** (if any)
- Count badge (prominent)
- List of pending items:
  - Pending partner applications
  - Pending dealer applications
  - Open reports
  - Flagged content
- "Review" CTA for each category

**OR** (if no pending actions)

**Platform Health**
- Key metrics at a glance
- "All Systems Operational" status
- "View Details" link

**Why**: Admin's job is to maintain quality. Pending actions = immediate priorities.

### Supporting Cards (30% visual weight)
1. **Platform KPIs**
   - Total users, partners, dealers
   - Active users today
   - Enquiry volume
   - Only show top 4 metrics

2. **Recent Activity**
   - Last 5 significant events
   - User signups, approvals, reports
   - "View All" link

3. **Quick Actions**
   - "Manage Users"
   - "Manage Content"
   - "View Reports"
   - Links to key sections

### Hidden by Default
- Detailed analytics (show on demand)
- Historical data
- Advanced configuration
- System logs
- All management screens (behind navigation)

### Empty State (Healthy Platform)
- "All systems operational"
- "No pending actions"
- Brief status summary

---

## Dashboard Design Rules

### Visual Hierarchy
1. **Primary Card**: 60% visual weight, top position, clear CTA
2. **Supporting Cards**: 30% visual weight, secondary position
3. **Tertiary Info**: Hidden, accessible via navigation

### Content Rules
- **Show**: What needs action NOW
- **Hide**: Historical data, advanced features, configuration
- **Conditional**: Only show if relevant (e.g., "Pending Enquiries" only if > 0)

### CTA Rules
- **One Primary CTA** per dashboard
- **Secondary CTAs** are clearly de-emphasized
- **Tertiary Actions** are in navigation, not on dashboard

### Empty State Rules
- **Friendly**: Human language, no blame
- **Actionable**: Clear next step
- **Visual**: Icon or illustration
- **Contextual**: Role-specific guidance

### Loading States
- **Skeleton Loaders**: Show structure, not spinners
- **Progressive Loading**: Load primary card first
- **Graceful Degradation**: Show partial data if possible

---

## Implementation Checklist

- [ ] Primary card is visually dominant (60% weight)
- [ ] Only ONE primary CTA per dashboard
- [ ] Supporting cards are clearly secondary (30% weight)
- [ ] Empty states are friendly and actionable
- [ ] Conditional content only shows when relevant
- [ ] No feature dumping
- [ ] Clear visual hierarchy
- [ ] Mobile-optimized layout






