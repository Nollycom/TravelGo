"use client";
import { useState } from "react";
import { AIStatusBadge } from "@/components/ui/AIStatus";

export function AICreationAssistant({ onGenerate }: { onGenerate:(data:any)=>void }){
  const [input, setInput] = useState("Paris, 7 jours, hôtel 4 étoiles, vol inclus, transfert inclus, 4500 SAR");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const generate = ()=>{
    setLoading(true);
    setTimeout(()=>{
      const res = {
        title: "Paris 7 jours — Vol + Hôtel 4★ + Transfert",
        description: "Découvrez Paris, de la Tour Eiffel à Montmartre. Séjour 7j avec vol direct depuis Riyad, hôtel 4★ centre, petit-déjeuner et transfert aéroport. Idéal lune de miel & culture.",
        program: "J1 Vol Riyad→Paris • J2-6 Louvre, Seine, Versailles • J7 Retour",
        hashtags: "#Paris #TravGoKSA #Voyage",
        faq: "Q: Vol inclus? R: Oui, direct Saudia."
      };
      setResult(res); setLoading(false);
    }, 1200);
  };
  return (
    <div className="rounded-[20px] bg-gradient-to-br from-[#0F172A] to-[#1A2332] text-white p-6 border border-[#1E293B]">
      <div className="flex items-center gap-2"><span className="h-6 w-6 rounded-lg bg-[#14B8A6] flex items-center justify-center text-xs">✨</span><span className="font-bold">Créer avec l'IA</span><AIStatusBadge status="AI_APPROVED"/></div>
      <p className="text-sm text-white/70 mt-1">Saisis simplement — l'IA génère titre, description, programme, hashtags.</p>
      <textarea value={input} onChange={e=>setInput(e.target.value)} className="w-full mt-3 h-20 rounded-2xl bg-white/10 border border-white/10 p-3 text-sm text-white placeholder:text-white/50" placeholder="Paris, 7 jours..." />
      <button onClick={generate} disabled={loading} className="mt-3 w-full h-11 rounded-full bg-[#14B8A6] text-white font-bold disabled:opacity-50">{loading?"Génération IA…":"Générer avec l'IA →"}</button>
      {result && (
        <div className="mt-4 p-4 rounded-2xl bg-white text-[#0F172A] space-y-2">
          <div className="font-bold text-sm">{result.title}</div><div className="text-xs text-[#64748B]">{result.description}</div>
          <div className="text-xs"><b>Programme:</b> {result.program}</div><div className="text-xs text-[#0E7C6B]">{result.hashtags}</div>
          <button onClick={()=>onGenerate(result)} className="w-full h-9 rounded-full bg-[#0F172A] text-white text-sm">Utiliser ce contenu</button>
        </div>
      )}
    </div>
  );
}

export function AIMarketing({ }){
  const [idea, setIdea] = useState("");
  const [out, setOut] = useState("");
  const gen = (type:string)=>{
    const txt = type==="Reel" ? "Script Reel Maldives 15s: Hook 'Rêvez-vous d'eau turquoise?' → villa → CTA WhatsApp" : `Pub ${idea || "Istanbul"}: Titre 'Istanbul à -20% depuis Riyad' • CTA Réserver`;
    setOut(txt);
  };
  return (
    <div className="rounded-[20px] bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] p-6">
      <div className="font-bold dark:text-white">TravGo AI Marketing</div>
      <div className="flex gap-2 mt-3"><input value={idea} onChange={e=>setIdea(e.target.value)} placeholder="Ex: Istanbul, Maldives, Ramadan..." className="flex-1 h-10 rounded-full border px-3 bg-[#F8FAFB] dark:bg-[#1A2332] dark:text-white text-sm" /><button onClick={()=>gen("Pub")} className="px-4 h-10 rounded-full bg-[#0E7C6B] text-white text-sm">Créer pub</button><button onClick={()=>gen("Reel")} className="px-4 h-10 rounded-full border dark:text-white text-sm">Script Reel</button></div>
      {out && <div className="mt-3 p-3 rounded-2xl bg-[#F8FAFB] dark:bg-[#1A2332] text-sm dark:text-white">{out}</div>}
    </div>
  );
}

export function AIInsights(){
  return (
    <div className="rounded-[20px] bg-[#EFF6FF] dark:bg-[#0F172A] border border-[#BFDBFE] dark:border-[#1E293B] p-5">
      <div className="font-bold text-sm text-[#1E40AF] dark:text-[#93C5FD]">TravGo AI Insights</div>
      <ul className="mt-2 space-y-2 text-sm text-[#1E3A8A] dark:text-[#BFDBFE]">
        <li>• Votre offre <b>Istanbul</b> a +42% clics WhatsApp cette semaine.</li>
        <li>• Les voyageurs préfèrent vos offres 5–7 jours.</li>
        <li>• Recommandation: améliore la couverture AlUla (CTR +18% potentiel).</li>
      </ul>
    </div>
  );
}
