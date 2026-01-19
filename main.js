const DEFAULT_SETTINGS = {
  startYear: 2019,
  startSalary: 50000000,
  currentYear: 2025,
  currentSalary: 55000000,
  inflationSource: "cpi",
  customInflation: 18,
  language: "ko",
  country: "KR",
  maskVisible: true,
  startSalaryUnit: "man",
  currentSalaryUnit: "man",
};

const STORAGE_KEY = "inflation-check-settings";

const cpiData = {
  KR: {
    2015: 109.82747242569,
    2016: 110.894650313757,
    2017: 113.050810827499,
    2018: 114.719259179216,
    2019: 115.158634290169,
    2020: 115.777367840135,
    2021: 118.669872413341,
    2022: 124.709591769001,
    2023: 129.195964772806,
    2024: 132.195563411264,
  },
  US: {
    2015: 108.695721960694,
    2016: 110.06700893427,
    2017: 112.411557302308,
    2018: 115.157303224791,
    2019: 117.244195476228,
    2020: 118.690501577198,
    2021: 124.266413825838,
    2022: 134.21120616846,
    2023: 139.73579356326,
    2024: 143.857336014608,
  },
};

const salaryDefaults = {
  KR: { start: 50000000, current: 55000000 },
  US: { start: 60000, current: 70000 },
};

const currencyByCountry = {
  KR: { currency: "KRW", locale: "ko-KR" },
  US: { currency: "USD", locale: "en-US" },
};

const inflationAdjusters = {
  cpi: 1,
  living: 1.06,
};

