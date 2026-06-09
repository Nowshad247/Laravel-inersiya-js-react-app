import PublicAppLayout from '@/layouts/publicAppLayout';
import { Link, usePage } from '@inertiajs/react';

interface SiteSettings {
    site_name?: string;
    site_title?: string;
    site_description?: string;
    site_keywords?: string;
    site_author?: string;
    site_logo?: string;
    contact_email?: string;
    address?: string;
    facebook_url?: string;
    twitter_url?: string;
    linkedin_url?: string;
    instagram_url?: string;
    [key: string]: string | undefined;
}

interface PageProps extends Record<string, unknown> {
    auth: { user: unknown };
    name: string;
    settings: SiteSettings;
}

export default function AdmissionIndex() {
    const { auth, name, settings } = usePage<PageProps>().props;
    const isLoggedIn = !!auth.user;
    const siteName: string = settings?.site_name || name;
    const siteTitle: string = settings?.site_title || siteName;
    const siteDescription: string = settings?.site_description || '';
    const siteKeywords: string = settings?.site_keywords || '';
    const siteAuthor: string = settings?.site_author || '';

    return (
        <PublicAppLayout
            title={siteTitle}
            description={siteDescription}
            keywords={siteKeywords}
            author={siteAuthor}
            siteName={siteName}
            siteLogo={settings?.site_logo}
            siteAuthor={siteAuthor}
            contactEmail={settings?.contact_email}
            address={settings?.address}
            facebookUrl={settings?.facebook_url}
            twitterUrl={settings?.twitter_url}
            linkedinUrl={settings?.linkedin_url}
            instagramUrl={settings?.instagram_url}
        >
            <header className="border-b bg-white dark:bg-[#0f0f0f]">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        {settings?.site_logo ? (
                            <img
                                src={settings.site_logo}
                                alt={`${siteName} logo`}
                                className="h-8 w-auto"
                            />
                        ) : null}
                        <h2 className="text-lg font-semibold">{siteName}</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/admission"
                            className="text-sm font-medium text-blue-600 hover:underline"
                        >
                            Admission
                        </Link>
                        {isLoggedIn ? (
                            <Link
                                href="/dashboard"
                                className="text-sm font-medium text-blue-600 hover:underline"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="text-sm font-medium text-blue-600 hover:underline"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            <main className="flex min-h-screen items-center justify-center bg-[#FDFDFC] p-6 dark:bg-[#0a0a0a]">
                <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-xl dark:bg-[#0f0f0f]">
                    <h1 className="mb-4 text-center text-2xl font-semibold">
                        Admission Dashboard
                    </h1>
                    <div className="text-center">
                        <Link
                            href="/admission/create"
                            className="inline-block rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            Apply for Admission
                        </Link>
                    </div>
                </div>
            </main>
        </PublicAppLayout>
    );
}
