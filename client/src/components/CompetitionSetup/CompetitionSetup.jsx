import { useState } from "react";
import Button from "../Button/Button";
import { ChevronLeftIcon } from "../../icons";
import styles from "./CompetitionSetup.module.css";

const emptyTeam = { name: "", owner: "" };

export default function CompetitionSetup({ onNext }) {
  const [team1, setTeam1] = useState(emptyTeam);
  const [team2, setTeam2] = useState(emptyTeam);

  const canContinue = team1.name.trim().length > 0 && team2.name.trim().length > 0;

  function handleSubmit(e) {
    e.preventDefault();
    if (!canContinue) return;
    onNext(
      { name: team1.name.trim(), owner: team1.owner.trim() },
      { name: team2.name.trim(), owner: team2.owner.trim() },
    );
  }

  return (
    <form className={styles.page} onSubmit={handleSubmit}>
      <div className={styles.intro}>
        <h1 className={styles.title}>إعداد المنافسة</h1>
        <p className={styles.subtitle}>أدخل بيانات المنقيتين المشاركتين في المقارنة.</p>
        <div className={styles.divider} aria-hidden="true">
          <span className={styles.dividerLine} />
          <span className={styles.dividerDiamond} />
          <span className={styles.dividerLine} />
        </div>
      </div>

      <div className={styles.cards}>
        <TeamCard
          label="المنقية الأولى"
          colorVar="var(--color-team-one)"
          values={team1}
          onChange={setTeam1}
          namePlaceholder="مثال: مداويات"
          ownerPlaceholder="مثال: عبدالله القحطاني"
        />

        <div className={styles.vsRow} aria-hidden="true">
          <span className={styles.vsRowLine} />
          <span className={styles.vsRowLabel}>مقابل</span>
          <span className={styles.vsRowLine} />
        </div>

        <TeamCard
          label="المنقية الثانية"
          colorVar="var(--color-team-two)"
          values={team2}
          onChange={setTeam2}
          namePlaceholder="مثال: النادرات"
          ownerPlaceholder="مثال: محمد المطيري"
        />
      </div>

      <div className={styles.actions}>
        <Button type="submit" size="lg" disabled={!canContinue}>
          التالي
          <ChevronLeftIcon size={18} />
        </Button>
        {!canContinue && <div className={styles.helper}>يصبح الزر نشطًا بعد إدخال اسم المنقيتين</div>}
      </div>

      <div className={styles.footer}>
        <div className={styles.divider} aria-hidden="true">
          <span className={styles.dividerLine} />
          <span className={styles.dividerDiamond} />
          <span className={styles.dividerLine} />
        </div>
        <p className={styles.footerTagline}>
          مقارنة عادلة وموضوعية بين الإبل المشاركة باستخدام تقنيات الذكاء الاصطناعي
        </p>
      </div>
    </form>
  );
}

function TeamCard({ label, colorVar, values, onChange, namePlaceholder, ownerPlaceholder }) {
  const nameId = `${label}-name`;
  const ownerId = `${label}-owner`;

  return (
    <div className={styles.card} style={{ "--team-color": colorVar }}>
      <div className={styles.cardHead}>
        <span className={styles.dot} />
        <span className={styles.cardLabel}>{label}</span>
      </div>

      <div className={styles.field}>
        <label className={styles.fieldLabel} htmlFor={nameId}>
          اسم المنقية <span className={styles.required}>*</span>
        </label>
        <input
          id={nameId}
          className={styles.input}
          placeholder={namePlaceholder}
          value={values.name}
          onChange={(e) => onChange({ ...values, name: e.target.value })}
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.fieldLabel} htmlFor={ownerId}>
          مالك المنقية <span className={styles.optional}>(اختياري)</span>
        </label>
        <input
          id={ownerId}
          className={styles.input}
          placeholder={ownerPlaceholder}
          value={values.owner}
          onChange={(e) => onChange({ ...values, owner: e.target.value })}
        />
      </div>
    </div>
  );
}
