# Reusable Components Usage Guide

## DataTable Component

### Basic Usage

```tsx
import { DataTable, Column, PaginationConfig } from '../../components/table/DataTable';

const columns: Column<User>[] = [
  { id: 'name', label: 'Name', sortable: true },
  { id: 'email', label: 'Email', sortable: true },
  {
    id: 'role',
    label: 'Role',
    render: (row) => <Chip label={row.role} />
  }
];

const pagination: PaginationConfig = {
  page: 0,
  rowsPerPage: 10,
  total: 100,
  onPageChange: (page) => setPage(page),
  onRowsPerPageChange: (rowsPerPage) => setRowsPerPage(rowsPerPage)
};

<DataTable
  title="Users"
  columns={columns}
  rows={users}
  loading={isLoading}
  pagination={pagination}
  onSearch={(term) => handleSearch(term)}
  onSort={(columnId, order) => handleSort(columnId, order)}
/>
```

### With Row Actions

```tsx
const rowActions: RowAction<User>[] = [
  {
    label: 'Edit',
    icon: <EditIcon />,
    onClick: (row) => handleEdit(row),
    color: 'primary'
  },
  {
    label: 'Delete',
    icon: <DeleteIcon />,
    onClick: (row) => handleDelete(row),
    color: 'error',
    disabled: (row) => row.isProtected
  }
];

<DataTable
  columns={columns}
  rows={users}
  rowActions={rowActions}
/>
```

### With Selection

```tsx
const [selectedRows, setSelectedRows] = useState<User[]>([]);

<DataTable
  columns={columns}
  rows={users}
  selectable={true}
  selectedRows={selectedRows}
  onSelectionChange={setSelectedRows}
  getRowId={(row) => row.id}
/>
```

## FilterPanel Component

### Basic Usage

```tsx
import { FilterPanel, FilterOption, FilterValues } from '../../components/filters/FilterPanel';

const filterOptions: FilterOption[] = [
  {
    id: 'search',
    label: 'Search',
    type: 'text',
    placeholder: 'Search...'
  },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' }
    ]
  },
  {
    id: 'dateRange',
    label: 'Date Range',
    type: 'daterange'
  }
];

const [filterValues, setFilterValues] = useState<FilterValues>({});

<FilterPanel
  filters={filterOptions}
  values={filterValues}
  onChange={setFilterValues}
  onReset={() => setFilterValues({})}
  collapsible={true}
  defaultExpanded={true}
/>
```

## ActionModal Component

### Confirm Modal

```tsx
import { ActionModal, ActionModalAction } from '../../components/modals/ActionModal';

const [open, setOpen] = useState(false);

const actions: ActionModalAction[] = [
  {
    label: 'Cancel',
    onClick: () => setOpen(false),
    variant: 'outlined'
  },
  {
    label: 'Confirm',
    onClick: handleConfirm,
    color: 'primary'
  }
];

<ActionModal
  open={open}
  onClose={() => setOpen(false)}
  title="Confirm Action"
  message="Are you sure you want to proceed?"
  type="confirm"
  actions={actions}
/>
```

### Delete Modal

```tsx
<ActionModal
  open={deleteModalOpen}
  onClose={() => setDeleteModalOpen(false)}
  title="Delete User"
  message={`Are you sure you want to delete ${userName}? This action cannot be undone.`}
  type="delete"
  actions={[
    {
      label: 'Cancel',
      onClick: () => setDeleteModalOpen(false),
      variant: 'outlined'
    },
    {
      label: 'Delete',
      onClick: handleDelete,
      color: 'error'
    }
  ]}
/>
```

### Approve/Reject Modal

```tsx
<ActionModal
  open={approveModalOpen}
  onClose={() => setApproveModalOpen(false)}
  title="Approve Request"
  message="Do you want to approve this request?"
  type="approve"
  actions={[
    {
      label: 'Reject',
      onClick: handleReject,
      color: 'warning',
      variant: 'outlined'
    },
    {
      label: 'Approve',
      onClick: handleApprove,
      color: 'success'
    }
  ]}
/>
```

## StatCard Component

### Basic Usage

```tsx
import { StatCard } from '../../components/dashboard/StatCard';
import PeopleIcon from '@mui/icons-material/People';

<StatCard
  title="Total Users"
  value={1247}
  subtitle="892 active"
  icon={<PeopleIcon />}
  color="primary"
/>
```

### With Loading

```tsx
{loading ? (
  <Skeleton variant="rectangular" height={140} />
) : (
  <StatCard
    title="Revenue"
    value="₹12,45,678"
    subtitle="This month"
    color="success"
  />
)}
```

## Complete Example: User Management Page

See `web/src/pages/users/UserManagementPage.tsx` for a complete implementation using all components together.

## Best Practices

1. **State Management**: Keep all state in parent component
2. **API Calls**: Make API calls in parent, pass data as props
3. **Type Safety**: Use TypeScript interfaces for all props
4. **Loading States**: Always provide loading prop
5. **Empty States**: Customize empty messages for context
6. **Error Handling**: Handle errors in parent, show in UI
7. **Accessibility**: Components follow MUI accessibility guidelines

