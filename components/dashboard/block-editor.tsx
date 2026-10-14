"use client";

import { useState } from "react";
import { ImageUpload } from "@/components/dashboard/image-upload";
import {
  POST_BLOCK_KINDS,
  POST_BLOCK_LABEL,
  type PostBlock,
  type PostBlockKind,
} from "@/lib/types";

/*
  The post body, written as a stack of blocks.

  Text and images sit in the same ordered list, so an image goes exactly where
  it belongs in the writing rather than being bolted to the top. Blocks move
  with the arrow buttons — keyboard-reachable, unlike drag alone — and the whole
  list travels to the server as JSON in a hidden input.
*/

const PLACEHOLDER: Record<PostBlockKind, string> = {
  paragraph: "Write a paragraph…",
  heading: "A subheading",
  quote: "A single sentence worth pulling out",
  list: "One item per line",
  image: "",
};

function newId() {
  return `b_${Math.random().toString(36).slice(2, 10)}`;
}

export function BlockEditor({ name, initial }: { name: string; initial: PostBlock[] }) {
  const [blocks, setBlocks] = useState<PostBlock[]>(
    initial.length ? initial : [{ id: newId(), kind: "paragraph", text: "" }],
  );

  function add(kind: PostBlockKind, at: number) {
    const block: PostBlock =
      kind === "image"
        ? { id: newId(), kind: "image", url: "", alt: "" }
        : { id: newId(), kind, text: "" };

    setBlocks((current) => {
      const next = [...current];
      next.splice(at, 0, block);
      return next;
    });
  }

  function update(id: string, patch: Partial<PostBlock>) {
    setBlocks((current) =>
      current.map((b) => (b.id === id ? ({ ...b, ...patch } as PostBlock) : b)),
    );
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= blocks.length) return;
    setBlocks((current) => {
      const next = [...current];
      const [row] = next.splice(from, 1);
      next.splice(to, 0, row);
      return next;
    });
  }

  const control =
    "h-8 w-8 border border-hairline text-[14px] transition-colors hover:border-red-primary hover:text-red-primary disabled:opacity-30 disabled:hover:border-hairline disabled:hover:text-ink";

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(blocks)} />

      <ol className="border-t border-hairline">
        {blocks.map((block, i) => (
          <li key={block.id} className="border-b border-hairline py-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-[13px] text-stone tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <select
                  value={block.kind}
                  onChange={(e) => {
                    const kind = e.target.value as PostBlockKind;
                    setBlocks((current) =>
                      current.map((b) =>
                        b.id === block.id
                          ? kind === "image"
                            ? { id: b.id, kind: "image", url: "", alt: "" }
                            : {
                                id: b.id,
                                kind,
                                text: "text" in b ? b.text : "",
                              }
                          : b,
                      ),
                    );
                  }}
                  aria-label={`Block ${i + 1} type`}
                  className="border border-hairline bg-white px-2.5 py-1.5 text-[14px] outline-none focus:border-red-primary"
                >
                  {POST_BLOCK_KINDS.map((k) => (
                    <option key={k} value={k}>
                      {POST_BLOCK_LABEL[k]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(i, i - 1)}
                  disabled={i === 0}
                  aria-label={`Move block ${i + 1} up`}
                  className={control}
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(i, i + 1)}
                  disabled={i === blocks.length - 1}
                  aria-label={`Move block ${i + 1} down`}
                  className={control}
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => setBlocks((c) => c.filter((b) => b.id !== block.id))}
                  disabled={blocks.length === 1}
                  aria-label={`Remove block ${i + 1}`}
                  className="h-8 border border-hairline px-3 text-[14px] transition-colors hover:border-red-primary hover:text-red-primary disabled:opacity-30"
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="mt-4">
              {block.kind === "image" ? (
                <>
                  <ImageUpload
                    url={block.url}
                    onChange={(url) => update(block.id, { url } as Partial<PostBlock>)}
                    label="Picture"
                  />
                  <label className="mt-3 block">
                    <span className="text-[13px] text-stone">
                      Caption — also read aloud to anyone using a screen reader
                    </span>
                    <input
                      value={block.alt}
                      onChange={(e) => update(block.id, { alt: e.target.value } as Partial<PostBlock>)}
                      placeholder="What this photograph shows"
                      className="mt-1.5 w-full border border-hairline bg-white px-3.5 py-2.5 text-[16px] outline-none focus:border-red-primary"
                    />
                  </label>
                </>
              ) : (
                <textarea
                  value={block.text}
                  onChange={(e) => update(block.id, { text: e.target.value } as Partial<PostBlock>)}
                  rows={block.kind === "paragraph" ? 5 : block.kind === "list" ? 4 : 2}
                  placeholder={PLACEHOLDER[block.kind]}
                  aria-label={`${POST_BLOCK_LABEL[block.kind]} content`}
                  className={`w-full resize-y border border-hairline bg-white px-3.5 py-2.5 outline-none focus:border-red-primary ${
                    block.kind === "heading" || block.kind === "quote"
                      ? "font-display text-[20px] leading-snug"
                      : "text-[16px] leading-relaxed"
                  }`}
                />
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="py-1 text-[13px] text-stone">Insert after:</span>
              {POST_BLOCK_KINDS.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => add(k, i + 1)}
                  className="border border-hairline px-3 py-1 text-[13px] transition-colors hover:border-red-primary hover:text-red-primary"
                >
                  {POST_BLOCK_LABEL[k]}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
