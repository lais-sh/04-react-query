import css from "./App.module.css";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import SearchBar from "../SearchBar/SearchBar";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import ReactPaginate from "react-paginate";
import type { Movie } from "../../types/movie";
import fetchMovies from "../../services/movieService";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import RandomBackdrop from "../RandomBackdrop/RandomBackdrop";
import { getRandomBackdropUrl } from "../../services/getRandomBackdrop";
import Loader from "../Loader/Loader";
import MainHeader from "../MainHeader/MainHeader";
// import Modal from "../Common/Modal";

export default function App() {
  //STATES
  const [query, setQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [backGround, setBackground] = useState<string | null>(null);

  //SEARCHING AND RENDERING MOVIES BY QUERY
  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ["movies", query, currentPage],
    queryFn: () => fetchMovies(query, currentPage),
    enabled: !!query,
    retry: false,
    placeholderData: keepPreviousData,
  });
  const movies = data?.results;
  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
    if (data?.page) setCurrentPage(data?.page);
  }, [data?.page]);

  useEffect(() => {
    if (isSuccess && movies?.length === 0) {
      toast("No movies found for your request.", { icon: "😞" });
      console.log(movies);
    }
  }, [isSuccess, movies]);

  //MOVIECARD MODAL WINDOW OPTIONS
  const openModal = (): void => setIsModalOpen(true);
  const closeModal = (): void => setIsModalOpen(false);

  //FETCH RANDOM POSTERS FOR PAGE BACKDROP

  const bgQuery = useQuery({
    queryKey: ["bg"],
    queryFn: getRandomBackdropUrl,
    enabled: movies && movies.length === 0,
    refetchInterval: 8000,
  });

  useEffect(() => {
    if (!bgQuery.data) return;
    const img = new Image();
    img.src = bgQuery.data;
    img.onload = () => setBackground(bgQuery.data);
  }, [bgQuery.data]);

  //MARKUP
  return (
    <>
      <div>
        <Toaster />
      </div>

      {/* --------------LOADER-------------- */}

      {isLoading && <Loader />}

      {/* --------------BACKGROUND-------------- */}

      {backGround && movies && movies?.length === 0 && (
        <RandomBackdrop bgUrl={backGround} />
      )}

      {/* --------------SEARCHBAR-------------- */}
      <>
        <SearchBar onSubmit={(query) => setQuery(query)} />
      </>

      {/* -------------ERRORMESSAGE--------------- */}

      {query && isError && <ErrorMessage />}

      {/* --------------MOVIEGRID-------------- */}

      {query && movies && movies?.length > 0 ? (
        <>
          <MovieGrid
            movies={movies}
            onSelect={(movie) => {
              setSelectedMovie(movie);
              openModal();
            }}
          />
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
        </>
      ) : (
        <>
          <MainHeader />
          {backGround && <RandomBackdrop bgUrl={backGround} />}
        </>
      )}

      {/* -------------MODAL---------------- */}

      {isModalOpen && selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => {
            closeModal();
            setSelectedMovie(null);
          }}
        />
      )}
    </>
  );
}
