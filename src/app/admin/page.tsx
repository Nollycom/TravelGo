"use client";
import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { offers as initialOffers, providers as initialProviders, categories as initialCats, destinations as initialDests, reels as initialReels } from "@/lib/data";
import { useI18n } from "@/lib/i18n/provider";

export default function AdminPage() {
  const { t } = useI18n();
  const [active, setActive] = useState(0);
  const [offers, setOffers] = useState(initialOffers);
  const [providers, setProviders] = useState(initialProviders);
  const [cats, setCats] = useState(initialCats);
  const [dests, setDests] = useState(initialDests);
  const [reels, setReels] = useState(initialReels);
  const [toast, setToast] = useState("");
  const [isAdmin, setIsAdmin] = useState(true);
  const [notifTitle, setNotifTitle] = useState("");
  const [notifMsg, setNotifMsg] = useState("");
  const [pendingProviders, setPendingProviders] = useState<any[]>([]);

  useEffect(()=>{
    const role = localStorage.getItem("travgo-role");
    const user = localStorage.getItem("travgo-user");
    if(role && role!=="ADMIN" && role!=="SUPER_ADMIN") setIsAdmin(false);
    if(!role && !user) setIsAdmin(false);
  },[]);
  // Temps réel : prestataires en attente
  useEffect(()=>{
    const q = query(collection(db, "users"), where("role", "==", "PROVIDER_PENDING"));
    const unsub = onSnapshot(q, (snap)=> setPendingProviders(snap.docs.map(d=>({ id:d.id, ...d.data() }))), ()=> setPendingProviders([]));
    return ()=> unsub();
  },[]);
  const show = (m:string)=>{ setToast(m); setTimeout(()=>setToast(""),2200); };
  const approveOffer = (id:string)=>{ setOffers(o=>o.map(x=>x.id===id?{...x, verified:true}:x)); show("✓ "+(t as any).admin.approve); };
  const refuseOffer = (id:string)=>{ setOffers(o=>o.filter(x=>x.id!==id)); show((t as any).admin.refuse); };
  const approveProv = async (id:string)=>{
    try { await updateDoc(doc(db, "users", id), { role: "PROVIDER", status: "ACTIVE", verified: true }); show("✓ Prestataire activé — dashboard débloqué"); }
    catch(e:any){ show("✗ "+e.message); }
  };
  const refuseProv = async (id:string)=>{
    try { await updateDoc(doc(db, "users", id), { role: "USER", status: "REFUSED" }); show("Prestataire refusé"); }
    catch(e:any){ show("✗ "+e.message); }
  };
  const suspendReel = (id:string)=>{ setReels(r=>r.filter(x=>x.id!==id)); show((t as any).admin.refuse); };
  const sponsorReel = (id:string)=>{ show("✓ "+(t as any).admin.sponsor); };

  const menu = (t as any).admin?.menu;
  const statsLabels = (t as any).admin?.stats;

  // Seul compte réel conservé - demo nettoyé (khalil ADMIN)
  const users = [
    { id:"khalil-admin", name:"khalil", email:"khalil.alnajjar81@gmail.com", role:"ADMIN", city:"Jeddah", status:"Actif" },
  ];
  const demandes = [
    { id:"q1", dest:"AlUla 3j VIP", user:"Fahad", travelers:2, budget:"3000 SAR", status:"3 devis", provider:"Rowad Al Siyaha" },
    { id:"q2", dest:"Jeddah Mer Rouge 4j", user:"Yasir", travelers:4, budget:"1890 SAR", status:"En attente", provider:"—" },
    { id:"q3", dest:"NEOM 5j", user:"Khalid", travelers:2, budget:"4590 SAR", status:"2 devis", provider:"NEOM Elite" },
  ];
  const campaigns = [
    { id:"c1", name:"AlUla Hiver -20%", placement:"Homepage Banner", imp:"142k", clicks:"4.2k", ctr:"3.0%", status:"Active" },
    { id:"c2", name:"Jeddah Plongée", placement:"Sponsored Offer", imp:"89k", clicks:"3.8k", ctr:"4.3%", status:"Active" },
  ];

  return (
    <div className="mx-auto max-w-[1280px] px-4 lg:px-6 py-6">
      {!isAdmin && <div className="mb-4 p-3 rounded-2xl bg-[#FEF2F2] dark:bg-[#2A0F12] border border-[#FECACA] dark:border-[#450A18] text-sm text-[#991B1B] dark:text-[#FCA5A5]">Accès restreint — connecte-toi avec <b>khalil.alnajjar81@gmail.com / 2026@</b></div>}
      {toast && <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-[#0F172A] dark:bg-white text-white dark:text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg z-50">{toast}</div>}
      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-[240px] shrink-0">
          <div className="bg-[#0F172A] text-white rounded-[20px] p-4 sticky top-[76px] border dark:border-[#1E293B]">
            <div className="font-black mb-4 flex items-center gap-2"><span className="h-6 w-6 rounded-lg bg-[#14B8A6] flex items-center justify-center text-xs">A</span>{(t as any).admin.title}</div>
            <nav className="space-y-1 text-sm">
              {menu.map((l:string,i:number)=>(
                <button key={l} onClick={()=>setActive(i)} className={`w-full text-left block px-3 py-2 rounded-full transition ${i===active ? "bg-white text-[#0F172A] font-bold" : "text-white/80 hover:bg-white/10"}`}>{l}</button>
              ))}
            </nav>
            <div className="mt-4 p-3 rounded-2xl bg-white/10 border border-white/10 text-xs">
              <div className="font-bold">khalil — ADMIN</div><div className="opacity-70">khalil.alnajjar81@gmail.com</div><div className="mt-1 text-[#6EE7B7]">● En ligne</div>
            </div>
          </div>
        </aside>
        <div className="flex-1 space-y-6">
          {active===0 && (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[[statsLabels[0],"4 821",(t as any).admin.users],[statsLabels[1],"182",(t as any).admin.providers],[statsLabels[2],"642",(t as any).admin.offers],[statsLabels[3],"84 200 SAR",(t as any).admin.revenue]].map(([k,v,d])=>(
                  <div key={k as string} className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-5 card-hover">
                    <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">{k as string}</div><div className="text-xl font-black dark:text-white">{v as string}</div><div className="text-xs text-[#0E7C6B] dark:text-[#14B8A6] font-bold">{d as string}</div>
                  </div>
                ))}
              </div>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-6">
                  <h3 className="font-bold mb-3 dark:text-white">{(t as any).admin.pendingProviders} — Temps réel ({pendingProviders.length})</h3>
                  {pendingProviders.length===0 ? <div className="text-sm text-[#64748B] py-4 text-center">Aucun prestataire en attente — les nouvelles inscriptions apparaîtront ici en temps réel.</div> : (
                  <div className="space-y-3">{pendingProviders.slice(0,4).map((p:any)=>(
                    <div key={p.id} className="flex items-center gap-3 p-3 rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] dark:bg-[#1A2332] card-hover">
                      <img src={p.logo || p.photoURL || `https://i.pravatar.cc/100?u=${p.email}`} alt={p.name} className="h-10 w-10 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0"><div className="font-bold text-sm dark:text-white truncate">{p.name}</div><div className="text-xs text-[#64748B] truncate">{p.city || "—"} • {p.email} • {(t as any).admin.waiting}</div></div>
                      <div className="flex gap-1"><button onClick={()=>approveProv(p.id)} className="px-3 py-1 rounded-full bg-[#0E7C6B] text-white text-xs font-bold">✓</button><button onClick={()=>refuseProv(p.id)} className="px-2 py-1 rounded-full border text-xs">✕</button></div>
                    </div>
                  ))}</div>
                  )}
                </div>
                <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-6">
                  <h3 className="font-bold mb-3 dark:text-white">{(t as any).admin.pendingOffers}</h3>
                  <div className="space-y-3">{offers.slice(0,4).map(o=>(
                    <div key={o.id} className="flex gap-3 p-3 rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] dark:bg-[#1A2332] card-hover">
                      <img src={o.image} alt={o.title} className="h-12 w-16 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0"><div className="font-bold text-sm line-clamp-1 dark:text-white">{o.title}</div><div className="text-xs text-[#64748B] dark:text-[#94A3B8]">{o.provider.name} • {o.destination}</div></div>
                      <div className="flex flex-col gap-1"><button onClick={()=>approveOffer(o.id)} className="px-3 py-1 rounded-full bg-[#0E7C6B] dark:bg-[#14B8A6] text-white text-xs font-bold icon-3d">{(t as any).admin.approve}</button><button onClick={()=>refuseOffer(o.id)} className="px-3 py-1 rounded-full border dark:text-white text-xs">{(t as any).admin.refuse}</button></div>
                    </div>
                  ))}</div>
                </div>
              </div>
              <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-6">
                <h3 className="font-bold mb-3 dark:text-white">{(t as any).admin.analytics}</h3>
                <div className="grid lg:grid-cols-3 gap-6">
                  <div><div className="text-xs text-[#64748B] dark:text-[#94A3B8]">{(t as any).admin.popularSearches}</div><ul className="mt-2 space-y-2 text-sm dark:text-white"><li className="flex justify-between"><span>AlUla</span><b>1 240</b></li><li className="flex justify-between"><span>Jeddah</span><b>980</b></li><li className="flex justify-between"><span>Riyad</span><b>720</b></li><li className="flex justify-between"><span>NEOM</span><b>640</b></li></ul></div>
                  <div><div className="text-xs text-[#64748B] dark:text-[#94A3B8]">{(t as any).admin.ctr}</div><div className="mt-2 space-y-2">{[["Homepage Banner","3.2%"],["Sponsored Offer","4.1%"],["Search Top","5.0%"]].map(([k,v])=>(<div key={k as string} className="flex items-center gap-3"><div className="flex-1 h-2 rounded-full bg-[#E2E8F0] dark:bg-[#1E293B] overflow-hidden"><div className="h-full bg-[#0E7C6B] dark:bg-[#14B8A6]" style={{width: v as string}} /></div><span className="text-xs font-bold dark:text-white">{v as string}</span></div>))}</div></div>
                  <div className="rounded-2xl bg-[#F8FAFB] dark:bg-[#1A2332] border p-4"><div className="font-bold text-sm dark:text-white">{(t as any).admin.audit}</div><ul className="text-xs text-[#475569] dark:text-[#94A3B8] mt-2 space-y-1"><li>• Admin a approuvé Rowad Al Siyaha (2h)</li><li>• Offre AlUla suspendue (5h)</li><li>• Paiement Business 1000 SAR (hier)</li></ul></div>
                </div>
              </div>
            </>
          )}
          {active===1 && (
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-6">
              <h3 className="font-bold dark:text-white">{(t as any).admin.pendingProviders} — Temps réel</h3>
              <div className="flex gap-2 mt-3"><input placeholder="Rechercher..." className="flex-1 h-10 rounded-full border px-4 bg-[#F8FAFB] dark:bg-[#1A2332] dark:text-white text-sm" /><span className="px-3 py-2 rounded-full bg-[#0E7C6B] text-white text-xs font-bold">{pendingProviders.length} en attente</span></div>
              {pendingProviders.length===0 ? <div className="text-sm text-[#64748B] py-8 text-center">Aucun prestataire en attente</div> : (
              <div className="mt-4 space-y-2">{pendingProviders.map((p:any)=>(
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-2xl border dark:border-[#1E293B] dark:bg-[#1A2332]">
                  <img src={p.logo || p.photoURL || `https://i.pravatar.cc/100?u=${p.email}`} alt={p.name} className="h-10 w-10 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0 dark:text-white"><div className="font-bold text-sm truncate">{p.name} — {p.city || "—"}</div><div className="text-xs text-[#64748B] truncate">{p.email} • {(t as any).admin.waiting}</div></div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#FFFBEB] text-[#92400E]">{(t as any).admin.waiting}</span>
                  <div className="flex gap-1"><button onClick={()=>approveProv(p.id)} className="px-3 py-1 rounded-full bg-[#0E7C6B] text-white text-xs">Approuver</button><button onClick={()=>refuseProv(p.id)} className="px-2 py-1 rounded-full border text-xs dark:text-white">Refuser</button></div>
                </div>
              ))}</div>
              )}
              <div className="mt-6 pt-4 border-t dark:border-[#1E293B]">
                <h4 className="font-bold text-sm dark:text-white mb-2">Prestataires existants (démo)</h4>
                <div className="space-y-2">{providers.slice(0,3).map(p=>(
                  <div key={p.id} className="flex items-center gap-3 p-3 rounded-2xl border dark:border-[#1E293B] dark:bg-[#1A2332] opacity-60">
                    <img src={p.logo} alt={p.name} className="h-8 w-8 rounded-xl" />
                    <div className="flex-1 dark:text-white"><div className="font-bold text-xs">{p.name} — {p.city}</div><div className="text-xs text-[#64748B]">Démo • {(t as any).admin.verifiedMOT}</div></div>
                  </div>
                ))}</div>
              </div>
            </div>
          )}
          {active===2 && (
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-6">
              <h3 className="font-bold dark:text-white">{(t as any).admin.pendingOffers} — {(t as any).common.manage}</h3>
              <div className="flex gap-2 mt-3 text-sm"><span className="px-3 py-1 rounded-full bg-[#E6F4F1] dark:bg-[#134E4A] text-[#0E7C6B] dark:text-[#6EE7B7] font-bold">{(t as any).admin.toModerate}</span><span className="px-3 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] font-bold">{(t as any).admin.sponsored}</span></div>
              <div className="mt-4 grid sm:grid-cols-2 gap-3">{offers.map(o=>(
                <div key={o.id} className="p-3 rounded-2xl border dark:border-[#1E293B] dark:bg-[#1A2332] card-hover">
                  <img src={o.image} alt={o.title} className="w-full h-32 object-cover rounded-xl" />
                  <div className="font-bold text-sm mt-2 dark:text-white line-clamp-1">{o.title}</div>
                  <div className="flex gap-2 mt-2"><button onClick={()=>approveOffer(o.id)} className="flex-1 py-1.5 rounded-full bg-[#0E7C6B] dark:bg-[#14B8A6] text-white text-xs">{(t as any).admin.approve}</button><button onClick={()=>refuseOffer(o.id)} className="flex-1 py-1.5 rounded-full border dark:text-white text-xs">{(t as any).admin.refuse}</button><button onClick={()=>show((t as any).admin.sponsor)} className="px-3 py-1.5 rounded-full bg-[#FF7A45] text-white text-xs">{(t as any).admin.sponsor}</button></div>
                </div>
              ))}</div>
            </div>
          )}
          {active===3 && (
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-6">
              <h3 className="font-bold dark:text-white">{(t as any).admin.reelsModeration}</h3>
              <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">{(t as any).admin.reelsDesc}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">{reels.map(r=>(
                <div key={r.id} className="relative h-[260px] rounded-[20px] overflow-hidden border dark:border-[#1E293B] card-hover">
                  <img src={r.cover} alt={r.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 text-white"><div className="font-bold text-sm line-clamp-1">{r.title}</div><div className="text-xs opacity-80">{r.provider.name}</div></div>
                  <div className="absolute top-2 right-2 flex gap-1"><button onClick={()=>sponsorReel(r.id)} className="h-7 px-2 rounded-full bg-[#FF7A45] text-white text-xs">{(t as any).admin.sponsor}</button><button onClick={()=>suspendReel(r.id)} className="h-7 w-7 rounded-full bg-black/60 text-white text-xs">✕</button></div>
                </div>
              ))}</div>
            </div>
          )}
          {active===4 && (
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-6">
              <h3 className="font-bold dark:text-white">{(t as any).admin.demandsTitle}</h3>
              <div className="overflow-x-auto mt-4"><table className="w-full text-sm"><thead className="text-xs text-[#64748B]"><tr><th className="text-left p-2">Destination</th><th className="text-left p-2">Voyageur</th><th className="text-left p-2">Budget</th><th className="text-left p-2">Statut</th><th className="p-2"></th></tr></thead><tbody>{demandes.map(d=>(
                <tr key={d.id} className="border-t dark:border-[#1E293B] dark:text-white"><td className="p-2 font-bold">{d.dest}</td><td className="p-2">{d.user} • {d.travelers} pers</td><td className="p-2">{d.budget}</td><td className="p-2"><span className="px-2 py-1 rounded-full bg-[#E6F4F1] dark:bg-[#134E4A] text-xs">{d.status}</span></td><td className="p-2"><button onClick={()=>show((t as any).admin.manage)} className="px-3 py-1 rounded-full bg-[#0F172A] dark:bg-white dark:text-black text-white text-xs">{(t as any).admin.manage}</button></td></tr>
              ))}</tbody></table></div>
            </div>
          )}
          {active===5 && (
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-6">
              <h3 className="font-bold dark:text-white">{(t as any).admin.usersTitle}</h3>
              <div className="mt-4 space-y-2">{users.map(u=>(
                <div key={u.id} className="flex items-center gap-3 p-3 rounded-2xl border dark:border-[#1E293B] dark:bg-[#1A2332]">
                  <div className="h-10 w-10 rounded-full bg-[#E6F4F1] dark:bg-[#134E4A] flex items-center justify-center font-bold">{u.name[0]}</div>
                  <div className="flex-1 dark:text-white"><div className="font-bold text-sm">{u.name} — <span className="text-xs px-2 py-0.5 rounded-full bg-[#0F172A] text-white">{u.role}</span></div><div className="text-xs text-[#64748B]">{u.email} • {u.city}</div></div>
                  <button onClick={()=>show((t as any).common.edit)} className="px-3 py-1 rounded-full border dark:text-white text-xs">{(t as any).common.edit}</button>
                </div>
              ))}</div>
            </div>
          )}
          {active===6 && (
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-6">
              <h3 className="font-bold dark:text-white">{(t as any).admin.subsTitle}</h3>
              <div className="grid lg:grid-cols-3 gap-4 mt-4">
                {[
                  { name:"Starter", price:"750 SAR", offers:4 },
                  { name:"Business", price:"1000 SAR", offers:10 },
                  { name:"Premium", price:"1250 SAR", offers:20 },
                ].map(p=>(
                  <div key={p.name} className="rounded-[20px] border p-5 dark:bg-[#1A2332] dark:border-[#1E293B]">
                    <div className="font-black dark:text-white">{p.name}</div><div className="text-xl font-black dark:text-white">{p.price}</div>
                    <button onClick={()=>show((t as any).common.edit)} className="mt-3 w-full h-9 rounded-full border dark:text-white text-sm">{(t as any).common.edit}</button>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-2xl bg-[#F8FAFB] dark:bg-[#1A2332] border dark:border-[#1E293B]">
                <div className="font-bold text-sm dark:text-white">Codes promo</div><div className="flex gap-2 mt-2"><input placeholder="Code" className="flex-1 h-10 rounded-full border px-4 bg-white dark:bg-[#0F172A] dark:text-white text-sm" /><button onClick={()=>show((t as any).common.create)} className="px-4 h-10 rounded-full bg-[#0E7C6B] text-white text-sm">{(t as any).common.create}</button></div>
              </div>
            </div>
          )}
          {active===7 && (
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-6">
              <h3 className="font-bold dark:text-white">{(t as any).admin.adsTitle}</h3>
              <button onClick={()=>show((t as any).common.create)} className="mt-3 px-4 py-2 rounded-full bg-[#0E7C6B] dark:bg-[#14B8A6] text-white text-sm">+ {(t as any).common.create}</button>
              <div className="mt-4 space-y-3">{campaigns.map(c=>(
                <div key={c.id} className="flex items-center gap-3 p-3 rounded-2xl border dark:border-[#1E293B] dark:bg-[#1A2332]">
                  <div className="flex-1 dark:text-white"><div className="font-bold text-sm">{c.name}</div><div className="text-xs text-[#64748B]">{c.placement}</div></div>
                  <div className="font-bold text-sm dark:text-white">{c.ctr}</div><button onClick={()=>show((t as any).admin.manage)} className="px-3 py-1 rounded-full border dark:text-white text-xs">{(t as any).admin.manage}</button>
                </div>
              ))}</div>
            </div>
          )}
          {active===8 && (
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-6">
              <h3 className="font-bold dark:text-white">{(t as any).admin.catsTitle}</h3>
              <div className="flex gap-2 mt-3"><input placeholder="Nouvelle catégorie" className="flex-1 h-10 rounded-full border px-4 dark:bg-[#1A2332] dark:text-white text-sm" /><button onClick={()=>show((t as any).common.add)} className="px-4 h-10 rounded-full bg-[#0E7C6B] text-white text-sm">{(t as any).common.add}</button></div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">{cats.slice(0,8).map(c=>(
                <div key={c.id} className="rounded-2xl overflow-hidden border dark:border-[#1E293B] card-hover">
                  <img src={c.image} alt={c.name} className="w-full h-24 object-cover" />
                  <div className="p-2 bg-white dark:bg-[#1A2332]"><div className="font-bold text-sm dark:text-white">{c.name}</div><div className="text-xs text-[#64748B]">{c.count} {(t as any).offersPage.offersCount}</div><button onClick={()=>show((t as any).common.edit)} className="mt-1 text-xs text-[#0E7C6B]">{(t as any).common.edit}</button></div>
                </div>
              ))}</div>
            </div>
          )}
          {active===9 && (
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-6">
              <h3 className="font-bold dark:text-white">{(t as any).admin.destsTitle}</h3>
              <div className="flex gap-2 mt-3"><input placeholder="Nouvelle destination" className="flex-1 h-10 rounded-full border px-4 dark:bg-[#1A2332] dark:text-white text-sm" /><button onClick={()=>show((t as any).common.add)} className="px-4 h-10 rounded-full bg-[#0E7C6B] text-white text-sm">{(t as any).common.add}</button></div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">{dests.map(d=>(
                <div key={d.id} className="rounded-2xl overflow-hidden border dark:border-[#1E293B] card-hover">
                  <img src={d.image} alt={d.name} className="w-full h-32 object-cover" />
                  <div className="p-3 bg-white dark:bg-[#1A2332]"><div className="font-bold dark:text-white">{d.name}</div><div className="text-xs text-[#64748B]">{d.country} • {d.offers} {(t as any).offersPage.offersCount}</div><button onClick={()=>show((t as any).admin.sponsor)} className="mt-1 text-xs px-2 py-1 rounded-full bg-[#FF7A45] text-white">{(t as any).common.sponsorise}</button></div>
                </div>
              ))}</div>
            </div>
          )}
          {active===10 && (
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-6">
              <h3 className="font-bold dark:text-white">{(t as any).admin.reportsTitle}</h3>
              <div className="grid lg:grid-cols-3 gap-4 mt-4">
                <div className="rounded-2xl bg-[#F8FAFB] dark:bg-[#1A2332] border p-4"><div className="font-bold text-sm dark:text-white">Revenu mensuel</div><div className="text-2xl font-black dark:text-white">124 500 SAR</div><div className="text-xs text-[#0E7C6B]">+12%</div></div>
                <div className="rounded-2xl bg-[#F8FAFB] dark:bg-[#1A2332] border p-4"><div className="font-bold text-sm dark:text-white">Leads</div><div className="text-2xl font-black dark:text-white">1 842</div></div>
                <div className="rounded-2xl bg-[#0F172A] text-white p-4"><div className="font-bold text-sm">Top destination</div><div className="text-xl font-black">AlUla — 38%</div><button onClick={()=>show((t as any).common.edit)} className="mt-2 px-3 py-1 rounded-full bg-white text-black text-xs">{(t as any).admin.export}</button></div>
              </div>
              <div className="mt-6 h-24 flex items-end gap-1">{[30,50,40,70,60,90,80].map((h,i)=>(<div key={i} className="flex-1 bg-[#0E7C6B] dark:bg-[#14B8A6] rounded-t" style={{height:h}} />))}</div>
            </div>
          )}
          {active===11 && (
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-6">
              <h3 className="font-bold dark:text-white">{(t as any).admin.notifTitle}</h3>
              <div className="flex gap-2 mt-3"><input value={notifTitle} onChange={e=>setNotifTitle(e.target.value)} placeholder="Titre" className="flex-1 h-10 rounded-full border px-4 dark:bg-[#1A2332] dark:text-white text-sm" /><input value={notifMsg} onChange={e=>setNotifMsg(e.target.value)} placeholder="Message" className="flex-1 h-10 rounded-full border px-4 dark:bg-[#1A2332] dark:text-white text-sm" /><button onClick={()=>{ if(notifTitle){ show((t as any).common.create+": "+notifTitle); setNotifTitle(""); setNotifMsg(""); } }} className="px-4 h-10 rounded-full bg-[#0E7C6B] text-white text-sm">{(t as any).common.create}</button></div>
              <div className="mt-4 space-y-2">
                {[
                  { to:"Voyageurs", msg:"Nouvelle offre AlUla -20%", time:"Il y a 2h" },
                  { to:"Prestataires", msg:"Nouvelle demande AlUla 3j", time:"Il y a 5h" },
                ].map(n=>(
                  <div key={n.msg} className="p-3 rounded-2xl border dark:border-[#1E293B] dark:bg-[#1A2332] flex justify-between"><div><div className="font-bold text-sm dark:text-white">{n.to}</div><div className="text-xs text-[#64748B]">{n.msg}</div></div><span className="text-xs text-[#94A3B8]">{n.time}</span></div>
                ))}
              </div>
            </div>
          )}
          {active===12 && (
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-6">
              <h3 className="font-bold dark:text-white">{(t as any).admin.settingsTitle}</h3>
              <div className="grid lg:grid-cols-2 gap-6 mt-4">
                <div className="space-y-3">
                  <div><div className="text-sm font-bold dark:text-white">Devise</div><select className="w-full h-10 rounded-full border px-3 dark:bg-[#1A2332] dark:text-white text-sm"><option>SAR (ر.س)</option></select></div>
                  <div><div className="text-sm font-bold dark:text-white">Langues</div><div className="flex gap-2 text-sm"><span className="px-3 py-1 rounded-full bg-[#0E7C6B] text-white">FR</span><span className="px-3 py-1 rounded-full bg-[#0E7C6B] text-white">العربية</span><span className="px-3 py-1 rounded-full bg-[#0E7C6B] text-white">EN</span></div></div>
                </div>
                <div className="space-y-3">
                  <div><div className="text-sm font-bold dark:text-white">Region</div><input defaultValue="me-central1 (Dammam) • SAR" disabled className="w-full h-10 rounded-full border px-3 bg-[#F1F5F9] dark:bg-[#1A2332] text-sm" /></div>
                  <button onClick={()=>show((t as any).common.edit)} className="w-full h-10 rounded-full bg-[#0F172A] dark:bg-white dark:text-black text-white text-sm">{(t as any).common.edit}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
