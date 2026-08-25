"use client";
import { useState } from "react";
import Link from "next/link";
import { subscriptionPlans } from "@/lib/data";
import { AIStatusBadge, AIWarning } from "@/components/ui/AIStatus";
import { AICreationAssistant, AIMarketing, AIInsights } from "@/components/agency/AIAssistant";
import { useI18n } from "@/lib/i18n/provider";

export default function ProviderDashboard() {
  const { t } = useI18n();
  const [active, setActive] = useState("overview");
  const [offerStatus, setOfferStatus] = useState("AI_CHECKING");
  const [showIAAlert, setShowIAAlert] = useState(false);
  const menu = [
    ["overview", (t as any).providerDashboard.menu?.[0] || "Overview"],["offers", (t as any).providerDashboard.menu?.[1] || "Mes offres"],["create", (t as any).providerDashboard.menu?.[2] || "Créer une offre"],["reels","Reels"],["leads","Leads"],["demandes","Demandes"],["analytics","Analytics"],["ia","IA"],["marketing","Marketing"],["profil","Profil"],["abonnement","Abonnement"],["facturation","Facturation"],["parametres","Paramètres"]
  ];
  const plans2 = [
    { id:"basic", name:"BASIC", price:750, offers:4, reels:2, ia:false },
    { id:"premium", name:"PREMIUM", price:1000, offers:10, reels:5, ia:true },
    { id:"pro", name:"PRO", price:1250, offers:20, reels:15, ia:true },
  ];
  return (
    <div className="mx-auto max-w-[1280px] px-4 lg:px-6 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-[260px] shrink-0">
          <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-4 sticky top-[76px]">
            <div className="font-black mb-3 dark:text-white flex items-center gap-2"><span className="h-7 w-7 rounded-lg bg-[#0E7C6B] flex items-center justify-center text-white text-xs">🏢</span>Rowad Al Siyaha <span className="text-xs bg-[#ECFDF5] text-[#065F46] px-1.5 py-0.5 rounded-full">PRO</span></div>
            <nav className="space-y-1 text-sm font-semibold">
              {menu.map(([id,label])=>(
                <button key={id} onClick={()=>setActive(id)} className={`w-full text-left px-3 py-2 rounded-full flex justify-between ${active===id?"bg-[#0F172A] dark:bg-white dark:text-black text-white":"hover:bg-[#F1F5F9] dark:hover:bg-[#1A2332] dark:text-[#94A3B8]"}`}>{label}{id==="ia" && <span className="text-xs bg-[#14B8A6] text-white px-1.5 rounded-full">IA</span>}</button>
              ))}
            </nav>
            <div className="mt-4 rounded-2xl bg-[#E6F4F1] dark:bg-[#1A2332] p-4 border dark:border-[#1E293B]">
              <div className="text-xs font-bold text-[#0E7C6B] dark:text-[#6EE7B7]">Plan PRO</div><div className="text-sm font-bold dark:text-white">7/20 offres • 5/15 Reels</div>
              <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">IA + Marketing inclus</div>
              <Link href="#plans" className="text-xs font-bold text-[#0E7C6B] underline">Gérer →</Link>
            </div>
          </div>
        </aside>
        <div className="flex-1 space-y-6">
          {active==="overview" && (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  [(t as any).providerDashboard.impressions,"12.4k","+8%"],[(t as any).providerDashboard.whatsappClicks,"342","+12%"],[(t as any).providerDashboard.leads,"28","+5"],[(t as any).providerDashboard.conversion,"18%","+2.1%"],
                ].map(([k,v,d])=>(
                  <div key={k as string} className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-5 card-hover">
                    <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">{k as string}</div><div className="text-2xl font-black dark:text-white">{v as string}</div><div className="text-xs text-[#0E7C6B] dark:text-[#14B8A6] font-bold">{d as string}</div>
                  </div>
                ))}
              </div>
              <AIInsights />
              <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-6">
                <div className="flex items-center justify-between"><h3 className="font-bold dark:text-white">Performance 30 jours</h3><span className="text-xs bg-[#F1F5F9] dark:bg-[#1A2332] dark:text-white px-3 py-1 rounded-full">Nov 2026</span></div>
                <div className="mt-4 h-[100px] flex items-end gap-2">{[40,65,50,80,60,90,75,55,85,70,60,95].map((h,i)=>(<div key={i} className="flex-1 rounded-t-xl bg-[#0E7C6B] dark:bg-[#14B8A6]" style={{height:h}} />))}</div>
              </div>
            </>
          )}
          {active==="create" && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-6">
                <h3 className="font-bold dark:text-white flex items-center gap-2">Créer une offre — Workflow 2.0 <AIStatusBadge status={offerStatus as any}/></h3>
                <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">Riyad → Paris • IA vérifie cohérence titre/destination vs médias avant publication.</p>
                <div className="grid lg:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-3">
                    <select className="w-full h-11 rounded-full border px-3 dark:bg-[#1A2332] dark:text-white"><option>Riyad → Paris</option><option>Jeddah → Istanbul</option><option>Dammam → Maldives</option></select>
                    <input placeholder="Titre offre" defaultValue="Paris 7 jours — Vol + Hôtel 4★" className="w-full h-11 rounded-full border px-3 dark:bg-[#1A2332] dark:text-white" />
                    <div className="p-3 rounded-2xl border-2 border-dashed flex flex-col items-center gap-2"><span className="text-2xl">📸</span><span className="text-xs">Upload photos/vidéos (IA analysera)</span><button onClick={()=>{ setOfferStatus("AI_CHECKING"); setTimeout(()=>{ setOfferStatus("AI_WARNING"); setShowIAAlert(true); }, 1500); }} className="px-4 py-2 rounded-full bg-[#0F172A] dark:bg-white dark:text-black text-white text-xs">Uploader & analyser IA</button></div>
                  </div>
                  <AICreationAssistant onGenerate={()=>{}} />
                </div>
                {showIAAlert && <div className="mt-4"><AIWarning reason="Destination indiquée: Paris, mais une photo semble montrer New York (confiance 87%)." score={0.87} /><div className="flex gap-2 mt-3"><button onClick={()=>{ setOfferStatus("ADMIN_REVIEW"); setShowIAAlert(false); }} className="px-4 py-2 rounded-full bg-[#F59E0B] text-white text-sm">Envoyer en revue admin</button><button onClick={()=>{ setOfferStatus("DRAFT"); setShowIAAlert(false); }} className="px-4 py-2 rounded-full border dark:text-white text-sm">Corriger médias</button></div></div>}
                <div className="flex gap-2 mt-4"><span className="text-xs px-2 py-1 rounded-full bg-[#F1F5F9] dark:bg-[#1A2332] dark:text-white">Draft</span><span className="text-xs">→</span><span className="text-xs px-2 py-1 rounded-full bg-[#EFF6FF]">AI Checking</span><span className="text-xs">→</span><span className="text-xs px-2 py-1 rounded-full bg-[#ECFDF5]">Published</span></div>
              </div>
              <AIMarketing />
            </div>
          )}
          {active==="offers" && (
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-6">
              <h3 className="font-bold dark:text-white">Mes offres — Statuts IA</h3>
              <div className="mt-4 space-y-3">
                {[
                  { title:"Paris 7j", status:"AI_CHECKING", dest:"Riyad→Paris" },
                  { title:"Istanbul 5j", status:"PUBLISHED", dest:"Jeddah→Istanbul" },
                  { title:"Maldives 6j", status:"AI_WARNING", dest:"Dammam→Malé" },
                ].map(o=>(
                  <div key={o.title} className="flex items-center gap-3 p-3 rounded-2xl border dark:border-[#1E293B] dark:bg-[#1A2332]">
                    <div className="flex-1 dark:text-white"><div className="font-bold text-sm">{o.title} • {o.dest}</div></div><AIStatusBadge status={o.status as any} />
                  </div>
                ))}
              </div>
            </div>
          )}
          {active==="leads" && (
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-6">
              <h3 className="font-bold dark:text-white">Mes prospects — WhatsApp Analytics</h3>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">Chaque clic WhatsApp enregistré: OfferID, AgencyID, Timestamp, Device, City</p>
              <div className="mt-4 space-y-2">
                {[
                  { name:"Fahad — AlUla 3j", type:"WhatsApp", time:"Il y a 2h", dest:"AlUla" },
                  { name:"Yasir — Paris 7j", type:"Devis", time:"Il y a 5h", dest:"Paris" },
                ].map(r=>(
                  <div key={r.name} className="flex items-center gap-3 p-3 rounded-2xl border dark:border-[#1E293B]"><div className="h-10 w-10 rounded-full bg-[#E6F4F1] flex items-center justify-center">👤</div><div className="flex-1 dark:text-white"><div className="font-bold text-sm">{r.name}</div><div className="text-xs text-[#64748B]">{r.type} • {r.dest} • {r.time}</div></div><span className="px-2 py-1 rounded-full bg-[#25D366] text-white text-xs">WhatsApp</span></div>
                ))}
              </div>
            </div>
          )}
          {["reels","demandes","analytics","ia","marketing","profil","abonnement","facturation","parametres"].includes(active) && (
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-10 text-center">
              <div className="text-3xl mb-2">✨</div><div className="font-bold dark:text-white capitalize">{active} — Module 2.0</div><p className="text-sm text-[#64748B] dark:text-[#94A3B8]">Fonctionnalité {active} prête (IA, WhatsApp tracking, abonnements BASIC/PREMIUM/PRO configurables depuis admin).</p>
            </div>
          )}
          <div id="plans" className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-6">
            <h3 className="font-bold dark:text-white">Abonnements — BASIC / PREMIUM / PRO (configurables admin)</h3>
            <div className="grid lg:grid-cols-3 gap-4 mt-4">
              {plans2.map(p=>(
                <div key={p.id} className={`rounded-[20px] border p-5 ${p.name==="PREMIUM"?"border-[#0E7C6B] bg-[#F0FDF4] dark:bg-[#1A2332]":"border-[#E2E8F0] dark:border-[#1E293B] dark:bg-[#1A2332]"}`}>
                  <div className="font-black dark:text-white">{p.name}</div><div className="text-xl font-black dark:text-white">{p.price} SAR</div><div className="text-xs text-[#64748B]">{p.offers} offres • {p.reels} Reels • IA: {p.ia?"Oui":"Non"}</div>
                  <button className="w-full mt-3 h-9 rounded-full border dark:text-white text-sm">Configurer (admin)</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
