# Design Governance Rules

## Core Principle

**Consistency > Creativity. Reuse > Reinvent.**

Every design decision must pass the governance checklist before implementation.

---

## Component Reuse Rules

### Rule 1: No New Component Unless Necessary
**Checklist**:
- [ ] Does an existing component solve this need?
- [ ] Can an existing component be extended?
- [ ] Is this truly a unique use case?

**If all checked, then**:
- [ ] Document why new component is needed
- [ ] Ensure it follows design tokens
- [ ] Make it reusable for future cases

### Rule 2: Component Extension Over Creation
**Prefer**:
- Extending `Card` with new variants
- Adding props to `Button` for new styles
- Composing existing components

**Avoid**:
- Creating `CustomCard` when `Card` can work
- Duplicating button logic
- One-off components

### Rule 3: Shared Component Library
**Structure**:
```
shared/components/     # Platform-agnostic logic
web/components/        # Web-specific wrappers
mobile/components/     # Mobile-specific wrappers
```

**Rule**: Business logic in `shared`, presentation in platform folders.

---

## Color Governance

### Rule 1: Design Tokens Only
**Allowed Colors**:
- Colors from `designTokens.colors`
- Semantic aliases (text.primary, background.secondary)

**Forbidden**:
- Hardcoded hex colors
- Colors outside design tokens
- New colors without token update

### Rule 2: Max 3 Colors Per Screen
**Primary**: One main color (usually primary.700)
**Secondary**: One supporting color (usually neutral)
**Accent**: One accent color (max 10% usage, usually accent.500)

**Exception**: Data visualization (charts) may use more.

### Rule 3: No Gradients
**Allowed**: Solid colors only
**Forbidden**: Gradients, multi-color backgrounds

**Rationale**: Gradients add visual noise and reduce clarity.

---

## Spacing Governance

### Rule 1: 8px Grid System
**Allowed Spacing**: 4, 8, 16, 24, 32, 48, 64, 80px

**Forbidden**:
- Random spacing (5px, 13px, 27px)
- Spacing outside 8px grid
- Inconsistent spacing

### Rule 2: Consistent Spacing Scale
**Use**:
- `theme.spacing[2]` for 8px
- `theme.spacing[4]` for 16px
- `theme.spacing[6]` for 24px

**Never**:
- Hardcoded pixel values
- Calculated spacing (e.g., `padding: width * 0.1`)

### Rule 3: Spacing Hierarchy
**Tight**: 4-8px (related elements)
**Normal**: 16-24px (sections)
**Loose**: 32-48px (major sections)

---

## Typography Governance

### Rule 1: Design Token Font Sizes Only
**Allowed**: xs (12px), sm (14px), base (16px), lg (18px), xl (24px), 2xl (32px), 3xl (40px)

**Forbidden**:
- Custom font sizes
- Calculated font sizes
- Font sizes outside tokens

### Rule 2: Max 2 Font Weights Per Screen
**Common Combinations**:
- Regular (400) + Semibold (600)
- Medium (500) + Bold (700)

**Forbidden**:
- More than 2 weights
- Inconsistent weight usage

### Rule 3: Line Height Consistency
**Body Text**: 1.5 (normal)
**Headings**: 1.2 (tight)
**Captions**: 1.75 (relaxed)

---

## Button Governance

### Rule 1: One Primary Button Per Screen
**Definition**: The most important action on the screen.

**Rules**:
- Only ONE visually dominant button
- Other actions are secondary or hidden
- Primary button uses `PrimaryButton` component

### Rule 2: Button Hierarchy
**Primary**: `PrimaryButton` (one per screen)
**Secondary**: `SecondaryButton` (supporting actions)
**Tertiary**: `TextButton` (hidden or navigation)

### Rule 3: Button Placement
**Primary**: Top-right or bottom-right (web), bottom (mobile)
**Secondary**: Left of primary or below
**Tertiary**: In navigation or "More" menu

---

## State Governance

### Rule 1: Consistent States
**Required States**:
- Loading (skeleton loader, not spinner)
- Empty (friendly empty state)
- Error (clear error message)
- Success (subtle confirmation)

