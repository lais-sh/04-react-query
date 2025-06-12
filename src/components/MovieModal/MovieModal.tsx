import css from "./MovieModal.module.css";
import type { Movie } from "../../types/movie";
import noimage from "../../assets/noimage.jpg";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  const { backdrop_path, title, overview, release_date, vote_average } = movie;

  return (
    <div className={css.backdrop} onClick={onClose}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <button className={css.closeButton} onClick={onClose} aria-label="Close modal">
          &times;
        </button>

        <img
          src={backdrop_path
            ? `https://image.tmdb.org/t/p/original/${backdrop_path}`
            : noimage}
          alt={title}
          className={css.image}
        />

        <div className={css.content}>
          <h2>{title}</h2>
          <p>{overview}</p>
          <p><strong>Release Date:</strong> {release_date}</p>
          <p><strong>Rating:</strong> {vote_average}/10</p>
        </div>
      </div>
    </div>
  );
}
