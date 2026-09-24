# Pexels API Integration

This project integrates with the Pexels API to display curated photo collections.

## Setup

1. **Environment Variables**: The Pexels API key is stored in `.env.local`:
   ```
   VITE_PEXELS_API_KEY=your_api_key_here
   ```

2. **API Key**: Your current API key is already configured. Keep this file secure and never commit it to version control.

## Features

### Current Implementation
- **In The Rye Collection**: The homepage now displays photos from the Pexels collection "In The Rye" (ID: yxiptwp)
- **Automatic Fetching**: Photos are fetched automatically when the page loads
- **Attribution**: Proper Pexels attribution is displayed in the footer
- **Loading States**: Shows loading spinner while fetching photos
- **Error Handling**: Displays error messages if the API request fails

## Files Created

### Types
- `src/types/pexels.ts` - TypeScript interfaces for Pexels API responses

### Services
- `src/services/pexels.ts` - Pexels API service with methods for:
  - `getCollection()` - Fetch photos/videos from a collection
  - `searchPhotos()` - Search for photos by query
  - `getCurated()` - Get curated photos
  - `getPhoto()` - Get a specific photo by ID
  - `convertToGalleryImages()` - Convert Pexels format to gallery format

### Hooks
- `src/hooks/usePexelsCollection.ts` - React hook for fetching collections with loading/error states

### Pages
- `src/pages/InTheRye.tsx` - New page displaying the "In The Rye" collection

## Usage Examples

### Using the Hook in a Component

```tsx
import { usePexelsCollection } from '@/hooks/usePexelsCollection';
import { pexelsService } from '@/services/pexels';

function MyComponent() {
  const { data, loading, error } = usePexelsCollection({
    collectionId: 'yxiptwp',
    per_page: 80,
    type: 'photos',
  });

  const galleryImages = data
    ? pexelsService.convertToGalleryImages(data.media)
    : [];

  // Use galleryImages in your component
}
```

### Fetching Other Collections

To add another Pexels collection:

1. Get the collection ID from the URL (e.g., `https://www.pexels.com/collections/nature-abc123/` → ID is `abc123`)
2. Create a new page component similar to `InTheRye.tsx`
3. Update the `collectionId` in the `usePexelsCollection` hook
4. Add the route to `App.tsx`
5. Add navigation link to `lib/navigation.ts`

### Searching Photos

```tsx
import { pexelsService } from '@/services/pexels';

// Search for photos
const results = await pexelsService.searchPhotos('nature', {
  orientation: 'landscape',
  per_page: 20,
});
```

## API Rate Limits

- Default: 200 requests/hour, 20,000 requests/month
- Current implementation fetches 80 photos per page
- Consider implementing caching for production use

## Attribution Requirements

As per Pexels guidelines:
1. Display "Photos provided by Pexels" with a link to pexels.com
2. Credit photographers when possible (implemented in the gallery)
3. The attribution footer is automatically included on the InTheRye page

## Troubleshooting

### API Key Issues
- Ensure `.env.local` exists and contains your API key
- Restart the dev server after adding/changing environment variables

### CORS Errors
- The Pexels API allows cross-origin requests, but ensure you're making requests from the correct domain

### Rate Limiting
- If you exceed rate limits, you'll receive a 429 error
- Consider implementing request caching or contacting Pexels for higher limits

## Resources

- [Pexels API Documentation](https://www.pexels.com/api/documentation/)
- [Pexels License](https://www.pexels.com/license/)
- [Request Higher Rate Limits](https://www.pexels.com/api/)
