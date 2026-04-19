import { usePage } from '@inertiajs/react';
import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    const { name, settings } = usePage().props as unknown as {
        name: string;
        settings?: { site_icon?: string | null };
    };

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                {settings?.site_icon ? (
                    <img
                        src={settings.site_icon}
                        alt={`${name} icon`}
                        className="size-6 object-contain"
                    />
                ) : (
                    <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
                )}
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {name}
                </span>
                <span className="text-sidebar-secondary-foreground truncate text-xs leading-tight font-medium">
                    Admin Panel
                </span>
            </div>
        </>
    );
}
