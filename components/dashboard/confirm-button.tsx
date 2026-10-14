"use client";

import { useEffect, useRef, useState } from "react";

/*
  Two-step delete. The first click arms the button and the label changes to say
  exactly what is about to happen; the second click submits. It disarms itself
  after a few seconds so an armed button is never left lying around.
*/
export function ConfirmButton({
  children,
  confirmLabel,
  className = "",
}: {
  children: React.ReactNode;
  confirmLabel: string;
  className?: string;
}) {
  const [armed, setArmed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!armed) {
          e.preventDefault();
          setArmed(true);
          timer.current = setTimeout(() => setArmed(false), 5000);
        }
      }}
      className={`${className} ${armed ? "border-red-primary text-red-primary" : ""}`}
    >
      {armed ? confirmLabel : children}
    </button>
  );
}
