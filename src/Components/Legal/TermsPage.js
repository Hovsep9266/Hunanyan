import { useI18n } from "../../i18n/I18nProvider";
import "./LegalPage.css";

export function TermsPage() {
  const { t } = useI18n();

  return (
    <main className="LegalPage">
      <h1>{t("legal.termsTitle")}</h1>
      <p>{t("legal.termsIntro")}</p>
      <h2>{t("legal.useTitle")}</h2>
      <p>{t("legal.useText")}</p>
      <h2>{t("legal.contentTitle")}</h2>
      <p>{t("legal.contentText")}</p>
      <h2>{t("legal.contactTitle")}</h2>
      <p>{t("legal.contactText")}</p>
    </main>
  );
}
