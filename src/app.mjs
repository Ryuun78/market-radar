import {
  MARKETS,
  PERIODS,
  getAiCandidateQueue,
  getAlerts,
  getLeaderComparison,
  getThemeDetail,
  getVisibleThemes,
  marketIndexes,
} from "./data.mjs";

const root = document.querySelector("#app");

const state = {
  market: "all",
  period: "1w",
  query: "",
  selectedThemeId: "ai-server",
  activeTab: "summary",
  favoriteThemeIds: new Set(["ai-server", "power-grid", "hbm"]),
  toggles: {
    ai: true,
    power: true,
    hbm: false,
    rotation: true,
  },
};

const iconPaths = {
  radar: '<path d="M12 3a9 9 0 1 0 9 9"/><path d="M12 7a5 5 0 1 0 5 5"/><path d="M12 11a1 1 0 1 0 1 1"/><path d="M21 3l-9 9"/><path d="M16 12h5"/><path d="M21 3v5"/>',
  star: '<path d="m12 2 2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 16.8l-5.8 3.06 1.11-6.46-4.7-4.58 6.49-.94L12 2Z"/>',
  bell: '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
  gear: '<path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.04 4.3l.06.06A1.65 1.65 0 0 0 8.92 4a1.65 1.65 0 0 0 1-1.51V2a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.17.49.64.82 1.16.82H21a2 2 0 0 1 0 4h-.09c-.52 0-.99.33-1.51 1.18Z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  refresh: '<path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 5v4h4"/><path d="M4 13a8.1 8.1 0 0 0 15.5 2M20 19v-4h-4"/>',
  alert: '<path d="M10.3 3.3 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  chart: '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-7"/>',
};

