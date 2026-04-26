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
    nav_ad_policy: "광고 원칙",
    nav_policies: "정책",
    label_language: "언어",
    label_country: "국가",
    hero_badge: "인플레이션 팩트 체크",
    hero_title: "내 월급의 실질 가치 - 인플레이션 계산기",
    hero_desc:
      "열심히 일해도 왜 가난해지는지 숫자로 증명합니다.\n연봉은 올랐는데 물가가 더 빨리 뛰었다면,\n실질 구매력은 줄어든 겁니다.",
    cta_calculate: "바로 계산하기",
    cta_report: "리포트 만들기",
    cta_results: "결과 확인",
    overview_title: "이 사이트가 하는 일",
    overview_hint: "계산 결과만 보여주는 것이 아니라 해석까지 돕습니다.",
    overview_desc1:
      "이 계산기는 입사 연도와 현재 연봉을 비교해, 물가 상승 이후에도 실제로 더 나아졌는지 확인하도록 돕습니다.\n단순히 연봉 숫자가 올랐는지만 보지 않고, 같은 돈으로 무엇을 살 수 있는지라는 구매력 관점에서 해석합니다.",
    overview_desc2:
      "결과 화면에는 실질 연봉, 구매력 변화율, 명목 인상률, 누적 물가 상승률을 함께 보여줍니다.\n그래서 사용자는 '연봉은 올랐는데 왜 생활이 더 빠듯한가' 같은 질문에 스스로 답할 수 있습니다.",
    overview_card1_title: "누가 쓰면 좋은가",
    overview_card1_desc:
      "이직을 고민하는 직장인, 연봉 협상 전후를 비교하려는 사용자, 최근 몇 년간 체감 물가가 높다고 느낀 사람에게 적합합니다.",
    overview_card2_title: "무엇을 확인하나",
    overview_card2_desc:
      "현재 연봉이 입사 시점 대비 실질적으로 늘었는지, 혹은 물가 상승을 따라가지 못했는지 바로 확인할 수 있습니다.",
    overview_card3_title: "어떻게 읽어야 하나",
    overview_card3_desc:
      "명목 인상률과 물가 상승률을 먼저 보고, 그 다음 실질 연봉과 손실액을 보면 결과를 더 정확하게 해석할 수 있습니다.",
    geo_updated: "최신 업데이트: 2026.04.26",
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
    report_title: "실질 연봉 리포트",
    report_generate: "이미지 생성",
    report_desc: "계산 결과를 이미지와 텍스트로 저장해 개인 기록이나 공유용으로 활용할 수 있습니다.",
    report_copy: "텍스트 복사",
    report_download: "이미지 다운로드",
    use_cases_title: "이렇게 해석해 보세요",
    use_cases_hint: "숫자가 어떤 의미인지 바로 이해할 수 있는 대표 상황입니다.",
    use_case1_title: "연봉은 올랐는데 체감은 제자리",
    use_case1_desc:
      "명목 인상률보다 누적 물가 상승률이 크면 실질 구매력은 줄어듭니다. 숫자로는 상승이지만 생활 수준은 후퇴할 수 있습니다.",
    use_case2_title: "이직 제안 비교",
    use_case2_desc:
      "몇 년 전 연봉과 지금 제안을 같은 물가 기준으로 맞춰 보면, 제시 연봉이 체감상 유리한지 불리한지 더 선명하게 보입니다.",
    use_case3_title: "생활비 압박 점검",
    use_case3_desc:
      "공식 CPI와 생활물가 보정 값을 함께 비교하면, 공적 지표와 개인 체감 사이 차이를 더 현실적으로 볼 수 있습니다.",
    use_cases_note:
      "이 계산기는 투자 조언이 아니라 생활비와 구매력 변화를 이해하기 위한 정보 도구입니다.",
    guide_title: "결과를 해석하는 기준",
    guide_hint: "단순한 계산값보다 판단 기준을 함께 확인하세요.",
    guide_desc:
      "실질 연봉은 현재 연봉을 과거 물가 수준으로 되돌려 본 값입니다. 예를 들어 입사 당시 5,000만원을 받았고 현재 5,500만원을 받더라도, 같은 기간 물가가 더 많이 올랐다면 실제 구매력은 줄어들 수 있습니다.",
    guide_item1_title: "1. 명목 인상률부터 확인",
    guide_item1_desc:
      "연봉 숫자가 몇 퍼센트 올랐는지 확인합니다. 이 값은 계약서에 보이는 표면적인 변화입니다.",
    guide_item2_title: "2. 물가 상승률과 비교",
    guide_item2_desc:
      "같은 기간 CPI가 더 빠르게 올랐다면 월급이 올라도 생활비 부담은 커질 수 있습니다.",
    guide_item3_title: "3. 실질 구매력으로 판단",
    guide_item3_desc:
      "실질 연봉이 입사 연봉보다 낮으면, 숫자상 연봉 인상에도 불구하고 구매력은 감소한 것입니다.",
    checklist_title: "계산 전 확인할 점",
    checklist_hint: "더 정확한 판단을 위한 입력 체크리스트입니다.",
    check_item1_title: "세전·세후 기준 통일",
    check_item1_desc:
      "입사 연봉과 현재 연봉은 세전 또는 세후 중 하나로 맞춰 입력해야 결과가 왜곡되지 않습니다.",
    check_item2_title: "상여금 포함 여부",
    check_item2_desc:
      "성과급, 고정 상여, 식대 등 반복 지급 항목을 같은 기준으로 포함하거나 제외하세요.",
    check_item3_title: "근무 형태 변화",
    check_item3_desc:
      "파트타임, 프리랜서, 근무시간 변경이 있었다면 시간당 보상도 별도로 비교하는 것이 좋습니다.",
    check_item4_title: "개인 물가 차이",
    check_item4_desc:
      "주거비, 교육비, 교통비 비중이 큰 사람은 공식 CPI와 체감 물가가 다를 수 있습니다.",
    limitations_title: "계산의 한계와 책임 있는 사용",
    limitations_hint: "결과를 과도하게 단정하지 않도록 공개합니다.",
    limitations_desc1:
      "이 도구는 평균 소비자물가지수를 사용하므로 개인의 소비 구조를 완벽하게 반영하지 않습니다. 전월세, 대출이자, 육아비, 의료비처럼 개인별 비중이 큰 항목은 별도로 검토해야 합니다.",
    limitations_desc2:
      "계산 결과는 연봉 협상, 이직 비교, 생활비 점검을 위한 참고 정보입니다. 투자, 세무, 법률 또는 고용 조건에 대한 전문 자문을 대체하지 않습니다.",
    ad_policy_title: "광고 및 콘텐츠 운영 원칙",
    ad_policy_hint: "사용자 콘텐츠를 우선하고 광고는 보조 요소로만 운영합니다.",
    ad_policy_desc1:
      "이 사이트는 계산기, 데이터 출처, 해석 가이드, FAQ처럼 사용자가 방문한 목적을 해결하는 게시자 콘텐츠를 먼저 제공합니다. 광고는 콘텐츠를 가리거나 버튼, 입력창, 공유 기능처럼 사용자가 조작하는 요소와 혼동되는 위치에 배치하지 않는 것을 원칙으로 합니다.",
    ad_policy_desc2:
      "공유 안내 페이지, 오류 페이지, 정책 문서처럼 콘텐츠 양이 적거나 이동 목적이 강한 화면에는 Google 게재 광고를 넣지 않습니다. 또한 제휴 링크, 자동 생성 글, 외부 콘텐츠 복제, 준비 중인 화면을 광고 수익 목적으로 만들지 않습니다.",
    ad_policy_item1_title: "콘텐츠 우선",
    ad_policy_item1_desc:
      "광고보다 계산기와 설명 콘텐츠가 화면의 중심이 되도록 구성합니다.",
    ad_policy_item2_title: "빈 화면 광고 금지",
    ad_policy_item2_desc:
      "오류, 이동, 공유 미리보기 전용 화면에는 광고 코드를 배치하지 않습니다.",
    ad_policy_item3_title: "오작동 유도 금지",
    ad_policy_item3_desc:
      "입력창, 버튼, 내비게이션 근처에 혼동을 일으키는 광고 배치를 피합니다.",
    ad_policy_item4_title: "복제 콘텐츠 금지",
    ad_policy_item4_desc:
      "외부 문서를 단순 복사하지 않고 직접 작성한 설명과 계산 기능을 제공합니다.",
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
    faq_q5: "왜 결과만 보고 판단하면 안 되나요?",
    faq_a5:
      "실질 연봉 계산은 평균 물가를 기준으로 하므로 주거비, 교육비, 식비처럼 개인별 비중이 큰 항목은 별도로 해석해야 합니다.",
    faq_q6: "어떤 데이터를 검토한 뒤 사용하는 것이 좋나요?",
    faq_a6:
      "현재 연봉, 입사 시점 연봉, 최근 연봉 변동 내역, 체감 물가를 크게 좌우하는 생활비 항목을 함께 확인하면 판단 정확도가 높아집니다.",
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
      "입사 당시 기준으로 보면 연봉은 {nominal}, 물가는 {inflation}. 실질 변화는 {real}입니다.",
    report_title_line: "실질 연봉 리포트",
    report_subtitle: "물가 반영 결과",
    report_headline: "실질 구매력 {real}",
    report_caption: "명목 인상과 물가를 함께 보면,",
    report_caption2: "체감 변화가 더 분명해집니다.",
    report_footer: "숫자로 보는 월급 체감",
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
    receipt_item_conscience: "협상 여지",
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
    nav_ad_policy: "Ad Principles",
    nav_policies: "Policies",
    label_language: "Language",
    label_country: "Country",
    hero_badge: "Inflation Fact Check",
    hero_title: "My Real Salary Value - Inflation Calculator",
    hero_desc:
      "Your salary may go up, but prices can rise faster.\nThis shows how much buying power you actually lost.",
    cta_calculate: "Calculate",
    cta_report: "Create Report",
    cta_results: "View results",
    overview_title: "What this site does",
    overview_hint: "It explains the result instead of only showing a number.",
    overview_desc1:
      "This calculator compares your starting salary with your current salary to show whether you are actually better off after inflation.\nIt focuses on buying power, not just whether the number on your payslip went up.",
    overview_desc2:
      "The result combines real salary, purchasing-power change, nominal growth, and cumulative inflation.\nThat helps answer practical questions such as why day-to-day life feels tighter even after a raise.",
    overview_card1_title: "Who it helps",
    overview_card1_desc:
      "It is useful for employees reviewing career moves, salary negotiations, or the real impact of several years of price increases.",
    overview_card2_title: "What it checks",
    overview_card2_desc:
      "You can quickly see whether your current salary truly improved in real terms or failed to keep up with inflation.",
    overview_card3_title: "How to read it",
    overview_card3_desc:
      "Read nominal salary growth beside inflation first, then interpret the real salary and estimated loss amount together.",
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
    report_title: "Real salary report",
    report_generate: "Generate image",
    report_desc: "Save the calculation as an image or text for your own record or sharing.",
    report_copy: "Copy text",
    report_download: "Download image",
    use_cases_title: "How to interpret the result",
    use_cases_hint: "These are common situations where the numbers become easier to read.",
    use_case1_title: "Salary up, but life feels flat",
    use_case1_desc:
      "If cumulative inflation is higher than your nominal raise, your real purchasing power still falls. The headline number can improve while daily life gets harder.",
    use_case2_title: "Comparing a job offer",
    use_case2_desc:
      "Putting an older salary and a new offer on the same price level makes it easier to judge whether the offer is truly better in practical terms.",
    use_case3_title: "Checking cost-of-living pressure",
    use_case3_desc:
      "Comparing the official CPI with the adjusted living-cost option helps frame the gap between public data and personal experience.",
    use_cases_note:
      "This tool is for understanding living-cost pressure and purchasing power, not for investment or financial advice.",
    guide_title: "How to Read the Result",
    guide_hint: "Use the interpretation standard, not only the final number.",
    guide_desc:
      "Real salary converts today's pay back to the price level of your starting year. For example, even if salary moved from 50 million KRW to 55 million KRW, purchasing power can still fall when prices rose faster over the same period.",
    guide_item1_title: "1. Start with the nominal raise",
    guide_item1_desc:
      "Check how much the salary number increased. This is the surface-level change shown in a contract.",
    guide_item2_title: "2. Compare it with inflation",
    guide_item2_desc:
      "If CPI rose faster over the same period, daily cost pressure can increase even when pay went up.",
    guide_item3_title: "3. Judge by purchasing power",
    guide_item3_desc:
      "If real salary is below the starting salary, purchasing power fell despite a higher headline salary.",
    checklist_title: "Before You Calculate",
    checklist_hint: "A checklist for more reliable inputs.",
    check_item1_title: "Use one tax basis",
    check_item1_desc:
      "Use either pre-tax or after-tax salary for both periods so the result is not distorted.",
    check_item2_title: "Handle bonuses consistently",
    check_item2_desc:
      "Include or exclude recurring bonuses, allowances, and meal support using the same rule for both salaries.",
    check_item3_title: "Account for work changes",
    check_item3_desc:
      "If working hours or employment type changed, compare hourly compensation separately.",
    check_item4_title: "Remember personal inflation",
    check_item4_desc:
      "People with high housing, education, or transport costs may feel inflation differently from official CPI.",
    limitations_title: "Limits and Responsible Use",
    limitations_hint: "The tool avoids overstating what one calculation can prove.",
    limitations_desc1:
      "This tool uses average consumer price indices, so it cannot fully represent each household's spending pattern. Housing, interest, childcare, and healthcare costs should be reviewed separately when they matter to you.",
    limitations_desc2:
      "The result is reference information for salary negotiation, job-offer comparison, and cost-of-living checks. It does not replace investment, tax, legal, or employment advice.",
    ad_policy_title: "Advertising and Content Principles",
    ad_policy_hint: "Publisher content comes first; advertising is only supplementary.",
    ad_policy_desc1:
      "This site prioritizes publisher content that solves the user's purpose: the calculator, data sources, interpretation guide, and FAQ. Ads should not cover content or be confused with buttons, inputs, sharing controls, or other interactive elements.",
    ad_policy_desc2:
      "Google-served ads are not placed on screens with limited content or primarily navigational purpose, including share preview pages, error pages, and policy documents. We do not create affiliate pages, auto-generated articles, copied content, or under-construction pages for ad monetization.",
    ad_policy_item1_title: "Content first",
    ad_policy_item1_desc:
      "The calculator and explanatory content should remain the focus of the screen.",
    ad_policy_item2_title: "No ads on empty screens",
    ad_policy_item2_desc:
      "No ad code is placed on error, navigation, or share preview screens.",
    ad_policy_item3_title: "No accidental interactions",
    ad_policy_item3_desc:
      "Ad placements should not be confused with inputs, buttons, or navigation.",
    ad_policy_item4_title: "No replicated content",
    ad_policy_item4_desc:
      "The site provides original explanations and calculation functionality instead of copied external content.",
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
    faq_q5: "Why shouldn't I rely on the result alone?",
    faq_a5:
      "The calculator uses average inflation, so items with large personal weight such as housing, food, or education should still be interpreted separately.",
    faq_q6: "What should I review before using it?",
    faq_a6:
      "Check your starting salary, current salary, recent raises, and the living-cost categories that affect your household the most for a better reading.",
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
      "Measured against start-year prices: salary {nominal}, inflation {inflation}, real change {real}.",
    report_title_line: "Real salary report",
    report_subtitle: "Inflation-adjusted summary",
    report_headline: "Real buying power {real}",
    report_caption: "Nominal raises vs inflation,",
    report_caption2: "this is the real change.",
    report_footer: "Paycheck reality check",
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
  jumpToResults: document.getElementById("jump-to-results"),
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

