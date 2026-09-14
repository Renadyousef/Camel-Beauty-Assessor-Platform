import { useRef, useState } from "react";
import ImageSlot from "../ImageSlot/ImageSlot";
import { TEAM_SIZE } from "../../config";
import styles from "./TeamUploadPanel.module.css";

export default function TeamUploadPanel({ label, teamName, colorVar, images, onSelect, onSelectMany, errorSlot }) {
  const bulkInputRef = useRef(null);
  const [skippedCount, setSkippedCount] = useState(0);

  const filledCount = images.filter(Boolean).length;
  const isComplete = filledCount === TEAM_SIZE;
  const freeCount = TEAM_SIZE - filledCount;

  function openBulkPicker() {
    bulkInputRef.current?.click();
  }

  // Only as many files as there are empty slots are passed up; the rest are
  // dropped here and reported to the judge instead of silently disappearing.
  function handleBulkChange(e) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";

    if (files.length === 0) return;

    const accepted = files.slice(0, freeCount);
    setSkippedCount(files.length - accepted.length);

    if (accepted.length > 0) onSelectMany(accepted);
  }

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

        <button type="button" className={styles.bulkButton} onClick={openBulkPicker} disabled={isComplete}>
          {isComplete ? "اكتملت الصور" : `اختيار عدة صور (${freeCount} متبقية)`}
        </button>

        {skippedCount > 0 && (
          <div className={styles.bulkNote}>
            تم تجاهل {skippedCount} صورة — المتاح {TEAM_SIZE} صورة فقط لكل منقية.
          </div>
        )}

        <input
          ref={bulkInputRef}
          type="file"
          accept="image/*"
          multiple
          className={styles.hiddenInput}
          onChange={handleBulkChange}
          tabIndex={-1}
          aria-hidden="true"
        />
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