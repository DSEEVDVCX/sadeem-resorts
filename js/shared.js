/* ============================================================
   منتجعات سديم — مشترك بين كل الصفحات
   ربط الإعدادات + شريط التنقل + قائمة الجوال + كشف الظهور + Lightbox + تبديل اللغة
   ============================================================ */

const DICT = {
  ar: {
    "nav-about": "من نحن",
    "nav-units": "الاستراحات",
    "nav-faq": "الأسئلة الشائعة",
    "nav-cancellation": "سياسة الإلغاء",
    "nav-map": "الموقع",
    "hero-title": "مجالسٌ تُحيى <em>تحت سماء الصحراء</em>",
    "hero-sub": "ثلاث استراحات خاصة بمسابح ومجالس راقية في قلب الظاهرة — صُممت لخصوصيتك التامة وللّحظات جمعك العائلية بعد الغروب.",
    "btn-book": "احجز الآن",
    "btn-choose": "اختر استراحتك",
    "btn-wa": "تواصل عبر واتساب",
    "btn-pdf": "تحميل الكتيب (PDF)",
    "section-all": "الكل",
    "section-families": "للعائلات",
    "section-singles": "للعزاب",
    "unit-capacity": "السعة:",
    "unit-night": "/الليلة",
    "unit-details": "التفاصيل",
    "unit-location": "الموقع",
    "rooms": "غرف نوم",
    "baths": "دورات مياه",
    "pools": "مسبح",
    "fav-title": "مفضّلتي",
    "footer-rights": "جميع الحقوق محفوظة",
    "lbl-lang": "English",
    "search-placeholder": "ابحث بالاسم...",
    "sort-default": "الترتيب الافتراضي",
    "sort-price-asc": "السعر: الأقل أولًا",
    "sort-price-desc": "السعر: الأعلى أولًا",
    "sort-capacity": "الأكثر سعة"
  },
  en: {
    "nav-about": "About Us",
    "nav-units": "Resorts",
    "nav-faq": "FAQ",
    "nav-cancellation": "Cancellation Policy",
    "nav-map": "Location",
    "hero-title": "Lounges alive <em>under the desert sky</em>",
    "hero-sub": "Three private resorts with pools and elegant lounges in the heart of Al Dhahirah — designed for total privacy.",
    "btn-book": "Book Now",
    "btn-choose": "Choose Resort",
    "btn-wa": "Contact via WhatsApp",
    "btn-pdf": "Download Brochure (PDF)",
    "section-all": "All",
    "section-families": "Families",
    "section-singles": "Singles",
    "unit-capacity": "Capacity:",
    "unit-night": "/Night",
    "unit-details": "Details",
    "unit-location": "Location",
    "rooms": "Rooms",
    "baths": "Baths",
    "pools": "Pool",
    "fav-title": "Favorites",
    "footer-rights": "All rights reserved",
    "lbl-lang": "عربي",
    "search-placeholder": "Search by name...",
    "sort-default": "Default Sort",
    "sort-price-asc": "Price: Low to High",
    "sort-price-desc": "Price: High to Low",
    "sort-capacity": "Highest Capacity"
  }
};

let currentLang = localStorage.getItem("sadeem_lang") || "ar";

function tr(key){
  return DICT[currentLang][key] || key;
}

function updateLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("sadeem_lang", lang);
  
  const html = document.documentElement;
  html.lang = lang;
  html.dir = lang === "ar" ? "rtl" : "ltr";
  
  // Update static text elements
  document.querySelectorAll("[data-tr]").forEach(el => {
    const key = el.getAttribute("data-tr");
    if(DICT[lang][key]){
      if (el.tagName === "INPUT" && el.type === "search") {
        el.placeholder = DICT[lang][key];
      } else {
        el.innerHTML = DICT[lang][key];
      }
    }
  });

  // Update dynamic parts like settings
  const $ = id => document.getElementById(id);
  const set = (id, val) => { const el = $(id); if(el) el.textContent = val; };
  set("brandName", lang === "ar" ? SETTINGS.brandName : SETTINGS.brandNameEn);
  set("footerBrand", lang === "ar" ? SETTINGS.brandName : SETTINGS.brandNameEn);
  
  // Trigger custom event so other scripts can re-render if needed
  window.dispatchEvent(new Event("languageChanged"));
}

/* ===== ربط الإعدادات العامة بالعناصر ===== */
function initShell(){
  const $ = id => document.getElementById(id);
  const wa = `https://wa.me/${SETTINGS.whatsapp}`;
  const set = (id, val) => { const el = $(id); if(el) el.textContent = val; };
  const href = (id, url) => { const el = $(id); if(el) el.href = url; };

  set("areaName", SETTINGS.areaName);
  set("areaName2", SETTINGS.areaName);
  set("areaName3", SETTINGS.areaName);
  set("footerPhone", SETTINGS.phoneDisplay);
  set("year", new Date().getFullYear());

  href("link-whatsapp", wa);
  href("footer-whatsapp", wa);
  href("cta-whatsapp", wa);
  href("float-whatsapp", wa);
  href("hero-wa", wa);
  if($("cta-wa")) href("cta-wa", wa);
  href("link-instagram", SETTINGS.instagram);
  href("footer-instagram", SETTINGS.instagram);
  href("link-tiktok", SETTINGS.tiktok);
  href("footer-tiktok", SETTINGS.tiktok);

  const mapEl = $("area-map");
  if(mapEl && UNITS[0]) mapEl.src = `https://www.google.com/maps?q=${UNITS[0].lat},${UNITS[0].lng}&z=14&output=embed`;

  const nav = $("navbar");
  if(nav) window.addEventListener("scroll", () => nav.classList.toggle("scrolled", window.scrollY > 20), {passive:true});

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

  const tToggle = $("theme-toggle");
  if(tToggle){
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

  const lToggle = $("lang-toggle");
  if(lToggle){
    lToggle.addEventListener("click",()=>{
      const nextLang = currentLang === "ar" ? "en" : "ar";
      updateLanguage(nextLang);
    });
  }

  // Initial lang setup
  updateLanguage(currentLang);
}

/* ===== Lightbox ===== */
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
