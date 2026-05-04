/* eslint-disable jsx-a11y/alt-text */
import { Link } from "react-router-dom";
import "./Film.css";
import { Loading } from "../Loading/Loading";
import { useState } from "react";
import { useI18n } from "../../i18n/I18nProvider";

export const Film = ({
  selectFilm,
  setFilmId,
  setTvId,
  setSelectFilm,
  setValue,
  setSave,
  save,
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const { t } = useI18n();
  const mediaType = selectFilm?.media === "tv" ? "tv" : "movie";
  const tvBackPath =
    typeof window !== "undefined"
      ? sessionStorage.getItem("hhTvBrowseBack") === "/anime"
        ? "/anime"
        : "/tv"
      : "/tv";

  const handleSaveOrder = () => {
    if (!selectFilm) return;

    const newFilm = {
      id: selectFilm.id,
      media: mediaType,
      name: selectFilm.name,
      image: selectFilm.image,
      genre: selectFilm.genre,
      date: selectFilm.date,
    };

    // Append only if not already present (prevent duplicates by name+date)
    setSave((prev) => {
      try {
        const exists = prev.some(
          (f) =>
            f.id === newFilm.id &&
            (f.media || "movie") === (newFilm.media || "movie"),
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
          <div className="Address-meta">
            <div className="metaRow">
              <span className="metaLabel">{t("film.name")}</span>
              <span className="metaValue">{selectFilm.name}</span>
            </div>

            <div className="metaRow metaRow--full">
              <span className="metaLabel">{t("film.productions")}</span>
              <ul className="metaList metaList--production">
                {(selectFilm.production || []).map((prod, i) => (
                  <li key={i}>{prod}</li>
                ))}
              </ul>
            </div>

            <div className="metaRow">
              <span className="metaLabel">{t("film.date")}</span>
              <span className="metaValue">{selectFilm.date}</span>
            </div>
            <div className="metaRow">
              <span className="metaLabel">{t("film.director")}</span>
              <span className="metaValue">{selectFilm.director}</span>
            </div>
            <div className="metaRow">
              <span className="metaLabel">{t("film.category")}</span>
              <span className="metaValue">{selectFilm.genre}</span>
            </div>
            <div className="metaRow">
              <span className="metaLabel">{t("film.country")}</span>
              <span className="metaValue">{selectFilm.country}</span>
            </div>
            <div className="metaRow">
              <span className="metaLabel">{t("film.time")}</span>
              <span className="metaValue">{selectFilm.time}</span>
            </div>

            <div className="metaRow metaRow--full metaRow--actors">
              <span className="metaLabel metaLabel--block">
                {t("film.actorsHeading")}
              </span>
              <div className="AddressActors">
                {selectFilm.actorsImage.map((actor, i) =>
                  actor.id ? (
                    <Link
                      key={actor.id}
                      to={`/actor/${actor.id}`}
                      className="AddressName AddressName--link"
                    >
                      {actor.name.nameText.text}
                    </Link>
                  ) : (
                    <span key={i} className="AddressName">
                      {actor.name.nameText.text}
                    </span>
                  ),
                )}
              </div>
            </div>

            <div className="metaRow metaRow--full metaRow--roles">
              <span className="metaLabel metaLabel--block">
                {t("film.rolesLabel")}
              </span>
              <div className="Character">
                {(selectFilm.characters || []).map((character, i) => (
                  <span key={i} className="characterChip">
                    {character}
                  </span>
                ))}
              </div>
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
          <div className="videoFrame">
            {selectFilm.youtubeTrailerKey ? (
              <iframe
                className="filmVideoIframe"
                src={`https://www.youtube-nocookie.com/embed/${selectFilm.youtubeTrailerKey}?rel=0`}
                title={t("film.trailerPlayerTitle", {
                  name: selectFilm.name,
                })}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : selectFilm.ecoder ? (
              <video className="filmVideo" controls playsInline>
                <source src={selectFilm.ecoder} type="video/mp4" />
              </video>
            ) : (
              <div className="videoUnavailable">{t("film.noTrailer")}</div>
            )}
          </div>
        </div>

        <div className="watchFull">
          <h2 className="watchFull-heading">{t("film.watchFullTitle")}</h2>
          <p className="watchFull-note">{t("film.watchFullNote")}</p>
          {(() => {
            const wp = selectFilm.watchProviders;
            const hasLists =
              wp &&
              (wp.flatrate?.length > 0 ||
                wp.rent?.length > 0 ||
                wp.buy?.length > 0);
            if (!hasLists && !wp?.link) {
              return (
                <p className="watchFull-empty">{t("film.watchFullUnavailable")}</p>
              );
            }
            return (
              <>
                {wp.region ? (
                  <p className="watchFull-region">
                    {t("film.watchRegion", { region: wp.region })}
                  </p>
                ) : null}
                {hasLists ? (
                  <div className="watchFull-groups">
                    {wp.flatrate?.length > 0 ? (
                      <div className="watchFull-group">
                        <h3 className="watchFull-subheading">
                          {t("film.watchSubscribe")}
                        </h3>
                        <ul className="watchFull-providers">
                          {wp.flatrate.map((p) => (
                            <li key={`sub-${p.id}`}>
                              <a
                                href={wp.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="watchFull-provider"
                              >
                                {p.logoUrl ? (
                                  <img
                                    src={p.logoUrl}
                                    alt=""
                                    width={40}
                                    height={40}
                                  />
                                ) : null}
                                <span>{p.name}</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    {wp.rent?.length > 0 ? (
                      <div className="watchFull-group">
                        <h3 className="watchFull-subheading">
                          {t("film.watchRent")}
                        </h3>
                        <ul className="watchFull-providers">
                          {wp.rent.map((p) => (
                            <li key={`rent-${p.id}`}>
                              <a
                                href={wp.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="watchFull-provider"
                              >
                                {p.logoUrl ? (
                                  <img
                                    src={p.logoUrl}
                                    alt=""
                                    width={40}
                                    height={40}
                                  />
                                ) : null}
                                <span>{p.name}</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    {wp.buy?.length > 0 ? (
                      <div className="watchFull-group">
                        <h3 className="watchFull-subheading">
                          {t("film.watchBuy")}
                        </h3>
                        <ul className="watchFull-providers">
                          {wp.buy.map((p) => (
                            <li key={`buy-${p.id}`}>
                              <a
                                href={wp.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="watchFull-provider"
                              >
                                {p.logoUrl ? (
                                  <img
                                    src={p.logoUrl}
                                    alt=""
                                    width={40}
                                    height={40}
                                  />
                                ) : null}
                                <span>{p.name}</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                ) : null}
                {wp.link ? (
                  <a
                    className="watchFull-cta"
                    href={wp.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("film.openWatchOptions")}
                  </a>
                ) : null}
              </>
            );
          })()}
        </div>
      </div>

      <div className="actors">
        <h1>{t("film.actorsWithCharacters")}</h1>
        <div className="actorsCharacters">
          {selectFilm.actorsImage.map((actor, i) =>
            actor.id ? (
              <Link
                key={actor.id}
                to={`/actor/${actor.id}`}
                className="namesImages namesImages--link"
              >
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
              </Link>
            ) : (
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
            ),
          )}
        </div>
      </div>

      <div>
        <h1>{t("film.similar")}</h1>

        <div className="similar">
          {selectFilm.similar?.map((similarFilm) => {
            const sid = similarFilm.node.id;
            const isTv = mediaType === "tv";
            return (
              <Link
                className="similarFilm"
                key={sid}
                to={isTv ? `/show/${sid}` : `/film/${sid}`}
                onClick={() => {
                  setSelectFilm(null);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  if (isTv) {
                    setFilmId?.(false);
                    setTvId?.(String(sid));
                  } else {
                    setTvId?.(undefined);
                    setFilmId?.(String(sid));
                  }
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
        to={mediaType === "tv" ? tvBackPath : "/"}
        onClick={() => {
          setFilmId(false);
          setTvId?.(undefined);
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
