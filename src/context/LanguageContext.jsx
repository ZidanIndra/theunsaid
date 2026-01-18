import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translations } from "../i18n/translations.js";

const LANGUAGE_KEY = "theunsaid.language.v1";
const LanguageContext = createContext(null);

const resolveLanguage = () => {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem(LANGUAGE_KEY);
  return stored === "id" || stored === "en" ? stored : "en";
};

const formatTemplate = (template, vars) => {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    Object.prototype.hasOwnProperty.call(vars, key) ? vars[key] : match
  );
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(resolveLanguage);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LANGUAGE_KEY, language);
    }
  }, [language]);

  const t = useMemo(() => {
    return (key, vars) => {
      const dictionary = translations[language] || translations.en;
      const template = dictionary[key] || translations.en[key] || key;
      return formatTemplate(template, vars);
    };
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage: () =>
        setLanguage((prev) => (prev === "en" ? "id" : "en")),
      t
    }),
    [language, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
