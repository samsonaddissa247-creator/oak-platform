"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, ExternalLink, Globe2, Mail } from "lucide-react";
import type { PartnerOrg } from "@/lib/supabase";

export default function PartnerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [partner, setPartner] = useState<PartnerOrg | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`/api/partners/${id}`, { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => setPartner(data))
      .catch(() => setPartner(null))
      .finally(() => setLoaded(true));
  }, [id]);

  if (!loaded) return <div className="mx-auto max-w-2xl p-8 text-center text-sm text-slate-400">Loading partner profile…</div>;
  if (!partner) return <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center text-sm text-slate-500 shadow-sm">Partner profile not found.</div>;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4 px-3 py-5 sm:px-6 sm:py-8">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-semibold text-[#162e55]">
        <ArrowLeft className="h-4 w-4" /> Partner Directory
      </button>

      <div className="relative overflow-hidden rounded-2xl bg-[#162e55] p-5 text-white shadow-sm sm:p-6">
        <div className="absolute -right-8 -top-6 h-32 w-32 rounded-full bg-white/10" />
        <div className="relative flex items-center gap-3">
          {partner.logo_url ? <Image src={partner.logo_url} alt="" width={48} height={48} unoptimized className="h-12 w-12 shrink-0 rounded-xl object-cover" /> : <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 text-sm font-bold">{initials(partner.name)}</div>}
          <div><p className="text-[10px] uppercase tracking-[0.14em] text-blue-200">Foundation · Partner since {partner.partner_since}</p><h1 className="mt-1 text-xl font-extrabold sm:text-2xl">{partner.name}</h1></div>
        </div>
        <div className="relative mt-4 flex flex-wrap gap-2">
          {partner.tags?.map((t) => (
            <span key={t} className="rounded-full bg-white/10 px-2 py-1 text-[10px]">
              {t}
            </span>
          ))}
        </div>
      </div>

      {partner.about && (
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">About</p>
          <p className="text-slate-700 text-sm">{partner.about}</p>
        </div>
      )}

      {(partner.contact_name || partner.contact_email) && (
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Contact at Convening
          </p>
          <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#162e55] text-xs font-bold text-white">{initials(partner.contact_name || "Contact")}</div><div><p className="font-medium text-slate-900">{partner.contact_name}</p><p className="text-sm text-slate-500">{partner.contact_email}</p></div></div>
        </div>
      )}

      {partner.website_url && (
        <a
          href={partner.website_url}
          target="_blank"
          className="flex items-center justify-between rounded-xl bg-[#162e55] px-4 py-3 text-sm font-semibold text-white shadow-sm"
        >
          <span className="flex items-center gap-2"><Globe2 className="h-4 w-4" />
          Visit Website
          </span><ExternalLink className="h-4 w-4" />
        </a>
      )}
      {partner.contact_email && <a href={`mailto:${partner.contact_email}`} className="flex items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-semibold text-slate-700 shadow-sm"><Mail className="h-4 w-4" /> Send Message</a>}
    </div>
  );
}

function initials(name: string) {
  return name.split(" ").map((word) => word[0]).join("").slice(0, 3).toUpperCase();
}
