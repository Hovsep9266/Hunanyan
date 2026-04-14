import "./Header.css";
import { SearchFilm } from "../SearchFilm/SearchFilm";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useI18n } from "../../i18n/I18nProvider";
import { Register } from "../Register/Register";
import HeaderMenu from "./HeaderMenu/HeaderMenu";
import Profile from "./Profile/Profile";

export const Header = ({
  films,
  value,
  setValue,
  setFilmId,
  selectGenre,
  setFindId,
  setGenreName,
  selectedCategory,
  setSelectedCategory,
  setSelectFilm,
}) => {
  const [showRegister, setShowRegister] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userAccount, setUserAccount] = useState(null);
  const location = useLocation();

  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const { t } = useI18n();

  useEffect(() => {
    if (!location.pathname.startsWith("/category/")) {
      setSelectedCategory(null);
    }
  }, [location.pathname, setSelectedCategory]);

  useEffect(() => {
    if (showMenu) {
      document.body.classList.add("no-scroll");
      setTimeout(() => menuRef.current?.focus(), 60);
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [showMenu]);

  return (
    <header className="header">
      <div className="headerTop">
        <Link className="headerLeft" to="/">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="180"
            height="180"
            viewBox="0 0 180 180"
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
                x="50%"
                y="28%"
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
              x="50%"
              y="50%"
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
        </Link>
        <div className="orderInput">
          {/* </button> */}
          <div className="SearchMovie">
            <input
              className="search"
              type="search"
              onChange={(e) => {
                setValue(e.target.value);
                setFilmId(false);
              }}
              placeholder={t("header.searchPlaceholder")}
            />

            {value && (
              <SearchFilm
                setSelectFilm={setSelectFilm}
                setSelectedCategory={setSelectedCategory}
                films={films}
                setFilmId={setFilmId}
                setValue={setValue}
              />
            )}
          </div>

          <svg
            onClick={() => setShowMenu((prev) => !prev)}
            xmlns="http://www.w3.org/2000/svg"
            id="Outline"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            className="menuSvg"
            aria-label={showMenu ? "Close menu" : "Open menu"}
            aria-expanded={showMenu}
            role="button"
            tabIndex={0}
          >
            <rect y="11" width="24" height="2" rx="1" />
            <rect y="4" width="24" height="2" rx="1" />
            <rect y="18" width="24" height="2" rx="1" />
          </svg>

          {showMenu && (
            <>
              <div
                className={`headerBackdrop ${showMenu ? "show" : ""}`}
                onClick={() => setShowMenu(false)}
                aria-hidden="true"
              />
              <HeaderMenu
                showMenu={showMenu}
                menuRef={menuRef}
                setShowMenu={setShowMenu}
                setShowModal={setShowModal}
                setShowProfile={setShowProfile}
                userAccount={userAccount}
              />
            </>
          )}
        </div>
      </div>
      <div>
        <h1>{t("header.category")}</h1>

        <div className="categorys">
          {selectGenre.map((category) => {
            const isSelected = selectedCategory === category.id;

            return (
              <Link
                to={`/category/${category.name}`}
                className={`${isSelected ? "activeGenre" : "genre"}`}
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setFindId(category.id);
                  setGenreName(category.name);
                }}
              >
                {category.name}
              </Link>
            );
          })}
        </div>
      </div>
      <hr />
      {showModal && (
        <Register
          setShowModal={setShowModal}
          className="registerModal"
          setUserAccount={setUserAccount}
          userAccount={userAccount}
          setShowRegister={setShowRegister}
          showRegister={showRegister}
        />
      )}
      {showProfile && (
        <Profile
          userAccount={userAccount}
          setUserAccount={setUserAccount}
          setShowProfile={setShowProfile}
        />
      )}
    </header>
  );
};