const translations = {
  ko: {
    page_title: "내 월급의 실질 가치 - 인플레이션 팩트 체크",
    brand: "실질 월급 팩트 체크",
    label_language: "언어",
    label_country: "국가",
    hero_badge: "인플레이션 팩트 체크",
    hero_title: "내 월급의 실질 가치",
    hero_desc:
      "열심히 일해도 왜 가난해지는지 숫자로 증명합니다. 연봉은 올랐는데 물가가 더 빨리 뛰었다면, 실질 구매력은 줄어든 겁니다.",
    cta_calculate: "바로 계산하기",
    cta_report: "리포트 만들기",
    step1_title: "연봉 입력",
    step1_hint: "입사 시점과 현재를 비교합니다.",
    label_start_year: "입사 연도",
    label_current_year: "현재 연도",
    label_start_salary: "입사 연봉",
    label_current_salary: "현재 연봉",
    step2_title: "물가 기준",
    step2_hint: "공식 CPI 또는 체감 물가를 선택하세요.",
    label_inflation_source: "물가 기준",
    option_cpi: "CPI (공식 지수)",
    option_living: "생활물가 (체감 보정)",
    option_custom: "직접 입력",
    label_custom_inflation: "누적 물가 상승률 (%)",
    hint_data: "공식 지수는 World Bank CPI(2010=100) 기반입니다.",
    step3_title: "결과 확인",
    step3_hint: "숫자로 확인하는 월급 실종 사건입니다.",
    result_real_salary: "지금 연봉의 실체",
    result_real_salary_hint: "물가로 환산한 실질 연봉",
    result_power_change: "월급 녹아내림",
    result_power_hint: "입사 연봉 대비 체감",
    result_summary_label: "현재 실질 연봉",
    result_detail_cta: "상세 보기",
    result_details_title: "상세 결과",
    result_nominal_change: "연봉 인상률",
    result_nominal_hint: "명목 상승률",
    result_inflation_change: "물가 상승률",
    result_inflation_hint: "입사 → 현재 누적",
    verdict_loading: "결과 계산 중입니다.",
    loading_text: "결과 계산 중입니다.",
    report_title: "사장님 나빠요 리포트",
    report_generate: "이미지 생성",
    report_desc: "공유용 이미지로 저장해서 커뮤니티에 퍼뜨리세요.",
    report_copy: "텍스트 복사",
    report_download: "이미지 다운로드",
    label_mask_visible: "연봉 공개 표시",
    mask_yes: "예",
    mask_no: "아니오",
    hint_mask: "공유 이미지에 연봉 손해액을 공개할지 선택하세요.",
    ad_title: "스폰서",
    footer_note: "World Bank CPI(2010=100) 기준이며 실제 체감과 다를 수 있습니다.",
    data_note_template: "{year}년 CPI가 아직 발표되지 않아 {fallback}년 지수로 보정했습니다.",
    verdict_negative:
      "연봉은 {nominal} 올랐는데 물가가 {inflation}. 결국 월급 깎인 거나 마찬가지.",
    verdict_flat: "월급이 올랐는데 체감은 그대로. 이게 현실입니다.",
    verdict_positive: "이번엔 월급이 물가를 이겼네요. 그래도 방심 금지.",
    power_negative: "당신의 월급은 녹아내렸습니다 ({real})",
    power_flat: "월급은 제자리입니다 ({real})",
    power_positive: "월급이 버텼습니다 (+{real})",
    shock_template: "당신은 {loss} 손해 봤습니다.",
    share_text:
      "내 연봉 {nominal} 올랐다더니 물가가 {inflation}. 실질은 {real}. #월급실종 #인플레",
    report_title_line: "사장님 나빠요",
    report_subtitle: "월급 실종 보고서",
    report_headline: "실질 구매력 {real}",
    report_caption: "열심히 일해도 가난해지는 이유,",
    report_caption2: "이 숫자에 다 있습니다.",
    report_footer: "월급 올랐다고요? 아니요.",
    report_watermark: "Powered by 내월급지킴이.com",
    report_loss_private: "연봉 손해액 비공개",
    ad_caption: "손해 본 돈, 이걸로 메꾸세요",
    bar_start_label: "입사 연봉",
    bar_real_label: "현재 실질",
    bar_gap_loss: "이만큼 손해: {loss}",
    bar_gap_gain: "이만큼 이득: {gain}",
    receipt_title: "🧾 내 인생 손해 명세서",
    receipt_headline: "나는 {item} {lost}개 손해봤다 😭",
    receipt_item_salary: "잃어버린 연봉",
    receipt_item_basket: "사라진 {item}",
    receipt_item_conscience: "사장님 양심",
    receipt_total: "합계 손실",
    receipt_col_item: "품목",
    receipt_col_qty: "수량",
    receipt_col_amount: "금액",
    copy_done: "복사 완료",
    copy_default: "텍스트 복사",
  },
  en: {
    page_title: "Real Salary Value - Inflation Fact Check",
    brand: "Real Paycheck Reality",
    label_language: "Language",
    label_country: "Country",
    hero_badge: "Inflation Fact Check",
    hero_title: "My Real Salary Value",
    hero_desc:
      "Your salary may go up, but prices can rise faster. This shows how much buying power you actually lost.",
    cta_calculate: "Calculate",
    cta_report: "Create Report",
    step1_title: "Salary Inputs",
    step1_hint: "Compare your starting year vs today.",
    label_start_year: "Start year",
    label_current_year: "Current year",
    label_start_salary: "Starting salary",
    label_current_salary: "Current salary",
    step2_title: "Inflation data",
    step2_hint: "Choose official CPI or a felt-inflation adjustment.",
    label_inflation_source: "Inflation source",
    option_cpi: "CPI (official index)",
    option_living: "Felt inflation (+6%)",
    option_custom: "Custom input",
    label_custom_inflation: "Total inflation (%)",
    hint_data: "Official CPI is from World Bank CPI (2010=100).",
    step3_title: "Results",
    step3_hint: "This is how your paycheck really feels.",
    result_real_salary: "Real salary today",
    result_real_salary_hint: "Adjusted for inflation",
    result_power_change: "Paycheck melt-down",
    result_power_hint: "Compared to your start",
    result_summary_label: "Real salary today",
    result_detail_cta: "View details",
    result_details_title: "Detailed results",
    result_nominal_change: "Nominal raise",
    result_nominal_hint: "Headline increase",
    result_inflation_change: "Inflation",
    result_inflation_hint: "Start → current total",
    verdict_loading: "Calculating results...",
    loading_text: "Calculating results...",
    report_title: "\"Boss, this is unfair\" report",
    report_generate: "Generate image",
    report_desc: "Save and share this report in your community.",
    report_copy: "Copy text",
    report_download: "Download image",
    label_mask_visible: "Salary reveal",
    mask_yes: "Yes",
    mask_no: "No",
    hint_mask: "Choose whether to reveal the loss amount in the share image.",
    ad_title: "Sponsor",
    footer_note: "Based on World Bank CPI (2010=100); real-life impact may differ.",
    data_note_template: "{year} CPI not released yet. Adjusted using {fallback} index.",
    verdict_negative:
      "Salary up {nominal}, inflation up {inflation}. That is a real pay cut.",
    verdict_flat: "Pay rise barely matches inflation. Reality is flat.",
    verdict_positive: "Pay beats inflation for now. Stay alert.",
    power_negative: "Your paycheck melted ({real})",
    power_flat: "Your paycheck stayed flat ({real})",
    power_positive: "Your paycheck survived (+{real})",
    shock_template: "You lost {loss} in real value.",
    share_text:
      "Salary up {nominal}, inflation {inflation}. Real value {real}. #salary #inflation",
    report_title_line: "Boss, this is unfair",
    report_subtitle: "Salary reality check",
    report_headline: "Real buying power {real}",
    report_caption: "Why hard work feels poorer,",
    report_caption2: "the numbers are here.",
    report_footer: "Salary went up? Not really.",
    report_watermark: "Powered by naewolpay.com",
    report_loss_private: "Loss amount hidden",
    ad_caption: "Cover your loss with this",
    bar_start_label: "Start salary",
    bar_real_label: "Real today",
    bar_gap_loss: "Loss: {loss}",
    bar_gap_gain: "Gain: {gain}",
    receipt_title: "🧾 Life Loss Receipt",
    receipt_headline: "I lost {lost} {item} 😭",
    receipt_item_salary: "Lost salary",
    receipt_item_basket: "Lost {item}",
    receipt_item_conscience: "Boss conscience",
    receipt_total: "Total loss",
    receipt_col_item: "Item",
    receipt_col_qty: "Qty",
    receipt_col_amount: "Amount",
    copy_done: "Copied",
    copy_default: "Copy text",
  },
};

