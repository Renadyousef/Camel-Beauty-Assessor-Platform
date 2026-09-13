import styles from "./AppHeader.module.css";

/**
 * Top bar shown on every screen. Per the approved visual reference, all
 * header content sits on the right side only — the left side is left
 * intentionally empty so the decorative backdrop reads through. There is no
 * navigation here; restarting the comparison lives on the Results screen
 * instead (see Results.jsx), since that is the only place it's relevant.
 */
export default function AppHeader() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.logoFrame}>
            <img className={styles.logo} src="/logo.png" alt="" />
          </span>
          <div>
            <div className={styles.title}>منصة المزايين</div>
            <div className={styles.subtitle}>تحليل ومقارنة الإبل بالذكاء الاصطناعي</div>
          </div>
        </div>
      </header>
      <div className={styles.divider} aria-hidden="true">
        <span className={styles.dividerLine} />
        <span className={styles.dividerDiamond} />
        <span className={styles.dividerLine} />
      </div>
    </>
  );
}
