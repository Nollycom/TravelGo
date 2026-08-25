"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";

export default function MobileNav() {
  const pathname = usePathname();
  const { lang } = useI18n();
  const items = [
    { labelFr:"Découvrir", labelAr:"استكشاف", labelEn:"Discover", href: "/", icon: "⌖", key:"discover" },
    { labelFr:"Rechercher", labelAr:"بحث", labelEn:"Search", href: "/offers", icon: "⌕", key:"search" },
    { labelFr:"Reels", labelAr:"ريلز", labelEn:"Reels", href: "/reels", icon: "▶", key:"reels" },
    { labelFr:"Devis", labelAr:"عرض سعر", labelEn:"Quote", href: "/quote", icon: "✉", key:"quote" },
    { labelFr:"Compte", labelAr:"حسابي", labelEn:"Account", href: "/dashboard", icon: "◯", key:"account" },
  ];
  const getLabel = (it:any)=>{
    if(lang==="ar") return it.labelAr;
    if(lang==="en") return it.labelEn;
    return it.labelFr;
  };
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white dark:bg-[#0F172A] border-t border-[#E2E8F0] dark:border-[#1E293B] px-2 py-2">
      <div className="flex justify-around">
        {items.map(i=>{
          const active = pathname === i.href;
          const label = getLabel(i);
          return (
            <Link key={i.href} href={i.href} className={`flex flex-col items-center gap-1 px-3 py-1 rounded-2xl ${active ? "text-[#0E7C6B] dark:text-[#14B8A6] bg-[#0E7C6B]/10 dark:bg-[#14B8A6]/10" : "text-[#64748B] dark:text-[#94A3B8]"}`}>
              <span className="text-[18px] leading-none">{i.icon}</span>
              <span className="text-[10px] font-bold">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
