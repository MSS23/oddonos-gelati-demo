# Oddono's Gelato Website

A modern, responsive website for Oddono's Gelati Italiani - London's premier Italian gelato brand since 2004.

## Overview

This website showcases Oddono's authentic Italian gelato, their 7 London locations, wholesale services, loyalty program, and more. Built with clean HTML5, CSS3, and vanilla JavaScript for optimal performance and SEO.

## Features

### Pages Included
1. **Home** (`index.html`) - Hero section, company intro, features, and call-to-actions
2. **About Us** (`about.html`) - Company story, timeline, ingredients, awards
3. **Shops** (`shops.html`) - All 7 London locations with addresses and map integration
4. **Wholesale** (`wholesale.html`) - B2B services, wholesale products, contact form
5. **Reviews** (`reviews.html`) - Press reviews, customer testimonials, awards
6. **Contact** (`contact.html`) - Contact form, company details, FAQs
7. **Gelato Card** (`gelato-card.html`) - Loyalty program details and benefits

### Key Features
- ✅ Fully responsive design (mobile, tablet, desktop)
- ✅ SEO optimized with meta tags and semantic HTML
- ✅ Accessible with proper ARIA labels and alt text
- ✅ Fast loading with optimized images
- ✅ Interactive components (mobile menu, forms, animations)
- ✅ Clean, modern design matching brand aesthetics
- ✅ Google Maps integration for locations
- ✅ Social media links
- ✅ Contact and wholesale forms with validation

## Design System

### Color Palette
- **Primary Blue:** #0052A3
- **Accent Gold:** #D4AF37
- **Dark Navy:** #1a1a2e
- **Light Cream:** #FAF9F6
- **Warm Beige:** #F5F1E8
- **Text Dark:** #2c3e50
- **Text Light:** #666

### Typography
- **Headings:** Playfair Display (serif) - elegant, traditional
- **Body Text:** Inter (sans-serif) - clean, readable

### Components
- Navigation bar with mobile hamburger menu
- Hero sections with overlay text
- Card grids for content display
- Feature sections with icons
- Timeline for company history
- Testimonial cards
- Contact forms with validation
- Call-to-action sections
- Footer with company info and links

## File Structure

```
oddonos-gelato-website/
├── index.html              # Home page
├── about.html              # About Us page
├── shops.html              # Locations page
├── wholesale.html          # Wholesale page
├── reviews.html            # Reviews & testimonials
├── contact.html            # Contact page
├── gelato-card.html        # Loyalty program page
├── styles.css              # Main stylesheet
├── script.js               # JavaScript functionality
└── README.md               # This file
```

## Installation & Usage

### Local Development
1. Clone or download this repository
2. Open `index.html` in a web browser
3. No build process required - pure HTML/CSS/JS

### Deployment
1. Upload all files to your web server
2. Ensure proper file permissions
3. Configure your domain to point to the root directory
4. Update any placeholder links (maps, social media, etc.)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

### Images
Replace the Unsplash placeholder images with actual Oddono's photos:
- Hero images: High-quality gelato and shop photos
- Product images: Individual flavor showcases
- About page: Founder photos, shop interiors, process photos
- Awards section: Award badges and certificates

### Google Maps
Update the Google Maps embed codes in:
- `shops.html` - Main locations map
- `contact.html` - Head office location

Current placeholders need to be replaced with actual Oddono's locations.

### Social Media Links
Update social media URLs in the footer:
- Facebook: Currently set to `https://facebook.com/oddonos`
- Instagram: Currently set to `https://instagram.com/oddonos`
- Twitter: Currently set to `https://twitter.com/oddonos`

### Forms
Contact and wholesale forms currently use client-side validation. To make them functional:
1. Set up a backend endpoint to handle form submissions
2. Update form `action` attributes or modify JavaScript to POST to your endpoint
3. Consider adding spam protection (reCAPTCHA, honeypot, etc.)

### Gelato Card Integration
The Gelato Card page links to `https://oddonos.stocklinkonline.com`. Update this URL if you have a different loyalty card portal.

## SEO Optimization

Each page includes:
- Unique `<title>` tags
- Meta descriptions
- Semantic HTML5 elements
- Proper heading hierarchy (H1-H6)
- Alt text on all images
- Internal linking structure
- Fast load times

## Accessibility

- ARIA labels on interactive elements
- Keyboard navigation support
- Alt text on all images
- Sufficient color contrast ratios
- Responsive text sizing
- Form labels and validation

## Mobile Responsive

The site adapts seamlessly to different screen sizes:
- **Desktop (1200px+):** Full layout with multi-column grids
- **Tablet (768px-1199px):** Adjusted grids and spacing
- **Mobile (<768px):** Single column, hamburger menu, stacked content

## Performance Tips

1. **Image Optimization:**
   - Compress all images before upload
   - Use WebP format where supported
   - Implement lazy loading (already included)

2. **Caching:**
   - Enable browser caching on your server
   - Consider a CDN for static assets

3. **Minification:**
   - Minify CSS and JavaScript for production
   - Combine files to reduce HTTP requests

## Future Enhancements

Potential additions:
- Online ordering integration
- Blog/news section
- Flavor of the month showcase
- Customer account portal
- Multi-language support
- Cookie consent banner (for GDPR compliance)
- Analytics integration (Google Analytics)

## Content Updates

### Regular Updates
- Add new shop locations in `shops.html`
- Update awards in `reviews.html` and `about.html`
- Refresh testimonials in `reviews.html`
- Update seasonal flavors and promotions on home page

### Annual Updates
- Update copyright year in footer
- Review and update company information
- Refresh images and photography

## Support

For questions or issues with this website:
- Email: info@oddonos.com
- Phone: 0333 8000 480

## Credits

**Design & Development:** Custom built for Oddono's Gelati Italiani
**Fonts:** Google Fonts (Playfair Display, Inter)
**Images:** Placeholder images from Unsplash (replace with actual photos)
**Icons:** Inline SVG icons

## License

© 2024 Oddono's Gelati Italiani Ltd. All Rights Reserved.

---

**Note:** This website is ready for deployment but requires customization of:
1. Real product and shop photography
2. Actual Google Maps coordinates and embed codes
3. Backend form handling
4. Verified social media links
5. Final content review and approval

Enjoy your new website and remember: "Life's too short to eat bad ice cream!"
