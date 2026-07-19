import {
  Github,
  Linkedin,
  Twitter,
  Code2,
  ChefHat,
  Orbit,
  Mail,
  Phone,
  MapPin,
  Clock,
  ExternalLink,
} from "lucide-react";
import GlassCard from "@/components/shared/GlassCard";
import { readMdx } from "@/lib/content";
import { CONTACT, SOCIALS } from "@/lib/site";

const ICONS = {
  github: Github,
  linkedin: Linkedin,
  x: Twitter,
  leetcode: Code2,
  codechef: ChefHat,
  codolio: Orbit,
};

async function getAboutData() {
  const { frontmatter } = await readMdx("about.mdx");
  return frontmatter;
}

/** Direct-contact row (email / phone) — plain row, no boxed background, just a divider below. */
function ChannelRow({ icon: Icon, iconClass, label, value, href, last }) {
  const body = (
    <>
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconClass}`}>
        <Icon size={15} aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] text-text-dim leading-none mb-1.5">{label}</span>
        <span className="block text-sm text-text-primary truncate">{value}</span>
      </span>
    </>
  );
  const base = `flex items-center gap-3.5 py-3 ${last ? "" : "border-b border-white/[0.05]"}`;
  return href ? (
    <a
      href={href}
      className={`group ${base} hover:pl-1 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-ember rounded-lg`}
    >
      {body}
    </a>
  ) : (
    <div className={base}>{body}</div>
  );
}

/** Social profile chip — airy, minimal border so the grid doesn't feel boxed-in. */
function SocialChip({ social }) {
  const Icon = ICONS[social.key] || ExternalLink;
  const linked = Boolean(social.href);

  const body = (
    <>
      <Icon
        size={15}
        className="shrink-0 text-text-dim group-hover:text-accent-ember transition-colors"
        aria-hidden="true"
      />
      <span className="min-w-0 flex-1">
        <span className="block text-sm text-text-primary leading-none mb-1">{social.label}</span>
        <span className="block text-[11px] text-text-dim truncate leading-none">
          {social.handle || (linked ? "\u00A0" : "Coming soon")}
        </span>
      </span>
      {linked && (
        <ExternalLink
          size={12}
          className="shrink-0 text-text-dim/40 group-hover:text-accent-ember transition-colors"
          aria-hidden="true"
        />
      )}
    </>
  );

  const base = "group flex items-center gap-2.5 py-2.5 px-3 rounded-lg";

  return linked ? (
    <a
      href={social.href}
      target="_blank"
      rel="me noopener noreferrer"
      className={`${base} hover:bg-white/[0.05] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-ember`}
    >
      {body}
    </a>
  ) : (
    <div className={`${base} opacity-45 cursor-default`} title="Add this link in lib/site.js">
      {body}
    </div>
  );
}

export default async function SocialsGrid() {
  const about = await getAboutData();
  const hasPhone = Boolean(CONTACT.phone);

  return (
    <GlassCard className="p-6 md:p-7 flex flex-col gap-6">
      {/* Availability */}
      {about.openToWork && (
        <div className="inline-flex items-center gap-2 self-start rounded-full bg-green-500/10 border border-green-500/20 px-3 py-1.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
          </span>
          <span className="text-xs font-medium text-green-400">Available for work</span>
        </div>
      )}

      {/* Direct contact — email + phone */}
      <div className="mt-2">
        <h3 className="text-[11px] font-medium text-text-dim uppercase tracking-[0.25em] mb-1">
          Direct channel
        </h3>
        <div>
          <ChannelRow
            icon={Mail}
            iconClass="bg-accent-ember/10 text-accent-ember"
            label="Email"
            value={CONTACT.email}
            href={`mailto:${CONTACT.email}`}
          />
          <ChannelRow
            icon={Phone}
            iconClass="bg-accent-violet/15 text-accent-violet"
            label="Phone"
            value={hasPhone ? CONTACT.phone : "Available on request"}
            href={hasPhone ? `tel:${CONTACT.phone.replace(/\s+/g, "")}` : null}
            last
          />
        </div>
      </div>

      {/* Profiles */}
      <div>
        <h3 className="text-[11px] font-medium text-text-dim uppercase tracking-[0.25em] mb-2">
          Find me across the galaxy
        </h3>
        <div className="grid grid-cols-2 gap-x-2 gap-y-1">
          {SOCIALS.map((social) => (
            <SocialChip key={social.key} social={social} />
          ))}
        </div>
      </div>

      {/* Location + timezone */}
      <div className="mt-1 pt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/5">
        <div className="flex items-center gap-2 text-text-muted">
          <MapPin size={15} className="shrink-0" aria-hidden="true" />
          <span className="text-sm">{CONTACT.location || about.location}</span>
        </div>
        <div className="flex items-center gap-2 text-text-muted">
          <Clock size={15} className="shrink-0" aria-hidden="true" />
          <span className="text-sm">{CONTACT.timezone || about.timezone}</span>
        </div>
      </div>
    </GlassCard>
  );
}
