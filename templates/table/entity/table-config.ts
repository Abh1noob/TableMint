export const tableConfig = {
  // Configure which column to search by default
  searchColumn: "id", // Change this to your main searchable field (e.g., "name", "title", "email")
  searchPlaceholder: "Search {{ENTITY_NAME_KEBAB}}...",

  // Configure filters based on your data structure
  filters: [
    // Example filter configuration:
    // {
    //   columnId: "status",
    //   title: "Status",
    //   options: [
    //     { label: "Active", value: "active" },
    //     { label: "Inactive", value: "inactive" },
    //   ]
    // },
    // Add your filters here based on your API response structure
  ],

  // Pagination configuration
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [10, 20, 50, 100],
  },

  // Default sorting (uncomment and customize as needed)
  // defaultSort: [{ id: "createdAt", desc: true }],

  // Column configuration
  columns: {
    defaultHidden: [], // Hide these columns by default (e.g., ["id", "internalNotes"])
    // pinned: ["name"] // Pin these columns to the left
  },

  // Empty state configuration
  emptyState: {
    title: "No {{ENTITY_NAME_KEBAB}} found",
    description: "Get started by creating your first {{ENTITY_NAME_CAMEL}}",
    // actionLabel: "Add {{ENTITY_NAME_PASCAL}}",
    // actionHref: "/{{ENTITY_NAME_KEBAB}}/new"
  },

  // Additional options (uncomment and customize as needed):

  // selection: {
  //   enabled: true,
  //   bulkActions: [
  //     { label: "Delete Selected", action: "delete" },
  //     { label: "Export Selected", action: "export" }
  //   ]
  // },
};