const elements = {
  form: document.getElementById("inflation-form"),
  startYear: document.getElementById("start-year"),
  startSalary: document.getElementById("start-salary"),
  currentYear: document.getElementById("current-year"),
  currentSalary: document.getElementById("current-salary"),
  inflationSource: document.getElementById("inflation-source"),
  customInflationWrap: document.getElementById("custom-inflation-wrap"),
  customInflation: document.getElementById("custom-inflation"),
  realSalary: document.getElementById("real-salary"),
  powerChange: document.getElementById("power-change"),
  nominalChange: document.getElementById("nominal-change"),
  inflationChange: document.getElementById("inflation-change"),
  verdict: document.getElementById("verdict"),
  generateReport: document.getElementById("generate-report"),
  reportCanvas: document.getElementById("report-canvas"),
  downloadReport: document.getElementById("download-report"),
  shareText: document.getElementById("share-text"),
  copyText: document.getElementById("copy-text"),
  jumpToInputs: document.getElementById("jump-to-inputs"),
  jumpToReport: document.getElementById("jump-to-report"),
  language: document.getElementById("language"),
  country: document.getElementById("country"),
  labelStartSalary: document.getElementById("label-start-salary"),
  labelCurrentSalary: document.getElementById("label-current-salary"),
  dataNote: document.getElementById("data-note"),
  shockLine: document.getElementById("shock-line"),
  startSalaryRange: document.getElementById("start-salary-range"),
  currentSalaryRange: document.getElementById("current-salary-range"),
  barStart: document.getElementById("bar-start"),
  barReal: document.getElementById("bar-real"),
  barStartValue: document.getElementById("bar-start-value"),
  barRealValue: document.getElementById("bar-real-value"),
  barGap: document.getElementById("bar-gap"),
  maskVisible: document.getElementById("mask-visible"),
  startSalaryUnit: document.getElementById("start-salary-unit"),
  currentSalaryUnit: document.getElementById("current-salary-unit"),
  summaryReal: document.getElementById("summary-real"),
  summaryPower: document.getElementById("summary-power"),
  resultDetails: document.getElementById("result-details"),
  scrollDetails: document.getElementById("scroll-details"),
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const formatKrwShort = (value, locale) => {
  const rounded = Math.round(value);
  const absValue = Math.abs(rounded);
  const sign = rounded < 0 ? "-" : "";
  if (absValue < 10000) {
    return `${sign}${formatNumber(absValue, locale)}원`;
  }
  const man = Math.round(absValue / 10000);
  const eok = Math.floor(man / 10000);
  const restMan = man % 10000;
  if (eok > 0) {
    const rest = restMan ? ` ${formatNumber(restMan, locale)}만원` : "";
    return `${sign}${formatNumber(eok, locale)}억${rest}`;
  }
  return `${sign}${formatNumber(man, locale)}만원`;
};

const salaryUnitMultipliers = {
  man: 10000,
  eok: 100000000,
};

const getUnitMultiplier = (unit, country) => {
  if (country !== "KR") {
    return 1;
  }
  return salaryUnitMultipliers[unit] || salaryUnitMultipliers.man;
};

const getSalaryInputStep = (country, unit) => {
  if (country !== "KR") {
    return 1000;
  }
  return unit === "eok" ? 0.1 : 10;
};

const formatSalaryInputValue = (value, unit, country) => {
  if (country !== "KR") {
    return Math.round(value);
  }
  const divisor = getUnitMultiplier(unit, country);
  return divisor ? Math.round(value / divisor) : Math.round(value);
};

const formatCurrency = (value, country) => {
  const { currency, locale } = currencyByCountry[country] || currencyByCountry.KR;
  if (currency === "KRW") {
    return formatKrwShort(value, locale);
  }
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Math.round(value * 100) / 100);
};

