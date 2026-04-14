import { Link } from "react-router-dom";
import "./Pagination.css";
import { useI18n } from "../../../i18n/I18nProvider";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const { t } = useI18n();
  const maxVisible = 10;
  const getPageNumbers = () => {
    const pages = [];

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="Pagination">
      <Link
        to={`/${currentPage - 1}`}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        className="buttonBig"
      >
        {t("common.prev")}
      </Link>

      {pages.map((p) => (
        <Link
          to={`/${p}`}
          key={p}
          onClick={() => onPageChange(p)}
          className={p === currentPage ? "active" : "button"}
        >
          {p}
        </Link>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          <span className="px-2">…</span>
          <Link
            to={`/${currentPage}`}
            className="button"
            onClick={() => {
              onPageChange(totalPages);
            }}
          >
            {totalPages}
          </Link>
        </>
      )}
      <Link
        to={`/${currentPage + 1}`}
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        className="buttonBig"
      >
        {t("common.next")}
      </Link>
    </div>
  );
}
