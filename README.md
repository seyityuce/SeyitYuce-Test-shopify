# Dawn Theme - Shopify Store

A customized version of Shopify's Dawn theme (v15.4.0) for modern e-commerce stores.

## Overview

This is a Shopify Liquid theme based on Dawn, Shopify's flagship theme. Dawn is designed for performance, accessibility, and conversion optimization with a clean, modern aesthetic.

## Store Access

**Password**: `tailta`

Use this password to access the store preview if password protection is enabled.

## Theme Structure

```
├── assets/          # CSS, JavaScript, and image files
├── config/          # Theme configuration files
├── layout/          # Theme layout templates
├── locales/         # Translation files
├── sections/        # Reusable theme sections
├── snippets/        # Reusable code snippets
└── templates/       # Page templates
```

## Key Features

- **Performance Optimized**: Built with speed and Core Web Vitals in mind
- **Mobile-First Design**: Responsive across all devices
- **Accessibility Compliant**: WCAG 2.1 AA standards
- **SEO Ready**: Structured data and meta tags included
- **Customizable**: Extensive theme settings and sections

## Sections Available

- Image Banner & Slideshow
- Featured Collections & Products
- Product Recommendations
- Email Signup Banner
- Multicolumn & Rich Text
- Blog & Article displays
- Cart & Checkout components
- And many more...

## Development

### Prerequisites

- Shopify CLI
- Node.js (for asset compilation if customizing)
- Git

### Local Development

1. Install Shopify CLI:

```bash
npm install -g @shopify/cli @shopify/theme
```

2. Connect to your store:

```bash
shopify theme dev --store your-store.myshopify.com
```

3. Make changes and preview locally at the provided URL

### Deployment

Deploy to your Shopify store:

```bash
shopify theme push
```

## Customization

### Theme Settings

Configure the theme through:

- Shopify Admin → Online Store → Themes → Customize
- Or edit `config/settings_data.json` directly

### Adding Custom Sections

1. Create new `.liquid` files in `/sections/`
2. Add corresponding CSS in `/assets/`
3. Register in theme customizer if needed

### Styling

- Main styles: `assets/base.css`
- Component styles: `assets/component-*.css`
- Section styles: `assets/section-*.css`

## File Organization

### Assets

- **CSS**: Component-based architecture with separate files for each component
- **JavaScript**: Modular JS files for specific functionality
- **Icons**: SVG icons for consistent branding

### Sections

- **Main sections**: Core page templates (product, collection, etc.)
- **Feature sections**: Reusable content blocks
- **Utility sections**: Cart, search, navigation components

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Performance

This theme is optimized for:

- Fast loading times
- Minimal JavaScript
- Efficient CSS delivery
- Image optimization
- Core Web Vitals compliance

## Support

For theme-related issues:

- [Shopify Theme Documentation](https://help.shopify.com/manual/online-store/themes)
- [Dawn Theme Support](https://support.shopify.com/)

## License

This theme is based on Shopify's Dawn theme and follows Shopify's licensing terms.