const formatPercent = (value, language) => {
  const percent = (value * 100).toFixed(1);
  return language === "en" ? `${percent}%` : `${percent}%`;
};

const formatNumber = (value, locale) =>
  new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value);

const loadSettings = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { ...DEFAULT_SETTINGS };
  }
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (error) {
    console.warn("Failed to parse settings", error);
    return { ...DEFAULT_SETTINGS };
  }
};

const saveSettings = (settings) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};

const setFormValues = (settings) => {
  elements.startYear.value = settings.startYear;
  elements.startSalaryUnit.value = settings.startSalaryUnit || "man";
  elements.currentSalaryUnit.value = settings.currentSalaryUnit || "man";
  elements.startSalary.value = formatSalaryInputValue(
    settings.startSalary,
    elements.startSalaryUnit.value,
    settings.country,
  );
  elements.currentYear.value = settings.currentYear;
  elements.currentSalary.value = formatSalaryInputValue(
    settings.currentSalary,
    elements.currentSalaryUnit.value,
    settings.country,
  );
  elements.inflationSource.value = settings.inflationSource;
  elements.customInflation.value = settings.customInflation;
  elements.language.value = settings.language;
  elements.country.value = settings.country;
  elements.maskVisible.value = settings.maskVisible ? "yes" : "no";
  elements.startSalaryRange.value = settings.startSalary;
  elements.currentSalaryRange.value = settings.currentSalary;
};

const applyTranslations = (language) => {
  const dictionary = translations[language] || translations.ko;
  document.documentElement.lang = language === "en" ? "en" : "ko";
  if (dictionary.page_title) {
    document.title = dictionary.page_title;
  }
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.getAttribute("data-i18n");
    if (dictionary[key]) {
      node.textContent = dictionary[key];
    }
  });
};

const getClosestYear = (series, year) => {
  const years = Object.keys(series)
    .map(Number)
    .sort((a, b) => a - b);
  if (!years.length) {
    return { year, value: null, exact: false };
  }
  if (series[year]) {
    return { year, value: series[year], exact: true };
  }
  const priorYears = years.filter((y) => y <= year);
  const fallbackYear = priorYears.length ? priorYears[priorYears.length - 1] : years[0];
  return { year: fallbackYear, value: series[fallbackYear], exact: false };
};

