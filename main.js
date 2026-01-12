const DEFAULT_SETTINGS = {
  hourlyWage: 12000,
  currency: "KRW",
  hoursPerWeek: 40,
  workdaysPerWeek: 5,
  startTime: "09:00",
  endTime: "18:00",
};

const STORAGE_KEY = "wage-settings";

const elements = {
  form: document.getElementById("wage-form"),
  hourlyWage: document.getElementById("hourly-wage"),
  currency: document.getElementById("currency"),
  hoursPerWeek: document.getElementById("hours-per-week"),
  workdaysPerWeek: document.getElementById("workdays-per-week"),
  startTime: document.getElementById("start-time"),
  endTime: document.getElementById("end-time"),
  liveAmount: document.getElementById("live-amount"),
  rateHour: document.getElementById("rate-hour"),
  rateMinute: document.getElementById("rate-minute"),
  rateSecond: document.getElementById("rate-second"),
  todayRing: document.getElementById("today-ring"),
  todayPercent: document.getElementById("today-percent"),
  todayTotal: document.getElementById("today-total"),
  todayEarned: document.getElementById("today-earned"),
  todayBar: document.getElementById("today-bar"),
  weekTotal: document.getElementById("week-total"),
  weekEarned: document.getElementById("week-earned"),
  weekGrid: document.getElementById("week-grid"),
  monthProjection: document.getElementById("month-projection"),
  yearProjection: document.getElementById("year-projection"),
  dayAverage: document.getElementById("day-average"),
};

const currencyLocales = {
  KRW: "ko-KR",
  USD: "en-US",
  EUR: "de-DE",
  JPY: "ja-JP",
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const loadSettings = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return { ...DEFAULT_SETTINGS };
  }
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
  } catch (error) {
    console.warn("Failed to parse saved settings", error);
    return { ...DEFAULT_SETTINGS };
  }
};

const saveSettings = (settings) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
};

const setFormValues = (settings) => {
  elements.hourlyWage.value = settings.hourlyWage;
  elements.currency.value = settings.currency;
  elements.hoursPerWeek.value = settings.hoursPerWeek;
  elements.workdaysPerWeek.value = settings.workdaysPerWeek;
  elements.startTime.value = settings.startTime;
  elements.endTime.value = settings.endTime;
};

const parseTimeToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
};

const getMinutesIntoDay = (date) =>
  date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60;

const getWeekStart = (date) => {
  const base = new Date(date);
  const dayIndex = (base.getDay() + 6) % 7;
  base.setDate(base.getDate() - dayIndex);
  base.setHours(0, 0, 0, 0);
  return base;
};

const getDayIndex = (date) => (date.getDay() + 6) % 7;

const formatCurrency = (value, currency) => {
  const locale = currencyLocales[currency] || "en-US";
  const fractionDigits = currency === "KRW" || currency === "JPY" ? 0 : 2;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: fractionDigits,
  }).format(value);
};

