import styles from "./TeamResultCard.module.css";

/**
 * A single team's result, shown as its own full-width block — no
 * expand/collapse interaction. The short summary is always visible so the
 * result is understandable without any clicks.
 */
export default function TeamResultCard({ label, name, colorVar, tintVar, overall, summary }) {
  return (
    <div className={styles.card} style={{ "--team-color": colorVar, "--team-tint": tintVar }}>
      <div className={styles.label}>{label}</div>

      <div className={styles.nameRow}>
        <span className={styles.dot} />
        <span className={styles.name}>{name}</span>
      </div>

      <div className={styles.score}>
        {overall} <span className={styles.scoreMax}>/ 100</span>
      </div>

      <p className={styles.summary}>{summary}</p>
    </div>
  );
}