const getInflationFactor = (settings) => {
  if (settings.inflationSource === "custom") {
    return { factor: 1 + settings.customInflation / 100 };
  }

  const series = cpiData[settings.country];
  if (!series) {
    return { factor: 1 };
  }

  const start = getClosestYear(series, settings.startYear);
  const current = getClosestYear(series, settings.currentYear);
  const adjuster = inflationAdjusters[settings.inflationSource] || 1;
  const factor = current.value && start.value ? (current.value / start.value) * adjuster : 1;

  return {
    factor,
    startYear: start.year,
    currentYear: current.year,
    startExact: start.exact,
    currentExact: current.exact,
  };
};

const getVerdictText = (stats, language) => {
  const dict = translations[language] || translations.ko;
  if (stats.realDelta <= -0.01) {
    return dict.verdict_negative
      .replace("{nominal}", formatPercent(stats.nominalDelta, language))
      .replace("{inflation}", formatPercent(stats.inflationRate, language));
  }
  if (stats.realDelta <= 0.01) {
    return dict.verdict_flat;
  }
  return dict.verdict_positive;
};

const getShareText = (stats, language) => {
  const dict = translations[language] || translations.ko;
  return dict.share_text
    .replace("{nominal}", formatPercent(stats.nominalDelta, language))
    .replace("{inflation}", formatPercent(stats.inflationRate, language))
    .replace("{real}", formatPercent(stats.realDelta, language));
};

const getPowerMessage = (stats, language) => {
  const dict = translations[language] || translations.ko;
  if (stats.realDelta <= -0.01) {
    return dict.power_negative.replace("{real}", formatPercent(stats.realDelta, language));
  }
  if (stats.realDelta <= 0.01) {
    return dict.power_flat.replace("{real}", formatPercent(stats.realDelta, language));
  }
  return dict.power_positive.replace("{real}", formatPercent(stats.realDelta, language));
};

const calculate = (settings) => {
  const startSalary = Math.max(0, settings.startSalary);
  const currentSalary = Math.max(0, settings.currentSalary);
  const inflationInfo = getInflationFactor(settings);
  const inflationFactor = inflationInfo.factor || 1;
  const realCurrentSalary = inflationFactor ? currentSalary / inflationFactor : currentSalary;
  const nominalDelta = startSalary ? (currentSalary - startSalary) / startSalary : 0;
  const realDelta = startSalary ? (realCurrentSalary - startSalary) / startSalary : 0;
  const inflationRate = inflationFactor - 1;
  const monthlyStart = startSalary / 12;
  const monthlyCurrent = currentSalary / 12;
  return {
    startSalary,
    currentSalary,
    realCurrentSalary,
    nominalDelta,
    realDelta,
    inflationRate,
    inflationInfo,
  };
};

const renderReportCanvas = (stats, settings) => {
  const dict = translations[settings.language] || translations.ko;
  const canvas = elements.reportCanvas;
  const ctx = canvas.getContext("2d");
  const { width, height } = canvas;
  const lossAmount = Math.max(stats.startSalary - stats.realCurrentSalary, 0);
  const headline = dict.report_headline.replace(
    "{real}",
    formatPercent(stats.realDelta, settings.language),
  );
  const lossText = settings.maskVisible
    ? dict.shock_template.replace("{loss}", formatCurrency(lossAmount, settings.country))
    : dict.report_loss_private;

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#111111");
  gradient.addColorStop(0.5, "#182240");
  gradient.addColorStop(1, "#111111");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  ctx.fillRect(80, 120, width - 160, height - 240);

  ctx.fillStyle = "#ffffff";
  ctx.font = "92px 'GmarketSansBold', sans-serif";
  ctx.fillText(dict.report_title_line, 120, 260);

  ctx.font = "40px 'Pretendard', sans-serif";
  ctx.fillStyle = "#ffd93d";
  ctx.fillText(dict.report_subtitle, 120, 320);

  ctx.fillStyle = "#ffffff";
  ctx.font = "34px 'Pretendard', sans-serif";
  ctx.fillText(headline, 120, 400);

  ctx.fillStyle = "#4d96ff";
  ctx.font = "54px 'GmarketSansBold', sans-serif";
  ctx.fillText(
    `${dict.result_power_change} ${formatPercent(stats.realDelta, settings.language)}`,
    120,
    480,
  );

  ctx.fillStyle = "#ffffff";
  ctx.font = "32px 'Pretendard', sans-serif";
  ctx.fillText(
    `${dict.result_nominal_change}: +${formatPercent(stats.nominalDelta, settings.language)}`,
    120,
    560,
  );
  ctx.fillText(
    `${dict.result_inflation_change}: +${formatPercent(stats.inflationRate, settings.language)}`,
    120,
    610,
  );

  ctx.fillStyle = "#ff4d4d";
  ctx.font = "48px 'GmarketSansBold', sans-serif";
  ctx.fillText(lossText, 120, 700);

  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.fillRect(120, 760, width - 240, 280);

  ctx.fillStyle = "#111111";
  ctx.font = "30px 'Pretendard', sans-serif";
  ctx.fillText(dict.report_caption, 150, 830);
  ctx.fillText(dict.report_caption2, 150, 875);
  ctx.font = "34px 'GmarketSansBold', sans-serif";
  drawWrappedText(ctx, getVerdictText(stats, settings.language), 150, 940, width - 300, 44);

  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.font = "22px 'Pretendard', sans-serif";
  ctx.fillText(dict.report_watermark, 120, height - 140);
};

