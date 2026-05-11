import { Link } from "react-router-dom";
import "./SearchFilm.css";
import { useI18n } from "../../i18n/I18nProvider";

const FALLBACK_POSTER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="78" viewBox="0 0 56 78">
      <rect width="56" height="78" fill="#2c2c2c"/>
      <path d="M12 58l9-12 8 10 6-8 9 10" stroke="#9b9b9b" stroke-width="2" fill="none"/>
      <circle cx="21" cy="27" r="5" fill="#9b9b9b"/>
      <text x="50%" y="70" dominant-baseline="middle" text-anchor="middle" fill="#cfcfcf" font-size="8" font-family="Arial, sans-serif">No Poster</text>
    </svg>`
  );

export const SearchFilm = ({
  setSelectedCategory,
  films,
  setFilmId,
  setTvId,
  setValue,
  setSelectFilm,
}) => {
  const { t } = useI18n();
  const hasFilms = Array.isArray(films) && films.length > 0;
  const visibleFilms = hasFilms ? films.slice(0, 8) : [];

  const handleFilmClick = (filmId) => {
    setSelectFilm(null);
    setFilmId(filmId);
    setTvId?.(undefined);
    setValue("");
    if (typeof setSelectedCategory === "function") {
      setSelectedCategory(null);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="MainSearch">
      <div className="SearchFilm">
        {hasFilms ? (
          visibleFilms.map((film) => {
            const filmName = film.aka || film.name || film.title || "Untitled";
            const posterSrc =
              typeof film.imgPoster === "string" && film.imgPoster.trim() ? film.imgPoster : FALLBACK_POSTER;

            return (
              <Link to={`/film/${film.id}`} key={film.id} className="filmItem" onClick={() => handleFilmClick(film.id)}>
                <img
                  src={posterSrc}
                  alt=""
                  className="filmPoster"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_POSTER;
                  }}
                />
                <div className="nameActor">
                  <span className="filmName">{filmName}</span>
                  <span className="actors">
                    {t("search.actors")} {film.actors || "-"}
                  </span>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="searchEmpty">{t("search.noFilms")}</div>
        )}
      </div>
    </div>
  );
};
