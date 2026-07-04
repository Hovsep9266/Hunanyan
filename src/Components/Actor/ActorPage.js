import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useI18n } from "../../i18n/I18nProvider";
import {
  GetImgUrl,
  GetPersonDetails,
  GetPersonMovieCredits,
  getTmdbLanguage,
} from "../Page/Responce/Respponce";
import { Loading } from "../Loading/Loading";
import "./ActorPage.css";

function normalizeCastMovies(cast) {
  if (!Array.isArray(cast)) return [];
  const byId = new Map();
  for (const row of cast) {
    if (!row?.id) continue;
    if (!byId.has(row.id)) {
      byId.set(row.id, row);
    }
  }
  const list = [...byId.values()];
  list.sort((a, b) => {
    const da = a.release_date || "";
    const db = b.release_date || "";
    if (!da && !db) return 0;
    if (!da) return 1;
    if (!db) return -1;
    return db.localeCompare(da);
  });
  return list;
}

export const ActorPage = ({ setFilmId, setTvId, setSelectFilm }) => {
  const { actorId } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const apiLang = getTmdbLanguage(lang);
  const [person, setPerson] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!actorId) return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [detailsRes, creditsRes] = await Promise.all([
          GetPersonDetails(actorId, apiLang),
          GetPersonMovieCredits(actorId, apiLang),
        ]);
        if (cancelled) return;
        setPerson(detailsRes.data || null);
        setMovies(normalizeCastMovies(creditsRes.data?.cast));
      } catch (e) {
        if (!cancelled) {
          console.error(e);
          setError(e);
          setPerson(null);
          setMovies([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [actorId, apiLang]);

  const goBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="ActorPage">
        <Loading />
      </div>
    );
  }

  if (error || !person) {
    return (
      <div className="ActorPage ActorPage--empty">
        <p>{t("actor.notFound")}</p>
        <Link className="ActorPage-home" to="/" onClick={() => setFilmId(false)}>
          {t("common.goHome")}
        </Link>
      </div>
    );
  }

  const profileUrl = person.profile_path
    ? GetImgUrl(person.profile_path)
    : "";

  return (
    <div className="ActorPage">
      <header className="ActorPage-header">
        {profileUrl ? (
          <img
            className="ActorPage-photo"
            src={profileUrl}
            alt={person.name || ""}
            width={200}
            height={300}
          />
        ) : (
          <div className="ActorPage-photo ActorPage-photo--placeholder" />
        )}
        <div className="ActorPage-meta">
          <h1 className="ActorPage-name">{person.name}</h1>
          {person.biography ? (
            <>
              <h2 className="ActorPage-bioTitle">{t("actor.biography")}</h2>
              <p className="ActorPage-bio">{person.biography}</p>
            </>
          ) : null}
        </div>
      </header>

      <h2 className="ActorPage-filmsTitle">{t("actor.films")}</h2>
      {movies.length === 0 ? (
        <p className="ActorPage-noFilms">{t("actor.noFilms")}</p>
      ) : (
        <div className="ActorPage-films">
          {movies.map((film) => (
            <Link
              key={film.id}
              to={`/film/${film.id}`}
              className="ActorPage-filmCard"
              onClick={() => {
                setSelectFilm(null);
                setFilmId(String(film.id));
                setTvId?.(undefined);
              }}
            >
              {film.poster_path ? (
                <img
                  src={GetImgUrl(film.poster_path)}
                  alt={film.title || ""}
                />
              ) : (
                <div className="ActorPage-posterPlaceholder" />
              )}
              <p className="ActorPage-filmTitle">
                {film.title || t("fallbacks.noTitle")}
              </p>
              {film.character ? (
                <span className="ActorPage-character">
                  {t("actor.asCharacter", { character: film.character })}
                </span>
              ) : null}
              {film.release_date ? (
                <span className="ActorPage-date">{film.release_date}</span>
              ) : null}
            </Link>
          ))}
        </div>
      )}

      <button type="button" className="ActorPage-back" onClick={goBack}>
        <svg
          className="ActorPage-backIcon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path d="M22.535,8.46A4.965,4.965,0,0,0,19,7H2.8L7.1,2.7A1,1,0,0,0,5.682,1.288L.732,6.237a2.5,2.5,0,0,0,0,3.535l4.95,4.951A1,1,0,1,0,7.1,13.309L2.788,9H19a3,3,0,0,1,3,3v7a3,3,0,0,1-3,3H5a1,1,0,0,0,0,2H19a5.006,5.006,0,0,0,5-5V12A4.969,4.969,0,0,0,22.535,8.46Z" />
        </svg>
        <span>{t("common.back")}</span>
      </button>
    </div>
  );
};
