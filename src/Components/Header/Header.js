import "./Header.css";
import { SearchFilm } from "../SearchFilm/SearchFilm";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useI18n } from "../../i18n/I18nProvider";

export const Header = ({
  films,
  value,
  setValue,
  setFilmId,
  setTvId,
  selectGenre,
  setFindId,
  setGenreName,
  selectedCategory,
  setSelectedCategory,
  setSelectFilm,
}) => {
  const location = useLocation();

  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showMobileCategories, setShowMobileCategories] = useState(false);
  const [isMobileCategoryMode, setIsMobileCategoryMode] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 992 : false,
  );
  const langWrapRef = useRef(null);
  const { t, lang, setLang } = useI18n();

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
    if (!showLangMenu) return;
    const close = (e) => {
      if (langWrapRef.current && !langWrapRef.current.contains(e.target)) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [showLangMenu]);

  const clearDetailState = () => {
    setFilmId(false);
    setTvId?.(undefined);
    setSelectFilm(null);
  };

  return (
    <header className="header">
      <div className="headerTop">
        <Link className="headerLeft" to="/" onClick={clearDetailState}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="180"
            height="180"
            viewBox="0 0 180 180"
            role="img"
            aria-label="HH-films logo"
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
                fontSize="40"
                fill="url(#neon)"
              >
                HH-films
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
        <nav className="headerMediaNav" aria-label={t("header.mediaNavAria")}>
          <Link
            to="/"
            className={
              location.pathname === "/" || /^\/\d+$/.test(location.pathname)
                ? "headerMediaNav-link is-active"
                : "headerMediaNav-link"
            }
            onClick={clearDetailState}
          >
            {t("header.navMovies")}
          </Link>
          <Link
            to="/tv"
            className={
              location.pathname === "/tv"
                ? "headerMediaNav-link is-active"
                : "headerMediaNav-link"
            }
            onClick={clearDetailState}
          >
            {t("header.navTv")}
          </Link>
          <Link
            to="/anime"
            className={
              location.pathname === "/anime"
                ? "headerMediaNav-link is-active"
                : "headerMediaNav-link"
            }
            onClick={clearDetailState}
          >
            {t("header.navAnime")}
          </Link>
        </nav>
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
                setTvId={setTvId}
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

          <div className="headerLangWrap" ref={langWrapRef}>
            <button
              type="button"
              className="headerLangButton"
              onClick={() => setShowLangMenu((prev) => !prev)}
              aria-label={t("header.langSelectAria")}
              aria-expanded={showLangMenu}
              aria-haspopup="listbox"
            >
              <span className="headerLangCode">{String(lang).toUpperCase()}</span>
              <span className="headerLangCaret" aria-hidden>
                ▾
              </span>
            </button>
            {showLangMenu && (
              <div className="headerLangMenu" role="listbox" aria-label={t("header.langSelectAria")}>
                <button
                  type="button"
                  role="option"
                  aria-selected={lang === "en"}
                  className={`headerLangOption ${lang === "en" ? "is-active" : ""}`}
                  onClick={() => {
                    setLang("en");
                    setShowLangMenu(false);
                  }}
                >
                  EN
                </button>
                <button
                  type="button"
                  role="option"
                  aria-selected={lang === "ru"}
                  className={`headerLangOption ${lang === "ru" ? "is-active" : ""}`}
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
    </header>
  );
};
