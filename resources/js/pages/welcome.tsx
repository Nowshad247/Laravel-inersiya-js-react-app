import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CertificateResult } from '@/types/CertificateResult';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useMemo } from 'react';

const UID_REGEX = /^SDC-[A-Z0-9-]{2,10}-\d{4}-\d{4}-[A-Z]-\d+$/;

interface Course {
    id: number;
    name: string;
}

interface MyPageProps extends Record<string, unknown> {
    status: boolean | null;
    message: string | null;
    data: CertificateResult | null;
}

interface PageProps extends Record<string, unknown> {
    auth: { user: unknown };
    name: string;
    settings: Record<string, any>;
}

function isCourse(value: unknown): value is Course {
    return typeof value === 'object' && value !== null && 'name' in value;
}

export default function Welcome() {
    const { props } = usePage<MyPageProps>();
    const { status, message, data: info } = props;

    const { auth, name, settings } = usePage<PageProps>().props;

    const { data, setData, post, processing, errors, reset } = useForm<{
        uid: string;
    }>({
        uid: '',
    });

    const normalizedUid = useMemo(
        () => data.uid.trim().toUpperCase(),
        [data.uid],
    );

    const isValidUid = UID_REGEX.test(normalizedUid);

    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (!isValidUid || processing) return;

        post('/certificate', {
            preserveScroll: true,
            onSuccess: () => reset('uid'),
        });
    }

    const isLoggedIn = !!auth.user;

    const siteName: string = settings?.site_name || name;
    const siteTitle: string = settings?.site_title || siteName;
    const siteDescription: string = settings?.site_description || '';
    const siteKeywords: string = settings?.site_keywords || '';
    const siteAuthor: string = settings?.site_author || '';

    return (
        <>
            <Head title={siteTitle}>
                {siteDescription && (
                    <meta name="description" content={siteDescription} />
                )}
                {siteKeywords && (
                    <meta name="keywords" content={siteKeywords} />
                )}
                {siteAuthor && <meta name="author" content={siteAuthor} />}
            </Head>

            {/* Header */}
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
            </header>

            {/* Main Content */}
            <main className="flex min-h-screen items-center justify-center bg-[#FDFDFC] p-6 dark:bg-[#0a0a0a]">
                <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-xl dark:bg-[#0f0f0f]">
                    <h1 className="mb-6 text-center text-2xl font-semibold">
                        Verify Your Certificate
                    </h1>

                    <form onSubmit={submit} className="space-y-4">
                        <Input
                            value={data.uid}
                            onChange={(e) => setData('uid', e.target.value)}
                            placeholder="SDC-DGM-2506-0001-M-12"
                            autoComplete="off"
                            spellCheck={false}
                            required
                        />

                        {!isValidUid && data.uid.length > 0 && (
                            <p className="text-sm text-red-500">
                                Invalid certificate format
                            </p>
                        )}

                        {errors.uid && (
                            <p className="text-sm text-red-500">{errors.uid}</p>
                        )}

                        <Button
                            type="submit"
                            disabled={!isValidUid || processing}
                            className="w-full"
                        >
                            {processing ? 'Verifying…' : 'Verify Certificate'}
                        </Button>
                    </form>

                    {status === true && info && (
                        <div className="mt-6 overflow-hidden rounded-lg border">
                            <div className="bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
                                ✅ Certificate is valid
                            </div>

                            <table className="w-full text-sm">
                                <tbody className="divide-y">
                                    {Object.entries(info).map(
                                        ([key, value]) => {
                                            let displayValue: React.ReactNode =
                                                '—';

                                            if (key === 'courses' && value) {
                                                if (Array.isArray(value)) {
                                                    displayValue = value
                                                        .filter(isCourse)
                                                        .map(
                                                            (course) =>
                                                                course.name,
                                                        )
                                                        .join(', ');
                                                } else if (isCourse(value)) {
                                                    displayValue = value.name;
                                                }
                                            } else if (
                                                typeof value === 'string' ||
                                                typeof value === 'number'
                                            ) {
                                                displayValue = value;
                                            }

                                            return (
                                                <tr key={key}>
                                                    <td className="px-4 py-2 font-medium">
                                                        {key
                                                            .replace(/_/g, ' ')
                                                            .replace(
                                                                /\b\w/g,
                                                                (c) =>
                                                                    c.toUpperCase(),
                                                            )}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        {displayValue}
                                                    </td>
                                                </tr>
                                            );
                                        },
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {status === false && (
                        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            ❌ {message}
                        </div>
                    )}
                </div>
            </main>

            <footer className="border-t bg-white dark:bg-[#0f0f0f]">
                <div className="mx-auto grid max-w-6xl gap-6 px-6 py-10 md:grid-cols-3">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            {settings?.site_logo ? (
                                <img
                                    src={settings.site_logo}
                                    alt={`${siteName} logo`}
                                    className="h-10 w-auto"
                                />
                            ) : null}
                            <div className="grid">
                                <span className="text-sm font-semibold">
                                    {siteName}
                                </span>
                                {siteAuthor ? (
                                    <span className="text-sm text-neutral-600 dark:text-neutral-300">
                                        {siteAuthor}
                                    </span>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 text-sm text-neutral-700 dark:text-neutral-200">
                        {settings?.contact_email ? (
                            <div>
                                <span className="font-medium">Email:</span>{' '}
                                <a
                                    href={`mailto:${settings.contact_email}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    {settings.contact_email}
                                </a>
                            </div>
                        ) : null}
                        {settings?.address ? (
                            <div>
                                <span className="font-medium">Address:</span>{' '}
                                <span>{settings.address}</span>
                            </div>
                        ) : null}
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm">
                        {settings?.facebook_url ? (
                            <a
                                href={settings.facebook_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                Facebook
                            </a>
                        ) : null}
                        {settings?.twitter_url ? (
                            <a
                                href={settings.twitter_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                Twitter
                            </a>
                        ) : null}
                        {settings?.linkedin_url ? (
                            <a
                                href={settings.linkedin_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                LinkedIn
                            </a>
                        ) : null}
                        {settings?.instagram_url ? (
                            <a
                                href={settings.instagram_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                Instagram
                            </a>
                        ) : null}
                    </div>
                </div>
            </footer>
        </>
    );
}
