// Seed Firestore avec données KSA (à exécuter une fois après création projet)
// Usage: npx tsx src/lib/firebase/seed.ts  ou via /admin -> bouton "Seed KSA"
import { providers, offers, destinations, categories } from "../data";

export const SEED_COLLECTIONS = {
  providers, offers, destinations, categories,
  settings: {
    defaultCurrency: "SAR",
    defaultCountry: "Arabie Saoudite",
    defaultCitiesFrom: ["Riyad","Jeddah","Dammam","AlUla","Abha","NEOM","Taïf","Médine","La Mecque"],
    vat: 15,
    locale: "ar-SA",
    timezone: "Asia/Riyadh",
    region: "me-central1",
  }
};
