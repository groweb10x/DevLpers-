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
    sitemap: 'https://www.develpers.com/sitemap.xml',
    host: 'https://www.develpers.com',
  };
}