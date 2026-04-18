import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./messages/en";
import id from "./messages/id";

const supportedLngs = ["id", "en"];
const fallbackLng = "id";

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      id: { translation: id },
      en: { translation: en },
    },
    lng: fallbackLng,
    fallbackLng,
    supportedLngs,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });
}

export default i18n;
