(() => {
  const SECTION_TITLES = [
    "顶部区块",
    "主区块",
    "核心指标区",
    "中区块标题区",
    "中区卡片区",
    "底区块标题区",
    "底区 List 区",
    "联系信息区",
    "Hero Section",
    "Main Section",
    "Metrics Section",
    "Middle Header Section",
    "Cards Section",
    "Bottom Header Section",
    "Bottom List Section",
    "Contact Info Section",
  ];
  const SHOW_RE = /^\s*(显示|show)/i;
  const STATE_KEY = "lq_keystatic_enabled_filter_v5";
  const MARK = "data-lq-filter-hide";

  const trim = (s) => (s || "").replace(/\s+/g, " ").trim();
  const isTitle = (text) => SECTION_TITLES.includes(trim(text));

  const readState = () => {
    try { return localStorage.getItem(STATE_KEY) === "1"; } catch { return false; }
  };
  const writeState = (v) => {
    try { localStorage.setItem(STATE_KEY, v ? "1" : "0"); } catch {}
  };

  const clearHidden = () => {
    document.querySelectorAll(`[${MARK}="1"]`).forEach((el) => {
      if (el instanceof HTMLElement) {
        el.style.display = "";
        el.removeAttribute(MARK);
      }
    });
  };

  const ensureButton = () => {
    let btn = document.getElementById("lq-filter-btn");
    if (btn) return btn;
    btn = document.createElement("button");
    btn.id = "lq-filter-btn";
    btn.type = "button";
    btn.style.position = "fixed";
    btn.style.top = "84px";
    btn.style.right = "92px";
    btn.style.zIndex = "99999";
    btn.style.padding = "8px 12px";
    btn.style.fontSize = "12px";
    btn.style.border = "1px solid #cbd5e1";
    btn.style.borderRadius = "8px";
    btn.style.background = "#fff";
    btn.style.cursor = "pointer";
    btn.style.boxShadow = "0 2px 6px rgba(0,0,0,0.08)";
    document.body.appendChild(btn);
    return btn;
  };

  const findHeadings = () => {
    const nodes = Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6,div,p,span"));
    const hits = [];
    for (const n of nodes) {
      if (!(n instanceof HTMLElement)) continue;
      const t = trim(n.textContent);
      if (!isTitle(t)) continue;
      if (!hits.includes(n)) hits.push(n);
    }
    // keep visible order and de-dup by text nearest
    return hits;
  };

  const findShowToggleBetween = (startEl, endEl) => {
    let node = startEl;
    while (node) {
      node = node.nextElementSibling;
      if (!node || node === endEl) break;
      const checks = node.querySelectorAll('input[type="checkbox"]');
      for (const c of checks) {
        const text = trim(c.closest("label")?.textContent || "");
        if (SHOW_RE.test(text)) return c;
      }
    }
    return null;
  };

  const hideSectionSiblings = (startEl, endEl, showToggle) => {
    // 找 checkbox 所在的同级块，之后的同级块全部隐藏直到下一个标题
    let row = showToggle.closest("label") || showToggle;
    while (row && row.parentElement && row.parentElement !== startEl.parentElement) {
      row = row.parentElement;
    }
    let node = row;
    while (node) {
      node = node.nextElementSibling;
      if (!node || node === endEl) break;
      if (!(node instanceof HTMLElement)) continue;
      // 避免把下一节标题误隐藏
      if (isTitle(trim(node.textContent))) break;
      const hasControl = !!node.querySelector("input,textarea,select,button") || node.matches("input,textarea,select,button");
      if (!hasControl) continue;
      node.style.display = "none";
      node.setAttribute(MARK, "1");
    }
  };

  const applyFilter = () => {
    clearHidden();
    if (!enabled) return;

    const headings = findHeadings();
    for (let i = 0; i < headings.length; i++) {
      const start = headings[i];
      const end = headings[i + 1] || null;
      const showToggle = findShowToggleBetween(start, end);
      if (!(showToggle instanceof HTMLInputElement)) continue;
      if (showToggle.checked) continue;
      hideSectionSiblings(start, end, showToggle);
    }
  };

  let enabled = readState();

  const render = () => {
    const btn = ensureButton();
    btn.textContent = enabled ? "显示全部区块" : "只看已启用区块";
    applyFilter();
  };

  const boot = () => {
    console.log("[lq-filter] v5 ready");
    const btn = ensureButton();
    btn.onclick = () => {
      enabled = !enabled;
      writeState(enabled);
      render();
    };

    document.addEventListener("change", (e) => {
      if (!enabled) return;
      const t = e.target;
      if (t instanceof HTMLInputElement && t.type === "checkbox") render();
    }, true);

    render();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
