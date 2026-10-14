"use client";

import { useActionState } from "react";
import { submitLead } from "@/app/actions/leads";
import { emptyLeadFormState } from "@/lib/lead-form";

type Props = {
  projectSlug?: string;
  sourcePage: string;
  tone?: "light" | "dark";
  /** "full" adds a message field; "compact" is the two-field mini form. */
  size?: "full" | "compact";
  submitLabel?: string;
};

export function EnquiryForm({
  projectSlug,
  sourcePage,
  tone = "light",
  size = "full",
  submitLabel = "Request a callback",
}: Props) {
  const [state, formAction, isPending] = useActionState(submitLead, emptyLeadFormState);

  const dark = tone === "dark";

  const fieldClass = [
    "w-full border-b bg-transparent px-0 py-3 text-[16px] outline-none transition-colors",
    dark
      ? "border-white/35 text-white placeholder:text-white/55 focus:border-white"
      : "border-hairline text-ink placeholder:text-stone/70 focus:border-red-primary",
  ].join(" ");

  const labelClass = dark ? "text-[13px] text-white/70" : "text-[13px] text-stone";

  if (state.status === "success") {
    return (
      <div
        className={`border-l-2 py-2 pl-5 ${dark ? "border-white" : "border-red-primary"}`}
        role="status"
        aria-live="polite"
      >
        <p className={`font-display text-2xl ${dark ? "text-white" : "text-ink"}`}>
          Enquiry received.
        </p>
        <p className={`measure-tight mt-2 text-[15px] leading-relaxed ${dark ? "text-white/75" : "text-stone"}`}>
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6" noValidate>
      <input type="hidden" name="projectSlug" value={projectSlug ?? ""} />
      <input type="hidden" name="sourcePage" value={sourcePage} />

      {/* Honeypot — hidden from people, irresistible to bots. */}
      <div className="absolute h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor={`company-${sourcePage}`}>Company</label>
        <input id={`company-${sourcePage}`} name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={size === "full" ? "grid gap-6 sm:grid-cols-2" : "space-y-6"}>
        <div>
          <label htmlFor={`name-${sourcePage}`} className={labelClass}>
            Your name
          </label>
          <input
            id={`name-${sourcePage}`}
            name="name"
            required
            autoComplete="name"
            placeholder="Full name"
            aria-invalid={Boolean(state.fieldErrors.name)}
            aria-describedby={state.fieldErrors.name ? `name-err-${sourcePage}` : undefined}
            className={fieldClass}
          />
          {state.fieldErrors.name && (
            <p id={`name-err-${sourcePage}`} className={`mt-2 text-[13px] ${dark ? "text-white" : "text-red-primary"}`}>
              {state.fieldErrors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={`phone-${sourcePage}`} className={labelClass}>
            Phone
          </label>
          <input
            id={`phone-${sourcePage}`}
            name="phone"
            required
            type="tel"
            autoComplete="tel"
            placeholder="+91"
            aria-invalid={Boolean(state.fieldErrors.phone)}
            aria-describedby={state.fieldErrors.phone ? `phone-err-${sourcePage}` : undefined}
            className={fieldClass}
          />
          {state.fieldErrors.phone && (
            <p id={`phone-err-${sourcePage}`} className={`mt-2 text-[13px] ${dark ? "text-white" : "text-red-primary"}`}>
              {state.fieldErrors.phone}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor={`email-${sourcePage}`} className={labelClass}>
          Email <span className={dark ? "text-white/50" : "text-stone/70"}>(optional)</span>
        </label>
        <input
          id={`email-${sourcePage}`}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={Boolean(state.fieldErrors.email)}
          aria-describedby={state.fieldErrors.email ? `email-err-${sourcePage}` : undefined}
          className={fieldClass}
        />
        {state.fieldErrors.email && (
          <p id={`email-err-${sourcePage}`} className={`mt-2 text-[13px] ${dark ? "text-white" : "text-red-primary"}`}>
            {state.fieldErrors.email}
          </p>
        )}
      </div>

      {size === "full" && (
        <div>
          <label htmlFor={`message-${sourcePage}`} className={labelClass}>
            What would you like to know? <span className={dark ? "text-white/50" : "text-stone/70"}>(optional)</span>
          </label>
          <textarea
            id={`message-${sourcePage}`}
            name="message"
            rows={3}
            placeholder="Configuration, budget, or a good time to call"
            className={`${fieldClass} resize-none`}
          />
        </div>
      )}

      {state.status === "error" && state.message && (
        <p role="alert" className={`text-[14px] ${dark ? "text-white" : "text-red-primary"}`}>
          {state.message}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button
          type="submit"
          disabled={isPending}
          className={`inline-flex items-center gap-2.5 px-6 py-3 text-[15px] transition-colors duration-200 disabled:cursor-progress ${
            dark
              ? "bg-white text-red-deep hover:bg-paper disabled:bg-white/80"
              : "bg-red-primary text-white hover:bg-red-deep disabled:bg-red-primary/70"
          }`}
        >
          {isPending && (
            <span
              className="spin block h-3.5 w-3.5 rounded-full border-[1.5px] border-current border-t-transparent"
              aria-hidden="true"
            />
          )}
          {isPending ? "Sending" : submitLabel}
        </button>
        <p className={`text-[13px] ${dark ? "text-white/60" : "text-stone"}`}>
          We call back within one working day.
        </p>
      </div>
    </form>
  );
}
