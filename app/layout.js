import { GeistSans } from "geist/font/sans";
import { Newsreader, JetBrains_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import dynamic from "next/dynamic";
import { buildPersonLD } from "@/lib/seo";
import Nav from "@/components/shared/Nav";
import Footer from "@/components/shared/Footer";
import ReadingProgressBar from "@/components/sections/extras/ReadingProgressBar";
import BackToTop from "@/components/sections/extras/BackToTop";
import SmoothScroller from "@/components/shared/SmoothScroller";
import "./globals.css";

const CustomCursor = dynamic(
  () => import("@/components/sections/extras/CustomCursor"),
  { ssr: false }
);

const KonamiOverlay = dynamic(
  () => import("@/components/sections/extras/KonamiOverlay"),
  { ssr: false }
);

const TerminalLoader = dynamic(
  () => import("@/components/shared/TerminalLoader"),
  { ssr: false }
);

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
  style: ["italic"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Arpit Chhabra — Full-Stack Developer",
  description:
    "Personal portfolio of Arpit Chhabra, B.Tech IT student at IIIT Una. Full-stack developer specializing in MERN stack.",
};

export default function RootLayout({ children }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const personLD = buildPersonLD();

  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${GeistSans.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          id="ld-person"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLD) }}
        />
      </head>
      <body className="font-sans bg-ink-950 text-text-primary antialiased">
        <SmoothScroller>
          <TerminalLoader />
          <ReadingProgressBar />
          <Nav />
          {children}
          <Footer />
          <BackToTop />
          <CustomCursor />
          <KonamiOverlay />
          {gaId && <GoogleAnalytics gaId={gaId} />}
        </SmoothScroller>
      </body>
    </html>
  );
}
