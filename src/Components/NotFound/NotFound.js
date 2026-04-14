import { Link } from "react-router-dom";
import "./NotFound.css";
import { useI18n } from "../../i18n/I18nProvider";

export const NotFound = () => {
  const { t } = useI18n();
  return (
    <div className="notfound-container">
      <h1 className="notfound-title">{t("notFound.subtitle")}</h1>
      <h2 className="notfound-subtitle">{t("notFound.title")}</h2>

      <p className="notfound-text">{t("notFound.text")}</p>

      <Link to="/" className="notfound-btn">
        {t("notFound.button")}
      </Link>
    </div>
  );
};
