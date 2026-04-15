import axios from "axios";

const API_KEY = "e8e227add2a2e5c168f7c3845928d8db";
const API_URL = "https://api.themoviedb.org/3/";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

export function GetAllMovies() {
  return axios.get(`${API_URL}movie/popular?api_key=${API_KEY}&language=en-US`);
}

export function GetMoviesByPage(page) {
  return axios.get(
    `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`
  );
}

export function GetMovieById(id) {
  return axios.get(
    `${API_URL}movie/${id}?api_key=${API_KEY}&language=en-US&append_to_response=credits,similar,videos`
  );
}

export function GetGenres() {
  return axios.get(
    `${API_URL}genre/movie/list?api_key=${API_KEY}&language=en-US`
  );
}

export function GetImgUrl(path) {
  return `${IMG_URL}${path}`;
}

export function GetMovieByQuery(query) {
  return axios
    .get(`${API_URL}search/movie?api_key=${API_KEY}&query=${query}`)
    .then((res) => res.data)
    .catch((err) => console.log(err));
}
