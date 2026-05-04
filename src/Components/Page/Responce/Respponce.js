import axios from "axios";

const API_KEY = "e8e227add2a2e5c168f7c3845928d8db";
const API_URL = "https://api.themoviedb.org/3/";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

/** Maps UI language from I18n (`en` | `ru`) to TMDB `language` param. */
export function getTmdbLanguage(uiLang) {
  return uiLang === "ru" ? "ru-RU" : "en-US";
}

export function GetAllMovies(language = "en-US") {
  return axios.get(
    `${API_URL}movie/popular?api_key=${API_KEY}&language=${language}`,
  );
}

export function GetMoviesByPage(page, language = "en-US") {
  return axios.get(
    `${API_URL}movie/popular?api_key=${API_KEY}&language=${language}&page=${page}`,
  );
}

export function GetMoviesByGenre(genreId, page = 1, language = "en-US") {
  return axios.get(
    `${API_URL}discover/movie?api_key=${API_KEY}&language=${language}&with_genres=${genreId}&page=${page}`,
  );
}

export function GetMovieById(id, language = "en-US") {
  return axios.get(
    `${API_URL}movie/${id}?api_key=${API_KEY}&language=${language}&append_to_response=credits,similar,videos,watch/providers`,
  );
}

export function GetGenres(language = "en-US") {
  return axios.get(
    `${API_URL}genre/movie/list?api_key=${API_KEY}&language=${language}`,
  );
}

export function GetImgUrl(path) {
  return `${IMG_URL}${path}`;
}

/**
 * Выбирает ключ YouTube из блока TMDB `videos` (официальный трейлер в приоритете).
 */
export function pickYoutubeVideoKey(videosData) {
  const list = Array.isArray(videosData?.results) ? videosData.results : [];
  const yt = list.filter((v) => v.site === "YouTube" && v.key);
  if (!yt.length) return "";

  const score = (v) => {
    let s = 0;
    if (v.official) s += 100;
    const type = (v.type || "").toLowerCase();
    if (type === "trailer") s += 40;
    else if (type === "teaser") s += 30;
    else if (type === "clip") s += 20;
    else if (type === "featurette") s += 10;
    return s;
  };

  yt.sort((a, b) => score(b) - score(a));
  return yt[0].key;
}

const PROVIDER_LOGO = "https://image.tmdb.org/t/p/w45";

/** Упаковка TMDB watch/providers под UI (одна выбранная страна). */
export function normalizeWatchProviders(watchProvidersBlock, uiLang) {
  const empty = {
    region: null,
    link: "",
    flatrate: [],
    rent: [],
    buy: [],
  };
  const results = watchProvidersBlock?.results;
  if (!results || typeof results !== "object") {
    return empty;
  }

  const priority =
    uiLang === "ru"
      ? ["RU", "BY", "KZ", "AM", "GE", "UA", "US", "GB", "DE", "FR"]
      : ["US", "GB", "CA", "AU", "DE", "FR", "RU", "ES", "IT"];

  let code = null;
  let chosen = null;
  for (const c of priority) {
    if (results[c]) {
      code = c;
      chosen = results[c];
      break;
    }
  }
  if (!chosen) {
    const keys = Object.keys(results);
    if (!keys.length) return empty;
    code = keys[0];
    chosen = results[code];
  }

  const mapList = (arr) => {
    if (!Array.isArray(arr)) return [];
    return arr.map((p) => ({
      id: p.provider_id,
      name: p.provider_name || "",
      logoUrl: p.logo_path ? `${PROVIDER_LOGO}${p.logo_path}` : "",
    }));
  };

  return {
    region: code,
    link: chosen.link || "",
    flatrate: mapList(chosen.flatrate),
    rent: mapList(chosen.rent),
    buy: mapList(chosen.buy),
  };
}

export function GetMovieByQuery(query, language = "en-US") {
  const q = encodeURIComponent(query);
  return axios
    .get(
      `${API_URL}search/movie?api_key=${API_KEY}&language=${language}&query=${q}`,
    )
    .then((res) => res.data)
    .catch((err) => console.log(err));
}

export function GetPersonDetails(id, language = "en-US") {
  return axios.get(
    `${API_URL}person/${id}?api_key=${API_KEY}&language=${language}`,
  );
}

export function GetPersonMovieCredits(id, language = "en-US") {
  return axios.get(
    `${API_URL}person/${id}/movie_credits?api_key=${API_KEY}&language=${language}`,
  );
}

/** TV / serials (TMDB; поля `imdb_id` — в ответе `external_ids`). */
export function GetTVPopular(page = 1, language = "en-US") {
  return axios.get(
    `${API_URL}tv/popular?api_key=${API_KEY}&language=${language}&page=${page}`,
  );
}

export function GetTVTopRated(page = 1, language = "en-US") {
  return axios.get(
    `${API_URL}tv/top_rated?api_key=${API_KEY}&language=${language}&page=${page}`,
  );
}

/** Более широкий аниме-каталог сериалов (без жесткого ограничения по стране). */
export function GetDiscoverAnimeTV(page = 1, language = "en-US") {
  return axios.get(
    `${API_URL}discover/tv?api_key=${API_KEY}&language=${language}&page=${page}&sort_by=popularity.desc&with_genres=16&vote_count.gte=20`,
  );
}

/** Аниме-фильмы (для увеличения общего каталога аниме). */
export function GetDiscoverAnimeMovies(page = 1, language = "en-US") {
  return axios.get(
    `${API_URL}discover/movie?api_key=${API_KEY}&language=${language}&page=${page}&sort_by=popularity.desc&with_genres=16&vote_count.gte=20`,
  );
}

export function GetTVById(id, language = "en-US") {
  return axios.get(
    `${API_URL}tv/${id}?api_key=${API_KEY}&language=${language}&append_to_response=credits,recommendations,videos,external_ids,watch/providers`,
  );
}

export function GetTVByQuery(query, language = "en-US") {
  const q = encodeURIComponent(query);
  return axios
    .get(
      `${API_URL}search/tv?api_key=${API_KEY}&language=${language}&query=${q}`,
    )
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
      return { results: [] };
    });
}
