/* ============================================================
   لوحة تحكم منتجعات ماربيلا — منطق كامل
   مصادقة SHA-256 + CRUD + رسوم CSS + تصدير CSV
   ملاحظة: AR_MONTHS/AR_DOW/pad/toISO من data.js عبر store (مصدر مشترك)
   ============================================================ */

const store = window.MarbellaStore;
// AR_MONTHS/AR_DOW/pad/toISO مُعرّفة عامة في data.js ومتاحة مباشرة هنا
let calUnitId = null, calDate = new Date();

/* ===== أدوات ===== */
function toast(msg,isErr){
  let t=document.querySelector(".a-toast");
  if(!t){t=document.createElement("div");document.body.appendChild(t);}
  t.className="a-toast"+(isErr?" err":"");t.textContent=msg;
  clearTimeout(t._tm);t._tm=setTimeout(()=>t.remove(),3000);
}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}

/* ===== المصادقة =====
   رمز الجلسة مُشتق من كلمة المرور (أول 16 حرفاً من هاشها) لا قيمة ثابتة،
   فلا يكفي ضبط قيمة في sessionStorage لتجاوز البوابة. (حماية من جانب العميل فقط.) */
const SESSION_KEY = "marbella_admin_session";
async function sessionToken(pass){ return (await store.sha256(pass)).slice(0,16); }
async function login(pass){
  const hash = await store.sha256(pass);
  if(hash === store.getPass()){
    sessionStorage.setItem(SESSION_KEY, hash.slice(0,16));
    return true;
  }
  return false;
}
// التحقق من الجلسة القائمة بمطابقة الرمز المخزّن لكلمة المرور الحالية
async function verifySession(){
  const stored = sessionStorage.getItem(SESSION_KEY);
  if(!stored) return false;
  const cur = store.getPass();
  return !!(cur && stored === cur.slice(0,16));
}
let sessionOk = false;

document.getElementById("login-form").addEventListener("submit",async e=>{
  e.preventDefault();
  const pass=document.getElementById("admin-pass").value;
  const err=document.getElementById("login-error");
  const info=document.getElementById("login-info");
  err.textContent=""; info.textContent="";
  if(await login(pass)){
    sessionOk=true;
    showAdmin();
  } else {
    err.textContent="كلمة المرور غير صحيحة";
    document.getElementById("admin-pass").value="";
  }
});
// إعادة تعيين كلمة المرور إلى الافتراضية (admin123)
document.getElementById("reset-pass-link").addEventListener("click",()=>{
  store.resetPassword();
  sessionStorage.removeItem(SESSION_KEY);
  document.getElementById("login-error").textContent="";
  document.getElementById("login-info").textContent="تمت إعادة التعيين. استخدم: admin123";
  document.getElementById("admin-pass").value="";
  document.getElementById("admin-pass").focus();
});
document.getElementById("logout-btn").addEventListener("click",()=>{
  sessionOk=false;sessionStorage.removeItem(SESSION_KEY);
  document.getElementById("admin-view").hidden=true;
  document.getElementById("login-view").style.display="grid";
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
    const titles={dashboard:"لوحة المعلومات",dates:"التواريخ المحجوزة",units:"بيانات الاستراحات",bookings:"سجل الحجوزات",settings:"الإعدادات"};
    document.getElementById("page-title").textContent=titles[tab];
  });
});

