# Portfolio Population Plan

## Overview
Populate the photography portfolio with curated photo and video selections from cottonbro studio's Pexels collections. Work in phases with user approval at each step.

## Collection Inventory

### Available Photos:
- **In The Rye**: 180 photos (IDs: 10677391-10679234)
- **Same As You**: 178 photos (IDs: 10617659-10617879)
- **Behind The Lens**: 111 photos (IDs: 9834135-9834875)
- **Total**: 469 photos downloaded

### Available Videos:
Need to extract from temp files (similar to photos process)

## Project Structure

### Projects to Create:
1. **In The Rye - Photos** (images only)
2. **In The Rye - Videos** (videos only)
3. **Same As You - Photos** (images only)
4. **Same As You - Videos** (videos only)
5. **Behind The Lens - Photos** (images only)
6. **Behind The Lens - Videos** (videos only)

---

## PHASE 1: In The Rye - Photos

### Tasks:
1. User reviews downloaded photos at `downloads/in-the-rye/index.html`
2. User selects preferred photo IDs (beige/neutral aesthetic priority)
3. Update `portfolio.json` with selected `pexelsPhotoIds` array
4. Test project page loads correctly

### Deliverable:
- Updated `portfolio.json` with In The Rye photo IDs
- Working photo gallery at `/project/in-the-rye-photos`

**⏸️ REVIEW CHECKPOINT** - Wait for user approval before Phase 2

---

## PHASE 2: In The Rye - Videos

### Tasks:
1. Extract video IDs from temp files
2. Download video preview images for review
3. User selects preferred video IDs
4. Update `portfolio.json` with selected `pexelsVideoIds` array
5. Test project page shows videos correctly

### Deliverable:
- Updated `portfolio.json` with In The Rye video IDs
- Working video gallery at `/project/in-the-rye-videos`

**⏸️ REVIEW CHECKPOINT** - Wait for user approval before Phase 3

---

## PHASE 3: Same As You - Photos

### Tasks:
1. User reviews downloaded photos at `downloads/same-as-you/index.html`
2. User selects preferred photo IDs
3. Update `portfolio.json` with selected `pexelsPhotoIds` array
4. Test project page loads correctly

### Deliverable:
- Updated `portfolio.json` with Same As You photo IDs
- Working photo gallery at `/project/same-as-you-photos`

**⏸️ REVIEW CHECKPOINT** - Wait for user approval before Phase 4

---

## PHASE 4: Same As You - Videos

### Tasks:
1. User selects preferred video IDs from extracted list
2. Update `portfolio.json` with selected `pexelsVideoIds` array
3. Test project page shows videos correctly

### Deliverable:
- Updated `portfolio.json` with Same As You video IDs
- Working video gallery at `/project/same-as-you-videos`

**⏸️ REVIEW CHECKPOINT** - Wait for user approval before Phase 5

---

## PHASE 5: Behind The Lens - Photos

### Tasks:
1. User reviews downloaded photos at `downloads/behind-the-lens/index.html`
2. User selects preferred photo IDs
3. Update `portfolio.json` with selected `pexelsPhotoIds` array
4. Test project page loads correctly

### Deliverable:
- Updated `portfolio.json` with Behind The Lens photo IDs
- Working photo gallery at `/project/behind-the-lens-photos`

**⏸️ REVIEW CHECKPOINT** - Wait for user approval before Phase 6

---

## PHASE 6: Behind The Lens - Videos

### Tasks:
1. User selects preferred video IDs from extracted list
2. Update `portfolio.json` with selected `pexelsVideoIds` array
3. Test project page shows videos correctly

### Deliverable:
- Updated `portfolio.json` with Behind The Lens video IDs
- Working video gallery at `/project/behind-the-lens-videos`

**⏸️ REVIEW CHECKPOINT** - Wait for user approval before Phase 7

---

## PHASE 7: WebP Conversion (FINAL)

### Prerequisites:
- All photos downloaded and selected
- All projects tested and approved
- `cwebp` command available (check with `which cwebp`)

### Tasks:
1. Install `cwebp` if needed (`brew install webp`)
2. Convert all downloaded JPG photos to WebP format
3. Update image URLs in `portfolio.json` to use `.webp` extension
4. Test all project pages load with WebP images
5. Verify file size reductions
6. Clean up original JPG files (after confirmation)

### Commands:
```bash
# Convert all photos to WebP
find downloads/ -name "*.jpg" -exec cwebp -q 85 {} -o {}.webp \;

# Rename to remove .jpg extension
find downloads/ -name "*.jpg.webp" -exec rename 's/\.jpg\.webp$/.webp/' {} \;
```

### Deliverable:
- All photos converted to WebP format
- Reduced file sizes (typically 25-35% smaller)
- Updated `portfolio.json` with WebP URLs
- All projects working with optimized images

**⏸️ FINAL REVIEW** - Verify all projects working with WebP

---

## Notes

### Photo Selection Guidelines:
- Prioritize beige/neutral backgrounds for "In The Rye"
- Ensure visual consistency within each project
- Consider narrative flow when ordering photos
- Typical project size: 12-20 photos, 10-15 videos

### Video Extraction Process:
- Parse temp HTML files for video IDs (similar to photos)
- Create video preview lists
- User selects from lists rather than downloading videos

### WebP Benefits:
- 25-35% smaller file size vs JPEG
- Better compression with same quality
- Faster page loads
- Supported by all modern browsers

---

## Progress Tracking

- [x] Phase 1: In The Rye - Photos ✅ (15 photos: 10678791-10678807)
- [x] Phase 2: In The Rye - Videos ✅ (12 videos: 10677316-10677456)
- [ ] Phase 3: Same As You - Photos
- [ ] Phase 4: Same As You - Videos
- [ ] Phase 5: Behind The Lens - Photos
- [ ] Phase 6: Behind The Lens - Videos
- [ ] Phase 7: WebP Conversion

**Current Status**: Phase 1 complete - Starting Phase 2
