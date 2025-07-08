import axios from 'axios';
import type { Movie } from '../types/movie';

const API_URL = 'https://api.themoviedb.org/3/search/movie';
const AUTH_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export interface FetchMoviesParams {
  query: string;
  page: number;
}

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export const fetchMovies = async ({
  query,
  page,
}: FetchMoviesParams): Promise<MoviesResponse> => {
  const { data } = await axios.get<MoviesResponse>(API_URL, {
    params: {
      query,
      language: 'en-US',
      include_adult: false,
      page,
    },
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN}`,
    },
  });

  return data;
};
