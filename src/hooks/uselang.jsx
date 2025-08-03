import { useTranslation } from "react-i18next";
import { changeLanguageOnServer } from "../services/langserv";

export default function useLanguage() {
  const { i18n } = useTranslation();

  const changeLanguage = async (lang) => {
    const success = await changeLanguageOnServer(lang);
    if (success) {
      i18n.changeLanguage(lang);
      localStorage.setItem("lang", lang);
    }
  };

  return { currentLang: i18n.language, changeLanguage };
}
