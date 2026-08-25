import { cn } from "@/lib/utils";
export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("bg-white rounded-[20px] border border-[#E2E8F0] overflow-hidden", className)} {...props}>{children}</div>;
}
export function CardPad({ className, children }: { className?: string, children: React.ReactNode }) {
  return <div className={cn("p-5", className)}>{children}</div>;
}
