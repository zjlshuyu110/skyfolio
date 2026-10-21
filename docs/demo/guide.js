"use strict";
let guideLanguage = new URLSearchParams(location.search).get('lang');
if (!['en', 'zh-CN'].includes(guideLanguage)) {
  try { guideLanguage = localStorage.getItem('flight-journal-language'); } catch {}
}
if (!['en', 'zh-CN'].includes(guideLanguage)) guideLanguage = 'en';
document.documentElement.lang = guideLanguage;
document.title = guideLanguage === 'en' ? 'Skyfolio · Demo guide' : 'Skyfolio · 演示说明';
document.querySelectorAll('[data-language]').forEach(section => {
  section.hidden = section.dataset.language !== guideLanguage;
});
