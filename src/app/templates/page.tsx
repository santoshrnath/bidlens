import { listTenderTemplates } from "@/lib/data";
import { Layers, ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TemplatesPage() {
  const templates = await listTenderTemplates();

  return (
    <div className="mx-auto w-full max-w-[1100px] space-y-6">
      <header>
        <h1 className="h-title">Templates</h1>
        <p className="h-sub mt-1">
          Pre-loaded comparison schemas per procurement category. Saves a week of setup per tender.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {templates.map((t) => (
          <div
            key={t.id}
            className="group rounded-2xl border border-ink-200/70 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-lift"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 text-white">
                  <Layers className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="font-display text-[15px] font-semibold tracking-tight text-ink-900">
                    {t.name}
                  </h3>
                  <p className="text-[11px] text-ink-500">{t.category}</p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-ink-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet-600" />
            </div>
            <p className="mt-3 text-[12.5px] leading-relaxed text-ink-600">
              {t.description}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <button className="btn-ghost text-[12px]">Preview schema</button>
              <button className="btn-primary text-[12px]">Use template</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
