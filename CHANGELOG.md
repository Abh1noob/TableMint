# Changelog

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
