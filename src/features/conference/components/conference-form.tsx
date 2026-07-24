"use client";

import { useState } from "react";
import { contents } from "@contents";
import { ENDPOINTS } from "@shared/constants/endpoints";

type AttendanceType = (typeof contents.conference.attendanceOptions)[number]["value"];

interface FormState {
  partnerOneName: string;
  partnerTwoName: string;
  phone: string;
  email: string;
  attendanceType: AttendanceType | "";
  yearsMarried: string;
  message: string;
}

const INITIAL: FormState = {
  partnerOneName: "",
  partnerTwoName: "",
  phone: "",
  email: "",
  attendanceType: "",
  yearsMarried: "",
  message: "",
};

const FIELD_CLASS =
  "w-full rounded-xl border-2 border-ink/15 bg-parchment px-4 py-3 text-[0.9375rem] text-ink placeholder:text-ink/35 focus:outline-none focus:border-coral transition-colors";

export function ConferenceForm() {
  const { form, attendanceOptions, modal } = contents.conference;
  const [values, setValues] = useState<FormState>(INITIAL);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!values.partnerOneName.trim()) return setError(form.errors.partnerOneName);
    if (!values.partnerTwoName.trim()) return setError(form.errors.partnerTwoName);
    if (!values.phone.trim()) return setError(form.errors.phone);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) return setError(form.errors.email);
    if (!values.attendanceType) return setError(form.errors.attendanceType);

    setStatus("submitting");
    try {
      const res = await fetch(ENDPOINTS.CONFERENCE_REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json()) as { success: boolean; error?: string };
      if (!data.success) throw new Error(data.error ?? form.errors.genericSubmitFailed);
      setStatus("success");
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : form.errors.networkFailed);
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-[1.5rem] bg-evergreen-deep text-parchment px-8 py-10 text-center">
        <h3 className="font-display font-bold text-[1.375rem] mb-2" style={{ fontVariationSettings: "'wdth' 88" }}>
          {form.success.heading}
        </h3>
        <p className="serif-soft font-serif italic text-parchment/75 text-[1rem]">{form.success.body}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label={form.fields.partnerOneName.label}>
          <input
            className={FIELD_CLASS}
            placeholder={form.fields.partnerOneName.placeholder}
            value={values.partnerOneName}
            onChange={(e) => set("partnerOneName", e.target.value)}
          />
        </Field>
        <Field label={form.fields.partnerTwoName.label}>
          <input
            className={FIELD_CLASS}
            placeholder={form.fields.partnerTwoName.placeholder}
            value={values.partnerTwoName}
            onChange={(e) => set("partnerTwoName", e.target.value)}
          />
        </Field>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label={form.fields.phone.label}>
          <input
            className={FIELD_CLASS}
            placeholder={form.fields.phone.placeholder}
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </Field>
        <Field label={form.fields.email.label}>
          <input
            type="email"
            className={FIELD_CLASS}
            placeholder={form.fields.email.placeholder}
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </Field>
      </div>

      <fieldset>
        <legend className="block text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-ink/55 mb-2">
          {form.fields.attendanceType.label}
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {attendanceOptions.map((option) => (
            <label
              key={option.value}
              className={`cursor-pointer rounded-xl border-2 px-4 py-3 transition-colors ${
                values.attendanceType === option.value
                  ? "border-coral bg-coral/10"
                  : "border-ink/15 hover:border-ink/30"
              }`}
            >
              <input
                type="radio"
                name="attendanceType"
                value={option.value}
                checked={values.attendanceType === option.value}
                onChange={() => set("attendanceType", option.value)}
                className="sr-only"
              />
              <span className="block text-[0.875rem] font-bold">{option.label}</span>
              <span className="block text-[0.75rem] text-ink/60 mt-0.5">{option.desc}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <Field label={form.fields.yearsMarried.label}>
        <input
          className={FIELD_CLASS}
          placeholder={form.fields.yearsMarried.placeholder}
          value={values.yearsMarried}
          onChange={(e) => set("yearsMarried", e.target.value)}
        />
      </Field>
      <Field label={form.fields.message.label}>
        <textarea
          rows={4}
          maxLength={form.fields.message.maxLength}
          className={FIELD_CLASS}
          placeholder={form.fields.message.placeholder}
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
        />
      </Field>

      {error ? <p className="text-[0.8125rem] font-semibold text-coral-deep">{error}</p> : null}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center rounded-full bg-coral text-ink text-[0.9375rem] font-semibold px-8 py-3 hover:bg-marigold transition-colors duration-300 disabled:opacity-60"
        >
          {status === "submitting" ? modal.submittingCta : modal.submitCta}
        </button>
        <span className="text-[0.75rem] text-ink/50">{modal.footnote}</span>
      </div>
    </form>
  );
}

interface FieldProps {
  readonly label: string;
  readonly children: React.ReactNode;
}

function Field({ label, children }: FieldProps) {
  return (
    <label className="block">
      <span className="block text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-ink/55 mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}