**Rules**:
- Use `SkeletonLoader` for loading
- Use `EmptyState` for empty
- Use `Toast` for success/error
- Never show raw error messages

### Rule 2: State Transitions
**Timing**: 120-200ms
**Easing**: ease-out only
**No**: Decorative animations, bounces, spins

---

## Layout Governance

### Rule 1: Grid System
**Web**: 12-column grid (MUI Grid)
**Mobile**: Flexbox with 8px spacing

**Rules**:
- Consistent column widths
- No arbitrary widths
- Responsive breakpoints only

### Rule 2: Content Width
**Max Width**: 1280px (web), 100% (mobile)
**Padding**: 24px (web), 16px (mobile)

### Rule 3: Visual Hierarchy
**Primary**: 60% visual weight
**Secondary**: 30% visual weight
**Tertiary**: 10% or hidden

---

## When NOT to Add UI

### Don't Add UI If:
1. **Feature is rarely used**: Hide in navigation
2. **Information is redundant**: Remove, don't duplicate
3. **Action is not primary**: De-emphasize or hide
4. **Data is historical**: Show on demand only
5. **Feature is experimental**: Behind feature flag

### Instead:
- Use progressive disclosure
- Hide in navigation
- Show on demand
- Use feature flags

---

## How to Say "No" to Design Debt

### Question Framework
1. **"Does this follow design tokens?"**
   - If no → Use tokens or update tokens first

2. **"Can we reuse an existing component?"**
   - If yes → Extend, don't create new

3. **"Is this the primary action?"**
   - If no → De-emphasize or hide

4. **"Will this scale?"**
   - If no → Rethink approach

5. **"Does this add value NOW?"**
   - If no → Don't add yet

### Decision Tree
```
New UI Request
├─ Does it follow tokens? → No → Update tokens first
├─ Can existing component work? → Yes → Extend component
├─ Is it primary action? → No → De-emphasize
├─ Will it scale? → No → Rethink
└─ Does it add value? → No → Don't add
```

---

## Governance Checklist

Before implementing any UI:

- [ ] Uses design tokens (colors, spacing, typography)
- [ ] Reuses existing components
- [ ] Follows 8px spacing grid
- [ ] Max 3 colors per screen
- [ ] One primary button per screen
- [ ] Consistent states (loading, empty, error)
- [ ] Clear information hierarchy
- [ ] Mobile-optimized
- [ ] Accessible
- [ ] Documented (if new component)

---

## Quality Standards

### Must Have
- Design token compliance
- Component reuse
- Consistent spacing
- Clear hierarchy
- Accessible

### Should Have
- Empty states
- Loading states
- Error handling
- Mobile optimization

### Nice to Have
- Micro-interactions
- Animations
- Advanced features

---

## Enforcement

### Code Review Checklist
Every PR must include:
- [ ] Design token usage verified
- [ ] Component reuse verified
- [ ] Spacing grid verified
- [ ] Color usage verified
- [ ] Hierarchy verified

### Automated Checks (Future)
- Lint rules for design tokens
- Component usage analysis
- Spacing grid validation
- Color usage validation

---

## Examples

### ❌ Bad: Design Debt
```tsx
// Hardcoded colors
<div style={{ color: '#FF5733', padding: '13px' }}>
  <button style={{ backgroundColor: '#00FF00' }}>
    Click me
  </button>
</div>
```

### ✅ Good: Governance Compliant
```tsx
// Design tokens
<Box sx={{ color: theme.colors.text.primary, padding: theme.spacing[4] }}>
  <PrimaryButton>Click me</PrimaryButton>
</Box>
```

---

## Long-Term Quality

### Principles
1. **Consistency**: Same patterns everywhere
2. **Reusability**: Build once, use everywhere
3. **Scalability**: Patterns that work at scale
4. **Maintainability**: Easy to update and extend

### Metrics
- Component reuse rate (target: >80%)
- Design token compliance (target: 100%)
- Spacing grid compliance (target: 100%)
- Color usage compliance (target: 100%)






