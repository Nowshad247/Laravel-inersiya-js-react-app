/**
 * Utility functions for handling authentication events and side effects
 */

/**
 * Dispatch a logout event to notify listeners (like filters) that user is logging out
 */
export const dispatchLogoutEvent = (): void => {
    window.dispatchEvent(
        new CustomEvent('auth:logout', { detail: { timestamp: Date.now() } }),
    );
};

/**
 * Hook to handle logout and clear filters when redirected to login
 * This can be used in components or pages
 */
export const useHandleLogoutEffects = (): void => {
    // This is useful if you want to manually trigger logout effects
    // Call dispatchLogoutEvent() when logout happens
};
