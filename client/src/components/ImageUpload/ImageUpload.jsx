import Button from "../Button/Button";
import TeamUploadPanel from "../TeamUploadPanel/TeamUploadPanel";
import { AlertIcon } from "../../icons";
import { TEAM_SIZE } from "../../config";
import styles from "./ImageUpload.module.css";

export default function ImageUpload({ teams, images, onSelect, onSelectMany, onAnalyze, uploadError, onDismissError }) {
  const team1Count = images.team1.filter(Boolean).length;
  const team2Count = images.team2.filter(Boolean).length;
  const bothComplete = team1Count === TEAM_SIZE && team2Count === TEAM_SIZE;

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.intro}>
          <h1 className={styles.title}>رفع صور الإبل</h1>
          <p className={styles.subtitle}>صورة واحدة واضحة لكل جمل — {TEAM_SIZE} صورة لكل منقية.</p>
        </div>

        {uploadError && (
          <div className={styles.errorBanner} role="alert">
            <span className={styles.errorIcon}>
              <AlertIcon size={14} />
            </span>
            <span className={styles.errorMessage}>{uploadError.message}</span>
            <button type="button" className={styles.errorDismiss} onClick={onDismissError}>
              إغلاق
            </button>
          </div>
        )}

        <div className={styles.panels}>
          <TeamUploadPanel
            label="المنقية الأولى"
            teamName={teams.team1.name}
            colorVar="var(--color-team-one)"
            images={images.team1}
            onSelect={(index, file) => onSelect("team1", index, file)}
            onSelectMany={(files) => onSelectMany("team1", files)}
            errorSlot={uploadError?.team === "team1" ? uploadError : undefined}
          />

          <TeamUploadPanel
            label="المنقية الثانية"
            teamName={teams.team2.name}
            colorVar="var(--color-team-two)"
            images={images.team2}
            onSelect={(index, file) => onSelect("team2", index, file)}
            onSelectMany={(files) => onSelectMany("team2", files)}
            errorSlot={uploadError?.team === "team2" ? uploadError : undefined}
          />
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.bottomMessage}>
          {bothComplete ? "المنقيتان جاهزتان للتحليل." : `يجب رفع ${TEAM_SIZE} صورة لكل منقية لبدء التحليل.`}
        </div>
        <Button size="lg" disabled={!bothComplete} onClick={onAnalyze}>
          بدء التحليل
        </Button>
      </div>
    </div>
  );
}