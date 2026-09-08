"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase";

interface PartnerOrg {
  id: string;
  name: string;
  region: string | null;
  tags: string[] | null;
  about: string | null;
  website_url: string | null;
  contact_name: string | null;
  contact_email: string | null;
  partner_since: number | null;
}

export default function PartnerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [partner, setPartner] = useState<PartnerOrg | null>(null);

  useEffect(() => {
    supabaseBrowser
      .from("partner_orgs")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => setPartner(data));
  }, [id]);

  if (!partner) return <div className="flex-1 p-8 text-slate-400">Loading…</div>;

  return (
    <div className="flex-1 px-6 py-8 max-w-2xl mx-auto w-full space-y-6">
      <button onClick={() => router.back()} className="text-slate-500 text-sm">
        ‹ Partner Directory
      </button>

      <div className="rounded-2xl bg-[#0f1f3d] text-white p-6">
        <p className="text-xs uppercase tracking-wide text-slate-300">
          Partner since {partner.partner_since}
        </p>
        <h1 className="text-2xl font-extrabold mt-1">{partner.name}</h1>
        <div className="flex gap-2 mt-3">
          {partner.tags?.map((t) => (
            <span key={t} className="text-xs bg-white/10 rounded-full px-2 py-1">
              {t}
            </span>
          ))}
        </div>
      </div>

      {partner.about && (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">About</p>
          <p className="text-slate-700 text-sm">{partner.about}</p>
        </div>
      )}

      {(partner.contact_name || partner.contact_email) && (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">
            Contact at Convening
          </p>
          <p className="font-medium text-slate-900">{partner.contact_name}</p>
          <p className="text-sm text-slate-500">{partner.contact_email}</p>
        </div>
      )}

      {partner.website_url && (
        <a
          href={partner.website_url}
          target="_blank"
          className="block text-center rounded-xl bg-[#0f1f3d] text-white font-semibold py-3"
        >
          Visit Website
        </a>
      )}
    </div>
  );
}
