"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc, collection, query, where, onSnapshot, addDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "@/lib/firebase/config";
import { useI18n } from "@/lib/i18n/provider";
import Link from "next/link";

export default function ProviderDashboard() {
  const { t } = useI18n();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("overview");
  const [offers, setOffers] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [msg, setMsg] = useState("");

  // Profil form
  const [editName, setEditName] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editWebsite, setEditWebsite] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  // Création offre
  const [offerTitle, setOfferTitle] = useState("");
  const [offerDest, setOfferDest] = useState("Paris");
  const [offerPrice, setOfferPrice] = useState("");
  const [offerDuration, setOfferDuration] = useState("7 jours");
  const [offerImage, setOfferImage] = useState<File | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const snap = await getDoc(doc(db, "users", fbUser.uid));
        const data = snap.exists() ? { uid: fbUser.uid, email: fbUser.email, ...snap.data() } : { uid: fbUser.uid, email: fbUser.email, name: fbUser.displayName, role: "PROVIDER_PENDING" };
        setUser(data);
        setEditName((data as any).name || "");
        setEditCity((data as any).city || "");
        setEditPhone((data as any).phone || "");
        setEditWebsite((data as any).website || "");
        setEditDesc((data as any).description || "");
      } else {
        try { const raw = localStorage.getItem("travgo-user"); setUser(raw ? JSON.parse(raw) : null); } catch { setUser(null); }
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Temps réel offres du prestataire + demandes globales
  useEffect(() => {
    if (!user?.uid) return;
    const q = query(collection(db, "offers"), where("providerId", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => setOffers(snap.docs.map(d => ({ id: d.id, ...d.data() }))), () => setOffers([]));
    // Tous les devis en attente (envoyés à toutes agences validées)
    const q2 = query(collection(db, "quoteRequests"), where("status", "==", "pending"));
    const un2 = onSnapshot(q2, (snap) => setLeads(snap.docs.map(d => ({ id: d.id, ...d.data() }))), () => setLeads([]));
    // Aussi écouter les notifications pour cet agence (Devis reçus via notifications)
    const q3 = query(collection(db, "notifications"), where("userId", "==", user.uid));
    const un3 = onSnapshot(q3, (snap) => {
      const notifs = snap.docs.map(d=>({id:d.id, ...d.data()} as any)).filter(n=>n.type==="quote_request");
      if (notifs.length) setLeads(prev => {
        const ids = new Set(prev.map(p=>p.id));
        const extra = notifs.filter(n=>!ids.has(n.quoteRequestId)).map(n=>({ id: n.quoteRequestId, destination: n.destination, cityFrom: n.cityFrom, budget: n.budget, travelers: n.travelers, userName: n.fromUserName, userEmail: n.fromUserEmail, status: "pending", source: "notification" }));
        return [...prev, ...extra];
      });
    }, ()=>{});
    return () => { unsub(); un2(); un3(); };
  }, [user?.uid]);

  const handleSaveProfil = async () => {
    if (!user?.uid) return;
    setSaving(true); setMsg("");
    try {
      let logoURL = user.logo || user.photoURL || null;
      if (logoFile) {
        const r = ref(storage, `providers/${user.uid}/logo.jpg`);
        await uploadBytes(r, logoFile);
        logoURL = await getDownloadURL(r);
      }
      await updateDoc(doc(db, "users", user.uid), { name: editName, city: editCity, phone: editPhone.replace(/\D/g, ""), website: editWebsite, description: editDesc, ...(logoURL ? { logo: logoURL, photoURL: logoURL } : {}), updatedAt: serverTimestamp() });
      setUser({ ...user, name: editName, city: editCity, phone: editPhone, website: editWebsite, description: editDesc, logo: logoURL });
      localStorage.setItem("travgo-user", JSON.stringify({ ...user, name: editName }));
      setMsg("✓ Profil mis à jour");
      setTimeout(() => setMsg(""), 2000);
    } catch (e: any) { setMsg("✗ " + e.message); }
    finally { setSaving(false); }
  };

  const handleCreateOffer = async () => {
    if (!user?.uid) return;
    if (user.role === "PROVIDER_PENDING") { setMsg("⏳ En attente d'activation admin — vous ne pouvez pas publier"); return; }
    if (!offerTitle || !offerPrice) { setMsg("✗ Titre + prix requis"); return; }
    setCreating(true);
    try {
      let imageURL = "https://picsum.photos/800/600";
      if (offerImage) {
        const r = ref(storage, `offers/${user.uid}/${Date.now()}.jpg`);
        await uploadBytes(r, offerImage);
        imageURL = await getDownloadURL(r);
      }
      await addDoc(collection(db, "offers"), {
        title: offerTitle, destination: offerDest, country: offerDest, cityFrom: editCity || "Riyad",
        image: imageURL, images: [imageURL],
        providerId: user.uid, provider: { name: editName || user.name, logo: user.logo || "", city: editCity },
        price: Number(offerPrice), currency: "SAR", duration: offerDuration, durationDays: parseInt(offerDuration) || 7,
        dates: "Disponible", includes: [], category: "Culture", verified: false, sponsored: false,
        saves: 0, views: 0, createdAt: serverTimestamp(),
      });
      setMsg("✓ Offre créée — en attente modération admin");
      setOfferTitle(""); setOfferPrice(""); setOfferImage(null);
      setTimeout(() => setMsg(""), 2000);
    } catch (e: any) { setMsg("✗ " + e.message); }
    finally { setCreating(false); }
  };

  const delOffer = async (id: string) => { if (!confirm("Supprimer cette offre ?")) return; await deleteDoc(doc(db, "offers", id)); };
  const contactLead = async (lead: any) => {
    try {
      await addDoc(collection(db, "notifications"), {
        userId: lead.userId,
        type: "provider_contact",
        title: `${user.name} a répondu à votre demande ${lead.destination}`,
        message: `${user.name} (${user.city || ""}) • ${user.phone || ""} → Contactez pour ${lead.destination} ${lead.cityFrom}→${lead.destination} ${lead.budget}`,
        quoteRequestId: lead.id,
        fromUserId: user.uid,
        fromUserName: user.name,
        fromUserEmail: user.email,
        fromUserPhone: user.phone,
        read: false,
        createdAt: serverTimestamp(),
      });
      setMsg("✓ Contact envoyé — l'utilisateur a reçu une notification");
      setTimeout(()=>setMsg(""),2000);
    } catch(e:any){ setMsg("✗ "+e.message); }
  };

  if (loading) return <div className="mx-auto max-w-[1280px] px-4 py-10 text-center text-sm">Chargement...</div>;
  if (!user) return <div className="mx-auto max-w-[640px] px-4 py-16 text-center"><div className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-8"><h2 className="font-black">Non connecté</h2><Link href="/login" className="mt-4 inline-block px-6 py-2 rounded-full bg-[#0E7C6B] text-white font-bold">Se connecter</Link></div></div>;

  const isPending = user.role === "PROVIDER_PENDING";
  const isProvider = user.role === "PROVIDER" || user.role === "ADMIN" || user.role === "SUPER_ADMIN";

  const menu = [
    ["overview", (t as any).providerDashboard.menu?.[0] || "Overview"],
    ["offers", (t as any).providerDashboard.menu?.[1] || "Mes offres"],
    ["create", (t as any).providerDashboard.menu?.[2] || "Créer une offre"],
    ["leads", "Leads"],
    ["profil", "Profil"],
  ];

  if (isPending) {
    return (
      <div className="mx-auto max-w-[640px] px-4 py-10">
        <div className="bg-[#FFFBEB] dark:bg-[#1A2332] border border-[#FDE68A] dark:border-[#78350F] rounded-[20px] p-8 text-center">
          <div className="text-3xl mb-3">⏳</div>
          <h1 className="text-xl font-black dark:text-white">En attente d'activation admin</h1>
          <p className="text-sm text-[#92400E] dark:text-[#FDBA74] mt-2">Votre compte prestataire <b>{user.name}</b> ({user.email}) est en cours de vérification. Vous serez notifié par email après approbation. Votre dashboard sera alors pleinement fonctionnel.</p>
          <div className="mt-4 p-3 rounded-2xl bg-white dark:bg-[#0F172A] border text-left text-xs">
            <div><b>Nom:</b> {user.name}</div><div><b>Email:</b> {user.email}</div><div><b>Ville:</b> {user.city || "—"}</div><div><b>Rôle:</b> {user.role}</div>
          </div>
          <button onClick={async()=>{await signOut(auth); localStorage.clear(); location.href="/";}} className="mt-4 px-6 py-2 rounded-full border text-sm font-bold">Déconnexion</button>
        </div>
      </div>
    );
  }

  if (!isProvider) return <div className="mx-auto max-w-[640px] px-4 py-10 text-center"><div className="bg-white border rounded-[20px] p-8"><h2 className="font-black">Accès prestataire requis</h2><p className="text-sm text-[#64748B] mt-2">Votre rôle actuel: {user.role} — contactez l&apos;admin.</p></div></div>;

  return (
    <div className="mx-auto max-w-[1280px] px-4 lg:px-6 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-[260px] shrink-0">
          <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-4 sticky top-[76px]">
            <div className="flex items-center gap-3 mb-3">
              <img src={user.logo || user.photoURL || `https://i.pravatar.cc/100?u=${user.email}`} alt={user.name} className="h-10 w-10 rounded-xl object-cover border" />
              <div className="flex-1 min-w-0"><div className="font-black text-sm dark:text-white truncate">{user.name || "Prestataire"}</div><div className="text-xs text-[#64748B] truncate">{user.email}</div><span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#0E7C6B] text-white">{user.role}</span></div>
            </div>
            <nav className="space-y-1 text-sm font-semibold">
              {menu.map(([id,label])=>(
                <button key={id} onClick={()=>setActive(id)} className={`w-full text-left px-3 py-2 rounded-full flex justify-between ${active===id?"bg-[#0F172A] dark:bg-white dark:text-black text-white":"hover:bg-[#F1F5F9] dark:hover:bg-[#1A2332] dark:text-[#94A3B8]"}`}>{label}</button>
              ))}
            </nav>
            <button onClick={async()=>{await signOut(auth); localStorage.clear(); location.href="/";}} className="w-full mt-3 h-9 rounded-full border text-xs font-bold">Déconnexion</button>
            {msg && <div className="mt-3 text-xs p-2 rounded-xl bg-[#ECFDF5] text-[#065F46] text-center">{msg}</div>}
          </div>
        </aside>
        <div className="flex-1 space-y-6">
          {active==="overview" && (
            <>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-5"><div className="text-xs text-[#64748B]">Offres actives</div><div className="text-2xl font-black dark:text-white">{offers.length}</div><div className="text-xs text-[#0E7C6B]">{offers.length} publiée(s)</div></div>
                <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-5"><div className="text-xs text-[#64748B]">Leads</div><div className="text-2xl font-black dark:text-white">{leads.length}</div><div className="text-xs text-[#64748B]">demandes</div></div>
                <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-5"><div className="text-xs text-[#64748B]">Vues</div><div className="text-2xl font-black dark:text-white">{offers.reduce((a,b)=>a+(b.views||0),0)}</div><div className="text-xs text-[#64748B]">total</div></div>
              </div>
              <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
                <h3 className="font-bold dark:text-white">Mes offres récentes (temps réel)</h3>
                {offers.length===0 ? <div className="text-sm text-[#64748B] py-6 text-center">Aucune offre — <button onClick={()=>setActive("create")} className="text-[#0E7C6B] underline">Créer une offre</button></div> : (
                  <div className="mt-3 space-y-2">
                    {offers.slice(0,5).map((o:any)=>(
                      <div key={o.id} className="flex items-center gap-3 p-3 rounded-2xl border">
                        <img src={o.image} alt={o.title} className="h-12 w-16 rounded-xl object-cover" />
                        <div className="flex-1 min-w-0"><div className="font-bold text-sm truncate dark:text-white">{o.title}</div><div className="text-xs text-[#64748B]">{o.destination} • {o.price} SAR</div></div>
                        <button onClick={()=>delOffer(o.id)} className="px-3 py-1 rounded-full border text-xs">Supprimer</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
          {active==="offers" && (
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
              <h3 className="font-bold dark:text-white">Mes offres — {offers.length}</h3>
              {offers.length===0 ? <div className="text-sm text-[#64748B] py-6 text-center">Aucune offre</div> : (
                <div className="grid sm:grid-cols-2 gap-3 mt-3">
                  {offers.map((o:any)=>(
                    <div key={o.id} className="rounded-2xl border overflow-hidden">
                      <img src={o.image} alt={o.title} className="w-full h-32 object-cover" />
                      <div className="p-3"><div className="font-bold text-sm dark:text-white truncate">{o.title}</div><div className="text-xs text-[#64748B]">{o.destination} • {o.price} SAR</div><button onClick={()=>delOffer(o.id)} className="mt-2 w-full h-8 rounded-full border text-xs">Supprimer</button></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {active==="create" && (
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
              <h3 className="font-bold dark:text-white">Créer une offre</h3>
              <div className="grid gap-3 mt-4">
                <input value={offerTitle} onChange={e=>setOfferTitle(e.target.value)} placeholder="Titre (ex: Riyad → Paris 7j)" className="h-11 rounded-full border px-4 bg-[#F8FAFB] dark:bg-[#1A2332] dark:text-white" />
                <div className="grid grid-cols-2 gap-3">
                  <select value={offerDest} onChange={e=>setOfferDest(e.target.value)} className="h-11 rounded-full border px-3 bg-white dark:bg-[#1A2332] dark:text-white"><option>Paris</option><option>Istanbul</option><option>Dubai</option><option>Maldives</option><option>Bali</option></select>
                  <input value={offerPrice} onChange={e=>setOfferPrice(e.target.value)} placeholder="Prix SAR" type="number" className="h-11 rounded-full border px-4 bg-[#F8FAFB] dark:bg-[#1A2332] dark:text-white" />
                </div>
                <input value={offerDuration} onChange={e=>setOfferDuration(e.target.value)} placeholder="Durée (ex: 7 jours)" className="h-11 rounded-full border px-4 bg-[#F8FAFB] dark:bg-[#1A2332] dark:text-white" />
                <label className="p-3 rounded-2xl border-2 border-dashed flex flex-col items-center gap-2 cursor-pointer">
                  <span className="text-2xl">📸</span><span className="text-xs">{offerImage ? offerImage.name : "Photo offre (optionnel)"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={e=>setOfferImage(e.target.files?.[0]||null)} />
                </label>
                <button onClick={handleCreateOffer} disabled={creating} className="h-11 rounded-full bg-[#0E7C6B] text-white font-bold disabled:opacity-50">{creating?"...":"Publier l'offre →"}</button>
                {msg && <div className="text-sm p-2 rounded-xl bg-[#F1F5F9] text-center">{msg}</div>}
              </div>
            </div>
          )}
          {active==="leads" && (
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
              <h3 className="font-bold dark:text-white">Leads / Demandes — Temps réel</h3>
              <p className="text-xs text-[#64748B] mt-1">Toutes les demandes envoyées à toutes les agences validées apparaissent ici. Contactez l'utilisateur via notification.</p>
              {leads.length===0 ? <div className="text-sm text-[#64748B] py-6 text-center">Aucune demande — en attente d'une demande utilisateur</div> : (
                <div className="space-y-2 mt-3">
                  {leads.map((l:any)=>(
                    <div key={l.id} className="p-3 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 dark:border-[#1E293B]">
                      <div className="flex-1"><div className="font-bold text-sm dark:text-white">{l.destination || l.dest} • {l.cityFrom} → {l.destination}</div><div className="text-xs text-[#64748B]">{l.userName || l.userEmail || l.userId} • {l.budget} • {l.travelers} voyageurs • {l.duration || ""}</div></div>
                      <div className="flex gap-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-[#E6F4F1] text-[#0E7C6B] self-center">{l.status || "Nouveau"}</span>
                        <button onClick={()=>contactLead(l)} className="px-3 py-1.5 rounded-full bg-[#0E7C6B] text-white text-xs font-bold">Contacter</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {active==="profil" && (
            <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
              <h3 className="font-bold dark:text-white">Profil prestataire — Modifier mes données</h3>
              <div className="flex items-center gap-4 mt-4">
                <img src={user.logo || user.photoURL || `https://i.pravatar.cc/100?u=${user.email}`} alt="" className="h-20 w-20 rounded-2xl object-cover border" />
                <label className="px-4 py-2 rounded-full border text-sm font-bold cursor-pointer dark:text-white">Changer logo<input type="file" accept="image/*" className="hidden" onChange={e=>setLogoFile(e.target.files?.[0]||null)} /></label>
                {logoFile && <span className="text-xs text-[#0E7C6B]">{logoFile.name}</span>}
              </div>
              <div className="grid sm:grid-cols-2 gap-3 mt-4">
                <div><label className="text-xs font-bold">Nom agence</label><input value={editName} onChange={e=>setEditName(e.target.value)} className="w-full mt-1 h-11 rounded-full border px-4 bg-[#F8FAFB] dark:bg-[#1A2332] dark:text-white" /></div>
                <div><label className="text-xs font-bold">Ville</label><input value={editCity} onChange={e=>setEditCity(e.target.value)} className="w-full mt-1 h-11 rounded-full border px-4 bg-[#F8FAFB] dark:bg-[#1A2332] dark:text-white" /></div>
                <div><label className="text-xs font-bold">Téléphone</label><input value={editPhone} onChange={e=>setEditPhone(e.target.value)} className="w-full mt-1 h-11 rounded-full border px-4 bg-[#F8FAFB] dark:bg-[#1A2332] dark:text-white" /></div>
                <div><label className="text-xs font-bold">Site web</label><input value={editWebsite} onChange={e=>setEditWebsite(e.target.value)} className="w-full mt-1 h-11 rounded-full border px-4 bg-[#F8FAFB] dark:bg-[#1A2332] dark:text-white" /></div>
                <div className="sm:col-span-2"><label className="text-xs font-bold">Description</label><textarea value={editDesc} onChange={e=>setEditDesc(e.target.value)} rows={3} className="w-full mt-1 rounded-2xl border p-3 bg-[#F8FAFB] dark:bg-[#1A2332] dark:text-white text-sm" /></div>
              </div>
              <button onClick={handleSaveProfil} disabled={saving} className="mt-4 px-6 h-11 rounded-full bg-[#0E7C6B] text-white font-bold disabled:opacity-50">{saving?"...":"Enregistrer"}</button>
              <div className="mt-3 text-xs p-2 rounded-xl bg-[#F8FAFB] dark:bg-[#1A2332] border">
                <div><b>Email:</b> {user.email}</div><div><b>UID:</b> {user.uid}</div><div><b>Rôle:</b> {user.role}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
