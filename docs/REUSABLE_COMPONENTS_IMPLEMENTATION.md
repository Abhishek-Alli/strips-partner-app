# Reusable Components System - Implementation Guide

## Overview

Enterprise-grade reusable component system for the Web Admin Panel, designed for data-heavy use cases with clean architecture and role-agnostic design.

## Components Built

### 1. DataTable ✅
**Location:** `web/src/components/table/DataTable.tsx`

**Features:**
- ✅ Column configuration with custom rendering
- ✅ Server-side pagination support
- ✅ Sorting (asc/desc) with visual indicators
- ✅ Debounced search (300ms delay)
- ✅ Loading state with skeleton
- ✅ Empty state with customizable message
- ✅ Row actions (Edit, Delete, etc.)
- ✅ Row selection (checkbox)
- ✅ Type-safe with TypeScript generics

**Key Props:**
```typescript
interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  pagination?: PaginationConfig;
  searchable?: boolean;
  onSearch?: (term: string) => void;
  sortable?: boolean;
  onSort?: (columnId: string, order: 'asc' | 'desc') => void;
  rowActions?: RowAction<T>[];
  selectable?: boolean;
  selectedRows?: T[];
  onSelectionChange?: (selected: T[]) => void;
}
```

### 2. FilterPanel ✅
**Location:** `web/src/components/filters/FilterPanel.tsx`

**Features:**
- ✅ Multiple filter types: text, select, date, daterange
- ✅ Collapsible panel
- ✅ Active filter indicator
- ✅ Clear all filters
- ✅ Controlled/uncontrolled modes
- ✅ Responsive grid layout

**Filter Types:**
- `text` - Text input
- `select` - Dropdown with options
- `date` - Single date picker
- `daterange` - Start and end date

### 3. ActionModal ✅
**Location:** `web/src/components/modals/ActionModal.tsx`

**Features:**
- ✅ Config-driven actions
- ✅ Predefined types: confirm, delete, approve, reject
- ✅ Custom actions support
- ✅ Icon support
- ✅ Responsive sizing
- ✅ Accessible (MUI Dialog)

**Modal Types:**
- `confirm` - Standard confirmation
- `delete` - Delete confirmation (error color)
- `approve` - Approval action (success color)
- `reject` - Rejection action (warning color)
- `custom` - Fully customizable

### 4. StatCard ✅
**Location:** `web/src/components/dashboard/StatCard.tsx` (already existed, verified)

**Features:**
- ✅ Icon support
- ✅ Color themes
- ✅ Subtitle support
- ✅ Responsive design

## Supporting Components

### TableToolbar
- Search input with icon
- Debounced search (300ms)
- Controlled/uncontrolled modes

### TableSkeleton
- Loading skeleton for tables
- Configurable columns and rows
- Optional toolbar skeleton

### EmptyState
- Customizable message
- Icon support
- Centered layout

## Architecture Principles

### ✅ Role-Agnostic
- No role checks inside components
- All components work for Admin, Partner, Dealer
- Role logic handled in parent components

### ✅ No Business Logic
- Components are pure UI
- All state managed in parent
- API calls in parent, data passed as props

### ✅ Type Safety
- Full TypeScript support
- Generic types for DataTable
- Strong prop interfaces

### ✅ Reusability
- Single responsibility
- Composable components
- Consistent API design

## Usage Example: User Management

See `web/src/pages/users/UserManagementPage.tsx` for complete implementation:

```tsx
// 1. Define columns
const columns: Column<User>[] = [
  { id: 'name', label: 'Name', sortable: true },
  { id: 'email', label: 'Email', sortable: true },
  {
    id: 'role',
    label: 'Role',
    render: (row) => <Chip label={row.role} />
  }
];

// 2. Define filters
const filterOptions: FilterOption[] = [
  { id: 'search', label: 'Search', type: 'text' },
  { id: 'role', label: 'Role', type: 'select', options: [...] }
];

// 3. Define row actions
const rowActions: RowAction<User>[] = [
  { label: 'Edit', onClick: handleEdit, color: 'primary' },
  { label: 'Delete', onClick: handleDelete, color: 'error' }
];

// 4. Use components
<FilterPanel filters={filterOptions} onChange={handleFilterChange} />
<DataTable
  columns={columns}
  rows={users}
  loading={isLoading}
  pagination={pagination}
  rowActions={rowActions}
  onSearch={handleSearch}
  onSort={handleSort}
/>
<ActionModal
  open={deleteModalOpen}
  title="Delete User"
  type="delete"
  actions={deleteModalActions}
/>
```