const calculate = (settings, now) => {
  const hourlyWage = Math.max(settings.hourlyWage, 0);
  const workdaysPerWeek = clamp(settings.workdaysPerWeek, 1, 7);
  const startMinutes = parseTimeToMinutes(settings.startTime);
  const endMinutes = parseTimeToMinutes(settings.endTime);
  const minutesPerDay = Math.max(endMinutes - startMinutes, 0);
  const hoursPerDay = minutesPerDay / 60;
  const hoursPerWeek = Math.max(settings.hoursPerWeek, hoursPerDay * workdaysPerWeek, 1);
  const minutesIntoDay = getMinutesIntoDay(now);
  const isWorkday = getDayIndex(now) < workdaysPerWeek;
  const minutesWorkedToday = isWorkday
    ? clamp(minutesIntoDay - startMinutes, 0, minutesPerDay)
    : 0;

  const earnedToday = (minutesWorkedToday / 60) * hourlyWage;
  const todayTotal = hoursPerDay * hourlyWage;
  const todayProgress = minutesPerDay ? minutesWorkedToday / minutesPerDay : 0;

  const weekStart = getWeekStart(now);
  let earnedWeek = 0;
  for (let i = 0; i < 7; i += 1) {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    const isScheduled = i < workdaysPerWeek;
    if (!isScheduled) {
      continue;
    }
    if (day.toDateString() === now.toDateString()) {
      earnedWeek += earnedToday;
    } else if (day < now) {
      earnedWeek += todayTotal;
    }
  }

  const weekTotal = hoursPerWeek * hourlyWage;
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const weeksInMonth = daysInMonth / 7;
  const monthProjection = hoursPerWeek * weeksInMonth * hourlyWage;
  const yearProjection = hoursPerWeek * 52 * hourlyWage;
  const dayAverage = hoursPerDay * hourlyWage;

  return {
    hourlyWage,
    hoursPerWeek,
    workdaysPerWeek,
    hoursPerDay,
    earnedToday,
    todayTotal,
    todayProgress,
    earnedWeek,
    weekTotal,
    monthProjection,
    yearProjection,
    dayAverage,
  };
};

const updateWeekGrid = (settings, stats, now) => {
  const cards = Array.from(elements.weekGrid.querySelectorAll(".day-card"));
  const weekStart = getWeekStart(now);
  cards.forEach((card, index) => {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + index);
    const isScheduled = index < stats.workdaysPerWeek;
    let earned = 0;
    let progress = 0;
    if (!isScheduled) {
      earned = 0;
    } else if (day.toDateString() === now.toDateString()) {
      earned = stats.earnedToday;
      progress = stats.todayProgress;
    } else if (day < now) {
      earned = stats.todayTotal;
      progress = 1;
    }

    card.querySelector("strong").textContent = formatCurrency(
      earned,
      settings.currency,
    );
    const bar = card.querySelector(".day-bar");
    bar.style.setProperty("--fill", `${progress * 100}%`);
  });
};

const render = (settings) => {
  const now = new Date();
  const stats = calculate(settings, now);
  const formatted = (value) => formatCurrency(value, settings.currency);

  elements.liveAmount.textContent = formatted(stats.earnedToday);
  elements.rateHour.textContent = formatted(stats.hourlyWage);
  elements.rateMinute.textContent = formatted(stats.hourlyWage / 60);
  elements.rateSecond.textContent = formatted(stats.hourlyWage / 3600);
  elements.todayTotal.textContent = formatted(stats.todayTotal);
  elements.todayEarned.textContent = formatted(stats.earnedToday);
  elements.todayPercent.textContent = `${Math.round(stats.todayProgress * 100)}%`;
  elements.todayRing.style.setProperty("--progress", `${stats.todayProgress * 100}%`);
  elements.todayBar.style.width = `${stats.todayProgress * 100}%`;
  elements.weekTotal.textContent = formatted(stats.weekTotal);
  elements.weekEarned.textContent = formatted(stats.earnedWeek);
  elements.monthProjection.textContent = formatted(stats.monthProjection);
  elements.yearProjection.textContent = formatted(stats.yearProjection);
  elements.dayAverage.textContent = formatted(stats.dayAverage);

  updateWeekGrid(settings, stats, now);
};

const settings = loadSettings();
setFormValues(settings);
render(settings);

const handleInput = () => {
  const updated = {
    hourlyWage: Number(elements.hourlyWage.value) || 0,
    currency: elements.currency.value,
    hoursPerWeek: Number(elements.hoursPerWeek.value) || 1,
    workdaysPerWeek: Number(elements.workdaysPerWeek.value) || 1,
    startTime: elements.startTime.value || "09:00",
    endTime: elements.endTime.value || "18:00",
  };
  saveSettings(updated);
  render(updated);
};

elements.form.addEventListener("input", handleInput);

setInterval(() => {
  render(loadSettings());
}, 1000);
