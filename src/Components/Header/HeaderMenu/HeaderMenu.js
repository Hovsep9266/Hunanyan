import { Link } from "react-router-dom";
import "./HeaderMenu.css";
import { useI18n } from "../../../i18n/I18nProvider";
import { useState } from "react";

const HeaderMenu = ({
  showMenu,
  menuRef,
  setShowMenu,
  setShowModal,
  setShowProfile,
  userAccount,
}) => {
  const { t, lang, setLang } = useI18n();
  const [showLangMenu, setShowLangMenu] = useState(false);
  return (
    <div
      ref={menuRef}
      className={`headerMenu ${showMenu ? "show" : ""}`}
      tabIndex={-1}
      role="dialog"
      aria-modal={showMenu}
    >
      <div className="accountMenu">
        <svg
          onClick={() => setShowMenu?.(false)}
          xmlns="http://www.w3.org/2000/svg"
          width="180"
          height="180"
          viewBox="0 0 300 300"
          role="img"
          aria-label="HH logo"
        >
          <defs>
            <linearGradient id="neon" x1="0" x2="1">
              <stop offset="0" stopColor="#ffffffff" />
              <stop offset="1" stopColor="#000000ff" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g filter="url(#glow)">
            <text
              x="25%"
              y="10%"
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="Montserrat, Inter, sans-serif"
              fontWeight="800"
              fontStyle="italic"
              fontSize="72"
              fill="url(#neon)"
            >
              HH
            </text>
          </g>

          <text
            x="25%"
            y="25%"
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="Inter, sans-serif"
            fontStyle="italic"
            fontWeight="500"
            fontSize="12"
            fill="#cbd5e1"
            opacity="0.9"
          >
            {t("header.yourFavorite")}
          </text>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          id="Layer_1"
          data-name="Layer 1"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          className="headerMenuIcon headerMenuCloseIcon"
          onClick={() => setShowMenu?.(false)}
          role="button"
          tabIndex={0}
          aria-label="Close menu"
        >
          <path d="M22.853,1.491c-.282-.475-.894-.631-1.37-.353-.212,.126-4.796,2.857-9.483,7.408C7.313,3.995,2.729,1.264,2.517,1.138c-.476-.279-1.089-.122-1.37,.353-.281,.476-.124,1.089,.352,1.37,.05,.029,4.562,2.717,9.093,7.107-.014,.014-.028,.029-.041,.043C5.421,15.421,2.274,21.283,2.143,21.53c-.259,.487-.075,1.093,.413,1.353,.149,.08,.311,.117,.469,.117,.358,0,.704-.192,.884-.53,.031-.058,3.147-5.865,8.091-11.079,4.935,5.205,8.061,11.021,8.091,11.079,.18,.338,.526,.53,.884,.53,.159,0,.319-.038,.469-.117,.487-.26,.672-.865,.413-1.353-.131-.247-3.278-6.108-8.408-11.519-.014-.014-.027-.029-.041-.043,4.525-4.383,9.043-7.078,9.093-7.108,.476-.281,.633-.894,.352-1.369Z" />
        </svg>
      </div>

      <svg
        onClick={() => {
          setShowMenu?.(false);
          setShowModal(true);
        }}
        xmlns="http://www.w3.org/2000/svg"
        id="Layer_1"
        data-name="Layer 1"
        viewBox="0 0 30 30"
        width="50"
        height="50"
        className="headerMenuIcon headerMenuProfileIcon"
      >
        <path d="m16,23.314c-1.252.444-2.598.686-4,.686s-2.748-.242-4-.686v-2.314c0-2.206,1.794-4,4-4s4,1.794,4,4v2.314ZM12,7c-1.103,0-2,.897-2,2s.897,2,2,2,2-.897,2-2-.897-2-2-2Zm12,5c0,4.433-2.416,8.311-6,10.389v-1.389c0-3.309-2.691-6-6-6s-6,2.691-6,6v1.389C2.416,20.311,0,16.433,0,12,0,5.383,5.383,0,12,0s12,5.383,12,12Zm-8-3c0-2.206-1.794-4-4-4s-4,1.794-4,4,1.794,4,4,4,4-1.794,4-4Z" />
      </svg>

      <div>
        {userAccount ? (
          <div className="account">
            {t("header.welcome", { name: userAccount.name })}
            <br /> {userAccount.email}{" "}
          </div>
        ) : (
          t("header.notLoggedIn")
        )}
      </div>
      {/* <button
            className="registerLink"
            onClick={() => setShowRegister(true)}
          > */}
      <button
        className="langSelect"
        onClick={() => {
          setShowMenu(false);
          setShowProfile?.(true);
        }}
      >
        {t("header.profile")}
      </button>
      <div className="registerLink">
        <Link
          to="/orders"
          onClick={() => {
            window.scrollTo({ top: 630, behavior: "smooth" });
            setShowMenu(false);
          }}
          className="ordersLink"
        >
          {t("header.myOrders")}
        </Link>
      </div>
      <div className="langDropdown">
        <button
          type="button"
          className="langSelect"
          onClick={() => setShowLangMenu((prev) => !prev)}
          aria-expanded={showLangMenu}
          aria-label="Language select"
        >
          {String(lang).toUpperCase()}
          <span className="langArrow">▾</span>
        </button>

        {showLangMenu && (
          <div className="langMenu">
            <button
              type="button"
              className={`langOption ${lang === "en" ? "activeLang" : ""}`}
              onClick={() => {
                setLang("en");
                setShowLangMenu(false);
              }}
            >
              EN
            </button>
            <button
              type="button"
              className={`langOption ${lang === "ru" ? "activeLang" : ""}`}
              onClick={() => {
                setLang("ru");
                setShowLangMenu(false);
              }}
            >
              RU
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderMenu;
