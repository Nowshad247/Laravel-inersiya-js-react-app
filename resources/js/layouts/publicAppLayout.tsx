import { Head } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface PublicAppLayoutProps {
    title: string;
    description?: string;
    keywords?: string;
    author?: string;
    siteName: string;
    siteLogo?: string;
    siteAuthor?: string;
    contactEmail?: string;
    address?: string;
    facebookUrl?: string;
    twitterUrl?: string;
    linkedinUrl?: string;
    instagramUrl?: string;
    forceLightMode?: boolean;
    children: ReactNode;
}

export default function PublicAppLayout({
    title,
    description,
    keywords,
    author,
    siteName,
    siteLogo,
    siteAuthor,
    contactEmail,
    address,
    facebookUrl,
    twitterUrl,
    linkedinUrl,
    instagramUrl,
    forceLightMode = false,
    children,
}: PublicAppLayoutProps) {
    return (
        <>
            <Head title={title}>
                {description ? (
                    <meta name="description" content={description} />
                ) : null}
                {keywords ? <meta name="keywords" content={keywords} /> : null}
                {author ? <meta name="author" content={author} /> : null}
            </Head>

            <div className={forceLightMode ? 'bg-white text-black' : ''}>
                {children}
            </div>

            <footer
                className={
                    forceLightMode
                        ? 'border-t bg-white text-black'
                        : 'border-t bg-white dark:bg-[#0f0f0f]'
                }
            >
                <div className="mx-auto grid max-w-6xl gap-6 px-6 py-10 md:grid-cols-3">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            {siteLogo ? (
                                <img
                                    src={siteLogo}
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
                        {contactEmail ? (
                            <div>
                                <span className="font-medium">Email:</span>{' '}
                                <a
                                    href={`mailto:${contactEmail}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    {contactEmail}
                                </a>
                            </div>
                        ) : null}
                        {address ? (
                            <div>
                                <span className="font-medium">Address:</span>{' '}
                                <span>{address}</span>
                            </div>
                        ) : null}
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm">
                        <a
                            href="/admission"
                            className="text-blue-600 hover:underline"
                        >
                            Admission
                        </a>
                        {facebookUrl ? (
                            <a
                                href={facebookUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                Facebook
                            </a>
                        ) : null}
                        {twitterUrl ? (
                            <a
                                href={twitterUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                Twitter
                            </a>
                        ) : null}
                        {linkedinUrl ? (
                            <a
                                href={linkedinUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                LinkedIn
                            </a>
                        ) : null}
                        {instagramUrl ? (
                            <a
                                href={instagramUrl}
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
