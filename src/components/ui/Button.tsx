import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "accent";
type Size = "sm" | "md" | "lg" | "icon";

export function Button({ variant="primary", size="md", className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant, size?: Size }) {
  const base = "inline-flex items-center justify-center font-bold rounded-full transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";
  const variants: Record<Variant,string> = {
    primary: "bg-[#0E7C6B] text-white hover:bg-[#0A5E51] shadow-sm",
    secondary: "bg-[#0F172A] text-white hover:bg-black",
    ghost: "bg-transparent hover:bg-black/5 text-[#0F172A]",
    outline: "border border-[#E2E8F0] bg-white hover:bg-[#F8FAFB] text-[#0F172A]",
    accent: "bg-[#FF7A45] text-white hover:bg-[#E86A35] shadow-sm",
  };
  const sizes: Record<Size,string> = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-6 text-[15px]",
    lg: "h-[48px] px-8 text-[16px]",
    icon: "h-11 w-11 p-0",
  };
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props}>{children}</button>;
}
