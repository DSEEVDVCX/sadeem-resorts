/* ============================================================
   لوحة تحكم منتجعات ماربيلا — منطق كامل
   المصادقة عبر Firebase Authentication + CRUD على Firestore.
   ملاحظة: AR_MONTHS/AR_DOW/pad/toISO من data.js عبر store (مصدر مشترك)
   ============================================================ */

const store = window.MarbellaStore;
let calUnitId = null, calDate = new Date();
let cachedBookings = [];
let _bookingsUnsub = null;

/* ===== أدوات ===== */
function toast(msg,isErr){
  let t=document.querySelector(".a-toast");
  if(!t){t=document.createElement("div");document.body.appendChild(t);}
  t.className="a-toast"+(isErr?" err":"");t.textContent=msg;
  clearTimeout(t._tm);t._tm=setTimeout(()=>t.remove(),3000);
}
// esc() مُعرّفة في js/utils.js (عامة) وتُحمَّل قبل admin.js عبر firebase-loader.js

/* ===== المصادقة عبر Firebase Auth =====
   الأدمن مستخدم Email/Password في Firebase Authentication.
   الجلسة تُدار تلقائياً بواسطة Firebase (بدون sessionStorage). */
// ADMIN_EMAIL مُعرَّف مسبقاً في firebase-config.js — نستخدمه مباشرة عبر window
const _ADMIN_EMAIL = window.ADMIN_EMAIL;

document.getElementById("login-form").addEventListener("submit",async e=>{
  e.preventDefault();
  const pass=document.getElementById("admin-pass").value;
  const err=document.getElementById("login-error");
  const info=document.getElementById("login-info");
  err.textContent=""; info.textContent="";
  try{
    await auth.signInWithEmailAndPassword(_ADMIN_EMAIL, pass);
    // onAuthStateChanged سيتولّى عرض اللوحة
  }catch(ex){
    const code = ex && ex.code ? ex.code : "";
    let msg = "تعذّر تسجيل الدخول";
    if(code==="auth/invalid-credential"||code==="auth/wrong-password"||code==="auth/user-not-found") msg="بيانات الدخول غير صحيحة";
    else if(code==="auth/too-many-requests") msg="محاولات كثيرة، حاول لاحقاً";
    else if(code==="auth/network-request-failed") msg="تحقّق من اتصال الإنترنت";
    err.textContent=msg;
    document.getElementById("admin-pass").value="";
  }
});

document.getElementById("reset-pass-link").addEventListener("click",async ()=>{
  const info=document.getElementById("login-info");
  const err=document.getElementById("login-error");
  err.textContent=""; info.textContent="";
  try{
    await auth.sendPasswordResetEmail(_ADMIN_EMAIL);
    info.textContent="تم إرسال رابط استعادة كلمة المرور إلى بريد الأدمن.";
  }catch(ex){
    err.textContent="تعذّر إرسال رابط الاستعادة. تأكد من تفعيل Email/Password في Firebase.";
  }
});

document.getElementById("logout-btn").addEventListener("click",async ()=>{
  await auth.signOut();
});

// بوابة العرض حسب حالة المصادقة
auth.onAuthStateChanged(async (user) => {
  if(user && user.email === _ADMIN_EMAIL){
    await store.initData();     // تحميل الإعدادات والاستراحات من Firestore
    cachedBookings = await store.getBookings();
    await loadReviews();        // تحميل التقييمات
    if(_bookingsUnsub){ _bookingsUnsub(); _bookingsUnsub = null; }
    // اشتراك لحظي على الحجوزات لتحديث اللوحة عند وصول حجوزات جديدة
    if(window.db){
      _bookingsUnsub = db.collection("bookings").onSnapshot(async () => {
        cachedBookings = await store.getBookings();
        const active = document.querySelector(".section.active");
        if(active) renderAll();
      }, err => console.warn("bookings snapshot error", err));
    }
    showAdmin();
  } else {
    if(_bookingsUnsub){ _bookingsUnsub(); _bookingsUnsub = null; }
    document.getElementById("admin-view").hidden=true;
    document.getElementById("login-view").style.display="grid";
    document.getElementById("admin-pass").value="";
  }
});

