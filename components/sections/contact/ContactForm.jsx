"use client";

import { useState } from "react";
import { sendEmail } from "@/lib/emailjs";
import GlassCard from "@/components/shared/GlassCard";

const fields = [
  { name: "name", label: "Name", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "subject", label: "Subject", type: "text" },
];

function validateForm(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Name is required.";
  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!values.subject.trim()) errors.subject = "Subject is required.";
  if (!values.message.trim()) errors.message = "Message is required.";
  return errors;
}

export default function ContactForm() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // "success" | "error"
  const [statusMessage, setStatusMessage] = useState("");
  const [sending, setSending] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);
    setStatusMessage("");

    const validationErrors = validateForm(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSending(true);
    const result = await sendEmail(values);
    setSending(false);

    if (result.success) {
      setStatus("success");
      setStatusMessage("Message sent successfully! I'll get back to you soon.");
      setValues({ name: "", email: "", subject: "", message: "" });
      setErrors({});
    } else {
      setStatus("error");
      setStatusMessage(result.error || "Something went wrong. Please try again.");
    }
  }

  return (
    <GlassCard className="p-6 md:p-8 h-full flex flex-col">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-text-primary">Send a transmission</h3>
        <p className="text-sm text-text-dim mt-1">
          I usually reply within a day.
        </p>
      </div>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col flex-1">
        <div className="space-y-6">
          {fields.map((field) => (
            <div key={field.name} className="relative">
              <label
                htmlFor={`contact-${field.name}`}
                className="block text-sm font-medium text-text-muted mb-1.5"
              >
                {field.label} <span className="text-accent-ember">*</span>
              </label>
              <input
                id={`contact-${field.name}`}
                name={field.name}
                type={field.type}
                required
                value={values[field.name]}
                onChange={handleChange}
                aria-invalid={!!errors[field.name]}
                aria-describedby={`${field.name}-error`}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-text-primary placeholder:text-text-dim
                           focus:outline-none focus:ring-2 focus:ring-accent-ember/60 transition-all"
              />
              <p
                id={`${field.name}-error`}
                className="mt-1 text-sm text-red-400 min-h-[1.25rem]"
                aria-live="polite"
              >
                {errors[field.name] || ""}
              </p>
            </div>
          ))}

          {/* Message textarea */}
          <div className="relative">
            <label
              htmlFor="contact-message"
              className="block text-sm font-medium text-text-muted mb-1.5"
            >
              Message <span className="text-accent-ember">*</span>
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={5}
              value={values.message}
              onChange={handleChange}
              aria-invalid={!!errors.message}
              aria-describedby="message-error"
              className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-text-primary placeholder:text-text-dim
                         resize-y min-h-[120px]
                         focus:outline-none focus:ring-2 focus:ring-accent-ember/60 transition-all"
            />
            <p
              id="message-error"
              className="mt-1 text-sm text-red-400 min-h-[1.25rem]"
              aria-live="polite"
            >
              {errors.message || ""}
            </p>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={sending}
          className="mt-auto pt-2 w-full flex items-center justify-center gap-2 rounded-lg bg-accent-ember px-6 py-3
                     text-white font-medium transition-all
                     hover:bg-accent-ember/90 hover:shadow-[0_0_40px_-10px_rgba(232,116,60,0.6)]
                     focus-visible:ring-2 focus-visible:ring-accent-ember
                     disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {sending && (
            <svg
              className="animate-spin h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
                className="opacity-25"
              />
              <path
                d="M4 12a8 8 0 018-8"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                className="opacity-75"
              />
            </svg>
          )}
          {sending ? "Sending..." : "Send Message"}
        </button>

        {/* Status messages */}
        {status === "success" && (
          <p role="status" className="mt-4 text-sm text-green-400 text-center">
            {statusMessage}
          </p>
        )}
        {status === "error" && (
          <p role="alert" className="mt-4 text-sm text-red-400 text-center">
            {statusMessage}
          </p>
        )}
      </form>
    </GlassCard>
  );
}
