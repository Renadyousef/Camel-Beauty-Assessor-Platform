import { useState } from "react";
import { ChevronDown, TrophyIcon } from "../../icons";
import { STRONG_TRAIT_THRESHOLD } from "../../data/mockResults";
import styles from "./TeamResultCard.module.css";

// Three visual tiers for a trait bar. Only the top tier uses the team colour
// at full strength, so a strong trait reads instantly without any label.
function traitTier(value) {
  if (value >= STRONG_TRAIT_THRESHOLD) return styles.barStrong;
  if (value >= STRONG_TRAIT_THRESHOLD / 2) return styles.barMid;
  return styles.barWeak;
}

/**
 * A single team's result. The short summary is always visible so the result is
 * understandable without any clicks; the analysis report expands in place
 * below it — it never navigates away or affects the other team's card.
 */
export default function TeamResultCard({ teamKey, label, name, colorVar, tintVar, overall, summary, report }) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = `team-report-${teamKey}`;
  const buttonId = `team-report-button-${teamKey}`;

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

      {report && (
        <>
          <button
            type="button"
            id={buttonId}
            className={`${styles.reportToggle} ${isOpen ? styles.reportToggleOpen : ""}`}
            aria-expanded={isOpen}
            aria-controls={panelId}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <span className={`${styles.toggleArrow} ${isOpen ? styles.toggleArrowOpen : ""}`} aria-hidden="true">
              <ChevronDown size={18} />
            </span>
            {isOpen ? "إخفاء التقرير" : "تقرير التحليل"}
          </button>

          {isOpen && (
            <div id={panelId} role="region" aria-labelledby={buttonId} className={styles.report}>
              <TeamReport report={report} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function TeamReport({ report }) {
  const {
    traits,
    maxValue,
    mood,
    camelCount,
    aboveAverageCount,
    strongTraitCount,
    undetectedCount,
    traitCount,
    edges,
    otherName,
  } = report;

  return (
    <>
      <div className={styles.mood}>
        <div className={styles.moodLabel}>طابع المنقية</div>
        <div className={styles.moodText}>{mood || "لم تبرز صفة مميزة في هذه المنقية"}</div>
      </div>

      <div className={styles.traitsLabel}>الصفات الثمانية</div>

      <div className={styles.traits}>
        {traits.map((trait) => {
          const isUndetected = trait.value === 0;
          const width = maxValue > 0 ? Math.max((trait.value / maxValue) * 100, 3) : 0;

          return (
            <div className={styles.traitRow} key={trait.key}>
              <span className={`${styles.traitName} ${isUndetected ? styles.traitNameMuted : ""}`}>{trait.name}</span>
              <span className={styles.barTrack}>
                {!isUndetected && <span className={`${styles.barFill} ${traitTier(trait.value)}`} style={{ width: `${width}%` }} />}
              </span>
              <span className={`${styles.traitValue} ${isUndetected ? styles.traitNameMuted : ""}`}>
                {isUndetected ? "—" : trait.value}
              </span>
            </div>
          );
        })}
      </div>

      <div className={styles.stats}>
        <div className={`${styles.stat} ${styles.statTeam}`}>
          <div className={styles.statValue}>{aboveAverageCount}</div>
          <div className={styles.statLabel}>
            نوق فوق المتوسط
            <br />
            من {camelCount}
          </div>
        </div>

        <div className={`${styles.stat} ${styles.statGold}`}>
          <div className={styles.statValue}>{strongTraitCount}</div>
          <div className={styles.statLabel}>
            صفات قوية
            <br />
            من {traitCount}
          </div>
        </div>

        <div className={`${styles.stat} ${styles.statMuted}`}>
          <div className={styles.statValue}>{undetectedCount}</div>
          <div className={styles.statLabel}>
            صفات لم تُرصد
            <br />
            من {traitCount}
          </div>
        </div>
      </div>

      {edges.length > 0 && (
        <div className={styles.edges}>
          <div className={styles.edgesTitle}>
            <TrophyIcon size={15} />
            <span>الفارق عن {otherName}</span>
          </div>

          {edges.map((edge) => (
            <div className={styles.edgeRow} key={edge.name}>
              <span>{edge.name}</span>
              <span className={styles.edgeValue}>
                {edge.delta > 0 ? `أعلى بـ ${edge.delta}` : `أقل بـ ${Math.abs(edge.delta)}`}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}