function showAdmin(){
  document.getElementById("login-view").style.display="none";
  document.getElementById("admin-view").hidden=false;
  renderAll();
}

/* ===== التبويبات ===== */
document.querySelectorAll(".nav-item").forEach(item=>{
  item.addEventListener("click",()=>{
    document.querySelectorAll(".nav-item").forEach(n=>n.classList.remove("active"));
    item.classList.add("active");
    const tab=item.dataset.tab;
    document.querySelectorAll(".section").forEach(s=>s.classList.remove("active"));
    document.getElementById("sec-"+tab).classList.add("active");
    const titles={dashboard:"لوحة المعلومات",dates:"التواريخ المحجوزة",units:"بيانات الاستراحات",bookings:"سجل الحجوزات",reviews:"تقييمات الضيوف",settings:"الإعدادات"};
    document.getElementById("page-title").textContent=titles[tab];
  });
});

/* ===== Dashboard ===== */
function renderDashboard(){
  const bookings=cachedBookings;
  const units=store.getUnits();
  const totalRev=bookings.reduce((s,b)=>s+(+b.price||0),0);
  const now=new Date();now.setHours(0,0,0,0);
  const in30=new Date(now);in30.setDate(in30.getDate()+30);
  const occCount = units.reduce((s,u)=>s+u.booked.filter(iso=>{const d=new Date(iso);return d>=now&&d<in30;}).length,0);
  const occPct = Math.min(100, Math.round(occCount/(units.length*30)*100));

  document.getElementById("dash-stats").innerHTML=`
    <div class="stat-card"><div class="sc-top"><span class="sc-label">إجمالي الحجوزات</span><span class="sc-icon"><i class="fa-solid fa-receipt"></i></span></div><div class="sc-val">${bookings.length}</div></div>
    <div class="stat-card"><div class="sc-top"><span class="sc-label">الإيرادات المتوقعة</span><span class="sc-icon"><i class="fa-solid fa-coins"></i></span></div><div class="sc-val">${totalRev.toLocaleString("ar")} <small>درهم</small></div></div>
    <div class="stat-card"><div class="sc-top"><span class="sc-label">الإشغال (30 يوم)</span><span class="sc-icon"><i class="fa-solid fa-chart-line"></i></span></div><div class="sc-val">${occPct}%</div><div class="sc-trend">${units.length} استراحات</div></div>
    <div class="stat-card"><div class="sc-top"><span class="sc-label">استراحات نشطة</span><span class="sc-icon"><i class="fa-solid fa-house"></i></span></div><div class="sc-val">${units.length}</div></div>`;

  const counts = units.map(u=>({name:u.name, n:bookings.filter(b=>b.unitId===u.id).length}));
  const max = Math.max(1,...counts.map(c=>c.n));
  const chartCard=document.querySelector(".chart-card");
  chartCard.querySelector(".chart-x")?.remove();
  document.getElementById("dash-chart").innerHTML = counts.map(c=>`
    <div class="bar" style="height:${(c.n/max*100)}%"><em>${c.n}</em></div>`).join("");
  chartCard.insertAdjacentHTML("beforeend",
    `<div class="chart-x">${counts.map(c=>`<span>${esc(c.name.split(" ")[2]||c.name)}</span>`).join("")}</div>`);

  const recent=bookings.slice(0,5);
  document.getElementById("dash-recent").innerHTML = recent.length?`
    <table class="tbl"><thead><tr><th>الاسم</th><th>الاستراحة</th><th>النوع</th><th>التاريخ</th><th>الجوال</th><th>الحالة</th></tr></thead><tbody>
    ${recent.map(b=>{
      const stay = b.stayType === "day" ? "نهاري" : "مبيت";
      return `<tr><td>${esc(b.name)}</td><td>${esc(b.unitName)}</td><td><small>${stay}</small></td><td>${esc(b.date)}</td><td>${esc(b.phone)}</td><td><span class="tag new">جديد</span></td></tr>`;
    }).join("")}
    </tbody></table>`:`<div class="tbl-empty">لا توجد حجوزات بعد</div>`;
}

