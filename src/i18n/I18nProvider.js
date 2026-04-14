import React, { createContext, useContext, useEffect, useState } from "react";
import translations from "./common.json";

const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
  const defaultLang =
    typeof window !== "undefined" && localStorage.getItem("lang")
      ? localStorage.getItem("lang")
      : "en";
  const [lang, setLangState] = useState(defaultLang || "en");

  useEffect(() => {
    try {
      localStorage.setItem("lang", lang);
    } catch (e) {
      // silent
    }
  }, [lang]);

  const setLang = (l) => setLangState(l);

  const t = (key, vars = {}) => {
    if (!key) return "";
    const parts = key.split(".");
    let node = translations[lang];
    for (const p of parts) {
      if (!node) break;
      node = node[p];
    }
    if (!node) {
      // fallback to english
      node = translations["en"];
      for (const p of parts) {
        if (!node) break;
        node = node[p];
      }
    }
    if (typeof node !== "string") return key;
    let result = node;
    // simple templating {name}
    Object.keys(vars).forEach((k) => {
      result = result.replace(new RegExp(`{${k}}`, "g"), vars[k]);
    });
    return result;
  };

  const value = { lang, setLang, t };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
};

export default I18nProvider;
