import { useI18n } from "../../i18n/I18nProvider";
import "./LegalPage.css";

export function AboutPage() {
  const { t } = useI18n();

  return (
    <main className="LegalPage">
      <h1>{t("legal.aboutTitle")}</h1>
      <p>{t("legal.aboutIntro")}</p>
      <h2>{t("legal.tmdbTitle")}</h2>
      <p>{t("legal.tmdbText")}</p>
      <p>
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          TMDB
        </a>
      </p>
      <h2>{t("legal.contactTitle")}</h2>
      <p>{t("legal.contactText")}</p>
    </main>
  );
}