/* ===== تقويم الإدارة ===== */
function renderCalTabs(){
  const units=store.getUnits();
  if(!units.length) return;
  if(!calUnitId) calUnitId=units[0].id;
  document.getElementById("cal-unit-tabs").innerHTML=units.map(u=>`
    <button class="cal-tab ${u.id===calUnitId?'active':''}" data-id="${u.id}">${esc(u.name)}</button>`).join("");
  document.querySelectorAll(".cal-tab").forEach(b=>b.addEventListener("click",()=>{calUnitId=b.dataset.id;renderCalTabs();renderAdminCalendar();}));
}
function renderAdminCalendar(){
  const units=store.getUnits();
  const unit=units.find(u=>u.id===calUnitId)||units[0];
  if(!unit) return;
  const y=calDate.getFullYear(), m=calDate.getMonth();
  document.getElementById("cal-month").textContent=`${AR_MONTHS[m]} ${y}`;
  const first=new Date(y,m,1).getDay();
  const days=new Date(y,m+1,0).getDate();
  const today=new Date();today.setHours(0,0,0,0);
  let html=`<div class="admin-cal">${AR_DOW.map(d=>`<div class="dow">${d}</div>`).join("")}`;
  for(let i=0;i<first;i++) html+=`<div class="day empty"></div>`;
  for(let d=1;d<=days;d++){
    const date=new Date(y,m,d);const iso=toISO(date);
    const past=date<today;const booked=unit.booked.includes(iso);
    html+=`<div class="day ${past?'past':''} ${booked?'booked':''}" data-iso="${iso}">${d}</div>`;
  }
  html+=`</div>`;
  document.getElementById("admin-calendar").innerHTML=html;
  document.querySelectorAll(".admin-cal .day:not(.past):not(.empty)").forEach(el=>{
    el.addEventListener("click",async ()=>{
      const units=store.getUnits();const iso=el.dataset.iso;
      const unit=units.find(u=>u.id===calUnitId);
      const i=unit.booked.indexOf(iso);
      if(i>=0){unit.booked.splice(i,1);toast("تم إلغاء تحديد اليوم كمحجوز");}
      else{unit.booked.push(iso);toast("تم تحديد اليوم كمحجوز");}
      await store.setUnits(units);renderAdminCalendar();
    });
  });
}
document.getElementById("cal-prev").addEventListener("click",()=>{calDate=new Date(calDate.getFullYear(),calDate.getMonth()-1,1);renderAdminCalendar();});
document.getElementById("cal-next").addEventListener("click",()=>{calDate=new Date(calDate.getFullYear(),calDate.getMonth()+1,1);renderAdminCalendar();});

