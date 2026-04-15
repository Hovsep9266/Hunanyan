/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable jsx-a11y/alt-text */
import { Link } from "react-router-dom";
import "./Film.css";
import { Loading } from "../Loading/Loading";
import { useState } from "react";
import { useI18n } from "../../i18n/I18nProvider";

export const Film = ({
  selectFilm,
  setFilmId,
  setSelectFilm,
  setValue,
  trailer,
  setSave,
  save,
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const { t } = useI18n();

  const handleSaveOrder = () => {
    if (!selectFilm) return;

    const newFilm = {
      id: selectFilm.id,
      name: selectFilm.name,
      image: selectFilm.image,
      genre: selectFilm.genre,
      date: selectFilm.date,
    };

    // Append only if not already present (prevent duplicates by name+date)
    setSave((prev) => {
      try {
        const exists = prev.some(
          (f) => f.name === newFilm.name && f.date === newFilm.date,
        );
        if (exists) return prev;
        return [...prev, newFilm];
      } catch (err) {
        return [...(prev || []), newFilm];
      }
    });
  };

  if (!selectFilm)
    return (
      <div>
        <Loading />.
      </div>
    );

  return (
    <div className="Film">
      <div className="FilmAddress">
        <div className="saveSvg" onClick={handleSaveOrder}>
          {!isSaved ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              id="Bold"
              viewBox="0 0 30 30"
              width="30"
              height="30"
              onClick={() => setIsSaved(true)}
            >
              <path d="M17.5,0H6.5A5.507,5.507,0,0,0,1,5.5V20.472a3.5,3.5,0,0,0,6.044,2.4l4.912-5.2,5.013,5.25A3.5,3.5,0,0,0,23,20.51V5.5A5.507,5.507,0,0,0,17.5,0ZM20,20.51a.5.5,0,0,1-.861.345l-6.1-6.391A1.5,1.5,0,0,0,11.95,14h0a1.5,1.5,0,0,0-1.086.47l-6,6.345a.479.479,0,0,1-.549.122A.471.471,0,0,1,4,20.472V5.5A2.5,2.5,0,0,1,6.5,3h11A2.5,2.5,0,0,1,20,5.5Z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              id="Filled"
              viewBox="0 0 30 30"
              width="30"
              height="30"
              onClick={() => setIsSaved(false)}
            >
              <path d="M2.849,23.55a2.954,2.954,0,0,0,3.266-.644L12,17.053l5.885,5.853a2.956,2.956,0,0,0,2.1.881,3.05,3.05,0,0,0,1.17-.237A2.953,2.953,0,0,0,23,20.779V5a5.006,5.006,0,0,0-5-5H6A5.006,5.006,0,0,0,1,5V20.779A2.953,2.953,0,0,0,2.849,23.55Z" />
            </svg>
          )}
        </div>
        <div>
          <img
            src={selectFilm.image}
            alt={selectFilm.name}
            width={250}
            height={350}
          />
        </div>

        <div className="Address">
          <div>
            {t("film.name")} : {selectFilm.name}
          </div>

          <div className="Production">
            {t("film.productions")}:
            <div className="ProdName">
              {selectFilm.production.map((prod, i) => (
                <span key={i}>{prod}, </span>
              ))}
            </div>
          </div>

          <div>
            {t("film.date")} : {selectFilm.date}
          </div>
          <div>
            {t("film.director")} : {selectFilm.director}
          </div>
          <div>
            {t("film.category")} : {selectFilm.genre}
          </div>
          <div>
            {t("film.country")} : {selectFilm.country}
          </div>
          <div>
            {t("film.time")} : {selectFilm.time}
          </div>

          <div>
            <h3 className="h3Actors">{t("film.actorsHeading")}</h3>
            <div className="AddressActors">
              {selectFilm.actorsImage.map((actor, i) => (
                <div key={i} className="AddressName">
                  {actor.name.nameText.text}
                </div>
              ))}
            </div>

            <div className="Character">
              <p>
                {selectFilm.characters.map((character, i) => (
                  <span key={i}>{character}</span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="main">
        <div className="Description">
          <h1>{t("film.description")}</h1>
          <div className="descriptionText">{selectFilm.description}</div>
        </div>

        <div className="video">
          <h2>{t("film.watchOnline", { name: selectFilm.name })}</h2>
          <video width={1020} height={600} controls>
            <source src={selectFilm.ecoder} type="video/mp4"></source>
          </video>

          {/* <iframe
            width="1000"
            height="515"
            src={`https://www.youtube.com/watch?v=${trailer}`}
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe> */}
        </div>
      </div>

      <div className="actors">
        <h1>{t("film.actorsWithCharacters")}</h1>
        <div className="actorsCharacters">
          {selectFilm.actorsImage.map((actor, i) => (
            <div key={i} className="namesImages">
              <div>
                <img
                  className="actorImage"
                  src={actor.name.primaryImage?.url}
                  width={100}
                  height={150}
                />
              </div>
              <p className="actorName">{actor.name.nameText.text}</p>
              <p className="actorCharacter">
                {(actor.creditedRoles.edges || [])
                  .map(
                    (charact) =>
                      charact?.node?.characters?.edges?.[0]?.node?.name ||
                      t("film.unknown"),
                  )
                  .join(", ")}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h1>{t("film.similar")}</h1>

        <div className="similar">
          {selectFilm.similar?.map((similarFilm) => {
            return (
              <Link
                className="similarFilm"
                key={similarFilm.node.id}
                to={`/film/${similarFilm.node.id}`}
                onClick={() => {
                  setSelectFilm(null);
                  setFilmId(similarFilm.node.id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <img src={similarFilm.node.primaryImage.url} width={150} height={200} />
                <div>{similarFilm.node.primaryImage.caption.plainText}</div>
              </Link>
            );
          })}
        </div>
      </div>

      <Link
        className="backSvg"
        to="/"
        onClick={() => {
          setFilmId(false);
          setValue("");
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