const getThemePalette = () => {
  const rootStyles = getComputedStyle(document.documentElement);
  const read = (name, fallback) => rootStyles.getPropertyValue(name).trim() || fallback;
  return {
    bg: read("--bg", "#0f1012"),
    ink: read("--ink", "#f3f3f3"),
    inkSoft: read("--ink-soft", "#b6b6b6"),
    accent: read("--accent", "#4aa3ff"),
    accentDark: read("--accent-dark", "#2d7ed4"),
    accent2: read("--accent-2", "#ff7a7a"),
    action: read("--action", "#ffd166"),
    loss: read("--loss", "#ff6b6b"),
    gain: read("--gain", "#52c2a6"),
    surface: read("--surface", "rgba(20, 20, 20, 0.95)"),
    surface2: read("--surface-2", "rgba(28, 28, 28, 0.92)"),
    stroke: read("--stroke", "rgba(255, 255, 255, 0.08)"),
  };
};

const drawRoundedRect = (ctx, x, y, width, height, radius) => {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
};

const drawMoneyBill = (ctx, x, y, width, height, palette, opacity = 0.35) => {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle = palette.gain;
  drawRoundedRect(ctx, x, y, width, height, 16);
  ctx.fill();
  ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, x + 10, y + 10, width - 20, height - 20, 12);
  ctx.stroke();
  ctx.strokeStyle = "rgba(0, 0, 0, 0.18)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x + width * 0.28, y + height / 2, height * 0.2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + width * 0.52, y + height * 0.35);
  ctx.lineTo(x + width * 0.82, y + height * 0.35);
  ctx.moveTo(x + width * 0.52, y + height * 0.5);
  ctx.lineTo(x + width * 0.82, y + height * 0.5);
  ctx.moveTo(x + width * 0.52, y + height * 0.65);
  ctx.lineTo(x + width * 0.72, y + height * 0.65);
  ctx.stroke();
  ctx.restore();
};