/* ===== محرر الاستراحات ===== */
function renderUnitsEditor(){
  const units=store.getUnits();
  document.getElementById("units-editor").innerHTML=units.map(u=>`
    <div class="panel" style="padding:0;overflow:hidden;margin-bottom:1rem">
      <div style="padding:1rem 1.2rem;background:var(--a-surface-2);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.5rem">
        <strong>${esc(u.name)}</strong>
        <button class="a-btn ghost" data-edit="${u.id}"><i class="fa-solid fa-pen"></i> تعديل</button>
      </div>
      <div style="padding:1rem 1.2rem;display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:.6rem;font-size:.85rem;color:var(--a-muted)">
        <div>السعر: <strong style="color:var(--a-text)">${u.price} ${u.currency}</strong></div>
        <div>السعة: <strong style="color:var(--a-text)">${esc(u.capacity)}</strong></div>
        <div>الغرف: <strong style="color:var(--a-text)">${esc(u.beds)}</strong></div>
        <div>محجوزة: <strong style="color:var(--a-text)">${u.booked.length} يوم</strong></div>
      </div>
    </div>`).join("");
  document.querySelectorAll("[data-edit]").forEach(b=>b.addEventListener("click",()=>editUnit(b.dataset.edit)));
}
function editUnit(id){
  const units=store.getUnits();const u=units.find(x=>x.id===id);if(!u)return;
  const wrap=document.createElement("div");
  wrap.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.6);display:grid;place-items:center;z-index:300;padding:1rem";
  wrap.innerHTML=`<div style="background:var(--a-surface);border:1px solid var(--a-line);border-radius:10px;padding:1.6rem;width:min(440px,100%);max-height:90vh;overflow:auto">
    <h3 style="margin-bottom:1rem">تعديل ${esc(u.name)}</h3>
    <div class="a-field"><label>الاسم</label><input id="e-name" value="${esc(u.name)}"/></div>
    <div class="a-field"><label>الوصف</label><input id="e-tag" value="${esc(u.tagline)}"/></div>
    <div class="a-row">
      <div class="a-field"><label>سعر المبيت (درهم)</label><input id="e-price" type="number" min="0" value="${u.price}"/></div>
      <div class="a-field"><label>سعر النهاري (درهم)</label><input id="e-dayprice" type="number" min="0" value="${u.dayPrice||u.price}" placeholder="مثال: 800"/></div>
    </div>
    <div class="a-field"><label>العملة</label><input id="e-curr" value="${esc(u.currency)}"/></div>
    <div class="a-field"><label>السعة</label><input id="e-cap" value="${esc(u.capacity)}"/></div>
    <div class="a-row">
      <div class="a-field"><label>الغرف</label><input id="e-beds" value="${esc(u.beds)}"/></div>
      <div class="a-field"><label>دورات المياه</label><input id="e-baths" value="${esc(u.baths)}"/></div>
    </div>
    <div class="a-field"><label>المميزات (افصل بفاصلة)</label><textarea id="e-feat" rows="2">${esc(u.features.join("، "))}</textarea></div>

    <div class="e-gallery">
      <label>صور الاستراحة</label>
      <div class="e-gallery-grid" id="e-gallery">
        ${(u.images||[]).map((src,i)=>`<div class="e-thumb" data-src="${esc(src)}">
          <img src="${esc(src)}" alt="صورة ${i+1}" loading="lazy"/>
          <button type="button" class="e-thumb-del" data-del="${i}" aria-label="حذف الصورة"><i class="fa-solid fa-xmark"></i></button>
        </div>`).join("")}
      </div>
      <div class="e-upload">
        <input type="file" id="e-img-input" accept="image/*" hidden />
        <button type="button" class="a-btn ghost" id="e-img-pick"><i class="fa-solid fa-cloud-arrow-up"></i> رفع صورة</button>
        <span class="e-upload-progress" id="e-img-progress"></span>
      </div>
    </div>

    <div style="display:flex;gap:.5rem;margin-top:.6rem">
      <button class="a-btn" id="e-save"><i class="fa-solid fa-floppy-disk"></i> حفظ</button>
      <button class="a-btn ghost" id="e-cancel">إلغاء</button>
    </div></div>`;
  document.body.appendChild(wrap);
  wrap.querySelector("#e-cancel").addEventListener("click",()=>wrap.remove());

  // ===== إدارة صور الاستراحة =====
  const galleryEl = wrap.querySelector("#e-gallery");
  galleryEl.addEventListener("click", async (ev)=>{
    const delBtn = ev.target.closest(".e-thumb-del");
    if(!delBtn) return;
    const idx = +delBtn.dataset.del;
    const removedUrl = u.images[idx];
    if(!confirm("حذف هذه الصورة من الاستراحة؟")) return;
    u.images.splice(idx,1);
    await store.setUnits(units);            // حدّث Firestore أولاً
    await store.deleteImage(removedUrl);   // يزيل الإشارة فقط (ImgBB لا يحذف عبر API المجاني)
    toast("تم حذف الصورة من المعرض");
    // أعد فتح النافذة لتعكس الحالة الجديدة
    wrap.remove(); editUnit(id);
  });

  const fileInput = wrap.querySelector("#e-img-input");
  const progressEl = wrap.querySelector("#e-img-progress");
  wrap.querySelector("#e-img-pick").addEventListener("click",()=>fileInput.click());
  fileInput.addEventListener("change", async ()=>{
    const file = fileInput.files && fileInput.files[0];
    if(!file) return;
    progressEl.textContent = "جاري الرفع 0%";
    try{
      const { url } = await store.uploadImage(file, u.id, pct => { progressEl.textContent = `جاري الرفع ${pct}%`; });
      u.images.push(url);
      await store.setUnits(units);
      progressEl.textContent = "";
      toast("تم رفع الصورة");
      wrap.remove(); editUnit(id);
    }catch(e){
      console.error(e);
      progressEl.textContent = "";
      const msg = (e && e.message === "IMGBB_NO_KEY")
        ? "أضِف مفتاح ImgBB من الإعدادات أولاً"
        : "تعذّر رفع الصورة — تحقّق من مفتاح ImgBB والاتصال";
      toast(msg, true);
    }
  });

  wrap.querySelector("#e-save").addEventListener("click",async ()=>{
    u.name=wrap.querySelector("#e-name").value.trim()||u.name;
    u.tagline=wrap.querySelector("#e-tag").value.trim();
    u.price=+wrap.querySelector("#e-price").value||u.price;
    const dpVal = wrap.querySelector("#e-dayprice").value.trim();
    u.dayPrice = dpVal ? +dpVal : u.price;   // افتراضياً يساوي سعر المبيت إن لم يُحدّد
    u.currency=wrap.querySelector("#e-curr").value.trim()||u.currency;
    u.capacity=wrap.querySelector("#e-cap").value.trim();
    u.beds=wrap.querySelector("#e-beds").value.trim();
    u.baths=wrap.querySelector("#e-baths").value.trim();
    u.features=wrap.querySelector("#e-feat").value.split(/[،,]/).map(s=>s.trim()).filter(Boolean);
    await store.setUnits(units);wrap.remove();renderAll();toast("تم حفظ التعديلات");
  });
}

