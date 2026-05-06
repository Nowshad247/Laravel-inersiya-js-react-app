/**
 * Example: How to trigger filter cleanup on logout
 *
 * This file shows how to integrate filter persistence logout handling
 * with your actual logout flow.
 */

import { dispatchLogoutEvent } from '@/utils/auth-events';
import { router } from '@inertiajs/react';

/**
 * Example logout handler
 * Call this from your logout button or auth menu
 */
export const handleLogout = async (): Promise<void> => {
    // Dispatch the logout event BEFORE redirecting
    // This clears the saved filters immediately
    dispatchLogoutEvent();

    // Then proceed with your logout flow
    // Using Inertia router to post to /logout endpoint
    router.post(
        '/logout',
        {},
        {
            onSuccess: () => {
                // User will be redirected to login page automatically
                // Filters have already been cleared
            },
            onError: (errors) => {
                console.error('Logout failed:', errors);
            },
        },
    );
};

/**
 * Alternative: If you have a logout button in a dropdown menu
 */
export const LogoutButton = () => {
    const handleClick = () => {
        // Emit logout event
        dispatchLogoutEvent();

        // Post to logout endpoint
        router.post('/logout');
    };

    return <button onClick={handleClick}>Logout</button>;
};

/**
 * Usage in your Auth/Header component:
 *
 * import { handleLogout } from '@/examples/logout-integration'
 *
 * <Button onClick={handleLogout}>
 *     Logout
 * </Button>
 */
