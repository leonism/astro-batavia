# Enterprise HTML Minifier Integration

This integration provides high-performance, parallelized HTML minification for Astro Batavia, ensuring that production builds are as lightweight as possible.

## Features

- **Multi-Core Processing**: Automatically detects available CPU cores and spawns parallel workers to minify HTML files simultaneously.
- **Strict Quality Control**: The build will explicitly fail if any HTML file cannot be minified, preventing corrupted artifacts from being deployed.
- **Detailed Statistics**: Generates a comprehensive post-build report showing:
  - Original vs. Minified sizes.
  - Total bytes saved and percentage reduction.
  - Per-file savings breakdown.
- **Powered by `html-minifier-terser`**: Uses the industry-standard minification engine with optimized defaults.

## Configuration

The integration is automatically active during production builds. You can customize its behavior in `astro.config.mjs`:

```javascript
htmlMinifier({
  removeComments: true,
  collapseWhitespace: true,
  // Add any other html-minifier-terser options here
});
```

## Default Settings

We use a cautious but effective set of defaults to ensure page stability:

| Option                  | Value   | Description                                          |
| :---------------------- | :------ | :--------------------------------------------------- |
| `collapseWhitespace`    | `true`  | Removes unnecessary spaces                           |
| `removeComments`        | `true`  | Strips HTML comments                                 |
| `minifyJS`              | `true`  | Minifies inline `<script>` tags                      |
| `minifyCSS`             | `true`  | Minifies inline `<style>` tags                       |
| `removeOptionalTags`    | `false` | **Critical**: Set to false to avoid breaking layouts |
| `removeAttributeQuotes` | `true`  | Removes quotes from attributes when safe             |

## Performance Impact

By leveraging all system cores, even large sites with hundreds of pages are minified in milliseconds. The integration typically reduces HTML weight by 15-30%, leading to faster TTI (Time to Interactive) for users.

## Troubleshooting

If the build fails during minification:

1.  Check the console for "Error Details".
2.  The error usually points to a specific HTML file with malformed syntax.
3.  Ensure your Astro components are generating valid HTML.
