'use client';

import { dispatchLogoutEvent } from '@/utils/auth-events';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';

/**
 * Component to automatically clear filters when user logs out
 *
 * This component watches the auth state from Inertia props
 * and dispatches a logout event when the user is no longer authenticated
 *
 * Add this to your root App or Layout component:
 *
 * <AuthStateWatcher />
 */
export function AuthStateWatcher() {
    const page = usePage();
    const auth = page.props.auth as
        | { user?: { id: number; name: string } }
        | undefined;

    useEffect(() => {
        // Store the previous auth state in session storage
        const prevAuthStateKey = 'prev_auth_state';
        const prevAuthState = sessionStorage.getItem(prevAuthStateKey);
        const currentAuthState = auth?.user
            ? 'authenticated'
            : 'unauthenticated';

        // If we were authenticated and now we're not, dispatch logout event
        if (
            prevAuthState === 'authenticated' &&
            currentAuthState === 'unauthenticated'
        ) {
            dispatchLogoutEvent();
        }

        // Update the stored auth state
        sessionStorage.setItem(prevAuthStateKey, currentAuthState);
    }, [auth?.user]);

    return null; // This component renders nothing, it just watches for auth changes
}
