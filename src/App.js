import React, { useEffect, useState } from "react";
import "./App.css";
import { Header } from "./Components/Header/Header";
import { Film } from "./Components/Film/Film";
import Footer from "./Components/Footer/Footer";
import Page from "./Components/Page/Page";
import { Route, Routes, useParams } from "react-router-dom";
import { NotFound } from "./Components/NotFound/NotFound";
import { Category } from "./Components/Category/Category";
import {
  GetGenres,
  GetImgUrl,
  GetMovieById,
  GetMovieByQuery,
} from "./Components/Page/Responce/Respponce";
import Orders from "./Components/Orders/Orders";

import { useI18n } from "./i18n/I18nProvider";

function App() {
  const { t } = useI18n();
  const [films, setFilms] = useState([]);
  const [selectFilm, setSelectFilm] = useState(null);
  const [filmId, setFilmId] = useState();
  const [value, setValue] = useState("");
  const [page, setPage] = useState(1);
  const [selectGenre, setSetlectGenre] = useState([]);
  const [findId, setFindId] = useState();
  const [trailer, setTrailer] = useState("");
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

  const buildFallbackFilm = (id) => ({
    id,
    name: t("fallbacks.noTitle"),
    date: t("fallbacks.unknown"),
    description: t("fallbacks.noDescription"),
    genre: t("fallbacks.unknown"),
    image: "",
    trailer: "",
    primaryVideos: [],
    characters: [],
    actorsImage: [],
    ecoder: "",
    production: [],
    director: t("fallbacks.unknown"),
    country: t("fallbacks.unknown"),
    time: t("fallbacks.unknown"),
    similar: [],
  });

  useEffect(() => {
    const fetchGenres = async () => {
      const resGenre = await GetGenres();
      const genres = resGenre.data?.genres || resGenre.genres;
      if (genres?.length) {
        setSetlectGenre(genres);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    if (!filmId) return;

    GetMovieById(filmId)
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
          imdbId: data.imdb_id || "",
          name: data.title || t("fallbacks.noTitle"),
          date: data.release_date || t("fallbacks.unknown"),
          description: data.overview || t("fallbacks.noDescription"),
          genre: Array.isArray(data.genres)
            ? data.genres.map((g) => g.name).join(", ")
            : t("fallbacks.unknown"),
          image: data.poster_path ? GetImgUrl(data.poster_path) : "",
          trailer: "",
          primaryVideos: [],
          characters: cast.slice(0, 10).map((actor) => actor.character || t("film.unknown")),
          actorsImage: cast.slice(0, 10).map((actor) => ({
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
          time: data.runtime ? `${data.runtime} min` : t("fallbacks.unknown"),
          similar: similarMovies.slice(0, 8).map((movie) => ({
            node: {
              id: movie.id,
              primaryImage: {
                url: movie.poster_path ? GetImgUrl(movie.poster_path) : "",
                caption: { plainText: movie.title || t("fallbacks.noTitle") },
              },
            },
          })),
        });
      })
      .catch((error) => {
        console.error("Error fetching film:", error);
        setSelectFilm(buildFallbackFilm(filmId));
      });
  }, [filmId, t]);

  useEffect(() => {
    if (!value) return;

    let id = setTimeout(() => {
      GetMovieByQuery(value)
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
  }, [value]);

  const getVideo = async (id) => {
    if (!id) return;
    try {
      const response = await fetch(
        `https://api.kinocheck.com/movies?imdb_id=${id}&language=de&categories=Trailer,-Clip`,
      );
      const video = await response.json();

      if (video.data?.trailer?.youtube_video_id) {
        setTrailer(video.data.trailer.youtube_video_id);
      } else {
        setTrailer("");
      }
    } catch (error) {
      console.log("Error fetching video:", error);
      setTrailer("");
    }
  };

  useEffect(() => {
    getVideo(selectFilm?.imdbId);
  }, [selectFilm?.imdbId]);

  function FilmRoute() {
    const { filmId: paramId } = useParams();

    useEffect(() => {
      if (paramId) setFilmId(paramId);
    }, [paramId]);

    return (
      <Film
        trailer={trailer}
        setSelectFilm={setSelectFilm}
        selectFilm={selectFilm}
        setFilmId={setFilmId}
        setValue={setValue}
        setSave={setSave}
        save={save}
      />
    );
  }

  useEffect(() => {
    try {
      localStorage.setItem("savedFilms", JSON.stringify(save));
    } catch (err) {}
  }, [save]);

  return (
    <div className="App">
      <div className="selectFilm">
        <Header
          setSelectFilm={setSelectFilm}
          setFindId={setFindId}
          selectGenre={selectGenre}
          films={films}
          setValue={setValue}
          setFilmId={setFilmId}
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
                setSelectFilm={setSelectFilm}
                page={page}
                setPage={setPage}
              />
            }
          />

          <Route
            path="/:page"
            element={
              <Page
                setValue={setValue}
                setFilmId={setFilmId}
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
                genreName={genreName}
              />
            }
          />

          <Route path="film/:filmId" element={<FilmRoute />} />
          <Route
            path="/orders"
            element={
              <Orders save={save} setSave={setSave} setFilmId={setFilmId} />
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
