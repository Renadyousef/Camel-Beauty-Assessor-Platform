import ImageSlot from "../ImageSlot/ImageSlot";
import { TEAM_SIZE } from "../../config";
import styles from "./TeamUploadPanel.module.css";

export default function TeamUploadPanel({ label, teamName, colorVar, images, onSelect, errorSlot }) {
  const filledCount = images.filter(Boolean).length;
  const isComplete = filledCount === TEAM_SIZE;

  return (
    <section className={styles.panel} style={{ "--team-color": colorVar }} aria-label={`صور ${teamName}`}>
      <div className={styles.head}>
        <div className={styles.headTop}>
          <span className={styles.dot} />
          <span className={styles.label}>{label}</span>
        </div>
        <div className={styles.name}>{teamName}</div>
        <div className={`${styles.count} ${!isComplete ? styles.countIncomplete : ""}`}>
          {filledCount} / {TEAM_SIZE} صورة
        </div>
      </div>

      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${(filledCount / TEAM_SIZE) * 100}%` }} />
      </div>

      <div className={styles.grid}>
        {images.map((image, i) => {
          const number = i + 1;
          const hasError = errorSlot?.index === i;
          return (
            <ImageSlot
              key={number}
              number={number}
              image={image}
              onSelect={(file) => onSelect(i, file)}
              hasError={hasError}
              errorMessage={hasError ? errorSlot.message : undefined}
            />
          );
        })}
      </div>
    </section>
  );
}
