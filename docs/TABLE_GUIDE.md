# TableMint Advanced Table Guide

## Overview

TableMint generates professional-grade data tables with advanced features like sorting, filtering, pagination, and column management. The system uses a two-tier architecture with global reusable components and entity-specific configurations.

## Quick Start

### 1. Installation & Setup

```bash
# Install tablemint globally
npm install -g tablemint

# Initialize in your Next.js project
tablemint init

# Create your first table
tablemint create table users
```

### 2. What Gets Generated

After running `tablemint create table users`, you'll have:

```
components/table/                    # Global components (shared)
├── data-table.tsx
├── data-table-toolbar.tsx
├── data-table-column-header.tsx
├── data-table-faceted-filter.tsx
├── data-table-pagination.tsx
└── data-table-view-options.tsx

app/users/                          # Entity-specific files
├── columns.tsx                     # Column definitions
├── page.tsx                       # Page component
└── table-config.ts               # Configuration
```

## Configuration Guide

### Basic Configuration (`table-config.ts`)

```typescript
export const tableConfig = {
  // Search configuration
  searchColumn: "name", // Which column to search
  searchPlaceholder: "Search users...",

  // Filter configuration
  filters: [
    {
      columnId: "status",
      title: "Status",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
  ],
};
```

### Advanced Configuration Options

```typescript
export const tableConfig = {
  searchColumn: "name",
  searchPlaceholder: "Search users...",

  // Multiple filters
  filters: [
    {
      columnId: "status",
      title: "Status",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Pending", value: "pending" },
      ],
    },
    {
      columnId: "role",
      title: "Role",
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
        { label: "Guest", value: "guest" },
      ],
    },
  ],

  // Pagination settings
  pagination: {
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
  },

  // Default sorting
  defaultSort: [{ id: "createdAt", desc: true }],

  // Column settings
  columns: {
    defaultHidden: ["id", "internalNotes"],
    pinned: ["name"],
  },

  // Empty state
  emptyState: {
    title: "No users found",
    description: "Get started by creating your first user",
    actionLabel: "Add User",
    actionHref: "/users/new",
  },
};
```

## Column Definitions (`columns.tsx`)

### Basic Column Setup

```typescript
export type User = {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  role: "admin" | "user";
  createdAt: string;
};

export const columns: ColumnDef<User>[] = [
  // Selection column (always included)
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
  },

  // Sortable columns
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },

  // Custom cell rendering
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "active" ? "default" : "secondary"}>
          {status}
        </Badge>
      );
    },
  },

  // Actions column
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleEdit(user.id)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(user.id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
```

### Advanced Column Features

```typescript
// Date formatting
{
  accessorKey: "createdAt",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Created" />
  ),
  cell: ({ row }) => {
    const date = new Date(row.getValue("createdAt"))
    return date.toLocaleDateString()
  },
},

// Custom sorting
{
  accessorKey: "priority",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Priority" />
  ),
  sortingFn: (rowA, rowB) => {
    const priorities = { high: 3, medium: 2, low: 1 }
    return priorities[rowA.original.priority] - priorities[rowB.original.priority]
  },
},

// Conditional styling
{
  accessorKey: "amount",
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Amount" />
  ),
  cell: ({ row }) => {
    const amount = row.getValue("amount") as number
    return (
      <span className={amount < 0 ? "text-red-500" : "text-green-500"}>
        ${amount.toFixed(2)}
      </span>
    )
  },
}
```

## Data Fetching (`page.tsx`)

### Basic Data Fetching

```typescript
async function getData(): Promise<User[]> {
  const response = await fetch("/api/users");
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
}

export default async function UsersPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <DataTable
        columns={columns}
        data={data}
        searchColumn={tableConfig.searchColumn}
        searchPlaceholder={tableConfig.searchPlaceholder}
        filters={tableConfig.filters}
      />
    </div>
  );
}
```

### Advanced Data Fetching with Error Handling

```typescript
async function getData(): Promise<User[]> {
  try {
    const response = await fetch("/api/users", {
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.users || [];
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
}
```

### Client-Side Data Fetching

```typescript
"use client";

import { useState, useEffect } from "react";

export default function UsersPage() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/users");
        const users = await response.json();
        setData(users);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <DataTable
        columns={columns}
        data={data}
        searchColumn={tableConfig.searchColumn}
        filters={tableConfig.filters}
      />
    </div>
  );
}
```

## Customization Examples

### Custom Filter with Icons

