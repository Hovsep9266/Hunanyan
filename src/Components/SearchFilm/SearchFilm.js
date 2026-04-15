import { Link } from "react-router-dom";
import "./SearchFilm.css";
import { useI18n } from "../../i18n/I18nProvider";

export const SearchFilm = ({
  setSelectedCategory,
  films,
  setFilmId,
  setValue,
  setSelectFilm,
}) => {
  const { t } = useI18n();
  const hasFilms = Array.isArray(films) && films.length > 0;
  const visibleFilms = hasFilms ? films.slice(0, 8) : [];

  const handleFilmClick = (filmId) => {
    setSelectFilm(null);
    setFilmId(filmId);
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
          visibleFilms.map((film) => (
            <Link
              to={`/film/${film.id}`}
              key={film.id}
              className="filmItem"
              onClick={() => handleFilmClick(film.id)}
            >
              <img src={film.imgPoster} alt={film.aka} width={40} height={45} />
              <div className="nameActor">
                <span className="filmName">{film.aka}</span>
                <span className="actors">
                  {t("search.actors")} {film.actors}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <div className="searchEmpty">{t("search.noFilms")}</div>
        )}
      </div>
    </div>
  );
};
