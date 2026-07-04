/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from "react";
import { useI18n } from "../../i18n/I18nProvider";
import "./Page.css";
import {
  GetImgUrl,
  GetMoviesByPage,
  getTmdbLanguage,
} from "./Responce/Respponce";
import Pagination from "./Pagination/Pagination";
import { Loading } from "../Loading/Loading";
import { Link } from "react-router-dom";

function Page({ setValue, setFilmId, setTvId, setSelectFilm, page, setPage }) {
  const { t, lang } = useI18n();
  const apiLang = getTmdbLanguage(lang);
  const [filmPages, setFilmPages] = useState();

  console.log(filmPages);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await GetMoviesByPage(page, apiLang);
        if (cancelled) return;
        if (res?.data.results.length) {
          setFilmPages(res.data.results);
        }
      } catch (error) {
        if (!cancelled) console.log("errror", error);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [page, apiLang]);

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
            to={`/film/${film.id}`}
            className="film-item"
            onClick={() => {
              setFilmId(film.id);
              setTvId?.(undefined);
              setSelectFilm(null);
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
