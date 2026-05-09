export const PERIODS = [
  { id: "1w", label: "1주" },
  { id: "1m", label: "1개월" },
  { id: "3m", label: "3개월" },
];

export const MARKETS = [
  { id: "all", label: "한국+미국" },
  { id: "US", label: "미국" },
  { id: "KR", label: "한국" },
];

const leaderSeries = [
  { symbol: "NVDA", name: "엔비디아", color: "#139a43", points: [0, 3.5, 5.0, 6.8, 8.9, 10.7] },
  { symbol: "AVGO", name: "브로드컴", color: "#1463d8", points: [0, 2.8, 4.3, 6.1, 8.2, 9.8] },
  { symbol: "VRT", name: "버티브", color: "#8a3fd0", points: [0, 5.1, 8.4, 9.3, 10.6, 13.1] },
  { symbol: "ANET", name: "아리스타", color: "#f18a18", points: [0, 1.8, 2.9, 4.2, 6.0, 7.4] },
  { symbol: "AMD", name: "AMD", color: "#21a6a8", points: [0, 1.0, 1.8, 3.0, 4.8, 5.2] },
];

export const themes = [
  {
    id: "ai-server",
    name: "AI 서버",
    category: "AI 인프라",
    markets: ["US", "KR"],
    keywords: ["gpu", "cloud", "nvidia", "ai"],
    periods: {
      "1w": { score: 92, change: 11, money: "+2.38조원", rank: 1, previousRank: 2 },
      "1m": { score: 94, change: 26, money: "+8.72조원", rank: 1, previousRank: 3 },
      "3m": { score: 91, change: 38, money: "+14.4조원", rank: 1, previousRank: 4 },
    },
    leaders: [
      { rank: 1, name: "엔비디아", symbol: "NVDA", market: "US", price: "1,064.69", change: 8.27, turnover: "42.8조" },
      { rank: 2, name: "브로드컴", symbol: "AVGO", market: "US", price: "1,523.48", change: 7.34, turnover: "18.6조" },
      { rank: 3, name: "버티브", symbol: "VRT", market: "US", price: "107.35", change: 12.41, turnover: "6.2조" },
      { rank: 4, name: "아리스타", symbol: "ANET", market: "US", price: "356.78", change: 6.91, turnover: "4.3조" },
      { rank: 5, name: "AMD", symbol: "AMD", market: "US", price: "169.24", change: 5.82, turnover: "7.1조" },
    ],
    challengers: [
      { name: "버티브", symbol: "VRT", note: "전력·냉각 수요가 같이 붙으며 2주 연속 가속" },
      { name: "슈나이더 일렉트릭", symbol: "SU", note: "데이터센터 전력 장비 수요 반영" },
      { name: "슈퍼마이크로컴", symbol: "SMCI", note: "서버 랙 수요 회복 신호" },
    ],
    rotation: {
      summary: "3종목 신규 진입",
      in: ["버티브 (VRT)", "슈나이더 일렉트릭 (SU)", "슈퍼마이크로컴 (SMCI)"],
      out: ["델 테크놀로지스 (DELL)", "인텔 (INTC)"],
    },
    insight: "AI 서버 수요 확대에 따라 전력·냉각 솔루션 기업의 강세 지속",
  },
  {
    id: "power-grid",
    name: "전력 인프라",
    category: "인프라",
    markets: ["US", "KR"],
    keywords: ["power", "electric", "grid", "transformer"],
    periods: {
      "1w": { score: 88, change: 9, money: "+1.91조원", rank: 2, previousRank: 1 },
      "1m": { score: 89, change: 22, money: "+6.14조원", rank: 2, previousRank: 4 },
      "3m": { score: 86, change: 33, money: "+10.9조원", rank: 2, previousRank: 5 },
    },
    leaders: [
      { rank: 1, name: "GE 버노바", symbol: "GEV", market: "US", price: "253.42", change: 7.94, turnover: "5.8조" },
      { rank: 2, name: "HD현대일렉트릭", symbol: "267260", market: "KR", price: "418,000", change: 6.78, turnover: "3,920억" },
      { rank: 3, name: "효성중공업", symbol: "298040", market: "KR", price: "506,000", change: 4.83, turnover: "2,840억" },
      { rank: 4, name: "이튼", symbol: "ETN", market: "US", price: "331.16", change: 4.21, turnover: "2.7조" },
      { rank: 5, name: "LS ELECTRIC", symbol: "010120", market: "KR", price: "179,300", change: 3.48, turnover: "1,780억" },
    ],
    challengers: [
      { name: "HD현대일렉트릭", symbol: "267260", note: "변압기 수출 모멘텀 재부각" },
      { name: "효성중공업", symbol: "298040", note: "북미 전력망 교체 수요 반영" },
    ],
    rotation: {
      summary: "한국 변압기 2종목 강세",
      in: ["HD현대일렉트릭", "효성중공업"],
      out: ["넥스트에라 에너지"],
    },
    insight: "AI 데이터센터 전력 수요가 전력망·변압기 테마를 밀어 올리는 중",
  },
  {
    id: "hbm",
    name: "HBM",
    category: "반도체",
    markets: ["KR", "US"],
    keywords: ["memory", "dram", "hynix", "semiconductor"],
    periods: {
      "1w": { score: 84, change: 8, money: "+1.44조원", rank: 3, previousRank: 4 },
      "1m": { score: 86, change: 19, money: "+5.28조원", rank: 3, previousRank: 5 },
      "3m": { score: 89, change: 41, money: "+11.2조원", rank: 1, previousRank: 3 },
    },
    leaders: [
      { rank: 1, name: "SK하이닉스", symbol: "000660", market: "KR", price: "221,000", change: 6.22, turnover: "8,420억" },
      { rank: 2, name: "마이크론", symbol: "MU", market: "US", price: "124.88", change: 5.14, turnover: "4.1조" },
      { rank: 3, name: "한미반도체", symbol: "042700", market: "KR", price: "151,200", change: 4.88, turnover: "2,990억" },
      { rank: 4, name: "삼성전자", symbol: "005930", market: "KR", price: "79,400", change: 2.14, turnover: "1.1조" },
      { rank: 5, name: "테크윙", symbol: "089030", market: "KR", price: "64,200", change: 3.77, turnover: "1,040억" },
    ],
    challengers: [
      { name: "한미반도체", symbol: "042700", note: "후공정 장비 수주 기대 재점화" },
      { name: "테크윙", symbol: "089030", note: "검사 장비 수요 확대" },
    ],
    rotation: {
      summary: "후공정 장비주 재진입",
      in: ["한미반도체", "테크윙"],
      out: ["원익IPS"],
    },
    insight: "미국 AI 서버 강세가 한국 메모리·후공정 장비로 이어지는 흐름",
  },
  makeTheme("cooling", "냉각", "AI 인프라", ["US", "KR"], 77, 10, 82, 22, 80, 35),
  makeTheme("optical", "광통신", "통신장비", ["US", "KR"], 72, 6, 75, 17, 76, 31),
  makeTheme("robotics", "로봇", "자동화", ["US", "KR"], 68, 5, 70, 15, 74, 28),
  makeTheme("defense", "방산", "산업재", ["US", "KR"], 65, 3, 73, 18, 78, 34),
  makeTheme("nuclear", "원전", "에너지", ["US", "KR"], 61, 2, 67, 11, 72, 25),
  makeTheme("obesity", "비만치료제", "바이오", ["US", "KR"], 58, -1, 62, 5, 69, 22),
  makeTheme("cybersecurity", "사이버보안", "소프트웨어", ["US"], 55, 0, 64, 14, 70, 27),
  makeTheme("glass-substrate", "유리기판", "반도체", ["KR"], 53, 4, 60, 12, 68, 24),
  makeTheme("battery", "2차전지", "배터리", ["KR", "US"], 49, -3, 55, 7, 63, 18),
];