```typescript
import { CheckCircle, XCircle, Clock } from "lucide-react";

const tableConfig = {
  filters: [
    {
      columnId: "status",
      title: "Status",
      options: [
        {
          label: "Active",
          value: "active",
          icon: CheckCircle,
        },
        {
          label: "Inactive",
          value: "inactive",
          icon: XCircle,
        },
        {
          label: "Pending",
          value: "pending",
          icon: Clock,
        },
      ],
    },
  ],
};
```

### Dynamic Filters from API

```typescript
async function getFilterOptions() {
  const response = await fetch("/api/filter-options");
  return response.json();
}

export default async function UsersPage() {
  const data = await getData();
  const filterOptions = await getFilterOptions();

  const dynamicConfig = {
    ...tableConfig,
    filters: [
      {
        columnId: "department",
        title: "Department",
        options: filterOptions.departments.map((dept) => ({
          label: dept.name,
          value: dept.id,
        })),
      },
    ],
  };

  return (
    <DataTable columns={columns} data={data} filters={dynamicConfig.filters} />
  );
}
```

### Custom Actions

```typescript
// In columns.tsx
const handleBulkDelete = async (selectedRows: User[]) => {
  const ids = selectedRows.map((row) => row.id);
  await fetch("/api/users/bulk-delete", {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
  // Refresh data
};



// Add to table config
const tableConfig = {
  selection: {
    enabled: true,
    bulkActions: [
      { label: "Delete Selected", action: handleBulkDelete },
    ],
  },
};
```

## Styling & Theming

### Custom Table Styling

```typescript
// In table-config.ts
const tableConfig = {
  styling: {
    className: "custom-table",
    headerClassName: "font-bold text-primary",
    rowClassName: (row) => (row.status === "inactive" ? "opacity-60" : ""),
    cellClassName: {
      status: "font-medium",
      email: "font-mono text-sm",
    },
  },
};
```

### Responsive Configuration

```typescript
const tableConfig = {
  responsive: {
    hiddenColumns: {
      mobile: ["createdAt", "lastLogin"],
      tablet: ["lastLogin"],
    },
  },
};
```

## Performance Optimization

### Large Datasets

```typescript
// Enable virtualization for 1000+ rows
const tableConfig = {
  performance: {
    virtualization: true,
    debounceSearch: 500,
    memoizeRows: true,
  },
};
```

### Server-Side Filtering & Pagination

```typescript
"use client";

export default function UsersPage() {
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({ page: 1, size: 20 });

  const { data, loading } = useSWR(
    `/api/users?${new URLSearchParams({
      ...filters,
      page: pagination.page.toString(),
      size: pagination.size.toString(),
    })}`,
    fetcher
  );

  return (
    <DataTable
      columns={columns}
      data={data?.users || []}
      onFiltersChange={setFilters}
      onPaginationChange={setPagination}
    />
  );
}
```

## Troubleshooting

### Common Issues

1. **Global components not found**

   ```bash
   # Run init command first
   tablemint init
   ```

2. **TypeScript errors**

   ```typescript
   // Make sure your type definitions match your data
   export type User = {
     id: string;
     name: string;
     // Add all fields from your API
   };
   ```

3. **Filters not working**

   ```typescript
   // Ensure columnId matches accessorKey in columns
   {
     accessorKey: "status", // This should match
     // ...
   }

   // In table-config.ts
   filters: [
     {
       columnId: "status", // This columnId
       // ...
     }
   ]
   ```

### Performance Issues

1. **Slow rendering with large datasets**

   - Enable virtualization
   - Implement server-side pagination
   - Use React.memo for custom cells

2. **Slow filtering**
   - Increase debounce time
   - Implement server-side filtering
   - Optimize filter options

## Best Practices

1. **Keep configurations simple** - Start with basic config and add features as needed
2. **Use TypeScript** - Define proper types for your data
3. **Implement error boundaries** - Handle API failures gracefully
4. **Optimize for mobile** - Use responsive configuration
5. **Test with real data** - Use actual API responses during development
6. **Cache filter options** - Store frequently used filter data
7. **Implement loading states** - Show skeleton or spinner while loading
8. **Use server-side features** - For large datasets, implement server-side filtering/pagination

## Examples Repository

For complete working examples, check out our examples repository with implementations for:

- E-commerce product tables
- User management dashboards
- Financial data tables
- Content management systems
- Analytics dashboards

## Support

For issues and questions:

- GitHub Issues: [TableMint Issues](https://github.com/Abh1noob/TableMint/issues)
- Documentation: [TableMint Docs](https://github.com/Abh1noob/TableMint)
