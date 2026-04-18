'use client';

import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";

const supportedLanguages = ["id", "en"] as const;

function getPreferredLanguage() {
  const storedLanguage = window.localStorage.getItem("lng");
  if (storedLanguage && supportedLanguages.includes(storedLanguage as "id" | "en")) {
    return storedLanguage;
  }

  const browserLanguage = window.navigator.language.slice(0, 2);
  return supportedLanguages.includes(browserLanguage as "id" | "en")
    ? browserLanguage
    : "id";
}

export default function I18nProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const syncLanguage = (language: string) => {
      document.documentElement.lang = language;
      window.localStorage.setItem("lng", language);
    };

    syncLanguage(i18n.language);
    i18n.on("languageChanged", syncLanguage);
    const preferredLanguage = getPreferredLanguage();

    if (preferredLanguage !== i18n.language) {
      void i18n.changeLanguage(preferredLanguage);
    }

    return () => {
      i18n.off("languageChanged", syncLanguage);
    };
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
