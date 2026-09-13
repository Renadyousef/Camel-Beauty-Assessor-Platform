import { buildResults, TRAITS } from "../data/mockResults";

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

const TIE_LABEL = "تعادل";
const TIE_EXPLANATION =
  "حصلت المنقيتان على نفس المتوسط الإجمالي في هذه المقارنة، ولم تتفوق إحداهما على الأخرى في النتيجة النهائية.";

/**
 * Converts a real POST /winner-camels response into the exact shape
 * Results.jsx already consumes (the shape buildResults() produces), so no
 * UI component needs to change. Falls back to buildResults()'s own
 * generated Arabic explanation/heading/summary text — driven by the real
 * trait scores, not mock numbers — whenever the Gemini report isn't usable.
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
  };
}
