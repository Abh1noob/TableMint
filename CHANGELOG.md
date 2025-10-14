# Changelog

## [1.3.0] - 2025-10-15

### Added

- Advanced table system with professional features (sorting, filtering, pagination, column management)
- Architecture refactored to include global reusable components and entity specific configurations
- Enhanced `init` command that installs global table components to components/table/
- Separate table-config.ts files for independent entity configuration with examples
- DataTableColumnHeader component for sortable column headers with visual indicators
- DataTableFacetedFilter component for multi-select dropdown filters with search
- DataTablePagination component with advanced navigation and page jumping
- DataTableToolbar component with configurable search and filter controls
- DataTableViewOptions component for column visibility management
- Global component detection and validation system
- Comprehensive error handling with helpful user guidance

### Changed

- Refactored to two tier component architecture (global + entity specific)
- Updated `init` command to install both shadcn/ui and global table components automatically
- Improved entity generation to only create entity specific files (columns, page, config)
- Updated template structure to support advanced table features and configuration

### Removed

- Basic table templates (replaced with advanced)
- Entity specific data-table.tsx files (now uses global component)

## [1.2.0] - 2025-10-14

### Added

- Dynamic component generation system with configuration driven architecture
- Automatic package manager detection (npm, yarn, pnpm, bun)
- Automatic dependency installation with fallback instructions
- GitHub template fetching system
- Support for different target directories (app, components, custom)
- Comprehensive error handling and user feedback

### Changed

- Refactored codebase to follow DRY principles
- Templates now fetched from GitHub instead of bundled with package
- Improved CLI output messages
- Enhanced template processing with better variable replacement

### Removed

- Local template bundling (reduces package size significantly)

## [1.0.1] - 2025-10-13

### Fixed

- Fixed an error where the `tablemint create table <entity>` command broke because of a typo in `fileHelpers.js`

## [1.0.0] - 2025-10-13

### Added

- Initial release
