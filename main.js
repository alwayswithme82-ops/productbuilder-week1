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
    page_title: "내 월급의 실질 가치 | 인플레이션 계산기",
    brand: "실질 월급 팩트 체크",
    skip_to_main: "본문 바로가기",
    nav_about: "소개",
    nav_method: "계산 방법",
    nav_calculator: "계산기",
    nav_faq: "FAQ",
    nav_contact: "문의",
    nav_policies: "정책",
    label_language: "언어",
    label_country: "국가",
    hero_badge: "인플레이션 팩트 체크",
    hero_title: "내 월급의 실질 가치 - 인플레이션 계산기",
    hero_desc:
      "열심히 일해도 왜 가난해지는지 숫자로 증명합니다.\n연봉은 올랐는데 물가가 더 빨리 뛰었다면,\n실질 구매력은 줄어든 겁니다.",
    cta_calculate: "바로 계산하기",
    cta_report: "리포트 만들기",
    geo_updated: "최신 업데이트: 2026.01.21",
    geo_title: "AI 검색 대응 요약",
    geo_hint: "생성형 AI 검색 환경에서도 유용한 정보를 제공하도록 구성했습니다.",
    geo_desc:
      "생성형 AI는 질문 의도와 맥락을 이해해 답변을 구성합니다.\n그래서 이 계산기는 질문형 콘텐츠, 구조화된 요약, 최신성 표시, 신뢰 가능한 출처 링크를 함께 제공합니다.",
    geo_item1_title: "질문 중심 콘텐츠",
    geo_item1_desc: "실제 사용자가 던지는 질문으로 정보를 정리했습니다.",
    geo_item2_title: "사용자 맥락 강조",
    geo_item2_desc: "누가, 언제, 왜 연봉 체감이 줄어드는지 설명합니다.",
    geo_item3_title: "구조화된 요약",
    geo_item3_desc: "핵심 지표를 단계별로 제시해 재사용하기 쉽게 구성했습니다.",
    geo_item4_title: "외부 신뢰 근거",
    geo_item4_desc: "World Bank CPI 등 공신력 있는 지표를 명시합니다.",
    geo_item5_title: "최신성 표시",
    geo_item5_desc: "업데이트 날짜를 공개해 최신 정보를 강조합니다.",
    geo_q1: "내 연봉이 물가보다 얼마나 뒤처졌나요?",
    geo_a1: "입사 연도와 현재 연봉을 입력하면 실질 구매력 감소폭을 계산합니다.",
    geo_q2: "실질 연봉은 어떻게 계산되나요?",
    geo_a2: "공식 CPI 지수로 물가 상승률을 산출한 뒤 현재 연봉을 환산합니다.",
    geo_q3: "체감 물가를 반영할 수 있나요?",
    geo_a3: "공식 지수 외에 생활물가 보정이나 직접 입력 옵션을 제공합니다.",
    value_title: "핵심 인사이트",
    value_hint: "실질 연봉 변화의 의미를 바로 이해할 수 있게 정리했습니다.",
    value_desc:
      "이 계산기는 연봉 인상률과 물가 상승률의 격차를 수치로 보여줍니다.\n실질 구매력 변화, 손실액, 명목/실질 차이를 한 번에 확인하세요.",
    value_item1_title: "실질 연봉",
    value_item1_desc: "현재 연봉을 입사 시점의 물가로 환산해 비교합니다.",
    value_item2_title: "구매력 변화",
    value_item2_desc: "연봉 인상과 물가 상승의 차이를 %로 보여줍니다.",
    value_item3_title: "손실액",
    value_item3_desc: "실질 기준에서 줄어든 금액을 계산합니다.",
    value_caption: "계산 결과를 공유용 이미지로 저장할 수 있습니다.",
    source_title: "데이터 출처",
    source_desc: "공식 CPI 데이터를 기준으로 계산하며, 체감 물가나 직접 입력도 지원합니다.",
    about_title: "서비스 소개",
    about_hint: "실질 구매력을 숫자로 보여주는 인플레이션 계산기입니다.",
    about_desc:
      "입사 연도 연봉과 현재 연봉을 입력하면, 물가 상승률을 반영한 실질 연봉을 계산해줍니다.\n데이터 출처와 계산식, 업데이트 방식을 명확히 공개해 투명성을 높였습니다.",
    about_card1_title: "명확한 목적",
    about_card1_desc: "연봉 인상률과 물가 상승률의 격차를 이해하도록 돕습니다.",
    about_card2_title: "신뢰할 수 있는 지표",
    about_card2_desc: "세계은행 CPI(2010=100)를 기준으로 데이터를 구성했습니다.",
    about_card3_title: "개인정보 최소화",
    about_card3_desc: "입력값은 브라우저에만 저장되며 서버로 전송되지 않습니다.",
    method_title: "계산 방법",
    method_hint: "누구나 이해할 수 있도록 계산 흐름을 공개합니다.",
    method_step1: "입사 연도와 현재 연도, 연봉을 입력합니다.",
    method_step2: "선택한 CPI 지수로 누적 물가 상승률을 계산합니다.",
    method_step3: "현재 연봉을 물가로 환산해 실질 구매력 변화를 보여줍니다.",
    method_note: "본 계산은 평균 물가 기준이며 개인별 체감과 차이가 있을 수 있습니다.",
    step1_title: "연봉 입력",
    step1_hint: "입사 시점과 현재를 비교합니다.",
    label_start_year: "입사 연도",
    label_current_year: "현재 연도",
    label_start_salary: "입사 연봉",
    label_current_salary: "현재 연봉",
    salary_unit_krw: "만원 입력",
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
    result_detail_open: "상세 보기",
    result_detail_close: "상세 접기",
    result_details_open: "상세 결과 보기",
    result_details_close: "상세 결과 접기",
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
    share_title: "SNS 공유",
    share_twitter: "트위터",
    share_threads: "Threads",
    share_facebook: "페이스북",
    share_link: "링크 복사",
    share_link_done: "링크 복사됨",
    share_reddit: "레딧",
    share_hint: "각 채널 전용 썸네일이 적용된 공유 링크를 사용합니다.",
    label_mask_visible: "연봉 공개 표시",
    mask_yes: "예",
    mask_no: "아니오",
    hint_mask: "공유 이미지에 연봉 손해액을 공개할지 선택하세요.",
    ad_title: "스폰서",
    faq_title: "자주 묻는 질문",
    faq_hint: "정책, 데이터, 개인정보 관련 안내입니다.",
    faq_q1: "공식 데이터는 어디서 가져오나요?",
    faq_a1: "세계은행 CPI(2010=100)를 기반으로 연도별 지수를 구성했습니다.",
    faq_q2: "왜 생활물가 옵션이 있나요?",
    faq_a2: "체감 물가가 공식 지수보다 높게 느껴지는 경우를 고려한 보정 옵션입니다.",
    faq_q3: "입력한 연봉이 저장되나요?",
    faq_a3: "설정값은 브라우저 로컬 저장소에만 저장되며 외부로 전송되지 않습니다.",
    faq_q4: "데이터는 얼마나 자주 업데이트되나요?",
    faq_a4: "공식 CPI 발표 주기에 맞춰 연 1회 이상 갱신하는 것을 원칙으로 합니다.",
    contact_title: "문의",
    contact_hint: "피드백과 데이터 제보를 기다립니다.",
    contact_desc: "제휴, 오류 제보, 데이터 문의는 아래 이메일로 보내주세요. 48시간 내 회신을 목표로 합니다.",
    policies_title: "정책 및 운영 정보",
    policies_hint: "투명한 운영을 위해 주요 문서를 공개합니다.",
    policy_about: "서비스 소개",
    policy_privacy: "개인정보 처리방침",
    policy_terms: "이용약관",
    policy_contact: "문의하기",
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
    page_title: "Real Salary Value | Inflation Calculator",
    brand: "Real Paycheck Reality",
    skip_to_main: "Skip to main content",
    nav_about: "About",
    nav_method: "Method",
    nav_calculator: "Calculator",
    nav_faq: "FAQ",
    nav_contact: "Contact",
    nav_policies: "Policies",
    label_language: "Language",
    label_country: "Country",
    hero_badge: "Inflation Fact Check",
    hero_title: "My Real Salary Value - Inflation Calculator",
    hero_desc:
      "Your salary may go up, but prices can rise faster.\nThis shows how much buying power you actually lost.",
    cta_calculate: "Calculate",
    cta_report: "Create Report",
    geo_updated: "Last updated: 2026.01.21",
    geo_title: "AI search readiness",
    geo_hint: "Structured to answer generative AI queries with clarity.",
    geo_desc:
      "Generative AI uses intent and context to form answers.\nThis calculator provides question-led content, structured summaries, freshness signals, and trusted sources.",
    geo_item1_title: "Question-led content",
    geo_item1_desc: "Organized around the questions people actually ask.",
    geo_item2_title: "User context",
    geo_item2_desc: "Explains who, when, and why purchasing power shifts.",
    geo_item3_title: "Structured summaries",
    geo_item3_desc: "Key indicators are grouped for easy reuse.",
    geo_item4_title: "Trusted sources",
    geo_item4_desc: "Cites credible CPI sources such as World Bank data.",
    geo_item5_title: "Freshness signal",
    geo_item5_desc: "Shows update dates to emphasize recency.",
    geo_q1: "How far behind is my salary vs inflation?",
    geo_a1: "Enter your start year and current salary to compute real purchasing power loss.",
    geo_q2: "How is real salary calculated?",
    geo_a2: "We derive inflation from official CPI and adjust your current salary.",
    geo_q3: "Can I reflect felt inflation?",
    geo_a3: "Yes. Use the felt-inflation option or enter a custom rate.",
    value_title: "Key insights",
    value_hint: "Summarized so you can grasp the real wage shift quickly.",
    value_desc:
      "This calculator shows the gap between salary growth and inflation.\nSee real purchasing power, loss amount, and nominal vs real change at a glance.",
    value_item1_title: "Real salary",
    value_item1_desc: "Convert today's salary to start-year prices for comparison.",
    value_item2_title: "Power change",
    value_item2_desc: "Shows the gap between raises and inflation as a percent.",
    value_item3_title: "Loss amount",
    value_item3_desc: "Calculates the purchasing power loss in currency.",
    value_caption: "Save the result as a shareable image.",
    source_title: "Data sources",
    source_desc: "Based on official CPI data, with felt inflation or custom input options.",
    about_title: "About the tool",
    about_hint: "A transparent inflation calculator for real purchasing power.",
    about_desc:
      "Enter your starting salary and today’s salary to see the inflation-adjusted value.\nWe disclose data sources, formulas, and update cadence for clarity.",
    about_card1_title: "Clear purpose",
    about_card1_desc: "Understand the gap between raises and inflation.",
    about_card2_title: "Trusted index",
    about_card2_desc: "Built on World Bank CPI (2010=100) data.",
    about_card3_title: "Minimal data",
    about_card3_desc: "Inputs stay in your browser and are not sent to a server.",
    method_title: "Method",
    method_hint: "Step-by-step calculation flow.",
    method_step1: "Enter your start year, current year, and salaries.",
    method_step2: "Calculate total inflation based on the selected CPI index.",
    method_step3: "Convert today’s salary to real purchasing power.",
    method_note: "This uses average CPI and may differ from personal experience.",
    step1_title: "Salary Inputs",
    step1_hint: "Compare your starting year vs today.",
    label_start_year: "Start year",
    label_current_year: "Current year",
    label_start_salary: "Starting salary",
    label_current_salary: "Current salary",
    salary_unit_krw: "10k KRW input",
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
    result_detail_open: "View details",
    result_detail_close: "Hide details",
    result_details_open: "Show detailed results",
    result_details_close: "Hide detailed results",
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
    share_title: "Share",
    share_twitter: "Twitter",
    share_threads: "Threads",
    share_facebook: "Facebook",
    share_link: "Copy link",
    share_link_done: "Link copied",
    share_reddit: "Reddit",
    share_hint: "Each channel uses its own thumbnail preview.",
    label_mask_visible: "Salary reveal",
    mask_yes: "Yes",
    mask_no: "No",
    hint_mask: "Choose whether to reveal the loss amount in the share image.",
    faq_title: "Frequently Asked Questions",
    faq_hint: "Policy, data, and privacy guidance.",
    faq_q1: "Where does the data come from?",
    faq_a1: "We use World Bank CPI (2010=100) to build yearly indices.",
    faq_q2: "Why include a felt-inflation option?",
    faq_a2: "It accounts for cases where perceived inflation is higher than CPI.",
    faq_q3: "Are my salary inputs stored?",
    faq_a3: "Settings stay in local browser storage only.",
    faq_q4: "How often is data updated?",
    faq_a4: "We update at least annually following CPI releases.",
    contact_title: "Contact",
    contact_hint: "We welcome feedback and data tips.",
    contact_desc: "For partnerships, corrections, or data questions, email us. We aim to reply within 48 hours.",
    policies_title: "Policies & Operations",
    policies_hint: "Key documents for transparent operations.",
    policy_about: "About",
    policy_privacy: "Privacy Policy",
    policy_terms: "Terms of Use",
    policy_contact: "Contact",
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
  shareButtons: document.querySelectorAll("[data-share-channel]"),
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
  resultDetailsSummary: document.querySelector("#result-details summary"),
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
  const manValue = divisor ? Math.round(value / divisor) : Math.round(value);
  return formatKrwShort(manValue * 10000, "ko-KR");
};

