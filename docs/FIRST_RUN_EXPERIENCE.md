# First-Run Experience & Onboarding

## Core Principle

**Get users to their first success moment as quickly as possible.**

Onboarding should be:
- Minimal (1-3 steps max)
- Contextual (role-specific)
- Non-blocking (can skip)
- Actionable (leads to value)

---

## Onboarding Flow

### General User

#### Step 1: Welcome (Optional)
**Screen**: Welcome message
**Content**: 
- Brief value proposition
- "Get Started" CTA
**Skip**: Yes (can dismiss)

#### Step 2: Role Selection (If not set)
**Screen**: Role selection
**Content**:
- "What are you looking for?"
- Options: Partner, Dealer, or Browse
**Skip**: No (required for personalization)

#### Step 3: First Search (Guided)
**Screen**: Search with hint
**Content**:
- Search input with placeholder: "Search for partners near you"
- Optional: Location permission request
**Skip**: No (this is the primary job)

**Success Moment**: User finds and views first partner profile

---

### Partner

#### Step 1: Welcome (Optional)
**Screen**: Welcome message
**Content**:
- "Welcome! Let's set up your profile"
- "Get Started" CTA
**Skip**: Yes

#### Step 2: Add First Work (Guided)
**Screen**: Empty state with guidance
**Content**:
- "Showcase your expertise"
- "Add Your First Work" CTA
- Brief explanation of value
**Skip**: Yes (can do later)

**Success Moment**: Partner adds first work and sees it in portfolio

---

### Dealer

#### Step 1: Welcome (Optional)
**Screen**: Welcome message
**Content**:
- "Welcome! Let's set up your catalogue"
- "Get Started" CTA
**Skip**: Yes

#### Step 2: Add First Product (Guided)
**Screen**: Empty state with guidance
**Content**:
- "Build your product catalogue"
- "Add Your First Product" CTA
- Brief explanation of value
**Skip**: Yes (can do later)

**Success Moment**: Dealer adds first product and sees it in catalogue

---

### Admin

#### Step 1: Platform Overview (Optional)
**Screen**: Quick tour
**Content**:
- Key sections overview
- "Start Managing" CTA
**Skip**: Yes

**Success Moment**: Admin approves first partner/dealer

---

## Contextual Hints

### Non-Blocking Guidance

**Rules**:
- Appear once per feature
- Dismissible
- Contextual (show when relevant)
- Not intrusive

**Implementation**:
```tsx
<ContextualHint
  id="search-hint"
  message="Search for partners by name, location, or category"
  position="below"
  dismissible={true}
/>
```

### Hint Types

1. **Feature Discovery**: "You can save partners to favorites"
2. **Action Guidance**: "Click here to respond to enquiries"
3. **Value Explanation**: "Adding works helps clients find you"

### Display Rules

- Show only once per user per feature
- Show when feature is first accessed
- Dismissible with "Got it" button
- Store dismissal in user preferences

---

## Empty State Strategy

### New User Empty States

**General User**:
- Dashboard: "Start by searching for partners"
- Search: "Enter a location or name to search"
- Enquiries: "No enquiries yet. Search and send your first enquiry."

**Partner**:
- Dashboard: "Add your first work to get started"
- Works: "Showcase your expertise by adding works"
- Enquiries: "Enquiries will appear here once clients contact you"

**Dealer**:
- Dashboard: "Add your first product to get started"
- Products: "Build your catalogue by adding products"
- Enquiries: "Enquiries will appear here once customers contact you"

### Empty State Components

All empty states must include:
- Friendly icon/illustration
- Clear title
- Helpful description
- Primary action CTA
- No blame language

---

## Progressive Disclosure

### First Visit
- Show only essential features
- Hide advanced options
- Focus on primary job

### After First Success
- Reveal secondary features
- Show supporting actions
- Introduce advanced options

### Power Users
- Full feature access
- Advanced settings
- All options visible

---

## Onboarding Metrics

### Success Metrics
- Time to first success moment
- Onboarding completion rate
- Feature discovery rate
- User retention (day 1, day 7)

### Optimization Targets
- First success: < 2 minutes
- Onboarding completion: > 80%
- Feature discovery: > 60%
- Day 1 retention: > 50%

---

## Implementation Checklist

- [ ] Welcome screen (optional, dismissible)
- [ ] Role-specific guidance
- [ ] First action guidance
- [ ] Empty states for all major screens
- [ ] Contextual hints (non-blocking)
- [ ] Progressive disclosure
- [ ] Success moment tracking

---

## Examples

### ❌ Bad: Overwhelming Onboarding
```
Step 1: Welcome (can't skip)
Step 2: Tour of all features (5 screens)
Step 3: Permissions (all at once)
Step 4: Profile setup (required)
Step 5: Preferences (required)
... (10 more steps)
```

### ✅ Good: Minimal Onboarding
```
Step 1: Welcome (can skip) → "Get Started"
Step 2: First action (guided) → "Search for partners"
Success: User views first profile
```

---

## Long-Term Quality

### Principles
1. **Minimal**: As few steps as possible
2. **Contextual**: Role-specific guidance
3. **Non-Blocking**: Can skip or dismiss
4. **Actionable**: Leads to immediate value

### Maintenance
- Review onboarding flow quarterly
- A/B test different approaches
- Measure success metrics
- Optimize based on data






