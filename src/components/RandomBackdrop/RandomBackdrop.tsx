import css from "./RandomBackdrop.module.css";

interface RandomBackdropProps {
  bgUrl: string;
}

export default function RandomBackdrop({ bgUrl }: RandomBackdropProps) {
  return (
    <div className={css.backdrop} style={{ backgroundImage: `url(${bgUrl})` }}>
      {/* Забрали зайвий текст */}
    </div>
  );
}
