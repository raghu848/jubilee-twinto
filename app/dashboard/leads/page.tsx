import Link from "next/link";
import { listLeads, listProjects, type LeadFilter } from "@/lib/store";
import { formatDateTime } from "@/lib/format";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/types";
import { LeadStatusSelect } from "@/components/dashboard/lead-status-select";

export const dynamic = "force-dynamic";

type Search = { status?: string; project?: string; from?: string; to?: string };

const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  closed: "Closed",
};

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const params = await searchParams;
  const filter: LeadFilter = {
    status: (params.status as LeadStatus) ?? "all",
    projectSlug: params.project ?? "all",
    from: params.from || undefined,
    to: params.to || undefined,
  };

  const [leads, projects] = await Promise.all([listLeads(filter), listProjects()]);

  const exportQuery = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v && v !== "all") exportQuery.set(k, v);
  }

  const field =
    "border border-hairline bg-white px-3 py-2 text-[15px] outline-none focus:border-red-primary";

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="text-[clamp(2rem,4vw,3rem)]">Leads</h1>
          <p className="measure mt-3 text-[16px] leading-relaxed text-stone">
            Every enquiry submitted anywhere on the website, newest first.
          </p>
        </div>

        <a
          href={`/api/leads/export${exportQuery.toString() ? `?${exportQuery}` : ""}`}
          className="border border-hairline bg-white px-5 py-2.5 text-[15px] transition-colors hover:border-red-primary hover:text-red-primary"
        >
          Export {leads.length} to CSV
        </a>
      </div>

      {/* GET form: filters end up in the URL, so a filtered view can be shared. */}
      <form method="get" className="mt-10 border border-hairline bg-white p-5">
        <div className="flex flex-wrap items-end gap-5">
          <div>
            <label htmlFor="status" className="block text-[13px] text-stone">
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={params.status ?? "all"}
              className={`mt-1.5 ${field}`}
            >
              <option value="all">All</option>
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="project" className="block text-[13px] text-stone">
              Project
            </label>
            <select
              id="project"
              name="project"
              defaultValue={params.project ?? "all"}
              className={`mt-1.5 ${field}`}
            >
              <option value="all">All</option>
              {projects.map((p) => (
                <option key={p.id} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="from" className="block text-[13px] text-stone">
              From
            </label>
            <input
              id="from"
              name="from"
              type="date"
              defaultValue={params.from ?? ""}
              className={`mt-1.5 ${field}`}
            />
          </div>

          <div>
            <label htmlFor="to" className="block text-[13px] text-stone">
              To
            </label>
            <input
              id="to"
              name="to"
              type="date"
              defaultValue={params.to ?? ""}
              className={`mt-1.5 ${field}`}
            />
          </div>

          <button
            type="submit"
            className="bg-red-primary px-5 py-2.5 text-[15px] text-white transition-colors hover:bg-red-deep"
          >
            Apply
          </button>

          <Link href="/dashboard/leads" className="pb-2.5 text-[15px] text-stone hover:text-ink">
            Clear
          </Link>
        </div>
      </form>

      {leads.length === 0 ? (
        <p className="mt-12 border-t border-hairline pt-8 text-[17px] leading-relaxed text-stone">
          No enquiries match these filters.
        </p>
      ) : (
        <div className="mt-10 overflow-x-auto border border-hairline bg-white">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr className="border-b border-hairline">
                <th scope="col" className="px-5 py-3.5 text-[13px] font-normal text-stone">Received</th>
                <th scope="col" className="px-5 py-3.5 text-[13px] font-normal text-stone">Name</th>
                <th scope="col" className="px-5 py-3.5 text-[13px] font-normal text-stone">Contact</th>
                <th scope="col" className="px-5 py-3.5 text-[13px] font-normal text-stone">Project</th>
                <th scope="col" className="px-5 py-3.5 text-[13px] font-normal text-stone">Source</th>
                <th scope="col" className="px-5 py-3.5 text-[13px] font-normal text-stone">Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-hairline last:border-b-0 align-top">
                  <td className="px-5 py-4 text-[14px] whitespace-nowrap text-stone">
                    {formatDateTime(lead.createdAt)}
                  </td>
                  <td className="px-5 py-4 text-[15px]">
                    {lead.name}
                    {lead.message && (
                      <p className="measure-tight mt-1.5 text-[14px] leading-relaxed text-stone">
                        {lead.message}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-4 text-[15px] whitespace-nowrap">
                    <a href={`tel:${lead.phone}`} className="hover:text-red-primary">
                      {lead.phone}
                    </a>
                    {lead.email && (
                      <p className="mt-1">
                        <a
                          href={`mailto:${lead.email}`}
                          className="text-[14px] text-stone hover:text-red-primary"
                        >
                          {lead.email}
                        </a>
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-4 text-[15px]">{lead.projectName}</td>
                  <td className="px-5 py-4 text-[14px] text-stone">{lead.sourcePage}</td>
                  <td className="px-5 py-4">
                    <LeadStatusSelect id={lead.id} status={lead.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
