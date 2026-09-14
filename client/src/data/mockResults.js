// ---------------------------------------------------------------------------
// MOCK RESULT DATA — this whole file is where the frontend stands in for the
// real Computer Vision model.
//
// ► TO CONNECT THE REAL AI LATER:
//   Replace TRAIT_DEFINITIONS' t1/t2 numbers (and whatever calls
//   buildResults()) with the response from your analysis API. buildResults()
//   itself has no knowledge of "mock" data — feed it real per-trait scores
//   for team1/team2 and it will compute overall averages, the winner, and
//   the explanation text the same way. The only thing to swap is where the
//   trait scores below come from.
// ---------------------------------------------------------------------------

// These 8 keys mirror the computer-vision model's trait schema exactly (see
// camel-beauty-assessor/dataset_eda.ipynb — the canonical 9-class list, minus
// "Camel" itself), so a real API response drops in without renaming anything
// here or in TraitComparison / TopCamels.
export const TRAITS = [
  { key: "withers", name: "الغارب" },
  { key: "head", name: "الرأس" },
  { key: "lips", name: "المشافر" },
  { key: "nose", name: "الخشم" },
  { key: "hump", name: "السنام" },
  { key: "legs", name: "السيقان" },
  { key: "neck", name: "الرقبة" },
  { key: "body", name: "الجنب" },
];
// Bedouin-style descriptor for each trait, used to phrase a team's character
// ("طابع المنقية") in its analysis report instead of repeating the numbers.
export const TRAIT_DESCRIPTORS = {
  withers: "مرتفعة الغارب",
  head: "كبيرة الرأس",
  lips: "متهدلة المشافر",
  nose: "بارزة الخشم",
  hump: "عالية السنام",
  legs: "طويلة السيقان",
  neck: "طويلة الرقبة",
  body: "واسعة الجنب",
};

// A trait counts as "strong" at or above this percentage. Set deliberately
// high: in a real mazayin the teams are competing camels, so only a clearly
// dominant trait should be called a strength.
export const STRONG_TRAIT_THRESHOLD = 45;

// Mock per-trait scores (out of 100). Swap for the real model's output.
const MOCK_TRAIT_SCORES = {
  withers: { team1: 86, team2: 81 },
  head: { team1: 88, team2: 84 },
  lips: { team1: 90, team2: 79 },
  nose: { team1: 82, team2: 80 },
  hump: { team1: 80, team2: 89 },
  legs: { team1: 84, team2: 82 },
  neck: { team1: 91, team2: 76 },
  body: { team1: 83, team2: 85 },
};

// Mock "top 3 camels" — references camel numbers (1-20) into whichever
// images the judge actually uploaded for that team, plus a mock score.
const MOCK_TOP_CAMELS = {
  team1: [
    { camelNumber: 7, score: 91.4 },
    { camelNumber: 12, score: 89.7 },
    { camelNumber: 3, score: 88.2 },
  ],
  team2: [
    { camelNumber: 16, score: 90.1 },
    { camelNumber: 5, score: 87.4 },
    { camelNumber: 11, score: 86.9 },
  ],
};

function average(values) {
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function round1(n) {
  return Math.round(n * 10) / 10;
}

/**
 * Builds everything the Results screen needs from raw per-trait scores.
 * Pure function — no dependency on mock data, so it's the seam where a real
 * API response can be substituted for MOCK_TRAIT_SCORES / MOCK_TOP_CAMELS.
 */
export function buildResults({
  team1Name,
  team2Name,
  traitScores = MOCK_TRAIT_SCORES,
  topCamels = MOCK_TOP_CAMELS,
} = {}) {
  const traits = TRAITS.map((t) => ({
    ...t,
    t1: traitScores[t.key].team1,
    t2: traitScores[t.key].team2,
  }));

  const overall1 = round1(average(traits.map((t) => t.t1)));
  const overall2 = round1(average(traits.map((t) => t.t2)));
  const team1IsWinner = overall1 >= overall2;

  const winnerName = team1IsWinner ? team1Name : team2Name;
  const loserName = team1IsWinner ? team2Name : team1Name;

  // Traits sorted by how much the winner leads by (winner's real strengths).
  const winnerAdvantage = [...traits].sort((a, b) => {
    const diffA = team1IsWinner ? a.t1 - a.t2 : a.t2 - a.t1;
    const diffB = team1IsWinner ? b.t1 - b.t2 : b.t2 - b.t1;
    return diffB - diffA;
  });
  // Traits sorted by how much the loser leads by (loser's real strengths).
  const loserAdvantage = [...traits].sort((a, b) => {
    const diffA = team1IsWinner ? a.t2 - a.t1 : a.t1 - a.t2;
    const diffB = team1IsWinner ? b.t2 - b.t1 : b.t1 - b.t2;
    return diffB - diffA;
  });

  const winnerTopTraits = winnerAdvantage.slice(0, 2).map((t) => t.name);
  const loserTopTraits = loserAdvantage.slice(0, 2).map((t) => t.name);

  const winnerExplanation =
    `أظهر ${winnerName} أداءً أقوى في صفتَي ${winnerTopTraits[0]} و${winnerTopTraits[1]}، ` +
    `كما حقق نتائج أعلى في معظم الصفات الثمانية. ورغم تفوّق ${loserName} في بعض الجوانب، ` +
    `حافظ ${winnerName} على متوسط إجمالي أعلى، مما منحه الأفضلية في هذه المقارنة.`;

  const loserExplanation =
    `حقق ${loserName} أداءً قويًا في ${loserTopTraits[0]} و${loserTopTraits[1]}، إلا أن متوسطه ` +
    `كان أقل في ${winnerTopTraits[0]} و${winnerTopTraits[1]} وبعض الصفات الأخرى، ` +
    `مما خفّض نتيجته الإجمالية مقارنة بـ${winnerName}.`;

  // Short, single-sentence versions for the always-visible result summary
  // (the longer explanations above stay for anywhere that still wants the
  // fuller "why" text).
  const winnerSummary = `تميّز ${winnerName} في ${winnerTopTraits[0]} و${winnerTopTraits[1]} وحقق أعلى متوسط إجمالي.`;
  const loserSummary = `حقق ${loserName} نتائج قوية في عدد من الصفات، بمتوسط إجمالي أقل من ${winnerName}.`;

  return {
    traits,
    team1: { name: team1Name, overall: overall1, isWinner: team1IsWinner },
    team2: { name: team2Name, overall: overall2, isWinner: !team1IsWinner },
    winnerName,
    explanations: {
      team1: team1IsWinner ? winnerExplanation : loserExplanation,
      team2: team1IsWinner ? loserExplanation : winnerExplanation,
    },
    headings: {
      team1: team1IsWinner ? `لماذا تصدّر ${team1Name}؟` : `ما الذي أثّر على نتيجة ${team1Name}؟`,
      team2: team1IsWinner ? `ما الذي أثّر على نتيجة ${team2Name}؟` : `لماذا تصدّر ${team2Name}؟`,
    },
    summaries: {
      team1: team1IsWinner ? winnerSummary : loserSummary,
      team2: team1IsWinner ? loserSummary : winnerSummary,
    },
    topCamels,
  };
}
