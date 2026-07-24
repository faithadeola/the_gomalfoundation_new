"use client";

import { useState } from "react";
import { contents } from "@contents";
import { ENDPOINTS } from "@shared/constants/endpoints";

type PartnershipType = keyof typeof contents.partnership.typeLabels;

interface FormState {
  name: string;
  phone: string;
  email: string;
  partnershipType: PartnershipType | "";
  proposal: string;
}

const INITIAL: FormState = { name: "", phone: "", email: "", partnershipType: "", proposal: "" };

const FIELD_CLASS =
  "w-full rounded-xl border-2 border-ink/15 bg-parchment px-4 py-3 text-[0.9375rem] text-ink placeholder:text-ink/35 focus:outline-none focus:border-coral transition-colors";

export function PartnershipForm() {
  const { form, typeLabels } = contents.partnership;
  const [values, setValues] = useState<FormState>(INITIAL);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!values.name.trim()) return setError(form.errors.name);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) return setError(form.errors.email);
    if (!values.phone.trim()) return setError(form.errors.phone);
    if (!values.partnershipType) return setError(form.errors.partnershipType);
    if (values.proposal.trim().length < 20) return setError(form.errors.proposal);

    setStatus("submitting");
    try {
      const res = await fetch(ENDPOINTS.PARTNERSHIP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json()) as { success: boolean; error?: string };
      if (!data.success) throw new Error(data.error ?? form.errors.submitFailed);
      setStatus("success");
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : form.errors.submitFailed);
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
      <Field label={form.fields.name.label}>
        <input
          className={FIELD_CLASS}
          placeholder={form.fields.name.placeholder}
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
        />
      </Field>
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
      <Field label={form.fields.type.label}>
        <select
          className={FIELD_CLASS}
          value={values.partnershipType}
          onChange={(e) => set("partnershipType", e.target.value as PartnershipType | "")}
        >
          <option value="" disabled>
            {form.fields.type.placeholder}
          </option>
          {(Object.keys(typeLabels) as PartnershipType[]).map((type) => (
            <option key={type} value={type}>
              {typeLabels[type]}
            </option>
          ))}
        </select>
      </Field>
      <Field label={form.fields.proposal.label}>
        <textarea
          rows={5}
          maxLength={form.fields.proposal.maxLength}
          className={FIELD_CLASS}
          placeholder={form.fields.proposal.placeholder}
          value={values.proposal}
          onChange={(e) => set("proposal", e.target.value)}
        />
      </Field>

      {error ? <p className="text-[0.8125rem] font-semibold text-coral-deep">{error}</p> : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center rounded-full bg-coral text-ink text-[0.9375rem] font-semibold px-8 py-3 hover:bg-marigold transition-colors duration-300 disabled:opacity-60"
      >
        {status === "submitting" ? form.submittingCta : form.submitCta}
      </button>
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
