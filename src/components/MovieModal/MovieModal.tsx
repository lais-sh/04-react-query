import type { Movie } from "../../types/movie";
import css from "./MovieModal.module.css";
import noimage from "/src/assets/noimage.jpg";
import { createPortal } from "react-dom";
import { useEffect } from "react";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}



export default function MovieModal(
  { movie, onClose }: MovieModalProps) {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const { backdrop_path, title, overview, release_date, vote_average } = movie;

  return createPortal(
    <div
      onClick={handleBackdropClick}
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
    >
      <div className={css.modal}>
        <button
          className={css.closeButton}
          aria-label="Close modal"
          onClick={onClose}
        >
          &times;
        </button>
        <img
          src={
            backdrop_path
              ? `https://image.tmdb.org/t/p/original/${backdrop_path}`
              : noimage
          }
          alt={title}
          className={css.image}
        />
        <div className={css.content}>
          <h2>{title}</h2>
          <p>{overview}</p>
          <p>
            <strong>Release Date:</strong> {release_date}
          </p>
          <p>
            <strong>Rating:</strong> {`${vote_average}/10`}
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
