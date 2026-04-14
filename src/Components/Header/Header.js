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
  const [showMobileCategories, setShowMobileCategories] = useState(false);
  const [isMobileCategoryMode, setIsMobileCategoryMode] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 992 : false,
  );
  const menuRef = useRef(null);
  const { t } = useI18n();

  const handleCategorySelect = (category) => {
    setSelectedCategory(category.id);
    setFindId(category.id);
    setGenreName(category.name);
    if (isMobileCategoryMode) {
      setShowMobileCategories(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 992;
      setIsMobileCategoryMode(mobile);
      if (!mobile) {
        setShowMobileCategories(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!location.pathname.startsWith("/category/")) {
      setSelectedCategory(null);
    }
  }, [location.pathname, setSelectedCategory]);

  useEffect(() => {
    if (showMenu) {
      document.body.classList.add("no-scroll");
      setShowMobileCategories(false);
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

          <button
            type="button"
            onClick={() => setShowMobileCategories((prev) => !prev)}
            className="categoryToggleButton mobileOnly"
            aria-label={showMobileCategories ? "Close categories" : "Open categories"}
            aria-expanded={showMobileCategories}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              id="Layer_1"
              data-name="Layer 1"
              viewBox="0 0 24 24"
              width="22"
              height="22"
              className="headerIcon"
            >
              <path d="M24,12c0,1.65-1.35,3-3,3h-5c-1.65,0-3-1.35-3-3s1.35-3,3-3h5c1.65,0,3,1.35,3,3Zm-8-6h5c1.65,0,3-1.35,3-3s-1.35-3-3-3h-5c-1.65,0-3,1.35-3,3s1.35,3,3,3Zm5,12h-5c-1.65,0-3,1.35-3,3s1.35,3,3,3h5c1.65,0,3-1.35,3-3s-1.35-3-3-3Zm-10-1v3c0,2.21-1.79,4-4,4h-3c-2.21,0-4-1.79-4-4v-3c0-2.21,1.79-4,4-4h3c2.21,0,4,1.79,4,4Zm-3,0c0-.55-.45-1-1-1h-3c-.55,0-1,.45-1,1v3c0,.55,.45,1,1,1h3c.55,0,1-.45,1-1v-3Zm3-13v3c0,2.21-1.79,4-4,4h-3C1.79,11,0,9.21,0,7v-3C0,1.79,1.79,0,4,0h3c2.21,0,4,1.79,4,4Zm-3,0c0-.55-.45-1-1-1h-3c-.55,0-1,.45-1,1v3c0,.55,.45,1,1,1h3c.55,0,1-.45,1-1v-3Z" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => setShowMenu((prev) => !prev)}
            className="menuButton"
            aria-label={showMenu ? "Close menu" : "Open menu"}
            aria-expanded={showMenu}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              id="Outline"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              className="headerIcon"
            >
              <rect y="11" width="24" height="2" rx="1" />
              <rect y="4" width="24" height="2" rx="1" />
              <rect y="18" width="24" height="2" rx="1" />
            </svg>
          </button>

          {isMobileCategoryMode && showMobileCategories && (
            <div className="mobileCategoryDropdown">
              <div className="mobileCategoryTitle">{t("header.category")}</div>
              <div className="categorys mobileCategorys">
                {selectGenre.map((category) => {
                  const isSelected = selectedCategory === category.id;

                  return (
                    <Link
                      to={`/category/${category.name}`}
                      className={`${isSelected ? "activeGenre" : "genre"}`}
                      key={category.id}
                      onClick={() => handleCategorySelect(category)}
                    >
                      {category.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

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
      <div className={`categoriesBlock ${isMobileCategoryMode ? "hideOnMobile" : ""}`}>
        <h1>{t("header.category")}</h1>

        <div className="categorys">
          {selectGenre.map((category) => {
            const isSelected = selectedCategory === category.id;

            return (
              <Link
                to={`/category/${category.name}`}
                className={`${isSelected ? "activeGenre" : "genre"}`}
                key={category.id}
                onClick={() => handleCategorySelect(category)}
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
