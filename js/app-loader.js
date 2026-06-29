/* app-loader.js — نافذة انتظار تظهر فوراً حتى وصول بيانات Firebase
   ------------------------------------------------------------
   تُضمَّن في <head> (قبل رسم الصفحة) على صفحات البيانات فقط:
   index.html و unit-details.html. تغطّي المحتوى حتى يصل الحدث
   firebaseDataReady (أي بعد جلب الأسعار/الأسماء/التفاصيل من Firestore)
   ثم تتلاشى. مهلة احتياطية تحمي من تعذّر تحميل Firebase. */
(function () {
  // لا تُظهر على لوحة التحكم (تحمّل Firebase فيها متزامن ولا يُطلق الحدث)
  if (/(^|\/)admin\.html(?:$|[?#])/.test(location.pathname)) return;

  var STYLE =
    "#app-loader{position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.1rem;" +
    "background:#15242B;transition:opacity .35s ease,visibility .35s ease}" +
    ".theme-dark #app-loader{background:#11181c}" +
    "#app-loader.hide{opacity:0;visibility:hidden;pointer-events:none}" +
    "#app-loader .al-logo{width:60px;height:60px;border-radius:14px;background:#C29A3E;padding:5px;object-fit:contain;box-shadow:0 6px 18px rgba(194,154,62,.35)}" +
    "#app-loader .al-spin{width:50px;height:50px;border-radius:50%;border:4px solid rgba(194,154,62,.22);border-top-color:#C29A3E;animation:alSpin .8s linear infinite}" +
    "@keyframes alSpin{to{transform:rotate(360deg)}}" +
    "#app-loader .al-text{color:#e7d6a8;font-family:'IBM Plex Sans Arabic',system-ui,sans-serif;font-size:.95rem;letter-spacing:.02em}" +
    "@media(prefers-reduced-motion:reduce){#app-loader .al-spin{animation-duration:1.6s}}";

  function inject() {
    if (document.getElementById("app-loader")) return;
    if (!document.getElementById("app-loader-style")) {
      var css = document.createElement("style");
      css.id = "app-loader-style";
      css.textContent = STYLE;
      (document.head || document.documentElement).appendChild(css);
    }
    var el = document.createElement("div");
    el.id = "app-loader";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    el.innerHTML =
      '<img class="al-logo" src="assets/images/logo.png" alt="" aria-hidden="true" />' +
      '<span class="al-spin"></span>' +
      '<span class="al-text">جارٍ تحميل البيانات…</span>';
    (document.body || document.documentElement).appendChild(el);
  }

  // حقن مبكر (قد يسبق وجود <body>)، ثم إعادة التأكيد عند اكتمال DOM
  inject();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject, { once: true });
  }

  var done = false;
  function finish() {
    if (done) return;
    done = true;
    var el = document.getElementById("app-loader");
    if (!el) return;
    el.classList.add("hide");
    setTimeout(function () { if (el && el.parentNode) el.parentNode.removeChild(el); }, 400);
  }

  // البيانات جاهزة من Firebase — أجّل الإخفاء قليلاً حتى تُعاد رسم العناصر (الأسماء/الأسعار)
  window.addEventListener("firebaseDataReady", function () { setTimeout(finish, 60); });
  // فشل تحميل Firebase: أخفِ فوراً وأظهر البيانات الافتراضية المرسومة أسفل النافذة
  window.addEventListener("firebaseLoadFailed", finish);
  // مهلة احتياطية: لا نعلّق المستخدم طويلاً إن تأخر Firebase أو تعذّر إطلاق أي حدث
  setTimeout(finish, 3000);
  window.addEventListener("pagehide", finish);
})();
