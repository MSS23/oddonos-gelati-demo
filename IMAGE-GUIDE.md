# Image Replacement Guide - Oddono's Gelato Website

## 📸 How to Use Real Instagram Photos

Since the website currently uses placeholder images from Unsplash, follow this guide to replace them with real Oddono's photos from Instagram: **@oddonos_gelati**

---

## 🎯 Step-by-Step Process

### Method 1: Download from Instagram (Recommended)

1. **Visit Instagram**: Go to https://www.instagram.com/oddonos_gelati/
2. **Open a post**: Click on any photo you want to use
3. **Download the image**:
   - Right-click on the image
   - Select "Save Image As..."
   - Save to your computer with a descriptive name

4. **Save images to website folder**:
   ```
   oddonos-gelato-website/
   └── images/
       ├── hero-gelato.jpg
       ├── pistachio-gelato.jpg
       ├── chocolate-gelato.jpg
       ├── shop-interior.jpg
       ├── gelato-making.jpg
       └── ... (more images)
   ```

### Method 2: Request from Oddono's

Contact Oddono's directly and request high-resolution images:
- Email: info@oddonos.com
- Phone: 0333 8000 480
- Ask for: Product photos, shop photos, and marketing images

---

## 📋 Image Inventory - What You Need

### Priority 1: Hero Images (Critical)

#### Home Page Hero
- **Current**: Generic gelato scoop image
- **Need**: Beautiful close-up of Oddono's gelato (multiple scoops in cone/cup)
- **Size**: 1600x900px minimum
- **Instagram suggestions**: Look for posts with:
  - Multiple gelato scoops
  - Colorful presentation
  - Professional lighting

#### About Page Hero
- **Current**: Founders placeholder
- **Need**: Photo of Oddono's founders or team
- **Size**: 1600x900px minimum
- **Alternative**: Shop exterior or interior with staff

---

### Priority 2: Product Images (Important)

#### Flavor Showcases (Need 4-6 images)

1. **Pistachio Gelato**
   - Current location: `index.html`, `about.html`, `wholesale.html`
   - Instagram: Look for pistachio close-ups
   - Ideal: Single scoop, clear green color

2. **Chocolate Gelato**
   - Current location: Multiple pages
   - Instagram: Rich chocolate gelato photos
   - Ideal: Dark brown, creamy texture visible

3. **Hazelnut (Nocciola) Gelato**
   - Current location: `wholesale.html`, `about.html`
   - Instagram: Nutty, light brown gelato
   - Ideal: With hazelnut pieces visible

4. **Mango Sorbet**
   - Current location: `wholesale.html`, `index.html`
   - Instagram: Bright orange/yellow sorbet
   - Ideal: Vibrant color, fruity appearance

5. **Strawberry Sorbet**
   - Current location: Various pages
   - Instagram: Pink/red sorbet
   - Ideal: Fresh, bright color

6. **Mixed Flavors**
   - Current location: Homepage features
   - Instagram: Posts showing variety
   - Ideal: Multiple scoops, different colors

---

### Priority 3: Location Images (Moderate)

#### Shop Photos (Need 2-3 images)

1. **Shop Interior**
   - Current location: `about.html`, `shops.html`
   - Instagram: Interior shots showing gelato display
   - Ideal: Clean, inviting, shows display case

2. **Shop Exterior**
   - Current location: `about.html`
   - Instagram: Storefront photos
   - Ideal: Shows Oddono's signage clearly

3. **Gelato Display Counter**
   - Current location: Various pages
   - Instagram: Display case with multiple flavors
   - Ideal: Shows variety and presentation

---

### Priority 4: Process Images (Optional)

#### Behind the Scenes

1. **Gelato Making**
   - Current location: `about.html`, `wholesale.html`
   - Instagram: Staff making gelato
   - Ideal: Shows artisan process

2. **Fresh Ingredients**
   - Current location: `about.html`
   - Instagram: Fresh fruits, nuts, etc.
   - Ideal: Shows quality ingredients

---

## 🔧 How to Replace Images in HTML

### Step 1: Create Images Folder

```bash
# In your website folder, create:
mkdir images
```

### Step 2: Save Downloaded Images

Place downloaded Instagram images in the `images/` folder with descriptive names:
```
images/
├── hero-home.jpg
├── hero-about.jpg
├── pistachio-gelato.jpg
├── chocolate-gelato.jpg
├── hazelnut-gelato.jpg
├── mango-sorbet.jpg
├── strawberry-sorbet.jpg
├── shop-interior.jpg
├── shop-exterior.jpg
├── gelato-display.jpg
├── making-gelato.jpg
└── fresh-ingredients.jpg
```

### Step 3: Update HTML Files

Find and replace Unsplash URLs with your local images:

#### Example - In index.html:

**BEFORE:**
```html
<img src="https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=1600&h=900&fit=crop"
     alt="Delicious Italian gelato" class="hero-bg">
```

**AFTER:**
```html
<img src="images/hero-home.jpg"
     alt="Delicious Oddono's Italian gelato" class="hero-bg">
```

---

## 📝 Complete Image Replacement Checklist

