"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Globe2, Search } from "lucide-react";
import type { PartnerOrg } from "@/lib/supabase";

export default function PartnersPage() {
  const [partners, setPartners] = useState<PartnerOrg[]>([]);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All Regions");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/partners", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setPartners(Array.isArray(data) ? data : []))
      .catch(() => setPartners([]))
      .finally(() => setLoaded(true));
  }, []);

  const regions = ["All Regions", "Global", "Sub-Saharan Africa", "Northern Europe", "Middle East & North Africa"];
  const filtered = partners.filter(
    (p) =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  ).filter((p) => region === "All Regions" || p.region === region);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 px-3 py-5 sm:px-6 sm:py-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Partner Directory</h1>
        <p className="text-sm text-slate-500">{partners.length} partner organisations</p>
      </div>

      <div className="rounded-2xl bg-white p-3 shadow-sm"><label className="relative block"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input className="input pl-9" placeholder="Search organisations, focus areas…" value={search} onChange={(e) => setSearch(e.target.value)} /></label><div className="mt-3 flex gap-2 overflow-x-auto pb-1">{regions.map((item) => <button key={item} onClick={() => setRegion(item)} className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-semibold ${region === item ? "bg-[#162e55] text-white" : "bg-slate-100 text-slate-500"}`}>{item}</button>)}</div></div>

      {!loaded && <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-400 shadow-sm">Loading partner directory…</div>}

      {loaded && <section><div className="mb-2 flex items-center justify-between"><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Featured partners</p><Globe2 className="h-4 w-4 text-slate-300" /></div><div className="grid grid-cols-3 gap-2">{partners.slice(0, 3).map((p) => <Link key={p.id} href={`/partners/${p.id}`} className="rounded-2xl bg-white p-3 text-center shadow-sm"><PartnerMark partner={p} /><p className="mt-2 truncate text-xs font-bold text-slate-700">{p.name}</p><p className="truncate text-[10px] text-slate-400">{p.region}</p></Link>)}</div></section>}

      {loaded && <section><p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">All partners</p><div className="space-y-2">
        {filtered.map((p) => (
          <Link
            key={p.id}
            href={`/partners/${p.id}`}
            className="block rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 gap-3">
                <PartnerMark partner={p} />
                <div className="min-w-0"><p className="font-bold text-slate-900">{p.name}</p>
                <p className="text-sm text-slate-500">{p.region}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {p.tags?.map((t) => (
                    <span key={t} className="text-xs bg-slate-100 rounded-full px-2 py-1">
                      {t}
                    </span>
                  ))}
                </div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-slate-300" />
            </div>
            <div className="mt-3 flex flex-col gap-1 text-xs text-slate-400 sm:flex-row sm:justify-between">
              <span>Partner since {p.partner_since}</span>
              {p.website_url && <span className="break-all sm:text-right">{p.website_url}</span>}
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-slate-400 py-8">No partners match your search.</p>
        )}
      </div></section>}
    </div>
  );
}

function PartnerMark({ partner }: { partner: PartnerOrg }) {
  return partner.logo_url ? (
    <Image src={partner.logo_url} alt="" width={36} height={36} unoptimized className="h-9 w-9 shrink-0 rounded-xl object-cover" />
  ) : (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#162e55] text-[10px] font-bold text-white">{initials(partner.name)}</div>
  );
}

function initials(name: string) {
  return name.split(" ").map((word) => word[0]).join("").slice(0, 3).toUpperCase();
}
