// Owedify capture handler. Posts the email straight to MailerLite (public form
// endpoint, no server needed), then unlocks the document on the page.
(function () {
  var ACCOUNT = "2424196";
  var FORMS = {
    "credit":"189933115070744204","medical":"189933168622568511",
    "ssdi":"189933169551606951","va":"189933170430313691",
    "property":"189933171365643821","debt":"189933172578846527",
    "deadline-guide":"189933173666219038"
  };
  var FORMAT = "html"; // unlock opens the on-voice magnet-a.html (printable / save as PDF)
  function seg(){ return (location.pathname.split("/").filter(Boolean)[0] || "").toLowerCase(); }
  function formId(){ return FORMS[seg()] || ""; }
  function getDocLink() {
    var f = document.querySelector(".docprev iframe"); if (!f) return null;
    var link = f.getAttribute("src").split("?")[0];
    return FORMAT === "pdf" ? link.replace(/\.html$/, ".pdf") : link;
  }
  function valid(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }
  function showError(form){
    var input = form.querySelector("input[type=email]"); input.classList.add("err");
    if (!form.parentNode.querySelector(".form-err")) {
      var err = document.createElement("p"); err.className = "form-err";
      err.textContent = "Enter a valid email address.";
      form.insertAdjacentElement("afterend", err);
    }
    input.focus();
  }
  function unlockAll(){
    var link = getDocLink();
    document.querySelectorAll(".formwrap").forEach(function (w) {
      var d = document.createElement("div"); d.className = "unlocked";
      var ut = document.createElement("div"); ut.className = "ut"; ut.textContent = "Unlocked, and yours to keep.";
      var pp = document.createElement("p");
      pp.textContent = "Open it, print it, or save it as a PDF. A few short notes on winning this kind of dispute will follow by email.";
      d.appendChild(ut); d.appendChild(pp);
      if (link) { var a = document.createElement("a"); a.className = "lbtn"; a.href = link; a.target = "_blank"; a.rel = "noopener"; a.textContent = "Open the document"; d.appendChild(a); }
      var tpl = document.querySelector("template.thanks-bridge"); if (tpl) d.appendChild(tpl.content.cloneNode(true));
      w.replaceChildren(d);
    });
  }
  function submit(form){
    var input = form.querySelector("input[type=email]");
    if (!input || !valid(input.value)) { showError(form); return; }
    var fid = formId();
    if (fid) { try { var b = new URLSearchParams(); b.append("fields[email]", input.value.trim()); b.append("ajax","1");
      fetch("https://assets.mailerlite.com/jsonp/" + ACCOUNT + "/forms/" + fid + "/subscribe", { method:"POST", mode:"no-cors", body:b }); } catch (e) {} }
    unlockAll();
  }
  document.addEventListener("click", function (e) { var btn = e.target.closest(".cap-form .lbtn"); if (!btn) return; e.preventDefault(); submit(btn.closest("form")); });
  document.addEventListener("submit", function (e) { if (e.target.classList && e.target.classList.contains("cap-form")) { e.preventDefault(); submit(e.target); } });
  document.addEventListener("input", function (e) { if (!e.target.matches(".cap-form input")) return; e.target.classList.remove("err"); var wrap = e.target.closest(".formwrap"); var err = wrap ? wrap.querySelector(".form-err") : null; if (err) err.remove(); });
})();
