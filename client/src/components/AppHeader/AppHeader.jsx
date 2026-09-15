import { HomeIcon } from "../../icons";
import styles from "./AppHeader.module.css";

/**
 * Top bar shown on every screen. Per the approved visual reference, all
 * header content sits on the right side only — the left side is left
 * intentionally empty so the decorative backdrop reads through. There is no
 * navigation here beyond `onGoHome`, which returns to the landing screen and
 * is omitted on the landing screen itself; restarting the comparison lives on
 * the Results screen instead (see Results.jsx).
 */
export default function AppHeader({ onGoHome }) {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.logoFrame}>
            <img className={styles.logo} src="/logo.png" alt="" />
          </span>
          <div>
            <div className={styles.title}>محكم مزاين الإبل</div>
            <div className={styles.subtitle}>تحليل ومقارنة الإبل بالذكاء الاصطناعي</div>
          </div>
        </div>

        {onGoHome && (
          <button type="button" className={styles.homeButton} onClick={onGoHome} aria-label="الصفحة الرئيسية">
            <HomeIcon size={18} />
          </button>
        )}
      </header>
      <div className={styles.divider} aria-hidden="true">
        <span className={styles.dividerLine} />
        <span className={styles.dividerDiamond} />
        <span className={styles.dividerLine} />
      </div>
    </>
  );
}