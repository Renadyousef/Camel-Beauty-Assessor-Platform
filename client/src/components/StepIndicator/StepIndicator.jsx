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
 */
export default function StepIndicator({ step, isProcessing = false }) {
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

          return (
            <li key={s.n} style={{ display: "flex", flex: isLast ? "none" : 1, alignItems: "flex-start" }}>
              <div className={styles.step}>
                <div
                  className={`${styles.circle} ${
                    status === "done" ? styles.circleDone : status === "active" ? styles.circleActive : styles.circlePending
                  }`}
                  aria-current={status === "active" ? "step" : undefined}
                >
                  {status === "done" ? <CheckIcon size={16} /> : s.n}
                </div>
                <div className={`${styles.label} ${status === "pending" ? styles.labelOff : styles.labelOn}`}>{s.label}</div>
              </div>
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
