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
  basketItem: "bigmac",
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

const basketItems = {
  bigmac: {
    ko: "빅맥",
    en: "Big Mac",
    prices: {
      KR: { start: 4500, current: 6200 },
      US: { start: 5.15, current: 7.19 },
    },
  },
  soup: {
    ko: "국밥",
    en: "Gukbap",
    prices: {
      KR: { start: 9000, current: 12000 },
      US: { start: 9, current: 12 },
    },
  },
  soju: {
    ko: "소주",
    en: "Soju",
    prices: {
      KR: { start: 4000, current: 5500 },
      US: { start: 8, current: 12 },
    },
  },
  chicken: {
    ko: "치킨",
    en: "Fried chicken",
    prices: {
      KR: { start: 17000, current: 22000 },
      US: { start: 12, current: 18 },
    },
  },
  apartment: {
    ko: "아파트 평당",
    en: "Apartment / pyeong",
    prices: {
      KR: { start: 35000000, current: 55000000 },
      US: { start: 300000, current: 420000 },
    },
  },
  starbucks: {
    ko: "스벅 아메",
    en: "Starbucks Americano",
    prices: {
      KR: { start: 4100, current: 5500 },
      US: { start: 3.95, current: 4.95 },
    },
  },
  subway: {
    ko: "지하철 요금",
    en: "Subway fare",
    prices: {
      KR: { start: 1250, current: 1500 },
      US: { start: 2.75, current: 3.0 },
    },
  },
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
    step3_title: "3단계: 충격 결과",
    step3_hint: "숫자로 확인하는 월급 실종 사건입니다.",
    result_real_salary: "지금 연봉의 실체",
    result_real_salary_hint: "물가로 환산한 실질 연봉",
    result_power_change: "월급 녹아내림",
    result_power_hint: "입사 연봉 대비 체감",
    result_nominal_change: "연봉 인상률",
    result_nominal_hint: "명목 상승률",
    result_inflation_change: "물가 상승률",
    result_inflation_hint: "입사 → 현재 누적",
    verdict_loading: "결과 계산 중입니다.",
    loading_text: "결과 계산 중입니다.",
    melt_title: "녹아내리는 지폐",
    melt_start: "입사 연봉",
    melt_current: "현재 연봉 (실질)",
    step4_title: "4단계: 장바구니 비교",
    step4_hint: "같은 월급으로 살 수 있는 개수입니다.",
    basket_desc: "월급으로 살 수 있는 개수를 비교합니다.",
    label_basket_item: "비교 아이템",
    basket_bigmac: "빅맥",
    basket_soup: "국밥",
    basket_soju: "소주",
    basket_chicken: "치킨",
    basket_apartment: "아파트 평당",
    basket_starbucks: "스벅 아메",
    basket_subway: "지하철 요금",
    label_price_start: "가격",
    label_price_current: "가격",
    basket_start_label: "입사 월급으로",
    basket_current_label: "현재 월급으로",
    report_title: "연봉 협상용 팩트 폭격기",
    report_generate: "이미지 생성",
    report_desc: "공유용 이미지로 저장해서 커뮤니티에 퍼뜨리세요.",
    report_copy: "텍스트 복사",
    report_download: "이미지 다운로드",
    ad_title: "스폰서",
    footer_note: "World Bank CPI(2010=100) 기준이며 실제 체감과 다를 수 있습니다.",
    data_note_template: "{year} 데이터가 없어 {fallback} CPI로 계산했습니다.",
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
    report_title_line: "연봉 협상용",
    report_subtitle: "팩트 폭격기",
    report_caption: "열심히 일해도 가난해지는 이유,",
    report_caption2: "이 숫자에 다 있습니다.",
    report_footer: "월급 올랐다고요? 아니요.",
    report_watermark: "Powered by 내월급지킴이.com",
    ad_caption: "손해 본 돈, 이걸로 메꾸세요",
    basket_story:
      "{startYear}년엔 {item} {start}개였는데, 지금은 {current}개. {lost}개 압수당했습니다.",
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
    step3_title: "Step 3: Reality Check",
    step3_hint: "This is how your paycheck really feels.",
    result_real_salary: "Real salary today",
    result_real_salary_hint: "Adjusted for inflation",
    result_power_change: "Paycheck melt-down",
    result_power_hint: "Compared to your start",
    result_nominal_change: "Nominal raise",
    result_nominal_hint: "Headline increase",
    result_inflation_change: "Inflation",
    result_inflation_hint: "Start → current total",
    verdict_loading: "Calculating results...",
    loading_text: "Calculating results...",
    melt_title: "Melting Cash",
    melt_start: "Starting salary",
    melt_current: "Current salary (real)",
    step4_title: "Step 4: Basket check",
    step4_hint: "How many burgers your paycheck buys.",
    basket_desc: "Compare how many items your monthly pay can buy.",
    label_basket_item: "Pick item",
    basket_bigmac: "Big Mac",
    basket_soup: "Gukbap",
    basket_soju: "Soju",
    basket_chicken: "Fried chicken",
    basket_apartment: "Apartment / pyeong",
    basket_starbucks: "Starbucks Americano",
    basket_subway: "Subway fare",
    label_price_start: "price",
    label_price_current: "price",
    basket_start_label: "With start paycheck",
    basket_current_label: "With current paycheck",
    report_title: "Salary negotiation fact bomb",
    report_generate: "Generate image",
    report_desc: "Save and share this report in your community.",
    report_copy: "Copy text",
    report_download: "Download image",
    ad_title: "Sponsor",
    footer_note: "Based on World Bank CPI (2010=100); real-life impact may differ.",
    data_note_template: "{year} CPI not available. Using {fallback} CPI instead.",
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
    report_title_line: "Salary negotiation",
    report_subtitle: "Fact bomb",
    report_caption: "Why hard work feels poorer,",
    report_caption2: "the numbers are here.",
    report_footer: "Salary went up? Not really.",
    report_watermark: "Powered by naewolpay.com",
    ad_caption: "Cover your loss with this",
    basket_story:
      "In {startYear}, {item} {start} pcs. Now {current} pcs. Lost {lost} pcs.",
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
  shockLine: document.getElementById("shock-line"),
  basketItem: document.getElementById("basket-item"),
  basketStory: document.getElementById("basket-story"),
  moneyImage: document.getElementById("money-image"),
  startSalaryRange: document.getElementById("start-salary-range"),
  currentSalaryRange: document.getElementById("current-salary-range"),
  barStart: document.getElementById("bar-start"),
  barReal: document.getElementById("bar-real"),
  barStartValue: document.getElementById("bar-start-value"),
  barRealValue: document.getElementById("bar-real-value"),
  barGap: document.getElementById("bar-gap"),
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const toDataUri = (svg) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const moneyImages = {
  clean: toDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="220" viewBox="0 0 360 220">
      <rect x="10" y="20" width="340" height="180" rx="18" fill="#f4e2a8" stroke="#c69c5d" stroke-width="6"/>
      <rect x="30" y="45" width="300" height="130" rx="14" fill="#f8edc3" stroke="#d2ab6c" stroke-width="3"/>
      <text x="180" y="120" font-size="46" text-anchor="middle" font-family="Arial" fill="#6b4b2a">50,000</text>
      <text x="180" y="152" font-size="18" text-anchor="middle" font-family="Arial" fill="#6b4b2a">Sindaemdang</text>
    </svg>`,
  ),
  burnt: toDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="220" viewBox="0 0 360 220">
      <rect x="10" y="20" width="340" height="180" rx="18" fill="#e2b07f" stroke="#9b5b3a" stroke-width="6"/>
      <rect x="30" y="45" width="300" height="130" rx="14" fill="#efc899" stroke="#b7774a" stroke-width="3"/>
      <circle cx="70" cy="80" r="16" fill="#f6f3ef"/>
      <circle cx="250" cy="70" r="10" fill="#f6f3ef"/>
      <circle cx="200" cy="150" r="14" fill="#f6f3ef"/>
      <path d="M20 50 L40 35 L55 45 L35 60 Z" fill="#8b4c2f"/>
      <text x="180" y="120" font-size="44" text-anchor="middle" font-family="Arial" fill="#6b4b2a">50,000</text>
      <text x="180" y="152" font-size="18" text-anchor="middle" font-family="Arial" fill="#6b4b2a">Burned</text>
    </svg>`,
  ),
};

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
  elements.basketItem.value = settings.basketItem;
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
  const item = basketItems[settings.basketItem] || basketItems.bigmac;
  const itemName = settings.language === "en" ? item.en : item.ko;
  const lostCount = Math.max(stats.basketStart - stats.basketCurrent, 0);
  const lossAmount = Math.max(stats.startSalary - stats.realCurrentSalary, 0);
  const basketLossValue = lostCount * (settings.priceCurrent || 0);
  const totalLoss = lossAmount + basketLossValue;
  const { locale } = currencyByCountry[settings.country] || currencyByCountry.KR;

  ctx.fillStyle = "#111111";
  ctx.fillRect(0, 0, width, height);

  const receiptX = 120;
  const receiptY = 80;
  const receiptW = width - 240;
  const receiptH = height - 160;

  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(receiptX + 12, receiptY + 12, receiptW, receiptH);

  ctx.fillStyle = "#f7f7f7";
  ctx.fillRect(receiptX, receiptY, receiptW, receiptH);

  ctx.strokeStyle = "#111111";
  ctx.setLineDash([14, 10]);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(receiptX + 30, receiptY + 90);
  ctx.lineTo(receiptX + receiptW - 30, receiptY + 90);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "#111111";
  ctx.font = "36px 'GmarketSansBold', sans-serif";
  ctx.fillText(dict.receipt_title, receiptX + 40, receiptY + 60);

  ctx.font = "26px 'Pretendard', sans-serif";
  ctx.fillText(
    dict.receipt_headline
      .replace("{item}", itemName)
      .replace("{lost}", formatNumber(lostCount, locale)),
    receiptX + 40,
    receiptY + 100,
  );

  ctx.font = "24px 'Pretendard', sans-serif";
  ctx.fillText(
    `${dict.result_inflation_change}: +${formatPercent(stats.inflationRate, settings.language)}`,
    receiptX + 40,
    receiptY + 160,
  );
  ctx.fillText(
    `${dict.result_nominal_change}: +${formatPercent(stats.nominalDelta, settings.language)}`,
    receiptX + 40,
    receiptY + 200,
  );
  ctx.fillText(
    `${dict.result_power_change}: ${formatPercent(stats.realDelta, settings.language)}`,
    receiptX + 40,
    receiptY + 240,
  );

  const tableTop = receiptY + 300;
  ctx.strokeStyle = "#111111";
  ctx.beginPath();
  ctx.moveTo(receiptX + 30, tableTop);
  ctx.lineTo(receiptX + receiptW - 30, tableTop);
  ctx.stroke();

  ctx.font = "22px 'Pretendard', sans-serif";
  ctx.fillText(dict.receipt_col_item, receiptX + 40, tableTop + 40);
  ctx.fillText(dict.receipt_col_qty, receiptX + receiptW - 300, tableTop + 40);
  ctx.fillText(dict.receipt_col_amount, receiptX + receiptW - 160, tableTop + 40);

  const lineY1 = tableTop + 90;
  ctx.fillText(dict.receipt_item_salary, receiptX + 40, lineY1);
  ctx.fillText("1", receiptX + receiptW - 300, lineY1);
  ctx.fillText(`-${formatCurrency(lossAmount, settings.country)}`, receiptX + receiptW - 200, lineY1);

  const lineY2 = lineY1 + 50;
  ctx.fillText(
    dict.receipt_item_basket.replace("{item}", itemName),
    receiptX + 40,
    lineY2,
  );
  ctx.fillText(formatNumber(lostCount, locale), receiptX + receiptW - 300, lineY2);
  ctx.fillText(`-${formatCurrency(basketLossValue, settings.country)}`, receiptX + receiptW - 200, lineY2);

  const lineY3 = lineY2 + 50;
  ctx.fillText(dict.receipt_item_conscience, receiptX + 40, lineY3);
  ctx.fillText("0", receiptX + receiptW - 300, lineY3);
  ctx.fillText(formatCurrency(0, settings.country), receiptX + receiptW - 200, lineY3);

  const totalY = lineY3 + 70;
  ctx.strokeStyle = "#111111";
  ctx.beginPath();
  ctx.moveTo(receiptX + 30, totalY - 30);
  ctx.lineTo(receiptX + receiptW - 30, totalY - 30);
  ctx.stroke();

  ctx.font = "26px 'GmarketSansBold', sans-serif";
  ctx.fillText(dict.receipt_total, receiptX + 40, totalY + 10);
  ctx.fillText(`-${formatCurrency(totalLoss, settings.country)}`, receiptX + receiptW - 260, totalY + 10);

  ctx.font = "20px 'Pretendard', sans-serif";
  ctx.fillText(dict.report_watermark, receiptX + 40, receiptY + receiptH - 80);

  const barcodeY = receiptY + receiptH - 50;
  const barcodeX = receiptX + 40;
  for (let i = 0; i < 60; i += 1) {
    const barWidth = i % 3 === 0 ? 4 : 2;
    ctx.fillRect(barcodeX + i * 6, barcodeY, barWidth, 30);
  }
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
  const item = basketItems[settings.basketItem] || basketItems.bigmac;
  const itemName = settings.language === "en" ? item.en : item.ko;
  elements.labelStartSalary.textContent = `${dict.label_start_salary} (${currency})`;
  elements.labelCurrentSalary.textContent = `${dict.label_current_salary} (${currency})`;
  elements.labelPriceStart.textContent = `${settings.startYear} ${itemName} ${dict.label_price_start}`;
  elements.labelPriceCurrent.textContent = `${settings.currentYear} ${itemName} ${dict.label_price_current}`;
  const salaryStep = settings.country === "US" ? 1000 : 100000;
  elements.startSalary.step = salaryStep;
  elements.currentSalary.step = salaryStep;
  elements.startSalaryRange.step = salaryStep;
  elements.currentSalaryRange.step = salaryStep;
  const salaryMax = settings.country === "US" ? 200000 : 200000000;
  elements.startSalaryRange.max = salaryMax;
  elements.currentSalaryRange.max = salaryMax;
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
  const powerMessage = getPowerMessage(stats, settings.language);
  const { locale } = currencyByCountry[settings.country] || currencyByCountry.KR;

  elements.realSalary.textContent = formatCurrency(stats.realCurrentSalary, settings.country);
  elements.powerChange.textContent = powerMessage;
  elements.nominalChange.textContent = formatPercent(stats.nominalDelta, settings.language);
  elements.inflationChange.textContent = formatPercent(stats.inflationRate, settings.language);
  elements.verdict.textContent = verdictText;

  elements.powerChange.classList.remove("status-loss", "status-gain");
  if (stats.realDelta <= -0.01) {
    elements.powerChange.classList.add("status-loss");
  } else if (stats.realDelta >= 0.01) {
    elements.powerChange.classList.add("status-gain");
  }

  const maxValue = Math.max(stats.startSalary, stats.realCurrentSalary, 1);
  const startPercent = (stats.startSalary / maxValue) * 100;
  const realPercent = (stats.realCurrentSalary / maxValue) * 100;
  elements.barStart.style.width = `${startPercent}%`;
  elements.barReal.style.width = `${realPercent}%`;
  elements.barStartValue.textContent = formatCurrency(stats.startSalary, settings.country);
  elements.barRealValue.textContent = formatCurrency(stats.realCurrentSalary, settings.country);

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

  const dict = translations[settings.language] || translations.ko;
  const item = basketItems[settings.basketItem] || basketItems.bigmac;
  const itemName = settings.language === "en" ? item.en : item.ko;
  const lostCount = Math.max(stats.basketStart - stats.basketCurrent, 0);
  elements.basketStory.textContent = dict.basket_story
    .replace("{startYear}", settings.startYear)
    .replace("{item}", itemName)
    .replace("{start}", formatNumber(stats.basketStart, locale))
    .replace("{current}", formatNumber(stats.basketCurrent, locale))
    .replace("{lost}", formatNumber(lostCount, locale));

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

  elements.moneyImage.src = stats.realDelta < -0.01 ? moneyImages.burnt : moneyImages.clean;

  elements.customInflationWrap.classList.toggle(
    "is-hidden",
    settings.inflationSource !== "custom",
  );

  renderDataNote(stats, settings);
  renderDynamicLabels(settings);
};