/* ===== سجل الحجوزات ===== */
function renderBookings(filter=""){
  const bookings=cachedBookings.slice();
  const f=filter.trim().toLowerCase();
  const list=f?bookings.filter(b=>(b.name+b.phone+b.unitName).toLowerCase().includes(f)):bookings;
  document.getElementById("bookings-table").innerHTML=list.length?`
    <table class="tbl"><thead><tr><th>الاسم</th><th>الاستراحة</th><th>النوع</th><th>التاريخ</th><th>الجوال</th><th>السعر</th><th>تاريخ الطلب</th><th>إجراءات</th></tr></thead><tbody>
    ${list.map(b=>{
      const stayBadge = b.stayType === "day"
        ? `<span class="tag" style="background:#fef3c7;color:#92400e">نهاري</span>`
        : `<span class="tag" style="background:#dbeafe;color:#1e40af">مبيت</span>`;
      return `<tr>
      <td>${esc(b.name)}${b.notes?`<br><small style="color:var(--a-muted)">${esc(b.notes)}</small>`:""}</td>
      <td>${esc(b.unitName)}</td><td>${stayBadge}</td><td>${esc(b.date)}</td><td>${esc(b.phone)}</td><td>${esc(b.price)} ${esc(b.currency)}</td>
      <td>${new Date(b.createdAt).toLocaleDateString("ar")}</td>
      <td><div class="row-actions">
        <a class="icon-btn" href="https://wa.me/${b.phone.replace(/\D/g,'')}" target="_blank" rel="noopener" title="واتساب"><i class="fa-brands fa-whatsapp"></i></a>
        <button class="icon-btn del" data-del="${b.id}" title="حذف"><i class="fa-solid fa-trash"></i></button>
      </div></td></tr>`;
    }).join("")}
    </tbody></table>`:`<div class="tbl-empty">لا توجد حجوزات${f?" مطابقة":""}</div>`;
  document.querySelectorAll("[data-del]").forEach(b=>b.addEventListener("click",async ()=>{
    const id = b.dataset.del;
    try{
      await store.deleteBooking(id);
      cachedBookings = cachedBookings.filter(x=>x.id!==id);
      renderAll();toast("تم حذف الحجز");
    }catch(e){ toast("تعذّر حذف الحجز",true); }
  }));
}
document.getElementById("bk-search").addEventListener("input",e=>renderBookings(e.target.value));

