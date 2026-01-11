## Release Notes: Version X.Y.Z

We're excited to announce the release of version X.Y.Z, bringing significant enhancements to our CI/CD pipelines, SEO capabilities, and overall project maintainability.

### New Features

- **Robust CI/CD Pipelines:**
    - **Enhanced GitHub Pages Deployment:** The deployment workflow (`.github/workflows/static.yml`) now includes proper build steps (`npm install`, `npm run build`), Node.js setup, and caching, ensuring the Astro project is correctly built and deployed to GitHub Pages.
    - **Comprehensive Pull Request (PR) Checks:** A new PR workflow (`.github/workflows/pr-check.yml`) automates linting, formatting checks, and build verification for all incoming pull requests, significantly improving code quality and stability.
    - **Automated Link Checking:** Introduced a Link Checker workflow (`.github/workflows/link-checker.yml`) to automatically scan for and report broken links within the codebase on a weekly schedule and on pushes to `main`.
    - **Automated Dependency Management:** Configured Dependabot (`.github/dependabot.yml`) to automatically manage and update npm package dependencies and GitHub Actions dependencies, enhancing project security and maintainability.
- **Enhanced SEO with Richer Image Metadata:**
    - The JSON-LD schema for blog posts now includes `width` and `height` properties for the `heroImage`. This provides more detailed image metadata to search engines, improving the potential for rich snippet representation.
- **Human-Readable RSS Feed:**
    - An XSLT stylesheet has been added to the RSS feed (`/rss.xml`), providing a human-readable and styled view directly in the browser, similar to how the sitemap is presented.

### Bug Fixes

- **Sitemap URL Encoding:** Resolved an issue where non-ASCII characters in blog tags were incorrectly URL-encoded in the sitemap (e.g., `%E3%82%A2...`). The `slugifyTag` utility now correctly transliterates and sanitizes tags to create clean, readable URLs, improving sitemap accuracy and SEO.

### Performance Improvements

- N/A

### Deprecations

- N/A

### Security Updates

- N/A (Dependency updates are handled by Dependabot for ongoing security)

### Known Issues

- N/A

### Migration Guide

- N/A (These updates are generally backward-compatible and do not require specific migration steps.)

### Changelog

- For a complete list of all changes, please refer to the [Full Changelog](CHANGELOG.md).
