import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import { Toaster, toast } from 'react-hot-toast';

import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import RandomBackdrop from '../RandomBackdrop/RandomBackdrop';

import { fetchMovies } from '../../services/movieService';
import { getRandomBackdropUrl } from '../../services/getRandomBackdrop';
import type { Movie } from '../../types/movie';

import css from './App.module.css';

export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [activeMovie, setActiveMovie] = useState<Movie | null>(null);
  const [backdrop, setBackdrop] = useState<string | null>(null);

  const { data, isPending, isError } = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies({ query, page }),
    enabled: !!query,
    placeholderData: (prev) => prev,
  });

  const handleSearch = (newQuery: string) => {
    if (newQuery !== query) {
      setQuery(newQuery);
      setPage(1); // reset page on new search
    }
  };

  const closeModal = () => setActiveMovie(null);

  // Фонове зображення, якщо немає пошуку
  useEffect(() => {
    if (!query) {
      getRandomBackdropUrl()
        .then((url) => {
          const img = new Image();
          img.src = url ?? '';
          img.onload = () => setBackdrop(url);
        })
        .catch((err) => console.warn('Backdrop error:', err));
    }
  }, [query]);

  // Toast при відсутності результатів
  useEffect(() => {
    if (data?.results.length === 0) {
      toast('No movies found.', { icon: '🎬' });
    }
  }, [data]);

  return (
    <div className={css.appContainer}>
      <Toaster />
      <SearchBar onSubmit={handleSearch} defaultValue={query} />

      {isPending && <Loader />}
      <RandomBackdrop bgUrl={backdrop} />

      {isError ? (
        <ErrorMessage />
      ) : (
        <>
          {data && (
            <>
              <MovieGrid movies={data.results} onSelect={setActiveMovie} />

              {data.total_pages > 1 && (
                <ReactPaginate
                  pageCount={data.total_pages}
                  pageRangeDisplayed={5}
                  marginPagesDisplayed={1}
                  onPageChange={({ selected }) => setPage(selected + 1)}
                  forcePage={page - 1}
                  containerClassName={css.pagination}
                  activeClassName={css.active}
                  nextLabel="→"
                  previousLabel="←"
                />
              )}
            </>
          )}
        </>
      )}

      {activeMovie && <MovieModal movie={activeMovie} onClose={closeModal} />}
    </div>
  );
}
