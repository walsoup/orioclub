# Customization Guide

## Custom Background Blobs

You can customize the floating background blobs by adding your own PNG images.

### How to add custom blob images:

1. Create two PNG images for the blobs:
   - `blob-1.png` - Left/top blob
   - `blob-2.png` - Right/bottom blob

2. Place them in the `assets/` folder

3. The blobs will automatically use your custom images while keeping the gradient as a fallback

### Recommended specifications:

- **Format**: PNG with transparency
- **Size**: 500x500px to 600x600px recommended
- **Style**: Organic, irregular shapes work best
- **Colors**: Warm tones (terracotta, cream, tan) to match the site aesthetic
- **Opacity**: The images will be displayed at 25% opacity with blur, so make them relatively bold

### Tips:

- Keep the images fairly simple - they will be heavily blurred
- Warm colors work best with the paper-inspired design
- If no custom images are provided, the site will use the default CSS gradients
- You can use different shapes for blob-1 and blob-2 for variety

### Example workflow:

```bash
# Add your custom blob images
cp my-blob-1.png assets/blob-1.png
cp my-blob-2.png assets/blob-2.png

# The site will automatically use them!
```

The blobs are styled with:
- `filter: blur(80px)` - Heavy blur for soft effect
- `mix-blend-mode: multiply` - Blends with background
- `opacity: 0.25` - Semi-transparent
- Organic floating animation
