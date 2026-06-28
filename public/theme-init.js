// Theme-flash prevention script.
// Loaded synchronously from /theme-init.js so it runs before paint.
// Kept as a plain .js file (not a module) so it executes immediately.
(function () {
  try {
    var s = localStorage.getItem('kurdamuz_settings');
    var mode = 'dark', accent = 'amber', fontSize = 'base', reducedMotion = false;
    if (s) {
      var parsed = JSON.parse(s);
      if (parsed && typeof parsed === 'object') {
        mode = parsed.mode || 'dark';
        accent = parsed.accent || 'amber';
        fontSize = parsed.fontSize || 'base';
        reducedMotion = !!parsed.reducedMotion;
      }
    }
    if (mode === 'system') {
      mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    var html = document.documentElement;
    var body = document.body;
    html.classList.add(mode);
    if (body) { body.classList.add(mode); }
    var accentHex = {
      amber: '#f59e0b', cyan: '#22d3ee', purple: '#a78bfa', green: '#4ade80', rose: '#fb7185'
    }[accent] || '#f59e0b';
    function hexToRgb(h) {
      var m = h.replace('#', '').match(/.{2}/g);
      return m ? m.map(function (x) { return parseInt(x, 16) }).join(', ') : '245, 158, 11';
    }
    if (body) {
      body.style.setProperty('--accent', accentHex);
      body.style.setProperty('--accent-rgb', hexToRgb(accentHex));
      body.style.fontSize = fontSize === 'sm' ? '14px' : fontSize === 'lg' ? '18px' : '16px';
      if (reducedMotion) body.classList.add('reduce-motion');
    }
    var lang = localStorage.getItem('kurdamuz_lang') || 'en';
    if (lang !== 'en') { html.setAttribute('dir', 'rtl'); }
    html.setAttribute('lang', lang === 'ku' ? 'ckb' : lang);
  } catch (e) { /* ignore */ }
})();
