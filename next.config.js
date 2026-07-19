/** @type {import('next').NextConfig} */

// Build-time validation: NEXT_PUBLIC_SITE_URL is required for SEO (sitemap, JSON-LD, OG tags)
if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_SITE_URL) {
  throw new Error(
    "Missing required environment variable: NEXT_PUBLIC_SITE_URL. " +
      "Set it to the absolute URL of the deployed site (e.g., https://arpit.dev)."
  );
}

const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

module.exports = nextConfig;