const chairPatternCandidates = [
  {
    id: "hanmi-chair",
    name: "한미반도체",
    symbol: "042700",
    market: "KR",
    themeName: "HBM",
    periodScores: { "1w": 88, "1m": 94, "3m": 91 },
    profile: {
      "1w": { returnPct: 4.9, drawdownPct: 7.8, volatilityPct: 3.7 },
      "1m": { returnPct: 15.4, drawdownPct: 16.2, volatilityPct: 5.2 },
      "3m": { returnPct: 35.8, drawdownPct: 21.5, volatilityPct: 6.4 },
    },
    setup: "급등 뒤 12거래일 받침, 거래대금 재유입",
    trigger: "전고점 근처 양봉 돌파 확인",
    risk: "받침 하단 이탈 시 제외",
  },
  {
    id: "hynix-chair",
    name: "SK하이닉스",
    symbol: "000660",
    market: "KR",
    themeName: "HBM",
    periodScores: { "1w": 86, "1m": 91, "3m": 93 },
    profile: {
      "1w": { returnPct: 5.9, drawdownPct: 4.8, volatilityPct: 2.8 },
      "1m": { returnPct: 18.7, drawdownPct: 8.9, volatilityPct: 3.9 },
      "3m": { returnPct: 43.4, drawdownPct: 12.6, volatilityPct: 4.7 },
    },
    setup: "상승 추세 유지 후 얕은 받침 형성",
    trigger: "20일선 위에서 거래대금 증가",
    risk: "이전 받침 중심선 이탈 주의",
  },
  {
    id: "hyundai-electric-chair",
    name: "HD현대일렉트릭",
    symbol: "267260",
    market: "KR",
    themeName: "전력 인프라",
    periodScores: { "1w": 84, "1m": 89, "3m": 87 },
    profile: {
      "1w": { returnPct: 3.3, drawdownPct: 8.4, volatilityPct: 3.4 },
      "1m": { returnPct: 12.1, drawdownPct: 18.7, volatilityPct: 4.8 },
      "3m": { returnPct: 25.2, drawdownPct: 24.6, volatilityPct: 5.7 },
    },
    setup: "상승 후 가격이 눕고 받침 폭 축소",
    trigger: "변압기 테마 재강세와 함께 고점 재도전",
    risk: "거래대금 없는 돌파는 보류",
  },
  {
    id: "vertiv-chair",
    name: "버티브",
    symbol: "VRT",
    market: "US",
    themeName: "AI 서버",
    periodScores: { "1w": 90, "1m": 93, "3m": 92 },
    profile: {
      "1w": { returnPct: 8.4, drawdownPct: 10.2, volatilityPct: 5.1 },
      "1m": { returnPct: 24.6, drawdownPct: 18.9, volatilityPct: 7.6 },
      "3m": { returnPct: 38.8, drawdownPct: 27.1, volatilityPct: 8.5 },
    },
    setup: "가파른 상승 후 짧은 받침과 재가속",
    trigger: "냉각 테마 동반 강세 확인",
    risk: "갭 상승 뒤 음봉 전환 주의",
  },
  {
    id: "gev-chair",
    name: "GE 버노바",
    symbol: "GEV",
    market: "US",
    themeName: "전력 인프라",
    periodScores: { "1w": 87, "1m": 90, "3m": 89 },
    profile: {
      "1w": { returnPct: 6.8, drawdownPct: 5.1, volatilityPct: 2.9 },
      "1m": { returnPct: 21.8, drawdownPct: 9.8, volatilityPct: 3.7 },
      "3m": { returnPct: 32.7, drawdownPct: 13.9, volatilityPct: 4.3 },
    },
    setup: "전력 테마 안에서 받침 구간 압축",
    trigger: "거래대금 증가와 고점권 안착",
    risk: "전력 테마 강도 하락 시 보류",
  },
];