const getBasketPriceDefaults = (settings) => {
  const item = basketItems[settings.basketItem] || basketItems.bigmac;
  return item.prices[settings.country] || item.prices.KR;
};

const applyCountryDefaults = (settings, overwritePrices = false) => {
  const defaults = getBasketPriceDefaults(settings);
  if (overwritePrices) {
    elements.priceStart.value = defaults.start;
    elements.priceCurrent.value = defaults.current;
  }
};

const syncSalaryRanges = (settings) => {
  elements.startSalaryRange.value = settings.startSalary;
  elements.currentSalaryRange.value = settings.currentSalary;
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
    basketItem: elements.basketItem.value,
  };
  saveSettings(updated);
  applyTranslations(updated.language);
  render(updated);
  syncSalaryRanges(updated);
};

const handleRangeInput = () => {
  elements.startSalary.value = elements.startSalaryRange.value;
  elements.currentSalary.value = elements.currentSalaryRange.value;
  handleInput();
};

const handleCountryChange = () => {
  const priceDefault = getBasketPriceDefaults({
    basketItem: elements.basketItem.value,
    country: elements.country.value,
  });
  const salaryDefault = salaryDefaults[elements.country.value] || salaryDefaults.KR;
  elements.priceStart.value = priceDefault.start;
  elements.priceCurrent.value = priceDefault.current;
  elements.startSalary.value = salaryDefault.start;
  elements.currentSalary.value = salaryDefault.current;
  handleInput();
};

const handleBasketChange = () => {
  const priceDefault = getBasketPriceDefaults({
    basketItem: elements.basketItem.value,
    country: elements.country.value,
  });
  elements.priceStart.value = priceDefault.start;
  elements.priceCurrent.value = priceDefault.current;
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
elements.basketItem.addEventListener("change", handleBasketChange);
elements.startSalaryRange.addEventListener("input", handleRangeInput);
elements.currentSalaryRange.addEventListener("input", handleRangeInput);

elements.generateReport.addEventListener("click", handleGenerate);

elements.copyText.addEventListener("click", handleCopy);

elements.jumpToInputs.addEventListener("click", () => {
  scrollToSection("inputs");
});

elements.jumpToReport.addEventListener("click", () => {
  scrollToSection("report");
});
