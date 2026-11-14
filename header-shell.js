/* Website-aligned Docs shell. Native Mintlify search, locale and theme controls stay mounted. */
(() => {
  const KEY = '__miraDocsShell';
  if (window[KEY]) return;
  window[KEY] = { version: '2026-11-15.1' };
  const words = {
    en: { docs: 'Docs', blog: 'Blog', login: 'Log In', start: 'Start for free', search: 'Search docs...', menu: 'Open navigation', close: 'Close navigation', theme: 'Change theme', modes: ['System', 'Light', 'Dark'], links: 'MiraDay navigation' },
    zh: { docs: '文档', blog: '博客', login: '登录', start: '免费开始', search: '搜索文档…', menu: '打开导航', close: '关闭导航', theme: '切换主题', modes: ['跟随系统', '浅色', '深色'], links: 'MiraDay 导航' },
    'zh-TW': { docs: '文件', blog: '部落格', login: '登入', start: '免費開始', search: '搜尋文件…', menu: '開啟導覽', close: '關閉導覽', theme: '切換主題', modes: ['跟隨系統', '淺色', '深色'], links: 'MiraDay 導覽' },
    ja: { docs: 'ドキュメント', blog: 'ブログ', login: 'ログイン', start: '無料で始める', search: 'ドキュメントを検索…', menu: 'ナビゲーションを開く', close: 'ナビゲーションを閉じる', theme: 'テーマを切り替え', modes: ['システム', 'ライト', 'ダーク'], links: 'MiraDay ナビゲーション' }
  };
  const setText = (node, value) => { if (node && node.textContent !== value) node.textContent = value; };
  const add = (node, name) => { if (node && !node.classList.contains(name)) node.classList.add(name); };
  const locale = () => words[location.pathname.split('/')[1]] ? location.pathname.split('/')[1] : 'en';
  const closeDrawer = () => document.querySelector('#mobile-nav > button')?.click();
  function insertMobileLinks(drawer, lang, text) {
    const content = drawer.querySelector('[data-component-part="scroll-area-content"] > div');
    if (!content) return;
    let links = content.querySelector('.mira-mobile-links');
    if (!links) {
      links = document.createElement('nav');
      links.className = 'mira-mobile-links';
      links.innerHTML = '<a data-docs-link></a><a data-blog-link></a>';
      links.addEventListener('click', closeDrawer);
      content.prepend(links);
    }
    if (links.getAttribute('aria-label') !== text.links) links.setAttribute('aria-label', text.links);
    const doc = links.querySelector('[data-docs-link]');
    doc.href = `/${lang}/docs/index`; setText(doc, text.docs); doc.setAttribute('aria-current', 'true');
    const blog = links.querySelector('[data-blog-link]');
    blog.href = 'https://blog.miraday.ai/'; setText(blog, text.blog);
    let cta = content.querySelector('.mira-mobile-cta');
    if (!cta) {
      cta = document.createElement('div'); cta.className = 'mira-mobile-cta';
      cta.innerHTML = '<a data-start-link></a><a data-login-link></a>';
      cta.addEventListener('click', closeDrawer);
      const items = content.querySelector('#navigation-items');
      if (items) items.before(cta); else content.append(cta);
    }
    const start = cta.querySelector('[data-start-link]');
    start.href = `https://www.miraday.ai/sign-up?lang=${lang}`; setText(start, text.start);
    const login = cta.querySelector('[data-login-link]');
    login.href = `https://www.miraday.ai/sign-in?lang=${lang}`; setText(login, text.login);
    const theme = content.querySelector('[data-switch="pill"]');
    add(theme?.parentElement, 'mira-shell-drawer-heading');
    const close = drawer.querySelector(':scope > button');
    if (close && close.getAttribute('aria-label') !== text.close) close.setAttribute('aria-label', text.close);
  }
  function update() {
    const header = document.getElementById('navbar');
    if (!header) return;
    const lang = locale(), text = words[lang];
    const logo = header.querySelector('.nav-logo')?.closest('a');
    if (!logo) return;
    const logoBox = logo.parentElement, inner = logoBox.parentElement, row = inner.parentElement;
    add(logoBox, 'mira-shell-logo'); add(inner, 'mira-shell-inner'); add(row, 'mira-shell-row');
    const localization = header.querySelector('#localization-select-trigger');
    add(localization?.parentElement, 'mira-shell-locale');
    const search = header.querySelector('#search-bar-entry'); add(search?.parentElement, 'mira-shell-search');
    setText(search?.querySelector('[data-search-item="trigger-label"]'), text.search);
    const mobileSearch = header.querySelector('#search-bar-entry-mobile'); add(mobileSearch?.parentElement, 'mira-shell-mobile');
    for (const button of mobileSearch?.parentElement.querySelectorAll('button') || []) {
      if (button !== mobileSearch) add(button, 'mira-shell-more');
    }
    setText(mobileSearch?.querySelector('.sr-only'), text.search);
    const main = header.querySelector('nav[aria-label="Main"]'); add(main?.parentElement, 'mira-shell-actions');
    for (const item of main?.querySelectorAll('li') || []) {
      const a = item.querySelector('a'); if (!a) continue;
      if (item.id === 'topbar-cta-button') continue;
      if (a.pathname.includes('/sign-in')) add(item, 'mira-shell-login');
      else if (a.hostname === 'blog.miraday.ai') add(item, 'mira-shell-blog');
      else if (a.pathname.includes('/docs')) add(item, 'mira-shell-docs');
      else add(item, 'mira-shell-duplicate');
    }
    const theme = header.querySelector('#theme-preference-menu-trigger'); add(theme?.parentElement, 'mira-shell-theme');
    if (theme && theme.getAttribute('aria-label') !== text.theme) theme.setAttribute('aria-label', text.theme);
    ['system', 'light', 'dark'].forEach((mode, index) => {
      const item = document.querySelector(`#theme-preference-menu-item-${mode}`);
      setText(item?.querySelector('div > span'), text.modes[index]);
      setText(item?.querySelector('.sr-only'), text.modes[index]);
    });
    const navigation = [...header.querySelectorAll('button')].find(button => !button.id && button.querySelector('use[href$="-Menu"]'));
    add(navigation, 'mira-shell-navigation');
    if (navigation && navigation.getAttribute('aria-label') !== text.menu) navigation.setAttribute('aria-label', text.menu);
    const drawer = document.getElementById('mobile-nav');
    if (drawer) insertMobileLinks(drawer, lang, text);
  }
  let scheduled = false;
  const schedule = () => { if (!scheduled) { scheduled = true; requestAnimationFrame(() => { scheduled = false; update(); }); } };
  const start = () => {
    update();
    // Native menus render asynchronously in portals outside #root.
    // Observe child changes only; all text writes above are conditional.
    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
    window.addEventListener('mintlify:navigate', schedule);
    window.addEventListener('popstate', schedule);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
})();
