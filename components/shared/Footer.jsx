import { Github, Linkedin, Mail } from "lucide-react";

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/arpit-chhabra",
    icon: Github,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/arpitchhabra",
    icon: Linkedin,
  },
  {
    label: "Email",
    href: "mailto:arpit@example.com",
    icon: Mail,
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-32 pb-10 pt-12">
      {/* Glass divider */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
          {/* Left — Name + copyright */}
          <div>
            <p className="text-text-primary font-sans font-semibold text-lg">
              Arpit Chhabra
            </p>
            <p className="text-text-muted text-sm mt-1">
              &copy; {year} All rights reserved.
            </p>
          </div>

          {/* Center — Attribution */}
          <div className="flex justify-center">
            <p className="text-text-dim text-sm">
              Built with{" "}
              <a
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                Next.js
              </a>
            </p>
          </div>

          {/* Right — Social links */}
          <div className="flex items-center justify-center md:justify-end gap-4">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                aria-label={label}
                className="text-text-muted hover:text-accent-ember transition-colors"
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
