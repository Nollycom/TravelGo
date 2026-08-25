"use client";
import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc, addDoc, serverTimestamp, getDocs, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { auth, db, storage } from "@/lib/firebase/config";
import { offers as initialOffers, providers as initialProviders, categories as initialCats, destinations as initialDests, reels as initialReels } from "@/lib/data";
import { useI18n } from "@/lib/i18n/provider";

export default function AdminPage() {
  const { t } = useI18n();
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState("");
  const [isAdmin, setIsAdmin] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Data temps réel
  const [offers, setOffers] = useState<any[]>(initialOffers);
  const [offersReal, setOffersReal] = useState<any[]>([]);
  const [providersPending, setProvidersPending] = useState<any[]>([]);
  const [allProviders, setAllProviders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [reels, setReels] = useState(initialReels);
  const [reelsReal, setReelsReal] = useState<any[]>([]);
  const [demandes, setDemandes] = useState<any[]>([]);
  const [cats, setCats] = useState(initialCats);
  const [catsReal, setCatsReal] = useState<any[]>([]);
  const [dests, setDests] = useState(initialDests);
  const [destsReal, setDestsReal] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [notifs, setNotifs] = useState<any[]>([]);
  const [subs, setSubs] = useState<any[]>([]);

  // Forms
  const [notifTitle, setNotifTitle] = useState("");
  const [notifMsg, setNotifMsg] = useState("");
  const [notifTarget, setNotifTarget] = useState<"all" | "users" | "providers">("all");
  const [newCatName, setNewCatName] = useState("");
  const [newDestName, setNewDestName] = useState("");
  const [newDestCountry, setNewDestCountry] = useState("");
  const [newCampaignName, setNewCampaignName] = useState("");
  const [editUser, setEditUser] = useState<any>(null);
  const [editUserName, setEditUserName] = useState("");
  const [editUserRole, setEditUserRole] = useState("");
  const [adminName, setAdminName] = useState("khalil");
  const [adminCity, setAdminCity] = useState("Jeddah");
  const [adminPhoto, setAdminPhoto] = useState<File | null>(null);
  const [savingAdmin, setSavingAdmin] = useState(false);

  const show = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try { const snap = await (await import("firebase/firestore")).getDoc(doc(db, "users", fbUser.uid)); if (snap.exists()) { const d = snap.data() as any; setUser({ uid: fbUser.uid, ...d }); setAdminName(d.name || "khalil"); setAdminCity(d.city || "Jeddah"); if (d.role !== "ADMIN" && d.role !== "SUPER_ADMIN") setIsAdmin(false); } } catch {}
      } else {
        const role = localStorage.getItem("travgo-role");
        if (role && role !== "ADMIN" && role !== "SUPER_ADMIN") setIsAdmin(false);
      }
    });
    return () => unsub();
  }, []);

  // Listeners temps réel
  useEffect(() => {
    const un1 = onSnapshot(query(collection(db, "users"), where("role", "==", "PROVIDER_PENDING")), s => setProvidersPending(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const un2 = onSnapshot(collection(db, "users"), s => setUsers(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const un3 = onSnapshot(collection(db, "offers"), s => setOffersReal(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const un4 = onSnapshot(collection(db, "quoteRequests"), s => setDemandes(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const un5 = onSnapshot(collection(db, "notifications"), s => setNotifs(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const un6 = onSnapshot(collection(db, "categories"), s => setCatsReal(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const un7 = onSnapshot(collection(db, "destinations"), s => setDestsReal(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const un8 = onSnapshot(collection(db, "campaigns"), s => setCampaigns(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const un9 = onSnapshot(collection(db, "subscriptions"), s => setSubs(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const un10 = onSnapshot(query(collection(db, "users"), where("role", "in", ["PROVIDER", "PROVIDER_PENDING", "ADMIN"])), s => setAllProviders(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => { un1(); un2(); un3(); un4(); un5(); un6(); un7(); un8(); un9(); un10(); };
  }, []);

  // Actions
  const approveProv = async (id: string) => { await updateDoc(doc(db, "users", id), { role: "PROVIDER", status: "ACTIVE", verified: true }); show("✓ Prestataire activé"); };
  const deactivateProv = async (id: string) => { await updateDoc(doc(db, "users", id), { role: "PROVIDER_PENDING", status: "SUSPENDED", verified: false }); show("Prestataire désactivé"); };
  const deleteProv = async (id: string) => { if (!confirm("Supprimer ce prestataire ?")) return; await deleteDoc(doc(db, "users", id)); show("Prestataire supprimé"); };
  const deleteOffer = async (id: string, isReal: boolean) => {
    if (!confirm("Supprimer l'offre ?")) return;
    if (isReal) await deleteDoc(doc(db, "offers", id)); else setOffers(o => o.filter(x => x.id !== id));
    show("Offre supprimée");
  };
  const toggleOfferVerified = async (o: any, isReal: boolean) => {
    if (isReal) await updateDoc(doc(db, "offers", o.id), { verified: !o.verified });
    else setOffers(v => v.map(x => x.id === o.id ? { ...x, verified: !x.verified } : x));
    show("Offre modifiée");
  };
  const deleteReel = async (id: string, isReal: boolean) => {
    if (isReal) await deleteDoc(doc(db, "reels", id)); else setReels(r => r.filter(x => x.id !== id));
    show("Reel supprimé");
  };
  const deleteDemande = async (id: string) => { await deleteDoc(doc(db, "quoteRequests", id)); show("Demande supprimée"); };
  const saveUserEdit = async () => {
    if (!editUser) return;
    await updateDoc(doc(db, "users", editUser.id), { name: editUserName, role: editUserRole });
    setEditUser(null); show("Utilisateur modifié");
  };
  const deleteUser = async (id: string) => { if (!confirm("Supprimer l'utilisateur ?")) return; await deleteDoc(doc(db, "users", id)); show("Utilisateur supprimé"); };
  const handleSub = async (providerId: string, plan: string) => {
    await addDoc(collection(db, "subscriptions"), { providerId, plan, status: "ACTIVE", price: plan === "Premium" ? 1000 : plan === "Starter" ? 750 : 1250, createdAt: serverTimestamp() });
    show(`Abonnement ${plan} affecté`);
  };
  const stopSub = async (id: string) => { await updateDoc(doc(db, "subscriptions", id), { status: "CANCELLED" }); show("Abonnement arrêté"); };
  const addCampaign = async () => {
    if (!newCampaignName) return;
    await addDoc(collection(db, "campaigns"), { name: newCampaignName, placement: "Homepage Banner", ctr: "0%", status: "Active", createdAt: serverTimestamp() });
    setNewCampaignName(""); show("Publicité créée");
  };
  const delCampaign = async (id: string) => { await deleteDoc(doc(db, "campaigns", id)); show("Publicité supprimée"); };
  const updCampaign = async (id: string, name: string) => { const n = prompt("Nouveau nom", name); if (n) await updateDoc(doc(db, "campaigns", id), { name: n }); };
  const addCat = async () => {
    if (!newCatName) return;
    await addDoc(collection(db, "categories"), { name: newCatName, slug: newCatName.toLowerCase().replace(/\s+/g, "-"), image: "https://picsum.photos/400/400", count: 0, createdAt: serverTimestamp() });
    setNewCatName(""); show("Catégorie ajoutée");
  };
  const delCat = async (id: string) => { await deleteDoc(doc(db, "categories", id)); show("Catégorie supprimée"); };
  const updCat = async (id: string, name: string) => { const n = prompt("Nouveau nom", name); if (n) await updateDoc(doc(db, "categories", id), { name: n, slug: n.toLowerCase().replace(/\s+/g, "-") }); };
  const addDest = async () => {
    if (!newDestName) return;
    await addDoc(collection(db, "destinations"), { name: newDestName, country: newDestCountry || "Monde", image: "https://picsum.photos/600/400", offers: 0, createdAt: serverTimestamp() });
    setNewDestName(""); setNewDestCountry(""); show("Destination ajoutée");
  };
  const delDest = async (id: string) => { await deleteDoc(doc(db, "destinations", id)); show("Destination supprimée"); };
  const updDest = async (id: string, name: string) => { const n = prompt("Nouveau nom", name); if (n) await updateDoc(doc(db, "destinations", id), { name: n }); };
  const sendNotif = async () => {
    if (!notifTitle) return;
    const targets: any[] = notifTarget === "all" ? users : notifTarget === "providers" ? allProviders : users.filter((u: any) => u.role === "USER");
    const batch = targets.slice(0, 50).map(u => addDoc(collection(db, "notifications"), { userId: u.id, title: notifTitle, message: notifMsg, fromUserId: user?.uid || "admin", fromUserName: "Admin TravGo", read: false, createdAt: serverTimestamp() }));
    await Promise.all(batch);
    show(`Notification envoyée à ${batch.length} comptes`);
    setNotifTitle(""); setNotifMsg("");
  };
  const delNotif = async (id: string) => { await deleteDoc(doc(db, "notifications", id)); show("Notification supprimée"); };
  const saveAdminProfile = async () => {
    if (!user?.uid) return;
    setSavingAdmin(true);
    try {
      let photoURL = null;
      if (adminPhoto) { const r = ref(storage, `avatars/${user.uid}/admin.jpg`); await uploadBytes(r, adminPhoto); photoURL = await getDownloadURL(r); }
      await updateDoc(doc(db, "users", user.uid), { name: adminName, city: adminCity, ...(photoURL ? { photoURL, avatar: photoURL, logo: photoURL } : {}) });
      if (auth.currentUser) await updateProfile(auth.currentUser, { displayName: adminName, ...(photoURL ? { photoURL } : {}) });
      show("✓ Profil admin mis à jour");
    } catch (e: any) { show("✗ " + e.message); }
    finally { setSavingAdmin(false); }
  };

  const menu = (t as any).admin?.menu;
  const displayOffers = offersReal.length ? offersReal : offers;
  const displayCats = catsReal.length ? catsReal : cats;
  const displayDests = destsReal.length ? destsReal : dests;
  const displayReels = reelsReal.length ? reelsReal : reels;

  return (
    <div className="mx-auto max-w-[1280px] px-4 lg:px-6 py-6">
      {!isAdmin && <div className="mb-4 p-3 rounded-2xl bg-[#FEF2F2] border text-sm text-[#991B1B]">Accès restreint — connecte-toi avec <b>khalil.alnajjar81@gmail.com</b></div>}
      {toast && <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-[#0F172A] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg z-50">{toast}</div>}
      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-[260px] shrink-0">
          <div className="bg-[#0F172A] text-white rounded-[20px] p-4 sticky top-[76px] border">
            <div className="font-black mb-4 flex items-center gap-2"><img src="/logo-travgo.jpg" alt="TravGo" className="h-7 w-7 rounded-lg object-cover border border-white/20" /><span>{(t as any).admin.title}</span></div>
            <nav className="space-y-1 text-sm">
              {menu.map((l: string, i: number) => (
                <button key={l} onClick={() => setActive(i)} className={`w-full text-left block px-3 py-2 rounded-full ${i === active ? "bg-white text-[#0F172A] font-bold" : "text-white/80 hover:bg-white/10"}`}>{l}</button>
              ))}
            </nav>
            <div className="mt-4 p-3 rounded-2xl bg-white/10 border border-white/10 text-xs">
              <div className="flex items-center gap-3"><img src={user?.photoURL || "/logo-travgo.jpg"} alt="TravGo Admin" className="h-9 w-9 rounded-full object-cover bg-white border-2 border-white/30 shadow-[0_2px_8px_rgba(0,0,0,0.15)] shrink-0" onError={(e)=>{ (e.target as HTMLImageElement).src="/icon.png"; }} /><div className="min-w-0"><div className="font-bold truncate">{adminName} — ADMIN</div><div className="opacity-70 truncate">khalil.alnajjar81@gmail.com</div></div></div>
              <div className="mt-2 text-[#6EE7B7]">● En ligne • {users.length} users</div>
            </div>
          </div>
        </aside>
        <div className="flex-1 space-y-6">
          {active === 0 && (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  [(t as any).admin.stats[0], users.length, `${providersPending.length} en attente`],
                  [(t as any).admin.stats[1], allProviders.length, `${offersReal.length} offres`],
                  [(t as any).admin.stats[2], offersReal.length || offers.length, "temps réel"],
                  [(t as any).admin.stats[3], `${(subs.filter(s=>s.status==="ACTIVE").length * 1000).toLocaleString()} SAR`, `${subs.length} abos`],
                ].map(([k, v, d]) => (
                  <div key={k as string} className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-5">
                    <div className="text-xs text-[#64748B]">{k as string}</div><div className="text-2xl font-black dark:text-white">{v as any}</div><div className="text-xs text-[#0E7C6B] font-bold">{d as string}</div>
                  </div>
                ))}
              </div>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
                  <h3 className="font-bold dark:text-white">Prestataires en attente ({providersPending.length})</h3>
                  {providersPending.length === 0 ? <div className="text-sm text-[#64748B] py-4 text-center">Aucun en attente</div> : (
                    <div className="space-y-2 mt-3">
                      {providersPending.slice(0, 3).map((p: any) => (
                        <div key={p.id} className="flex items-center gap-3 p-3 rounded-2xl border">
                          <img src={p.logo || `https://i.pravatar.cc/100?u=${p.email}`} alt={p.name} className="h-10 w-10 rounded-xl object-cover" />
                          <div className="flex-1 min-w-0"><div className="font-bold text-sm truncate dark:text-white">{p.name}</div><div className="text-xs truncate text-[#64748B]">{p.email}</div></div>
                          <button onClick={() => approveProv(p.id)} className="px-3 py-1 rounded-full bg-[#0E7C6B] text-white text-xs">Activer</button>
                          <button onClick={() => deleteProv(p.id)} className="px-2 py-1 rounded-full border text-xs">Supprimer</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
                  <h3 className="font-bold dark:text-white">Offres à modérer ({displayOffers.length})</h3>
                  <div className="space-y-2 mt-3 max-h-[260px] overflow-y-auto">
                    {displayOffers.slice(0, 4).map((o: any) => (
                      <div key={o.id} className="flex gap-3 p-3 rounded-2xl border">
                        <img src={o.image} alt={o.title} className="h-12 w-16 rounded-xl object-cover" />
                        <div className="flex-1 min-w-0"><div className="font-bold text-sm truncate dark:text-white">{o.title}</div><div className="text-xs text-[#64748B]">{o.destination} • {o.price} SAR</div></div>
                        <div className="flex flex-col gap-1">
                          <button onClick={() => toggleOfferVerified(o, !!offersReal.find(x=>x.id===o.id))} className={`px-2 py-1 rounded-full text-xs font-bold ${o.verified ? "bg-[#ECFDF5] text-[#065F46]" : "bg-[#FEF3C7] text-[#92400E]"}`}>{o.verified ? "Vérifiée" : "Approuver"}</button>
                          <button onClick={() => deleteOffer(o.id, !!offersReal.find(x=>x.id===o.id))} className="px-2 py-1 rounded-full border text-xs">Supprimer</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {active === 1 && (
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
              <h3 className="font-bold dark:text-white">Prestataires — Gérer ({allProviders.length})</h3>
              <div className="mt-3 space-y-2">
                {allProviders.map((p: any) => (
                  <div key={p.id} className="flex items-center gap-3 p-3 rounded-2xl border">
                    <img src={p.logo || `https://i.pravatar.cc/100?u=${p.email}`} alt={p.name} className="h-10 w-10 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0"><div className="font-bold text-sm truncate dark:text-white">{p.name} — {p.city || "—"}</div><div className="text-xs truncate text-[#64748B]">{p.email} • {p.role}</div></div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.role==="PROVIDER" ? "bg-[#ECFDF5] text-[#065F46]" : p.role==="PROVIDER_PENDING" ? "bg-[#FFFBEB] text-[#92400E]" : "bg-[#F1F5F9] text-[#475569]"}`}>{p.role}</span>
                    <div className="flex gap-1">
                      {p.role !== "PROVIDER" ? <button onClick={() => approveProv(p.id)} className="px-3 py-1 rounded-full bg-[#0E7C6B] text-white text-xs">Activer</button> : <button onClick={() => deactivateProv(p.id)} className="px-3 py-1 rounded-full bg-[#F59E0B] text-white text-xs">Désactiver</button>}
                      <button onClick={() => deleteProv(p.id)} className="px-2 py-1 rounded-full border text-xs">Supprimer</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {active === 2 && (
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
              <h3 className="font-bold dark:text-white">Offres — Modifier/Supprimer ({displayOffers.length})</h3>
              <div className="mt-3 grid sm:grid-cols-2 gap-3">
                {displayOffers.map((o: any) => {
                  const isReal = !!offersReal.find(x=>x.id===o.id);
                  return (
                    <div key={o.id} className="rounded-2xl border overflow-hidden">
                      <img src={o.image} alt={o.title} className="w-full h-32 object-cover" />
                      <div className="p-3">
                        <input defaultValue={o.title} id={`title-${o.id}`} className="w-full text-sm font-bold border rounded-full px-3 py-1 dark:bg-[#1A2332] dark:text-white" />
                        <div className="flex gap-2 mt-2">
                          <button onClick={async()=>{ const el=document.getElementById(`title-${o.id}`) as HTMLInputElement; if(el) { if(isReal) await updateDoc(doc(db,"offers",o.id),{title: el.value}); else setOffers(v=>v.map(x=>x.id===o.id?{...x,title:el.value}:x)); show("Offre modifiée"); } }} className="flex-1 py-1.5 rounded-full bg-[#0E7C6B] text-white text-xs">Modifier</button>
                          <button onClick={()=>deleteOffer(o.id,isReal)} className="flex-1 py-1.5 rounded-full border text-xs dark:text-white">Supprimer</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {active === 3 && (
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
              <h3 className="font-bold dark:text-white">Reels — Modifier/Supprimer</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                {displayReels.map((r:any)=>{
                  const isReal = !!reelsReal.find(x=>x.id===r.id);
                  return (
                    <div key={r.id} className="relative h-[220px] rounded-2xl overflow-hidden border">
                      <img src={r.cover} alt={r.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2 text-white text-xs font-bold truncate">{r.title}</div>
                      <button onClick={()=>deleteReel(r.id,isReal)} className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 text-white">✕</button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {active === 4 && (
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
              <h3 className="font-bold dark:text-white">Demandes — Gérer ({demandes.length})</h3>
              <div className="mt-3 space-y-2">
                {demandes.map((d:any)=>(
                  <div key={d.id} className="flex items-center justify-between p-3 rounded-2xl border">
                    <div><div className="font-bold text-sm dark:text-white">{d.destination || d.dest} • {d.cityFrom || ""}</div><div className="text-xs text-[#64748B]">{d.userName || d.user || d.userEmail} • {d.travelers} pers • {d.budget}</div></div>
                    <button onClick={()=>deleteDemande(d.id)} className="px-3 py-1 rounded-full border text-xs">Supprimer</button>
                  </div>
                ))}
                {demandes.length===0 && <div className="text-sm text-[#64748B] py-6 text-center">Aucune demande</div>}
              </div>
            </div>
          )}

          {active === 5 && (
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
              <h3 className="font-bold dark:text-white">Utilisateurs — Éditer ({users.length})</h3>
              <div className="mt-3 space-y-2">
                {users.map((u:any)=>(
                  <div key={u.id} className="flex items-center gap-3 p-3 rounded-2xl border">
                    <img src={u.photoURL || u.avatar || `https://i.pravatar.cc/100?u=${u.email}`} alt={u.name} className="h-10 w-10 rounded-full object-cover" />
                    <div className="flex-1 min-w-0"><div className="font-bold text-sm truncate dark:text-white">{u.name} • <span className="text-xs px-1.5 py-0.5 rounded-full bg-[#0F172A] text-white">{u.role}</span></div><div className="text-xs truncate text-[#64748B]">{u.email} • {u.city || "—"}</div></div>
                    <button onClick={()=>{ setEditUser(u); setEditUserName(u.name); setEditUserRole(u.role); }} className="px-3 py-1 rounded-full bg-[#0E7C6B] text-white text-xs">Éditer</button>
                    <button onClick={()=>deleteUser(u.id)} className="px-2 py-1 rounded-full border text-xs">Supprimer</button>
                  </div>
                ))}
              </div>
              {editUser && (
                <div className="mt-4 p-4 rounded-2xl bg-[#F8FAFB] dark:bg-[#1A2332] border">
                  <div className="font-bold text-sm dark:text-white">Éditer {editUser.email}</div>
                  <input value={editUserName} onChange={e=>setEditUserName(e.target.value)} placeholder="Nom" className="w-full mt-2 h-10 rounded-full border px-4 bg-white dark:bg-[#0F172A] dark:text-white text-sm" />
                  <select value={editUserRole} onChange={e=>setEditUserRole(e.target.value)} className="w-full mt-2 h-10 rounded-full border px-4 bg-white dark:bg-[#0F172A] dark:text-white text-sm">
                    <option>USER</option><option>PROVIDER</option><option>PROVIDER_PENDING</option><option>ADMIN</option>
                  </select>
                  <div className="flex gap-2 mt-3">
                    <button onClick={saveUserEdit} className="px-4 py-2 rounded-full bg-[#0E7C6B] text-white text-sm font-bold">Enregistrer</button>
                    <button onClick={()=>setEditUser(null)} className="px-4 py-2 rounded-full border text-sm">Annuler</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {active === 6 && (
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
              <h3 className="font-bold dark:text-white">Abonnements — Gérer</h3>
              <div className="grid lg:grid-cols-3 gap-3 mt-3">
                {[
                  { id:"starter", name:"Starter", price:750, offers:4 },
                  { id:"business", name:"Business", price:1000, offers:10 },
                  { id:"premium", name:"Premium", price:1250, offers:20 },
                ].map(p=>(
                  <div key={p.name} className="rounded-2xl border p-4 dark:bg-[#1A2332]">
                    <div className="font-black dark:text-white">{p.name}</div><div className="text-xl font-black">{p.price} SAR</div><div className="text-xs text-[#64748B]">{p.offers} offres</div>
                    <select id={`sub-${p.name}`} className="w-full mt-2 h-9 rounded-full border px-3 text-xs bg-white dark:bg-[#0F172A] dark:text-white">
                      <option value="">Choisir prestataire</option>
                      {allProviders.filter((x:any)=>x.role==="PROVIDER").map((pr:any)=><option key={pr.id} value={pr.id}>{pr.name} • {pr.email}</option>)}
                    </select>
                    <button onClick={()=>{ const el=document.getElementById(`sub-${p.name}`) as HTMLSelectElement; if(el?.value) handleSub(el.value, p.name); }} className="w-full mt-2 h-8 rounded-full bg-[#0E7C6B] text-white text-xs font-bold">Affecter</button>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                <h4 className="font-bold text-sm dark:text-white">Abonnements actifs ({subs.length})</h4>
                {subs.map((s:any)=>(
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-2xl border">
                    <div><div className="font-bold text-sm dark:text-white">{s.plan} • {s.providerId}</div><div className="text-xs text-[#64748B]">{s.status} • {s.price} SAR</div></div>
                    {s.status==="ACTIVE" ? <button onClick={()=>stopSub(s.id)} className="px-3 py-1 rounded-full bg-[#EF4444] text-white text-xs">Arrêter</button> : <span className="text-xs px-2 py-1 rounded-full bg-[#F1F5F9]">Arrêté</span>}
                  </div>
                ))}
                {subs.length===0 && <div className="text-xs text-[#64748B]">Aucun abonnement</div>}
              </div>
            </div>
          )}

          {active === 7 && (
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
              <h3 className="font-bold dark:text-white">Publicités — Créer/Modifier/Supprimer</h3>
              <div className="flex gap-2 mt-3">
                <input value={newCampaignName} onChange={e=>setNewCampaignName(e.target.value)} placeholder="Nom campagne" className="flex-1 h-10 rounded-full border px-4 bg-white dark:bg-[#0F172A] dark:text-white text-sm" />
                <button onClick={addCampaign} className="px-4 h-10 rounded-full bg-[#0E7C6B] text-white text-sm font-bold">Créer</button>
              </div>
              <div className="mt-3 space-y-2">
                {campaigns.map((c:any)=>(
                  <div key={c.id} className="flex items-center gap-3 p-3 rounded-2xl border">
                    <div className="flex-1"><div className="font-bold text-sm dark:text-white">{c.name}</div><div className="text-xs text-[#64748B]">{c.placement || "Homepage"} • {c.ctr || "—"}</div></div>
                    <button onClick={()=>updCampaign(c.id,c.name)} className="px-3 py-1 rounded-full border text-xs">Modifier</button>
                    <button onClick={()=>delCampaign(c.id)} className="px-2 py-1 rounded-full bg-[#EF4444] text-white text-xs">Supprimer</button>
                  </div>
                ))}
                {campaigns.length===0 && <div className="text-xs text-[#64748B]">Aucune publicité</div>}
              </div>
            </div>
          )}

          {active === 8 && (
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
              <h3 className="font-bold dark:text-white">Catégories — Ajouter/Modifier</h3>
              <div className="flex gap-2 mt-3">
                <input value={newCatName} onChange={e=>setNewCatName(e.target.value)} placeholder="Nouvelle catégorie" className="flex-1 h-10 rounded-full border px-4 bg-white dark:bg-[#0F172A] dark:text-white text-sm" />
                <button onClick={addCat} className="px-4 h-10 rounded-full bg-[#0E7C6B] text-white text-sm">Ajouter</button>
              </div>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(catsReal.length?catsReal:cats).slice(0,8).map((c:any)=>(
                  <div key={c.id} className="rounded-2xl border overflow-hidden">
                    <img src={c.image} alt={c.name} className="w-full h-24 object-cover" />
                    <div className="p-2 bg-white dark:bg-[#1A2332]">
                      <div className="font-bold text-sm dark:text-white truncate">{c.name}</div>
                      <div className="flex gap-1 mt-1">
                        <button onClick={()=>updCat(c.id,c.name)} className="flex-1 py-1 rounded-full border text-xs">Modifier</button>
                        <button onClick={()=>delCat(c.id)} className="px-2 py-1 rounded-full bg-[#EF4444] text-white text-xs">✕</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {active === 9 && (
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
              <h3 className="font-bold dark:text-white">Destinations — Ajouter/Modifier</h3>
              <div className="flex gap-2 mt-3">
                <input value={newDestName} onChange={e=>setNewDestName(e.target.value)} placeholder="Nom destination" className="flex-1 h-10 rounded-full border px-4 bg-white dark:bg-[#0F172A] dark:text-white text-sm" />
                <input value={newDestCountry} onChange={e=>setNewDestCountry(e.target.value)} placeholder="Pays" className="w-32 h-10 rounded-full border px-4 bg-white dark:bg-[#0F172A] dark:text-white text-sm" />
                <button onClick={addDest} className="px-4 h-10 rounded-full bg-[#0E7C6B] text-white text-sm">Ajouter</button>
              </div>
              <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {(destsReal.length?destsReal:dests).slice(0,6).map((d:any)=>(
                  <div key={d.id} className="rounded-2xl border overflow-hidden">
                    <img src={d.image} alt={d.name} className="w-full h-32 object-cover" />
                    <div className="p-3 bg-white dark:bg-[#1A2332]">
                      <div className="font-bold dark:text-white truncate">{d.name}</div><div className="text-xs text-[#64748B]">{d.country}</div>
                      <div className="flex gap-1 mt-2">
                        <button onClick={()=>updDest(d.id,d.name)} className="flex-1 py-1 rounded-full border text-xs">Modifier</button>
                        <button onClick={()=>delDest(d.id)} className="px-2 py-1 rounded-full bg-[#EF4444] text-white text-xs">Supprimer</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {active === 10 && (
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
              <h3 className="font-bold dark:text-white">Rapports — Statistiques professionnelles</h3>
              <div className="grid lg:grid-cols-4 gap-3 mt-4">
                <div className="rounded-2xl bg-gradient-to-br from-[#0E7C6B] to-[#0A5E51] text-white p-5">
                  <div className="text-xs opacity-80">Revenu total</div><div className="text-2xl font-black">{(subs.filter(s=>s.status==="ACTIVE").length*1000 + 84500).toLocaleString()} SAR</div><div className="text-xs opacity-80">+12% ce mois</div>
                </div>
                <div className="rounded-2xl bg-white dark:bg-[#1A2332] border p-5"><div className="text-xs text-[#64748B]">Utilisateurs</div><div className="text-2xl font-black dark:text-white">{users.length}</div><div className="text-xs text-[#0E7C6B]">+{providersPending.length} en attente</div></div>
                <div className="rounded-2xl bg-white dark:bg-[#1A2332] border p-5"><div className="text-xs text-[#64748B]">Prestataires actifs</div><div className="text-2xl font-black dark:text-white">{allProviders.filter((p:any)=>p.role==="PROVIDER").length}</div><div className="text-xs text-[#0E7C6B]">vérifiés</div></div>
                <div className="rounded-2xl bg-white dark:bg-[#1A2332] border p-5"><div className="text-xs text-[#64748B]">Offres</div><div className="text-2xl font-black dark:text-white">{offersReal.length || offers.length}</div><div className="text-xs text-[#0E7C6B]">publiées</div></div>
              </div>
              <div className="mt-6 grid lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-[#F8FAFB] dark:bg-[#1A2332] rounded-2xl border p-4">
                  <div className="font-bold text-sm dark:text-white">Revenu mensuel (SAR)</div>
                  <div className="mt-3 h-[120px] flex items-end gap-2">
                    {[45,68,52,78,61,92,74,88,65,80,72,95].map((h,i)=>(
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full bg-gradient-to-t from-[#0E7C6B] to-[#14B8A6] rounded-t-lg" style={{height: `${h}%`}} />
                        <span className="text-[10px] text-[#64748B]">{["J","F","M","A","M","J","J","A","S","O","N","D"][i]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#0F172A] text-white rounded-2xl p-5">
                  <div className="font-bold">Top destinations</div>
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between"><span>AlUla</span><b>38%</b></div>
                    <div className="w-full h-2 rounded-full bg-white/10"><div className="h-full bg-[#14B8A6] rounded-full" style={{width:"38%"}} /></div>
                    <div className="flex justify-between"><span>Jeddah</span><b>24%</b></div>
                    <div className="w-full h-2 rounded-full bg-white/10"><div className="h-full bg-[#14B8A6] rounded-full" style={{width:"24%"}} /></div>
                    <div className="flex justify-between"><span>Riyad</span><b>18%</b></div>
                    <div className="w-full h-2 rounded-full bg-white/10"><div className="h-full bg-white/60 rounded-full" style={{width:"18%"}} /></div>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid lg:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-[#1A2332] rounded-2xl border p-4">
                  <div className="font-bold text-sm dark:text-white">Conversion par canal</div>
                  <div className="mt-3 space-y-2">
                    {[
                      ["Recherche", "42%", "#0E7C6B"],
                      ["Reels", "28%", "#14B8A6"],
                      ["Direct", "18%", "#F59E0B"],
                      ["Pub", "12%", "#8B5CF6"],
                    ].map(([k,v,c])=>(
                      <div key={k as string} className="flex items-center gap-3"><span className="text-xs w-16 dark:text-white">{k as string}</span><div className="flex-1 h-2 rounded-full bg-[#E2E8F0] dark:bg-[#0F172A]"><div className="h-full rounded-full" style={{width: v as string, background: c as string}} /></div><span className="text-xs font-bold dark:text-white">{v as string}</span></div>
                    ))}
                  </div>
                </div>
                <div className="bg-white dark:bg-[#1A2332] rounded-2xl border p-4">
                  <div className="font-bold text-sm dark:text-white">Activité récente</div>
                  <ul className="mt-3 space-y-2 text-xs text-[#475569] dark:text-[#94A3B8]">
                    <li>• {users.length} utilisateurs • {offersReal.length} offres temps réel</li>
                    <li>• {demandes.length} demandes • {notifs.length} notifications</li>
                    <li>• {providersPending.length} prestataires en attente</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {active === 11 && (
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
              <h3 className="font-bold dark:text-white">Notifications — Envoyer/Supprimer (temps réel)</h3>
              <div className="flex flex-col sm:flex-row gap-2 mt-3">
                <select value={notifTarget} onChange={e=>setNotifTarget(e.target.value as any)} className="h-10 rounded-full border px-3 bg-white dark:bg-[#1A2332] dark:text-white text-sm">
                  <option value="all">Tous ({users.length})</option>
                  <option value="providers">Prestataires ({allProviders.length})</option>
                  <option value="users">Voyageurs ({users.filter((u:any)=>u.role==="USER").length})</option>
                </select>
                <input value={notifTitle} onChange={e=>setNotifTitle(e.target.value)} placeholder="Titre" className="flex-1 h-10 rounded-full border px-4 bg-white dark:bg-[#1A2332] dark:text-white text-sm" />
                <input value={notifMsg} onChange={e=>setNotifMsg(e.target.value)} placeholder="Message" className="flex-1 h-10 rounded-full border px-4 bg-white dark:bg-[#1A2332] dark:text-white text-sm" />
                <button onClick={sendNotif} className="px-6 h-10 rounded-full bg-[#0E7C6B] text-white text-sm font-bold">Envoyer</button>
              </div>
              <div className="mt-4 space-y-2 max-h-[300px] overflow-y-auto">
                {notifs.slice(0,20).map((n:any)=>(
                  <div key={n.id} className="flex items-center justify-between p-3 rounded-2xl border dark:border-[#1E293B] dark:bg-[#1A2332]">
                    <div className="flex-1 min-w-0"><div className="font-bold text-sm truncate dark:text-white">{n.title}</div><div className="text-xs truncate text-[#64748B]">{n.message} • → {n.userId}</div></div>
                    <button onClick={()=>delNotif(n.id)} className="ml-2 px-3 py-1 rounded-full bg-[#EF4444] text-white text-xs">Supprimer</button>
                  </div>
                ))}
                {notifs.length===0 && <div className="text-sm text-[#64748B] py-4 text-center">Aucune notification</div>}
              </div>
            </div>
          )}

          {active === 12 && (
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
              <h3 className="font-bold dark:text-white">Profil Admin — Photo plateforme</h3>
              <div className="flex flex-col sm:flex-row gap-6 mt-4">
                <div className="flex flex-col items-center gap-3">
                  <img src={user?.photoURL || "/logo-travgo.jpg"} alt="TravGo" className="h-24 w-24 rounded-[20px] object-cover border-2 border-[#0E7C6B] shadow-lg" />
                  <label className="px-4 py-2 rounded-full border text-xs font-bold cursor-pointer dark:text-white">Changer photo<input type="file" accept="image/*" className="hidden" onChange={e=>setAdminPhoto(e.target.files?.[0]||null)} /></label>
                  {adminPhoto && <span className="text-xs text-[#0E7C6B]">{adminPhoto.name}</span>}
                </div>
                <div className="flex-1 space-y-3">
                  <div><label className="text-xs font-bold dark:text-white">Nom admin</label><input value={adminName} onChange={e=>setAdminName(e.target.value)} className="w-full mt-1 h-11 rounded-full border px-4 bg-white dark:bg-[#1A2332] dark:text-white" /></div>
                  <div><label className="text-xs font-bold dark:text-white">Ville</label><input value={adminCity} onChange={e=>setAdminCity(e.target.value)} className="w-full mt-1 h-11 rounded-full border px-4 bg-white dark:bg-[#1A2332] dark:text-white" /></div>
                  <div className="p-3 rounded-2xl bg-[#F8FAFB] dark:bg-[#1A2332] border text-xs">
                    <div><b>Email:</b> khalil.alnajjar81@gmail.com</div><div><b>UID:</b> {user?.uid}</div><div><b>Rôle:</b> ADMIN</div>
                  </div>
                  <button onClick={saveAdminProfile} disabled={savingAdmin} className="w-full h-11 rounded-full bg-[#0E7C6B] text-white font-bold disabled:opacity-50">{savingAdmin?"...":"Enregistrer profil"}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
