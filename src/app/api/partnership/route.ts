import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { contents } from "@contents";

type PartnershipType = keyof typeof contents.partnership.typeLabels;

interface PartnershipPayload {
  name: string;
  email: string;
  phone: string;
  partnershipType: PartnershipType;
  proposal: string;
}

const TYPE_LABELS = contents.partnership.typeLabels;
const EMAIL = contents.partnership.email;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isPartnershipType(value: unknown): value is PartnershipType {
  return typeof value === "string" && value in TYPE_LABELS;
}

function validatePayload(body: unknown): PartnershipPayload {
  if (!body || typeof body !== "object") throw new Error("Invalid request body");
  const data = body as Record<string, unknown>;

  if (!data.name || typeof data.name !== "string") throw new Error(contents.partnership.form.errors.name);
  if (!data.email || typeof data.email !== "string" || !isValidEmail(data.email)) {
    throw new Error(contents.partnership.form.errors.email);
  }
  if (!data.phone || typeof data.phone !== "string") throw new Error(contents.partnership.form.errors.phone);
  if (!isPartnershipType(data.partnershipType)) throw new Error(contents.partnership.form.errors.partnershipType);
  if (!data.proposal || typeof data.proposal !== "string" || data.proposal.trim().length < 20) {
    throw new Error(contents.partnership.form.errors.proposal);
  }

  return {
    name: String(data.name).trim(),
    email: String(data.email).trim().toLowerCase(),
    phone: String(data.phone).trim(),
    partnershipType: data.partnershipType,
    proposal: String(data.proposal).trim(),
  };
}

function buildEmailHtml(data: PartnershipPayload): string {
  const rows = [
    [EMAIL.fieldLabels.name, data.name],
    [EMAIL.fieldLabels.email, data.email],
    [EMAIL.fieldLabels.phone, data.phone],
    [EMAIL.fieldLabels.partnershipType, TYPE_LABELS[data.partnershipType]],
  ];

  return `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #12302a;">
      <div style="background: #093b31; padding: 32px; border-radius: 4px 4px 0 0;">
        <h1 style="color: #fbefe2; font-size: 20px; margin: 0; letter-spacing: -0.015em;">
          ${EMAIL.heading}
        </h1>
        <p style="color: #8da692; font-size: 13px; margin: 8px 0 0; font-family: sans-serif;">
          ${EMAIL.dateLine} · ${new Date().toLocaleDateString("en-NG", { dateStyle: "long" })}
        </p>
      </div>
      <div style="background: #fbefe2; border: 1px solid rgba(18,48,42,0.14); border-top: 0; padding: 32px; border-radius: 0 0 4px 4px;">
        <table style="width: 100%; border-collapse: collapse;">
          ${rows
            .map(
              ([label, value]) => `
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid rgba(18,48,42,0.1); font-size: 12px; font-family: sans-serif; color: #8a9e90; text-transform: uppercase; letter-spacing: 0.1em; width: 150px; vertical-align: top; padding-right: 16px;">${label}</td>
              <td style="padding: 10px 0; border-bottom: 1px solid rgba(18,48,42,0.1); font-size: 15px; font-family: sans-serif; color: #12302a;">${value}</td>
            </tr>`
            )
            .join("")}
        </table>
        <div style="margin-top: 24px;">
          <p style="font-size: 12px; font-family: sans-serif; color: #8a9e90; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px;">
            ${EMAIL.fieldLabels.message}
          </p>
          <p style="font-size: 15px; font-family: sans-serif; color: #12302a; line-height: 1.65; background: #f3e2cd; padding: 16px; border-radius: 4px; margin: 0; white-space: pre-line;">
            ${data.proposal.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
          </p>
        </div>
        <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid rgba(18,48,42,0.1);">
          <p style="font-size: 12px; font-family: sans-serif; color: #8a9e90; margin: 0;">
            ${EMAIL.replyNoteTemplate.replace("{name}", data.name).replace("{email}", data.email)}
          </p>
        </div>
      </div>
    </div>
  `;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let data: PartnershipPayload;

  try {
    const body: unknown = await request.json();
    data = validatePayload(body);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Invalid request" },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const foundationEmail = process.env.FOUNDATION_EMAIL ?? contents.site.contact.foundationEmail;

  if (!apiKey) {
    return NextResponse.json({ success: false, error: "Email service not configured." }, { status: 500 });
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: `The GOMAL Foundation <${contents.site.contact.noreplyEmail}>`,
      to: foundationEmail,
      replyTo: data.email,
      subject: EMAIL.subjectTemplate.replace("{name}", data.name),
      html: buildEmailHtml(data),
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: contents.partnership.form.errors.submitFailed },
      { status: 500 }
    );
  }
}
