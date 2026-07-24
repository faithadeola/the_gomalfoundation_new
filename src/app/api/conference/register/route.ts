import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { contents } from "@contents";

type AttendanceType = keyof typeof contents.conference.attendanceLabels;

interface ConferenceRegistration {
  partnerOneName: string;
  partnerTwoName: string;
  phone: string;
  email: string;
  attendanceType: AttendanceType;
  yearsMarried: string;
  message: string;
}

const LABELS = contents.conference.attendanceLabels;
const EMAIL = contents.conference.email;
const ERRORS = contents.conference.form.errors;

function isAttendanceType(value: unknown): value is AttendanceType {
  return typeof value === "string" && value in LABELS;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePayload(body: unknown): ConferenceRegistration {
  if (!body || typeof body !== "object") throw new Error("Invalid request body");
  const data = body as Record<string, unknown>;

  if (!data.partnerOneName || typeof data.partnerOneName !== "string") throw new Error(ERRORS.partnerOneName);
  if (!data.partnerTwoName || typeof data.partnerTwoName !== "string") throw new Error(ERRORS.partnerTwoName);
  if (!data.phone || typeof data.phone !== "string") throw new Error(ERRORS.phone);
  if (!data.email || typeof data.email !== "string" || !isValidEmail(String(data.email))) {
    throw new Error(ERRORS.email);
  }
  if (!isAttendanceType(data.attendanceType)) throw new Error(ERRORS.attendanceType);

  return {
    partnerOneName: String(data.partnerOneName).trim(),
    partnerTwoName: String(data.partnerTwoName).trim(),
    phone: String(data.phone).trim(),
    email: String(data.email).trim().toLowerCase(),
    attendanceType: data.attendanceType,
    yearsMarried: typeof data.yearsMarried === "string" ? data.yearsMarried.trim() : "",
    message: typeof data.message === "string" ? data.message.trim() : "",
  };
}

function fill(template: string, data: ConferenceRegistration): string {
  return template
    .replace("{partnerOneName}", data.partnerOneName)
    .replace("{partnerTwoName}", data.partnerTwoName)
    .replace("{email}", data.email)
    .replace("{phone}", data.phone);
}

function buildEmailHtml(data: ConferenceRegistration): string {
  const rows = [
    [EMAIL.fieldLabels.yourName, data.partnerOneName],
    [EMAIL.fieldLabels.partnersName, data.partnerTwoName],
    [EMAIL.fieldLabels.phone, data.phone],
    [EMAIL.fieldLabels.email, data.email],
    [EMAIL.fieldLabels.comingAs, LABELS[data.attendanceType]],
    ...(data.yearsMarried ? [[EMAIL.fieldLabels.yearsMarried, data.yearsMarried]] : []),
  ];

  return `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #12302a;">
      <div style="background: #093b31; padding: 32px; border-radius: 4px 4px 0 0;">
        <h1 style="color: #fbefe2; font-size: 20px; margin: 0; letter-spacing: -0.015em;">
          ${fill(EMAIL.headingTemplate, data)}
        </h1>
        <p style="color: #8da692; font-size: 13px; margin: 8px 0 0; font-family: sans-serif;">
          ${EMAIL.subtitle}
        </p>
      </div>
      <div style="background: #fbefe2; border: 1px solid rgba(18,48,42,0.14); border-top: 0; padding: 32px; border-radius: 0 0 4px 4px;">
        <table style="width: 100%; border-collapse: collapse;">
          ${rows
            .map(
              ([label, value]) => `
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid rgba(18,48,42,0.1); font-size: 12px; font-family: sans-serif; color: #8a9e90; text-transform: uppercase; letter-spacing: 0.1em; width: 160px; vertical-align: top; padding-right: 16px;">${label}</td>
              <td style="padding: 10px 0; border-bottom: 1px solid rgba(18,48,42,0.1); font-size: 15px; font-family: sans-serif; color: #12302a;">${value}</td>
            </tr>`
            )
            .join("")}
        </table>
        ${
          data.message
            ? `
        <div style="margin-top: 24px;">
          <p style="font-size: 12px; font-family: sans-serif; color: #8a9e90; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px;">
            ${EMAIL.noteLabel}
          </p>
          <p style="font-size: 15px; font-family: sans-serif; color: #12302a; line-height: 1.65; background: #f3e2cd; padding: 16px; border-radius: 4px; margin: 0; white-space: pre-line;">
            ${data.message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
          </p>
        </div>`
            : ""
        }
        <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid rgba(18,48,42,0.1);">
          <p style="font-size: 12px; font-family: sans-serif; color: #8a9e90; margin: 0;">
            ${fill(EMAIL.replyNoteTemplate, data)}
          </p>
        </div>
      </div>
    </div>
  `;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let data: ConferenceRegistration;

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
    return NextResponse.json(
      { success: false, error: ERRORS.emailServiceUnavailable },
      { status: 500 }
    );
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: `The GOMAL Foundation <${contents.site.contact.noreplyEmail}>`,
      to: foundationEmail,
      replyTo: data.email,
      subject: fill(EMAIL.subjectTemplate, data),
      html: buildEmailHtml(data),
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: ERRORS.sendFailed }, { status: 500 });
  }
}
