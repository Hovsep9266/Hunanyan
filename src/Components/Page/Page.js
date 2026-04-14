/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from "react";
import { useI18n } from "../../i18n/I18nProvider";
import "./Page.css";
import { GetImgUrl, GetMovieById, GetMoviesByPage } from "./Responce/Respponce";
import Pagination from "./Pagination/Pagination";
import { Loading } from "../Loading/Loading";
import { Link } from "react-router-dom";

function Page({ setValue, setFilmId, setSelectFilm, page, setPage }) {
  const { t } = useI18n();
  const [filmPages, setFilmPages] = useState();

  const getMovie = async (id) => {
    try {
      const movie = await GetMovieById(id);

      setFilmId(movie.data.imdb_id);
    } catch {
      console.log("error");
    }
  };

  const getFilms = async (page) => {
    try {
      const res = await GetMoviesByPage(page);

      if (res?.data.results.length) {
        setFilmPages(res.data.results);
      }
    } catch (error) {
      console.log("errror", error);
    }
  };

  console.log(filmPages);

  useEffect(() => {
    getFilms(page);
    window.scrollTo({ top: 630, behavior: "smooth" });
  }, [page]);

  if (!filmPages) {
    return <Loading />;
  }

  return (
    <div className="Page">
      <h1 className="Watch">{t("common.watchHeading")}</h1>

      <div className="films">
        {filmPages.map((film, i) => (
          <Link
            key={i}
            to={`/film/${film.title}`}
            className="film-item"
            onClick={() => {
              getMovie(film.id);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <img
              src={GetImgUrl(film.poster_path)}
              alt={film.title}
            />
            <div>
              <div className="film-title">{film.title}</div>
              <div className="film-date">{film.release_date}</div>
            </div>
          </Link>
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={500}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
}

export default Page;
