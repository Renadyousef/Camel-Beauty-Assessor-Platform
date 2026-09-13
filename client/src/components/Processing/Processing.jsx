import { useEffect, useRef, useState } from "react";
import { CheckIcon } from "../../icons";
import { TOTAL_IMAGES } from "../../config";
import { submitWinnerCamels } from "../../services/api";
import styles from "./Processing.module.css";

const STAGES = ["رفع الصور", "تحديد الإبل", "تحليل الصفات", "حساب نتائج المنقيتين", "إعداد النتيجة النهائية"];

// Purely cosmetic: the backend is a single request/response with no
// progress events, so this animates toward "done" over roughly how long a
// real analysis takes and then holds at the final frame. It never drives
// completion itself — the real request lifecycle below does that.
const COSMETIC_DURATION_MS = 4200;

export default function Processing({ teams, images, onComplete, onError }) {
  const [stageIndex, setStageIndex] = useState(0);
  const [imagesAnalyzed, setImagesAnalyzed] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const duration = prefersReducedMotion ? 600 : COSMETIC_DURATION_MS;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      setImagesAnalyzed(Math.round(progress * TOTAL_IMAGES));
      setStageIndex(Math.min(Math.floor(progress * STAGES.length), STAGES.length - 1));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    submitWinnerCamels({ teams, images })
      .then((apiResult) => {
        if (!cancelled) onComplete(apiResult);
      })
      .catch((error) => {
        if (!cancelled) {
          onError({ team: null, index: null, message: error.message });
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.illustration}>
          <img className={styles.illustrationImage} src="/camel-processing.png" alt="" aria-hidden="true" />
        </div>

        <div className={styles.heading}>
          <h1 className={styles.title}>جاري تحليل المنافسة</h1>
          <p className={styles.subtitle}>يتم الآن تحليل الصور واستخراج الصفات وإعداد النتائج.</p>
        </div>

        <div className={styles.stages}>
          {STAGES.map((label, i) => {
            const status = i < stageIndex ? "done" : i === stageIndex ? "active" : "pending";
            return (
              <div key={label} className={`${styles.stageRow} ${status === "active" ? styles.stageRowActive : ""}`}>
                <span
                  className={`${styles.stageDot} ${
                    status === "done" ? styles.stageDotDone : status === "active" ? styles.stageDotActive : styles.stageDotPending
                  }`}
                >
                  {status === "done" && <CheckIcon size={14} color="#fff" />}
                  {status === "active" && <span className={styles.stageDotActiveInner} />}
                </span>
                <span
                  className={`${styles.stageLabel} ${status === "active" ? styles.stageLabelActive : ""} ${
                    status === "pending" ? styles.stageLabelPending : ""
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        <div>
          <div className={styles.progressHead}>
            <span>
              {imagesAnalyzed} / {TOTAL_IMAGES} صورة
            </span>
            <span>{Math.round((imagesAnalyzed / TOTAL_IMAGES) * 100)}%</span>
          </div>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${(imagesAnalyzed / TOTAL_IMAGES) * 100}%` }} />
          </div>
          <div className={styles.progressNote}>مؤشر تجريبي لعرض الواجهة — سيُستبدل بالتقدّم الفعلي عند ربط النموذج.</div>
        </div>
      </div>
    </div>
  );
}
