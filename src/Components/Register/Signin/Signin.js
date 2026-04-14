import { useContext, useEffect, useState } from "react";
import "./Signin.css";
import { Modal } from "../../Modal/Modal";
import { Code } from "./Code/Code";
import { ModalContext } from "../../ConfigModal/ConfigModal";
import { useI18n } from "../../../i18n/I18nProvider";

export const Signin = ({
  object,
  setObject,
  setShowRegister,
  // setShowSignup,
  // setShowSuccess,
  // showSuccess,
  setUserAccount,
  showRegister,
  setShowDisplay,
}) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [duplicates, setDuplicates] = useState("");
  const [showError, setShowError] = useState(false);
  // const [showDiplay, setShowDisplay] = useState(false);

  const [code] = useState(() => Math.floor(100000 + Math.random() * 900000));

  const isValidPassword = password === duplicates;
  const isValidEmail = email.includes("@") && email.includes(".");

  const Config = {
    mail: "Wrong email",
    password: "Passwords do not match",
    required: "This field is required",
  };

  const { t } = useI18n();

  const onChange = (e, setState) => {
    setState(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!isValidEmail || !isValidPassword) {
      return;
    }
  };

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(object));
  }, [object]);

  const show = useContext(ModalContext);

  console.log(showRegister);

  return (
    // pass the register setter and the wrapper display setter so closing hides everything
    <Modal
      className="Register"
      setShowRegister={setShowRegister}
      setShowDisplay={setShowDisplay}
      onClose={() => {
        setShowDisplay?.(false);
        setShowRegister?.(false);
      }}
    >
      <form className="registerForm" onSubmit={onSubmit}>
        <h2>{t("auth.signupTitle")}</h2>
        <input
          type="text"
          placeholder={t("auth.name")}
          value={name}
          required
          onChange={(e) => onChange(e, setName)}
        />
        <input
          type="text"
          placeholder={t("auth.surname")}
          value={surname}
          required
          onChange={(e) => onChange(e, setSurname)}
        />
        <div className="wrongError">
          <input
            type="email"
            placeholder={t("auth.email")}
            value={email}
            required
            errorMessage={t("auth.invalidEmail")}
            error={email !== "" && !isValidEmail}
            onChange={(e) => onChange(e, setEmail)}
          />
          {!isValidEmail && <span className="error">{Config.mail}</span>}
        </div>
        <div className="wrongError">
          <input
            type="password"
            placeholder={t("auth.password")}
            value={password}
            required
            error={!isValidPassword && duplicates !== ""}
            errorMessage={t("auth.passwordsDontMatch")}
            onChange={(e) => onChange(e, setPassword)}
          />
          {!isValidPassword && <span className="error">{Config.password}</span>}
        </div>
        <div className="wrongError">
          <input
            type="password"
            placeholder={t("auth.confirmPassword")}
            value={duplicates}
            required
            error={!isValidPassword && duplicates !== ""}
            errorMessage={t("auth.passwordsDontMatch")}
            onChange={(e) => onChange(e, setDuplicates)}
          />
          {!isValidPassword && <span className="error">{Config.password}</span>}
        </div>
        <div className="buttonContainer">
          <button
            type="button"
            className="right"
            onClick={() => {
              // close full wrapper
              setShowDisplay?.(false);
              setShowRegister?.(false);
            }}
          >
            {t("auth.back")}
          </button>

          <button
            type="button"
            className={isValidEmail && isValidPassword ? "right" : "disabled"}
            disabled={!isValidEmail || !isValidPassword}
            onClick={() => {
              // check duplicate email once
              const exists = object.find((user) => user.email === email);
              if (exists) {
                setShowError(true);
                return;
              }

              // add new user
              const newUser = { name, surname, email, password };
              setObject([...(object || []), newUser]);
              setUserAccount({ name, email });
              setShowError(false);
              setShowDisplay?.(false);
              setShowRegister(show.sendCode);
              console.log("verification code:", code);
            }}
          >
            {t("auth.signupButton")}
          </button>
        </div>
        {showError && <span className="error">{t("auth.emailInUse")}</span>}
      </form>
      {showRegister === show.sendCode && (
        <Code
          showRegister={showRegister}
          show={show}
          setShowDisplay={setShowDisplay}
          // showSuccess={showSuccess}
          // setShowSuccess={setShowSuccess}
          setShowRegister={setShowRegister}
          code={code}
        />
      )}
    </Modal>
  );
};
