import "./Orders.css";
import { Link } from "react-router-dom";
import { useI18n } from "../../i18n/I18nProvider";

export default function Orders({ save, setSave, setFilmId, setTvId }) {
  const { t } = useI18n();
  const handleDelete = (indexToRemove) => {
    if (!setSave) return;
    setSave((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  return (
    <div className="Orders">
      {save && save.length > 0 ? (
        <div className="OrderItem">
          <h2>{t("orders.summary")}</h2>
          <div className="OrderList">
            {save.map((item, index) => {
              const isTv = item.media === "tv";
              const to = isTv ? `/show/${item.id}` : `/film/${item.id}`;
              return (
              <Link
                to={to}
                onClick={() => {
                  if (isTv) {
                    setFilmId(false);
                    setTvId?.(String(item.id));
                  } else {
                    setTvId?.(undefined);
                    setFilmId(item.id);
                  }
                }}
                key={index}
                className="film-item"
              >
                <svg
                  className="delete"
                  xmlns="http://www.w3.org/2000/svg"
                  id="Layer_1"
                  data-name="Layer 1"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(index);
                  }}
                >
                  <path d="m12,0C5.383,0,0,5.383,0,12s5.383,12,12,12,12-5.383,12-12S18.617,0,12,0Zm0,22c-5.514,0-10-4.486-10-10S6.486,2,12,2s10,4.486,10,10-4.486,10-10,10Zm-5-11h10v2H7v-2Z" />
                </svg>

                <img
                  src={item.image}
                  alt={item.name}
                  width={200}
                  height={300}
                />
                <div className="OrderMeta">
                  <div className="film-title">{item.name}</div>
                  <div className="film-date">{item.date}</div>
                </div>
                <div className="film-genre">{item.genre}</div>
                <div className="OrderActions"></div>
              </Link>
            );
            })}
          </div>
        </div>
      ) : (
        <div className="OrderEmpty">{t("orders.empty")}</div>
      )}
      <Link
        className="backSvg"
        to="/"
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
}
