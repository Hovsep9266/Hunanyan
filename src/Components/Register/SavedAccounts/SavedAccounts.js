import React, { useEffect, useState } from "react";
import { Modal } from "../../Modal/Modal";
import { useI18n } from "../../../i18n/I18nProvider";
import "./SavedAccounts.css";

const SavedAccounts = ({ setShowSaved, setUserAccount, setShowDisplay }) => {
  const { t } = useI18n();
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("users");
      const users = raw ? JSON.parse(raw) : [];
      setAccounts(users);
    } catch (e) {
      setAccounts([]);
    }
  }, []);

  const handleUseAccount = (acct) => {
    try {
      localStorage.setItem(
        "userAccount",
        JSON.stringify({
          name: acct.name,
          surname: acct.surname,
          email: acct.email,
        }),
      );
    } catch (e) {
      // ignore
    }
    setUserAccount?.({
      name: acct.name,
      surname: acct.surname,
      email: acct.email,
    });
    setShowSaved?.(false);
    setShowDisplay?.(false);
  };

  const handleDeleteAccount = (email) => {
    try {
      const raw = localStorage.getItem("users");
      let users = raw ? JSON.parse(raw) : [];
      users = users.filter((u) => u.email !== email);
      localStorage.setItem("users", JSON.stringify(users));
      setAccounts(users);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal onClose={() => setShowSaved?.(false)} titleKey="savedAccounts.title">
      <div className="savedAccountsList">
        <div className="userAccount">
          {accounts && accounts.length ? (
            accounts.map((acct) => (
              <div className="savedAccount" key={acct.email}>
                <div className="meta">
                  <strong>
                    {acct.name} {acct.surname || ""}
                  </strong>
                  <span>{acct.email}</span>
                </div>
                <div className="actions">
                  <button
                    className="useBtn"
                    onClick={() => handleUseAccount(acct)}
                  >
                    {t("savedAccounts.use")}
                  </button>
                  <button
                    className="delBtn"
                    onClick={() => handleDeleteAccount(acct.email)}
                  >
                    {t("savedAccounts.delete")}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="noAccounts">{t("savedAccounts.noAccounts")}</div>
          )}
        </div>
        <button className="signbutton" onClick={() => setShowSaved(false)}>
          {t("common.back")}
        </button>
      </div>
    </Modal>
  );
};

export default SavedAccounts;