/* ===== Dashboard ===== */
function renderDashboard(){
  const bookings=store.getBookings();
  const units=store.getUnits();
  const totalRev=bookings.reduce((s,b)=>s+(+b.price||0),0);
  // الإشغال: تواريخ محجوزة ضمن الثلاثين يوماً القادمة (مع سقف 100%)
  const now=new Date();now.setHours(0,0,0,0);
  const in30=new Date(now);in30.setDate(in30.getDate()+30);
  const occCount = units.reduce((s,u)=>s+u.booked.filter(iso=>{const d=new Date(iso);return d>=now&&d<in30;}).length,0);
  const occPct = Math.min(100, Math.round(occCount/(units.length*30)*100));

  document.getElementById("dash-stats").innerHTML=`
    <div class="stat-card"><div class="sc-top"><span class="sc-label">إجمالي الحجوزات</span><span class="sc-icon"><i class="fa-solid fa-receipt"></i></span></div><div class="sc-val">${bookings.length}</div></div>
    <div class="stat-card"><div class="sc-top"><span class="sc-label">الإيرادات المتوقعة</span><span class="sc-icon"><i class="fa-solid fa-coins"></i></span></div><div class="sc-val">${totalRev.toLocaleString("ar")} <small>درهم</small></div></div>
    <div class="stat-card"><div class="sc-top"><span class="sc-label">الإشغال (30 يوم)</span><span class="sc-icon"><i class="fa-solid fa-chart-line"></i></span></div><div class="sc-val">${occPct}%</div><div class="sc-trend">${units.length} استراحات</div></div>
    <div class="stat-card"><div class="sc-top"><span class="sc-label">استراحات نشطة</span><span class="sc-icon"><i class="fa-solid fa-house"></i></span></div><div class="sc-val">${units.length}</div></div>`;

  // رسم بياني
  const counts = units.map(u=>({name:u.name, n:bookings.filter(b=>b.unitId===u.id).length}));
  const max = Math.max(1,...counts.map(c=>c.n));
  const chartCard=document.querySelector(".chart-card");
  chartCard.querySelector(".chart-x")?.remove(); // تفادي تراكم محاور سابقة
  document.getElementById("dash-chart").innerHTML = counts.map(c=>`
    <div class="bar" style="height:${(c.n/max*100)}%"><em>${c.n}</em></div>`).join("");
  chartCard.insertAdjacentHTML("beforeend",
    `<div class="chart-x">${counts.map(c=>`<span>${c.name.split(" ")[2]||c.name}</span>`).join("")}</div>`);

  // أحدث الحجوزات
  const recent=[...bookings].slice(-5).reverse();
  document.getElementById("dash-recent").innerHTML = recent.length?`
    <table class="tbl"><thead><tr><th>الاسم</th><th>الاستراحة</th><th>التاريخ</th><th>الجوال</th><th>الحالة</th></tr></thead><tbody>
    ${recent.map(b=>`<tr><td>${esc(b.name)}</td><td>${esc(b.unitName)}</td><td>${b.date}</td><td>${esc(b.phone)}</td><td><span class="tag new">جديد</span></td></tr>`).join("")}
    </tbody></table>`:`<div class="tbl-empty">لا توجد حجوزات بعد</div>`;
}

