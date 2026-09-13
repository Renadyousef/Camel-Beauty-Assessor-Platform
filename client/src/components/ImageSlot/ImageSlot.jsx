import { useRef } from "react";
import { CamelThumb, PlusIcon } from "../../icons";
import styles from "./ImageSlot.module.css";

/**
 * One numbered upload slot. Only two visual states — filled or empty — by
 * design (see ImageUpload.jsx): no quality validation of any kind lives
 * here. `hasError` is the one exception, set only when the Processing demo
 * reports that this specific image could not be analyzed.
 */
export default function ImageSlot({ number, image, onSelect, hasError = false, errorMessage }) {
  const inputRef = useRef(null);
  const label = String(number).padStart(2, "0");
  const hasImage = Boolean(image);

  function openPicker() {
    inputRef.current?.click();
  }

  function handleChange(e) {
    const file = e.target.files?.[0];
    if (file) onSelect(file);
    // allow re-selecting the same file later
    e.target.value = "";
  }

  const actionLabel = hasImage ? "استبدال الصورة" : "إضافة صورة";

  return (
    <div className={styles.slot}>
      <button
        type="button"
        className={`${styles.thumbButton} ${!hasImage ? styles.thumbEmpty : ""} ${hasError ? styles.thumbError : ""}`}
        onClick={openPicker}
        aria-label={`الجمل ${label} — ${actionLabel}`}
      >
        {hasImage ? (
          <>
            <img className={styles.thumbImg} src={image.url} alt={`صورة الجمل رقم ${label}`} />
            <span className={styles.badge}>{label}</span>
          </>
        ) : hasError ? (
          <CamelThumb size={36} color="var(--color-error)" />
        ) : (
          <PlusIcon size={26} color="var(--color-text-faint)" />
        )}
      </button>

      <div className={`${styles.num} ${!hasImage ? styles.numMuted : ""}`}>الجمل {label}</div>

      {hasError && errorMessage && <div className={styles.errorText}>{errorMessage}</div>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className={styles.hiddenInput}
        onChange={handleChange}
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
}
