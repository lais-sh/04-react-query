import axios from "axios";
import type { Movie } from "../types/movie";
const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
interface MoviesResponse {
  results: Movie[];
  page: number;
  total_pages: number;
}
export default async function fetchMovies(
  query: string,
  page: number
): Promise<MoviesResponse> {
  if (!TMDB_TOKEN) {
    throw new Error("TMDB token is missing in environment variables");
  }

  const response = await axios.get<MoviesResponse>(
    "https://api.themoviedb.org/3/search/movie",
    {
      params: {
        query,
        page,
        include_adult: true,
      },
      headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
    }
  );

  return response.data;
}
