# Persistent Lead Table Filters

This system automatically saves all Lead table filter settings to the browser's localStorage and restores them when the user revisits or reloads the page. Filter settings are only cleared when the user clicks "Clear All" or logs out.

## Features

- ✅ Automatic filter persistence to localStorage
- ✅ All filter types are saved:
  - Global search
  - Status, Source, Assigned User filters
  - Town, Occupation, Company, Interest filters
  - Created/Updated date ranges
  - Activity filters (Notes, Calls, Reminders)
  - Sort settings
  - Page size preference
- ✅ Filters cleared on "Clear All" button
- ✅ Filters cleared on logout
- ✅ Works across browser tabs
- ✅ Survives page reloads and navigation

## Implementation Details

### Hook: `usePersistedFilters`

Located in `resources/js/hooks/usePersistedFilters.ts`

**Methods:**
- `saveFilters(filters)` - Saves filter state to localStorage
- `loadFilters()` - Retrieves filter state from localStorage
- `clearFilters()` - Clears filters from localStorage
- `setupLogoutListener()` - Sets up event listeners for logout detection

### Component Integration

The `LeadsTable` component (`resources/js/components/leads-table.tsx`) uses this hook to:

1. **Load filters on mount** - Restores saved filters when component initializes
2. **Save on changes** - Automatically saves whenever any filter is modified
3. **Clear on "Clear All"** - Removes saved filters when user clears
4. **Detect logout** - Clears filters when user logs out

### Logout Handling

Filters are automatically cleared when:

1. User clicks "Clear All" button in the filters UI
2. User logs out (via `/logout` route)
3. User is redirected to login page
4. Auth token is removed in another browser tab

### Logout Event Dispatch

To manually trigger logout filter clearing from auth-related components, use:

```typescript
import { dispatchLogoutEvent } from '@/utils/auth-events';

// Call this when logout happens in your auth component
dispatchLogoutEvent();
```

## Storage Details

- **Storage Key:** `leads_table_filters`
- **Storage Type:** localStorage
- **Data Format:** JSON
- **Max Size:** Browser-dependent (typically 5-10MB)

### Stored Filter Data Structure

```json
{
  "globalSearch": "string",
  "selectedStatuses": [1, 2, 3],
  "selectedSources": [1],
  "selectedUsers": [1, 2],
  "selectedTowns": ["New York", "Boston"],
  "selectedOccupations": ["Engineer", "Manager"],
  "selectedCompanies": ["Company A"],
  "selectedInterests": ["Tech"],
  "createdDateRange": { "from": "2024-01-01T00:00:00Z", "to": null },
  "updatedDateRange": { "from": null, "to": null },
  "hasNotes": true,
  "hasCalls": null,
  "hasReminders": false,
  "hasCompletedReminders": null,
  "sortField": "name",
  "sortDirection": "asc",
  "pageSize": 25
}
```

## Browser Support

Works in all modern browsers that support:
- localStorage API
- JSON.stringify/parse
- CustomEvent
- Date objects

## Debugging

To check saved filters in the browser console:

```javascript
// View saved filters
console.log(JSON.parse(localStorage.getItem('leads_table_filters')));

// Clear filters manually
localStorage.removeItem('leads_table_filters');

// Trigger logout event
window.dispatchEvent(new CustomEvent('auth:logout'));
```

## Troubleshooting

### Filters not saving
- Check if localStorage is available in browser
- Check browser console for errors
- Ensure `usePersistedFilters` hook is properly initialized

### Filters not loading on page reload
- Ensure the component has `filtersLoaded` state set to false initially
- Check that load happens before setting individual filter states

### Filters not clearing on logout
- Import and use `dispatchLogoutEvent()` from `@/utils/auth-events` in logout handler
- Ensure the logout event is dispatched before redirecting to login page

## Performance Considerations

- Filter saves are debounced through React's state management
- Only saves when filters actually change (due to useEffect dependency array)
- LocalStorage writes are asynchronous and won't block UI
- Errors in localStorage operations are logged but don't crash the app
