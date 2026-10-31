// Usercentrics Web CMP v3. No analytics SDK is loaded by this integration.
(() => {
  if (window.__miraDocsCmpLoaded) return;
  window.__miraDocsCmpLoaded = true;

  const rulesetId = 'gS66QojQZQ_C0U';
  const copy = {
    en: ['en', 'Cookie settings', 'Opening…', 'Unable to open Cookie settings. Please retry or contact privacy@miraday.ai.'],
    zh: ['zh', 'Cookie 设置', '正在打开…', '暂时无法打开 Cookie 设置，请重试或联系 privacy@miraday.ai。'],
    'zh-TW': ['zh_tw', 'Cookie 設定', '正在開啟…', '暫時無法開啟 Cookie 設定，請重試或聯絡 privacy@miraday.ai。'],
    ja: ['ja', 'Cookie 設定', '開いています…', 'Cookie 設定を開けませんでした。再試行するか privacy@miraday.ai にお問い合わせください。'],
  };
  const locale = () => copy[location.pathname.split('/')[1]] || copy.en;
  let languageQueue = Promise.resolve();

  function deadline(task, milliseconds = 8000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('CMP timeout')), milliseconds);
      Promise.resolve(task).then(resolve, reject).finally(() => clearTimeout(timer));
    });
  }

  function waitForCmp() {
    return new Promise((resolve, reject) => {
      const finish = (error) => {
        clearTimeout(timer);
        window.removeEventListener('UC_UI_INITIALIZED', initialized);
        if (error) reject(error);
        else resolve(window.__ucCmp);
      };
      const initialized = () => {
        if (window.__ucCmp) finish();
      };
      const timer = setTimeout(() => finish(new Error('CMP unavailable')), 8000);
      window.addEventListener('UC_UI_INITIALIZED', initialized);
      const cmp = window.__ucCmp;
      if (cmp) {
        Promise.resolve(cmp.isInitialized()).then((ready) => {
          if (ready) initialized();
        }).catch(() => {});
      }
    });
  }

  // Serialize vendor language writes; read the latest route when work starts.
  function synchronizeLanguage() {
    languageQueue = languageQueue.catch(() => {}).then(async () => {
      const cmp = window.__ucCmp;
      if (!cmp || !await deadline(cmp.isInitialized(), 2000)) return;
      const target = locale()[0];
      let active;
      try { active = await deadline(cmp.getActiveLanguage(), 2000); } catch {}
      if (window.__ucCmp === cmp && active !== target) await cmp.changeLanguage(target);
    });
    return languageQueue;
  }

  async function openSettings(button, status) {
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    button.textContent = locale()[2];
    status.hidden = true;
    try {
      const cmp = await waitForCmp();
      // A failed language operation must never prevent opening withdrawal controls.
      void synchronizeLanguage().catch(() => {});
      await deadline(cmp.showSecondLayer());
    } catch {
      status.textContent = locale()[3];
      status.hidden = false;
    } finally {
      button.disabled = false;
      button.removeAttribute('aria-busy');
      button.textContent = locale()[1];
    }
  }

  function mountControls() {
    const parent = document.getElementById('content-area');
    if (!parent) return;
    let controls = document.getElementById('mira-cookie-settings');
    if (!controls) {
      controls = document.createElement('div');
      controls.id = 'mira-cookie-settings';
      controls.className = 'uc-privacy-controls ph-no-capture';
      const button = document.createElement('button');
      button.type = 'button';
      const status = document.createElement('p');
      status.setAttribute('role', 'status');
      status.hidden = true;
      button.addEventListener('click', () => void openSettings(button, status));
      controls.append(button, status);
    }
    // Mintlify replaces page content during client-side navigation.
    if (controls.parentElement !== parent) parent.appendChild(controls);
    const button = controls.querySelector('button');
    if (!button.disabled) button.textContent = locale()[1];
    const status = controls.querySelector('[role="status"]');
    if (!status.hidden) status.textContent = locale()[3];
  }

  window.addEventListener('UC_UI_INITIALIZED', () => {
    void synchronizeLanguage().catch(() => {});
  });
  window.addEventListener('mintlify:navigate', () => {
    mountControls();
    void synchronizeLanguage().catch(() => {});
  });
  mountControls();

  if (!document.getElementById('usercentrics-cmp')) {
    const script = document.createElement('script');
    script.id = 'usercentrics-cmp';
    script.src = 'https://web.cmp.usercentrics.eu/ui/loader.js';
    script.dataset.rulesetId = rulesetId;
    script.dataset.language = locale()[0];
    script.dataset.disableTracking = 'true';
    script.async = true;
    script.addEventListener('load', () => void synchronizeLanguage().catch(() => {}));
    document.head.appendChild(script);
  } else {
    void synchronizeLanguage().catch(() => {});
  }
})();
