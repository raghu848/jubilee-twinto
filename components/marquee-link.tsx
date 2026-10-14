import Link from "next/link";

/*
  A call to action whose label runs sideways while the pointer is on it.

  The static label is the only thing in normal flow, so the control is exactly
  as wide as its text. The repeating track is absolutely positioned on top —
  if it were in flow, six copies of the label would set the button's intrinsic
  width and burst the grid column it sits in.
*/
export function MarqueeLink({
  href,
  label,
  tone = "red",
  className = "",
  external = false,
}: {
  href: string;
  label: string;
  tone?: "red" | "outline" | "light";
  className?: string;
  external?: boolean;
}) {
  const tones = {
    red: "bg-red-primary text-white hover:bg-red-deep",
    outline: "border border-ink/25 text-ink hover:border-red-primary hover:text-red-primary",
    light: "bg-white text-red-deep hover:bg-paper",
  } as const;

  const inner = (
    <>
      <span className="label relative z-10 transition-opacity duration-200 group-hover:opacity-0">
        {label}
      </span>

      <span
        className="pointer-events-none absolute inset-0 flex items-center opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        aria-hidden="true"
      >
        <span className="marquee-track">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="label px-5">
              {label}
            </span>
          ))}
        </span>
      </span>
    </>
  );

  const classes = `marquee group relative inline-flex items-center justify-center overflow-hidden px-8 py-4 transition-colors duration-300 ${tones[tone]} ${className}`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  );
}
