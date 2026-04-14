import { Link } from "react-router-dom";
import "./SearchFilm.css";
import { useI18n } from "../../i18n/I18nProvider";

export const SearchFilm = ({
  setSelectCategory,
  films,
  setFilmId,
  setValue,
  setSelectFilm,
}) => {
  const { t } = useI18n();

  if (!films || films.length === 0) return <h2>{t("search.noFilms")}</h2>;

  const handleFilmClick = (filmId) => {
    setSelectFilm(null);
    setFilmId(filmId);
    setValue("");
    setSelectCategory(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="MainSearch">
      <div className="SearchFilm">
        {films.map((film) => (
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
        ))}
      </div>
    </div>
  );
};
