import { useState } from "react";
import toast from "react-hot-toast";
import css from "./SearchBar.module.css";

interface SearchBarProps {
  onSubmit: (query: string) => void;
}

export default function SearchBar({ onSubmit }: SearchBarProps) {
  const [term, setTerm] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cleaned = term.trim();

    if (!cleaned) {
      toast.error("Please enter your search query.");
      return;
    }

    onSubmit(cleaned);
    setTerm("");
  };

  return (
    <header className={css.header}>
      <div className={css.container}>
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
          className={css.link}
        >
          Powered by TMDB
        </a>

        <form onSubmit={handleSubmit} className={css.form}>
          <input
            type="text"
            name="query"
            placeholder="Search movies..."
            className={css.input}
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            autoComplete="off"
            autoFocus
          />
          <button type="submit" className={css.button}>
            Search
          </button>
        </form>
      </div>
    </header>
  );
}
