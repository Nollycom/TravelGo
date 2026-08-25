import { cn } from "@/lib/utils";

export function Badge({ children, variant="default", className }: { children: React.ReactNode, variant?: "default"|"success"|"warning"|"sponsored"|"verified", className?: string }) {
  const map: Record<string,string> = {
    default: "bg-white border border-[#E2E8F0] text-[#0F172A]",
    success: "bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]",
    warning: "bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]",
    sponsored: "bg-[#FFF7ED] text-[#9A3412] border border-[#FDBA74]",
    verified: "bg-[#0E7C6B] text-white",
  };
  return <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold", map[variant], className)}>{children}</span>;
}

export function VerificationBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#0E7C6B] text-white px-2 py-0.5 text-[11px] font-bold">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white"/></svg>
      Vérifié
    </span>
  );
}
