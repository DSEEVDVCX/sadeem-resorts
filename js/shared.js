/* ============================================================
   منتجعات سديم — مشترك بين كل الصفحات
   ربط الإعدادات + شريط التنقل + قائمة الجوال + كشف الظهور + Lightbox
   ملاحظة: يجب تحميل js/data.js قبله
   ============================================================ */

/* ===== ربط الإعدادات العامة بالعناصر (مع حماية لغياب بعضها) ===== */
function initShell(){
  const $ = id => document.getElementById(id);
  const wa = `https://wa.me/${SETTINGS.whatsapp}`;
  const set = (id, val) => { const el = $(id); if(el) el.textContent = val; };
  const href = (id, url) => { const el = $(id); if(el) el.href = url; };

  set("areaName", SETTINGS.areaName);
  set("areaName2", SETTINGS.areaName);
  set("areaName3", SETTINGS.areaName);
  set("brandName", SETTINGS.brandName);
  set("footerBrand", SETTINGS.brandName);
  set("footerPhone", SETTINGS.phoneDisplay);
  set("year", new Date().getFullYear());

  href("link-whatsapp", wa);
  href("footer-whatsapp", wa);
  href("cta-whatsapp", wa);
  href("float-whatsapp", wa);
  href("hero-wa", wa);
  href("cta-wa", wa);
  href("link-instagram", SETTINGS.instagram);
  href("footer-instagram", SETTINGS.instagram);
  href("link-tiktok", SETTINGS.tiktok);
  href("footer-tiktok", SETTINGS.tiktok);

  // خريطة المنطقة العامة (إن وُجد العنصر)
  const mapEl = $("area-map");
  if(mapEl && UNITS[0]) mapEl.src = `https://www.google.com/maps?q=${UNITS[0].lat},${UNITS[0].lng}&z=14&output=embed`;

  // شريط التنقل: تأثير التمرير
  const nav = $("navbar");
  if(nav) window.addEventListener("scroll", () => nav.classList.toggle("scrolled", window.scrollY > 20), {passive:true});

  // قائمة الجوال
  const toggle = $("nav-toggle");
  const links = $("nav-links");
  if(toggle && links){
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded","false");
    }));
  }

  // كشف الظهور التدريجي (مع احترام تقليل الحركة)
  const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
  const reveals = document.querySelectorAll(".reveal");
  if(reduce || !("IntersectionObserver" in window)){
    reveals.forEach(e => e.classList.add("in"));
  } else {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); }
    }), {threshold:.15, rootMargin:"0px 0px -40px 0px"});
    reveals.forEach(e => io.observe(e));
  }

  // الوضع الداكن: تطبيق محفوظ + زر التبديل
  const tToggle = $("theme-toggle");
  if(tToggle){
    // طبّق الأيقونة المناسبة حسب الحالة الحالية
    const isDark = document.documentElement.classList.contains("theme-dark");
    tToggle.querySelector("i").className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
    tToggle.addEventListener("click",()=>{
      const html = document.documentElement;
      html.classList.toggle("theme-dark");
      const dark = html.classList.contains("theme-dark");
      try{ localStorage.setItem("sadeem_theme", dark?"dark":"light"); }catch(e){}
      tToggle.querySelector("i").className = dark ? "fa-solid fa-sun" : "fa-solid fa-moon";
    });
  }
}

/* ===== Lightbox مشترك للمعرض ===== */
let _lbState = {imgs:[], idx:0};
function openLightbox(images, startIdx){
  _lbState.imgs = images; _lbState.idx = startIdx || 0;
  let lb = document.getElementById("lightbox");
  if(!lb){
    lb = document.createElement("div");
    lb.id = "lightbox"; lb.className = "lightbox"; lb.hidden = true;
    lb.innerHTML = `
      <button class="lb-close" aria-label="إغلاق"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
      <button class="lb-nav prev" aria-label="السابق"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>
      <img src="" alt="معاينة الصورة" />
      <button class="lb-nav next" aria-label="التالي"><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button>
      <div class="lb-counter"></div>`;
    document.body.appendChild(lb);
    lb.addEventListener("click", e => {
      if(e.target === lb || e.target.closest(".lb-close")) closeLightbox();
      if(e.target.closest(".lb-prev")) _lbNav(-1);
      if(e.target.closest(".lb-next")) _lbNav(1);
    });
    document.addEventListener("keydown", e => {
      if(lb.hidden) return;
      if(e.key === "Escape") closeLightbox();
      if(e.key === "ArrowLeft") _lbNav(1);
      if(e.key === "ArrowRight") _lbNav(-1);
    });
  }
  lb.hidden = false;
  document.body.style.overflow = "hidden";
  _lbRender();
}
function _lbRender(){
  const lb = document.getElementById("lightbox");
  lb.querySelector("img").src = _lbState.imgs[_lbState.idx];
  lb.querySelector(".lb-counter").textContent = (_lbState.idx+1) + " / " + _lbState.imgs.length;
}
function _lbNav(dir){
  _lbState.idx = (_lbState.idx + dir + _lbState.imgs.length) % _lbState.imgs.length;
  _lbRender();
}
function closeLightbox(){
  const lb = document.getElementById("lightbox");
  if(lb){ lb.hidden = true; document.body.style.overflow = ""; }
}