/* ===== تصدير CSV ===== */
function csvSafe(v){
  let s = String(v==null?"":v);
  if(/^[=+\-@%]/.test(s.trim()) || /[\t\r]/.test(s)) s = "'" + s;
  return s;
}
document.getElementById("export-csv").addEventListener("click",()=>{
  const bk=cachedBookings;
  if(!bk.length){toast("لا توجد حجوزات للتصدير",true);return;}
  const rows=[["ID","الاسم","الاستراحة","التاريخ","الجوال","ملاحظات","السعر","العملة","تاريخ الطلب"]];
  bk.forEach(b=>rows.push([b.id,b.name,b.unitName,b.date,b.phone,b.notes||"",b.price,b.currency,new Date(b.createdAt).toLocaleString()]));
  const csv="\uFEFF"+rows.map(r=>r.map(c=>`"${csvSafe(c).replace(/"/g,'""')}"`).join(",")).join("\n");
  const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);
  a.download="marbella-bookings.csv";a.click();URL.revokeObjectURL(a.href);
  toast("تم تصدير الحجوزات");
});

/* ===== الإعدادات ===== */
function renderSettings(){
  const s=store.getSettings();
  document.getElementById("s-brand").value=s.brandName||"";
  document.getElementById("s-wa").value=s.whatsapp||"";
  document.getElementById("s-phone").value=s.phoneDisplay||"";
  document.getElementById("s-area").value=s.areaName||"";
  document.getElementById("s-ig").value=s.instagram||"";
  document.getElementById("s-tk").value=s.tiktok||"";
  document.getElementById("s-intro").value=s.introMessage||"";
  if(document.getElementById("s-email")) document.getElementById("s-email").value=s.email||"";
  if(document.getElementById("s-bank")) document.getElementById("s-bank").value=s.bankAccount||"";
  if(document.getElementById("s-logo")) document.getElementById("s-logo").value=s.logoPath||"";
  if(document.getElementById("s-imgbb")) document.getElementById("s-imgbb").value=s.imgbbKey||"";
  if(document.getElementById("s-deposit")) document.getElementById("s-deposit").value=s.depositAmount||"";
  if(document.getElementById("s-insurance")) document.getElementById("s-insurance").value=s.insuranceAmount||"";
  if(document.getElementById("s-pledge")) document.getElementById("s-pledge").value=s.pledgeText||"";
}
document.getElementById("settings-form").addEventListener("submit",async e=>{
  e.preventDefault();
  const s=store.getSettings();
  s.brandName=document.getElementById("s-brand").value.trim();
  s.whatsapp=document.getElementById("s-wa").value.trim();
  s.phoneDisplay=document.getElementById("s-phone").value.trim();
  s.areaName=document.getElementById("s-area").value.trim();
  s.instagram=document.getElementById("s-ig").value.trim();
  s.tiktok=document.getElementById("s-tk").value.trim();
  s.introMessage=document.getElementById("s-intro").value.trim();
  if(document.getElementById("s-email")) s.email=document.getElementById("s-email").value.trim();
  if(document.getElementById("s-bank")) s.bankAccount=document.getElementById("s-bank").value.trim();
  if(document.getElementById("s-logo")) s.logoPath=document.getElementById("s-logo").value.trim();
  if(document.getElementById("s-imgbb")) s.imgbbKey=document.getElementById("s-imgbb").value.trim();
  if(document.getElementById("s-deposit")) s.depositAmount=+document.getElementById("s-deposit").value||500;
  if(document.getElementById("s-insurance")) s.insuranceAmount=+document.getElementById("s-insurance").value||0;
  if(document.getElementById("s-pledge")) s.pledgeText=document.getElementById("s-pledge").value.trim();
  await store.setSettings(s);toast("تم حفظ الإعدادات");
});
document.getElementById("pass-form").addEventListener("submit",async e=>{
  e.preventDefault();
  const p1=document.getElementById("new-pass").value;
  const p2=document.getElementById("new-pass2").value;
  if(p1.length<4){toast("كلمة المرور قصيرة جداً",true);return;}
  if(p1!==p2){toast("كلمتا المرور غير متطابقتين",true);return;}
  const user = auth.currentUser;
  if(!user){toast("سجّل الدخول أولاً",true);return;}
  try{
    await user.updatePassword(p1);
    document.getElementById("new-pass").value="";document.getElementById("new-pass2").value="";
    toast("تم تغيير كلمة المرور");
  }catch(ex){
    const code = ex && ex.code ? ex.code : "";
    if(code==="auth/requires-recent-login") toast("سجّل الخروج ثم الدخول مجدداً قبل التغيير",true);
    else toast("تعذّر تغيير كلمة المرور",true);
  }
});
document.getElementById("reset-all").addEventListener("click",async ()=>{
  if(confirm("سيتم حذف كل البيانات وإعادتها للوضع الافتراضي. متابعة؟")){
    try{
      await store.resetAll();
      cachedBookings = [];
      renderAll();toast("تمت إعادة التعيين");
    }catch(e){
      console.error("resetAll failed", e);
      toast("تعذّرت إعادة التعيين، تحقّق من الصلاحيات",true);
    }
  }
});