const drawMoneyStack = (ctx, x, y, width, height, palette) => {
  const stackGap = 12;
  const stackHeight = Math.max(28, Math.floor(height / 3) - stackGap);
  const stackCount = 3;
  for (let i = 0; i < stackCount; i += 1) {
    const offsetY = y + (stackCount - 1 - i) * stackGap;
    const opacity = 0.18 + i * 0.14;
    drawMoneyBill(ctx, x, offsetY, width, stackHeight, palette, opacity);
  }
};

const drawWrappedTextBlock = (ctx, text, x, y, maxWidth, lineHeight, shouldDraw = true) => {
  if (!text) {
    return 0;
  }
  const words = text.split(" ").filter(Boolean);
  const lines = [];
  const pushLine = (line) => {
    if (line.trim()) {
      lines.push(line.trim());
    }
  };
  if (words.length <= 1) {
    let line = "";
    for (const char of text) {
      const testLine = `${line}${char}`;
      if (ctx.measureText(testLine).width > maxWidth && line) {
        pushLine(line);
        line = char;
      } else {
        line = testLine;
      }
    }
    pushLine(line);
  } else {
    let line = "";
    words.forEach((word, index) => {
      const testLine = `${line}${word} `;
      if (ctx.measureText(testLine).width > maxWidth && index > 0) {
        pushLine(line);
        line = `${word} `;
      } else {
        line = testLine;
      }
    });
    pushLine(line);
  }
  if (shouldDraw) {
    lines.forEach((line, index) => {
      ctx.fillText(line, x, y + index * lineHeight);
    });
  }
  return lines.length * lineHeight;
};

