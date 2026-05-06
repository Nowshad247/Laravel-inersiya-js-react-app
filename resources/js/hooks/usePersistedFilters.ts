import { useCallback } from 'react';

interface DateRange {
    from: Date | undefined;
    to: Date | undefined;
}

interface FilterState {
    globalSearch: string;
    selectedStatuses: number[];
    selectedSources: number[];
    selectedUsers: number[];
    selectedTowns: string[];
    selectedOccupations: string[];
    selectedCompanies: string[];
    selectedInterests: string[];
    createdDateRange: DateRange;
    updatedDateRange: DateRange;
    hasNotes: boolean | null;
    hasCalls: boolean | null;
    hasReminders: boolean | null;
    hasCompletedReminders: boolean | null;
    sortField: string | null;
    sortDirection: 'asc' | 'desc' | null;
    pageSize: number;
}

const STORAGE_KEY = 'leads_table_filters';

export const usePersistedFilters = () => {
    /**
     * Save filter state to localStorage
     */
    const saveFilters = useCallback((filters: Partial<FilterState>) => {
        try {
            const existingFilters = loadFilters();
            const updatedFilters = { ...existingFilters, ...filters };

            // Convert Date objects to ISO strings for serialization
            const serializedFilters = {
                ...updatedFilters,
                createdDateRange: {
                    from: updatedFilters.createdDateRange?.from
                        ? updatedFilters.createdDateRange.from.toISOString()
                        : undefined,
                    to: updatedFilters.createdDateRange?.to
                        ? updatedFilters.createdDateRange.to.toISOString()
                        : undefined,
                },
                updatedDateRange: {
                    from: updatedFilters.updatedDateRange?.from
                        ? updatedFilters.updatedDateRange.from.toISOString()
                        : undefined,
                    to: updatedFilters.updatedDateRange?.to
                        ? updatedFilters.updatedDateRange.to.toISOString()
                        : undefined,
                },
            };

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(serializedFilters),
            );
        } catch (error) {
            console.error('Failed to save filters to localStorage:', error);
        }
    }, []);

    /**
     * Load filter state from localStorage
     */
    const loadFilters = useCallback((): Partial<FilterState> => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) return {};

            const parsed = JSON.parse(stored);

            // Convert ISO strings back to Date objects
            return {
                ...parsed,
                createdDateRange: {
                    from: parsed.createdDateRange?.from
                        ? new Date(parsed.createdDateRange.from)
                        : undefined,
                    to: parsed.createdDateRange?.to
                        ? new Date(parsed.createdDateRange.to)
                        : undefined,
                },
                updatedDateRange: {
                    from: parsed.updatedDateRange?.from
                        ? new Date(parsed.updatedDateRange.from)
                        : undefined,
                    to: parsed.updatedDateRange?.to
                        ? new Date(parsed.updatedDateRange.to)
                        : undefined,
                },
            };
        } catch (error) {
            console.error('Failed to load filters from localStorage:', error);
            return {};
        }
    }, []);

    /**
     * Clear all filters from localStorage
     */
    const clearFilters = useCallback(() => {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('Failed to clear filters from localStorage:', error);
        }
    }, []);

    /**
     * Listen for logout events and clear filters
     * Call this in useEffect with an empty dependency array
     */
    const setupLogoutListener = useCallback(() => {
        const handleLogout = () => {
            clearFilters();
        };

        // Listen for custom logout event
        window.addEventListener('auth:logout', handleLogout);

        // Also listen for storage changes from other tabs
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'auth_token' && !e.newValue) {
                clearFilters();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Listen for page visibility changes to detect if logout happened in another tab
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                // Check if user is now on login page (they were redirected there)
                if (window.location.pathname.includes('/login')) {
                    clearFilters();
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('auth:logout', handleLogout);
            window.removeEventListener('storage', handleStorageChange);
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange,
            );
        };
    }, [clearFilters]);

    return {
        saveFilters,
        loadFilters,
        clearFilters,
        setupLogoutListener,
    };
};