const drawWrappedText = (ctx, text, x, y, maxWidth, lineHeight) => {
  const words = text.split(" ");
  let line = "";
  let offsetY = 0;
  words.forEach((word, index) => {
    const testLine = `${line}${word} `;
    if (ctx.measureText(testLine).width > maxWidth && index > 0) {
      ctx.fillText(line.trim(), x, y + offsetY);
      line = `${word} `;
      offsetY += lineHeight;
    } else {
      line = testLine;
    }
  });
  if (line) {
    ctx.fillText(line.trim(), x, y + offsetY);
  }
};

const renderDynamicLabels = (settings) => {
  const dict = translations[settings.language] || translations.ko;
  const currency = currencyByCountry[settings.country]?.currency || "KRW";
  const isKrw = currency === "KRW";
  elements.labelStartSalary.textContent = isKrw
    ? `${dict.label_start_salary} (만원/억)`
    : `${dict.label_start_salary} (${currency})`;
  elements.labelCurrentSalary.textContent = isKrw
    ? `${dict.label_current_salary} (만원/억)`
    : `${dict.label_current_salary} (${currency})`;
  elements.startSalaryUnit.classList.toggle("is-hidden", !isKrw);
  elements.currentSalaryUnit.classList.toggle("is-hidden", !isKrw);
  const rangeStep = settings.country === "US" ? 1000 : 100000;
  elements.startSalary.step = getSalaryInputStep(
    settings.country,
    settings.startSalaryUnit || "man",
  );
  elements.currentSalary.step = getSalaryInputStep(
    settings.country,
    settings.currentSalaryUnit || "man",
  );
  elements.startSalaryRange.step = rangeStep;
  elements.currentSalaryRange.step = rangeStep;
  const salaryMax = settings.country === "US" ? 200000 : 200000000;
  elements.startSalaryRange.max = salaryMax;
  elements.currentSalaryRange.max = salaryMax;
};

const renderDataNote = (stats, settings) => {
  const dict = translations[settings.language] || translations.ko;
  const info = stats.inflationInfo;
  let note = "";
  if (info && (!info.startExact || !info.currentExact)) {
    const missingYear = !info.startExact ? settings.startYear : settings.currentYear;
    const fallbackYear = !info.startExact ? info.startYear : info.currentYear;
    note = dict.data_note_template
      .replace("{year}", missingYear)
      .replace("{fallback}", fallbackYear);
  }
  elements.dataNote.textContent = note;
};

