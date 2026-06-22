/* Owedify, consent gate + 20% email popup, one self-contained file.
   Drop <script src="/owedify-consent-and-popup.js" defer></script> before </body> on every page.
   No dependencies. No tracker fires until the visitor opts in. Honors Global Privacy Control.
   Brand rules respected: navy + teal, sentence case, no emoji, no em dashes. */
(function () {
  "use strict";

  /* ----------------------- CONFIG (edit these) ----------------------- */
  var CFG = {
    mailerliteAccount: "2424196",     // your MailerLite account id
    popupFormId: "189933115070744204",// MailerLite credit form (popup signups land here; delivers the checklist + code)
    discountCode: "WELCOME20",        // the code shown after they sign up
    freebieName: "the Credit Report Checklist", // the free lead magnet promised in the popup
    popupDelayMs: 12000,              // show popup after 12s, or at 55% scroll, whichever first
    privacyUrl: "/Policy.html",
    // Pixels stay OFF until a visitor accepts. Paste IDs to enable; leave blank to keep clean.
    pixels: {
      ga4: "G-S2YYE55ZDD", // Owedify GA4 (gated: only fires after consent)
      metaPixel: "1727622208569148", // Owedify Meta Pixel (gated: fires only after consent)
      pinterestTag: "2613626084101", // Owedify Pinterest tag (gated: fires only after consent)
      tiktokPixel: ""   // e.g. "C....."
    }
  };

  /* ----------------------- consent storage ----------------------- */
  var KEY = "owedify-consent";            // "granted" | "denied"
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function gpcOn() { return navigator.globalPrivacyControl === true; } // browser "do not sell/share" signal

  /* ----------------------- pixel loaders (only run after consent) ----------------------- */
  function loadPixels() {
    var p = CFG.pixels;
    if (p.ga4) { var s = document.createElement("script"); s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + p.ga4; document.head.appendChild(s);
      window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} window.gtag = gtag; gtag("js", new Date()); gtag("config", p.ga4); }
    if (p.metaPixel) { !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");window.fbq("init",p.metaPixel);window.fbq("track","PageView"); }
    if (p.pinterestTag) { !function(e){if(!window.pintrk){window.pintrk=function(){window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var n=window.pintrk;n.queue=[],n.version="3.0";var t=document.createElement("script");t.async=!0,t.src=e;var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");window.pintrk("load",p.pinterestTag);window.pintrk("page"); }
    if (p.tiktokPixel) { !function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];ttq.setAndDefer=function(e,n){e[n]=function(){e.push([n].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.load=function(e){var n="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=n;var o=d.createElement("script");o.type="text/javascript";o.async=!0;o.src=n+"?sdkid="+e;var a=d.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load(p.tiktokPixel);ttq.page()}(window,document,"ttq"); }
  }
  function anyPixelConfigured() { var p = CFG.pixels; return !!(p.ga4 || p.metaPixel || p.pinterestTag || p.tiktokPixel); }

  /* ----------------------- consent banner ----------------------- */
  function showBanner() {
    var bar = document.createElement("div");
    bar.id = "ow-consent";
    bar.innerHTML =
      '<div class="ow-c-text">We use cookies to keep the site running smoothly and, with your okay, to understand what is helping so we can make Owedify better for you. Your dispute details are never tracked, sold, or shared. See our <a href="' + CFG.privacyUrl + '">Privacy Policy</a>.</div>' +
      '<div class="ow-c-btns"><button type="button" class="ow-c-reject">Reject</button><button type="button" class="ow-c-accept">Accept</button></div>';
    document.body.appendChild(bar);
    bar.querySelector(".ow-c-accept").onclick = function () { set("granted"); bar.remove(); if (anyPixelConfigured()) loadPixelsOnce(); };
    bar.querySelector(".ow-c-reject").onclick = function () { set("denied"); bar.remove(); };
  }

  /* ----------------------- 20% off popup ----------------------- */
  var POP_KEY = "owedify-popup-seen";
  function popupSeen() { try { return localStorage.getItem(POP_KEY) === "1"; } catch (e) { return true; } }
  function markPopup() { try { localStorage.setItem(POP_KEY, "1"); } catch (e) {} }

  function showPopup() {
    if (popupSeen()) return;
    var wrap = document.createElement("div");
    wrap.id = "ow-popup";
    wrap.innerHTML =
      '<div class="ow-p-card" role="dialog" aria-modal="true" aria-labelledby="ow-p-h" aria-describedby="ow-p-sub">' +
      '<button type="button" class="ow-p-x" aria-label="Close offer">&#215;</button>' +
      '<div class="ow-p-icon" aria-hidden="true">' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#3C7E72" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>' +
      '</div>' +
      '<h2 class="ow-p-h" id="ow-p-h">Save 20% on your first kit</h2>' +
      '<p class="ow-p-sub" id="ow-p-sub">Plus the free Credit Report Checklist. Enter your email and we will send both.</p>' +
      '<form class="ow-p-form"><label class="ow-p-srlabel" for="ow-p-email">Email address</label>' +
      '<input id="ow-p-email" type="email" required placeholder="Your email address" autocomplete="email">' +
      '<button type="submit">Get my code</button></form>' +
      '<div class="ow-p-done" role="status" aria-live="polite" hidden></div>' +
      '<div class="ow-p-fine">No spam, unsubscribe anytime. We never sell your address.</div>' +
      '</div>';
    document.body.appendChild(wrap);
    markPopup();
    var input = wrap.querySelector("input");
    setTimeout(function(){ try { input.focus(); } catch (e) {} }, 60);
    function close() { wrap.classList.add("ow-hide"); document.removeEventListener("keydown", onKey); setTimeout(function(){ wrap.remove(); }, 250); }
    function onKey(e) { if (e.key === "Escape") close(); }
    document.addEventListener("keydown", onKey);
    wrap.querySelector(".ow-p-x").onclick = close;
    wrap.onclick = function (e) { if (e.target === wrap) close(); };
    wrap.querySelector(".ow-p-form").onsubmit = function (e) {
      e.preventDefault();
      var email = wrap.querySelector("input").value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { wrap.querySelector("input").focus(); return; }
      // post to MailerLite (public form endpoint, no key, same method as the capture pages)
      try {
        var body = new URLSearchParams(); body.append("fields[email]", email); body.append("ajax", "1");
        fetch("https://assets.mailerlite.com/jsonp/" + CFG.mailerliteAccount + "/forms/" + CFG.popupFormId + "/subscribe", { method: "POST", mode: "no-cors", body: body });
      } catch (err) {}
      wrap.querySelector(".ow-p-form").hidden = true;
      var done = wrap.querySelector(".ow-p-done");
      done.hidden = false;
      done.innerHTML = 'You are in. Use code <b>' + CFG.discountCode + '</b> at checkout for 20% off, and check your inbox for your code and ' + CFG.freebieName + '.';
    };
  }

  function armPopup() {
    if (popupSeen()) return;
    var fired = false;
    function go() { if (fired) return; fired = true; showPopup(); }
    setTimeout(go, CFG.popupDelayMs);
    window.addEventListener("scroll", function onScroll() {
      var pct = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
      if (pct > 0.45) { window.removeEventListener("scroll", onScroll); go(); }
    }, { passive: true });
  }

  /* ----------------------- styles ----------------------- */
  function injectCSS() {
    var css =
      /* consent bar: light card so it stands out on dark sections */
      '#ow-consent{position:fixed;left:16px;right:16px;bottom:16px;z-index:9998;max-width:780px;margin:0 auto;background:#fff;color:#22384F;border:1px solid #d4dde3;border-radius:14px;padding:16px 18px;display:flex;gap:14px;align-items:center;justify-content:space-between;flex-wrap:wrap;box-shadow:0 18px 50px rgba(20,34,47,.28);font-family:"Hanken Grotesk",system-ui,sans-serif}' +
      '#ow-consent .ow-c-text{font-size:13.5px;line-height:1.55;flex:1;min-width:240px;color:#33485a}' +
      '#ow-consent a{color:#2f6a5f;text-decoration:underline}' +
      '#ow-consent .ow-c-btns{display:flex;gap:8px;flex-shrink:0}' +
      '#ow-consent button{font-family:inherit;font-weight:700;font-size:13.5px;border-radius:9px;padding:10px 18px;cursor:pointer;border:1.5px solid #c2ccd4;background:#fff;color:#22384F}' +
      '#ow-consent .ow-c-accept{background:#3C7E72;border-color:#3C7E72;color:#fff}' +
      '#ow-consent button:focus-visible,#ow-consent a:focus-visible{outline:3px solid #2f6a5f;outline-offset:2px}' +
      /* popup: clean, no top border, no slide animation */
      '#ow-popup{position:fixed;inset:0;z-index:9999;background:rgba(20,34,47,.55);display:flex;align-items:center;justify-content:center;padding:20px;opacity:1;transition:opacity .2s;font-family:"Hanken Grotesk",system-ui,sans-serif}' +
      '#ow-popup.ow-hide{opacity:0}' +
      '#ow-popup .ow-p-card{position:relative;background:#fff;color:#22384F;max-width:400px;width:100%;border-radius:18px;padding:30px 30px 24px;box-shadow:0 24px 70px rgba(20,34,47,.34);text-align:center}' +
      '#ow-popup .ow-p-x{position:absolute;top:10px;right:12px;width:34px;height:34px;border:none;background:none;font-size:24px;line-height:1;color:#7d8a96;cursor:pointer;border-radius:8px}' +
      '#ow-popup .ow-p-x:hover{background:#f1f4f6;color:#22384F}' +
      '#ow-popup .ow-p-x:focus-visible{outline:3px solid #2f6a5f;outline-offset:2px}' +
      '#ow-popup .ow-p-icon{width:54px;height:54px;margin:2px auto 16px;border-radius:50%;background:#eef5f3;display:flex;align-items:center;justify-content:center}' +
      '#ow-popup .ow-p-h{font-family:"Schibsted Grotesk","Hanken Grotesk",sans-serif;font-weight:800;font-size:25px;line-height:1.14;margin:0 0 8px}' +
      '#ow-popup .ow-p-sub{font-size:14.5px;line-height:1.5;color:#445564;margin:0 0 18px}' +
      '#ow-popup .ow-p-srlabel{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}' +
      '#ow-popup .ow-p-form{display:flex;flex-direction:column;gap:10px}' +
      '#ow-popup .ow-p-form input{border:1.5px solid #cfd8df;border-radius:11px;padding:14px 16px;font-family:inherit;font-size:16px;color:#22384F;outline:none}' +
      '#ow-popup .ow-p-form input:focus-visible{border-color:#3C7E72;box-shadow:0 0 0 3px rgba(60,126,114,.25)}' +
      '#ow-popup .ow-p-form button{background:#3C7E72;color:#fff;border:none;border-radius:11px;padding:14px;font-family:inherit;font-weight:700;font-size:15px;cursor:pointer}' +
      '#ow-popup .ow-p-form button:hover{background:#356e63}' +
      '#ow-popup .ow-p-form button:focus-visible{outline:3px solid #1f4a42;outline-offset:2px}' +
      '#ow-popup .ow-p-done{font-size:15px;line-height:1.6;color:#22384F;background:#eef5f3;border:1px solid #cfe3dd;border-radius:12px;padding:16px}' +
      '#ow-popup .ow-p-fine{font-size:12px;color:#5a6a76;margin-top:14px;line-height:1.5}' +
      '#ow-privacy-btn{position:fixed;left:16px;bottom:68px;z-index:2147483645;width:44px;height:44px;border-radius:50%;background:#22384F;border:2px solid #fff;box-shadow:0 8px 24px rgba(20,34,47,.35);cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0}' +
      '#ow-privacy-btn:hover{background:#2c465f}' +
      '#ow-privacy-btn:focus-visible{outline:3px solid #3C7E72;outline-offset:3px}' +
      '.ow-cookie-link{cursor:pointer}' +
      '@media (prefers-reduced-motion: reduce){#ow-popup{transition:none}}';
    var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
  }

  /* ----------------------- reopen / manage consent ----------------------- */
  var pixelsLoaded = false;
  function loadPixelsOnce() { if (pixelsLoaded) return; pixelsLoaded = true; loadPixels(); }
  function openConsent() { if (!document.getElementById("ow-consent")) showBanner(); }
  window.owedifyCookieSettings = openConsent;

  function injectCookieControls() {
    // 1) footer "Cookie settings" link (every page with a footer link group)
    document.querySelectorAll(".f-lk").forEach(function (g) {
      if (g.querySelector(".ow-cookie-link")) return;
      var a = document.createElement("a"); a.href = "#"; a.className = "ow-cookie-link"; a.textContent = "Cookie settings";
      a.addEventListener("click", function (e) { e.preventDefault(); openConsent(); });
      g.appendChild(a);
    });
    // 2) floating Privacy button on the side
    if (!document.getElementById("ow-privacy-btn")) {
      var p = document.createElement("button");
      p.id = "ow-privacy-btn"; p.type = "button";
      p.setAttribute("aria-label", "Privacy and cookie settings");
      p.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>';
      p.addEventListener("click", openConsent);
      document.body.appendChild(p);
    }
    // 3) any manual triggers
    document.addEventListener("click", function (e) {
      var t = e.target.closest && e.target.closest(".ow-cookie-settings,[data-cookie-settings]");
      if (t) { e.preventDefault(); openConsent(); }
    });
  }

  /* ----------------------- boot ----------------------- */
  function boot() {
    injectCSS();
    var c = get();
    if (gpcOn() && c !== "granted") { set("denied"); }   // respect browser do-not-sell signal
    else if (c == null) { showBanner(); }                // ask on first visit
    if (get() === "granted" && anyPixelConfigured()) loadPixelsOnce(); // returning, already accepted
    injectCookieControls();
    armPopup();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
