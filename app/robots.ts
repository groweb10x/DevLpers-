import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/buyer-dashboard',
          '/admin-panel',
          '/admin',
          '/earnings',
          '/messages',
          '/report',
          '/api/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/dashboard',
          '/buyer-dashboard', 
          '/admin-panel',
          '/admin',
        ],
      },
    ],
    sitemap: 'https://develpers.com/sitemap.xml',
    host: 'https://develpers.com',
  };
}