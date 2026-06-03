# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-06-03

### Changed
- Removed Material UI dependency — UI is now built without MUI, reducing bundle size and eliminating the MUI peer dependency requirement
- Significantly improved and cleaner UI design
- Updated peer dependencies to use `>=` ranges for broader compatibility

### Fixed
- Fixed issue where `OnboardingItem` would not mount after clicking the back button

---

## [1.1.1] - Prior Release

### Fixed
- Handled the case where no DOM element exists for the given `elementID`
- Clicking anywhere advances to the next step

---

## [1.1.0] - Prior Release

### Added
- Component can now disable the arrow for any message step

---

## [1.0.1] - Prior Release

### Added
- Added `repository` and `homepage` fields to package.json
- Initial stable release
