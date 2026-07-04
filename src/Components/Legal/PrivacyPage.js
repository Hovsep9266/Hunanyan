import { useI18n } from "../../i18n/I18nProvider";
import "./LegalPage.css";

export function PrivacyPage() {
  const { t } = useI18n();

  return (
    <main className="LegalPage">
      <h1>{t("legal.privacyTitle")}</h1>
      <p>{t("legal.privacyIntro")}</p>
      <h2>{t("legal.dataTitle")}</h2>
      <p>{t("legal.dataText")}</p>
      <h2>{t("legal.cookiesTitle")}</h2>
      <p>{t("legal.cookiesText")}</p>
      <h2>{t("legal.contactTitle")}</h2>
      <p>{t("legal.contactText")}</p>
    </main>
  );
}
