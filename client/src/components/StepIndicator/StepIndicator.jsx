import { CheckIcon } from "../../icons";
import styles from "./StepIndicator.module.css";

const STEPS = [
  { n: 1, label: "إعداد المنافسة" },
  { n: 2, label: "رفع الصور" },
  { n: 3, label: "النتائج" },
];

/**
 * Always exactly 3 steps — Processing is a temporary state, never a 4th
 * step. Pass `isProcessing` while on the Processing screen: steps 1-2 show
 * as done and the connector into step 3 shows a "قيد المعالجة" tag instead
 * of step 3 becoming active early.
 *
 * The track doubles as the app's navigation: a step the judge can go back
 * (or forward) to becomes a button, and every other step stays inert — so a
 * stage is never opened before the work it depends on exists.
 */
export default function StepIndicator({ step, isProcessing = false, canNavigateTo, onNavigate }) {
  function statusOf(n) {
    if (isProcessing) return n <= 2 ? "done" : "pending";
    if (n < step) return "done";
    if (n === step) return "active";
    return "pending";
  }

  return (
    <nav className={styles.wrap} aria-label="مراحل المنافسة">
      <ol className={styles.track}>
        {STEPS.map((s, i) => {
          const status = statusOf(s.n);
          const isLast = i === STEPS.length - 1;
          const showProcessingConnector = isProcessing && s.n === 2;
          const connectorDone = status === "done" && !showProcessingConnector;
          const isNavigable = status !== "active" && Boolean(canNavigateTo?.(s.n)) && Boolean(onNavigate);

          const stepBody = (
            <>
              <div
                className={`${styles.circle} ${
                  status === "done" ? styles.circleDone : status === "active" ? styles.circleActive : styles.circlePending
                }`}
                aria-current={status === "active" ? "step" : undefined}
              >
                {status === "done" ? <CheckIcon size={16} /> : s.n}
              </div>
              <div className={`${styles.label} ${status === "pending" ? styles.labelOff : styles.labelOn}`}>{s.label}</div>
            </>
          );

          return (
            <li key={s.n} style={{ display: "flex", flex: isLast ? "none" : 1, alignItems: "flex-start" }}>
              {isNavigable ? (
                <button
                  type="button"
                  className={`${styles.step} ${styles.stepButton}`}
                  onClick={() => onNavigate(s.n)}
                  aria-label={`الانتقال إلى ${s.label}`}
                >
                  {stepBody}
                </button>
              ) : (
                <div className={styles.step}>{stepBody}</div>
              )}

              {!isLast && (
                <div
                  className={`${styles.connector} ${connectorDone ? styles.connectorDone : ""} ${
                    showProcessingConnector ? styles.connectorProcessing : ""
                  }`}
                >
                  {showProcessingConnector && <span className={styles.processingTag}>قيد المعالجة</span>}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}