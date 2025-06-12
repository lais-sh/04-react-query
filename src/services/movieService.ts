import axios from "axios";
import type { Movie } from "../types/movie";

interface FetchMovieParams {
  query: string;
  page: number;
}

interface MovieApiResponse {
  results: Movie[];
  total_pages: number;
  page: number;
}

const BASE_URL = "https://api.themoviedb.org/3/search/movie";
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export async function fetchMoviesBySearch({ query, page }: FetchMovieParams): Promise<MovieApiResponse> {
  const config = {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
    params: {
      query,
      page,
      include_adult: false,
      language: "en-US",
    },
  };

  const response = await axios.get<MovieApiResponse>(BASE_URL, config);
  return response.data;
}
