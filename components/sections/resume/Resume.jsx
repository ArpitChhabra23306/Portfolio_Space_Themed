import { FileText, Download, ExternalLink } from "lucide-react";
import Section from "@/components/shared/Section";
import SectionHeading from "@/components/shared/SectionHeading";
import GlassCard from "@/components/shared/GlassCard";
import ResumeMirror from "./ResumeMirror";

const RESUME_PDF_PATH = "/resume/Arpit-Chhabra-Resume.pdf";
const DOWNLOAD_FILENAME = "Arpit-Chhabra-Resume.pdf";

/**
 * Resume section — a compact call-to-action card (download / open) instead of a
 * heavy embedded PDF viewer. A visually-hidden HTML mirror keeps the content
 * readable by ATS crawlers and screen readers.
 */
export default function Resume() {
  return (
    <Section id="resume">
      <SectionHeading
        eyebrow="Dossier"
        subtitle="The full story in a single page."
      >
        Resume
      </SectionHeading>

      <div className="flex justify-center">
        <GlassCard className="w-full max-w-xl p-8 sm:p-10">
          <div className="flex flex-col items-center text-center gap-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-ember/10 border border-accent-ember/20 text-accent-ember">
              <FileText size={26} aria-hidden="true" />
            </div>

            <div className="flex flex-col items-center">
              <h3 className="text-lg font-medium text-text-primary">
                Arpit Chhabra — Resume
              </h3>
              <p className="text-sm text-text-muted mt-1.5 max-w-sm">
                A concise one-page PDF covering experience, skills, and education.
                Download a copy or preview it in a new tab.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-1">
              <a
                href={RESUME_PDF_PATH}
                download={DOWNLOAD_FILENAME}
                className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium bg-accent-ember text-ink-950 hover:bg-accent-ember/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-ember focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
              >
                <Download size={16} aria-hidden="true" />
                Download PDF
              </a>
              <a
                href={RESUME_PDF_PATH}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium border border-white/15 text-text-primary hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-ember"
              >
                <ExternalLink size={16} aria-hidden="true" />
                Open in new tab
              </a>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* ATS/SEO mirror — visually hidden, still read by crawlers & screen readers */}
      <ResumeMirror />
    </Section>
  );
}
