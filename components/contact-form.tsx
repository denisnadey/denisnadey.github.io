"use client";

import { useState, type FormEvent } from "react";
import type { SiteCopy } from "@/content";

export function ContactForm({ copy }: { copy: SiteCopy["contact"] }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [prepared, setPrepared] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get("website")) return;
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const need = String(data.get("need") || "").trim();
    const next: Record<string, string> = {};
    if (!name) next.name = copy.errors.name;
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = copy.errors.email;
    if (!need) next.need = copy.errors.need;
    setErrors(next);
    if (Object.keys(next).length) return;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Company: ${String(data.get("company") || "—")}`,
      `Budget: ${String(data.get("budget") || "—")}`,
      `Timeline: ${String(data.get("timeline") || "—")}`,
      "",
      need,
    ].join("\n");
    setPrepared(true);
    window.location.href = `mailto:denis.nadey@gmail.com?subject=${encodeURIComponent(`Mobile engineering enquiry — ${name}`)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form className="contact-form" action="mailto:denis.nadey@gmail.com" method="post" encType="text/plain" onSubmit={submit} noValidate>
      <div className="honeypot" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
      <Field id="name" label={copy.name} error={errors.name}><input id="name" name="name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} /></Field>
      <Field id="email" label={copy.email} error={errors.email}><input id="email" name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} /></Field>
      <Field id="company" label={`${copy.company} (${copy.optional})`}><input id="company" name="company" autoComplete="organization" /></Field>
      <Field id="need" label={copy.need} error={errors.need} wide><textarea id="need" name="need" rows={6} aria-invalid={!!errors.need} aria-describedby={errors.need ? "need-error" : undefined} /></Field>
      <Field id="budget" label={`${copy.budget} (${copy.optional})`}><select id="budget" name="budget">{copy.budgetOptions.map((option) => <option key={option}>{option}</option>)}</select></Field>
      <Field id="timeline" label={`${copy.timeline} (${copy.optional})`}><select id="timeline" name="timeline">{copy.timelineOptions.map((option) => <option key={option}>{option}</option>)}</select></Field>
      <div className="form-submit"><button className="button primary" type="submit">{copy.send}<span aria-hidden="true">↗</span></button><p>{copy.privacy}</p></div>
      {prepared && <p className="form-status" role="status">{copy.prepared}</p>}
    </form>
  );
}

function Field({ id, label, error, wide, children }: { id: string; label: string; error?: string; wide?: boolean; children: React.ReactNode }) {
  return <div className={`field${wide ? " field-wide" : ""}`}><label htmlFor={id}>{label}</label>{children}{error && <p className="field-error" id={`${id}-error`}>{error}</p>}</div>;
}