const peerBenchmarks = {
  "HBM": {
    "1w": { returnPct: 5.6, drawdownPct: 5.9, volatilityPct: 3.1 },
    "1m": { returnPct: 18.8, drawdownPct: 10.4, volatilityPct: 4.1 },
    "3m": { returnPct: 40.9, drawdownPct: 14.8, volatilityPct: 5.0 },
  },
  "전력 인프라": {
    "1w": { returnPct: 6.0, drawdownPct: 5.3, volatilityPct: 3.0 },
    "1m": { returnPct: 20.2, drawdownPct: 10.6, volatilityPct: 3.9 },
    "3m": { returnPct: 31.7, drawdownPct: 15.4, volatilityPct: 4.7 },
  },
  "AI 서버": {
    "1w": { returnPct: 7.1, drawdownPct: 6.7, volatilityPct: 3.4 },
    "1m": { returnPct: 23.5, drawdownPct: 11.8, volatilityPct: 4.9 },
    "3m": { returnPct: 37.2, drawdownPct: 18.6, volatilityPct: 5.9 },
  },
};

export const marketIndexes = [
  { name: "KOSPI", value: "2,762.31", change: 0.52 },
  { name: "KOSDAQ", value: "842.11", change: -0.23 },
  { name: "S&P 500", value: "5,308.15", change: 0.59 },
  { name: "NASDAQ", value: "16,742.39", change: 0.81 },
];