function icon(name, className = "icon") {
  return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name]}</svg>`;
}

function render() {
  const themes = getVisibleThemes({
    market: state.market,
    period: state.period,
    query: state.query,
  });

  if (themes.length && !themes.some((theme) => theme.id === state.selectedThemeId)) {
    state.selectedThemeId = themes[0].id;
  }

  const selected = getThemeDetail(state.selectedThemeId, state.period);
  const alerts = getAlerts({ period: state.period });
  const aiCandidates = getAiCandidateQueue({ market: state.market, period: state.period });

  root.innerHTML = `
    <main class="app-shell">
      ${renderSidebar()}
      <section class="workspace">
        ${renderToolbar()}
        <div class="dashboard-grid">
          ${renderAiCandidatePanel(aiCandidates)}
          ${renderDetail(selected)}
        </div>
        <div class="lower-grid">
          ${renderThemeList(themes)}
          ${renderRotation(selected)}
          ${renderAlerts(alerts)}
          ${renderAlertSettings()}
        </div>
      </section>
    </main>
  `;

  bindEvents();
}

function renderSidebar() {
  const navItems = [
    { id: "radar", label: "후보군", icon: "radar", active: true },
    { id: "watch", label: "관심", icon: "star" },
    { id: "alerts", label: "알림", icon: "bell", count: 8 },
    { id: "settings", label: "설정", icon: "gear" },
  ];

  return `
    <aside class="sidebar" aria-label="주요 메뉴">
      <div class="brand">
        <span class="brand-mark">${icon("radar")}</span>
        <span>
          <strong>Market Radar</strong>
          <small>AI 후보군</small>
        </span>
      </div>
      <nav class="nav-list">
        ${navItems
          .map(
            (item) => `
              <button class="nav-item ${item.active ? "is-active" : ""}" type="button">
                ${icon(item.icon)}
                <span>${item.label}</span>
                ${item.count ? `<b>${item.count}</b>` : ""}
              </button>
            `,
          )
          .join("")}
      </nav>
      <div class="index-panel">
        <p>주요 지수 <span>${formatTime()}</span></p>
        ${marketIndexes
          .map(
            (item) => `
              <div class="index-row">
                <span>${item.name}</span>
                <strong>${item.value}</strong>
                <em class="${toneClass(item.change)}">${formatSigned(item.change)}%</em>
              </div>
            `,
          )
          .join("")}
      </div>
      <p class="data-note">AI가 후보군을 줄이고<br />차트 판단은 이포가 합니다.</p>
    </aside>
  `;
}

function renderToolbar() {
  return `
    <header class="toolbar">
      <div class="control-group">
        <span>시장 범위</span>
        ${renderSegmented("market", MARKETS, state.market)}
      </div>
      <div class="control-group">
        <span>기간</span>
        ${renderSegmented("period", PERIODS, state.period)}
      </div>
      <label class="search-box">
        ${icon("search")}
        <input id="search" type="search" value="${escapeHtml(state.query)}" placeholder="후보, 테마, 종목 검색 (예: AI, 반도체, 엔비디아)" autocomplete="off" />
      </label>
      <div class="update-chip">
        <span>업데이트</span>
        <strong>${formatTime(true)}</strong>
        ${icon("refresh")}
      </div>
    </header>
  `;
}

function renderSegmented(name, items, current) {
  return `
    <div class="segmented" role="group" aria-label="${name}">
      ${items
        .map(
          (item) => `
            <button class="${item.id === current ? "is-selected" : ""}" type="button" data-segment="${name}" data-value="${item.id}">
              ${item.label}
            </button>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderAiCandidatePanel(candidates) {
  return `
    <section class="candidate-panel" aria-label="AI 후보군">
      <div class="panel-heading">
        <div>
          <h2>AI 후보군</h2>
          <p class="candidate-subtitle">AI는 후보만 추립니다. 차트 확인과 최종 선별은 이포가 합니다.</p>
        </div>
        ${icon("radar", "icon icon-muted")}
      </div>
      <div class="candidate-list">
        ${candidates.length
          ? candidates.map(renderAiCandidate).join("")
          : `<div class="empty-state"><strong>후보가 없습니다.</strong><span>시장 범위를 바꿔 다시 확인하세요.</span></div>`}
      </div>
      <p class="score-note">후보 점수는 테마 강도, 받침 품질, 거래대금 회복을 함께 본 1차 압축값입니다.</p>
    </section>
  `;
}

function renderAiCandidate(candidate) {
  return `
    <button class="candidate-item" type="button">
      <span class="candidate-score">${candidate.candidateScore}</span>
      <span class="candidate-copy">
        <strong>${candidate.name}</strong>
        <em>${candidate.symbol} · ${candidate.market} · ${candidate.themeName}</em>
        <small>${candidate.reason}</small>
        <i>${candidate.chartCheck}</i>
        <span class="candidate-diagnostics">
          <span class="candidate-diagnostics-label">변동성 / 상대 비교</span>
          <span>${candidate.volatilityCheck}</span>
          <span>${candidate.relativeCheck}</span>
        </span>
        <u>${candidate.comparisonBasis}</u>
        <b>${candidate.exclusionRule}</b>
      </span>
    </button>
  `;
}

function renderThemeList(themes) {
  return `
    <section class="theme-panel" aria-label="오늘 강한 업황">
      <div class="panel-heading">
        <h2>강한 업황 후보 Top 10</h2>
        ${icon("info", "icon icon-muted")}
      </div>
      <div class="theme-table" role="table">
        <div class="theme-head" role="row">
          <span>순위</span>
          <span>업황/테마</span>
          <span>강도 점수</span>
          <span>${currentPeriodLabel()} 변화</span>
        </div>
        ${themes.length ? themes.map(renderThemeRow).join("") : renderEmptyThemes()}
      </div>
      <button class="wide-button" type="button">전체 업황 보기</button>
      <p class="score-note">강도 점수: 0(매우 약함) ~ 100(매우 강함)</p>
    </section>
  `;
}

function renderThemeRow(theme) {
  const rankDelta = theme.previousRank - theme.rank;
  return `
    <button class="theme-row ${theme.id === state.selectedThemeId ? "is-active" : ""}" type="button" data-theme-id="${theme.id}">
      <span class="rank">
        <b>${theme.rank}</b>
        <small class="${rankDeltaClass(rankDelta)}">${formatRankDelta(rankDelta)}</small>
      </span>
      <span class="theme-name">
        <strong>${theme.name}</strong>
        <small>${theme.category}</small>
      </span>
      <span class="strength-cell">
        <i style="--score:${theme.score}"></i>
        <b>${theme.score}</b>
      </span>
      <span class="change-cell ${toneClass(theme.change)}">
        ${renderSparkline(theme.change)}
        <b>${formatSigned(theme.change)}</b>
      </span>
    </button>
  `;
}

function renderEmptyThemes() {
  return `
    <div class="empty-state">
      <strong>검색 결과가 없습니다.</strong>
      <span>다른 업황이나 종목명으로 다시 찾아보세요.</span>
    </div>
  `;
}

function renderDetail(theme) {
  return `
    <section class="detail-panel">
      <div class="detail-title">
        <div>
          <span class="selected-label">후보군 배경 업황</span>
          <h1>${theme.name}</h1>
        </div>
        <button class="favorite-button ${state.favoriteThemeIds.has(theme.id) ? "is-on" : ""}" type="button" data-action="favorite" aria-pressed="${state.favoriteThemeIds.has(theme.id)}">
          ${icon("star")}
          ${state.favoriteThemeIds.has(theme.id) ? "관심 후보 배경" : "후보 배경 저장"}
        </button>
      </div>
      ${renderTabs()}
      ${renderTabContent(theme)}
    </section>
  `;
}

function renderTabs() {
  const tabs = [
    { id: "summary", label: "요약" },
    { id: "leaders", label: "리더 종목" },
    { id: "chart", label: "차트 메모" },
    { id: "members", label: "구성 종목" },
    { id: "news", label: "관련 뉴스" },
  ];

  return `
    <div class="tabs" role="tablist" aria-label="업황 상세 탭">
      ${tabs
        .map(
          (tab) => `
            <button class="${tab.id === state.activeTab ? "is-active" : ""}" type="button" role="tab" data-tab="${tab.id}">
              ${tab.label}
            </button>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderTabContent(theme) {
  if (state.activeTab === "leaders") return `<div class="tab-space">${renderLeaderTable(theme, true)}</div>`;
  if (state.activeTab === "chart") return `<div class="tab-space">${renderLeaderChart(theme)}</div>`;
  if (state.activeTab === "members") return `<div class="tab-space">${renderMembers(theme)}</div>`;
  if (state.activeTab === "news") return `<div class="tab-space">${renderNews(theme)}</div>`;

  return `
    <div class="metric-grid">
      ${renderMetric("강도 점수", `${theme.score}`, "/100", scoreLabel(theme.score))}
      ${renderMetric("순위", `${theme.rank}`, "", `▲ ${Math.max(0, theme.previousRank - theme.rank)} (지난주 ${theme.previousRank}위)`)}
      ${renderMetric(`${currentPeriodLabel()} 변화`, formatSigned(theme.change), "", "지난 기간 대비")}
      ${renderMetric("1개월 변화", formatSigned(theme.periods["1m"].change), "", `점수 ${theme.periods["1m"].score}`)}
      ${renderMetric("3개월 변화", formatSigned(theme.periods["3m"].change), "", `점수 ${theme.periods["3m"].score}`)}
      ${renderMetric(`자금 유입 (${currentPeriodLabel()})`, theme.money, "", "강한 유입")}
    </div>
    <div class="detail-grid">
      ${renderLeaderTable(theme)}
      ${renderChartReviewGuide(theme)}
    </div>
  `;
}

function renderMetric(label, value, suffix, caption) {
  const positive = value.startsWith("+") || Number(value) >= 80;
  return `
    <article class="metric-card">
      <span>${label}</span>
      <strong class="${positive ? "text-positive" : ""}">${value}<small>${suffix}</small></strong>
      <em>${caption}</em>
    </article>
  `;
}

function renderLeaderTable(theme, expanded = false) {
  return `
    <article class="table-card ${expanded ? "is-expanded" : ""}">
      <div class="card-heading">
        <h3>후보군 배경 리더 Top 5</h3>
        ${icon("info", "icon icon-muted")}
      </div>
      <div class="leader-table">
        <div class="leader-head">
          <span>순위</span>
          <span>종목</span>
          <span>국가</span>
          <span>현재가</span>
          <span>${currentPeriodLabel()} 변화</span>
          <span>거래대금</span>
        </div>
        ${theme.leaders
          .map(
            (leader) => `
              <button class="leader-row" type="button">
                <b>${leader.rank}</b>
                <span>
                  <strong>${leader.name}</strong>
                  <small>${leader.symbol}</small>
                </span>
                <i>${leader.market}</i>
                <em>${leader.price}</em>
                <em class="${toneClass(leader.change)}">${formatSigned(leader.change)}%</em>
                <em>${leader.turnover}</em>
              </button>
            `,
          )
          .join("")}
      </div>
      <button class="wide-button" type="button">전체 리더 종목 보기</button>
    </article>
  `;
}

function renderChartReviewGuide(theme) {
  const checks = [
    `${theme.name} 강도 점수가 ${currentPeriodLabel()} 기준 상위권을 유지하는지 확인`,
    `${theme.leaders[0].name}와 ${theme.challengers[0].name} 거래대금이 같이 붙는지 확인`,
    "받침 하단 이탈, 거래대금 감소, 테마 약화가 겹치면 후보에서 제외",
  ];

  return `
    <article class="review-card">
      <div class="card-heading">
        <h3>이포 차트 확인 메모</h3>
        ${icon("chart", "icon icon-muted")}
      </div>
      <div class="review-list">
        ${checks.map((item, index) => `<p><b>${index + 1}</b><span>${item}</span></p>`).join("")}
      </div>
      <p class="review-note">AI는 후보군 압축까지만 담당합니다.</p>
    </article>
  `;
}

function renderLeaderChart(theme) {
  const comparison = getLeaderComparison(theme.id, state.period);
  const allPoints = comparison.series.flatMap((item) => item.points);
  const min = Math.min(-5, ...allPoints);
  const max = Math.max(15, ...allPoints);

  return `
    <article class="chart-card">
      <div class="card-heading chart-heading">
        <h3>참고용 흐름 차트 (${currentPeriodLabel()})</h3>
        <div class="mini-segmented">
          ${PERIODS.map(
            (period) => `
              <button class="${period.id === state.period ? "is-selected" : ""}" type="button" data-segment="period" data-value="${period.id}">
                ${period.label}
              </button>
            `,
          ).join("")}
          <button type="button">1년</button>
        </div>
      </div>
      <div class="legend">
        ${comparison.series
          .map(
            (item) => `
              <span><i style="background:${item.color}"></i>${item.name}</span>
            `,
          )
          .join("")}
      </div>
      <svg class="line-chart" viewBox="0 0 640 270" role="img" aria-label="리더 종목 수익률 비교 차트">
        ${[-5, 0, 5, 10, 15].map((value) => renderGridLine(value, min, max)).join("")}
        ${comparison.series.map((item) => renderLine(item, min, max)).join("")}
        ${comparison.labels.map((label, index) => renderXAxis(label, index, comparison.labels.length)).join("")}
      </svg>
      <p class="chart-footnote">기준일: 5/14 시장 종가 · 최종 판독은 이포 차트 확인</p>
    </article>
  `;
}

function renderGridLine(value, min, max) {
  const y = scale(value, min, max, 235, 20);
  return `
    <line x1="46" x2="610" y1="${y}" y2="${y}" class="grid-line" />
    <text x="8" y="${y + 4}" class="axis-text">${formatSigned(value)}%</text>
  `;
}

function renderLine(series, min, max) {
  const width = 564;
  const points = series.points
    .map((point, index) => {
      const x = 46 + (width / (series.points.length - 1)) * index;
      const y = scale(point, min, max, 235, 20);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const circles = series.points
    .map((point, index) => {
      const x = 46 + (width / (series.points.length - 1)) * index;
      const y = scale(point, min, max, 235, 20);
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="${series.color}" />`;
    })
    .join("");

  return `
    <polyline points="${points}" fill="none" stroke="${series.color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    ${circles}
  `;
}

function renderXAxis(label, index, total) {
  const x = 46 + (564 / (total - 1)) * index;
  return `<text x="${x}" y="258" class="axis-text axis-label">${label}</text>`;
}

function renderMembers(theme) {
  return `
    <article class="plain-panel">
      <div class="card-heading">
        <h3>${theme.name} 구성 종목</h3>
        <span>${theme.markets.join(" + ")}</span>
      </div>
      <div class="member-grid">
        ${theme.leaders
          .concat(theme.challengers.map((item, index) => ({ ...item, rank: index + 6, market: "관심", change: 0, turnover: "감시 중" })))
          .map(
            (item) => `
              <button type="button">
                <b>${item.rank}</b>
                <span>${item.name}</span>
                <em>${item.symbol}</em>
              </button>
            `,
          )
          .join("")}
      </div>
    </article>
  `;
}

function renderNews(theme) {
  const news = [
    `${theme.name} 자금 유입, 최근 ${currentPeriodLabel()} 기준 상위권 유지`,
    `${theme.challengers[0].name} 강세로 리더 후보군 변화 감지`,
    `${theme.category} 관련 한국·미국 연동 흐름 확대`,
  ];

  return `
    <article class="plain-panel">
      <div class="card-heading">
        <h3>관련 뉴스 흐름</h3>
        <span>요약형</span>
      </div>
      <div class="news-list">
        ${news
          .map(
            (item, index) => `
              <button type="button">
                <strong>${item}</strong>
                <span>${index + 1}시간 전 · 시장 흐름 요약</span>
              </button>
            `,
          )
          .join("")}
      </div>
    </article>
  `;
}

function renderRotation(theme) {
  return `
    <article class="rotation-card">
      <div class="card-heading">
        <h3>리더 교체 인사이트</h3>
        ${icon("info", "icon icon-muted")}
      </div>
      <div class="rotation-body">
        <div class="rotation-box positive">
          <span>신규 진입</span>
          <strong>${theme.rotation.summary}</strong>
          ${theme.rotation.in.map((item) => `<em>${item}</em>`).join("")}
        </div>
        <div class="swap-icon">${icon("refresh")}</div>
        <div class="rotation-box danger">
          <span>하락 이탈</span>
          <strong>${theme.rotation.out.length}종목</strong>
          ${theme.rotation.out.map((item) => `<em>${item}</em>`).join("")}
        </div>
      </div>
      <p>분석: ${theme.insight}</p>
    </article>
  `;
}

function renderAlerts(alerts) {
  return `
    <article class="alerts-card">
      <div class="card-heading">
        <h3>최근 알림</h3>
        <button type="button">전체 알림 보기</button>
      </div>
      <div class="alert-list">
        ${alerts
          .slice(0, 3)
          .map(
            (alert) => `
              <button class="alert-item ${alert.tone}" type="button">
                ${alert.tone === "danger" ? icon("alert") : icon("bell")}
                <span>
                  <strong>${alert.title}</strong>
                  <em>${alert.body}</em>
                </span>
                <time>${alert.time}</time>
              </button>
            `,
          )
          .join("")}
      </div>
    </article>
  `;
}

function renderAlertSettings() {
  const settings = [
    { key: "ai", title: "AI 서버 업황 강도", body: "강도 점수 90 이상" },
    { key: "power", title: "전력 인프라 업황 강도", body: "강도 점수 80 이상" },
    { key: "hbm", title: "HBM 업황 강도", body: "강도 점수 85 이상" },
    { key: "rotation", title: "리더 교체 발생 알림", body: "Top 5 종목 변동 시" },
  ];

  return `
    <article class="settings-card">
      <div class="card-heading">
        <h3>주요 알림 설정</h3>
        <button type="button">설정 관리</button>
      </div>
      <div class="setting-list">
        ${settings
          .map(
            (item) => `
              <button class="setting-row" type="button" data-toggle="${item.key}" aria-pressed="${state.toggles[item.key]}">
                <span>
                  <strong>${item.title}</strong>
                  <em>${item.body}</em>
                </span>
                <i class="${state.toggles[item.key] ? "is-on" : ""}"></i>
              </button>
            `,
          )
          .join("")}
      </div>
    </article>
  `;
}

function renderSparkline(change) {
  const positive = change >= 0;
  const points = positive ? "2,22 10,18 18,15 26,11 34,13 42,6" : "2,8 10,11 18,14 26,13 34,18 42,20";
  return `
    <svg class="sparkline ${positive ? "positive" : "negative"}" viewBox="0 0 44 24" aria-hidden="true">
      <polyline points="${points}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `;
}

function bindEvents() {
  root.querySelectorAll("[data-segment]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.segment;
      state[key] = button.dataset.value;
      render();
    });
  });

  root.querySelectorAll("[data-theme-id]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedThemeId = button.dataset.themeId;
      state.activeTab = "summary";
      render();
    });
  });

  root.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeTab = button.dataset.tab;
      render();
    });
  });

  root.querySelector("[data-action='favorite']")?.addEventListener("click", () => {
    if (state.favoriteThemeIds.has(state.selectedThemeId)) {
      state.favoriteThemeIds.delete(state.selectedThemeId);
    } else {
      state.favoriteThemeIds.add(state.selectedThemeId);
    }
    render();
  });

  root.querySelectorAll("[data-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.toggle;
      state.toggles[key] = !state.toggles[key];
      render();
    });
  });

  const searchInput = root.querySelector("#search");
  searchInput?.addEventListener("input", (event) => {
    state.query = event.target.value;
    render();
    const nextInput = root.querySelector("#search");
    nextInput?.focus();
    nextInput?.setSelectionRange(state.query.length, state.query.length);
  });
}

function currentPeriodLabel() {
  return PERIODS.find((period) => period.id === state.period)?.label ?? "1주";
}

function formatSigned(value) {
  const number = Number(value);
  if (Number.isNaN(number)) return value;
  return `${number > 0 ? "+" : ""}${Number.isInteger(number) ? number : number.toFixed(2)}`;
}

function formatRankDelta(delta) {
  if (delta > 0) return `▲ ${delta}`;
  if (delta < 0) return `▼ ${Math.abs(delta)}`;
  return "-";
}

function rankDeltaClass(delta) {
  if (delta > 0) return "positive";
  if (delta < 0) return "negative";
  return "neutral";
}

function toneClass(value) {
  return Number(value) >= 0 ? "positive" : "negative";
}

function scoreLabel(score) {
  if (score >= 90) return "매우 강함";
  if (score >= 75) return "강함";
  if (score >= 60) return "관찰";
  return "약함";
}

function scale(value, min, max, outMin, outMax) {
  return outMin + ((value - min) * (outMax - outMin)) / (max - min);
}

function formatTime(withSeconds = false) {
  return new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: withSeconds ? "2-digit" : undefined,
    hour12: false,
    timeZone: "Asia/Seoul",
  }).format(new Date());
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return map[char];
  });
}

render();
