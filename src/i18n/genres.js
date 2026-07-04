/** TMDB movie genre ids in display order (same grid for EN and RU). */
export const MOVIE_GENRE_IDS = [
  28, 12, 16, 35, 80, 99, 18, 10751, 14, 36, 27, 10402, 9648, 10749, 878,
  10770, 53, 10752, 37,
];

export function getGenreLabel(t, genreId) {
  return t(`genres.${genreId}`);
}