function makeTheme(id, name, category, markets, oneWeekScore, oneWeekChange, oneMonthScore, oneMonthChange, threeMonthScore, threeMonthChange) {
  return {
    id,
    name,
    category,
    markets,
    keywords: [name.toLowerCase(), category.toLowerCase()],
    periods: {
      "1w": { score: oneWeekScore, change: oneWeekChange, money: `+${(oneWeekScore / 40).toFixed(2)}조원`, rank: 0, previousRank: 0 },
      "1m": { score: oneMonthScore, change: oneMonthChange, money: `+${(oneMonthScore / 24).toFixed(2)}조원`, rank: 0, previousRank: 0 },
      "3m": { score: threeMonthScore, change: threeMonthChange, money: `+${(threeMonthScore / 14).toFixed(2)}조원`, rank: 0, previousRank: 0 },
    },
    leaders: [
      { rank: 1, name: sampleLeaderFor(name, 0), symbol: sampleSymbolFor(id, 0), market: markets[0], price: samplePriceFor(markets[0], oneWeekScore), change: oneWeekChange / 1.5, turnover: sampleTurnoverFor(markets[0], oneWeekScore) },
      { rank: 2, name: sampleLeaderFor(name, 1), symbol: sampleSymbolFor(id, 1), market: markets.at(-1), price: samplePriceFor(markets.at(-1), oneWeekScore - 8), change: oneWeekChange / 2, turnover: sampleTurnoverFor(markets.at(-1), oneWeekScore - 7) },
      { rank: 3, name: sampleLeaderFor(name, 2), symbol: sampleSymbolFor(id, 2), market: markets[0], price: samplePriceFor(markets[0], oneWeekScore - 12), change: oneWeekChange / 2.4, turnover: sampleTurnoverFor(markets[0], oneWeekScore - 9) },
      { rank: 4, name: sampleLeaderFor(name, 3), symbol: sampleSymbolFor(id, 3), market: markets.at(-1), price: samplePriceFor(markets.at(-1), oneWeekScore - 16), change: oneWeekChange / 2.8, turnover: sampleTurnoverFor(markets.at(-1), oneWeekScore - 12) },
      { rank: 5, name: sampleLeaderFor(name, 4), symbol: sampleSymbolFor(id, 4), market: markets[0], price: samplePriceFor(markets[0], oneWeekScore - 20), change: oneWeekChange / 3, turnover: sampleTurnoverFor(markets[0], oneWeekScore - 14) },
    ],
    challengers: [
      { name: sampleLeaderFor(name, 1), symbol: sampleSymbolFor(id, 1), note: "최근 거래대금과 상대강도가 동시에 개선" },
      { name: sampleLeaderFor(name, 2), symbol: sampleSymbolFor(id, 2), note: "전주 대비 순위 상승 폭 확대" },
    ],
    rotation: {
      summary: "2종목 신규 진입",
      in: [sampleLeaderFor(name, 1), sampleLeaderFor(name, 2)],
      out: [sampleLeaderFor(name, 3)],
    },
    insight: `${name} 업황은 최근 강도와 거래대금이 함께 개선되는 흐름`,
  };
}

function sampleLeaderFor(themeName, index) {
  const leaders = {
    "냉각": ["버티브", "슈나이더 일렉트릭", "케이엔솔", "존슨콘트롤즈", "삼화전기"],
    "광통신": ["아리스타", "코히어런트", "루멘텀", "오이솔루션", "이노와이어리스"],
    "로봇": ["테슬라", "레인보우로보틱스", "두산로보틱스", "인튜이티브 서지컬", "로보티즈"],
    "방산": ["한화에어로스페이스", "록히드마틴", "LIG넥스원", "RTX", "현대로템"],
    "원전": ["두산에너빌리티", "뉴스케일", "BWXT", "비에이치아이", "한전기술"],
    "비만치료제": ["일라이릴리", "노보노디스크", "한미약품", "펩트론", "유한양행"],
    "사이버보안": ["팔로알토", "크라우드스트라이크", "포티넷", "지스케일러", "안랩"],
    "유리기판": ["SKC", "필옵틱스", "와이씨켐", "켐트로닉스", "기가비스"],
    "2차전지": ["LG에너지솔루션", "삼성SDI", "에코프로비엠", "테슬라", "앨버말"],
  };

  return leaders[themeName]?.[index] ?? `${themeName} 리더 ${index + 1}`;
}

