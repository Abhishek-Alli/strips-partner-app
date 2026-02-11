# Trust & Credibility Micro-Patterns

## Core Principle

**Trust is built through clarity, not promotion.**

Every trust signal must feel:
- Calm
- Non-promotional
- Factual
- Subtle

---

## Trust Signals

### 1. Verification Badges

**Purpose**: Indicate verified/approved status

**Design Rules**:
- Small, subtle badge
- Icon + text (optional)
- Color: Success green or Primary blue
- Position: Next to name/title

**Implementation**:
```tsx
// Verified Partner/Dealer Badge
<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
  <Text>Partner Name</Text>
  <VerifiedBadge verified={true} />
</Box>
```

**States**:
- Verified: Green checkmark
- Pending: Grey clock icon
- Rejected: Hidden (don't show negative)

### 2. Response Time Indicators

**Purpose**: Set expectations for response time

**Design Rules**:
- Small text, secondary color
- Factual language ("Typically responds within 2 hours")
- Not promotional ("Fast response!" ❌)

**Implementation**:
```tsx
<ResponseTimeIndicator 
  averageHours={2}
  format="human" // "Typically responds within 2 hours"
/>
```

**Display Rules**:
- Only show if data available
- Use "Typically" not "Always"
- Show actual average, not marketing copy

### 3. Activity Timestamps

**Purpose**: Show recency and activity

**Design Rules**:
- Human-friendly format ("2 hours ago", "Yesterday")
- Secondary color
- Small text size
- Not intrusive

**Implementation**:
```tsx
<ActivityTimestamp 
  date={enquiry.createdAt}
  format="relative" // "2 hours ago"
/>
```

**Rules**:
- Relative time for recent (< 7 days)
- Absolute date for older
- Never show raw timestamps

### 4. Status Clarity

**Purpose**: Clear status communication

**Design Rules**:
- Color-coded status
- Clear label
- Icon (optional)
- Consistent across platform

**Status Types**:
- **Pending**: Yellow/amber, "Pending"
- **Approved**: Green, "Verified"
- **Rejected**: Red (only if user needs to know)
- **Active**: Green, "Active"
- **Inactive**: Grey, "Inactive"

**Implementation**:
```tsx
<StatusBadge 
  status="approved"
  variant="subtle" // Not promotional
/>
```

### 5. Human-Friendly System Messages

**Purpose**: Replace technical errors with friendly messages

**Design Rules**:
- No technical jargon
- No blame language
- Actionable guidance
- Calm tone

**Examples**:

❌ **Bad**:
- "Error 500: Database connection failed"
- "Invalid input"
- "You don't have permission"

✅ **Good**:
- "We're having trouble loading this. Please try again in a moment."
- "Please check your information and try again."
- "This action requires additional permissions. Contact support if you need access."

**Implementation**:
```tsx
<ErrorMessage 
  error={error}
  format="friendly" // Converts technical to human
/>
```

---

## Credibility Indicators

### 1. Rating Display

**Purpose**: Show quality without promotion

**Design Rules**:
- Show rating + count ("4.5 (120 reviews)")
- Not just stars
- Secondary position
- Factual, not promotional

**Implementation**:
```tsx
<RatingDisplay 
  rating={4.5}
  count={120}
  showCount={true}
/>
```

### 2. Review Count

**Purpose**: Indicate popularity/trust

**Design Rules**:
- Show count, not just "Popular"
- Secondary color
- Small text
- Not promotional

**Implementation**:
```tsx
<ReviewCount count={120} /> // "120 reviews"
```

### 3. Completion Rate

**Purpose**: Show reliability (for Partners/Dealers)

**Design Rules**:
- Show percentage + context
- Only if meaningful (> 10 projects)
- Not promotional

**Implementation**:
```tsx
<CompletionRate 
  completed={45}
  total={50}
  format="percentage" // "90% completion rate"
/>
```

### 4. Response Rate

**Purpose**: Show engagement

**Design Rules**:
- Show percentage + count
- Only if meaningful (> 5 enquiries)
- Factual, not promotional

**Implementation**:
```tsx
<ResponseRate 
  responded={40}
  total={50}
  format="percentage" // "80% response rate"
/>
```

---

## Trust Pattern Components

### VerifiedBadge
```tsx
interface VerifiedBadgeProps {
  verified: boolean;
  pending?: boolean;
  size?: 'sm' | 'md';
}

// Shows: ✓ Verified (green) or ⏱ Pending (grey)
```

### ResponseTimeIndicator
```tsx
interface ResponseTimeIndicatorProps {
  averageHours: number;
  format?: 'human' | 'exact';
}

// Shows: "Typically responds within 2 hours"
```

### ActivityTimestamp
```tsx
interface ActivityTimestampProps {
  date: Date;
  format?: 'relative' | 'absolute';
}

// Shows: "2 hours ago" or "Jan 15, 2024"
```

### StatusBadge
```tsx
interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'inactive';
  variant?: 'subtle' | 'prominent';
}

// Shows: Color-coded status with icon
```

### HumanErrorMessage
```tsx
interface HumanErrorMessageProps {
  error: Error | string;
  context?: string;
}

// Converts technical errors to friendly messages
```

---

## Trust Pattern Rules

### Rule 1: Factual, Not Promotional
**Good**: "4.5 rating (120 reviews)"
**Bad**: "Highly rated!" or "Top rated!"

### Rule 2: Show Data, Not Hype
**Good**: "80% response rate"
**Bad**: "Fast responder!" or "Very responsive!"

### Rule 3: Calm, Not Loud
**Good**: Subtle badge, secondary color
**Bad**: Animated badge, bright colors

### Rule 4: Context Matters
**Good**: Show trust signals where relevant
**Bad**: Show everywhere (becomes noise)

### Rule 5: Honest, Not Deceptive
**Good**: Show actual data
**Bad**: Exaggerate or hide negative data

---

## Implementation Priority

### High Priority (Implement First)
1. Verification badges (Partners/Dealers)
2. Status clarity (all roles)
3. Human-friendly error messages
4. Activity timestamps

### Medium Priority
1. Response time indicators
2. Rating display
3. Review count

### Low Priority
1. Completion rate
2. Response rate
3. Advanced credibility metrics

---

## Trust Pattern Checklist

Before adding trust signal:

- [ ] Is it factual (not promotional)?
- [ ] Is it calm (not loud)?
- [ ] Is it relevant (not everywhere)?
- [ ] Is it honest (not deceptive)?
- [ ] Does it add value (not noise)?

---

## Examples

### ❌ Bad: Promotional
```
⭐ TOP RATED PARTNER! ⭐
🔥 FAST RESPONSE! 🔥
💯 100% SATISFACTION! 💯
```

### ✅ Good: Factual
```
Partner Name ✓ Verified
4.5 rating (120 reviews)
Typically responds within 2 hours
Active 2 hours ago
```

---

## Long-Term Trust Building

### Principles
1. **Consistency**: Same trust signals everywhere
2. **Accuracy**: Show real data, not marketing
3. **Transparency**: Don't hide negative data
4. **Calm**: Subtle, not promotional

### Metrics
- Trust signal usage (target: consistent)
- User trust perception (target: high)
- Conversion rate (target: improved with trust)