/* ===== تقويم الإدارة ===== */
function renderCalTabs(){
  const units=store.getUnits();
  if(!calUnitId) calUnitId=units[0].id;
  document.getElementById("cal-unit-tabs").innerHTML=units.map(u=>`
    <button class="cal-tab ${u.id===calUnitId?'active':''}" data-id="${u.id}">${esc(u.name)}</button>`).join("");
  document.querySelectorAll(".cal-tab").forEach(b=>b.addEventListener("click",()=>{calUnitId=b.dataset.id;renderCalTabs();renderAdminCalendar();}));
}
function renderAdminCalendar(){
  const units=store.getUnits();
  const unit=units.find(u=>u.id===calUnitId)||units[0];
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
    el.addEventListener("click",()=>{
      const units=store.getUnits();const iso=el.dataset.iso;
      const unit=units.find(u=>u.id===calUnitId);
      const i=unit.booked.indexOf(iso);
      if(i>=0){unit.booked.splice(i,1);toast("تم إلغاء تحديد اليوم كمحجوز");}
      else{unit.booked.push(iso);toast("تم تحديد اليوم كمحجوز");}
      store.setUnits(units);renderAdminCalendar();
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
      <div class="a-field"><label>السعر</label><input id="e-price" type="number" value="${u.price}"/></div>
      <div class="a-field"><label>العملة</label><input id="e-curr" value="${esc(u.currency)}"/></div>
    </div>
    <div class="a-field"><label>السعة</label><input id="e-cap" value="${esc(u.capacity)}"/></div>
    <div class="a-row">
      <div class="a-field"><label>الغرف</label><input id="e-beds" value="${esc(u.beds)}"/></div>
      <div class="a-field"><label>دورات المياه</label><input id="e-baths" value="${esc(u.baths)}"/></div>
    </div>
    <div class="a-field"><label>المميزات (افصل بفاصلة)</label><textarea id="e-feat" rows="2">${esc(u.features.join("، "))}</textarea></div>
    <div style="display:flex;gap:.5rem;margin-top:.6rem">
      <button class="a-btn" id="e-save"><i class="fa-solid fa-floppy-disk"></i> حفظ</button>
      <button class="a-btn ghost" id="e-cancel">إلغاء</button>
    </div></div>`;
  document.body.appendChild(wrap);
  wrap.querySelector("#e-cancel").addEventListener("click",()=>wrap.remove());
  wrap.querySelector("#e-save").addEventListener("click",()=>{
    u.name=wrap.querySelector("#e-name").value.trim()||u.name;
    u.tagline=wrap.querySelector("#e-tag").value.trim();
    u.price=+wrap.querySelector("#e-price").value||u.price;
    u.currency=wrap.querySelector("#e-curr").value.trim()||u.currency;
    u.capacity=wrap.querySelector("#e-cap").value.trim();
    u.beds=wrap.querySelector("#e-beds").value.trim();
    u.baths=wrap.querySelector("#e-baths").value.trim();
    u.features=wrap.querySelector("#e-feat").value.split(/[،,]/).map(s=>s.trim()).filter(Boolean);
    store.setUnits(units);wrap.remove();renderAll();toast("تم حفظ التعديلات");
  });
}

/* ===== سجل الحجوزات ===== */
function renderBookings(filter=""){
  const bookings=store.getBookings().slice().reverse();
  const f=filter.trim().toLowerCase();
  const list=f?bookings.filter(b=>(b.name+b.phone+b.unitName).toLowerCase().includes(f)):bookings;
  document.getElementById("bookings-table").innerHTML=list.length?`
    <table class="tbl"><thead><tr><th>الاسم</th><th>الاستراحة</th><th>التاريخ</th><th>الجوال</th><th>السعر</th><th>تاريخ الطلب</th><th>إجراءات</th></tr></thead><tbody>
    ${list.map(b=>`<tr>
      <td>${esc(b.name)}${b.notes?`<br><small style="color:var(--a-muted)">${esc(b.notes)}</small>`:""}</td>
      <td>${esc(b.unitName)}</td><td>${b.date}</td><td>${esc(b.phone)}</td><td>${b.price} ${esc(b.currency)}</td>
      <td>${new Date(b.createdAt).toLocaleDateString("ar")}</td>
      <td><div class="row-actions">
        <a class="icon-btn" href="https://wa.me/${b.phone.replace(/\D/g,'')}" target="_blank" rel="noopener" title="واتساب"><i class="fa-brands fa-whatsapp"></i></a>
        <button class="icon-btn del" data-del="${b.id}" title="حذف"><i class="fa-solid fa-trash"></i></button>
      </div></td></tr>`).join("")}
    </tbody></table>`:`<div class="tbl-empty">لا توجد حجوزات${f?" مطابقة":""}</div>`;
  document.querySelectorAll("[data-del]").forEach(b=>b.addEventListener("click",()=>{
    const all=store.getBookings().filter(x=>x.id!==b.dataset.del);store.setBookings(all);renderAll();toast("تم حذف الحجز");
  }));
}
document.getElementById("bk-search").addEventListener("input",e=>renderBookings(e.target.value));

/* ===== تصدير CSV ===== */
// تحييد خلايا الصيغ: إضافة فاصلة علوية للقيم التي تبدأ بـ = + - @ % أو تحتوي TAB/CR
function csvSafe(v){
  let s = String(v==null?"":v);
  if(/^[=+\-@%]/.test(s.trim()) || /[\t\r]/.test(s)) s = "'" + s;
  return s;
}
document.getElementById("export-csv").addEventListener("click",()=>{
  const bk=store.getBookings();
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
}
document.getElementById("settings-form").addEventListener("submit",e=>{
  e.preventDefault();
  const s=store.getSettings();
  s.brandName=document.getElementById("s-brand").value.trim();
  s.whatsapp=document.getElementById("s-wa").value.trim();
  s.phoneDisplay=document.getElementById("s-phone").value.trim();
  s.areaName=document.getElementById("s-area").value.trim();
  s.instagram=document.getElementById("s-ig").value.trim();
  s.tiktok=document.getElementById("s-tk").value.trim();
  s.introMessage=document.getElementById("s-intro").value.trim();
  store.setSettings(s);toast("تم حفظ الإعدادات");
});
document.getElementById("pass-form").addEventListener("submit",async e=>{
  e.preventDefault();
  const p1=document.getElementById("new-pass").value;
  const p2=document.getElementById("new-pass2").value;
  if(p1.length<4){toast("كلمة المرور قصيرة جداً",true);return;}
  if(p1!==p2){toast("كلمتا المرور غير متطابقتين",true);return;}
  store.setPass(await store.sha256(p1));
  document.getElementById("new-pass").value="";document.getElementById("new-pass2").value="";
  toast("تم تغيير كلمة المرور");
});
document.getElementById("reset-all").addEventListener("click",()=>{
  if(confirm("سيتم حذف كل البيانات وإعادتها للوضع الافتراضي. متابعة؟")){
    store.resetAll();renderAll();toast("تمت إعادة التعيين");
  }
});

/* ===== تشغيل ===== */
function renderAll(){
  renderDashboard();
  renderCalTabs();
  renderAdminCalendar();
  renderUnitsEditor();
  renderBookings();
  renderSettings();
}
// استئناف الجلسة إن كانت قائمة وصحيحة
verifySession().then(ok => { if(ok){ sessionOk = true; showAdmin(); } });
