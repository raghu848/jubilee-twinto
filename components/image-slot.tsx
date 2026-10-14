import Image from "next/image";

/*
  Every picture on this site goes through here.

  Jubilee Sales' photography and renders do not exist yet, so rather than fill
  the layout with stock or invented imagery, an empty slot renders as a
  deliberate tonal block that names the shot that belongs in it. The client can
  see what to commission, the layout holds its exact proportions, and the
  moment a file is uploaded in the dashboard the same component shows it.
*/

type Props = {
  /** Empty until a real photograph is uploaded. */
  src?: string;
  /** Doubles as the brief for the shot when the slot is empty. */
  alt: string;
  /** Aspect ratio utility, e.g. "aspect-[4/5]". Omit when sizing by the parent. */
  aspect?: string;
  tone?: "light" | "dark";
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** Shown under the brief, e.g. "Hero · 2400 × 1350". */
  note?: string;
  kind?: "image" | "video";
  /**
   * Where the brief sits. "center" suits a slot the reader is looking at;
   * "corner" keeps it clear of headline text on a full-bleed background.
   */
  caption?: "center" | "corner";
};

const POSITIONED = new Set(["absolute", "fixed", "sticky"]);

export function ImageSlot({
  src,
  alt,
  aspect,
  tone = "light",
  sizes = "100vw",
  priority = false,
  className = "",
  note,
  kind = "image",
  caption = "center",
}: Props) {
  const dark = tone === "dark";

  /*
    Tailwind position utilities all carry the same specificity, so a "relative"
    baked in here would beat an "absolute" passed by the caller depending only
    on stylesheet order. Positioning the slot is the caller's business whenever
    they say so.
  */
  const positioned = className.split(" ").some((c) => POSITIONED.has(c));

  const shell = [
    positioned ? "" : "relative",
    "overflow-hidden",
    aspect ?? "",
    dark ? "bg-shell-dark text-white/50" : "bg-shell text-stone",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (src) {
    return (
      <div className={shell}>
        {kind === "video" ? (
          <video
            src={src}
            controls
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
            aria-label={alt}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            className="object-cover"
          />
        )}
      </div>
    );
  }

  return (
    <div className={shell} role="img" aria-label={`Image to be supplied: ${alt}`}>
      <div className="slot-hatch absolute inset-0 opacity-70" aria-hidden="true" />

      {/* Corner brackets, so an empty slot reads as a frame rather than a gap */}
      <span
        aria-hidden="true"
        className={`absolute left-4 top-4 h-5 w-5 border-l border-t ${dark ? "border-white/25" : "border-ink/20"}`}
      />
      <span
        aria-hidden="true"
        className={`absolute right-4 top-4 h-5 w-5 border-r border-t ${dark ? "border-white/25" : "border-ink/20"}`}
      />
      <span
        aria-hidden="true"
        className={`absolute bottom-4 left-4 h-5 w-5 border-b border-l ${dark ? "border-white/25" : "border-ink/20"}`}
      />
      <span
        aria-hidden="true"
        className={`absolute bottom-4 right-4 h-5 w-5 border-b border-r ${dark ? "border-white/25" : "border-ink/20"}`}
      />

      {caption === "center" ? (
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="max-w-[38ch] text-center">
            <p className={`label ${dark ? "text-white/45" : "text-stone/70"}`}>
              {kind === "video" ? "Video" : "Photograph"} to come
            </p>
            <p
              className={`mt-3 font-display text-[clamp(1rem,1.6vw,1.35rem)] leading-snug ${
                dark ? "text-white/75" : "text-ink/65"
              }`}
            >
              {alt}
            </p>
            {note && (
              <p className={`mt-3 text-[12px] ${dark ? "text-white/35" : "text-stone/60"}`}>{note}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="absolute right-8 top-24 max-w-[26ch] text-right lg:top-28">
          <p className={`label ${dark ? "text-white/40" : "text-stone/60"}`}>
            {kind === "video" ? "Video" : "Photograph"} to come
          </p>
          <p className={`mt-2 text-[13px] leading-relaxed ${dark ? "text-white/45" : "text-stone/70"}`}>
            {alt}
          </p>
          {note && (
            <p className={`mt-1.5 text-[12px] ${dark ? "text-white/30" : "text-stone/55"}`}>{note}</p>
          )}
        </div>
      )}
    </div>
  );
}
