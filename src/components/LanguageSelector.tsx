import React from "react";
import { useTranslation } from "../i18n";
import { Globe } from "lucide-react";

export function LanguageSelector() {
  const { lang, setLang, t } = useTranslation();

  const isEnglish = lang === "en";

  return (
    <div
      className="language-selector"
      role="group"
      aria-label={t("global.language")}
    >
      <button
        type="button"
        className={`lang-btn ${isEnglish ? "lang-active" : ""}`}
        onClick={() => setLang("en")}
        aria-pressed={isEnglish}
        title={t("global.language_english")}
      >
        EN
      </button>
      <button
        type="button"
        className={`lang-btn ${!isEnglish ? "lang-active" : ""}`}
        onClick={() => setLang("fr")}
        aria-pressed={!isEnglish}
        title={t("global.language_french")}
      >
        FR
      </button>
    </div>
  );
}
