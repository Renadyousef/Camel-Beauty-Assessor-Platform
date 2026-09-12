import { useEffect, useState } from "react";
import { CamelThumb } from "../../icons";
import styles from "./TopCamels.module.css";

export default function TopCamels({ team1Name, team2Name, topCamels, images }) {
  // Rows with a photo can be clicked to see it larger — the thumbnail alone
  // is too small to really look at the camel, which matters more here than
  // an extra click target would cost.
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!preview) return;
    function handleKeyDown(e) {
      if (e.key === "Escape") setPreview(null);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [preview]);

  return (
    <section className={styles.section} aria-labelledby="top-camels-title">
      <div className={styles.eyebrow}>أفضل الإبل</div>
      <h2 id="top-camels-title" className={styles.title}>
        أفضل 3 إبل في كل منقية
      </h2>

      <div className={styles.cols}>
        <TeamTopList
          teamName={team1Name}
          colorVar="var(--color-team-one)"
          tintVar="var(--color-team-one-tint)"
          entries={topCamels.team1}
          images={images.team1}
          onPreview={setPreview}
        />
        <TeamTopList
          teamName={team2Name}
          colorVar="var(--color-team-two)"
          tintVar="var(--color-team-two-tint)"
          entries={topCamels.team2}
          images={images.team2}
          onPreview={setPreview}
        />
      </div>

      {preview && (
        <div className={styles.lightboxBackdrop} onClick={() => setPreview(null)}>
          <div
            className={styles.lightbox}
            role="dialog"
            aria-modal="true"
            aria-label={preview.label}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className={styles.lightboxClose} onClick={() => setPreview(null)} autoFocus>
              إغلاق
            </button>
            <img className={styles.lightboxImg} src={preview.url} alt={preview.label} />
            <div className={styles.lightboxCaption}>
              <span>{preview.label}</span>
              <span className={styles.lightboxScore} style={{ color: preview.colorVar }}>
                {preview.score}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function TeamTopList({ teamName, colorVar, tintVar, entries, images, onPreview }) {
  return (
    <div className={styles.card} style={{ "--team-color": colorVar, "--team-tint": tintVar }}>
      <div className={styles.cardTitle}>أفضل 3 إبل — {teamName}</div>
      {entries.map((entry, i) => {
        const label = String(entry.camelNumber).padStart(2, "0");
        const image = images[entry.camelNumber - 1];
        const rowLabel = `الجمل ${label} — ${teamName}`;

        const rowContent = (
          <>
            <span className={styles.rank}>{i + 1}</span>
            <span className={styles.thumb}>
              {image ? (
                <img className={styles.thumbImg} src={image.url} alt="" />
              ) : (
                <CamelThumb size={32} color="var(--color-text-faint)" />
              )}
            </span>
            <span className={styles.camelName}>الجمل {label}</span>
            <span className={styles.camelScore}>{entry.score}</span>
          </>
        );

        if (!image) {
          return (
            <div className={styles.row} key={entry.camelNumber}>
              {rowContent}
            </div>
          );
        }

        return (
          <button
            type="button"
            key={entry.camelNumber}
            className={`${styles.row} ${styles.rowClickable}`}
            onClick={() => onPreview({ url: image.url, label: rowLabel, score: entry.score, colorVar })}
            aria-label={`عرض صورة ${rowLabel} بحجم أكبر`}
          >
            {rowContent}
          </button>
        );
      })}
    </div>
  );
}
