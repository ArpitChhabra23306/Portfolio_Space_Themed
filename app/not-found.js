import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="relative rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] p-12 text-center max-w-md">
        <h1 className="text-7xl font-sans font-bold text-text-primary mb-4">
          404
        </h1>
        <p className="text-text-muted text-lg mb-8">
          This page doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-text-primary hover:bg-white/10 transition-colors text-sm font-medium"
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
