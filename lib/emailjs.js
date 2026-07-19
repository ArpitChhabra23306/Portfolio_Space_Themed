"use client";

import emailjs from "@emailjs/browser";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

/**
 * Send an email via EmailJS browser SDK.
 * @param {{ name: string, email: string, subject: string, message: string }} payload
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function sendEmail(payload) {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    return { success: false, error: "EmailJS is not configured." };
  }

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, payload, { publicKey: PUBLIC_KEY });
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err?.text || "Failed to send message. Please try again.",
    };
  }
}