function sampleSymbolFor(id, index) {
  const symbols = {
    cooling: ["VRT", "SU", "009440", "JCI", "011230"],
    optical: ["ANET", "COHR", "LITE", "138080", "073490"],
    robotics: ["TSLA", "277810", "454910", "ISRG", "108490"],
    defense: ["012450", "LMT", "079550", "RTX", "064350"],
    nuclear: ["034020", "SMR", "BWXT", "083650", "052690"],
    obesity: ["LLY", "NVO", "128940", "087010", "000100"],
    cybersecurity: ["PANW", "CRWD", "FTNT", "ZS", "053800"],
    "glass-substrate": ["011790", "161580", "112290", "089010", "420770"],
    battery: ["373220", "006400", "247540", "TSLA", "ALB"],
  };

  return symbols[id]?.[index] ?? "----";
}

function samplePriceFor(market, seed) {
  if (market === "KR") return `${Math.round(seed * 2910).toLocaleString("ko-KR")}`;
  return `${(seed * 3.82).toFixed(2)}`;
}

function sampleTurnoverFor(market, seed) {
  if (market === "KR") return `${Math.round(seed * 47).toLocaleString("ko-KR")}억`;
  return `${(seed / 12).toFixed(1)}조`;
}

function enrichTheme(theme, period) {
  const periodData = theme.periods[period] ?? theme.periods["1w"];
  return {
    ...theme,
    ...periodData,
    rank: periodData.rank || undefined,
    previousRank: periodData.previousRank || undefined,
  };
}

export function getVisibleThemes({ market = "all", period = "1w", query = "" } = {}) {
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = themes
    .filter((theme) => market === "all" || theme.markets.includes(market))
    .filter((theme) => {
      if (!normalizedQuery) return true;
      const target = [
        theme.name,
        theme.category,
        ...theme.keywords,
        ...theme.leaders.map((leader) => leader.name),
        ...theme.leaders.map((leader) => leader.symbol),
      ].join(" ").toLowerCase();

      return target.includes(normalizedQuery);
    })
    .map((theme) => enrichTheme(theme, period))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return filtered.map((theme, index) => ({
    ...theme,
    rank: index + 1,
    previousRank: theme.previousRank || index + 1 + Math.sign(theme.change || 0),
  }));
}

export function getThemeDetail(themeId, period = "1w") {
  const theme = themes.find((item) => item.id === themeId) ?? themes[0];
  return enrichTheme(theme, period);
}

export function getLeaderComparison(themeId, period = "1w") {
  const theme = getThemeDetail(themeId, period);
  const baseSeries = theme.id === "ai-server" ? leaderSeries : theme.leaders.map((leader, index) => {
    const multiplier = Math.max(0.5, 1 - index * 0.13);
    return {
      symbol: leader.symbol,
      name: leader.name,
      color: ["#139a43", "#1463d8", "#8a3fd0", "#f18a18", "#21a6a8"][index],
      points: [0, 1.4, 2.7, 4.1, 5.6, 7.2].map((value) => Number((value * multiplier + theme.change / 8).toFixed(1))),
    };
  });

  return {
    labels: period === "1w" ? ["5/14", "5/15", "5/16", "5/17", "5/20", "5/21"] : ["1주", "2주", "3주", "4주", "5주", "6주"],
    series: baseSeries,
  };
}

export function getChairPatternCandidates({ market = "all", period = "1w", limit = 5 } = {}) {
  return chairPatternCandidates
    .filter((candidate) => market === "all" || candidate.market === market)
    .map((candidate) => ({
      ...candidate,
      patternScore: candidate.periodScores[period] ?? candidate.periodScores["1w"],
    }))
    .sort((a, b) => b.patternScore - a.patternScore)
    .slice(0, limit);
}

