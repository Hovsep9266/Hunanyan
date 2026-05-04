import { useState, useEffect } from "react";
import { useI18n } from "../../i18n/I18nProvider";
import "./Category.css";
import {
  GetMoviesByGenre,
  getTmdbLanguage,
} from "../Page/Responce/Respponce";
import { Link } from "react-router-dom";

export const Category = ({ findId, setFilmId, setTvId, genreName }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t, lang } = useI18n();
  const apiLang = getTmdbLanguage(lang);

  const loadMovies = async () => {
    if (!findId) return;

    try {
      setLoading(true);
      const { data } = await GetMoviesByGenre(findId, 1, apiLang);
      setMovies(data.results);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [findId, apiLang]);

  if (!findId) return <div>{t("category.select")}</div>;
  if (loading) return <div className="loading">{t("common.loading")}</div>;

  return (
    <div className="CategoryMovies">
      <h1>{t("category.moviesIn", { genre: genreName })}</h1>

      <div className="films">
        {movies.map((film) => (
          <Link
            to={`/film/${film.id}`}
            key={film.id}
            className="film-item"
            onClick={() => {
              window.scrollTo({ top: 630, behavior: "smooth" });
              setFilmId(film.id);
              setTvId?.(undefined);
            }}
          >
            <img
              src={`https://image.tmdb.org/t/p/w300${film.poster_path}`}
              alt={film.title}
            />
            <p>{film.title}</p>
            <span>{film.release_date}</span>
          </Link>
        ))}
      </div>
      <Link
        className="backSvg"
        to="/"
        onClick={() => {
          setFilmId(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <svg
          className="back"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M22.535,8.46A4.965,4.965,0,0,0,19,7H2.8L7.1,2.7A1,1,0,0,0,5.682,1.288L.732,6.237a2.5,2.5,0,0,0,0,3.535l4.95,4.951A1,1,0,1,0,7.1,13.309L2.788,9H19a3,3,0,0,1,3,3v7a3,3,0,0,1-3,3H5a1,1,0,0,0,0,2H19a5.006,5.006,0,0,0,5-5V12A4.969,4.969,0,0,0,22.535,8.46Z" />
        </svg>
      </Link>
    </div>
  );
};
