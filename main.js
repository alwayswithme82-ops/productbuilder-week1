const DEFAULT_SETTINGS = {
  startYear: 2019,
  startSalary: 50000000,
  currentYear: 2025,
  currentSalary: 55000000,
  inflationSource: "cpi",
  customInflation: 18,
  priceStart: 4500,
  priceCurrent: 6200,
};

const STORAGE_KEY = "inflation-check-settings";

const inflationSeries = {
  cpi: {
    2018: 98.4,
    2019: 100.0,
    2020: 100.5,
    2021: 102.5,
    2022: 107.6,
    2023: 111.4,
    2024: 114.8,
    2025: 118.0,
  },
  living: {
    2018: 97.6,
    2019: 100.0,
    2020: 101.6,
    2021: 104.1,
    2022: 110.9,
    2023: 116.7,
    2024: 121.2,
    2025: 126.8,
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
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const formatCurrency = (value) =>
  new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(Math.round(value));

const formatPercent = (value) => `${(value * 100).toFixed(1)}%`;

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
};

const getInflationFactor = (settings) => {
  const startYear = settings.startYear;
  const currentYear = settings.currentYear;
  if (settings.inflationSource === "custom") {
    return 1 + settings.customInflation / 100;
  }

  const series = inflationSeries[settings.inflationSource];
  if (!series || !series[startYear] || !series[currentYear]) {
    return 1;
  }

  return series[currentYear] / series[startYear];
};

const getVerdictText = (stats) => {
  if (stats.realDelta <= -0.01) {
    return `당신의 연봉은 ${formatPercent(stats.nominalDelta)} 올랐지만, 물가는 ${formatPercent(
      stats.inflationRate,
    )} 올랐습니다. 사실상 연봉 삭감입니다.`;
  }
  if (stats.realDelta <= 0.01) {
    return "연봉이 올랐지만 물가와 거의 동일합니다. 실질 구매력은 제자리입니다.";
  }
  return "연봉 상승이 물가를 앞섰습니다. 그래도 지켜봐야 합니다.";
};

const getShareText = (stats) =>
  `내 연봉은 ${formatPercent(stats.nominalDelta)} 올랐지만 물가는 ${formatPercent(
    stats.inflationRate,
  )} 올랐네요. 실질 구매력 ${formatPercent(stats.realDelta)}. #인플레이션 #월급실질가치`;

const calculate = (settings) => {
  const startSalary = Math.max(0, settings.startSalary);
  const currentSalary = Math.max(0, settings.currentSalary);
  const inflationFactor = getInflationFactor(settings);
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
  };
};

const renderReportCanvas = (stats) => {
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
  ctx.font = "82px 'Gowun Batang', serif";
  ctx.fillText("사장님 나빠요", 80, 210);

  ctx.font = "40px 'Noto Sans KR', sans-serif";
  ctx.fillText("내 연봉의 실질 가치", 80, 280);

  ctx.font = "48px 'Gowun Batang', serif";
  ctx.fillStyle = "#b0261b";
  ctx.fillText(`물가 +${formatPercent(stats.inflationRate)}`, 80, 380);

  ctx.fillStyle = "#1b1b1b";
  ctx.fillText(`연봉 +${formatPercent(stats.nominalDelta)}`, 80, 455);

  ctx.font = "36px 'Noto Sans KR', sans-serif";
  ctx.fillText(`실질 구매력 ${formatPercent(stats.realDelta)}`, 80, 530);

  ctx.fillStyle = "#1b1b1b";
  ctx.font = "32px 'Noto Sans KR', sans-serif";
  ctx.fillText("열심히 일해도 가난해지는 이유,", 80, 620);
  ctx.fillText("이 숫자에 다 있습니다.", 80, 670);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(80, 760, 920, 180);

  ctx.fillStyle = "#1b1b1b";
  ctx.font = "30px 'Noto Sans KR', sans-serif";
  ctx.fillText("내 연봉은 올랐는데...", 110, 820);
  ctx.font = "40px 'Gowun Batang', serif";
  drawWrappedText(ctx, getVerdictText(stats), 110, 890, 860, 52);
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

const render = (settings) => {
  const stats = calculate(settings);
  const verdictText = getVerdictText(stats);
  const shareText = getShareText(stats);

  elements.realSalary.textContent = formatCurrency(stats.realCurrentSalary);
  elements.powerChange.textContent = formatPercent(stats.realDelta);
  elements.nominalChange.textContent = formatPercent(stats.nominalDelta);
  elements.inflationChange.textContent = formatPercent(stats.inflationRate);
  elements.verdict.textContent = verdictText;

  elements.startSalaryLabel.textContent = formatCurrency(stats.startSalary);
  elements.currentSalaryLabel.textContent = formatCurrency(stats.realCurrentSalary);

  const ratio = clamp(stats.realCurrentSalary / (stats.startSalary || 1), 0.2, 1.1);
  elements.stackStart.style.setProperty("--stack-level", "1");
  elements.stackCurrent.style.setProperty("--stack-level", ratio.toFixed(2));

  elements.basketStart.textContent = `${stats.basketStart.toLocaleString("ko-KR")}개`;
  elements.basketCurrent.textContent = `${stats.basketCurrent.toLocaleString("ko-KR")}개`;

  elements.shareText.textContent = shareText;
  elements.downloadReport.removeAttribute("href");

  elements.customInflationWrap.classList.toggle(
    "is-hidden",
    settings.inflationSource !== "custom",
  );
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
  };
  saveSettings(updated);
  render(updated);
};

const handleGenerate = async () => {
  const settings = loadSettings();
  const stats = calculate(settings);
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }
  renderReportCanvas(stats);
  const dataUrl = elements.reportCanvas.toDataURL("image/png");
  elements.downloadReport.href = dataUrl;
};

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(elements.shareText.textContent);
    elements.copyText.textContent = "복사 완료";
    setTimeout(() => {
      elements.copyText.textContent = "텍스트 복사";
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
render(settings);
initAds();

["input", "change"].forEach((eventName) => {
  elements.form.addEventListener(eventName, handleInput);
  elements.inflationSource.addEventListener(eventName, handleInput);
  elements.customInflation.addEventListener(eventName, handleInput);
  elements.priceStart.addEventListener(eventName, handleInput);
  elements.priceCurrent.addEventListener(eventName, handleInput);
});

elements.generateReport.addEventListener("click", handleGenerate);

elements.copyText.addEventListener("click", handleCopy);

elements.jumpToInputs.addEventListener("click", () => {
  scrollToSection("inputs");
});

elements.jumpToReport.addEventListener("click", () => {
  scrollToSection("report");
});
