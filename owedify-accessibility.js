/* Owedify accessibility widget — first-party, no third-party scripts, no tracking.
   Floating button (bottom-left) opens a panel of reader adjustments.
   Choices persist on the visitor's device (localStorage). Brand: navy + teal. */
(function () {
  "use strict";
  var KEY = "owedify-a11y";
  var state = load();

  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

  /* ---- apply settings to the page ---- */
  function apply() {
    var d = document.documentElement, b = document.body;
    // text size (zoom steps)
    var z = [1, 1.12, 1.25, 1.4][state.text || 0];
    b.style.zoom = z === 1 ? "" : z;
    d.classList.toggle("owa-lh", !!state.lh);
    d.classList.toggle("owa-spacing", !!state.spacing);
    d.classList.toggle("owa-dyslexia", !!state.dys);
    d.classList.toggle("owa-contrast", !!state.contrast);
    d.classList.toggle("owa-links", !!state.links);
    d.classList.toggle("owa-stop", !!state.stop);
    d.classList.toggle("owa-cursor", !!state.cursor);
    // reflect pressed state on buttons if panel open
    document.querySelectorAll("[data-owa]").forEach(function (el) {
      var k = el.getAttribute("data-owa");
      var on = k === "text" ? (state.text || 0) > 0 : !!state[k];
      el.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  /* ---- styles ---- */
  function css() {
    var s = document.createElement("style");
    s.textContent =
      '#owa-btn{position:fixed;left:16px;bottom:16px;z-index:2147483646;width:44px;height:44px;border-radius:50%;background:#22384F;border:2px solid #fff;box-shadow:0 8px 24px rgba(20,34,47,.35);cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0}' +
      '#owa-btn:focus-visible{outline:3px solid #3C7E72;outline-offset:3px}' +
      '#owa-panel{position:fixed;left:16px;bottom:120px;z-index:2147483646;width:330px;max-width:calc(100vw - 36px);max-height:78vh;overflow:auto;background:#fff;color:#22384F;border:1px solid #d4dde3;border-radius:16px;box-shadow:0 24px 70px rgba(20,34,47,.4);font-family:"Hanken Grotesk",system-ui,sans-serif;padding:16px}' +
      '#owa-panel[hidden]{display:none}' +
      '#owa-panel h2{font-family:"Schibsted Grotesk","Hanken Grotesk",sans-serif;font-size:17px;margin:0 0 2px}' +
      '#owa-panel .owa-sub{font-size:12px;color:#5a6a76;margin:0 0 12px}' +
      '#owa-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}' +
      '#owa-panel button.owa-opt{display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center;border:1.5px solid #d4dde3;background:#fff;color:#22384F;border-radius:11px;padding:12px 8px;font:600 12.5px/1.2 inherit;cursor:pointer}' +
      '#owa-panel button.owa-opt:hover{border-color:#3C7E72}' +
      '#owa-panel button.owa-opt[aria-pressed="true"]{background:#22384F;color:#fff;border-color:#22384F}' +
      '#owa-panel button.owa-opt svg{width:20px;height:20px}' +
      '#owa-foot{display:flex;align-items:center;justify-content:space-between;margin-top:12px;padding-top:12px;border-top:1px solid #eef2f4}' +
      '#owa-reset{background:#fff;border:1.5px solid #c2ccd4;border-radius:9px;padding:8px 12px;font:700 12.5px inherit;color:#22384F;cursor:pointer}' +
      '#owa-panel a.owa-stmt{font-size:12.5px;color:#2f6a5f;font-weight:600;text-decoration:underline}' +
      '#owa-panel .owa-x{position:absolute;top:10px;right:12px;border:none;background:none;font-size:22px;line-height:1;color:#7d8a96;cursor:pointer}' +
      '#owa-panel button:focus-visible,#owa-btn:focus-visible,#owa-panel a:focus-visible{outline:3px solid #2f6a5f;outline-offset:2px}' +
      // applied adjustments
      'html.owa-lh *{line-height:1.9 !important}' +
      'html.owa-spacing *{letter-spacing:.06em !important;word-spacing:.16em !important}' +
      'html.owa-dyslexia *{font-family:"Comic Sans MS","Trebuchet MS",Verdana,sans-serif !important;letter-spacing:.03em !important}' +
      'html.owa-links a{text-decoration:underline !important;text-underline-offset:2px;outline:1px dashed currentColor;outline-offset:2px}' +
      'html.owa-contrast,html.owa-contrast body{background:#000 !important}' +
      'html.owa-contrast *{background-color:transparent !important;color:#fff !important;border-color:#fff !important}' +
      'html.owa-contrast a,html.owa-contrast a *{color:#ffe14d !important}' +
      'html.owa-contrast img,html.owa-contrast svg{filter:none}' +
      'html.owa-stop *,html.owa-stop *::before,html.owa-stop *::after{animation:none !important;transition:none !important;scroll-behavior:auto !important}' +
      'html.owa-cursor,html.owa-cursor *{cursor:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'48\' height=\'48\' viewBox=\'0 0 24 24\' fill=\'%2322384F\' stroke=\'white\' stroke-width=\'1.5\'%3E%3Cpath d=\'M4 2l7 18 2.5-7L20 10.5z\'/%3E%3C/svg%3E") 4 4, auto !important}';
    document.head.appendChild(s);
  }

  var I = {
    text: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4-4"/><path d="M8 11h6M11 8v6"/></svg>',
    lh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/><path d="M21 3v18"/></svg>',
    spacing: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 8 3 12l4 4M17 8l4 4-4 4M3 12h18"/></svg>',
    dys: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7V5h16v2M9 5v14M7 19h4"/></svg>',
    contrast: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 3v18" fill="currentColor"/></svg>',
    links: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"/></svg>',
    stop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M10 9v6M14 9v6"/></svg>',
    cursor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 2l7 18 2.5-7L20 10.5z"/></svg>'
  };
  function opt(k, label) {
    return '<button type="button" class="owa-opt" data-owa="' + k + '" aria-pressed="false">' + I[k] + '<span>' + label + '</span></button>';
  }

  function build() {
    css();
    var btn = document.createElement("button");
    btn.id = "owa-btn"; btn.type = "button";
    btn.setAttribute("aria-label", "Accessibility menu");
    btn.setAttribute("aria-haspopup", "dialog");
    btn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="4.2" r="2"/><path d="M4.5 9c2.4.9 4.9 1.4 7.5 1.4S17.1 9.9 19.5 9"/><path d="M12 10.4V15"/><path d="M8.3 21l3.7-6 3.7 6"/></svg>';
    document.body.appendChild(btn);

    var panel = document.createElement("div");
    panel.id = "owa-panel"; panel.hidden = true;
    panel.setAttribute("role", "dialog"); panel.setAttribute("aria-modal", "false");
    panel.setAttribute("aria-label", "Accessibility adjustments");
    panel.innerHTML =
      '<button type="button" class="owa-x" aria-label="Close accessibility menu">×</button>' +
      '<h2>Accessibility</h2><p class="owa-sub">Adjust the page to suit you. Saved on this device.</p>' +
      '<div id="owa-grid">' +
        opt("text", "Bigger text") + opt("lh", "Line height") + opt("spacing", "Text spacing") +
        opt("dys", "Readable font") + opt("contrast", "High contrast") + opt("links", "Highlight links") +
        opt("stop", "Pause motion") + opt("cursor", "Bigger cursor") +
      '</div>' +
      '<div id="owa-foot"><button type="button" id="owa-reset">Reset all</button>' +
      '<a class="owa-stmt" href="/Accessibility.html">Accessibility statement</a></div>';
    document.body.appendChild(panel);

    function openP() { panel.hidden = false; apply(); panel.querySelector(".owa-x").focus(); document.addEventListener("keydown", onKey); }
    function closeP() { panel.hidden = true; document.removeEventListener("keydown", onKey); btn.focus(); }
    function onKey(e) { if (e.key === "Escape") closeP(); }
    btn.addEventListener("click", function () { panel.hidden ? openP() : closeP(); });
    panel.querySelector(".owa-x").addEventListener("click", closeP);

    panel.addEventListener("click", function (e) {
      var o = e.target.closest("[data-owa]"); if (o) {
        var k = o.getAttribute("data-owa");
        if (k === "text") state.text = ((state.text || 0) + 1) % 4;
        else state[k] = !state[k];
        save(); apply(); return;
      }
      if (e.target.closest("#owa-reset")) { state = {}; save(); apply(); }
    });
    apply();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
})();
