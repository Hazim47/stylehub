import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const { i18n } = useTranslation();
  const location = useLocation();

  // Language
  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  // Scroll to top whenever the page or query changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [location.pathname, location.search]);

  return <AppRoutes />;
}

export default App;