const render = (settings) => {
  const stats = calculate(settings);
  const verdictText = getVerdictText(stats, settings.language);
  const shareText = getShareText(stats, settings.language);
  const powerMessage = getPowerMessage(stats, settings.language);
  const dict = translations[settings.language] || translations.ko;

  elements.realSalary.textContent = formatCurrency(stats.realCurrentSalary, settings.country);
  elements.powerChange.textContent = powerMessage;
  elements.summaryReal.textContent = formatCurrency(stats.realCurrentSalary, settings.country);
  elements.summaryPower.textContent = powerMessage;
  elements.nominalChange.textContent = formatPercent(stats.nominalDelta, settings.language);
  elements.inflationChange.textContent = formatPercent(stats.inflationRate, settings.language);
  elements.verdict.textContent = verdictText;

  elements.powerChange.classList.remove("status-loss", "status-gain");
  elements.summaryPower.classList.remove("status-loss", "status-gain");
  if (stats.realDelta <= -0.01) {
    elements.powerChange.classList.add("status-loss");
    elements.summaryPower.classList.add("status-loss");
  } else if (stats.realDelta >= 0.01) {
    elements.powerChange.classList.add("status-gain");
    elements.summaryPower.classList.add("status-gain");
  }

  const maxValue = Math.max(stats.startSalary, stats.realCurrentSalary, 1);
  const startPercent = (stats.startSalary / maxValue) * 100;
  const realPercent = (stats.realCurrentSalary / maxValue) * 100;
  elements.barStart.style.width = `${startPercent}%`;
  elements.barReal.style.width = `${realPercent}%`;
  elements.barStartValue.textContent = formatCurrency(stats.startSalary, settings.country);
  elements.barRealValue.textContent = formatCurrency(stats.realCurrentSalary, settings.country);

  elements.shareText.textContent = shareText;
  elements.downloadReport.removeAttribute("href");

  const lossAmount = Math.max(stats.startSalary - stats.realCurrentSalary, 0);
  elements.shockLine.textContent = lossAmount
    ? dict.shock_template.replace("{loss}", formatCurrency(lossAmount, settings.country))
    : "";
  elements.shockLine.classList.remove("status-loss", "status-gain");
  if (lossAmount > 0) {
    elements.shockLine.classList.add("status-loss");
  } else if (stats.realDelta >= 0.01) {
    elements.shockLine.classList.add("status-gain");
  }

  if (lossAmount > 0) {
    elements.barGap.textContent = dict.bar_gap_loss.replace(
      "{loss}",
      formatCurrency(lossAmount, settings.country),
    );
  } else if (stats.realDelta >= 0.01) {
    const gainAmount = stats.realCurrentSalary - stats.startSalary;
    elements.barGap.textContent = dict.bar_gap_gain.replace(
      "{gain}",
      formatCurrency(gainAmount, settings.country),
    );
  } else {
    elements.barGap.textContent = "";
  }

  elements.customInflationWrap.classList.toggle(
    "is-hidden",
    settings.inflationSource !== "custom",
  );

  renderDataNote(stats, settings);
  renderDynamicLabels(settings);
};

const syncSalaryRanges = (settings) => {
  elements.startSalaryRange.value = settings.startSalary;
  elements.currentSalaryRange.value = settings.currentSalary;
};

const syncSalaryInputs = (settings) => {
  const startUnit = settings.startSalaryUnit || "man";
  const currentUnit = settings.currentSalaryUnit || "man";
  elements.startSalary.value = formatSalaryInputValue(
    settings.startSalary,
    startUnit,
    settings.country,
  );
  elements.currentSalary.value = formatSalaryInputValue(
    settings.currentSalary,
    currentUnit,
    settings.country,
  );
};

const handleInput = () => {
  const startUnit = elements.startSalaryUnit.value || "man";
  const currentUnit = elements.currentSalaryUnit.value || "man";
  const updated = {
    startYear: Number(elements.startYear.value) || DEFAULT_SETTINGS.startYear,
    startSalary:
      (Number(elements.startSalary.value) || 0) * getUnitMultiplier(startUnit, elements.country.value),
    currentYear: Number(elements.currentYear.value) || DEFAULT_SETTINGS.currentYear,
    currentSalary:
      (Number(elements.currentSalary.value) || 0) *
      getUnitMultiplier(currentUnit, elements.country.value),
    inflationSource: elements.inflationSource.value,
    customInflation: Number(elements.customInflation.value) || 0,
    language: elements.language.value,
    country: elements.country.value,
    maskVisible: elements.maskVisible.value === "yes",
    startSalaryUnit: startUnit,
    currentSalaryUnit: currentUnit,
  };
  saveSettings(updated);
  applyTranslations(updated.language);
  render(updated);
  syncSalaryRanges(updated);
};

