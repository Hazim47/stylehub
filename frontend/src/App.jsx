import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  return <AppRoutes />;
}

export default App;
