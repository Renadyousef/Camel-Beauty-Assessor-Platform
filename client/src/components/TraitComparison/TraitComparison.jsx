import styles from "./TraitComparison.module.css";

export default function TraitComparison({ team1Name, team2Name, traits }) {
  return (
    <section className={styles.section} aria-labelledby="trait-comparison-title">
      <div className={styles.eyebrow}>مقارنة الصفات</div>
      <h2 id="trait-comparison-title" className={styles.title}>
        مقارنة الصفات الثمانية
      </h2>

      <div className={styles.card}>
        <div className={`${styles.row} ${styles.headerRow}`}>
          <div className={styles.headerTraitLabel}>الصفة</div>
          <div className={styles.headerTeam} style={{ color: "var(--color-team-one)" }}>
            <span className={styles.headerDot} style={{ background: "var(--color-team-one)" }} />
            {team1Name}
          </div>
          <div className={styles.headerTeam} style={{ color: "var(--color-team-two)" }}>
            <span className={styles.headerDot} style={{ background: "var(--color-team-two)" }} />
            {team2Name}
          </div>
        </div>

        {traits.map((t) => {
          const t1Wins = t.t1 >= t.t2;
          const isTie = t.t1 === t.t2;
          return (
            <div className={styles.row} key={t.key}>
              <div className={styles.traitName}>{t.name}</div>
              <TraitCell value={t.t1} pct={t.t1} isWinner={!isTie && t1Wins} color="var(--color-team-one)" />
              <TraitCell value={t.t2} pct={t.t2} isWinner={!isTie && !t1Wins} color="var(--color-team-two)" />
            </div>
          );
        })}
      </div>
    </section>
  );
}

function TraitCell({ value, pct, isWinner, color }) {
  return (
    <div className={styles.cell}>
      <div className={styles.valueRow}>
        <span className={`${styles.value} ${isWinner ? styles.valueWinner : ""}`} style={{ color }}>
          {value}
        </span>
        {isWinner && <span className={styles.winnerTag}>الأعلى</span>}
      </div>
      <div className={styles.bar}>
        <div className={styles.barFill} style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