const renderReportCanvas = (stats, settings) => {
  const dict = translations[settings.language] || translations.ko;
  const canvas = elements.reportCanvas;
  const ctx = canvas.getContext("2d");
  const { width, height } = canvas;
  const palette = getThemePalette();
  const lossAmount = Math.max(stats.startSalary - stats.realCurrentSalary, 0);
  const headline = dict.report_headline.replace(
    "{real}",
    formatPercent(stats.realDelta, settings.language),
  );
  const lossText = settings.maskVisible
    ? dict.shock_template.replace("{loss}", formatCurrency(lossAmount, settings.country))
    : dict.report_loss_private;
  const bgGradient = ctx.createRadialGradient(
    width * 0.3,
    height * 0.05,
    0,
    width * 0.3,
    height * 0.05,
    height * 1.1,
  );
  bgGradient.addColorStop(0, "#1c1f24");
  bgGradient.addColorStop(0.55, "#121316");
  bgGradient.addColorStop(1, "#0a0b0d");
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  const drawBlob = (x, y, r, color, alpha) => {
    ctx.save();
    const blob = ctx.createRadialGradient(x, y, 0, x, y, r);
    blob.addColorStop(0, color);
    blob.addColorStop(1, "transparent");
    ctx.globalAlpha = alpha;
    ctx.fillStyle = blob;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  drawBlob(width * 0.1, height * 0.05, 260, palette.accent, 0.22);
  drawBlob(width * 0.92, height * 0.2, 320, palette.accent2, 0.2);
  drawBlob(width * 0.2, height * 0.92, 260, palette.action, 0.18);

  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
  ctx.lineWidth = 1;
  const gridSize = 140;
  for (let x = 0; x <= width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y <= height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();

  const panelX = 60;
  const panelY = 160;
  const panelW = width - 120;
  const panelH = height - 260;
  const panelRadius = 32;

  const panelGradient = ctx.createLinearGradient(panelX, panelY, panelX, panelY + panelH);
  panelGradient.addColorStop(0, "rgba(26, 26, 30, 0.92)");
  panelGradient.addColorStop(1, "rgba(18, 18, 22, 0.92)");
  ctx.fillStyle = panelGradient;
  drawRoundedRect(ctx, panelX, panelY, panelW, panelH, panelRadius);
  ctx.fill();
  ctx.strokeStyle = palette.stroke;
  ctx.lineWidth = 2;
  ctx.stroke();

  const contentX = panelX + 48;
  const contentW = panelW - 96;
  let cursorY = panelY + 58;

  ctx.font = "24px 'Pretendard', sans-serif";
  const badgeText = dict.report_subtitle;
  const badgePadding = 18;
  const badgeHeight = 40;
  const badgeWidth = ctx.measureText(badgeText).width + badgePadding * 2;
  ctx.fillStyle = "rgba(74, 163, 255, 0.18)";
  drawRoundedRect(ctx, contentX, cursorY, badgeWidth, badgeHeight, badgeHeight / 2);
  ctx.fill();
  ctx.fillStyle = palette.accent;
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(badgeText, contentX + badgePadding, cursorY + badgeHeight / 2);

  cursorY += 62;
  ctx.fillStyle = palette.ink;
  ctx.font = "64px 'GmarketSansBold', sans-serif";
  ctx.textBaseline = "alphabetic";
  const titleHeight = drawWrappedTextBlock(
    ctx,
    dict.report_title_line,
    contentX,
    cursorY + 10,
    contentW,
    70,
  );

  cursorY += titleHeight + 22;
  ctx.font = "42px 'GmarketSansBold', sans-serif";
  ctx.fillStyle = palette.action;
  const headlineHeight = drawWrappedTextBlock(
    ctx,
    headline,
    contentX,
    cursorY + 10,
    contentW,
    48,
  );

  cursorY += headlineHeight + 24;
  ctx.strokeStyle = palette.stroke;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(contentX, cursorY + 20);
  ctx.lineTo(contentX + contentW, cursorY + 20);
  ctx.stroke();

  const cardY = cursorY + 44;
  const cardH = 112;
  const cardGap = 16;
  const cardW = (contentW - cardGap) / 2;
  const cardX = contentX;
  const cardX2 = cardX + cardW + cardGap;

  ctx.fillStyle = palette.surface;
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 20);
  ctx.fill();
  drawRoundedRect(ctx, cardX2, cardY, cardW, cardH, 20);
  ctx.fill();

  ctx.fillStyle = palette.inkSoft;
  ctx.font = "26px 'Pretendard', sans-serif";
  ctx.fillText(dict.result_nominal_change, cardX + 24, cardY + 42);
  ctx.fillText(dict.result_inflation_change, cardX2 + 24, cardY + 42);

  ctx.fillStyle = palette.ink;
  ctx.font = "40px 'GmarketSansBold', sans-serif";
  ctx.fillText(
    `+${formatPercent(stats.nominalDelta, settings.language)}`,
    cardX + 24,
    cardY + 90,
  );
  ctx.fillText(
    `+${formatPercent(stats.inflationRate, settings.language)}`,
    cardX2 + 24,
    cardY + 90,
  );

  const graphicY = cardY + 148;
  const graphicH = 120;
  const graphicW = Math.min(360, contentW);
  const graphicX = contentX + (contentW - graphicW) / 2;
  drawMoneyStack(ctx, graphicX, graphicY, graphicW, graphicH, palette);

  const impactY = graphicY + graphicH + 24;
  const captionBoxY = panelY + panelH - 280;
  const impactMaxY = captionBoxY - 20;
  let impactFontSize = 40;
  let impactLineHeight = 44;
  let impactHeight = 0;
  const impactColor = settings.maskVisible
    ? lossAmount > 0
      ? palette.loss
      : palette.gain
    : palette.inkSoft;
  ctx.fillStyle = impactColor;
  do {
    ctx.font = `${impactFontSize}px 'GmarketSansBold', sans-serif`;
    impactHeight = drawWrappedTextBlock(
      ctx,
      lossText,
      contentX,
      impactY,
      contentW,
      impactLineHeight,
      false,
    );
    if (impactY + impactHeight <= impactMaxY || impactFontSize <= 30) {
      break;
    }
    impactFontSize -= 4;
    impactLineHeight -= 4;
  } while (impactFontSize > 28);
  drawWrappedTextBlock(ctx, lossText, contentX, impactY, contentW, impactLineHeight);

  ctx.fillStyle = palette.surface2;
  drawRoundedRect(ctx, contentX, captionBoxY, contentW, 240, 22);
  ctx.fill();

  ctx.fillStyle = palette.ink;
  ctx.font = "28px 'Pretendard', sans-serif";
  ctx.fillText(dict.report_caption, contentX + 24, captionBoxY + 70);
  ctx.fillText(dict.report_caption2, contentX + 24, captionBoxY + 110);
  ctx.font = "32px 'GmarketSansBold', sans-serif";
  drawWrappedText(
    ctx,
    getVerdictText(stats, settings.language),
    contentX + 24,
    captionBoxY + 165,
    contentW - 48,
    44,
  );

  ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
  drawRoundedRect(ctx, contentX, panelY + panelH - 100, contentW, 64, 18);
  ctx.fill();
  ctx.fillStyle = palette.inkSoft;
  ctx.font = "26px 'GmarketSansBold', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(dict.report_footer, width / 2, panelY + panelH - 68);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

};

const drawWrappedText = (ctx, text, x, y, maxWidth, lineHeight) => {
  drawWrappedTextBlock(ctx, text, x, y, maxWidth, lineHeight);
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

const scrollToSection = (targetId) => {
  const node = document.getElementById(targetId);
  if (!node) {
    return;
  }
  const headerOffset = 120;
  const top = node.getBoundingClientRect().top + window.scrollY - headerOffset;
  window.scrollTo({ top, behavior: "smooth" });
};

const settings = loadSettings();
setFormValues(settings);
applyTranslations(settings.language);
render(settings);
syncSalaryInputs(settings);
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

if (elements.jumpToResults) {
  elements.jumpToResults.addEventListener("click", () => {
    scrollToSection("results");
  });
}

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
