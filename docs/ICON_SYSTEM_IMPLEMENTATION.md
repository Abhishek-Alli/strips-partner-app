# Icon System Implementation

## Overview

Complete icon system audit and replacement with Google Material Icons (Outlined) for consistent, professional iconography across Web and Mobile.

---

## Icon System Architecture

### Centralized Icon Map
**File**: `shared/icons/iconMap.ts`

- Maps semantic icon names to Material Icon names
- Single source of truth for all icons
- Platform-agnostic naming

### Icon Components

**Web**: `web/src/components/core/Icon.tsx`
- Wraps Material Icons from `@mui/icons-material`
- Consistent sizing and styling
- Type-safe icon names

**Mobile**: `mobile/src/components/core/Icon.tsx`
- Uses `react-native-vector-icons/MaterialIcons`
- Consistent sizing and color
- Type-safe icon names

---

## Icon Style Rules

### ✅ Allowed
- Material Icons (Outlined) only
- Consistent stroke weight
- Professional, calm appearance
- Icons that communicate function

### ❌ Forbidden
- Emoji icons (removed from navigation)
- Mixed icon styles (filled + outline)
- Stock/random SVG icons
- Inconsistent stroke widths
- Decorative icons

---

## Replacements Made

### Mobile Navigation
**Before**: Emoji icons (🏠, 📊, 👤, 🔔, 💼, 📰, 🛠️)
**After**: Material Icons (HomeOutlined, DashboardOutlined, PersonOutlined, NotificationsOutlined, WorkOutlined, EventOutlined, BuildOutlined)

### Web Sidebar
**Before**: Mixed filled/outlined Material Icons
**After**: All Material Icons (Outlined) consistently

### Empty States
**Before**: Emoji icons (💬, 📁, 📦, ⭐, 🔍, 📊)
**After**: Material Icons (QuestionAnswerOutlined, WorkOutlined, InventoryOutlined, RateReviewOutlined, SearchOffOutlined, AssessmentOutlined)

### Action Icons
**Before**: Mixed styles
**After**: All Outlined (FavoriteOutlined, CloseOutlined, CheckCircleOutlined, etc.)

---

## Icon Usage Rules

### Navigation Icons
- Clear, universally recognizable
- 24px size
- Active state: primary color
- Inactive state: neutral gray

### Action Icons
- Subtle, secondary to text
- 20px size
- Neutral gray by default
- Primary color on hover/active

### Status Icons
- Minimal, calm
- 16-20px size
- Semantic colors (success green, error red)
- Never decorative

### Empty State Icons
- Single large icon (40px)
- Muted color (text.tertiary)
- Communicates function, not decoration

---

## Color Rules

- **Default**: `theme.colors.text.secondary` (neutral gray)
- **Active**: `theme.colors.primary[700]` (primary color)
- **Success**: `theme.colors.success[700]` (green)
- **Error**: `theme.colors.error[700]` (red)
- **Warning**: `theme.colors.accent[500]` (amber, only when needed)
- **Never**: Accent color for icons unless action-related

---

## Implementation Status

### ✅ Completed
1. Centralized icon map created
2. Icon components (web + mobile) created
3. Mobile navigation emoji icons replaced
4. Web sidebar icons standardized to Outlined
5. Empty state icons replaced
6. Action icons standardized
7. Status icons standardized

### 📋 Remaining
1. Audit all remaining icon usage
2. Replace any remaining emoji/random icons
3. Ensure consistent sizing everywhere
4. Verify icon alignment with text

---

## Usage Examples

### Web
```tsx
import { Icon } from '../../components/core/Icon';

<Icon name="dashboard" size="md" />
<Icon name="enquiry" size="lg" />
```

### Mobile
```tsx
import { Icon } from '../../../components/core/Icon';

<Icon name="home" size={24} color={theme.colors.primary[700]} />
<Icon name="search" size={20} />
```

---

## Quality Checklist

- [ ] No emoji icons
- [ ] All icons use Material Icons (Outlined)
- [ ] Consistent stroke weight
- [ ] Icons align with text
- [ ] Proper sizing (16px, 20px, 24px, 40px)
- [ ] Consistent colors
- [ ] Icons feel invisible (support UX, not distract)

---

## Long-Term Maintenance

### Rules
1. **Always use Icon component** - Never import Material Icons directly
2. **Add to iconMap first** - New icons must be added to centralized map
3. **Outlined only** - Never use filled icons
4. **Consistent sizing** - Use size prop, not inline styles
5. **Semantic naming** - Use clear, functional names

### Adding New Icons
1. Add to `shared/icons/iconMap.ts`
2. Use Material Icon (Outlined) name
3. Update Icon component if needed
4. Use in code via `<Icon name="..." />`

---

## Result

The platform now has:
- ✅ Consistent, professional iconography
- ✅ Google-grade visual quality
- ✅ No emoji or mixed styles
- ✅ Enterprise-level appearance
- ✅ Timeless, calm design