/* ===== التقييمات ===== */
let cachedReviews = [];
async function loadReviews(){ cachedReviews = await store.getAllReviews(); }

function renderReviews(){
  const list = cachedReviews.slice();
  const wrap = document.getElementById("reviews-table");
  if(!wrap) return;
  const units = store.getUnits();
  const unitName = id => { const u = units.find(x=>x.id===id); return u ? u.name : "—"; };
  wrap.innerHTML = list.length ? `
    <table class="tbl"><thead><tr><th>الاستراحة</th><th>الاسم</th><th>التقييم</th><th>التعليق</th><th>التاريخ</th><th>إجراءات</th></tr></thead><tbody>
    ${list.map(r=>{
      const stars = "★".repeat(r.rating||0) + "☆".repeat(5-(r.rating||0));
      const date = r.createdAt ? new Date(r.createdAt).toLocaleDateString("ar") : "—";
      return `<tr>
        <td>${esc(unitName(r.unitId))}</td>
        <td>${esc(r.name)}</td>
        <td><span class="rev-stars">${stars}</span></td>
        <td class="rev-text-cell">${esc(r.text)}</td>
        <td>${date}</td>
        <td><button class="icon-btn del" data-rev-del="${esc(r.id)}" title="حذف"><i class="fa-solid fa-trash"></i></button></td>
      </tr>`;
    }).join("")}
    </tbody></table>` : `<div class="tbl-empty">لا توجد تقييمات بعد</div>`;

  wrap.querySelectorAll("[data-rev-del]").forEach(b=>b.addEventListener("click", async ()=>{
    if(!confirm("حذف هذا التقييم نهائياً؟")) return;
    try{
      await store.deleteReview(b.dataset.revDel);
      cachedReviews = cachedReviews.filter(x=>x.id!==b.dataset.revDel);
      renderReviews(); toast("تم حذف التقييم");
    }catch(e){ toast("تعذّر حذف التقييم", true); }
  }));
}
document.getElementById("reviews-refresh")?.addEventListener("click", async ()=>{
  await loadReviews(); renderReviews(); toast("تم تحديث التقييمات");
});

/* ===== تشغيل ===== */
async function renderAll(){
  renderDashboard();
  renderCalTabs();
  renderAdminCalendar();
  renderUnitsEditor();
  renderBookings();
  renderReviews();
  renderSettings();
}
