"use client";

import { useState, useTransition } from "react";
import { setLeadStatus } from "@/app/dashboard/leads/actions";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/types";

const LABEL: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  closed: "Closed",
};

/** Inline status change — optimistic, with the old value restored on failure. */
export function LeadStatusSelect({
  id,
  status,
}: {
  id: string;
  status: LeadStatus;
}) {
  const [value, setValue] = useState<LeadStatus>(status);
  const [isPending, startTransition] = useTransition();
  const [failed, setFailed] = useState(false);

  return (
    <span className="inline-flex items-center gap-2">
      <select
        value={value}
        aria-label="Lead status"
        disabled={isPending}
        onChange={(e) => {
          const next = e.target.value as LeadStatus;
          const previous = value;
          setValue(next);
          setFailed(false);
          startTransition(async () => {
            try {
              await setLeadStatus(id, next);
            } catch {
              setValue(previous);
              setFailed(true);
            }
          });
        }}
        className={`border bg-white px-2.5 py-1.5 text-[14px] transition-colors ${
          value === "new"
            ? "border-red-primary text-red-primary"
            : "border-hairline text-ink"
        } disabled:opacity-60`}
      >
        {LEAD_STATUSES.map((s) => (
          <option key={s} value={s}>
            {LABEL[s]}
          </option>
        ))}
      </select>
      {failed && (
        <span role="alert" className="text-[13px] text-red-primary">
          Not saved
        </span>
      )}
    </span>
  );
}
