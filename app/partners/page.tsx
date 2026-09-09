"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase";

interface PartnerOrg {
  id: string;
  name: string;
  region: string | null;
  tags: string[] | null;
  website_url: string | null;
  partner_since: number | null;
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<PartnerOrg[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    supabaseBrowser
      .from("partner_orgs")
      .select("id, name, region, tags, website_url, partner_since")
      .order("name")
      .then(({ data }) => setPartners(data || []));
  }, []);

  const filtered = partners.filter(
    (p) =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-3 py-5 sm:px-6 sm:py-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Partner Directory</h1>
        <p className="text-sm text-slate-500">{partners.length} partner organisations</p>
      </div>

      <input
        className="input"
        placeholder="Search organisations, focus areas…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="space-y-3">
        {filtered.map((p) => (
          <Link
            key={p.id}
            href={`/partners/${p.id}`}
            className="block bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-bold text-slate-900">{p.name}</p>
                <p className="text-sm text-slate-500">{p.region}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {p.tags?.map((t) => (
                    <span key={t} className="text-xs bg-slate-100 rounded-full px-2 py-1">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-slate-300">›</span>
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
      </div>
    </div>
  );
}
