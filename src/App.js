import React, { useEffect, useState } from "react";
import "./App.css";
import { Header } from "./Components/Header/Header";
import { Film } from "./Components/Film/Film";
import Footer from "./Components/Footer/Footer";
import Page from "./Components/Page/Page";
import { Route, Routes, useParams, useLocation } from "react-router-dom";
import { NotFound } from "./Components/NotFound/NotFound";
import { Category } from "./Components/Category/Category";
import {
  GetGenres,
  GetImgUrl,
  GetMovieById,
  GetMovieByQuery,
  GetTVById,
  getTmdbLanguage,
  normalizeWatchProviders,
  pickYoutubeVideoKey,
} from "./Components/Page/Responce/Respponce";
import Orders from "./Components/Orders/Orders";
import { ActorPage } from "./Components/Actor/ActorPage";
import { TvBrowsePage } from "./Components/Tv/TvBrowsePage";

import { useI18n } from "./i18n/I18nProvider";

function setMetaContent(attr, key, value) {
  if (typeof document === "undefined") return;
  let node = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!node) {
    node = document.createElement("meta");
    node.setAttribute(attr, key);
    document.head.appendChild(node);
  }
  node.setAttribute("content", value);
}

function App() {
  const location = useLocation();
  const { t, lang } = useI18n();
  const apiLang = getTmdbLanguage(lang);
  const DEFAULT_SITE_BG = "https://wallpapercave.com/wp/wp9049784.jpg";
  // const DEFAULT_SITE_BG = "https://wallpapercave.com/wp/wp1913866.jpg";
  const showSiteBackdrop =
    location.pathname.startsWith("/film/") ||
    location.pathname.startsWith("/actor/") ||
    location.pathname.startsWith("/show/");
  const [films, setFilms] = useState([]);
  const [selectFilm, setSelectFilm] = useState(null);
  const [filmId, setFilmId] = useState();
  const [tvId, setTvId] = useState();
  const [value, setValue] = useState("");
  const [page, setPage] = useState(1);
  const [selectGenre, setSetlectGenre] = useState([]);
  const [findId, setFindId] = useState();
  const [genreName, setGenreName] = useState();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [save, setSave] = useState(() => {
    try {
      const raw = localStorage.getItem("savedFilms");
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  });

  useEffect(() => {
    const fetchGenres = async () => {
      const resGenre = await GetGenres(apiLang);
      const genres = resGenre.data?.genres || resGenre.genres;
      if (genres?.length) {
        setSetlectGenre(genres);
      }
    };
    fetchGenres();
  }, [apiLang]);

  useEffect(() => {
    if (!filmId) return;
    const buildFallbackFilm = (id) => ({
      id,
      media: "movie",
      name: t("fallbacks.noTitle"),
      date: t("fallbacks.unknown"),
      description: t("fallbacks.noDescription"),
      genre: t("fallbacks.unknown"),
      image: "",
      trailer: "",
      primaryVideos: [],
      youtubeTrailerKey: "",
      characters: [],
      actorsImage: [],
      ecoder: "",
      production: [],
      director: t("fallbacks.unknown"),
      country: t("fallbacks.unknown"),
      time: t("fallbacks.unknown"),
      similar: [],
      watchProviders: normalizeWatchProviders(null, lang),
    });

    GetMovieById(filmId, apiLang)
      .then((response) => {
        const data = response?.data;

        if (!data || !data.id) {
          setSelectFilm(buildFallbackFilm(filmId));
          return;
        }

        const cast = Array.isArray(data.credits?.cast) ? data.credits.cast : [];
        const director = data.credits?.crew?.find((crew) => crew.job === "Director");
        const similarMovies = Array.isArray(data.similar?.results)
          ? data.similar.results
          : [];

        setSelectFilm({
          id: data.id,
          media: "movie",
          imdbId: data.imdb_id || "",
          name: data.title || t("fallbacks.noTitle"),
          date: data.release_date || t("fallbacks.unknown"),
          description: data.overview || t("fallbacks.noDescription"),
          genre: Array.isArray(data.genres)
            ? data.genres.map((g) => g.name).join(", ")
            : t("fallbacks.unknown"),
          image: data.poster_path ? GetImgUrl(data.poster_path) : "",
          backdrop: data.backdrop_path ? GetImgUrl(data.backdrop_path) : "",
          trailer: "",
          primaryVideos: [],
          youtubeTrailerKey: pickYoutubeVideoKey(data.videos),
          characters: cast.slice(0, 10).map((actor) => actor.character || t("film.unknown")),
          actorsImage: cast.slice(0, 10).map((actor) => ({
            id: actor.id,
            name: {
              nameText: { text: actor.name || t("fallbacks.unknown") },
              primaryImage: {
                url: actor.profile_path ? GetImgUrl(actor.profile_path) : "",
              },
            },
            creditedRoles: {
              edges: [
                {
                  node: {
                    characters: {
                      edges: [
                        {
                          node: {
                            name: actor.character || t("film.unknown"),
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            },
          })),
          ecoder: "",
          production: Array.isArray(data.production_companies)
            ? data.production_companies.map((company) => company.name)
            : [],
          director: director?.name || t("fallbacks.unknown"),
          country:
            data.production_countries?.[0]?.name ||
            data.origin_country?.[0] ||
            t("fallbacks.unknown"),
          time: data.runtime
            ? t("film.runtimeMinutes", { minutes: data.runtime })
            : t("fallbacks.unknown"),
          similar: similarMovies.slice(0, 8).map((movie) => ({
            node: {
              id: movie.id,
              primaryImage: {
                url: movie.poster_path ? GetImgUrl(movie.poster_path) : "",
                caption: { plainText: movie.title || t("fallbacks.noTitle") },
              },
            },
          })),
          watchProviders: normalizeWatchProviders(
            data["watch/providers"],
            lang,
          ),
        });
      })
      .catch((error) => {
        console.error("Error fetching film:", error);
        setSelectFilm(buildFallbackFilm(filmId));
      });
  }, [filmId, t, apiLang, lang]);

  useEffect(() => {
    if (!tvId) return;

    const buildFallbackTv = (id) => ({
      id,
      media: "tv",
      name: t("fallbacks.noTitle"),
      date: t("fallbacks.unknown"),
      description: t("fallbacks.noDescription"),
      genre: t("fallbacks.unknown"),
      image: "",
      trailer: "",
      primaryVideos: [],
      youtubeTrailerKey: "",
      characters: [],
      actorsImage: [],
      ecoder: "",
      production: [],
      director: t("fallbacks.unknown"),
      country: t("fallbacks.unknown"),
      time: t("fallbacks.unknown"),
      similar: [],
      watchProviders: normalizeWatchProviders(null, lang),
    });

    GetTVById(tvId, apiLang)
      .then((response) => {
        const data = response?.data;

        if (!data || !data.id) {
          setSelectFilm(buildFallbackTv(tvId));
          return;
        }

        const cast = Array.isArray(data.credits?.cast) ? data.credits.cast : [];
        const director =
          (Array.isArray(data.created_by) && data.created_by[0]?.name) ||
          data.credits?.crew?.find((c) => c.job === "Executive Producer")
            ?.name ||
          data.credits?.crew?.find((c) => c.job === "Producer")?.name ||
          t("fallbacks.unknown");
        const recs = Array.isArray(data.recommendations?.results)
          ? data.recommendations.results
          : [];
        const epTimes = data.episode_run_time;
        const avgEp =
          epTimes?.length > 0
            ? Math.round(
              epTimes.reduce((a, b) => a + b, 0) / epTimes.length,
            )
            : null;
        const timeCore = avgEp
          ? t("film.runtimeMinutes", { minutes: avgEp })
          : t("fallbacks.unknown");
        const seasonsLabel =
          data.number_of_seasons != null
            ? t("tv.seasonsCount", { n: data.number_of_seasons })
            : "";
        const timeStr = seasonsLabel ? `${timeCore} · ${seasonsLabel}` : timeCore;

        setSelectFilm({
          id: data.id,
          media: "tv",
          imdbId: data.external_ids?.imdb_id || "",
          name: data.name || t("fallbacks.noTitle"),
          date: data.first_air_date || t("fallbacks.unknown"),
          description: data.overview || t("fallbacks.noDescription"),
          genre: Array.isArray(data.genres)
            ? data.genres.map((g) => g.name).join(", ")
            : t("fallbacks.unknown"),
          image: data.poster_path ? GetImgUrl(data.poster_path) : "",
          backdrop: data.backdrop_path ? GetImgUrl(data.backdrop_path) : "",
          trailer: "",
          primaryVideos: [],
          youtubeTrailerKey: pickYoutubeVideoKey(data.videos),
          characters: cast.slice(0, 10).map((a) => a.character || t("film.unknown")),
          actorsImage: cast.slice(0, 10).map((actor) => ({
            id: actor.id,
            name: {
              nameText: { text: actor.name || t("fallbacks.unknown") },
              primaryImage: {
                url: actor.profile_path ? GetImgUrl(actor.profile_path) : "",
              },
            },
            creditedRoles: {
              edges: [
                {
                  node: {
                    characters: {
                      edges: [
                        {
                          node: {
                            name: actor.character || t("film.unknown"),
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            },
          })),
          ecoder: "",
          production: Array.isArray(data.networks)
            ? data.networks.map((n) => n.name)
            : [],
          director,
          country:
            data.production_countries?.[0]?.name ||
            data.origin_country?.[0] ||
            t("fallbacks.unknown"),
          time: timeStr,
          similar: recs.slice(0, 8).map((show) => ({
            node: {
              id: show.id,
              primaryImage: {
                url: show.poster_path ? GetImgUrl(show.poster_path) : "",
                caption: {
                  plainText:
                    show.name || show.title || t("fallbacks.noTitle"),
                },
              },
            },
          })),
          watchProviders: normalizeWatchProviders(
            data["watch/providers"],
            lang,
          ),
        });
      })
      .catch((error) => {
        console.error("Error fetching TV:", error);
        setSelectFilm(buildFallbackTv(tvId));
      });
  }, [tvId, t, apiLang, lang]);

  useEffect(() => {
    if (!value) return;

    let id = setTimeout(() => {
      GetMovieByQuery(value, apiLang)
        .then((data) => {
          const list = data?.results || [];

          const res = list.map((film) => ({
            id: film.id,
            name: film.title,
            year: film.release_date?.slice(0, 4) || "",
            aka: film.title || t("fallbacks.noTitle"),
            imgPoster: film.poster_path ? GetImgUrl(film.poster_path) : "",
            actors: film.original_language || t("fallbacks.unknown"),
          }));

          setFilms(res);
        })
        .catch((error) => {
          console.error("Error fetching film:", error);
          setFilms([]);
        });
    }, 1000);
    console.log("mount", id);

    return () => {
      clearTimeout(id);
    };
  }, [value, t, apiLang]);

  useEffect(() => {
    const isRu = lang === "ru";
    const baseTitle = isRu ? "HH films" : "HH films";
    const pathname = location.pathname;
    let title = baseTitle;
    let description = isRu
      ? "Каталог фильмов, сериалов и аниме: трейлеры, актёры и легальные варианты просмотра."
      : "Movie, TV series, and anime catalog with trailers, cast pages, and legal watch options.";

    if (pathname.startsWith("/tv")) {
      title = isRu ? "Сериалы - HH films" : "TV Series - HH films";
      description = isRu
        ? "Популярные и топовые сериалы с трейлерами и официальными сервисами просмотра."
        : "Popular and top-rated TV series with trailers and official streaming providers.";
    } else if (pathname.startsWith("/anime")) {
      title = isRu ? "Аниме - HH films" : "Anime - HH films";
      description = isRu
        ? "Большой каталог аниме-сериалов и аниме-фильмов с трейлерами и ссылками где смотреть."
        : "Large catalog of anime series and anime movies with trailers and watch provider links.";
    } else if (pathname.startsWith("/film/") || pathname.startsWith("/show/")) {
      const itemName = selectFilm?.name;
      if (itemName) {
        title = `${itemName} - HH films`;
        description = isRu
          ? `${itemName}: трейлер, актёры и легальные сервисы просмотра.`
          : `${itemName}: trailer, cast, and legal watch providers.`;
      } else {
        title = isRu ? "Карточка тайтла - HH films" : "Title page - HH films";
      }
    } else if (pathname.startsWith("/actor/")) {
      title = isRu ? "Актёр - HH films" : "Actor - HH films";
      description = isRu
        ? "Профиль актёра и фильмы с его участием."
        : "Actor profile and movies featuring this cast member.";
    }

    document.title = title;
    setMetaContent("name", "description", description);
    setMetaContent("property", "og:title", title);
    setMetaContent("property", "og:description", description);
    setMetaContent("property", "og:type", "website");
    setMetaContent(
      "property",
      "og:url",
      `https://hunanyans-films.netlify.app${pathname}`,
    );
  }, [location.pathname, lang, selectFilm?.name]);

  function FilmRoute() {
    const { filmId: paramId } = useParams();

    useEffect(() => {
      if (paramId) {
        setFilmId(paramId);
        setTvId(undefined);
      }
    }, [paramId]);

    return (
      <Film
        setSelectFilm={setSelectFilm}
        selectFilm={selectFilm}
        setFilmId={setFilmId}
        setTvId={setTvId}
        setValue={setValue}
        setSave={setSave}
        save={save}
      />
    );
  }

  function TvShowRoute() {
    const { tvId: paramId } = useParams();

    useEffect(() => {
      if (paramId) {
        setTvId(paramId);
        setFilmId(undefined);
      }
    }, [paramId]);

    return (
      <Film
        setSelectFilm={setSelectFilm}
        selectFilm={selectFilm}
        setFilmId={setFilmId}
        setTvId={setTvId}
        setValue={setValue}
        setSave={setSave}
        save={save}
      />
    );
  }

  useEffect(() => {
    try {
      localStorage.setItem("savedFilms", JSON.stringify(save));
    } catch (err) { }
  }, [save]);

  const isTitlePage =
    location.pathname.startsWith("/film/") || location.pathname.startsWith("/show/");
  const activeTitleBackground =
    (selectFilm?.backdrop || selectFilm?.image || "").replace("/w500", "/original");
  const appBackgroundImage =
    isTitlePage && activeTitleBackground
      ? `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)), url("${activeTitleBackground}")`
      : `url("${DEFAULT_SITE_BG}")`;

  return (
    <div className="App" style={{ backgroundImage: appBackgroundImage }}>
      <div
        className={
          showSiteBackdrop
            ? "selectFilm selectFilm--backdropClear"
            : "selectFilm"
        }
      >
        <Header
          setSelectFilm={setSelectFilm}
          setFindId={setFindId}
          selectGenre={selectGenre}
          films={films}
          setValue={setValue}
          setFilmId={setFilmId}
          setTvId={setTvId}
          value={value}
          setGenreName={setGenreName}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <Routes>
          <Route
            path="/"
            element={
              <Page
                setValue={setValue}
                setFilmId={setFilmId}
                setTvId={setTvId}
                setSelectFilm={setSelectFilm}
                page={page}
                setPage={setPage}
              />
            }
          />

          <Route
            path="/actor/:actorId"
            element={
              <ActorPage
                setFilmId={setFilmId}
                setTvId={setTvId}
                setSelectFilm={setSelectFilm}
              />
            }
          />

          <Route
            path="/tv"
            element={
              <TvBrowsePage
                listType="popular"
                setFilmId={setFilmId}
                setTvId={setTvId}
                setSelectFilm={setSelectFilm}
              />
            }
          />

          <Route
            path="/anime"
            element={
              <TvBrowsePage
                listType="anime"
                setFilmId={setFilmId}
                setTvId={setTvId}
                setSelectFilm={setSelectFilm}
              />
            }
          />

          <Route path="/show/:tvId" element={<TvShowRoute />} />

          <Route
            path="/:page"
            element={
              <Page
                setValue={setValue}
                setFilmId={setFilmId}
                setTvId={setTvId}
                setSelectFilm={setSelectFilm}
                page={page}
                setPage={setPage}
              />
            }
          />

          <Route
            path="/category/:category"
            element={
              <Category
                setSelectedCategory={setSelectedCategory}
                findId={findId}
                setFilmId={setFilmId}
                setTvId={setTvId}
                genreName={genreName}
              />
            }
          />

          <Route path="film/:filmId" element={<FilmRoute />} />
          <Route
            path="/orders"
            element={
              <Orders
                save={save}
                setSave={setSave}
                setFilmId={setFilmId}
                setTvId={setTvId}
              />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
}

export default App;
