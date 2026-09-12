import { useEffect, useRef, useState } from "react";
import Button from "../Button/Button";
import { AlertIcon, CheckIcon } from "../../icons";
import { DEMO_IMAGE_ERROR, DEMO_ERROR_TEAM, DEMO_ERROR_CAMEL_NUMBER, TOTAL_IMAGES } from "../../config";
import styles from "./Processing.module.css";

const STAGES = ["رفع الصور", "تحديد الإبل", "تحليل الصفات", "حساب نتائج المنقيتين", "إعداد النتيجة النهائية"];

// Frontend-only simulation. This is where the mock timeline lives — swap
// this whole effect for a real progress subscription (polling / websocket /
// SSE) against the analysis API when it exists, and drive stageIndex /
// imagesAnalyzed from real events instead of elapsed time.
const SIMULATED_DURATION_MS = 4200;
const ERROR_AT_PROGRESS = 0.6; // stop ~60% through when demoing the error state

export default function Processing({ onComplete, onError }) {
  const [stageIndex, setStageIndex] = useState(0);
  const [imagesAnalyzed, setImagesAnalyzed] = useState(0);
  const [errored, setErrored] = useState(false);
  const rafRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const duration = prefersReducedMotion ? 600 : SIMULATED_DURATION_MS;
    const startTime = performance.now();
    let finished = false;

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      setImagesAnalyzed(Math.round(progress * TOTAL_IMAGES));
      setStageIndex(Math.min(Math.floor(progress * STAGES.length), STAGES.length - 1));

      if (DEMO_IMAGE_ERROR && progress >= ERROR_AT_PROGRESS && !finished) {
        finished = true;
        setErrored(true);
        return;
      }

      if (progress >= 1 && !finished) {
        finished = true;
        onComplete();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const errorCamelLabel = String(DEMO_ERROR_CAMEL_NUMBER).padStart(2, "0");
  const errorMessage = `تعذر تحليل الصورة رقم ${errorCamelLabel}. يرجى استبدال الصورة والمحاولة مرة أخرى.`;

  function handleReturnToUpload() {
    onError({
      team: DEMO_ERROR_TEAM,
      index: DEMO_ERROR_CAMEL_NUMBER - 1,
      message: errorMessage,
    });
  }

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

        {errored ? (
          <>
            <div className={styles.errorBox} role="alert">
              <span className={styles.errorIcon}>
                <AlertIcon size={14} />
              </span>
              <span className={styles.errorMessage}>{errorMessage}</span>
            </div>
            <div className={styles.errorActions}>
              <Button size="lg" onClick={handleReturnToUpload}>
                العودة إلى الصور
              </Button>
            </div>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
