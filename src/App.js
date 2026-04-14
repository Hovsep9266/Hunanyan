import React, { useEffect, useState } from "react";
import "./App.css";
import { Header } from "./Components/Header/Header";
import { Film } from "./Components/Film/Film";
import Footer from "./Components/Footer/Footer";
import Page from "./Components/Page/Page";
import { Route, Routes, useParams } from "react-router-dom";
import { NotFound } from "./Components/NotFound/NotFound";
import { Category } from "./Components/Category/Category";
import { GetGenres } from "./Components/Page/Responce/Respponce";
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

    fetch(`https://imdb.iamidiotareyoutoo.com/search?tt=${filmId}`)
      .then((response) => response.json())
      .then((data) => {
        if (!data.short) {
          console.error("No film data found", data);
          return;
        }

        setSelectFilm({
          name: data.short.name || t("fallbacks.noTitle"),
          date: data.short.datePublished || t("fallbacks.unknown"),
          description:
            data.top.primaryVideos.edges?.map((des) => {
              return des.node.description.value;
            }) || t("fallbacks.noDescription"),
          genre: Array.isArray(data.short.genre)
            ? data.short.genre.join(", ")
            : data.short.genre || t("fallbacks.unknown"),
          image: data.short.image,
          trailer: data.short.trailer?.embedUrl || "",
          primaryVideos: data.top.primaryVideos.edges?.map((play) => {
            return play.node.playbackURLs?.map((vid) => {
              return vid.url;
            });
          }),
          characters: data.main.castV2[0].credits?.map((role) => {
            return role.creditRoles?.edges[0].node.characters.edges?.map(
              (edg) => {
                return edg.node.name;
              },
            );
          }),
          actorsImage: data.main.castV2[0].credits,
          ecoder: data.top.primaryVideos.edges?.map((url) => {
            return url.node.playbackURLs[0].url;
          }),
          production: data.main.production.edges?.map((company) => {
            return company.node.company.companyText.text;
          }),
          director:
            data.top.principalCreditsV2[0].credits[0].name.nameText.text,
          country: data.top.releaseDate.country.text,
          time: data.top.runtime?.displayableProperty.value.plainText,
          similar: data.main.relatedInterests.edges,
        });
      })
      .catch((error) => {
        console.error("Error fetching film:", error);
      });
  }, [filmId, t]);

  useEffect(() => {
    if (!value) return;

    let id = setTimeout(() => {
      fetch(`https://imdb.iamidiotareyoutoo.com/search?q=${value}`)
        .then((response) => response.json())
        .then((data) => {
          const list = data.description || data.d || data.results || [];

          const res = list.map((film) => ({
            id: film["#IMDB_ID"] || film.id,
            url: film["#IMDB_URL"] || film.url,
            name: film["#NAME"] || film.name,
            year: film["#YEAR"] || film.year,
            rank: film["#RANK"] || film.rank,
            aka: film["#AKA"] || film.title,
            imgPoster: film["#IMG_POSTER"] || film.image,
            actors: film["#ACTORS"] || film.actors,
          }));

          setFilms(res);
        })
        .catch((error) => {
          console.error("Error fetching film:", error);
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
    getVideo(filmId);
  }, [filmId]);

  function FilmRoute() {
    const { filmId: paramId } = useParams();

    useEffect(() => {
      if (paramId && String(paramId).startsWith("tt")) {
        setFilmId(paramId);
      }
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
