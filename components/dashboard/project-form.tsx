"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { saveProjectAction } from "@/app/dashboard/projects/actions";
import { emptyProjectFormState } from "@/lib/project-form";
import { MediaManager } from "@/components/dashboard/media-manager";
import {
  PROJECT_STATUSES,
  PROJECT_TYPES,
  STATUS_LABEL,
  TYPE_LABEL,
  type Project,
  type Spec,
} from "@/lib/types";

const field =
  "mt-1.5 w-full border border-hairline bg-white px-3.5 py-2.5 text-[16px] outline-none transition-colors focus:border-red-primary";
const label = "text-[13px] text-stone";

export function ProjectForm({ project }: { project?: Project }) {
  const [state, formAction, isPending] = useActionState(saveProjectAction, emptyProjectFormState);
  const [specs, setSpecs] = useState<Spec[]>(
    project?.specs.length ? project.specs : [{ label: "", value: "" }],
  );

  const err = (key: string) =>
    state.fieldErrors[key] ? (
      <p className="mt-1.5 text-[13px] text-red-primary">{state.fieldErrors[key]}</p>
    ) : null;

  return (
    <form action={formAction} className="mt-10 space-y-14">
      <input type="hidden" name="id" value={project?.id ?? ""} />
      <input type="hidden" name="specs" value={JSON.stringify(specs)} />

      <section>
        <h2 className="text-[26px]">The basics</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="name" className={label}>Project name</label>
            <input id="name" name="name" defaultValue={project?.name} required className={field} />
            {err("name")}
          </div>

          <div>
            <label htmlFor="city" className={label}>City</label>
            <input id="city" name="city" defaultValue={project?.city} required className={field} />
            {err("city")}
          </div>

          <div>
            <label htmlFor="locality" className={label}>Locality</label>
            <input
              id="locality"
              name="locality"
              defaultValue={project?.locality}
              required
              className={field}
            />
            {err("locality")}
          </div>

          <div>
            <label htmlFor="type" className={label}>Type</label>
            <select id="type" name="type" defaultValue={project?.type ?? "apartments"} className={field}>
              {PROJECT_TYPES.map((t) => (
                <option key={t} value={t}>{TYPE_LABEL[t]}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="status" className={label}>Status</label>
            <select id="status" name="status" defaultValue={project?.status ?? "upcoming"} className={field}>
              {PROJECT_STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_LABEL[s]}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="priceFrom" className={label}>Price from</label>
            <input
              id="priceFrom"
              name="priceFrom"
              defaultValue={project?.priceFrom}
              placeholder="₹2.15 Cr, or: On request"
              className={field}
            />
          </div>

          <div>
            <label htmlFor="slug" className={label}>
              Web address <span className="text-stone/70">(leave blank to build it from the name)</span>
            </label>
            <input
              id="slug"
              name="slug"
              defaultValue={project?.slug}
              placeholder="jubilee-vantage"
              className={field}
            />
            <p className="mt-1.5 text-[13px] text-stone">
              The page will be at /projects/<span className="text-ink">{project?.slug ?? "…"}</span>
            </p>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="tagline" className={label}>
              One-line hook <span className="text-stone/70">(shown on cards and at the top of the page)</span>
            </label>
            <input id="tagline" name="tagline" defaultValue={project?.tagline} required className={field} />
            {err("tagline")}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className={label}>Description</label>
            <textarea
              id="description"
              name="description"
              rows={7}
              defaultValue={project?.description}
              required
              className={`${field} resize-y leading-relaxed`}
            />
            {err("description")}
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center gap-3 text-[16px]">
              <input
                type="checkbox"
                name="flagship"
                defaultChecked={project?.flagship}
                className="h-4 w-4 accent-[#A32638]"
              />
              Feature this project on the homepage
            </label>
            <p className="mt-1.5 text-[13px] text-stone">
              Only one project can hold this at a time — ticking it here clears it
              from whichever project has it now.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-[26px]">Photographs and video</h2>
        <p className="measure mt-2 text-[15px] leading-relaxed text-stone">
          Drag to reorder. The first image is used as the project card and the
          header of the project page.
        </p>
        <div className="mt-6">
          <MediaManager name="gallery" initial={project?.gallery ?? []} />
        </div>
      </section>

      <section>
        <h2 className="text-[26px]">Configurations</h2>
        <p className="mt-2 text-[15px] text-stone">One per line.</p>
        <textarea
          name="configurations"
          rows={5}
          defaultValue={project?.configurations.join("\n")}
          placeholder={"3 BHK — 1,940 sq ft\n4 BHK — 3,180 sq ft"}
          className={`${field} resize-y leading-relaxed`}
        />
      </section>

      <section>
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="text-[26px]">Specification</h2>
          <button
            type="button"
            onClick={() => setSpecs((s) => [...s, { label: "", value: "" }])}
            className="border border-hairline px-4 py-2 text-[14px] transition-colors hover:border-red-primary hover:text-red-primary"
          >
            Add a row
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {specs.map((spec, i) => (
            <div key={i} className="flex flex-wrap items-start gap-3">
              <input
                value={spec.label}
                onChange={(e) =>
                  setSpecs((s) => s.map((row, j) => (j === i ? { ...row, label: e.target.value } : row)))
                }
                placeholder="Land parcel"
                aria-label={`Specification ${i + 1} label`}
                className="mt-0 w-full flex-1 border border-hairline bg-white px-3.5 py-2.5 text-[16px] outline-none focus:border-red-primary sm:w-auto sm:min-w-[200px]"
              />
              <input
                value={spec.value}
                onChange={(e) =>
                  setSpecs((s) => s.map((row, j) => (j === i ? { ...row, value: e.target.value } : row)))
                }
                placeholder="4.2 acres"
                aria-label={`Specification ${i + 1} value`}
                className="mt-0 w-full flex-1 border border-hairline bg-white px-3.5 py-2.5 text-[16px] outline-none focus:border-red-primary sm:w-auto sm:min-w-[200px]"
              />
              <button
                type="button"
                onClick={() => setSpecs((s) => s.filter((_, j) => j !== i))}
                aria-label={`Remove specification ${i + 1}`}
                className="border border-hairline px-4 py-2.5 text-[14px] transition-colors hover:border-red-primary hover:text-red-primary"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-[26px]">What is in the development</h2>
        <p className="mt-2 text-[15px] text-stone">One per line.</p>
        <textarea
          name="amenities"
          rows={6}
          defaultValue={project?.amenities.join("\n")}
          placeholder={"18,000 sq ft clubhouse\nTwo-level podium parking"}
          className={`${field} resize-y leading-relaxed`}
        />
      </section>

      <section>
        <h2 className="text-[26px]">Approvals and map</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="reraId" className={label}>
              RERA registration number <span className="text-stone/70">(optional)</span>
            </label>
            <input id="reraId" name="reraId" defaultValue={project?.reraId} className={field} />
            <p className="mt-1.5 text-[13px] text-stone">
              Left blank, the page says the number is available on request.
            </p>
          </div>

          <div>
            <label htmlFor="mapQuery" className={label}>Map location</label>
            <input
              id="mapQuery"
              name="mapQuery"
              defaultValue={project?.mapQuery}
              placeholder="Kokapet, Hyderabad, Telangana"
              className={field}
            />
          </div>
        </div>
      </section>

      {state.status === "error" && state.message && (
        <p role="alert" className="text-[15px] text-red-primary">
          {state.message}
        </p>
      )}

      <div className="sticky bottom-0 -mx-6 flex flex-wrap items-center gap-5 border-t border-hairline bg-paper/95 px-6 py-5 backdrop-blur-sm lg:-mx-10 lg:px-10">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2.5 bg-red-primary px-7 py-3.5 text-[15px] text-white transition-colors hover:bg-red-deep disabled:cursor-progress disabled:bg-red-primary/70"
        >
          {isPending && (
            <span
              className="spin block h-3.5 w-3.5 rounded-full border-[1.5px] border-current border-t-transparent"
              aria-hidden="true"
            />
          )}
          {isPending ? "Saving" : project ? "Save changes" : "Publish project"}
        </button>

        <Link href="/dashboard/projects" className="text-[15px] text-stone hover:text-ink">
          Cancel
        </Link>

        {project && (
          <Link
            href={`/projects/${project.slug}`}
            target="_blank"
            className="ml-auto text-[15px] text-stone hover:text-red-primary"
          >
            View the live page ↗
          </Link>
        )}
      </div>
    </form>
  );
}
