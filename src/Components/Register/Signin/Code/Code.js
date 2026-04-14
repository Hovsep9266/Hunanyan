import { useState } from "react";
import "./Code.css";
import { Modal } from "../../../Modal/Modal";
import { Success } from "../../../Success/Success";
import { useI18n } from "../../../../i18n/I18nProvider";

export const Code = ({
  showRegister,
  show,
  setShowDisplay,
  code,
  // setShowSuccess,
  setShowRegister,
  // showSuccess,
  object,
  setObject,
  setUserAccount,
}) => {
  const [isTrue, setIsTrue] = useState();
  const [errorShow, setErrorShow] = useState(false);
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
      <div className="Code">
        <h1>{t("code.title")}</h1>
        <div className="inputButton">
          <input
            type="text"
            maxLength="6"
            className="code-input"
            placeholder={t("code.placeholder")}
            onChange={(e) => setIsTrue(e.target.value)}
          />
          <button
            className="send"
            onClick={() => {
              try {
                const pendingRaw = localStorage.getItem("pendingSignup");
                const pending = pendingRaw ? JSON.parse(pendingRaw) : null;
                if (!pending) {
                  setErrorShow(true);
                  return;
                }
                if (String(pending.code) === String(isTrue)) {
                  // finalize registration: persist user and clear pending
                  const newUser = {
                    name: pending.name,
                    surname: pending.surname,
                    email: pending.email,
                    password: pending.password,
                  };

                  try {
                    // update in-memory list if setter provided
                    setObject?.([...(object || []), newUser]);
                    // persist users to localStorage as existing pattern expects
                    const usersRaw = JSON.stringify([
                      ...(object || []),
                      newUser,
                    ]);
                    localStorage.setItem("users", usersRaw);
                  } catch (err) {
                    console.error("Error saving new user", err);
                  }

                  // set current account
                  setUserAccount?.({
                    name: pending.name,
                    email: pending.email,
                  });

                  // clear pending signup
                  localStorage.removeItem("pendingSignup");

                  // close wrapper
                  setShowDisplay?.(false);
                  setShowRegister?.(false);
                } else {
                  setErrorShow(true);
                  return;
                }
              } catch (err) {
                console.error(err);
                setErrorShow(true);
              }
            }}
          >
            {t("code.send")}
          </button>
          {errorShow && <div className="error">{t("code.error")}</div>}
        </div>
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
            setShowRegister={setShowRegister}
            setShowDisplay={setShowDisplay}
            // setShowSuccess={setShowSuccess}
          />
        </Modal>
      )}
    </Modal>
  );
};