const parseSalaryInputValue = (value) => {
  if (!value) {
    return 0;
  }
  const cleaned = String(value).replace(/[^\d]/g, "");
  return Number(cleaned) || 0;
};

const parseKrwManFromFormatted = (value) => {
  if (!value) {
    return 0;
  }
  const text = String(value).replace(/,/g, "").trim();
  if (!text) {
    return 0;
  }
  let man = 0;
  const eokMatch = text.match(/(\d+)\s*억/);
  if (eokMatch) {
    man += Number(eokMatch[1]) * 10000;
  }
  const manMatch = text.match(/(\d+)\s*만원/);
  if (manMatch) {
    man += Number(manMatch[1]);
  }
  if (eokMatch || manMatch) {
    return man;
  }
  const wonMatch = text.match(/(\d+)\s*원/);
  if (wonMatch) {
    return Math.round(Number(wonMatch[1]) / 10000);
  }
  const fallback = parseSalaryInputValue(text);
  return fallback;
};

const parseSalaryForCountry = (value, country) => {
  if (country === "KR") {
    return parseKrwManFromFormatted(value);
  }
  return parseSalaryInputValue(value);
};

const formatSalaryInputWithCaret = (input) => {
  if (!input || elements.country.value !== "KR") {
    return;
  }
  const caret = input.selectionStart || 0;
  const digitCount = input.value.slice(0, caret).replace(/[^\d]/g, "").length;
  const manValue = parseSalaryForCountry(input.value, "KR");
  const formatted = formatSalaryInputValue(manValue * 10000, "man", "KR");
  input.value = formatted;
  if (!digitCount) {
    input.setSelectionRange(0, 0);
    return;
  }
  let seen = 0;
  let newPos = formatted.length;
  for (let i = 0; i < formatted.length; i += 1) {
    if (/\d/.test(formatted[i])) {
      seen += 1;
      if (seen >= digitCount) {
        newPos = i + 1;
        break;
      }
    }
  }
  input.setSelectionRange(newPos, newPos);
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
  if (elements.startSalaryUnit) {
    elements.startSalaryUnit.value = settings.startSalaryUnit || "man";
  }
  if (elements.currentSalaryUnit) {
    elements.currentSalaryUnit.value = settings.currentSalaryUnit || "man";
  }
  elements.startSalary.value = formatSalaryInputValue(
    settings.startSalary,
    elements.startSalaryUnit?.value || "man",
    settings.country,
  );
  elements.currentYear.value = settings.currentYear;
  elements.currentSalary.value = formatSalaryInputValue(
    settings.currentSalary,
    elements.currentSalaryUnit?.value || "man",
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
  const topShift = 120;

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#111111");
  gradient.addColorStop(0.5, "#182240");
  gradient.addColorStop(1, "#111111");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  ctx.fillRect(80, 180, width - 160, height - 360);

  const drawSticker = (x, y, r, text, fill, stroke) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.lineWidth = 8;
    ctx.strokeStyle = stroke;
    ctx.stroke();
    ctx.fillStyle = "#111111";
    ctx.font = "32px 'GmarketSansBold', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y + 2);
    ctx.restore();
  };

  const drawConfetti = () => {
    ctx.save();
    const colors = ["#ffd166", "#4aa3ff", "#ff7a7a", "#52c2a6", "#f4b07a"];
    for (let i = 0; i < 24; i += 1) {
      const cx = 120 + Math.random() * (width - 240);
      const cy = 220 + Math.random() * 160;
      const w = 10 + Math.random() * 12;
      const h = 6 + Math.random() * 10;
      ctx.fillStyle = colors[i % colors.length];
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((Math.PI / 180) * (Math.random() * 40 - 20));
      ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.restore();
    }
    ctx.restore();
  };

  drawConfetti();
  drawSticker(width - 190, 270, 70, "찐", "#ffd166", "#111111");
  drawSticker(200, 280, 56, "헉", "#4aa3ff", "#111111");

  ctx.fillStyle = "#ffffff";
  ctx.font = "92px 'GmarketSansBold', sans-serif";
  ctx.fillText(dict.report_title_line, 120, 260 + topShift);

  ctx.font = "40px 'Pretendard', sans-serif";
  ctx.fillStyle = "#ffd93d";
  ctx.fillText(dict.report_subtitle, 120, 320 + topShift);

  ctx.fillStyle = "#ffffff";
  ctx.font = "34px 'Pretendard', sans-serif";
  ctx.fillText(headline, 120, 400 + topShift);

  ctx.fillStyle = "#4d96ff";
  ctx.font = "54px 'GmarketSansBold', sans-serif";
  ctx.fillText(
    `${dict.result_power_change} ${formatPercent(stats.realDelta, settings.language)}`,
    120,
    480 + topShift,
  );

  ctx.fillStyle = "#ffffff";
  ctx.font = "32px 'Pretendard', sans-serif";
  ctx.fillText(
    `${dict.result_nominal_change}: +${formatPercent(stats.nominalDelta, settings.language)}`,
    120,
    560 + topShift,
  );
  ctx.fillText(
    `${dict.result_inflation_change}: +${formatPercent(stats.inflationRate, settings.language)}`,
    120,
    610 + topShift,
  );

  ctx.fillStyle = "#ff4d4d";
  ctx.font = "48px 'GmarketSansBold', sans-serif";
  ctx.fillText(lossText, 120, 700 + topShift);

  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.fillRect(120, 760 + topShift, width - 240, 320);

  ctx.fillStyle = "#111111";
  ctx.font = "30px 'Pretendard', sans-serif";
  ctx.fillText(dict.report_caption, 150, 830 + topShift);
  ctx.fillText(dict.report_caption2, 150, 875 + topShift);
  ctx.font = "34px 'GmarketSansBold', sans-serif";
  drawWrappedText(
    ctx,
    getVerdictText(stats, settings.language),
    150,
    940 + topShift,
    width - 300,
    44,
  );

  const footerY = height - 200;
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(120, footerY, width - 240, 120);
  ctx.fillStyle = "#e2e8f0";
  ctx.font = "34px 'GmarketSansBold', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("실질 월급 팩트 체크", width / 2, footerY + 48);
  ctx.fillStyle = "#94a3b8";
  ctx.font = "28px 'Pretendard', sans-serif";
  ctx.fillText(window.location.origin, width / 2, footerY + 88);
  ctx.textAlign = "left";

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
  const unitLabel = isKrw ? dict.salary_unit_krw : currency;
  elements.labelStartSalary.textContent = `${dict.label_start_salary} (${unitLabel})`;
  elements.labelCurrentSalary.textContent = `${dict.label_current_salary} (${unitLabel})`;
  if (elements.startSalaryUnit) {
    elements.startSalaryUnit.classList.toggle("is-hidden", !isKrw);
  }
  if (elements.currentSalaryUnit) {
    elements.currentSalaryUnit.classList.toggle("is-hidden", !isKrw);
  }
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
  const startFormatted = formatSalaryInputValue(settings.startSalary, "man", settings.country);
  const currentFormatted = formatSalaryInputValue(settings.currentSalary, "man", settings.country);
  if (document.activeElement !== elements.startSalary) {
    elements.startSalary.value = startFormatted;
  }
  if (document.activeElement !== elements.currentSalary) {
    elements.currentSalary.value = currentFormatted;
  }
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
  updateDetailToggleText(settings.language, elements.resultDetails?.open);

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

const updateDetailToggleText = (language, isOpen) => {
  if (!elements.scrollDetails) {
    return;
  }
  const dict = translations[language] || translations.ko;
  elements.scrollDetails.textContent = isOpen ? dict.result_detail_close : dict.result_detail_open;
  if (elements.resultDetailsSummary) {
    elements.resultDetailsSummary.textContent = isOpen
      ? dict.result_details_close
      : dict.result_details_open;
  }
};

const syncSalaryRanges = (settings) => {
  elements.startSalaryRange.value = settings.startSalary;
  elements.currentSalaryRange.value = settings.currentSalary;
};

const syncSalaryInputs = (settings) => {
  elements.startSalary.value = formatSalaryInputValue(
    settings.startSalary,
    "man",
    settings.country,
  );
  elements.currentSalary.value = formatSalaryInputValue(
    settings.currentSalary,
    "man",
    settings.country,
  );
};

const handleInput = () => {
  const country = elements.country.value;
  const updated = {
    startYear: Number(elements.startYear.value) || DEFAULT_SETTINGS.startYear,
    startSalary:
      parseSalaryForCountry(elements.startSalary.value, country) * getUnitMultiplier("man", country),
    currentYear: Number(elements.currentYear.value) || DEFAULT_SETTINGS.currentYear,
    currentSalary:
      parseSalaryForCountry(elements.currentSalary.value, country) * getUnitMultiplier("man", country),
    inflationSource: elements.inflationSource.value,
    customInflation: Number(elements.customInflation.value) || 0,
    language: elements.language.value,
    country,
    maskVisible: elements.maskVisible.value === "yes",
    startSalaryUnit: "man",
    currentSalaryUnit: "man",
  };
  saveSettings(updated);
  applyTranslations(updated.language);
  render(updated);
  syncSalaryRanges(updated);
};

const handleRangeInput = () => {
  elements.startSalary.value = formatSalaryInputValue(
    Number(elements.startSalaryRange.value) || 0,
    "man",
    elements.country.value,
  );
  elements.currentSalary.value = formatSalaryInputValue(
    Number(elements.currentSalaryRange.value) || 0,
    "man",
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
    "man",
    elements.country.value,
  );
  elements.currentSalary.value = formatSalaryInputValue(
    salaryDefault.current,
    "man",
    elements.country.value,
  );
  handleInput();
};

const handleUnitChange = () => {
  return;
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

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.warn("Clipboard copy failed", error);
    return false;
  }
};

