import { ImageSlot } from "@/components/image-slot";
import type { PostBlock } from "@/lib/types";

/*
  Renders a post's blocks. Everything the team types is rendered as text — no
  markup is ever interpreted — so an editor cannot accidentally (or otherwise)
  inject HTML into the published site.
*/
export function PostBody({ blocks }: { blocks: PostBlock[] }) {
  return (
    <div className="flex flex-col gap-7">
      {blocks.map((block) => {
        switch (block.kind) {
          case "heading":
            return (
              <h2
                key={block.id}
                className="mt-6 text-[clamp(1.5rem,3vw,2.15rem)] first:mt-0"
              >
                {block.text}
              </h2>
            );

          case "quote":
            return (
              <blockquote
                key={block.id}
                className="my-3 border-l-2 border-red-primary py-1 pl-6"
              >
                <p className="font-display text-[clamp(1.35rem,2.4vw,1.85rem)] leading-snug">
                  {block.text}
                </p>
              </blockquote>
            );

          case "list":
            return (
              <ul key={block.id} className="flex flex-col gap-3">
                {block.text
                  .split("\n")
                  .map((line) => line.trim())
                  .filter(Boolean)
                  .map((line, i) => (
                    <li key={i} className="flex gap-4 text-[17px] leading-relaxed">
                      <span
                        className="mt-3.5 h-px w-5 shrink-0 bg-red-primary"
                        aria-hidden="true"
                      />
                      {line}
                    </li>
                  ))}
              </ul>
            );

          case "image":
            return (
              <figure key={block.id} className="my-4">
                <ImageSlot
                  src={block.url || undefined}
                  alt={block.alt}
                  aspect="aspect-[16/10]"
                  sizes="(max-width: 1024px) 100vw, 65vw"
                  note="1800 × 1125"
                />
                {block.alt && (
                  <figcaption className="mt-3 text-[14px] text-stone">{block.alt}</figcaption>
                )}
              </figure>
            );

          default:
            return (
              <p key={block.id} className="text-[17px] leading-relaxed lg:text-[18px]">
                {block.text}
              </p>
            );
        }
      })}
    </div>
  );
}
