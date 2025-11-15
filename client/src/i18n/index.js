import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import uz from "./languages/uz.json";
import ru from "./languages/ru.json";
import oz from "./languages/oz.json";

const resources = {
  uz: { translation: uz },
  ru: { translation: ru },
  oz: { translation: oz },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("lng") || "uz",
  fallbackLng: "uz",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
