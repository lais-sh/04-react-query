import css from "./App.module.css";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import ReactPaginate from "react-paginate";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import RandomBackdrop from "../RandomBackdrop/RandomBackdrop";
import Loader from "../Loader/Loader";
import MainHeader from "../MainHeader/MainHeader";

import { fetchMoviesBySearch } from "../../services/movieService";
import { getRandomBackdropUrl } from "../../services/getRandomBackdrop";
import type { Movie } from "../../types/movie";

export default function App() {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);

  // TMDB fetch
  const {
    data,
    isError,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["movies", query, currentPage],
    queryFn: () => fetchMoviesBySearch({ query, page: currentPage }),
    enabled: !!query,
    retry: false,
    placeholderData: keepPreviousData,
  });

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
    if (isSuccess && movies.length === 0) {
      toast("No movies found for your request.", { icon: "😞" });
    }
  }, [isSuccess, movies]);

  // Background image preload
  const bgQuery = useQuery({
    queryKey: ["backdrop"],
    queryFn: getRandomBackdropUrl,
    enabled: movies.length === 0,
    refetchInterval: 8000,
  });

  useEffect(() => {
    if (!bgQuery.data) return;
    const img = new Image();
    img.src = bgQuery.data;
    img.onload = () => setBackgroundUrl(bgQuery.data);
  }, [bgQuery.data]);

  return (
    <>
      <Toaster />

      {isLoading && <Loader />}

      <SearchBar onSubmit={(query) => {
        setQuery(query);
        setCurrentPage(1);
      }} />

      {query && isError && <ErrorMessage />}

      {query && movies.length > 0 ? (
        <section className={css.gallerySection}>
          {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setCurrentPage(selected + 1)}
              forcePage={currentPage - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}

          <MovieGrid
            movies={movies}
            onSelect={(movie) => setSelectedMovie(movie)}
          />
        </section>
      ) : (
        <>
          <MainHeader />
          {backgroundUrl && <RandomBackdrop bgUrl={backgroundUrl} />}
        </>
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </>
  );
}
