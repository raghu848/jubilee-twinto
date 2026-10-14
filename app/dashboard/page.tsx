import Link from "next/link";
import { listLeads, listProjects } from "@/lib/store";
import { formatDateTime } from "@/lib/format";
import { STATUS_LABEL } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DashboardHome() {
  const [leads, projects] = await Promise.all([listLeads(), listProjects()]);

  const newLeads = leads.filter((l) => l.status === "new");
  const thisWeek = leads.filter(
    (l) => Date.now() - new Date(l.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000,
  );

  const figures = [
    { value: newLeads.length, label: "New enquiries", href: "/dashboard/leads?status=new" },
    { value: thisWeek.length, label: "Enquiries this week", href: "/dashboard/leads" },
    { value: leads.length, label: "Enquiries in total", href: "/dashboard/leads" },
    { value: projects.length, label: "Projects published", href: "/dashboard/projects" },
  ];

  return (
    <div>
      <h1 className="text-[clamp(2rem,4vw,3rem)]">Overview</h1>

      <div className="mt-10 grid gap-px border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
        {figures.map((f) => (
          <Link key={f.label} href={f.href} className="group bg-white p-6 transition-colors hover:bg-paper">
            <p className="font-display text-[44px] leading-none transition-colors group-hover:text-red-primary">
              {f.value}
            </p>
            <p className="mt-3 text-[15px] text-stone">{f.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
        <section>
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-[26px]">Latest enquiries</h2>
            <Link href="/dashboard/leads" className="link-underline pb-0.5 text-[15px] text-red-primary">
              Open the leads inbox
            </Link>
          </div>

          {leads.length === 0 ? (
            <p className="mt-6 border-t border-hairline pt-6 text-[16px] leading-relaxed text-stone">
              No enquiries yet. Every form on the website — the homepage, each
              project page and the contact page — lands here the moment someone
              submits it.
            </p>
          ) : (
            <ul className="mt-6 border-t border-hairline">
              {leads.slice(0, 6).map((lead) => (
                <li key={lead.id} className="border-b border-hairline py-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <p className="text-[17px]">
                      {lead.name}
                      <span className="ml-3 text-[15px] text-stone">{lead.phone}</span>
                    </p>
                    <p className="text-[14px] text-stone">{formatDateTime(lead.createdAt)}</p>
                  </div>
                  <p className="mt-1 text-[15px] text-stone">
                    {lead.projectName}
                    {lead.status === "new" && (
                      <span className="ml-3 text-red-primary">New</span>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-[26px]">Projects</h2>
            <Link href="/dashboard/projects/new" className="link-underline pb-0.5 text-[15px] text-red-primary">
              Add a project
            </Link>
          </div>

          <ul className="mt-6 border-t border-hairline">
            {projects.map((p) => (
              <li key={p.id} className="border-b border-hairline py-4">
                <Link href={`/dashboard/projects/${p.id}`} className="group block">
                  <p className="text-[17px] transition-colors group-hover:text-red-primary">
                    {p.name}
                  </p>
                  <p className="mt-1 text-[14px] text-stone">
                    {p.locality}, {p.city} · {STATUS_LABEL[p.status]} ·{" "}
                    {p.gallery.length} {p.gallery.length === 1 ? "file" : "files"}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
