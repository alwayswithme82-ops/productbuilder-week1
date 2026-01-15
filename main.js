const DEFAULT_SETTINGS = {
  startYear: 2019,
  startSalary: 50000000,
  currentYear: 2025,
  currentSalary: 55000000,
  inflationSource: "cpi",
  customInflation: 18,
  priceStart: 4500,
  priceCurrent: 6200,
  language: "ko",
  country: "KR",
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

const priceDefaults = {
  KR: { start: 4500, current: 6200 },
  US: { start: 5.15, current: 7.19 },
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
    step1_title: "1단계: 연봉 입력",
    step1_hint: "입사 시점과 현재를 비교합니다.",
    label_start_year: "입사 연도",
    label_current_year: "현재 연도",
    label_start_salary: "입사 연봉",
    label_current_salary: "현재 연봉",
    step2_title: "2단계: 물가 기준",
    step2_hint: "공식 CPI 또는 체감 물가를 선택하세요.",
    label_inflation_source: "물가 기준",
    option_cpi: "CPI (공식 지수)",
    option_living: "생활물가 (체감 보정)",
    option_custom: "직접 입력",
    label_custom_inflation: "누적 물가 상승률 (%)",
    hint_data: "공식 지수는 World Bank CPI(2010=100) 기반입니다.",
    step3_title: "3단계: 결과 확인",
    step3_hint: "실질 구매력이 얼마나 변했는지 확인합니다.",
    result_real_salary: "실질 연봉 (입사 연도 기준)",
    result_real_salary_hint: "현재 연봉을 물가로 환산한 값",
    result_power_change: "구매력 변화",
    result_power_hint: "입사 연봉 대비 증감",
    result_nominal_change: "연봉 인상률",
    result_nominal_hint: "명목 상승률",
    result_inflation_change: "물가 상승률",
    result_inflation_hint: "입사 → 현재 누적",
    verdict_loading: "결과를 계산 중입니다.",
    melt_title: "녹아내리는 지폐",
    melt_start: "입사 연봉",
    melt_current: "현재 연봉 (실질)",
    step4_title: "4단계: 장바구니 비교",
    step4_hint: "같은 월급으로 살 수 있는 개수입니다.",
    basket_desc: "월급으로 살 수 있는 빅맥 개수를 비교합니다.",
    label_price_start: "입사 연도 빅맥 가격",
    label_price_current: "현재 연도 빅맥 가격",
    basket_start_label: "입사 월급으로",
    basket_current_label: "현재 월급으로",
    report_title: '"사장님 나빠요" 리포트',
    report_generate: "이미지 생성",
    report_desc: "공유용 이미지로 저장해서 커뮤니티에 퍼뜨리세요.",
    report_copy: "텍스트 복사",
    report_download: "이미지 다운로드",
    ad_title: "스폰서",
    footer_note: "World Bank CPI(2010=100) 기준이며 실제 체감과 다를 수 있습니다.",
    data_note_template: "{year} 데이터가 없어 {fallback} CPI로 계산했습니다.",
    verdict_negative:
      "당신의 연봉은 {nominal} 올랐지만, 물가는 {inflation} 올랐습니다. 사실상 연봉 삭감입니다.",
    verdict_flat: "연봉이 올랐지만 물가와 거의 동일합니다. 실질 구매력은 제자리입니다.",
    verdict_positive: "연봉 상승이 물가를 앞섰습니다. 그래도 지켜봐야 합니다.",
    share_text:
      "내 연봉은 {nominal} 올랐지만 물가는 {inflation} 올랐네요. 실질 구매력 {real}. #인플레이션 #월급실질가치",
    report_title_line: "사장님 나빠요",
    report_subtitle: "내 연봉의 실질 가치",
    report_caption: "열심히 일해도 가난해지는 이유,",
    report_caption2: "이 숫자에 다 있습니다.",
    report_footer: "내 연봉은 올랐는데...",
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
    step1_title: "Step 1: Salary Inputs",
    step1_hint: "Compare your starting year vs today.",
    label_start_year: "Start year",
    label_current_year: "Current year",
    label_start_salary: "Starting salary",
    label_current_salary: "Current salary",
    step2_title: "Step 2: Inflation data",
    step2_hint: "Choose official CPI or a felt-inflation adjustment.",
    label_inflation_source: "Inflation source",
    option_cpi: "CPI (official index)",
    option_living: "Felt inflation (+6%)",
    option_custom: "Custom input",
    label_custom_inflation: "Total inflation (%)",
    hint_data: "Official CPI is from World Bank CPI (2010=100).",
    step3_title: "Step 3: Results",
    step3_hint: "See how much buying power changed.",
    result_real_salary: "Real salary (start-year value)",
    result_real_salary_hint: "Current salary adjusted by inflation",
    result_power_change: "Buying power change",
    result_power_hint: "Compared to starting salary",
    result_nominal_change: "Nominal raise",
    result_nominal_hint: "Headline increase",
    result_inflation_change: "Inflation",
    result_inflation_hint: "Start → current total",
    verdict_loading: "Calculating...",
    melt_title: "Melting Cash",
    melt_start: "Starting salary",
    melt_current: "Current salary (real)",
    step4_title: "Step 4: Basket check",
    step4_hint: "How many burgers your paycheck buys.",
    basket_desc: "Compare how many Big Macs your monthly pay can buy.",
    label_price_start: "Big Mac price (start year)",
    label_price_current: "Big Mac price (current year)",
    basket_start_label: "With start paycheck",
    basket_current_label: "With current paycheck",
    report_title: '"Boss, this is unfair" report',
    report_generate: "Generate image",
    report_desc: "Save and share this report in your community.",
    report_copy: "Copy text",
    report_download: "Download image",
    ad_title: "Sponsor",
    footer_note: "Based on World Bank CPI (2010=100); real-life impact may differ.",
    data_note_template: "{year} CPI not available. Using {fallback} CPI instead.",
    verdict_negative:
      "Your salary is up {nominal}, but inflation is {inflation}. That is a real pay cut.",
    verdict_flat: "Your pay rise barely matches inflation. Buying power is flat.",
    verdict_positive: "Your pay rise beats inflation for now.",
    share_text:
      "My salary is up {nominal} but inflation is {inflation}. Real buying power {real}. #inflation #salary",
    report_title_line: "Boss, this is unfair",
    report_subtitle: "My real salary value",
    report_caption: "Why hard work feels poorer,",
    report_caption2: "the numbers are here.",
    report_footer: "My salary went up but...",
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
  priceStart: document.getElementById("price-start"),
  priceCurrent: document.getElementById("price-current"),
  realSalary: document.getElementById("real-salary"),
  powerChange: document.getElementById("power-change"),
  nominalChange: document.getElementById("nominal-change"),
  inflationChange: document.getElementById("inflation-change"),
  verdict: document.getElementById("verdict"),
  stackStart: document.getElementById("stack-start"),
  stackCurrent: document.getElementById("stack-current"),
  startSalaryLabel: document.getElementById("start-salary-label"),
  currentSalaryLabel: document.getElementById("current-salary-label"),
  basketStart: document.getElementById("basket-start"),
  basketCurrent: document.getElementById("basket-current"),
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
  labelPriceStart: document.getElementById("label-price-start"),
  labelPriceCurrent: document.getElementById("label-price-current"),
  dataNote: document.getElementById("data-note"),
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const formatCurrency = (value, country) => {
  const { currency, locale } = currencyByCountry[country] || currencyByCountry.KR;
  const digits = currency === "KRW" ? 0 : 2;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: digits,
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
  elements.startSalary.value = settings.startSalary;
  elements.currentYear.value = settings.currentYear;
  elements.currentSalary.value = settings.currentSalary;
  elements.inflationSource.value = settings.inflationSource;
  elements.customInflation.value = settings.customInflation;
  elements.priceStart.value = settings.priceStart;
  elements.priceCurrent.value = settings.priceCurrent;
  elements.language.value = settings.language;
  elements.country.value = settings.country;
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
  const basketStart = settings.priceStart
    ? Math.floor(monthlyStart / settings.priceStart)
    : 0;
  const basketCurrent = settings.priceCurrent
    ? Math.floor(monthlyCurrent / settings.priceCurrent)
    : 0;

  return {
    startSalary,
    currentSalary,
    realCurrentSalary,
    nominalDelta,
    realDelta,
    inflationRate,
    basketStart,
    basketCurrent,
    inflationInfo,
  };
};

const renderReportCanvas = (stats, settings) => {
  const dict = translations[settings.language] || translations.ko;
  const canvas = elements.reportCanvas;
  const ctx = canvas.getContext("2d");
  const { width, height } = canvas;
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#fff1d6");
  gradient.addColorStop(0.55, "#ffd2a8");
  gradient.addColorStop(1, "#f69a76");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(18, 18, 18, 0.1)";
  for (let i = 0; i < 18; i += 1) {
    ctx.fillRect(80 + i * 50, 100, 12, height - 200);
  }

  ctx.fillStyle = "#141414";
  ctx.font = "76px 'Gowun Batang', serif";
  ctx.fillText(dict.report_title_line, 80, 210);

  ctx.font = "36px 'Noto Sans KR', sans-serif";
  ctx.fillText(dict.report_subtitle, 80, 280);

  ctx.font = "48px 'Gowun Batang', serif";
  ctx.fillStyle = "#b0261b";
  ctx.fillText(`${dict.result_inflation_change} +${formatPercent(stats.inflationRate, settings.language)}`, 80, 380);

  ctx.fillStyle = "#1b1b1b";
  ctx.fillText(`${dict.result_nominal_change} +${formatPercent(stats.nominalDelta, settings.language)}`, 80, 455);

  ctx.font = "34px 'Noto Sans KR', sans-serif";
  ctx.fillText(`${dict.result_power_change} ${formatPercent(stats.realDelta, settings.language)}`, 80, 530);

  ctx.fillStyle = "#1b1b1b";
  ctx.font = "30px 'Noto Sans KR', sans-serif";
  ctx.fillText(dict.report_caption, 80, 620);
  ctx.fillText(dict.report_caption2, 80, 670);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(80, 760, 920, 180);

  ctx.fillStyle = "#1b1b1b";
  ctx.font = "28px 'Noto Sans KR', sans-serif";
  ctx.fillText(dict.report_footer, 110, 820);
  ctx.font = "36px 'Gowun Batang', serif";
  drawWrappedText(ctx, getVerdictText(stats, settings.language), 110, 890, 860, 46);
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
  elements.labelStartSalary.textContent = `${dict.label_start_salary} (${currency})`;
  elements.labelCurrentSalary.textContent = `${dict.label_current_salary} (${currency})`;
  elements.labelPriceStart.textContent = `${settings.startYear} ${dict.label_price_start}`;
  elements.labelPriceCurrent.textContent = `${settings.currentYear} ${dict.label_price_current}`;
  const salaryStep = settings.country === "US" ? 1000 : 100000;
  elements.startSalary.step = salaryStep;
  elements.currentSalary.step = salaryStep;
  const priceStep = settings.country === "US" ? 0.01 : 10;
  elements.priceStart.step = priceStep;
  elements.priceCurrent.step = priceStep;
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
  const { locale } = currencyByCountry[settings.country] || currencyByCountry.KR;

  elements.realSalary.textContent = formatCurrency(stats.realCurrentSalary, settings.country);
  elements.powerChange.textContent = formatPercent(stats.realDelta, settings.language);
  elements.nominalChange.textContent = formatPercent(stats.nominalDelta, settings.language);
  elements.inflationChange.textContent = formatPercent(stats.inflationRate, settings.language);
  elements.verdict.textContent = verdictText;

  elements.startSalaryLabel.textContent = formatCurrency(stats.startSalary, settings.country);
  elements.currentSalaryLabel.textContent = formatCurrency(stats.realCurrentSalary, settings.country);

  const ratio = clamp(stats.realCurrentSalary / (stats.startSalary || 1), 0.2, 1.1);
  elements.stackStart.style.setProperty("--stack-level", "1");
  elements.stackCurrent.style.setProperty("--stack-level", ratio.toFixed(2));

  elements.basketStart.textContent = `${formatNumber(stats.basketStart, locale)}${
    settings.language === "en" ? " pcs" : "개"
  }`;
  elements.basketCurrent.textContent = `${formatNumber(stats.basketCurrent, locale)}${
    settings.language === "en" ? " pcs" : "개"
  }`;

  elements.shareText.textContent = shareText;
  elements.downloadReport.removeAttribute("href");

  elements.customInflationWrap.classList.toggle(
    "is-hidden",
    settings.inflationSource !== "custom",
  );

  renderDataNote(stats, settings);
  renderDynamicLabels(settings);
};

const applyCountryDefaults = (settings, overwritePrices = false) => {
  const defaults = priceDefaults[settings.country] || priceDefaults.KR;
  if (overwritePrices) {
    elements.priceStart.value = defaults.start;
    elements.priceCurrent.value = defaults.current;
  }
};

const handleInput = () => {
  const updated = {
    startYear: Number(elements.startYear.value) || DEFAULT_SETTINGS.startYear,
    startSalary: Number(elements.startSalary.value) || 0,
    currentYear: Number(elements.currentYear.value) || DEFAULT_SETTINGS.currentYear,
    currentSalary: Number(elements.currentSalary.value) || 0,
    inflationSource: elements.inflationSource.value,
    customInflation: Number(elements.customInflation.value) || 0,
    priceStart: Number(elements.priceStart.value) || 0,
    priceCurrent: Number(elements.priceCurrent.value) || 0,
    language: elements.language.value,
    country: elements.country.value,
  };
  saveSettings(updated);
  applyTranslations(updated.language);
  render(updated);
};

const handleCountryChange = () => {
  const priceDefault = priceDefaults[elements.country.value] || priceDefaults.KR;
  const salaryDefault = salaryDefaults[elements.country.value] || salaryDefaults.KR;
  elements.priceStart.value = priceDefault.start;
  elements.priceCurrent.value = priceDefault.current;
  elements.startSalary.value = salaryDefault.start;
  elements.currentSalary.value = salaryDefault.current;
  handleInput();
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
    window.adsbygoogle.push({});
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
applyCountryDefaults(settings, false);
render(settings);
initAds();

["input", "change"].forEach((eventName) => {
  elements.form.addEventListener(eventName, handleInput);
  elements.inflationSource.addEventListener(eventName, handleInput);
  elements.customInflation.addEventListener(eventName, handleInput);
  elements.priceStart.addEventListener(eventName, handleInput);
  elements.priceCurrent.addEventListener(eventName, handleInput);
  elements.language.addEventListener(eventName, handleInput);
});

elements.country.addEventListener("change", handleCountryChange);

elements.generateReport.addEventListener("click", handleGenerate);

elements.copyText.addEventListener("click", handleCopy);

elements.jumpToInputs.addEventListener("click", () => {
  scrollToSection("inputs");
});

elements.jumpToReport.addEventListener("click", () => {
  scrollToSection("report");
});
