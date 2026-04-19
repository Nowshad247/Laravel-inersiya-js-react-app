import { Form, Head } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type BreadcrumbItem } from '@/types';
import { useEffect, useState } from 'react';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import adminRoutes from '@/routes/admin';
import type { SiteSettings } from '@/types/SiteSettings';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Site settings',
        href: adminRoutes.settings().url,
    },
];

export default function SiteSettings({
    siteSettings,
}: {
    siteSettings: SiteSettings;
}) {
    const [previews, setPreviews] = useState<{
        site_logo?: string;
        site_icon?: string;
        site_cover_image?: string;
        site_favicon?: string;
    }>({});

    useEffect(() => {
        return () => {
            Object.values(previews).forEach((url) => {
                if (url) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, [previews]);

    function setPreview(key: keyof typeof previews, file: File | null) {
        setPreviews((current) => {
            const next = { ...current };

            const previousUrl = next[key];
            if (previousUrl) {
                URL.revokeObjectURL(previousUrl);
            }

            if (file) {
                next[key] = URL.createObjectURL(file);
            } else {
                delete next[key];
            }

            return next;
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Site settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Site settings"
                        description="Update your website configuration and SEO settings"
                    />

                    <Form
                        {...adminRoutes.settings.update.form()}
                        options={{ preserveScroll: true }}
                        encType="multipart/form-data"
                        className="space-y-10"
                    >
                        {({ errors, processing, recentlySuccessful }) => (
                            <>
                                <section className="space-y-6 rounded-xl border border-muted bg-background p-6">
                                    <h2 className="text-lg font-semibold">
                                        Website details
                                    </h2>
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="site_name">
                                                Site name
                                            </Label>
                                            <Input
                                                id="site_name"
                                                name="site_name"
                                                defaultValue={
                                                    siteSettings.site_name
                                                }
                                                placeholder="Site name"
                                            />
                                            <InputError
                                                message={errors.site_name}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="site_title">
                                                Site title
                                            </Label>
                                            <Input
                                                id="site_title"
                                                name="site_title"
                                                defaultValue={
                                                    siteSettings.site_title
                                                }
                                                placeholder="Site title"
                                            />
                                            <InputError
                                                message={errors.site_title}
                                            />
                                        </div>

                                        <div className="grid gap-2 md:col-span-2">
                                            <Label htmlFor="site_description">
                                                Site description
                                            </Label>
                                            <Textarea
                                                id="site_description"
                                                name="site_description"
                                                defaultValue={
                                                    siteSettings.site_description
                                                }
                                                placeholder="A short description of your website"
                                            />
                                            <InputError
                                                message={
                                                    errors.site_description
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="site_keywords">
                                                Site keywords
                                            </Label>
                                            <Input
                                                id="site_keywords"
                                                name="site_keywords"
                                                defaultValue={
                                                    siteSettings.site_keywords
                                                }
                                                placeholder="Laravel, course management, education"
                                            />
                                            <InputError
                                                message={errors.site_keywords}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="site_author">
                                                Site author
                                            </Label>
                                            <Input
                                                id="site_author"
                                                name="site_author"
                                                defaultValue={
                                                    siteSettings.site_author
                                                }
                                                placeholder="LaraCraft Team"
                                            />
                                            <InputError
                                                message={errors.site_author}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="site_url">
                                                Site URL
                                            </Label>
                                            <Input
                                                id="site_url"
                                                name="site_url"
                                                type="url"
                                                defaultValue={
                                                    siteSettings.site_url
                                                }
                                                placeholder="http://localhost"
                                            />
                                            <InputError
                                                message={errors.site_url}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="site_logo">
                                                Site logo
                                            </Label>
                                            <Input
                                                id="site_logo"
                                                name="site_logo"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    setPreview(
                                                        'site_logo',
                                                        e.target.files?.[0] ??
                                                            null,
                                                    )
                                                }
                                            />
                                            {(previews.site_logo ??
                                                siteSettings.site_logo) && (
                                                <img
                                                    src={
                                                        previews.site_logo ??
                                                        siteSettings.site_logo ??
                                                        ''
                                                    }
                                                    alt="Site logo preview"
                                                    className="h-16 w-auto rounded-md border bg-muted object-contain p-2"
                                                />
                                            )}
                                            <InputError
                                                message={errors.site_logo}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="site_icon">
                                                Site icon
                                            </Label>
                                            <Input
                                                id="site_icon"
                                                name="site_icon"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    setPreview(
                                                        'site_icon',
                                                        e.target.files?.[0] ??
                                                            null,
                                                    )
                                                }
                                            />
                                            {(previews.site_icon ??
                                                siteSettings.site_icon) && (
                                                <img
                                                    src={
                                                        previews.site_icon ??
                                                        siteSettings.site_icon ??
                                                        ''
                                                    }
                                                    alt="Site icon preview"
                                                    className="h-16 w-16 rounded-md border bg-muted object-contain p-2"
                                                />
                                            )}
                                            <InputError
                                                message={errors.site_icon}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="site_cover_image">
                                                Cover image
                                            </Label>
                                            <Input
                                                id="site_cover_image"
                                                name="site_cover_image"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    setPreview(
                                                        'site_cover_image',
                                                        e.target.files?.[0] ??
                                                            null,
                                                    )
                                                }
                                            />
                                            {(previews.site_cover_image ??
                                                siteSettings.site_cover_image) && (
                                                <img
                                                    src={
                                                        previews.site_cover_image ??
                                                        siteSettings.site_cover_image ??
                                                        ''
                                                    }
                                                    alt="Cover image preview"
                                                    className="h-24 w-full rounded-md border bg-muted object-cover"
                                                />
                                            )}
                                            <InputError
                                                message={
                                                    errors.site_cover_image
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="site_favicon">
                                                Site favicon
                                            </Label>
                                            <Input
                                                id="site_favicon"
                                                name="site_favicon"
                                                type="file"
                                                accept="image/png,image/svg+xml,image/x-icon"
                                                onChange={(e) =>
                                                    setPreview(
                                                        'site_favicon',
                                                        e.target.files?.[0] ??
                                                            null,
                                                    )
                                                }
                                            />
                                            {(previews.site_favicon ??
                                                siteSettings.site_favicon) && (
                                                <img
                                                    src={
                                                        previews.site_favicon ??
                                                        siteSettings.site_favicon ??
                                                        ''
                                                    }
                                                    alt="Favicon preview"
                                                    className="h-10 w-10 rounded-md border bg-muted object-contain p-1"
                                                />
                                            )}
                                            <InputError
                                                message={errors.site_favicon}
                                            />
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-6 rounded-xl border border-muted bg-background p-6">
                                    <h2 className="text-lg font-semibold">
                                        Contact / social
                                    </h2>
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="contact_email">
                                                Contact email
                                            </Label>
                                            <Input
                                                id="contact_email"
                                                name="contact_email"
                                                type="email"
                                                defaultValue={
                                                    siteSettings.contact_email
                                                }
                                                placeholder="contact@example.com"
                                            />
                                            <InputError
                                                message={errors.contact_email}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="contact_phone">
                                                Contact phone
                                            </Label>
                                            <Input
                                                id="contact_phone"
                                                name="contact_phone"
                                                defaultValue={
                                                    siteSettings.contact_phone
                                                }
                                                placeholder="+880 1234 567890"
                                            />
                                            <InputError
                                                message={errors.contact_phone}
                                            />
                                        </div>

                                        <div className="grid gap-2 md:col-span-2">
                                            <Label htmlFor="address">
                                                Address
                                            </Label>
                                            <Textarea
                                                id="address"
                                                name="address"
                                                defaultValue={
                                                    siteSettings.address
                                                }
                                                placeholder="123 Main Street, City, Country"
                                            />
                                            <InputError
                                                message={errors.address}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="facebook_url">
                                                Facebook URL
                                            </Label>
                                            <Input
                                                id="facebook_url"
                                                name="facebook_url"
                                                type="url"
                                                defaultValue={
                                                    siteSettings.facebook_url
                                                }
                                                placeholder="https://facebook.com/yourpage"
                                            />
                                            <InputError
                                                message={errors.facebook_url}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="twitter_url">
                                                Twitter URL
                                            </Label>
                                            <Input
                                                id="twitter_url"
                                                name="twitter_url"
                                                type="url"
                                                defaultValue={
                                                    siteSettings.twitter_url
                                                }
                                                placeholder="https://twitter.com/yourhandle"
                                            />
                                            <InputError
                                                message={errors.twitter_url}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="linkedin_url">
                                                LinkedIn URL
                                            </Label>
                                            <Input
                                                id="linkedin_url"
                                                name="linkedin_url"
                                                type="url"
                                                defaultValue={
                                                    siteSettings.linkedin_url
                                                }
                                                placeholder="https://linkedin.com/company/yourorg"
                                            />
                                            <InputError
                                                message={errors.linkedin_url}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="instagram_url">
                                                Instagram URL
                                            </Label>
                                            <Input
                                                id="instagram_url"
                                                name="instagram_url"
                                                type="url"
                                                defaultValue={
                                                    siteSettings.instagram_url
                                                }
                                                placeholder="https://instagram.com/yourhandle"
                                            />
                                            <InputError
                                                message={errors.instagram_url}
                                            />
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-6 rounded-xl border border-muted bg-background p-6">
                                    <h2 className="text-lg font-semibold">
                                        SEO & analytics
                                    </h2>
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="meta_title">
                                                Meta title
                                            </Label>
                                            <Input
                                                id="meta_title"
                                                name="meta_title"
                                                defaultValue={
                                                    siteSettings.meta_title
                                                }
                                                placeholder="LaraCraft - Course Management System"
                                            />
                                            <InputError
                                                message={errors.meta_title}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="meta_keywords">
                                                Meta keywords
                                            </Label>
                                            <Input
                                                id="meta_keywords"
                                                name="meta_keywords"
                                                defaultValue={
                                                    siteSettings.meta_keywords
                                                }
                                                placeholder="Laravel, course management, education"
                                            />
                                            <InputError
                                                message={errors.meta_keywords}
                                            />
                                        </div>

                                        <div className="grid gap-2 md:col-span-2">
                                            <Label htmlFor="meta_description">
                                                Meta description
                                            </Label>
                                            <Textarea
                                                id="meta_description"
                                                name="meta_description"
                                                defaultValue={
                                                    siteSettings.meta_description
                                                }
                                                placeholder="A comprehensive course management system built with Laravel."
                                            />
                                            <InputError
                                                message={
                                                    errors.meta_description
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-2 md:col-span-2">
                                            <Label htmlFor="google_analytics_id">
                                                Google Analytics ID
                                            </Label>
                                            <Input
                                                id="google_analytics_id"
                                                name="google_analytics_id"
                                                defaultValue={
                                                    siteSettings.google_analytics_id
                                                }
                                                placeholder="UA-XXXXXX-X"
                                            />
                                            <InputError
                                                message={
                                                    errors.google_analytics_id
                                                }
                                            />
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-6 rounded-xl border border-muted bg-background p-6">
                                    <h2 className="text-lg font-semibold">
                                        Platform settings
                                    </h2>
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="maintenance_mode">
                                                Maintenance mode
                                            </Label>
                                            <Input
                                                id="maintenance_mode"
                                                name="maintenance_mode"
                                                defaultValue={
                                                    siteSettings.maintenance_mode
                                                }
                                                placeholder="on or off"
                                            />
                                            <InputError
                                                message={
                                                    errors.maintenance_mode
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="timezone">
                                                Timezone
                                            </Label>
                                            <Input
                                                id="timezone"
                                                name="timezone"
                                                defaultValue={
                                                    siteSettings.timezone
                                                }
                                                placeholder="UTC"
                                            />
                                            <InputError
                                                message={errors.timezone}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="date_format">
                                                Date format
                                            </Label>
                                            <Input
                                                id="date_format"
                                                name="date_format"
                                                defaultValue={
                                                    siteSettings.date_format
                                                }
                                                placeholder="Y-m-d"
                                            />
                                            <InputError
                                                message={errors.date_format}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="time_format">
                                                Time format
                                            </Label>
                                            <Input
                                                id="time_format"
                                                name="time_format"
                                                defaultValue={
                                                    siteSettings.time_format
                                                }
                                                placeholder="H:i:s"
                                            />
                                            <InputError
                                                message={errors.time_format}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="default_language">
                                                Default language
                                            </Label>
                                            <Input
                                                id="default_language"
                                                name="default_language"
                                                defaultValue={
                                                    siteSettings.default_language
                                                }
                                                placeholder="en"
                                            />
                                            <InputError
                                                message={
                                                    errors.default_language
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="default_user_role">
                                                Default user role
                                            </Label>
                                            <Input
                                                id="default_user_role"
                                                name="default_user_role"
                                                defaultValue={
                                                    siteSettings.default_user_role
                                                }
                                                placeholder="student"
                                            />
                                            <InputError
                                                message={
                                                    errors.default_user_role
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="currency">
                                                Currency
                                            </Label>
                                            <Input
                                                id="currency"
                                                name="currency"
                                                defaultValue={
                                                    siteSettings.currency
                                                }
                                                placeholder="TK"
                                            />
                                            <InputError
                                                message={errors.currency}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="currency_symbol">
                                                Currency symbol
                                            </Label>
                                            <Input
                                                id="currency_symbol"
                                                name="currency_symbol"
                                                defaultValue={
                                                    siteSettings.currency_symbol
                                                }
                                                placeholder="৳"
                                            />
                                            <InputError
                                                message={errors.currency_symbol}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="currency_position">
                                                Currency position
                                            </Label>
                                            <Input
                                                id="currency_position"
                                                name="currency_position"
                                                defaultValue={
                                                    siteSettings.currency_position
                                                }
                                                placeholder="left or right"
                                            />
                                            <InputError
                                                message={
                                                    errors.currency_position
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="decimal_separator">
                                                Decimal separator
                                            </Label>
                                            <Input
                                                id="decimal_separator"
                                                name="decimal_separator"
                                                defaultValue={
                                                    siteSettings.decimal_separator
                                                }
                                                placeholder="."
                                            />
                                            <InputError
                                                message={
                                                    errors.decimal_separator
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="thousand_separator">
                                                Thousand separator
                                            </Label>
                                            <Input
                                                id="thousand_separator"
                                                name="thousand_separator"
                                                defaultValue={
                                                    siteSettings.thousand_separator
                                                }
                                                placeholder=","
                                            />
                                            <InputError
                                                message={
                                                    errors.thousand_separator
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="number_of_decimals">
                                                Number of decimals
                                            </Label>
                                            <Input
                                                id="number_of_decimals"
                                                name="number_of_decimals"
                                                type="number"
                                                defaultValue={
                                                    siteSettings.number_of_decimals
                                                }
                                                placeholder="2"
                                            />
                                            <InputError
                                                message={
                                                    errors.number_of_decimals
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="enable_registration">
                                                Enable registration
                                            </Label>
                                            <Input
                                                id="enable_registration"
                                                name="enable_registration"
                                                defaultValue={String(
                                                    siteSettings.enable_registration,
                                                )}
                                                placeholder="true or false"
                                            />
                                            <InputError
                                                message={
                                                    errors.enable_registration
                                                }
                                            />
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-6 rounded-xl border border-muted bg-background p-6">
                                    <h2 className="text-lg font-semibold">
                                        SMTP settings
                                    </h2>
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="SMTP">SMTP</Label>
                                            <Input
                                                id="SMTP"
                                                name="SMTP"
                                                defaultValue={siteSettings.SMTP}
                                                placeholder="on or off"
                                            />
                                            <InputError message={errors.SMTP} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="SMTP_HOST">
                                                SMTP host
                                            </Label>
                                            <Input
                                                id="SMTP_HOST"
                                                name="SMTP_HOST"
                                                defaultValue={
                                                    siteSettings.SMTP_HOST
                                                }
                                                placeholder="smtp.example.com"
                                            />
                                            <InputError
                                                message={errors.SMTP_HOST}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="SMTP_PORT">
                                                SMTP port
                                            </Label>
                                            <Input
                                                id="SMTP_PORT"
                                                name="SMTP_PORT"
                                                defaultValue={String(
                                                    siteSettings.SMTP_PORT,
                                                )}
                                                placeholder="587"
                                            />
                                            <InputError
                                                message={errors.SMTP_PORT}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="SMTP_USERNAME">
                                                SMTP username
                                            </Label>
                                            <Input
                                                id="SMTP_USERNAME"
                                                name="SMTP_USERNAME"
                                                defaultValue={
                                                    siteSettings.SMTP_USERNAME
                                                }
                                                placeholder="username"
                                            />
                                            <InputError
                                                message={errors.SMTP_USERNAME}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="SMTP_PASSWORD">
                                                SMTP password
                                            </Label>
                                            <Input
                                                id="SMTP_PASSWORD"
                                                name="SMTP_PASSWORD"
                                                type="password"
                                                defaultValue={
                                                    siteSettings.SMTP_PASSWORD
                                                }
                                                placeholder="password"
                                            />
                                            <InputError
                                                message={errors.SMTP_PASSWORD}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="SMTP_ENCRYPTION">
                                                SMTP encryption
                                            </Label>
                                            <Input
                                                id="SMTP_ENCRYPTION"
                                                name="SMTP_ENCRYPTION"
                                                defaultValue={
                                                    siteSettings.SMTP_ENCRYPTION
                                                }
                                                placeholder="tls or ssl"
                                            />
                                            <InputError
                                                message={errors.SMTP_ENCRYPTION}
                                            />
                                        </div>
                                    </div>
                                </section>

                                <div className="flex items-center gap-4">
                                    <Button disabled={processing} type="submit">
                                        Save site settings
                                    </Button>

                                    <p className="text-sm text-neutral-600">
                                        {recentlySuccessful ? 'Saved' : ''}
                                    </p>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
