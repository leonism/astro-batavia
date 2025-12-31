# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2025-12-31

### Added

- **feat(build):** Enhanced the `html-minifier` integration to provide more granular control and better reporting.
  - The integration now accepts custom `html-minifier-terser` options.
  - Build logs now include detailed statistics on file sizes and compression savings.
- **docs:** Created a new documentation file for the `html-minifier` integration in `docs/html-minifier-readme.md`.

### Changed

- **docs:** Updated `README.md` to reflect the latest Astro version and improvements to the build process.

### Fixed

- **fix(build):** Corrected a typo in the `<ViewTransitions />` component name in `src/layouts/Layout.astro` that was causing build failures.
- **fix(build):** Disabled the `removeOptionalTags` option in the `html-minifier` integration to prevent the removal of essential tags like `<head>` from the HTML output.
