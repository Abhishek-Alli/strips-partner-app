# Premium UI Implementation Guide

## Design Philosophy

This UI system is designed for **TRUST and SCALE**, inspired by:
- Stripe (clarity, confidence)
- Airbnb (clean, calm)
- Uber (industrial, intelligent)
- Coinbase (enterprise-grade)
- Notion (restraint, hierarchy)

## Design System

### Colors
- **Primary**: Midnight/Steel Blue (`#334E68` to `#102A43`)
- **Neutrals**: White to Dark Grey scale
- **Accent**: Construction Amber (max 10% usage)
- **Semantic**: Success Green, Error Red

### Typography
- **Font**: Inter (web), SF Pro (iOS), Roboto (Android)
- **Scale**: 12px (caption) → 24px (page title)
- **Weights**: Regular (400), Medium (500), Semibold (600), Bold (700)
- **Line Height**: 1.5 (normal), 1.2 (tight)

### Spacing
- **Grid**: Strict 8px system
- **Allowed**: 4, 8, 16, 24, 32, 48px
- **No random spacing**

### Components

#### Web Components
- `Card` - Clean card with subtle shadow
- `StatCard` - KPI/metric display
- `PrimaryButton` - Confident primary action
- `SecondaryButton` - Subtle secondary action
- `TextInput` - Clean input with floating label
- `SkeletonLoader` - Subtle loading states

#### Mobile Components
- `Card` - Gesture-friendly card
- `StatCard` - Mobile-optimized metrics
- `PrimaryButton` - Touch-optimized button

## Implementation Status

### ✅ Completed
1. Design tokens system (`shared/design/tokens.ts`)
2. Web theme configuration
3. Mobile theme configuration
4. Core reusable components (Card, StatCard, Buttons, Inputs)
5. Premium Admin Dashboard (web)
6. Premium Mobile Dashboard

### 🚧 Next Steps

#### Web Screens
1. Login/Signup flows
2. User/Partner/Dealer management tables
3. Enquiry management (split view)
4. Content management
5. Reports & Analytics

#### Mobile Screens
1. Search & Listings
2. Profile pages
3. Enquiry inbox
4. Works/Products
5. Tools (Checklists, Converters, Budget)
6. Feeds (Market updates, Tenders, Projects)

## Usage Examples

### Web - Stat Card
```tsx
<StatCard
  label="Total Users"
  value={1250}
  trend={{ value: 12, direction: 'up' }}
/>
```

### Mobile - Card
```tsx
<Card
  variant="default"
  onPress={() => navigation.navigate('Search')}
>
  <Text>Card Content</Text>
</Card>
```

## Design Rules

1. **Max 3 colors per screen**
2. **No gradients**
3. **No loud colors**
4. **Accent only for actions**
5. **Max 2 font weights per screen**
6. **Strict 8px spacing grid**
7. **Subtle shadows only**
8. **120-200ms animations, ease-out only**

## Quality Checklist

- [ ] No clutter
- [ ] No random colors
- [ ] No inconsistent spacing
- [ ] No heavy animations
- [ ] No role confusion
- [ ] No UI debt
- [ ] Accessibility-first
- [ ] Reusable components only






