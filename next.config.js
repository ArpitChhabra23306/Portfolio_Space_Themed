/** @type {import('next').NextConfig} */

// NEXT_PUBLIC_SITE_URL powers SEO (sitemap, JSON-LD, OG tags). It's strongly
// recommended, but we don't hard-fail the build if it's missing — on Vercel we
// can fall back to the auto-provided VERCEL_URL, and consumers have their own
// default. Warn loudly so it's not forgotten.
if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_SITE_URL) {
  if (process.env.VERCEL_URL) {
    process.env.NEXT_PUBLIC_SITE_URL = `https://${process.env.VERCEL_URL}`;
  }
  console.warn(
    "[next.config] NEXT_PUBLIC_SITE_URL is not set. " +
      (process.env.VERCEL_URL
        ? `Falling back to https://${process.env.VERCEL_URL}. Set your custom domain in Vercel env vars for stable SEO URLs.`
        : "SEO URLs (sitemap, JSON-LD, OG tags) may be incorrect. Set it in your deploy environment.")
  );
}

const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

module.exports = nextConfig;
