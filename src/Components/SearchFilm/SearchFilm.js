import { Link } from "react-router-dom";
import "./SearchFilm.css";
import { useI18n } from "../../i18n/I18nProvider";

const FALLBACK_POSTER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="78" viewBox="0 0 56 78">
      <rect width="56" height="78" fill="#1e293b"/>
      <path d="M12 58l9-12 8 10 6-8 9 10" stroke="#64748b" stroke-width="2" fill="none"/>
      <circle cx="21" cy="27" r="5" fill="#64748b"/>
    </svg>`,
  );

const MAX_RESULTS = 12;

export const SearchFilm = ({
  setSelectedCategory,
  films,
  setFilmId,
  setTvId,
  setValue,
  setSelectFilm,
}) => {
  const { t } = useI18n();
  const hasResults = Array.isArray(films) && films.length > 0;
  const visibleResults = hasResults ? films.slice(0, MAX_RESULTS) : [];

  const handleItemClick = (item) => {
    setSelectFilm(null);
    if (item.media === "tv") {
      setFilmId?.(false);
      setTvId?.(String(item.id));
    } else {
      setTvId?.(undefined);
      setFilmId(item.id);
    }
    setValue("");
    if (typeof setSelectedCategory === "function") {
      setSelectedCategory(null);
    }
  };

  const getItemPath = (item) =>
    item.media === "tv" ? `/show/${item.id}` : `/film/${item.id}`;

  return (
    <div className="MainSearch">
      <div className="SearchFilm" role="listbox" aria-label={t("header.searchPlaceholder")}>
        {hasResults ? (
          visibleResults.map((item) => {
            const filmName = item.aka || item.name || item.title || "Untitled";
            const posterSrc =
              typeof item.imgPoster === "string" && item.imgPoster.trim()
                ? item.imgPoster
                : FALLBACK_POSTER;
            const typeLabel =
              item.media === "tv" ? t("search.tvType") : t("search.movieType");

            return (
              <Link
                to={getItemPath(item)}
                key={`${item.media}-${item.id}`}
                className="searchItem"
                role="option"
                onClick={() => handleItemClick(item)}
              >
                <div className="searchItem-posterWrap">
                  <img
                    src={posterSrc}
                    alt=""
                    className="searchItem-poster"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_POSTER;
                    }}
                  />
                </div>
                <div className="searchItem-body">
                  <span className="searchItem-title">{filmName}</span>
                  <div className="searchItem-meta">
                    <span
                      className={`searchItem-badge searchItem-badge--${item.media}`}
                    >
                      {typeLabel}
                    </span>
                    {item.year ? (
                      <span className="searchItem-year">{item.year}</span>
                    ) : null}
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="searchEmpty">
            <span className="searchEmpty-icon" aria-hidden="true">
              ◌
            </span>
            <span>{t("search.noResults")}</span>
          </div>
        )}
      </div>
    </div>
  );
};
