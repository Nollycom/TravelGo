"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { useI18n } from "@/lib/i18n/provider";

function phoneToEmail(phone:string){
  const digits = phone.replace(/\D/g,"");
  const norm = digits.startsWith("966") ? digits : digits.startsWith("0") ? "966"+digits.slice(1) : "966"+digits;
  return `${norm}@phone.travgo.sa`;
}

export default function RegisterPage(){
  const { t } = useI18n();
  const [tab, setTab] = useState<"voyageur"|"prestataire">("voyageur");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const onRegister = async()=>{
    setMsg(""); setLoading(true);
    try{
      if(!name || !pass || (!phone && !email)) throw new Error("Nom + téléphone ou email + mot de passe requis (6+ caractères)");
      if(pass.length<6) throw new Error("Mot de passe 6+ caractères");
      const em = email.trim() ? email.trim().toLowerCase() : phoneToEmail(phone);
      const phoneNorm = phone ? phone.replace(/\D/g,"") : null;

      // Création compte Firebase Auth pour voyageur ET prestataire
      const cred = await createUserWithEmailAndPassword(auth, em, pass);
      if(name) await updateProfile(cred.user, { displayName:name });

      if(tab==="prestataire"){
        // Prestataire: rôle en attente + demande admin
        await setDoc(doc(db,"users",cred.user.uid), {
          uid: cred.user.uid,
          name, phone: phoneNorm, email: em,
          role: "PROVIDER_PENDING",
          status: "PENDING",
          country:"Arabie Saoudite", currency:"SAR",
          createdAt: serverTimestamp(),
        });
        // Demande visible côté admin (sans stocker le mot de passe !)
        await addDoc(collection(db,"providerRequests"), {
          uid: cred.user.uid,
          name, phone: phoneNorm, email: em,
          requestedAt: serverTimestamp(),
          status: "pending",
          city: "Riyad",
          documents: "À vérifier",
        });
        setMsg("✓ Demande prestataire créée — compte en attente de validation admin. Vous pouvez vous connecter mais la publication sera activée après approbation.");
        setTimeout(()=> location.href="/login", 2500);
        return;
      }

      // Voyageur standard
      await setDoc(doc(db,"users",cred.user.uid), {
        uid: cred.user.uid,
        name, phone: phoneNorm, email: em,
        role: "USER",
        country:"Arabie Saoudite", currency:"SAR",
        createdAt: serverTimestamp(),
      });
      setMsg("✓ "+(t as any).register.create+" — redirection...");
      setTimeout(()=> location.href="/dashboard", 900);
    }catch(e:any){
      // Fallback si Auth Email/Password désactivé (CONFIGURATION_NOT_FOUND) -> création Firestore-only
      const isConfigMissing = e.message?.includes("CONFIGURATION_NOT_FOUND") || e.code?.includes("CONFIGURATION_NOT_FOUND");
      if(isConfigMissing){
        try{
          const em = email.trim() ? email.trim().toLowerCase() : phoneToEmail(phone);
          const phoneNorm = phone ? phone.replace(/\D/g,"") : null;
          // Génère UID provisoire (à migrer vers Auth quand activé)
          const tmpUid = `tmp_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
          const role = tab==="prestataire" ? "PROVIDER_PENDING" : "USER";
          await setDoc(doc(db,"users",tmpUid), {
            uid: tmpUid,
            name, phone: phoneNorm, email: em,
            password: pass, // stocké pour login fallback tant qu'Auth désactivé (à supprimer après activation)
            role,
            status: tab==="prestataire" ? "PENDING" : "ACTIVE",
            country:"Arabie Saoudite", currency:"SAR",
            createdAt: serverTimestamp(),
            authMissing: true,
          });
          if(tab==="prestataire"){
            await addDoc(collection(db,"providerRequests"), {
              uid: tmpUid, name, phone: phoneNorm, email: em,
              requestedAt: serverTimestamp(), status: "pending", city:"Riyad", documents:"À vérifier",
            });
            setMsg("✓ Compte prestataire créé (mode dégradé - Auth désactivé). Active Email/Password dans Firebase Console pour sécuriser. Redirection...");
            setTimeout(()=> location.href="/login", 2000);
          } else {
            // stocke session locale pour accès immédiat
            localStorage.setItem("travgo-user", JSON.stringify({uid:tmpUid,name,email:em,phone:phoneNorm,role}));
            localStorage.setItem("travgo-role", role);
            setMsg("✓ Compte créé (mode dégradé - Auth désactivé). Active l'Auth dans console. Redirection...");
            setTimeout(()=> location.href="/dashboard", 1200);
          }
          return;
        }catch(fe:any){
          setMsg("✗ Erreur fallback: "+(fe.message||""));
          console.error(fe);
          return;
        } finally { setLoading(false); }
      }
      let m=e.message||"Erreur";
      if(m.includes("auth/email-already-in-use")) m="Ce téléphone/email existe déjà — connecte-toi.";
      if(m.includes("auth/invalid-email")) m="Email invalide — vérifie le format.";
      if(m.includes("auth/weak-password")) m="Mot de passe trop faible (6+ caractères).";
      if(m.includes("permission-denied") || m.includes("PERMISSION_DENIED")) m="Permission refusée — règles Firestore non déployées. Lance: firebase deploy --only firestore:rules";
      setMsg("✗ "+m);
      console.error(e);
    }finally{ setLoading(false); }
  };

  return (
    <div className="mx-auto max-w-[900px] px-4 py-6">
      <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-6 relative overflow-hidden" style={{backgroundImage:"url('/bg-login.png')", backgroundSize:"cover", backgroundPosition:"center"}}>
        <div className="absolute inset-0 bg-white/92 dark:bg-[#0F172A]/92 backdrop-blur-[1px] rounded-[20px]" />
        <div className="relative z-10">
        <h1 className="text-xl font-black dark:text-white">{(t as any).register.title}</h1>
        <div className="flex gap-2 mt-4">
          <button onClick={()=>setTab("voyageur")} className={`flex-1 h-11 rounded-full font-bold ${tab==="voyageur"?"bg-[#0E7C6B] text-white":"border border-[#E2E8F0] dark:border-[#1E293B] dark:text-white bg-white/80 dark:bg-[#1A2332]/80"}`}>{(t as any).register.traveler}</button>
          <button onClick={()=>setTab("prestataire")} className={`flex-1 h-11 rounded-full font-bold ${tab==="prestataire"?"bg-[#0F172A] dark:bg-white dark:text-black text-white":"border border-[#E2E8F0] dark:border-[#1E293B] dark:text-white bg-white/80 dark:bg-[#1A2332]/80"}`}>{(t as any).register.provider}</button>
        </div>
        {tab==="prestataire" && (
          <div className="mt-3 p-3 rounded-2xl bg-[#FFFBEB] dark:bg-[#1A2332] border border-[#FDE68A] dark:border-[#78350F] text-xs text-[#92400E] dark:text-[#FDBA74]">
            Prestataire pro — <b>compte créé mais en attente validation admin</b>. Après approbation, votre rôle passera à PROVIDER et vous pourrez publier des offres.
          </div>
        )}
        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          <div className="rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] bg-white/90 dark:bg-[#1A2332]/90 backdrop-blur p-5 relative overflow-hidden" style={{backgroundImage:"url('/bg-login.png')", backgroundSize:"cover", backgroundPosition:"center"}}>
            <div className="absolute inset-0 bg-white/85 dark:bg-[#1A2332]/85" />
            <div className="relative z-10">
            <div className="font-bold dark:text-white">{tab==="voyageur"?(t as any).register.traveler:(t as any).register.provider}</div>
            <div className="space-y-3 mt-4">
              <input value={name} onChange={e=>setName(e.target.value)} placeholder={(t as any).register.name} className="w-full h-11 rounded-full border border-[#E2E8F0] dark:border-[#1E293B] px-4 bg-[#F8FAFB] dark:bg-[#0F172A] dark:text-white text-sm" />
              <div className="flex gap-2">
                <span className="h-11 px-3 rounded-full border border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFB] dark:bg-[#0F172A] dark:text-white flex items-center text-sm font-bold">+966</span>
                <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder={(t as any).register.phone} className="flex-1 h-11 rounded-full border border-[#E2E8F0] dark:border-[#1E293B] px-4 bg-[#F8FAFB] dark:bg-[#0F172A] dark:text-white text-sm" />
              </div>
              <input value={email} onChange={e=>setEmail(e.target.value)} placeholder={(t as any).register.email} type="email" className="w-full h-11 rounded-full border border-[#E2E8F0] dark:border-[#1E293B] px-4 bg-[#F8FAFB] dark:bg-[#0F172A] dark:text-white text-sm" />
              <input value={pass} onChange={e=>setPass(e.target.value)} placeholder={(t as any).register.pass} type="password" className="w-full h-11 rounded-full border border-[#E2E8F0] dark:border-[#1E293B] px-4 bg-[#F8FAFB] dark:bg-[#0F172A] dark:text-white text-sm" />
              <button onClick={onRegister} disabled={loading} className="w-full h-11 rounded-full bg-[#0E7C6B] dark:bg-[#14B8A6] text-white font-bold disabled:opacity-50">{loading?"...": tab==="prestataire" ? "Créer & envoyer demande →" : (t as any).register.create}</button>
              {msg && <div className={`text-sm p-3 rounded-2xl ${msg.startsWith("✓")?"bg-[#ECFDF5] text-[#065F46]":"bg-[#FEF2F2] text-[#991B1B]"}`}>{msg}</div>}
            </div>
            </div>
          </div>
          <div className={`rounded-2xl border-2 p-5 relative overflow-hidden ${tab==="prestataire"?"border-[#0E7C6B] bg-[#F8FFFE] dark:bg-[#1A2332]":"border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFB] dark:bg-[#1A2332]"}`} style={{backgroundImage:"url('/bg-login.png')", backgroundSize:"cover", backgroundPosition:"center"}}>
            <div className="absolute inset-0 bg-white/80 dark:bg-[#1A2332]/80" />
            <div className="relative z-10">
            <div className="font-bold dark:text-white">{(t as any).register.onboarding}</div>
            <ol className="text-sm mt-3 space-y-1 list-decimal list-inside text-[#334155] dark:text-[#94A3B8]">
              {((t as any).register.steps as string[]).map(s=> <li key={s}>{s}</li>)}
            </ol>
            <div className="mt-4 p-3 rounded-2xl bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] text-sm dark:text-white">
              {(t as any).register.statuses}
            </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
