import { useContext, useState } from "react";
import "./Register.css";
import { Modal } from "../Modal/Modal";
import { Login } from "./Login/Login";
import { Signin } from "./Signin/Signin";
import SavedAccounts from "./SavedAccounts/SavedAccounts";
import { ModalContext } from "../ConfigModal/ConfigModal";
import { useI18n } from "../../i18n/I18nProvider";

export const Register = ({
  setShowRegister,
  setUserAccount,
  userAccount,
  showRegister,
  setShowModal,
}) => {
  //   const [name, setName] = useState("");
  //   const [surname, setSurname] = useState("");
  //   const [email, setEmail] = useState("");
  //   const [password, setPassword] = useState("");
  //   const [duplicates, setDuplicates] = useState("");
  //   const [object, setObject] = useState(() => {
  //     return JSON.parse(localStorage.getItem("users")) || [];
  //   });
  //   const [showSuccess, setShowSuccess] = useState(false);

  //   const isValidPassword = password === duplicates;
  //   const isValidEmail = email.includes("@") && email.includes(".");

  //   const Config = {
  //     mail: "Wrong email",
  //     password: "Passwords do not match",
  //     required: "This field is required",
  //   };

  //   const onChange = (e, setState) => {
  //     setState(e.target.value);
  //   };

  //   const onSubmit = (e) => {
  //     e.preventDefault();

  //     if (!isValidEmail || !isValidPassword) {
  //       return;
  //     }
  //   };

  //   useEffect(() => {
  //     localStorage.setItem("users", JSON.stringify(object));
  //   }, [object]);

  //   console.log(object);

  // const [showLogin, setShowLogin] = useState(false);
  // const [showSignup, setShowSignup] = useState(false);
  // const [showSuccess, setShowSuccess] = useState(false);

  const show = useContext(ModalContext);
  const { t } = useI18n();

  const [object, setObject] = useState(() => {
    return JSON.parse(localStorage.getItem("users")) || [];
  });
  const [showSaved, setShowSaved] = useState(false);
  const isLoginView = showRegister === show.login;
  const isSignUpView = showRegister === show.signUp;
  const isMenuView = !showSaved && !isLoginView && !isSignUpView;

  const titleKey = showSaved
    ? "savedAccounts.title"
    : isLoginView
      ? "auth.loginTitle"
      : isSignUpView
        ? "auth.signupTitle"
        : "modal.register";

  return (
    <Modal
      titleKey={titleKey}
      setShowRegister={setShowRegister}
      showRegister={showRegister}
      // pass parent setter so Modal can also hide the Register wrapper
      setShowDisplay={setShowModal}
      onClose={() => {
        // close both the register state and the wrapper modal
        setShowModal?.(false);
        setShowRegister?.(false);
      }}
    >
      {isMenuView && (
        <div className="registerButtons">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="Layer_1"
            data-name="Layer 1"
            viewBox="0 0 26 26"
            width="100"
            height="100"
          >
            <path d="m16,23.314c-1.252.444-2.598.686-4,.686s-2.748-.242-4-.686v-2.314c0-2.206,1.794-4,4-4s4,1.794,4,4v2.314ZM12,7c-1.103,0-2,.897-2,2s.897,2,2,2,2-.897,2-2-.897-2-2-2Zm12,5c0,4.433-2.416,8.311-6,10.389v-1.389c0-3.309-2.691-6-6-6s-6,2.691-6,6v1.389C2.416,20.311,0,16.433,0,12,0,5.383,5.383,0,12,0s12,5.383,12,12Zm-8-3c0-2.206-1.794-4-4-4s-4,1.794-4,4,1.794,4,4,4,4-1.794,4-4Z" />
          </svg>
          <button
            className="signbutton"
            onClick={() => {
              setShowSaved(true);
              setShowRegister(false);
            }}
          >
            {t("savedAccounts.title")}
          </button>
          <button
            className="signbutton"
            onClick={() => {
              setShowSaved(false);
              setShowRegister(show.login);
            }}
          >
            {t("auth.loginButton")}
          </button>
          <button
            className="signbutton"
            onClick={() => {
              setShowSaved(false);
              setShowRegister(show.signUp);
            }}
          >
            {t("auth.signupButton")}
          </button>
        </div>
      )}
      {isLoginView && (
        <Login
          inline
          onBack={() => setShowRegister(false)}
          show={show}
          showRegister={showRegister}
          object={object}
          setShowRegister={setShowRegister}
          // allow nested modals to hide the whole Register wrapper
          setShowDisplay={setShowModal}
          // setShowLogin={setShowLogin}
          // setShowSuccess={setShowSuccess}
          // showSuccess={showSuccess}
          setUserAccount={setUserAccount}
        />
      )}
      {isSignUpView && (
        <Signin
          inline
          onBack={() => setShowRegister(false)}
          showRegister={showRegister}
          object={object}
          setObject={setObject}
          setShowRegister={setShowRegister}
          // allow nested modals to hide the whole Register wrapper
          setShowDisplay={setShowModal}
          // setShowSignup={setShowSignup}
          // showSuccess={showSuccess}
          // setShowSuccess={setShowSuccess}
          setUserAccount={setUserAccount}
        />
      )}
      {showSaved && (
        <SavedAccounts
          inline
          onBack={() => setShowSaved(false)}
          setShowSaved={setShowSaved}
          setUserAccount={setUserAccount}
          setShowDisplay={setShowModal}
        />
      )}
    </Modal>
  );
};
