import { ShieldCheck, Globe, Database, Bell, Lock } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-[920px] space-y-6">
      <header>
        <h1 className="h-title">Settings</h1>
        <p className="h-sub mt-1">
          Workspace, data residency, integrations and notifications.
        </p>
      </header>

      <Section icon={ShieldCheck} title="Defensibility" subtitle="The non-negotiables that make this product enterprise-ready.">
        <Toggle label="Immutable audit trail" enabled description="Every action timestamped, user-attributed and hash-chained. Cannot be edited after the fact." />
        <Toggle label="No AI auto-decisions" enabled description="Claude surfaces evidence and risks. Humans evaluate, score and award." />
        <Toggle label="Watermarked exports" enabled description="Bid materials downloaded by evaluators carry visible and invisible watermarks." />
      </Section>

      <Section icon={Globe} title="Data residency" subtitle="Where customer data lives.">
        <Choice label="Region" value="UAE (Fujairah / Frankfurt fallback)" />
        <Choice label="Sub-processors" value="Anthropic (model inference, no training)" />
        <Choice label="Retention" value="7 years after award (configurable)" />
      </Section>

      <Section icon={Database} title="Integrations" subtitle="Connect existing procurement systems.">
        <IntegrationRow name="SAP Ariba" status="Available" />
        <IntegrationRow name="Coupa" status="Available" />
        <IntegrationRow name="Oracle Procurement Cloud" status="Available" />
        <IntegrationRow name="Tejari" status="Beta" />
        <IntegrationRow name="Etimad (KSA)" status="Roadmap" />
      </Section>

      <Section icon={Bell} title="Notifications">
        <Toggle label="New bid received" enabled description="Notify procurement lead when a vendor uploads a bid." />
        <Toggle label="High-severity risk flagged" enabled description="Alert procurement lead on high-severity risks." />
        <Toggle label="Clarification responded" description="Notify the panel when a vendor responds to a clarification." />
      </Section>

      <Section icon={Lock} title="Security">
        <Toggle label="SSO (SAML / OIDC)" enabled />
        <Toggle label="Two-factor authentication" enabled />
        <Toggle label="IP allowlisting" description="Restrict access to known office networks." />
      </Section>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: any;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-ink-200/70 bg-white shadow-soft">
      <header className="flex items-center gap-3 border-b border-ink-200/70 px-5 py-4">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-50 text-violet-600">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <h2 className="font-display text-[15px] font-semibold tracking-tight text-ink-900">
            {title}
          </h2>
          {subtitle ? <p className="text-[12px] text-ink-500">{subtitle}</p> : null}
        </div>
      </header>
      <div className="divide-y divide-ink-200/70">{children}</div>
    </section>
  );
}

function Toggle({
  label,
  description,
  enabled,
}: {
  label: string;
  description?: string;
  enabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-5 py-3.5">
      <div className="min-w-0">
        <p className="text-[13px] font-semibold text-ink-900">{label}</p>
        {description ? (
          <p className="text-[11.5px] leading-snug text-ink-500">{description}</p>
        ) : null}
      </div>
      <span
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition ${
          enabled ? "bg-violet-500" : "bg-ink-200"
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition ${
            enabled ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </span>
    </div>
  );
}

function Choice({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 px-5 py-3.5">
      <p className="text-[13px] font-semibold text-ink-900">{label}</p>
      <p className="text-[12px] text-ink-600">{value}</p>
    </div>
  );
}

function IntegrationRow({ name, status }: { name: string; status: string }) {
  return (
    <div className="flex items-center justify-between gap-3 px-5 py-3.5">
      <p className="text-[13px] font-semibold text-ink-900">{name}</p>
      <span
        className={
          status === "Available"
            ? "pill-emerald"
            : status === "Beta"
            ? "pill-sky"
            : "pill"
        }
      >
        {status}
      </span>
    </div>
  );
}
