import Section from "@/components/shared/Section";
import SectionHeading from "@/components/shared/SectionHeading";
import ContactForm from "./ContactForm";
import SocialsGrid from "./SocialsGrid";

export default function Contact() {
  return (
    <Section id="contact">
      <SectionHeading
        eyebrow="Say Hello"
        subtitle="Have a project, a role, or just want to talk shop? Open a channel."
      >
        Get in <em className="font-serif italic">Touch</em>
      </SectionHeading>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Form — takes more space */}
        <div className="lg:col-span-3">
          <ContactForm />
        </div>

        {/* Socials sidebar */}
        <div className="lg:col-span-2">
          <SocialsGrid />
        </div>
      </div>
    </Section>
  );
}
