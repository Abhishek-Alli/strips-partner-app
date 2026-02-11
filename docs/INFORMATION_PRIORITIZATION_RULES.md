# Information Prioritization Rules

## Core Principle

**Show what matters NOW. Hide what doesn't.**

Every screen must have clear information hierarchy:
- **Primary**: Always visible, critical for current task
- **Secondary**: One tap/click away, important but not immediate
- **Tertiary**: Advanced/hidden, for power users only

---

## Priority Levels

### Primary Information (Always Visible)
**Definition**: Information needed to complete the primary task RIGHT NOW.

**Rules**:
- Takes 60-70% of visual space
- Highest contrast and size
- No scrolling required on mobile
- Clear, actionable

**Examples**:
- Dashboard: Primary action card
- Search: Search input and results
- Profile: Key information (name, rating, contact)
- Enquiry: Message content and reply button

### Secondary Information (One Tap Away)
**Definition**: Important but not needed for immediate action.

**Rules**:
- Takes 20-30% of visual space
- Clearly de-emphasized
- Accessible via tabs, sections, or "View More"
- Can be below fold on mobile

**Examples**:
- Dashboard: Supporting metrics
- Profile: Detailed history
- Enquiry: Full conversation thread
- Search: Advanced filters

### Tertiary Information (Advanced/Hidden)
**Definition**: Nice-to-have, for power users, or historical data.

**Rules**:
- Hidden by default
- Behind navigation or "Advanced" toggle
- Only show on demand
- Never clutter primary view

**Examples**:
- Dashboard: Detailed analytics
- Profile: Historical data > 30 days
- Search: Saved searches history
- Reports: Export options

---

## Application by Screen Type

### Dashboards

**Primary**:
- Primary action card (60% visual weight)
- Current status/metrics (if critical)

**Secondary**:
- Supporting cards (30% visual weight)
- Recent activity (last 5-10 items)

**Tertiary**:
- Detailed analytics
- Historical data
- Advanced settings
- Export options

### Lists (Search Results, Enquiries, etc.)

**Primary**:
- Item title/name
- Key identifier (rating, status, date)
- Primary action button

**Secondary**:
- Additional details (location, category)
- Secondary actions (favorite, share)

**Tertiary**:
- Full metadata
- Historical data
- Advanced filters
- Bulk actions

### Detail Views (Profile, Enquiry, etc.)

**Primary**:
- Main content (profile info, message)
- Primary action (contact, reply)

**Secondary**:
- Supporting information (works, feedback)
- Related items

**Tertiary**:
- Full history
- Advanced options
- Export/share options

### Forms

**Primary**:
- Required fields
- Submit button

**Secondary**:
- Optional fields (below fold or collapsible)
- Help text

**Tertiary**:
- Advanced options
- Validation rules
- Field descriptions

---

## Visual Hierarchy Rules

### Size
- **Primary**: Largest text/elements (24px titles, 16px body)
- **Secondary**: Medium (18px titles, 14px body)
- **Tertiary**: Small (14px titles, 12px body)

### Contrast
- **Primary**: Highest contrast (text.primary on background.primary)
- **Secondary**: Medium contrast (text.secondary)
- **Tertiary**: Lowest contrast (text.tertiary)

### Spacing
- **Primary**: More spacing (24-32px)
- **Secondary**: Medium spacing (16px)
- **Tertiary**: Minimal spacing (8px)

### Position
- **Primary**: Top, left (reading flow)
- **Secondary**: Below primary, right side
- **Tertiary**: Bottom, hidden, or behind navigation

---

## Mobile-Specific Rules

### Above Fold (First Screen)
- **Primary information only**
- One primary action
- Key metrics (if critical)

### Below Fold (Scroll)
- **Secondary information**
- Supporting actions
- Related content

### Hidden (Navigation)
- **Tertiary information**
- Advanced features
- Settings

---

## Removal Criteria

Remove information if:
1. **Not actionable**: Information that doesn't lead to action
2. **Historical**: Data older than 30 days (unless specifically requested)
3. **Redundant**: Information shown elsewhere
4. **Noisy**: Too many similar metrics
5. **Advanced**: Only for power users (hide by default)

---

## Examples

### ❌ Bad: Information Dump
```
Dashboard shows:
- Total users: 1,250
- Total dealers: 45
- Total partners: 32
- Total enquiries: 890
- Users this week: 45
- Users this month: 120
- Users this year: 1,250
- Active users: 890
- Inactive users: 360
- Pending approvals: 5
- Recent signups: 10
- Recent logins: 50
... (20 more metrics)
```

### ✅ Good: Prioritized Information
```
Dashboard shows:
PRIMARY CARD (60%):
- Pending Approvals: 5 [Review Now]

SUPPORTING CARDS (30%):
- Total Users: 1,250
- Active Today: 890
- New This Week: 45

HIDDEN:
- Historical data (accessible via "View Reports")
- Advanced analytics (accessible via "Analytics" menu)
```

---

## Implementation Checklist

- [ ] Primary information is visually dominant (60-70%)
- [ ] Secondary information is clearly de-emphasized (20-30%)
- [ ] Tertiary information is hidden by default
- [ ] No information dumps
- [ ] Clear visual hierarchy
- [ ] Mobile-optimized (primary above fold)
- [ ] Progressive disclosure for advanced features






