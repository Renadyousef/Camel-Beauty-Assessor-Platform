import { buildResults, STRONG_TRAIT_THRESHOLD, TRAITS, TRAIT_DESCRIPTORS } from "../data/mockResults";

// Backend YOLO class names -> frontend TRAITS keys. Confirmed against a real
// /winner-camels response — these do NOT match the frontend keys directly,
// so this mapping must stay explicit rather than assumed/derived.
const TRAIT_KEY_MAP = {
  High_withers: "withers",
  "Large-head": "head",
  "Large-lips": "lips",
  "Large-nose": "nose",
  Large_hump: "hump",
  "Long-legs": "legs",
  "Long-neck": "neck",
  Wide_body: "body",
};

function round1(n) {
  return Math.round(n * 10) / 10;
}

function toTraitScores(team1Averages = {}, team2Averages = {}) {
  const scores = {};
  TRAITS.forEach(({ key }) => {
    scores[key] = { team1: 0, team2: 0 };
  });

  Object.entries(team1Averages).forEach(([backendKey, value]) => {
    const key = TRAIT_KEY_MAP[backendKey];
    if (key) scores[key].team1 = value;
  });
  Object.entries(team2Averages).forEach(([backendKey, value]) => {
    const key = TRAIT_KEY_MAP[backendKey];
    if (key) scores[key].team2 = value;
  });

  return scores;
}

function toTopCamels(topCamels = []) {
  return topCamels.map((camel) => ({
    camelNumber: camel.camel_number,
    score: camel.normalized_score,
  }));
}

/**
 * Everything the per-team analysis report needs, derived only from what the
 * backend already returns — no extra requests and no change to how the winner
 * is decided. `averages` / `otherAverages` are the raw backend-keyed
 * trait_averages objects.
 */
function buildTeamReport({ camels = [], averages = {}, otherAverages = {}, otherName }) {
  // 1. The eight traits, highest first, with the display names from TRAITS.
  const traits = TRAITS.map(({ key, name }) => {
    const backendKey = Object.keys(TRAIT_KEY_MAP).find((k) => TRAIT_KEY_MAP[k] === key);
    return { key, name, backendKey, value: round1(averages[backendKey] ?? 0) };
  }).sort((a, b) => b.value - a.value);

  const maxValue = traits[0]?.value ?? 0;

  // 2. Strong traits: one fixed bar (STRONG_TRAIT_THRESHOLD) applied to the
  //    whole team, so "strong" means the same thing in every team, in the
  //    character line, in the counter and in the bar shading.
  const strongTraits = traits.filter((t) => t.value >= STRONG_TRAIT_THRESHOLD);

  // 3. Character line — only genuinely strong traits earn a description. A
  //    team with nothing above the bar is described as having none rather
  //    than being flattered with its least-weak traits.
  const mood = strongTraits
    .slice(0, 3)
    .map((t) => TRAIT_DESCRIPTORS[t.key])
    .join("، ");

  // 4. Camels above their own team's average — a measure of how even the
  //    team is internally, deliberately relative rather than fixed.
  const scores = camels.map((camel) => camel.normalized_score ?? 0);
  const teamAverage = scores.length > 0 ? scores.reduce((sum, v) => sum + v, 0) / scores.length : 0;
  const aboveAverageCamels = camels.filter((camel) => (camel.normalized_score ?? 0) > teamAverage);

  // 5. Traits the model never picked up anywhere in this team.
  const undetectedCount = traits.filter((t) => t.value === 0).length;

  // 6. The three traits where this team differs most from the other one —
  //    the decisive gaps, in this team's favour or against it.
  const edges = traits
    .map((t) => ({
      name: t.name,
      delta: round1(t.value - round1(otherAverages[t.backendKey] ?? 0)),
    }))
    .filter((edge) => edge.delta !== 0)
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
    .slice(0, 3);

  return {
    traits: traits.map(({ key, name, value }) => ({ key, name, value })),
    maxValue,
    mood,
    camelCount: camels.length,
    aboveAverageCount: aboveAverageCamels.length,
    strongTraitCount: strongTraits.length,
    undetectedCount,
    traitCount: TRAITS.length,
    edges,
    otherName,
  };
}

const TIE_LABEL = "تعادل";
const TIE_EXPLANATION =
  "حصلت المنقيتان على نفس المتوسط الإجمالي في هذه المقارنة، ولم تتفوق إحداهما على الأخرى في النتيجة النهائية.";

/**
 * Converts a real POST /winner-camels response into the exact shape
 * Results.jsx already consumes (the shape buildResults() produces), plus a
 * `reports` entry per team for the in-card analysis report. Falls back to
 * buildResults()'s own generated Arabic explanation/heading/summary text —
 * driven by the real trait scores, not mock numbers — whenever the Gemini
 * report isn't usable.
 */
export function adaptApiResponse(apiResult, { team1Name, team2Name }) {
  const { team1: apiTeam1, team2: apiTeam2, winner, llm_report: llmReport } = apiResult;

  const name1 = apiTeam1.team_name ?? team1Name;
  const name2 = apiTeam2.team_name ?? team2Name;

  const traitScores = toTraitScores(apiTeam1.trait_averages, apiTeam2.trait_averages);
  const topCamels = {
    team1: toTopCamels(apiTeam1.top_camels),
    team2: toTopCamels(apiTeam2.top_camels),
  };

  const reports = {
    team1: buildTeamReport({
      camels: apiTeam1.camels,
      averages: apiTeam1.trait_averages,
      otherAverages: apiTeam2.trait_averages,
      otherName: name2,
    }),
    team2: buildTeamReport({
      camels: apiTeam2.camels,
      averages: apiTeam2.trait_averages,
      otherAverages: apiTeam1.trait_averages,
      otherName: name1,
    }),
  };

  const generated = buildResults({ team1Name: name1, team2Name: name2, traitScores, topCamels });

  const reportOk = llmReport?.llm_status === "ok";
  const isTie = winner === "Tie";
  const team1IsWinner = !isTie && winner === name1;
  const team2IsWinner = !isTie && winner === name2;

  // A tie has no "winning side", so it never uses buildResults()'s
  // winner/loser-framed heading, explanation, or summary text — those are
  // replaced with neutral, team-agnostic copy instead.
  const tieExplanation = reportOk && llmReport.winner_reason ? llmReport.winner_reason : TIE_EXPLANATION;

  return {
    ...generated,
    team1: { name: name1, overall: apiTeam1.overall_score, isWinner: team1IsWinner },
    team2: { name: name2, overall: apiTeam2.overall_score, isWinner: team2IsWinner },
    // Passed through as the backend returned it, translated for display —
    // never overwritten with a guessed winner.
    winnerName: isTie ? TIE_LABEL : winner,
    isTie,
    headings: isTie
      ? {
          team1: `أداء ${name1} في هذه المقارنة`,
          team2: `أداء ${name2} في هذه المقارنة`,
        }
      : generated.headings,
    explanations: isTie
      ? { team1: tieExplanation, team2: tieExplanation }
      : {
          team1: reportOk ? llmReport.team1_report : generated.explanations.team1,
          team2: reportOk ? llmReport.team2_report : generated.explanations.team2,
        },
    summaries: isTie
      ? {
          team1: `حقق ${name1} نتيجة متعادلة مع ${name2}.`,
          team2: `حقق ${name2} نتيجة متعادلة مع ${name1}.`,
        }
      : generated.summaries,
    // Not yet rendered anywhere in Results.jsx — see integration summary.
    winnerReason: reportOk ? llmReport.winner_reason : undefined,
    topCamels,
    reports,
  };
}