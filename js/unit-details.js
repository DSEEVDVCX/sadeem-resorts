/* ============================================================
   تفاصيل الاستراحة — معرض الصور + الخريطة + نظام التقييمات
   يعتمد على globals من utils.js/data.js/shared.js (esc, UNITS, openLightbox, MarbellaStore, bootstrapPage)
   ============================================================ */

bootstrapPage(async () => {
  const $=id=>document.getElementById(id);

  // قراءة معرّف الاستراحة من الرابط
  const params=new URLSearchParams(location.search);
  const id=params.get("id");
  const unit=UNITS.find(u=>u.id===id)||UNITS[0];
  if(!unit){ $("detail-content").innerHTML=`<div class="empty-state"><h3>الاستراحة غير موجودة</h3><a href="index.html" class="btn btn-primary">العودة للرئيسية</a></div>`; return; }

  const isEn = typeof currentLang !== "undefined" && currentLang === "en";
  const name = isEn ? (unit.nameEn || unit.name) : unit.name;
  const features=(unit.features||[]).map(f=>`<span class="chip"><i class="fa-solid fa-check" aria-hidden="true"></i>${esc(f)}</span>`).join("");
  const gallery=(unit.images||[]).map((src,i)=>`<figure class="dg-thumb"><img src="${esc(src)}" alt="صورة ${esc(name)} ${i+1}" loading="lazy" data-idx="${i}"/></figure>`).join("");
  const similar=UNITS.filter(u=>u.id!==unit.id).map(u=>`
    <a class="sim-card" href="unit-details.html?id=${u.id}">
      <img src="${esc((u.images||[])[0]||'')}" alt="${esc(u.name)}" loading="lazy" width="200" height="140"/>
      <span class="sim-name">${esc(u.name)}</span>
      <span class="sim-price">${esc(u.price)} ${esc(u.currency)}</span>
    </a>`).join("");

  const mainImgSrc = (unit.images && unit.images.length) ? unit.images[0] : '';
  const nightPrice = unit.price;
  const dayPrice = unit.dayPrice || unit.price;
  const pricesHTML = (nightPrice !== dayPrice)
    ? `<div class="bc-prices">
         <span class="bc-price-night">🌙 ${esc(nightPrice)} ${esc(unit.currency)} <small>/${isEn?"Night":"الليلة"}</small></span>
         <span class="bc-price-day">☀️ ${esc(dayPrice)} ${esc(unit.currency)} <small>/${isEn?"Day":"نهاري"}</small></span>
       </div>`
    : `<div class="bc-price">${esc(nightPrice)} <small>${esc(unit.currency)} / ${isEn?"Night":"الليلة"}</small></div>`;
  $("detail-content").innerHTML=`
    <div class="detail-grid">
      <div class="detail-main">
        <div class="detail-gallery reveal">
          <figure class="dg-main"><img src="${esc(mainImgSrc)}" alt="${esc(name)}" id="dg-main-img" data-idx="0"/></figure>
          <div class="dg-thumbs">${gallery}</div>
        </div>
        <div class="detail-specs reveal" data-delay="1">
          <h2>${esc(name)}</h2>
          <p class="unit-tag">${esc(unit.tagline)}</p>
          <div class="unit-features">${features}</div>
          <table class="specs-table">
            <tr><td><i class="fa-solid fa-users" aria-hidden="true"></i> ${isEn?"Capacity":"السعة"}</td><td>${esc(unit.capacity)}</td></tr>
            <tr><td><i class="fa-solid fa-bed" aria-hidden="true"></i> ${isEn?"Bedrooms":"غرف النوم"}</td><td>${esc(unit.beds)}</td></tr>
            <tr><td><i class="fa-solid fa-bath" aria-hidden="true"></i> ${isEn?"Bathrooms":"دورات المياه"}</td><td>${esc(unit.baths)}</td></tr>
          </table>
        </div>
        <div class="detail-map reveal" data-delay="2">
          <h3>${isEn?"Location":"الموقع"}</h3>
          <div class="map-wrap" style="height:320px"><iframe src="https://www.google.com/maps?q=${unit.lat},${unit.lng}&z=15&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="خريطة ${esc(name)}"></iframe></div>
        </div>
      </div>
      <aside class="detail-side reveal" data-delay="1">
        <div class="booking-card">
          ${pricesHTML}
          <button class="btn btn-wa btn-full" id="book-this"><i class="fa-solid fa-calendar-check" aria-hidden="true"></i> ${isEn?"Book via WhatsApp":"احجز عبر واتساب"}</button>
          <a class="btn btn-outline btn-full" href="https://www.google.com/maps?q=${unit.lat},${unit.lng}&z=15" target="_blank" rel="noopener"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${isEn?"Directions":"الاتجاهات"}</a>
        </div>
        <div class="reviews-card" id="reviews-card">
          <h3>${isEn?"Guest Reviews":"تقييم الضيوف"}</h3>
          <div id="reviews-display"></div>
          <form id="review-form" class="review-form" novalidate>
            <h4>${isEn?"Add your review":"أضف تقييمك"}</h4>
            <div class="rf-stars" role="radiogroup" aria-label="${isEn?"Rating":"التقييم"}">
              ${[5,4,3,2,1].map(n=>`<input type="radio" name="rev-rating" id="r${n}" value="${n}"><label for="r${n}" aria-label="${n} ${isEn?"stars":"نجوم"}"><i class="fa-solid fa-star"></i></label>`).join("")}
            </div>
            <input id="rev-name" type="text" placeholder="${isEn?"Your name":"اسمك"}" autocomplete="name" />
            <textarea id="rev-text" rows="2" placeholder="${isEn?"Write your comment...":"اكتب تعليقك..."}"></textarea>
            <small class="rf-error" id="rf-error" role="alert"></small>
            <button type="submit" class="a-btn" style="background:var(--brass);color:var(--night)"><i class="fa-solid fa-paper-plane" aria-hidden="true"></i> ${isEn?"Submit":"إرسال التقييم"}</button>
          </form>
        </div>
      </aside>
    </div>
    <section class="similar reveal">
      <h3>${isEn?"Similar resorts":"استراحات مشابهة"}</h3>
      <div class="sim-grid">${similar}</div>
    </section>`;

  // تبديل الصورة الرئيسية + Lightbox المشترك
  if(typeof window.applyRevealEffects === "function") window.applyRevealEffects($("detail-content"));

  const mainImg=$("dg-main-img");
  document.querySelectorAll(".dg-thumb img").forEach(th=>{
    th.addEventListener("click",()=>{ mainImg.src=th.src; mainImg.dataset.idx=th.dataset.idx; });
  });
  mainImg.addEventListener("click",()=>{
    openLightbox(unit.images, parseInt(mainImg.dataset.idx,10)||0);
  });
  mainImg.style.cursor="zoom-in";

  // زر الحجز: يوجّه للصفحة الرئيسية لفتح نافذة الحجز (التقويم) للاستراحة المحددة
  $("book-this").addEventListener("click",()=>{
    location.href=`index.html?book=${encodeURIComponent(unit.id)}#units-section`;
  });

  // ===== نظام التقييمات =====
  const store = window.MarbellaStore;
  async function renderReviews(){
    const wrap = $("reviews-display");
    if(!wrap || !store) return;
    const reviews = await store.getReviews(unit.id);
    const avg = reviews.length ? (reviews.reduce((s,r)=>s+(+r.rating||0),0)/reviews.length) : null;
    const avgStr = avg ? avg.toFixed(1) : "—";
    const stars = avg ? "★".repeat(Math.round(avg)) + "☆".repeat(5-Math.round(avg)) : "★★★★★";
    let html = `<div class="rating"><span class="stars">${stars}</span> ${avgStr} / 5 <small>(${reviews.length} ${isEn?"reviews":"تقييم"})</small></div>`;
    if(reviews.length){
      html += `<div class="rev-list">${reviews.slice().reverse().map(r=>{
        const s = "★".repeat(r.rating)+"☆".repeat(5-r.rating);
        return `<div class="rev-item"><div class="rev-stars">${s}</div><p>${esc(r.text)}</p><small>— ${esc(r.name)}</small></div>`;
      }).join("")}</div>`;
    } else {
      html += `<p class="rev-empty">${isEn?"No reviews yet. Be the first to review!":"لا توجد تقييمات بعد. كن أول من يقيّم!"}</p>`;
    }
    wrap.innerHTML = html;
  }
  await renderReviews();

  // نموذج التقييم
  const rf = $("review-form");
  const rfErr = $("rf-error");
  rf.addEventListener("submit",async e=>{
    e.preventDefault();
    const rating = parseInt(rf.querySelector("input[name=rev-rating]:checked")?.value,10);
    const rname = $("rev-name").value.trim();
    const rtext = $("rev-text").value.trim();
    rfErr.textContent = "";
    if(!rating){ rfErr.textContent=isEn?"Select a rating from 1 to 5 stars":"اختر تقييماً من 1 إلى 5 نجوم"; return; }
    if(!rname){ rfErr.textContent=isEn?"Enter your name":"اكتب اسمك"; return; }
    if(rtext.length<5){ rfErr.textContent=isEn?"Write a comment of at least 5 characters":"اكتب تعليقاً لا يقل عن 5 أحرف"; return; }
    await store.addReview(unit.id, {name:rname, rating, text:rtext});
    rf.reset();
    await renderReviews();
    rfErr.style.color="var(--palm)";
    rfErr.textContent=isEn?"Thank you! Your review has been posted":"شكراً! تم نشر تقييمك";
    setTimeout(()=>{ rfErr.textContent=""; rfErr.style.color=""; }, 3000);
  });

  // إعادة عرض التقييمات عند تبديل اللغة
  window.addEventListener("languageChanged", () => {
    const url = new URL(location.href);
    if(url.searchParams.get("lang") !== currentLang){
      url.searchParams.set("lang", currentLang);
      location.href = url.toString();
    }
  });
});
