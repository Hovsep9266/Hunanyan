import { useState } from "react";
import { Modal } from "../../Modal/Modal";
import { Success } from "../../Success/Success";
import "./Login.css";
import { useI18n } from "../../../i18n/I18nProvider";

export const Login = ({
  setShowLogin,
  setShowSuccess,
  setShowRegister,
  showSuccess,
  object,
  setUserAccount,
  showRegister,
  show,
  setShowDisplay,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);

  const isValidEmail = email.includes("@") && email.includes(".");
  const isValidPassword = password.length > 5;
  const { t } = useI18n();

  return (
    <Modal
      setShowRegister={setShowRegister}
      setShowDisplay={setShowDisplay}
      onClose={() => {
        setShowDisplay?.(false);
        setShowRegister?.(false);
      }}
    >
      <div className="Login">
        <h2>{t("auth.loginTitle")}</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("auth.email")}
          className="inputField"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t("auth.password")}
          className="inputField"
        />
        <div className="buttonContainer">
          <button
            className="Button"
            onClick={() => {
              setShowDisplay?.(false);
              setShowRegister?.(false);
            }}
          >
            {t("auth.back")}
          </button>
          <button
            className={isValidEmail && isValidPassword ? "right" : "disabled"}
            onClick={() => {
              const found = object.find(
                (user) => user.email === email && user.password === password
              );

              if (found) {
                setShowError(false);
                setShowRegister(show.success);
                setUserAccount({
                  name: found.name,
                  email: found.email,
                });
                setShowDisplay?.(false);
              } else {
                setShowError(true);
              }
            }}
          >
            {t("auth.loginButton")}
          </button>
        </div>
        {showError && (
          <span className="error">{t("auth.invalidCredentials")}</span>
        )}
      </div>
      {showRegister === show.success && (
        <Modal
          setShowRegister={setShowRegister}
          setShowDisplay={setShowDisplay}
          onClose={() => {
            setShowDisplay?.(false);
            setShowRegister?.(false);
          }}
        >
          <Success
            setShowSuccess={setShowSuccess}
            setShowRegister={setShowRegister}
            setShowDisplay={setShowDisplay}
          />
        </Modal>
      )}
    </Modal>
  );
};
