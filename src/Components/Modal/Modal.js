import "./Modal.css";
import { useI18n } from "../../i18n/I18nProvider";

export const Modal = ({
  children,
  onClose,
  setShowRegister,
  setShowLogin,
  setShowSignup,
  setShowDisplay,
  titleKey,
}) => {
  const { t } = useI18n();
  const handleClose = () => {
    // call explicit onClose callback first if provided
    onClose?.();

    // fallback: try to clear any known show-state setters passed as props
    setShowDisplay?.(false);
    setShowRegister?.(false);
    setShowLogin?.(false);
    setShowSignup?.(false);
  };

  const title = titleKey ? t(titleKey) : t("modal.register");

  return (
    // use internal handler so overlay clicks always attempt to close modal
    <div className="ModalOverlay" onClick={handleClose}>
      <div className="ModalContent" onClick={(e) => e.stopPropagation()}>
        <div className="registerHeader">
          <h1>{title}</h1>
          <button
            className="closeButton"
            onClick={() => {
              handleClose();
            }}
          >
            X
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
