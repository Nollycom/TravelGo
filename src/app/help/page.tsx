import Link from "next/link";

export const metadata = {
  title: "Centre d'aide — TravGo KSA",
  description: "Bienvenue sur TravGo KSA — plateforme de découverte et de comparaison de voyages pour l'Arabie Saoudite. Comment rechercher, demander un devis, prestataires vérifiés, paiement.",
};

const sections = [
  { id: "bienvenue", icon: "👋", title: "Bienvenue sur TravGo KSA", desc: "Votre plateforme de découverte et de comparaison de voyages" },
  { id: "fonctionne", icon: "🔎", title: "Comment fonctionne TravGo ?", desc: "8 services pour préparer votre voyage" },
  { id: "rechercher", icon: "✈️", title: "Comment rechercher un voyage ?", desc: "Barre de recherche + filtres + catégories" },
  { id: "devis", icon: "💬", title: "Comment demander un devis ?", desc: "Gratuit, simple et sans engagement" },
  { id: "verifies", icon: "🏢", title: "Les prestataires sont-ils vérifiés ?", desc: "Transparence et vigilance" },
  { id: "paiement", icon: "💳", title: "Paiement et réservation", desc: "À vérifier avant de réserver" },
  { id: "compte", icon: "📱", title: "Mon compte TravGo", desc: "Gérez vos interactions" },
  { id: "langues", icon: "🌍", title: "Langues et devise", desc: "SAR • العربية • English • Français" },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFB] dark:bg-[#080C14]">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0E7C6B] via-[#0A5E51] to-[#083E36] dark:from-[#0F172A] dark:via-[#0B1F1C] dark:to-[#061412]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.12),transparent_60%)]" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('/bg-login.png')", backgroundSize: "cover" }} />
        <div className="relative mx-auto max-w-[1280px] px-4 lg:px-6 py-10 lg:py-14">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/20 rounded-full px-3 py-1 text-xs font-bold text-white">📚 Centre d'aide • travgo.web.app/help</div>
              <h1 className="text-3xl lg:text-4xl font-black text-white mt-4 tracking-tight">Centre d’aide</h1>
              <p className="text-white/80 mt-2 max-w-2xl">Bienvenue sur TravGo, votre plateforme de découverte et de comparaison de voyages conçue pour les voyageurs en <b className="text-white">Arabie Saoudite</b>. Simple, transparente et sécurisée.</p>
              <div className="flex gap-2 mt-4 text-xs">
                <span className="px-3 py-1.5 rounded-full bg-white text-[#0E7C6B] font-black">SAR</span>
                <span className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur border border-white/20 text-white font-bold">Réponse moyenne 2h</span>
                <span className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur border border-white/20 text-white font-bold">1 240 offres vérifiées</span>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <div className="bg-white rounded-2xl p-4 shadow-xl w-[280px]">
                <div className="text-xs font-bold text-[#0E7C6B]">Besoin d'aide ?</div>
                <div className="text-sm font-black text-[#0F172A] mt-1">Contact • +966 598 009 209</div>
                <Link href="tel:+966598009209" className="mt-3 flex w-full h-10 rounded-full bg-[#0E7C6B] text-white font-bold items-center justify-center">Appeler maintenant</Link>
                <Link href="/quote" className="mt-2 flex w-full h-10 rounded-full border font-bold items-center justify-center">Demander un devis</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 lg:px-6 py-8 grid lg:grid-cols-[260px_1fr] gap-8">
        {/* TOC */}
        <aside className="hidden lg:block">
          <div className="sticky top-[88px] bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-4">
            <div className="text-xs font-black tracking-widest text-[#64748B] mb-3">SOMMAIRE</div>
            <nav className="space-y-1">
              {sections.map(s => (
                <a key={s.id} href={`#${s.id}`} className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold text-[#334155] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#1A2332] hover:text-[#0F172A] dark:hover:text-white transition">
                  <span>{s.icon}</span> {s.title}
                </a>
              ))}
            </nav>
            <div className="mt-4 p-3 rounded-2xl bg-[#E6F4F1] dark:bg-[#1A2E2B] border border-[#A7F3D0] dark:border-[#134E4A]">
              <div className="text-xs font-bold text-[#0E7C6B] dark:text-[#6EE7B7]">Contact</div>
              <div className="text-sm font-black dark:text-white">+966 598 009 209</div>
              <div className="text-xs text-[#475569] dark:text-[#94A3B8]">7j/7 • Réponse rapide</div>
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="space-y-6">
          <section id="bienvenue" className="bg-white dark:bg-[#0F172A] rounded-[20px] border border-[#E2E8F0] dark:border-[#1E293B] p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-[#E6F4F1] dark:bg-[#134E4A] flex items-center justify-center text-xl">👋</div>
              <h2 className="text-xl font-black dark:text-white">Bienvenue sur TravGo KSA</h2>
            </div>
            <p className="text-sm leading-relaxed text-[#475569] dark:text-[#94A3B8]">
              Bienvenue sur <b className="text-[#0F172A] dark:text-white">TravGo</b>, votre plateforme de découverte et de comparaison de voyages conçue pour les voyageurs en Arabie Saoudite.
              TravGo vous permet de découvrir des destinations, comparer des offres de voyage, consulter des expériences et contacter directement des professionnels du tourisme vérifiés.
            </p>
            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-[#0E7C6B]/10 to-transparent dark:from-[#14B8A6]/10 border border-[#0E7C6B]/15 dark:border-[#14B8A6]/15">
              <div className="text-sm font-bold text-[#0E7C6B] dark:text-[#14B8A6]">Notre objectif</div>
              <p className="text-sm text-[#334155] dark:text-[#CBD5E1] mt-1">Rendre la préparation de votre voyage plus <b>simple, transparente et sécurisée</b>.</p>
            </div>
          </section>

          <section id="fonctionne" className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-4"><div className="h-10 w-10 rounded-xl bg-[#EFF6FF] dark:bg-[#1E293B] flex items-center justify-center">🔎</div><h2 className="text-xl font-black dark:text-white">Comment fonctionne TravGo ?</h2></div>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                "Rechercher une destination, un voyage, un hôtel ou une activité.",
                "Découvrir des offres de voyage sélectionnées.",
                "Comparer les différentes offres disponibles.",
                "Consulter les informations fournies par les prestataires.",
                "Demander gratuitement un devis.",
                "Contacter directement un prestataire.",
                "Découvrir des destinations à travers TravGo Reels.",
                "Trouver des professionnels du tourisme vérifiés.",
              ].map((t, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-2xl bg-[#F8FAFB] dark:bg-[#1A2332] border border-[#E2E8F0] dark:border-[#1E293B]">
                  <span className="h-7 w-7 rounded-full bg-[#0E7C6B] text-white flex items-center justify-center text-xs font-black shrink-0">{i + 1}</span>
                  <span className="text-sm font-medium dark:text-white">{t}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0E7C6B]/10 dark:bg-[#14B8A6]/15 text-[#0E7C6B] dark:text-[#14B8A6] text-xs font-bold">Les prix sont principalement présentés en <b>SAR (riyal saoudien)</b></div>
          </section>

          <section id="rechercher" className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-3"><div className="h-10 w-10 rounded-xl bg-[#FEF3C7] dark:bg-[#78350F]/30 flex items-center justify-center">✈️</div><h2 className="text-xl font-black dark:text-white">Comment rechercher un voyage ?</h2></div>
            <p className="text-sm text-[#475569] dark:text-[#94A3B8]">Utilisez la barre de recherche TravGo pour saisir une destination, un type de voyage ou une activité. Puis affinez avec les filtres.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Lune de miel","Voyage en famille","Aventure","Luxe","Culture","Plage","Croisière","Vol + Hôtel","Chalets"].map(c=>(
                <span key={c} className="px-3 py-1.5 rounded-full bg-[#F1F5F9] dark:bg-[#1A2332] border border-[#E2E8F0] dark:border-[#1E293B] text-xs font-bold dark:text-white">{c}</span>
              ))}
              <span className="px-3 py-1.5 rounded-full bg-[#0E7C6B] text-white text-xs font-bold">+ expériences touristiques</span>
            </div>
          </section>

          <section id="devis" className="bg-gradient-to-br from-[#0E7C6B] to-[#0A5E51] dark:from-[#0F172A] dark:to-[#1A2E2B] rounded-[20px] border border-[#0E7C6B] dark:border-[#1E293B] p-6 lg:p-8 text-white">
            <div className="flex items-center gap-3"><div className="h-10 w-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">💬</div><h2 className="text-xl font-black">Comment demander un devis ?</h2></div>
            <p className="text-sm text-white/80 mt-3">Lorsque vous trouvez une offre qui vous intéresse, utilisez l'option de demande de devis. Indiquez les informations nécessaires — le prestataire vous recontactera avec détails, disponibilités, conditions et prix.</p>
            <div className="mt-4 flex gap-2"><Link href="/quote" className="px-5 py-2.5 rounded-full bg-white text-[#0E7C6B] font-black text-sm">Demander un devis gratuit</Link><span className="px-3 py-2 rounded-full bg-white/15 backdrop-blur border border-white/20 text-xs font-bold">Gratuit</span></div>
          </section>

          <section id="verifies" className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-3"><div className="h-10 w-10 rounded-xl bg-[#ECFDF5] dark:bg-[#134E4A] flex items-center justify-center">🏢</div><h2 className="text-xl font-black dark:text-white">Les prestataires sont-ils vérifiés ?</h2></div>
            <p className="text-sm text-[#475569] dark:text-[#94A3B8]">TravGo met en avant des professionnels vérifiés pour vous aider à identifier les prestataires. La vérification ne signifie toutefois pas que TravGo garantit chaque prestation, prix ou disponibilité.</p>
            <div className="mt-3 p-3 rounded-2xl bg-[#FFFBEB] dark:bg-[#78350F]/20 border border-[#FDE68A] dark:border-[#78350F] text-xs text-[#92400E] dark:text-[#FDBA74]">Avant toute réservation ou paiement, vérifiez attentivement les conditions proposées par le prestataire.</div>
          </section>

          <section id="paiement" className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-3"><div className="h-10 w-10 rounded-xl bg-[#F1F5F9] dark:bg-[#1A2332] flex items-center justify-center">💳</div><h2 className="text-xl font-black dark:text-white">Paiement et réservation</h2></div>
            <p className="text-sm text-[#475569] dark:text-[#94A3B8]">Selon l'offre et le prestataire, les modalités peuvent varier. Vérifiez toujours :</p>
            <div className="mt-3 grid sm:grid-cols-2 gap-2">
              {["Prix total","Ce qui est inclus / non inclus","Dates du voyage","Conditions d'annulation","Conditions de remboursement","Frais supplémentaires","Conditions spécifiques du prestataire"].map(x=>(
                <div key={x} className="flex items-center gap-2 text-sm dark:text-white"><span className="h-1.5 w-1.5 rounded-full bg-[#0E7C6B]"></span>{x}</div>
              ))}
            </div>
          </section>

          <section id="compte" className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
            <div className="flex items-center gap-3 mb-2"><div className="h-10 w-10 rounded-xl bg-[#F5F3FF] dark:bg-[#1E1B4B]/30 flex items-center justify-center">📱</div><h2 className="text-xl font-black dark:text-white">Mon compte TravGo</h2></div>
            <p className="text-sm text-[#475569] dark:text-[#94A3B8]">Votre compte vous permet d'accéder aux fonctionnalités et de gérer vos interactions. Fournissez des informations exactes et gardez-les à jour. Ne partagez jamais votre mot de passe.</p>
            <div className="mt-3 flex gap-2"><Link href="/register" className="px-4 py-2 rounded-full bg-[#0F172A] dark:bg-white dark:text-black text-white text-sm font-bold">Créer un compte</Link><Link href="/login" className="px-4 py-2 rounded-full border text-sm font-bold dark:text-white">Se connecter</Link></div>
          </section>

          <section id="langues" className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
            <div className="flex items-center gap-3 mb-3"><div className="h-10 w-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center">🌍</div><h2 className="text-xl font-black dark:text-white">Langues et devise</h2></div>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="px-3 py-1.5 rounded-full bg-[#0F172A] text-white font-bold">العربية — Arabe</span>
              <span className="px-3 py-1.5 rounded-full bg-white dark:bg-[#1A2332] border dark:text-white font-bold">English — Anglais</span>
              <span className="px-3 py-1.5 rounded-full bg-white dark:bg-[#1A2332] border dark:text-white font-bold">Français — Français</span>
              <span className="px-3 py-1.5 rounded-full bg-[#0E7C6B] text-white font-bold">SAR — Riyal saoudien</span>
            </div>
          </section>

          <div className="bg-[#0F172A] text-white rounded-[20px] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div><div className="font-black">🛡️ Besoin d'aide ?</div><div className="text-sm text-white/70">Contact • <a href="tel:+966598009209" className="underline font-bold text-white">+966 598 009 209</a> • 7j/7</div></div>
            <Link href="tel:+966598009209" className="px-6 py-2.5 rounded-full bg-[#14B8A6] text-white font-black">Appeler</Link>
          </div>

          <div className="text-center text-xs text-[#94A3B8] py-2">TravGo KSA — Discover. Compare. Travel. © 2026 Tous droits réservés.</div>
        </div>
      </div>
    </div>
  );
}