const handleCopy = async () => {
  const dict = translations[elements.language.value] || translations.ko;
  const success = await copyToClipboard(elements.shareText.textContent);
  if (!success) {
    return;
  }
  elements.copyText.textContent = dict.copy_done;
  setTimeout(() => {
    elements.copyText.textContent = dict.copy_default;
  }, 1600);
};

const buildSharePayload = (urlOverride) => {
  const url = urlOverride || `${window.location.origin}${window.location.pathname}`;
  const title = document.title || "실질 월급 팩트 체크";
  const rawText = elements.shareText ? elements.shareText.textContent : title;
  const text = rawText.replace(/\s+/g, " ").trim();
  return { title, text, url };
};

const openSharePopup = (url) => {
  window.open(url, "_blank", "noopener,noreferrer,width=600,height=600");
};

const isLikelyMobile = () => {
  if (window.matchMedia) {
    return window.matchMedia("(max-width: 720px)").matches;
  }
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};

const openShareTarget = (url) => {
  if (isLikelyMobile()) {
    window.location.href = url;
    return;
  }
  openSharePopup(url);
};

const flashButtonText = (button, text) => {
  const original = button.textContent;
  button.textContent = text;
  setTimeout(() => {
    button.textContent = original;
  }, 1600);
};

const getShareUrl = (channel) => {
  const base = window.location.origin;
  if (channel === "twitter") {
    return `${base}/share-twitter.html`;
  }
  if (channel === "facebook") {
    return `${base}/share-facebook.html`;
  }
  if (channel === "threads") {
    return `${base}/share-threads.html`;
  }
  if (channel === "reddit") {
    return `${base}/share-reddit.html`;
  }
  return `${base}${window.location.pathname}`;
};

