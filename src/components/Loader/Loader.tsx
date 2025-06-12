import css from "./Loader.module.css";

export default function Loader() {
  return (
    <div className={css.wrapper}>
      <p className={css.text}>Loading movies, please wait...</p>
    </div>
  );
}