export function getAiCandidateQueue({ market = "all", period = "1w", limit = 5 } = {}) {
  return getChairPatternCandidates({ market, period, limit }).map((candidate) => {
    const relativeProfile = buildRelativeProfile(candidate, period);

    return {
      id: candidate.id,
      name: candidate.name,
      symbol: candidate.symbol,
      market: candidate.market,
      themeName: candidate.themeName,
      candidateScore: candidate.patternScore,
      reason: `AI 후보: ${candidate.themeName} 흐름 안에서 ${candidate.setup}`,
      chartCheck: `이포 차트 확인: ${candidate.trigger}`,
      volatilityCheck: `변동성 진단: ${relativeProfile.volatilityLabel} (${formatGap(relativeProfile.volatilityGap)}p)`,
      relativeCheck: `상대 비교: ${relativeProfile.relativeLabel} (${formatGap(relativeProfile.returnGap)}p / 낙폭 ${formatGap(relativeProfile.drawdownGap)}p)`,
      comparisonBasis: relativeProfile.basis,
      exclusionRule: `제외 기준: ${candidate.risk}`,
      relativeProfile,
      source: "의자패턴 1차 후보",
    };
  });
}

function buildRelativeProfile(candidate, period) {
  const profile = candidate.profile?.[period] ?? candidate.profile?.["1w"] ?? { returnPct: 0, drawdownPct: 0, volatilityPct: 0 };
  const benchmark = peerBenchmarks[candidate.themeName]?.[period] ?? peerBenchmarks[candidate.themeName]?.["1w"] ?? profile;
  const returnGap = roundOne(profile.returnPct - benchmark.returnPct);
  const drawdownGap = roundOne(profile.drawdownPct - benchmark.drawdownPct);
  const volatilityGap = roundOne(profile.volatilityPct - benchmark.volatilityPct);
  const isVolatile = volatilityGap >= 1.2;
  const isLaggingDrawdown = returnGap <= -2.0 && drawdownGap >= 2.0;

  return {
    basis: `${candidate.themeName} 동종 후보 평균 대비`,
    returnPct: profile.returnPct,
    peerReturnPct: benchmark.returnPct,
    drawdownPct: profile.drawdownPct,
    peerDrawdownPct: benchmark.drawdownPct,
    volatilityPct: profile.volatilityPct,
    peerVolatilityPct: benchmark.volatilityPct,
    returnGap,
    drawdownGap,
    volatilityGap,
    volatilityLabel: isVolatile ? "변동성 확대형" : "변동성 평균권",
    relativeLabel: relativeLabelFor({ returnGap, drawdownGap, isLaggingDrawdown }),
  };
}

function relativeLabelFor({ returnGap, drawdownGap, isLaggingDrawdown }) {
  if (isLaggingDrawdown) return "덜 오르고 많이 빠진 상대 낙폭형";
  if (returnGap >= 1.5 && drawdownGap <= 1.5) return "상대강도 유지형";
  if (drawdownGap >= 2.0) return "낙폭 확인형";
  return "동종 평균 근접형";
}

function formatGap(value) {
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}`;
}

function roundOne(value) {
  return Number(value.toFixed(1));
}

export function getAlerts({ period = "1w" } = {}) {
  const [first, second, third] = getVisibleThemes({ market: "all", period });
  return [
    {
      id: "score",
      tone: "success",
      title: `${first.name} 업황 강도 점수 ${first.score} 돌파`,
      body: `현재 ${first.score}점, 자금 유입 ${first.money}`,
      time: "09:10",
    },
    {
      id: "leader",
      tone: "success",
      title: `${first.challengers[0].name} 리더 종목 신규 진입`,
      body: `${first.name} 업황 Top 5 진입`,
      time: "09:05",
    },
    {
      id: "cooldown",
      tone: "danger",
      title: `${second.name} 업황 강도 하락 전환`,
      body: `1주 변화 +${second.change} (지난주 +12)`,
      time: "08:52",
    },
    {
      id: "watch",
      tone: "neutral",
      title: `${third.name} 관심 업황 순위 상승`,
      body: `Top 3 안착, 리더 종목 거래대금 증가`,
      time: "08:30",
    },
  ];
}
