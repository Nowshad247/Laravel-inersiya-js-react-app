export interface SiteSettings {
    site_name: string;
    site_title: string;
    site_description: string;
    site_keywords: string;
    site_author: string;
    site_logo: string | null;
    site_icon: string | null;
    site_cover_image: string | null;
    site_url: string;
    site_favicon: string | null;

    contact_email: string;
    contact_phone: string;
    address: string;

    facebook_url: string;
    twitter_url: string;
    linkedin_url: string;
    instagram_url: string;

    meta_title: string;
    meta_description: string;
    meta_keywords: string;

    google_analytics_id: string;

    maintenance_mode: 'on' | 'off';
    timezone: string;
    date_format: string;
    time_format: string;

    default_language: string;

    currency: string;
    currency_symbol: string;
    currency_position: 'left' | 'right';
    decimal_separator: string;
    thousand_separator: string;
    number_of_decimals: number;

    enable_registration: boolean;
    default_user_role: 'student' | 'admin' | 'teacher' | string;

    SMTP: 'on' | 'off';
    SMTP_HOST: string;
    SMTP_PORT: string | number;
    SMTP_USERNAME: string;
    SMTP_PASSWORD: string;
    SMTP_ENCRYPTION: 'tls' | 'ssl' | '';
}
