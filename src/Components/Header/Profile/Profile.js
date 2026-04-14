import React, { useState, useEffect } from "react";
import { Modal } from "../../Modal/Modal";
import { useI18n } from "../../../i18n/I18nProvider";
import "./Profile.css";

const Profile = ({ userAccount, setUserAccount, setShowProfile }) => {
  const { t } = useI18n();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    address: "",
  });
  const [originalEmail, setOriginalEmail] = useState(null);
  const [emailError, setEmailError] = useState(false);

  useEffect(() => {
    // Prefer the full user record from localStorage.users when available
    try {
      const usersRaw = localStorage.getItem("users");
      const users = usersRaw ? JSON.parse(usersRaw) : [];

      if (userAccount?.email) {
        const found = users.find((u) => u.email === userAccount.email);
        if (found) {
          setForm({
            name: found.name || "",
            username: found.surname || "",
            email: found.email || "",
            password: found.password || "",
            address: found.address || "",
          });
          setOriginalEmail(found.email || userAccount.email);
          return;
        }
      }

      // fallback: try to load compact single userAccount
      const stored = localStorage.getItem("userAccount");
      if (stored) {
        const parsed = JSON.parse(stored);
        setForm((f) => ({ ...f, ...parsed }));
        if (parsed.email) setOriginalEmail(parsed.email);
      }
    } catch (e) {
      // ignore parse errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAccount]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const saveProfile = () => {
    const updated = { ...form };

    // basic email validation
    const isValidEmail =
      updated.email &&
      updated.email.includes("@") &&
      updated.email.includes(".");
    if (!isValidEmail) {
      setEmailError(true);
      return;
    }

    try {
      // persist single userAccount object (compact)
      localStorage.setItem(
        "userAccount",
        JSON.stringify({
          name: updated.name,
          surname: updated.username,
          email: updated.email,
        })
      );

      // update users array (full records)
      const raw = localStorage.getItem("users");
      let users = raw ? JSON.parse(raw) : [];
      const matchEmail = originalEmail || updated.email;
      const idx = users.findIndex((u) => u.email === matchEmail);

      const newRecord = {
        name: updated.name,
        surname: updated.username,
        email: updated.email,
        password: updated.password,
        address: updated.address,
      };

      if (idx >= 0) {
        users[idx] = { ...users[idx], ...newRecord };
      } else {
        users.push(newRecord);
      }
      localStorage.setItem("users", JSON.stringify(users));
    } catch (e) {
      console.error("Error saving profile", e);
    }

    // update parent
    setUserAccount?.({
      name: updated.name,
      surname: updated.username,
      email: updated.email,
    });
    setShowProfile?.(false);
    console.log(t("profile.saved"));
  };

  return (
    <Modal onClose={() => setShowProfile?.(false)} titleKey="profile.title">
      <div className="profileForm">
        <label>{t("profile.name")}</label>
        <input
          className="profileInput"
          name="name"
          value={form.name || ""}
          onChange={onChange}
        />

        <label>{t("profile.username")}</label>
        <input
          className="profileInput"
          name="username"
          value={form.username || ""}
          onChange={onChange}
        />

        <label>{t("profile.email")}</label>
        <input
          className="profileInput"
          name="email"
          value={form.email || ""}
          onChange={onChange}
        />
        {emailError && <span className="error">{t("auth.invalidEmail")}</span>}

        <label>{t("profile.password")}</label>
        <input
          className="profileInput"
          name="password"
          type="password"
          value={form.password || ""}
          onChange={onChange}
        />

        <div className="profileButtons">
          <button className="cancelBtn" onClick={() => setShowProfile?.(false)}>
            {t("profile.cancel")}
          </button>
          <button className="saveBtn" onClick={saveProfile}>
            {t("profile.save")}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default Profile;
