import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../i18n/I18nProvider";
import {
  GetDiscoverAnimeMovies,
  GetDiscoverAnimeTV,
  GetImgUrl,
  GetTVPopular,
  GetTVTopRated,
  getTmdbLanguage,
} from "../Page/Responce/Respponce";
import Pagination from "../Page/Pagination/Pagination";
import { Loading } from "../Loading/Loading";
import "./TvBrowsePage.css";

export function TvBrowsePage({ listType, setFilmId, setTvId, setSelectFilm }) {
  const { t, lang } = useI18n();
  const apiLang = getTmdbLanguage(lang);
  const [items, setItems] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(500);

  useEffect(() => {
    try {
      sessionStorage.setItem(
        "hhTvBrowseBack",
        listType === "anime" ? "/anime" : "/tv",
      );
    } catch (e) {
      // ignore
    }
  }, [listType]);

  useEffect(() => {
    let cancelled = false;

    const mergeUniqueByMediaAndId = (groups) => {
      const map = new Map();
      groups.flat().forEach((item) => {
        if (!item?.id) return;
        const media = item.media_type || "tv";
        const key = `${media}:${item.id}`;
        if (!map.has(key)) map.set(key, item);
      });
      return [...map.values()];
    };

    const load = async () => {
      try {
        const resList =
          listType === "anime"
            ? await Promise.all([
                GetDiscoverAnimeTV(page, apiLang),
                GetDiscoverAnimeMovies(page, apiLang),
              ])
            : await Promise.all([
                GetTVPopular(page, apiLang),
                GetTVTopRated(page, apiLang),
              ]);

        if (cancelled) return;

        const payloads = resList.map((r) => r?.data || {});
        const rows = mergeUniqueByMediaAndId(
          payloads.map((p) =>
            Array.isArray(p.results)
              ? p.results.map((x) => ({
                  ...x,
                  media_type:
                    x.media_type || (x.title ? "movie" : "tv"),
                }))
              : [],
          ),
        );

        if (Array.isArray(rows) && rows.length) {
          setItems(rows);
          const maxPages = Math.max(
            ...payloads.map((p) => p.total_pages || 1),
            1,
          );
          setTotalPages(Math.min(maxPages, 500));
        } else {
          setItems([]);
        }
      } catch (e) {
        if (!cancelled) {
          console.error(e);
          setItems([]);
        }
      }
    };

    load();
    window.scrollTo({ top: 630, behavior: "smooth" });
    return () => {
      cancelled = true;
    };
  }, [page, listType, apiLang]);

  if (!items) {
    return <Loading />;
  }

  const heading =
    listType === "anime" ? t("tv.animeHeading") : t("tv.seriesHeading");

  return (
    <div className="TvBrowsePage">
      <h1 className="TvBrowsePage-title">{heading}</h1>

      <div className="TvBrowsePage-grid">
        {items.map((show) => (
          <Link
            key={`${show.media_type || "tv"}-${show.id}`}
            to={show.media_type === "movie" ? `/film/${show.id}` : `/show/${show.id}`}
            className="TvBrowsePage-card"
            onClick={() => {
              setSelectFilm(null);
              if (show.media_type === "movie") {
                setTvId(undefined);
                setFilmId(String(show.id));
              } else {
                setFilmId(false);
                setTvId(String(show.id));
              }
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <img
              src={
                show.poster_path ? GetImgUrl(show.poster_path) : ""
              }
              alt={show.name || show.title || ""}
            />
            <div>
              <div className="TvBrowsePage-name">
                {show.name || show.title || t("fallbacks.noTitle")}
              </div>
              <div className="TvBrowsePage-date">
                {show.first_air_date || show.release_date || ""}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
}
