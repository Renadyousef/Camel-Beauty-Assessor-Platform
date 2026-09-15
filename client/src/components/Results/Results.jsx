import { useState } from "react";
import Button from "../Button/Button";
import TeamResultCard from "../TeamResultCard/TeamResultCard";
import TopCamels from "../TopCamels/TopCamels";
import { ChevronDown, InfoIcon, PlusIcon, TrophyIcon } from "../../icons";
import styles from "./Results.module.css";

// On this screen only, colour follows the outcome rather than which team was
// entered first: petrol teal for a win (and for both sides of a tie, where
// neither lost), oxblood for the lower score. Teal reads as a cold colour
// against the warm oxblood, so the two are told apart at a glance — gold sits
// too close to oxblood to carry that contrast. The same pair is reused by the
// top-3 lists below so one team reads as one colour down the whole page.
function outcomeColors(isWinner, isTie) {
  if (isTie || isWinner) {
    return { colorVar: "var(--color-team-two)", tintVar: "var(--color-team-two-tint)" };
  }
  return { colorVar: "var(--color-team-one)", tintVar: "var(--color-team-one-tint)" };
}

function scoreMargin(overall1, overall2) {
  const diff = Math.round(Math.abs(overall1 - overall2) * 10) / 10;
  return diff === 0 ? "بنتيجة متعادلة" : `بفارق ${diff} نقاط`;
}

/**
 * `results` is produced by adaptApiResponse() (src/services/adaptApiResponse.js),
 * in the same shape buildResults() (src/data/mockResults.js) originally
 * defined. `onNewComparison` resets the app back to Setup — this is the
 * only screen it makes sense on, since there is no history/save to lose by
 * leaving.
 */
export default function Results({ teams, images, results, onNewComparison }) {
  // The winner's reason is opened by default — it's the direct answer to
  // "why did this one win" — while the other side stays collapsed so the
  // page doesn't force everyone to read both explanations up front.
  const [openReason, setOpenReason] = useState(
    results.isTie ? null : results.team1.isWinner ? "team1" : "team2",
  );

  // In a tie both teams share the same overall score, so either side's
  // value is the shared score — this never singles out a winner.
  const winnerScore = results.isTie
    ? results.team1.overall
    : results.team1.isWinner
      ? results.team1.overall
      : results.team2.overall;

  const team1Colors = outcomeColors(results.team1.isWinner, results.isTie);
  const team2Colors = outcomeColors(results.team2.isWinner, results.isTie);

  return (
    <div className={styles.content}>
      {/* 1. PREDICTED RESULT SUMMARY */}
      <section className={styles.finalResult} aria-labelledby="final-result-title">
        <h2 id="final-result-title" className={styles.sectionTitleCenter}>
          النتيجة المتوقعة
        </h2>

        <div className={styles.winnerHero}>
          {results.isTie ? (
            <p className={styles.winnerLine}>
              النتيجة: <strong className={styles.winnerName}>{results.winnerName}</strong>
            </p>
          ) : (
            <>
              <div className={styles.winnerTrophy}>
                <TrophyIcon size={22} />
              </div>
              <p className={styles.winnerLine}>
                الفائز المتوقع: <strong className={styles.winnerName}>{results.winnerName}</strong>
              </p>
            </>
          )}
          <div className={styles.winnerScore}>
            {winnerScore} <span className={styles.winnerScoreMax}>/ 100</span>
          </div>
          <div className={styles.winnerMargin}>{scoreMargin(results.team1.overall, results.team2.overall)}</div>
        </div>

        <div className={styles.teamCards}>
          <TeamResultCard
            teamKey="team1"
            label="المنقية الأولى"
            name={results.team1.name}
            colorVar={team1Colors.colorVar}
            tintVar={team1Colors.tintVar}
            overall={results.team1.overall}
            summary={results.summaries.team1}
            report={results.reports?.team1}
          />

          <TeamResultCard
            teamKey="team2"
            label="المنقية الثانية"
            name={results.team2.name}
            colorVar={team2Colors.colorVar}
            tintVar={team2Colors.tintVar}
            overall={results.team2.overall}
            summary={results.summaries.team2}
            report={results.reports?.team2}
          />
        </div>

        <div className={styles.disclaimer}>
          <InfoIcon size={16} />
          <span className={styles.disclaimerText}>
            هذه النتيجة مدعومة بالذكاء الاصطناعي وتقدم كأداة مساندة للجنة التحكيم، ولا تغني عن التقييم الرسمي للجنة.
          </span>
        </div>
      </section>

      {/* 2. TOP 3 CAMELS */}
      <TopCamels
        team1Name={teams.team1.name}
        team2Name={teams.team2.name}
        topCamels={results.topCamels}
        images={images}
        team1Colors={team1Colors}
        team2Colors={team2Colors}
      />

      {/* 3. WHY EACH TEAM SCORED THE WAY IT DID */}
      <section className={styles.reasonsSection} aria-labelledby="reasons-title">
        <div className={styles.eyebrow}>الأسباب</div>
        <h2 id="reasons-title" className={styles.sectionTitle}>
          أسباب النتيجة
        </h2>

        <div className={styles.reasonsList}>
          <ReasonRow
            teamKey="team1"
            colorVar="var(--color-team-one)"
            heading={results.headings.team1}
            body={results.explanations.team1}
            isOpen={openReason === "team1"}
            onToggle={() => setOpenReason((prev) => (prev === "team1" ? null : "team1"))}
          />
          <ReasonRow
            teamKey="team2"
            colorVar="var(--color-team-two)"
            heading={results.headings.team2}
            body={results.explanations.team2}
            isOpen={openReason === "team2"}
            onToggle={() => setOpenReason((prev) => (prev === "team2" ? null : "team2"))}
          />
        </div>
      </section>

      {onNewComparison && (
        <div className={styles.newComparison}>
          <Button variant="secondary" size="md" onClick={onNewComparison}>
            <PlusIcon size={16} />
            بدء مقارنة جديدة
          </Button>
        </div>
      )}
    </div>
  );
}

function ReasonRow({ teamKey, colorVar, heading, body, isOpen, onToggle }) {
  const buttonId = `reason-button-${teamKey}`;
  const panelId = `reason-panel-${teamKey}`;

  return (
    <div className={styles.reasonRow} style={{ "--team-color": colorVar }}>
      <button
        type="button"
        id={buttonId}
        className={styles.reasonHeader}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className={styles.reasonHeaderText}>{heading}</span>
        <span className={`${styles.reasonArrow} ${isOpen ? styles.reasonArrowOpen : ""}`} aria-hidden="true">
          <ChevronDown size={20} />
        </span>
      </button>

      {isOpen && (
        <div id={panelId} role="region" aria-labelledby={buttonId} className={styles.reasonBody}>
          <p>{body}</p>
        </div>
      )}
    </div>
  );
}