const handleRangeInput = () => {
  const startUnit = elements.startSalaryUnit.value || "man";
  const currentUnit = elements.currentSalaryUnit.value || "man";
  elements.startSalary.value = formatSalaryInputValue(
    Number(elements.startSalaryRange.value) || 0,
    startUnit,
    elements.country.value,
  );
  elements.currentSalary.value = formatSalaryInputValue(
    Number(elements.currentSalaryRange.value) || 0,
    currentUnit,
    elements.country.value,
  );
  handleInput();
};

const handleCountryChange = () => {
  const salaryDefault = salaryDefaults[elements.country.value] || salaryDefaults.KR;
  elements.startSalaryRange.value = salaryDefault.start;
  elements.currentSalaryRange.value = salaryDefault.current;
  elements.startSalary.value = formatSalaryInputValue(
    salaryDefault.start,
    elements.startSalaryUnit.value || "man",
    elements.country.value,
  );
  elements.currentSalary.value = formatSalaryInputValue(
    salaryDefault.current,
    elements.currentSalaryUnit.value || "man",
    elements.country.value,
  );
  handleInput();
};

const handleUnitChange = () => {
  const settings = loadSettings();
  const updated = {
    ...settings,
    startSalaryUnit: elements.startSalaryUnit.value || "man",
    currentSalaryUnit: elements.currentSalaryUnit.value || "man",
  };
  saveSettings(updated);
  applyTranslations(updated.language);
  render(updated);
  syncSalaryRanges(updated);
  syncSalaryInputs(updated);
};

const handleGenerate = async () => {
  const settings = loadSettings();
  const stats = calculate(settings);
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }
  renderReportCanvas(stats, settings);
  const dataUrl = elements.reportCanvas.toDataURL("image/png");
  elements.downloadReport.href = dataUrl;
};

const handleCopy = async () => {
  const dict = translations[elements.language.value] || translations.ko;
  try {
    await navigator.clipboard.writeText(elements.shareText.textContent);
    elements.copyText.textContent = dict.copy_done;
    setTimeout(() => {
      elements.copyText.textContent = dict.copy_default;
    }, 1600);
  } catch (error) {
    console.warn("Clipboard copy failed", error);
  }
};

const initAds = () => {
  if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
    document.querySelectorAll("ins.adsbygoogle").forEach(() => {
      window.adsbygoogle.push({});
    });
  }
};

const scrollToSection = (targetId) => {
  const node = document.getElementById(targetId);
  if (node) {
    node.scrollIntoView({ behavior: "smooth" });
  }
};

const settings = loadSettings();
setFormValues(settings);
applyTranslations(settings.language);
render(settings);
syncSalaryInputs(settings);
initAds();

["input", "change"].forEach((eventName) => {
  elements.form.addEventListener(eventName, handleInput);
  elements.inflationSource.addEventListener(eventName, handleInput);
  elements.customInflation.addEventListener(eventName, handleInput);
  elements.language.addEventListener(eventName, handleInput);
  elements.maskVisible.addEventListener(eventName, handleInput);
});

elements.country.addEventListener("change", handleCountryChange);
elements.startSalaryRange.addEventListener("input", handleRangeInput);
elements.currentSalaryRange.addEventListener("input", handleRangeInput);
elements.startSalaryUnit.addEventListener("change", handleUnitChange);
elements.currentSalaryUnit.addEventListener("change", handleUnitChange);

elements.generateReport.addEventListener("click", handleGenerate);

elements.copyText.addEventListener("click", handleCopy);

elements.jumpToInputs.addEventListener("click", () => {
  scrollToSection("inputs");
});

elements.jumpToReport.addEventListener("click", () => {
  scrollToSection("report");
});

if (elements.scrollDetails) {
  elements.scrollDetails.addEventListener("click", () => {
    if (elements.resultDetails) {
      elements.resultDetails.open = true;
      elements.resultDetails.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}
