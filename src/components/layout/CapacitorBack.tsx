"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Capacitor } from "@capacitor/core";
import { App as CapApp } from "@capacitor/app";

export default function CapacitorBack() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let remove: any = null;
    const setup = async () => {
      try {
        const listener = await CapApp.addListener("backButton", ({ canGoBack }) => {
          // Si l'historique web peut reculer, on recule, sinon on ne ferme pas sur les pages internes
          if (window.history.length > 1 || canGoBack) {
            // Next.js router back sinon history
            if (window.history.length > 1) window.history.back();
            else router.back();
          } else {
            // Sur page d'accueil, demande confirmation avant exit
            if (pathname === "/" || pathname === "") {
              // Double back to exit : si déjà sur home, on minimise au lieu de kill brutal
              // Option: ne rien faire ou exitApp() après confirmation
              // Ici on exit proprement
              CapApp.exitApp();
            } else {
              router.push("/");
            }
          }
        });
        remove = listener.remove;
      } catch (e) {
        console.warn("Capacitor backButton not available", e);
        // Fallback JS: intercepter popstate
        const handler = (e: PopStateEvent) => {
          // déjà géré par browser
        };
        window.addEventListener("popstate", handler);
        remove = () => window.removeEventListener("popstate", handler);
      }
    };
    setup();
    return () => {
      if (remove) remove();
      CapApp.removeAllListeners();
    };
  }, [router, pathname]);

  return null;
}
