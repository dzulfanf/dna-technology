"use server";

import { Resend } from "resend";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2, "Name too short").max(80, "Name too long"),
  company: z.string().trim().max(80).optional().default(""),
  email: z.email("Invalid email"),
  subject: z.enum([
    "Data Centre",
    "Network",
    "Application",
    "Security & Surveillance",
    "Other",
  ]),
  message: z
    .string()
    .trim()
    .min(10, "Message too short (min 10 chars)")
    .max(2000, "Message too long (max 2000 chars)"),
  // Honeypot: bots fill this; humans (and screen-readers with proper attrs) skip it.
  honeypot: z.string().max(0, "Spam detected"),
});

export type ContactState = {
  ok: boolean | null;
  error?: string;
  fieldErrors?: Partial<Record<keyof z.infer<typeof schema>, string>>;
};

const initialState: ContactState = { ok: null };

export async function sendContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const raw = {
    name: (formData.get("name") ?? "") as string,
    company: (formData.get("company") ?? "") as string,
    email: (formData.get("email") ?? "") as string,
    subject: (formData.get("subject") ?? "") as string,
    message: (formData.get("message") ?? "") as string,
    honeypot: (formData.get("honeypot") ?? "") as string,
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    // Silently drop honeypot hits — bots don't need feedback.
    if (raw.honeypot) return { ok: true };
    const fieldErrors: ContactState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof z.infer<typeof schema>;
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return {
      ok: false,
      error: "Please check the fields and try again.",
      fieldErrors,
    };
  }

  const data = parsed.data;
  const apiKey = process.env.RESEND_API_KEY;
  const toAddr = process.env.CONTACT_TO_EMAIL;
  const fromAddr = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !toAddr || !fromAddr) {
    console.error("[send-contact] Missing env vars", {
      hasApiKey: !!apiKey,
      hasTo: !!toAddr,
      hasFrom: !!fromAddr,
    });
    return {
      ok: false,
      error: "Email service is not configured. Please try again later.",
    };
  }

  const resend = new Resend(apiKey);

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #111;">
      <h2 style="margin: 0 0 6px; font-size: 20px;">New contact form submission</h2>
      <p style="margin: 0 0 20px; color: #555; font-size: 13px;">via dnatechnology.co.id</p>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr><td style="padding: 8px 0; color: #666; width: 110px;">Name</td><td style="padding: 8px 0;"><strong>${escapeHtml(data.name)}</strong></td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;"><a href="mailto:${encodeURIComponent(data.email)}" style="color: #0891B2;">${escapeHtml(data.email)}</a></td></tr>
        ${data.company ? `<tr><td style="padding: 8px 0; color: #666;">Company</td><td style="padding: 8px 0;">${escapeHtml(data.company)}</td></tr>` : ""}
        <tr><td style="padding: 8px 0; color: #666;">Topic</td><td style="padding: 8px 0;">${escapeHtml(data.subject)}</td></tr>
      </table>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="white-space: pre-wrap; margin: 0; font-size: 14px; line-height: 1.6;">${escapeHtml(data.message)}</p>
    </div>
  `;

  const text = [
    `New contact form submission via dnatechnology.co.id`,
    ``,
    `Name:    ${data.name}`,
    `Email:   ${data.email}`,
    data.company ? `Company: ${data.company}` : null,
    `Topic:   ${data.subject}`,
    ``,
    data.message,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const { error } = await resend.emails.send({
      from: fromAddr,
      to: [toAddr],
      replyTo: data.email,
      subject: `[Contact] ${data.subject} — ${data.name}`,
      html,
      text,
    });
    if (error) {
      console.error("[send-contact] Resend error", error);
      return {
        ok: false,
        error: "Failed to send. Please try again or email us directly.",
      };
    }
    return { ok: true };
  } catch (err) {
    console.error("[send-contact] Unexpected error", err);
    return {
      ok: false,
      error: "Something went wrong. Please try again later.",
    };
  }
}

export { initialState };

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