const handleShare = async (event) => {
  const button = event.currentTarget;
  const channel = button.dataset.shareChannel;
  const dict = translations[elements.language.value] || translations.ko;
  const shareUrl = getShareUrl(channel);
  const payload = buildSharePayload(shareUrl);
  if (channel === "twitter") {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(payload.text)}&url=${encodeURIComponent(payload.url)}`;
    openShareTarget(url);
    return;
  }
  if (channel === "threads") {
    const url = `https://www.threads.net/intent/post?text=${encodeURIComponent(`${payload.text} ${payload.url}`)}`;
    openShareTarget(url);
    return;
  }
  if (channel === "facebook") {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(payload.url)}`;
    openShareTarget(url);
    return;
  }
  if (channel === "reddit") {
    const url = `https://www.reddit.com/submit?url=${encodeURIComponent(payload.url)}&title=${encodeURIComponent(payload.title)}`;
    openShareTarget(url);
    return;
  }
  if (channel === "link") {
    const success = await copyToClipboard(`${window.location.origin}${window.location.pathname}`);
    if (success) {
      flashButtonText(button, dict.share_link_done);
    }
    return;
  }
  const copied = await copyToClipboard(payload.url);
  if (copied) {
    flashButtonText(button, dict.share_link_done);
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
if (elements.startSalaryUnit) {
  elements.startSalaryUnit.addEventListener("change", handleUnitChange);
}
if (elements.currentSalaryUnit) {
  elements.currentSalaryUnit.addEventListener("change", handleUnitChange);
}

elements.generateReport.addEventListener("click", handleGenerate);

elements.copyText.addEventListener("click", handleCopy);
elements.shareButtons.forEach((button) => {
  button.addEventListener("click", handleShare);
});

elements.jumpToInputs.addEventListener("click", () => {
  scrollToSection("inputs");
});

elements.jumpToReport.addEventListener("click", () => {
  scrollToSection("report");
});

if (elements.scrollDetails) {
  elements.scrollDetails.addEventListener("click", () => {
    if (elements.resultDetails) {
      const willOpen = !elements.resultDetails.open;
      elements.resultDetails.open = willOpen;
      updateDetailToggleText(elements.language.value, willOpen);
      if (willOpen) {
        elements.resultDetails.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  });
}

if (elements.resultDetails) {
  elements.resultDetails.addEventListener("toggle", () => {
    updateDetailToggleText(elements.language.value, elements.resultDetails.open);
  });
}

const openAccordionFromHash = () => {
  const targetId = window.location.hash.replace("#", "");
  if (!targetId) {
    return;
  }
  const section = document.getElementById(targetId);
  if (!section) {
    return;
  }
  const accordion = section.querySelector("details.accordion");
  if (accordion && !accordion.open) {
    accordion.open = true;
  }
};

window.addEventListener("hashchange", openAccordionFromHash);
openAccordionFromHash();

const bindSalaryFormatting = (input) => {
  if (!input) {
    return;
  }
  input.addEventListener("input", () => {
    formatSalaryInputWithCaret(input);
  });
  input.addEventListener("blur", () => {
    const country = elements.country.value;
    const rawValue = parseSalaryForCountry(input.value, country);
    const baseValue = country === "KR" ? rawValue * 10000 : rawValue;
    input.value = formatSalaryInputValue(baseValue, "man", country);
  });
};

bindSalaryFormatting(elements.startSalary);
bindSalaryFormatting(elements.currentSalary);