### index.html (Home Page)
- [ ] Hero image: `images/hero-home.jpg`
- [ ] Our Story card: `images/shop-exterior.jpg`
- [ ] Locations card: `images/shop-interior.jpg`
- [ ] Gelato Card promo: `images/gelato-card.jpg` (or generic)

### about.html (About Page)
- [ ] Hero image: `images/hero-about.jpg` (founders or team)
- [ ] Fresh ingredients card: `images/fresh-ingredients.jpg`
- [ ] Made fresh daily card: `images/making-gelato.jpg`
- [ ] 100% Natural card: `images/natural-ingredients.jpg`
- [ ] Gallery images (8 photos):
  - [ ] `images/gallery-1.jpg` (pistachio cone)
  - [ ] `images/gallery-2.jpg` (gelato display)
  - [ ] `images/gallery-3.jpg` (making process)
  - [ ] `images/gallery-4.jpg` (shop interior)
  - [ ] `images/gallery-5.jpg` (colorful scoops)
  - [ ] `images/gallery-6.jpg` (strawberry sorbet)
  - [ ] `images/gallery-7.jpg` (chocolate gelato)
  - [ ] `images/gallery-8.jpg` (gelato cone)

### wholesale.html (Wholesale Page)
- [ ] Hero image: `images/hero-wholesale.jpg`
- [ ] Bulk gelato: `images/bulk-supply.jpg`
- [ ] Delivery truck: `images/delivery.jpg` (or keep generic)
- [ ] Gelato cart: `images/gelato-cart.jpg`
- [ ] Product showcases:
  - [ ] Pistachio: `images/pistachio-gelato.jpg`
  - [ ] Hazelnut: `images/hazelnut-gelato.jpg`
  - [ ] Chocolate: `images/chocolate-gelato.jpg`
  - [ ] Mango: `images/mango-sorbet.jpg`

### reviews.html (Reviews Page)
- No images needed (text-based)

### contact.html (Contact Page)
- No images needed (text-based)

### shops.html (Shops Page)
- No images needed (map and text)

### gelato-card.html (Gelato Card Page)
- [ ] Hero image: `images/loyalty-card.jpg`

---

## 🎨 Image Optimization Tips

### Before Uploading to Website:

1. **Resize images** to appropriate dimensions:
   - Hero images: 1600x900px
   - Product images: 800x600px
   - Gallery images: 600x600px

2. **Compress images** for web:
   - Use tools like:
     - TinyPNG.com (free online)
     - Squoosh.app (free online)
     - Photoshop "Save for Web"
   - Target: Under 200KB per image

3. **Use consistent aspect ratios**:
   - Hero: 16:9 (landscape)
   - Products: 4:3 or 1:1 (square)
   - Gallery: 1:1 (square)

4. **File naming convention**:
   - Use lowercase
   - Use hyphens (not spaces)
   - Be descriptive: `pistachio-gelato.jpg` not `IMG_1234.jpg`

---

## 🚀 Quick Replace Script

### Find All Unsplash Images:

Search in all HTML files for:
```
images.unsplash.com
```

### Common Unsplash URLs to Replace:

1. `photo-1567206563064` → Hero gelato image
2. `photo-1581833971358` → Gelato making
3. `photo-1566737236500` → Shop interior
4. `photo-1563805042-7684c019e1cb` → Loyalty card
5. `photo-1629385044026` → Pistachio gelato
6. `photo-1579954115545` → Chocolate gelato
7. `photo-1590271876638` → Mango sorbet

---

## 📞 Need Help?

### If You're Stuck:

1. **Can't download from Instagram?**
   - Use browser extensions like "Download Instagram Photos"
   - Or use online tools like "Insta-Downloader"

2. **Don't have Photoshop?**
   - Use free alternatives: GIMP, Photopea.com, Canva.com

3. **Images too large?**
   - Use TinyPNG.com to compress
   - Or use Squoosh.app for advanced compression

4. **Need more photos?**
   - Contact Oddono's directly
   - Check their Facebook page
   - Look at Google Reviews for customer photos

---

## ✅ After Replacing Images

1. **Test locally**: Open HTML files in browser to verify
2. **Check loading**: Make sure all images load correctly
3. **Verify alt text**: Update alt attributes to describe Oddono's images
4. **Commit to Git**:
   ```bash
   git add images/
   git add *.html
   git commit -m "Replace placeholder images with real Oddono's photos"
   git push origin main
   ```

---

## 📊 Image Size Reference

| Location | Recommended Size | Max File Size |
|----------|-----------------|---------------|
| Hero Images | 1600x900px | 300KB |
| Product Photos | 800x600px | 150KB |
| Gallery Images | 600x600px | 100KB |
| Icons/Logos | 200x200px | 50KB |

---

## 🎯 Priority Order

1. **Start with**: Home page hero image (most visible)
2. **Then**: Product images (pistachio, chocolate, mango)
3. **Next**: About page gallery
4. **Finally**: Other decorative images

---

**Instagram**: @oddonos_gelati
**Website**: Currently using placeholders
**Goal**: Use authentic Oddono's photos for better brand representation

Good luck with the image updates! 📸🍦
