/* Only synchronizes the external assistant call-to-action with the website language. */
(function () {
  'use strict';
  const label = document.getElementById('ks-ai-site-link-text');
  const link = document.getElementById('ks-ai-site-link');
  if (!label || !link) return;
  function updateLanguage() {
    const hash = decodeURI(window.location.hash || '');
    const english = /^#\/en(?:\/|$)/i.test(hash) || (!/^#\/ar(?:\/|$)/i.test(hash) && document.documentElement.lang.toLowerCase().startsWith('en'));
    label.textContent = english ? 'Ask KARIM AI' : 'اسأل KARIM AI';
    link.title = label.textContent;
    link.setAttribute('aria-label', english ? 'Ask KARIM AI — opens in a new tab' : 'اسأل KARIM AI — يفتح المساعد في نافذة جديدة');
    link.lang = english ? 'en' : 'ar';
    link.dir = english ? 'ltr' : 'rtl';
  }
  window.addEventListener('hashchange', updateLanguage);
  updateLanguage();
})();
