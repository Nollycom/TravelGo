"use client";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light"|"dark";
const ThemeCtx = createContext<{ theme:Theme; toggle:()=>void; set:(t:Theme)=>void }>({ theme:"light", toggle:()=>{}, set:()=>{} });

export function ThemeProvider({ children }: { children: React.ReactNode }){
  const [theme, setTheme] = useState<Theme>("light");
  useEffect(()=>{
    const saved = localStorage.getItem("travgo-theme") as Theme | null;
    const sys = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const init = saved || sys;
    setTheme(init); document.documentElement.classList.toggle("dark", init==="dark");
  },[]);
  const toggle = ()=> { const n = theme==="light"?"dark":"light"; setTheme(n); localStorage.setItem("travgo-theme", n); document.documentElement.classList.toggle("dark", n==="dark"); };
  const set = (t:Theme)=> { setTheme(t); localStorage.setItem("travgo-theme", t); document.documentElement.classList.toggle("dark", t==="dark"); };
  return <ThemeCtx.Provider value={{ theme, toggle, set }}>{children}</ThemeCtx.Provider>;
}
export const useTheme = ()=> useContext(ThemeCtx);
