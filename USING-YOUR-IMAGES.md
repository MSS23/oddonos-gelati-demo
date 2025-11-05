# Using Your Images on the Website

## Current Images in Your `images` Folder

You have **7 gelato images** ready to use:
1. `IMG_20230608_195819.jpg`
2. `IMG_20230608_195820.jpg`
3. `IMG_20250821_195905.jpg`
4. `IMG-20250414-WA0008.jpg`
5. `PXL_20251103_214658009.jpg`
6. `PXL_20251103_214658516.jpg`
7. `PXL_20251103_214701919.MP.jpg`

## What I'm Updating

I'll replace all Unsplash placeholder images with your real images in the following locations:

### Homepage (index.html)
- **Hero Banner** → `images/PXL_20251103_214658009.jpg` (main banner image)
- **"Our Story" Card** → `images/IMG_20230608_195819.jpg`
- **"7 Locations" Card** → `images/IMG_20250821_195905.jpg`
- **"Gelato Card" Card** → `images/PXL_20251103_214658516.jpg`

### About Page (about.html)
- Will use remaining images for the story/process sections

### Other Pages
- Reviews, Shops, Contact pages will use your images where appropriate

## Recommended: Rename for Clarity

For better organization, you might want to rename your images to be more descriptive. Here's what I suggest:

```batch
REM Open Command Prompt in the images folder and run:
cd "c:\Users\msidh\Documents\Projects\Manraj AI Projects\oddonos gelato website\images"

ren "PXL_20251103_214658009.jpg" "hero-banner.jpg"
ren "PXL_20251103_214658516.jpg" "product-showcase.jpg"
ren "IMG_20230608_195819.jpg" "gelato-display-1.jpg"
ren "IMG_20230608_195820.jpg" "gelato-display-2.jpg"
ren "IMG_20250821_195905.jpg" "shop-location.jpg"
ren "IMG-20250414-WA0008.jpg" "gelato-close-up.jpg"
ren "PXL_20251103_214701919.MP.jpg" "artisan-making.jpg"
```

**Note:** Renaming is optional! I'll update the HTML to work with your current filenames.

## Next Steps

1. I'm updating index.html now to use your images
2. The changes will be committed to git
3. You can view the results by opening index.html in your browser

## Need More Images?

Download more from Instagram: https://www.instagram.com/oddonos_gelati/

Use these tools to compress:
- https://tinypng.com/
- https://squoosh.app/

Target sizes:
- Hero images: 1600x900px, under 200KB
- Product cards: 800x600px, under 150KB