## Component API Reference

### DataTable

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `columns` | `Column<T>[]` | ✅ | Column definitions |
| `rows` | `T[]` | ✅ | Data rows |
| `loading` | `boolean` | ❌ | Loading state |
| `pagination` | `PaginationConfig` | ❌ | Pagination config |
| `searchable` | `boolean` | ❌ | Enable search |
| `onSearch` | `(term: string) => void` | ❌ | Search handler |
| `sortable` | `boolean` | ❌ | Enable sorting |
| `onSort` | `(id: string, order: string) => void` | ❌ | Sort handler |
| `rowActions` | `RowAction<T>[]` | ❌ | Row action buttons |
| `selectable` | `boolean` | ❌ | Enable row selection |
| `selectedRows` | `T[]` | ❌ | Selected rows |
| `onSelectionChange` | `(selected: T[]) => void` | ❌ | Selection handler |

### FilterPanel

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `filters` | `FilterOption[]` | ✅ | Filter definitions |
| `values` | `FilterValues` | ❌ | Controlled values |
| `onChange` | `(values: FilterValues) => void` | ❌ | Change handler |
| `onReset` | `() => void` | ❌ | Reset handler |
| `collapsible` | `boolean` | ❌ | Collapsible panel |
| `defaultExpanded` | `boolean` | ❌ | Initially expanded |

### ActionModal

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `open` | `boolean` | ✅ | Modal visibility |
| `onClose` | `() => void` | ✅ | Close handler |
| `title` | `string` | ✅ | Modal title |
| `message` | `string` | ❌ | Modal message |
| `actions` | `ActionModalAction[]` | ✅ | Action buttons |
| `type` | `string` | ❌ | Predefined type |
| `maxWidth` | `string` | ❌ | Modal max width |

## Design Decisions

### 1. Controlled vs Uncontrolled
**Decision:** Support both modes
**Why:** Flexibility for different use cases
**How:** Check if prop is provided, use internal state if not

### 2. Debounced Search
**Decision:** 300ms debounce delay
**Why:** Reduce API calls, better UX
**How:** `useDebounce` hook

### 3. Generic Types
**Decision:** TypeScript generics for DataTable
**Why:** Type safety with any data type
**How:** `<T>` generic parameter

### 4. Server-Side Pagination
**Decision:** Parent controls pagination
**Why:** Scalability, real-world use
**How:** Pagination config prop with callbacks

### 5. Row Actions
**Decision:** Config-driven actions
**Why:** Flexible, reusable
**How:** `RowAction[]` array prop

## File Structure

```
web/src/components/
├── table/
│   ├── DataTable.tsx          # Main table component
│   ├── TableToolbar.tsx       # Search toolbar
│   ├── TableSkeleton.tsx      # Loading skeleton
│   └── EmptyState.tsx         # Empty state
├── filters/
│   └── FilterPanel.tsx        # Filter panel
├── modals/
│   └── ActionModal.tsx        # Action modal
└── dashboard/
    └── StatCard.tsx          # Stat card (existing)
```

## Testing Checklist

- [x] DataTable renders with data
- [x] DataTable shows loading state
- [x] DataTable shows empty state
- [x] Pagination works
- [x] Search is debounced
- [x] Sorting works
- [x] Row actions work
- [x] Row selection works
- [x] FilterPanel filters work
- [x] FilterPanel collapses
- [x] ActionModal opens/closes
- [x] ActionModal actions work
- [x] All components are role-agnostic
- [x] TypeScript types are correct

## Next Steps

1. **Add More Filter Types**
   - Number range
   - Multi-select
   - Autocomplete

2. **Enhanced Features**
   - Column visibility toggle
   - Column resizing
   - Export functionality
   - Bulk actions

3. **Performance**
   - Virtual scrolling for large datasets
   - Memoization for expensive renders

4. **Accessibility**
   - Keyboard navigation
   - Screen reader support
   - ARIA labels

## Summary

✅ **Complete Implementation:**
- All core components built
- Type-safe with TypeScript
- Role-agnostic design
- Clean architecture
- Reusable across all roles
- Production-ready

🚀 **Ready for:**
- Production use
- API integration
- Feature expansion
- Team collaboration

All components follow enterprise best practices and are ready for production use!

