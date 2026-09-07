import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Tool redirects — old URLs to /tools/
      { source: '/bmi-calculator', destination: '/tools/bmi-calculator', permanent: true },
      { source: '/loan-emi-calculator', destination: '/tools/loan-emi-calculator', permanent: true },
      { source: '/percentage-calculator', destination: '/tools/percentage-calculator', permanent: true },
      { source: '/unit-converter', destination: '/tools/unit-converter', permanent: true },
      { source: '/image-format-converter', destination: '/tools/image-format-converter', permanent: true },
      { source: '/image-compressor', destination: '/tools/image-compressor', permanent: true },
      { source: '/image-resizer', destination: '/tools/image-resizer', permanent: true },
      { source: '/favicon-generator', destination: '/tools/favicon-generator', permanent: true },
      { source: '/invoice-generator', destination: '/tools/invoice-generator', permanent: true },
      { source: '/freelancer-rate-calculator', destination: '/tools/freelancer-rate-calculator', permanent: true },
      { source: '/code-line-counter', destination: '/tools/code-line-counter', permanent: true },
      { source: '/urdu-word-counter', destination: '/tools/urdu-word-counter', permanent: true },
      { source: '/da-pa-checker', destination: '/tools/da-pa-checker', permanent: true },
      { source: '/spam-score-checker', destination: '/tools/spam-score-checker', permanent: true },
      { source: '/backlink-checker', destination: '/tools/backlink-checker', permanent: true },
      { source: '/devlpers-backlink-indexer', destination: '/tools/devlpers-backlink-indexer', permanent: true },
      { source: '/youtube-thumbnail-downloader', destination: '/tools/youtube-thumbnail-downloader', permanent: true },
      { source: '/meta-tag-generator', destination: '/tools/meta-tag-generator', permanent: true },
      { source: '/robots-txt-generator', destination: '/tools/robots-txt-generator', permanent: true },
      { source: '/htaccess-generator', destination: '/tools/htaccess-generator', permanent: true },
      { source: '/article-generator', destination: '/tools/article-generator', permanent: true },
    ];
  },
};

export default nextConfig;