import Link from "next/link";

export const metadata = { title: "Conditions générales — TravGo KSA", description: "Conditions d'utilisation de TravGo KSA — marketplace touristique Arabie Saoudite. Dernière mise à jour 25 août 2026." };

const articles = [
  { n: "1", title: "Présentation de TravGo", icon: "🏝️" },
  { n: "2", title: "Utilisation de la plateforme", icon: "⚖️" },
  { n: "3", title: "Offres et prestataires", icon: "🏷️" },
  { n: "4", title: "Rôle de TravGo", icon: "🤝" },
  { n: "5", title: "Devis et demandes", icon: "📨" },
  { n: "6", title: "Prix et paiements — SAR", icon: "💳" },
  { n: "7", title: "Contenu publié", icon: "📝" },
  { n: "8", title: "Propriété intellectuelle", icon: "©️" },
  { n: "9", title: "Disponibilité du service", icon: "🔧" },
  { n: "10", title: "Responsabilité", icon: "🛡️" },
  { n: "11", title: "Modification des conditions", icon: "🔄" },
  { n: "12", title: "Contact", icon: "📞" },
];

export default function ConditionsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFB] dark:bg-[#080C14]">
      <div className="bg-[#0F172A] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0E7C6B]/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-[1280px] px-4 lg:px-6 py-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/15 rounded-full px-3 py-1 text-xs font-bold">📄 Conditions générales d'utilisation</div>
          <h1 className="text-3xl lg:text-4xl font-black mt-4">Conditions générales</h1>
          <p className="text-white/70 mt-2 max-w-2xl text-sm">Dernière mise à jour : <b className="text-white">25 août 2026</b> — En utilisant TravGo, vous acceptez ces conditions. Lisez-les attentivement.</p>
          <div className="flex gap-2 mt-4">
            <span className="px-3 py-1.5 rounded-full bg-white text-[#0F172A] text-xs font-black">travgo.web.app/conditions</span>
            <a href="tel:+966598009209" className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white text-xs font-bold">Contact +966 598 009 209</a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 lg:px-6 py-8 grid lg:grid-cols-[280px_1fr] gap-8">
        <aside className="hidden lg:block">
          <div className="sticky top-[88px] bg-white dark:bg-[#0F172A] rounded-[20px] border p-4">
            <div className="text-xs font-black tracking-widest text-[#64748B] mb-3">12 ARTICLES</div>
            <nav className="space-y-1">
              {articles.map(a=>(
                <a key={a.n} href={`#art${a.n}`} className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium text-[#334155] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#1A2332]"><span>{a.icon}</span> {a.n}. {a.title}</a>
              ))}
            </nav>
            <div className="mt-4 p-3 rounded-2xl bg-[#0F172A] text-white text-xs">
              <div className="font-bold">Besoin d'aide ?</div>
              <a href="tel:+966598009209" className="underline font-black">+966 598 009 209</a>
              <div className="opacity-60">Support 7j/7</div>
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6">
            <p className="text-sm leading-relaxed text-[#475569] dark:text-[#94A3B8]">Bienvenue sur <b className="text-[#0F172A] dark:text-white">TravGo KSA</b>. Les présentes Conditions définissent les règles d'utilisation de la plateforme accessible via son site web et services associés. En utilisant TravGo, vous reconnaissez les avoir lues et acceptées.</p>
          </div>

          {[
            { id: "art1", n: "1", t: "Présentation de TravGo", c: "TravGo est une marketplace touristique destinée principalement aux voyageurs vivant ou résidant en Arabie Saoudite. Elle permet de découvrir des destinations, consulter des offres, comparer des propositions, regarder du contenu et entrer en contact avec des professionnels. Elle permet aussi de demander des devis." },
            { id: "art2", n: "2", t: "Utilisation de la plateforme", list: ["Utiliser la plateforme à des fins frauduleuses.", "Fournir volontairement de fausses informations.", "Usurper l'identité d'autrui.", "Publier du contenu illégal, trompeur ou offensant.", "Envoyer du spam.", "Compromettre la sécurité.", "Extraire massivement les données sans autorisation.", "Activité contraire aux lois."] },
            { id: "art3", n: "3", t: "Offres et prestataires", c: "Les offres peuvent être publiées par des professionnels. Prix, disponibilités, prestations, horaires et descriptions peuvent être fournis par les prestataires et modifiés selon disponibilités au moment de la réservation." },
            { id: "art4", n: "4", t: "Rôle de TravGo", c: "TravGo agit principalement comme plateforme de mise en relation. Sauf indication contraire, TravGo n'est pas le fournisseur direct des vols, hôtels, activités ou transports. Le contrat est conclu directement entre voyageur et prestataire — lisez attentivement les conditions du prestataire." },
            { id: "art5", n: "5", t: "Devis et demandes de contact", c: "Une demande de devis transmise aux prestataires ne constitue pas automatiquement une réservation. Une réservation est confirmée uniquement lorsque les conditions applicables ont été acceptées et que le prestataire l'a confirmée selon ses procédures." },
            { id: "art6", n: "6", t: "Prix et paiements", c: "La devise principale est le SAR (riyal saoudien). Les prix affichés peuvent être indicatifs et varier selon disponibilité, dates, nombre de voyageurs, options ou conditions du prestataire. Vérifiez toujours le montant final avant paiement." , highlight: true},
            { id: "art7", n: "7", t: "Contenu publié", c: "Utilisateurs et prestataires peuvent publier images, vidéos, descriptions, avis ou infos commerciales. Ils garantissent disposer des droits nécessaires. TravGo peut retirer tout contenu contraire aux conditions ou aux droits de tiers." },
            { id: "art8", n: "8", t: "Propriété intellectuelle", c: "Marque TravGo, logo, identité visuelle, interface, textes, graphismes, code et autres éléments protégés appartiennent à TravGo ou ayants droit. Toute reproduction non autorisée est interdite. Les contenus prestataires restent propriété de leurs propriétaires." },
            { id: "art9", n: "9", t: "Disponibilité du service", c: "TravGo s'efforce de maintenir la plateforme disponible. Certaines fonctionnalités peuvent être temporairement indisponibles pour maintenance, mises à jour ou problèmes techniques. Aucune garantie d'absence d'interruption." },
            { id: "art10", n: "10", t: "Responsabilité", c: "TravGo met en œuvre des mesures raisonnables pour une plateforme fiable. Toutefois, TravGo ne peut garantir l'exactitude permanente des informations prestataires. L'utilisateur doit vérifier informations importantes avant réservation : prix, disponibilités, documents, assurances, annulations." },
            { id: "art11", n: "11", t: "Modification des conditions", c: "TravGo peut modifier les présentes conditions pour tenir compte de l'évolution des services ou exigences légales. La version la plus récente sera publiée sur la plateforme. La poursuite de l'utilisation vaut acceptation." },
          ].map(a => (
            <section key={a.id} id={a.id} className="bg-white dark:bg-[#0F172A] rounded-[20px] border p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-xl bg-[#0F172A] dark:bg-[#1A2332] text-white flex items-center justify-center font-black text-sm">{a.n}</div>
                <h2 className="text-lg font-black dark:text-white">{a.t}</h2>
                {a.highlight && <span className="ml-auto px-2.5 py-1 rounded-full bg-[#0E7C6B] text-white text-xs font-bold">SAR</span>}
              </div>
              {a.c && <p className="text-sm leading-relaxed text-[#475569] dark:text-[#94A3B8]">{a.c}</p>}
              {a.list && (
                <ul className="mt-3 space-y-2">
                  {a.list.map(x => (
                    <li key={x} className="flex gap-2 text-sm text-[#475569] dark:text-[#94A3B8]"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#EF4444] shrink-0" />{x}</li>
                  ))}
                </ul>
              )}
              {a.n === "2" && <div className="mt-4 p-3 rounded-2xl bg-[#FEF2F2] dark:bg-[#2A0F12] border border-[#FECACA] dark:border-[#450A18] text-xs text-[#991B1B] dark:text-[#FCA5A5]">TravGo se réserve le droit de suspendre ou supprimer un compte en cas de violation.</div>}
            </section>
          ))}

          <section id="art12" className="bg-[#0F172A] text-white rounded-[20px] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div><div className="font-black">12. Contact</div><div className="text-sm text-white/70">Une question sur ces conditions ?</div><a href="tel:+966598009209" className="text-sm font-black underline">+966 598 009 209</a></div>
            <Link href="/help" className="px-5 py-2.5 rounded-full bg-white text-[#0F172A] font-black text-sm">Centre d'aide</Link>
          </section>

          <div className="text-center text-xs text-[#94A3B8]">© 2026 TravGo KSA — Discover. Compare. Travel. Tous droits réservés.</div>
        </div>
      </div>
    </div>
  );
}
