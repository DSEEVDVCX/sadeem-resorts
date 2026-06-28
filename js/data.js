/* ============================================================
   بيانات منتجعات ماربيلا — عدّل القيم هنا فقط
   ============================================================ */

const SETTINGS = {
  brandName: "منتجعات ماربيلا",
  brandNameEn: "Marbella Resorts",
  // رقم واتساب بدون + أو مسافات (الصيغة الدولية)
  whatsapp: "971566222566",
  phoneDisplay: "+971 56 622 2566",
  instagram: "https://www.instagram.com/resortsadeem",
  tiktok: "https://www.tiktok.com/@resortsadeem",
  // المنطقة العامة
  areaName: "الظاهرة / الملاليح - أبو ظبي",
  areaNameEn: "Al Dhahirah / Al Malaleeh - Abu Dhabi",
  // رسالة ترحيب تظهر في الطلب المُرسل للواتساب
  introMessage: "مرحباً، أرغب في حجز استراحة:",
};

/* ============================================================
   بيانات الاستراحات الثلاث
   - عدّل الأسماء والأسعار والوصف والإحداثيات حسب الحاجة
   ============================================================ */
const UNITS = [
  {
    id: "estrha1",
    section: "families",
    likes: 142,
    name: "استراحة ماربيلا 1 (عائلات)",
    nameEn: "Marbella Resort 1 (Families)",
    tagline: "المكان المثالي لجمعتك العائلية القادمة",
    taglineEn: "The perfect place for your next family gathering",
    price: 1500,
    currency: "درهم",
    currencyEn: "AED",
    capacity: "تسع حتى 30 شخص",
    capacityEn: "Up to 30 guests",
    roomsNum: 4,
    bathsNum: 4,
    poolsNum: 1,
    beds: "4 غرف نوم", // Fallback text
    baths: "4 دورات مياه", // Fallback text
    features: ["مسبح خاص بعمق تدريجي", "صالة أرضية بشاشة كبيرة", "3 جلسات خارجية", "ألعاب أطفال", "محطة شواء", "مطبخ خارجي"],
    featuresEn: ["Gradual depth private pool", "Ground lounge with large screen", "3 Outdoor seatings", "Kids play area", "BBQ station", "Outdoor kitchen"],
    pdfLink: "https://base44.app/api/apps/6a3fdaede4075caea82fe777/files/mp/public/6a3fdaede4075caea82fe777/6b785e7e4_WhatsAppImage2026-06-27at33910PM.pdf",
    images: ["assets/images/estrha1/photo_1.jpeg", "assets/images/estrha1/photo_10.jpeg", "assets/images/estrha1/photo_11.jpeg", "assets/images/estrha1/photo_12.jpeg", "assets/images/estrha1/photo_13.jpeg", "assets/images/estrha1/photo_14.jpeg", "assets/images/estrha1/photo_15.jpeg", "assets/images/estrha1/photo_16.jpeg", "assets/images/estrha1/photo_17.jpeg", "assets/images/estrha1/photo_18.jpeg", "assets/images/estrha1/photo_2.jpeg", "assets/images/estrha1/photo_3.jpeg", "assets/images/estrha1/photo_4.jpeg", "assets/images/estrha1/photo_5.jpeg", "assets/images/estrha1/photo_6.jpeg"],
    lat: 23.9785,
    lng: 55.5288,
    booked: []
  },
  {
    id: "estrha2",
    section: "singles",
    likes: 85,
    name: "استراحة ماربيلا 2 (عزاب/عائلات)",
    nameEn: "Marbella Resort 2 (Singles/Families)",
    tagline: "هدوء وفخامة مع خصوصية تامة",
    taglineEn: "Quietness and luxury with total privacy",
    price: 1200,
    currency: "درهم",
    currencyEn: "AED",
    capacity: "تسع حتى 30 شخص",
    capacityEn: "Up to 30 guests",
    roomsNum: 2,
    bathsNum: 2,
    poolsNum: 1,
    beds: "2 غرف نوم",
    baths: "2 دورات مياه",
    features: ["مسبح خاص 150سم", "صالة كبيرة", "جلستين خارجية", "محطة شواء", "مجلس رجال منعزل", "ألعاب أطفال"],
    featuresEn: ["Private pool 150cm", "Large hall", "2 Outdoor seatings", "BBQ station", "Isolated men's majlis", "Kids play area"],
    pdfLink: "https://drive.google.com/drive/folders/1XGbqGVhPrzB7uBY5d93ROmEhyJAm2HfQ?usp=drive_link",
    images: ["assets/images/estrha2/photo_1.jpeg", "assets/images/estrha2/photo_10.jpeg", "assets/images/estrha2/photo_11.jpeg", "assets/images/estrha2/photo_12.jpeg", "assets/images/estrha2/photo_13.jpeg", "assets/images/estrha2/photo_14.jpeg", "assets/images/estrha2/photo_15.jpeg", "assets/images/estrha2/photo_2.jpeg", "assets/images/estrha2/photo_3.jpeg", "assets/images/estrha2/photo_4.jpeg", "assets/images/estrha2/photo_5.jpeg", "assets/images/estrha2/photo_6.jpeg", "assets/images/estrha2/photo_7.jpeg", "assets/images/estrha2/photo_8.jpeg", "assets/images/estrha2/photo_9.jpeg"],
    lat: 23.9790,
    lng: 55.5295,
    booked: []
  },
  {
    id: "estrha3",
    section: "singles",
    likes: 110,
    name: "استراحة ماربيلا 3",
    nameEn: "Marbella Resort 3",
    tagline: "تجربة راقية بأسعار تنافسية",
    taglineEn: "An upscale experience at competitive prices",
    price: 1200,
    currency: "درهم",
    currencyEn: "AED",
    capacity: "تسع حتى 25 شخص",
    capacityEn: "Up to 25 guests",
    roomsNum: 2,
    bathsNum: 2,
    poolsNum: 1,
    beds: "2 غرف نوم",
    baths: "2 دورات مياه",
    features: ["مسبح خاص 150سم", "صالة كبيرة", "جلستين خارجية", "محطة شواء", "مجلس رجال منعزل", "ألعاب أطفال"],
    featuresEn: ["Private pool 150cm", "Large hall", "2 Outdoor seatings", "BBQ station", "Isolated men's majlis", "Kids play area"],
    pdfLink: "https://drive.google.com/drive/folders/14ehvxJTvq17gQlgoNx0E3NCaJ1PRRdmi?usp=drive_link",
    images: ["assets/images/estrha1/photo_1.jpeg", "assets/images/estrha2/photo_2.jpeg"],
    lat: 23.9780,
    lng: 55.5280,
    booked: []
  }
];

/* ============================================================
   العروض (للعدّاد التنازلي في الصفحة الرئيسية)
   ضع تاريخ انتهاء العرض بصيغة YYYY-MM-DD
   ============================================================ */
const OFFERS = {
  target: "2026-07-15",
  label: "عرض الصيف — خصم خاص على الحجوزات المبكرة",
  labelEn: "Summer Offer — Special Discount on Early Bookings"
};

const TESTIMONIALS = [
  { name: "أبو محمد", nameEn: "Abu Mohammed", role: "ضيف دائم", roleEn: "Regular Guest", text: "استراحة نظيفة وخصوصية تامة، كرّرنا الحجز مرتين والخدمة ممتازة.", textEn: "Clean resort, total privacy. We booked twice, excellent service.", rating: 5 },
  { name: "عائلة العتيبي", nameEn: "Al Otaibi Family", role: "ضيف", roleEn: "Guest", text: "المسبح خاص وكان مناسبًا للأطفال، والمجلس فاخر. تجربة عائلية ممتازة.", textEn: "Private pool was great for kids, and the lounge is luxurious. Excellent family experience.", rating: 5 },
  { name: "خالد الشمري", role: "ضيف", text: "الموقع هادئ وقريب من كل الخدمات، والتواصل عبر واتساب كان سريعًا.", rating: 4 },
];

/* ============================================================
   الأسئلة الشائعة (تُعرض في صفحة faq.html ديناميكياً)
   ============================================================ */
const FAQ = [
  { cat: "الحجز والإلغاء", q: "كيف أحجز استراحة؟", a: "اختر الاستراحة والتاريخ من التقويم في الصفحة الرئيسية، ثم اضغط «احجز الآن» وأرسل الطلب عبر واتساب ليتم تأكيده فوراً." },
  { cat: "الحجز والإلغاء", q: "هل يمكنني إلغاء الحجز؟", a: "نعم، راجع صفحة سياسة الإلغاء لمعرفة نسب الاسترداد حسب توقيت الإلغاء." },
  { cat: "الأسعار والدفع", q: "هل السعر يشمل كل المرافق؟", a: "نعم، السعر المعروض يشمل المسبح والمجالس والمطبخ والواي فاي. أي طلبات إضافية تُناقش مباشرة وقت الحجز." },
  { cat: "الأسعار والدفع", q: "ما هي طرق الدفع؟", a: "يتم الدفع نقداً أو عبر التحويل عند استلام الاستراحة. تفاصيل الدفع تُرسل عبر واتساب عند تأكيد الحجز." },
  { cat: "المرافق والخدمات", q: "هل يوجد مسبح خاص لكل استراحة؟", a: "نعم، كل استراحة لها مسبح خاص بها بالكامل مع منطقة جلوس خارجية." },
  { cat: "المرافق والخدمات", q: "هل يوجد واي فاي وموقف سيارات؟", a: "نعم، جميع الاستراحات مجهزة بالواي فاي وموقف سيارات خاص." },
  { cat: "القوانين", q: "هل يُسمح بالتجمعات الكبيرة؟", a: "يُرجى الالتزام بسعة كل استراحة المحددة. أي زيادة يجب التنسيق عليها مسبقاً عبر واتساب." },
  { cat: "القوانين", q: "ما هي مواعيد تسليم واستلام الاستراحة؟", a: "التسليم عادة ظهراً والاستلام صباح اليوم التالي. يمكن التنسيق على ساعات مرنة عبر واتساب." },
];

/* ============================================================
   ملاحظة حول التواريخ المحجوزة:
   عند تأكيد حجز عبر واتساب، أضف التاريخ داخل قائمة "booked"
   للإستراحة المعنية بهذا الشكل:  "2026-07-05"
   مثال:
   booked: ["2026-07-05", "2026-07-12"]

   === طبقة التخزين (localStorage) ===
   عند أول تشغيل تُنسخ الإعدادات والاستراحات إلى localStorage،
   بعدها تُقرأ منه دائماً (تتيح للوحة التحكم تعديلها دون لمس الكود).
   ============================================================ */

const KEYS = {
  settings:  "sadeem_settings",
  units:     "sadeem_units",
  bookings:  "sadeem_bookings",
  pass:      "sadeem_admin_pass",
  schema:    "sadeem_schema_v",
  favorites: "sadeem_favorites",
  reviews:   "sadeem_reviews"
};
const SCHEMA_VERSION = 5; // bump عند تغيير بنية البيانات لإعادة زرع الافتراضي

const DEFAULT_SETTINGS = Object.assign({}, SETTINGS);
const DEFAULT_UNITS    = JSON.parse(JSON.stringify(UNITS));
// SHA-256 الفعلي لـ "admin123" — يُغيَّر من داخل لوحة التحكم
const DEFAULT_PASS_HASH = "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9";

function loadJSON(key, fallback){
  try {
    const raw = localStorage.getItem(key);
    if(!raw) return fallback;
    return JSON.parse(raw);
  } catch(e){ return fallback; }
}
function saveJSON(key, value){
  try { localStorage.setItem(key, JSON.stringify(value)); }
  catch(e){ /* قد يكون التخزين ممتلئاً */ }
}

// ترحيل/إعادة زرع: عند تغيّر نسخة المخطط يُعاد زرع الافتراضي لتفادي البيانات العتيقة
const storedSchema = parseInt(localStorage.getItem(KEYS.schema),10);
if(!storedSchema || storedSchema < SCHEMA_VERSION){
  saveJSON(KEYS.settings, DEFAULT_SETTINGS);
  saveJSON(KEYS.units, DEFAULT_UNITS);
  if(!localStorage.getItem(KEYS.bookings)) saveJSON(KEYS.bookings, []);
  localStorage.setItem(KEYS.pass, DEFAULT_PASS_HASH);
  localStorage.setItem(KEYS.schema, String(SCHEMA_VERSION));
}
// تعافٍ ذاتي: إذا كان الهاش المخزّن هو الهاش القديم الخاطئ، استبدله بالصحيح
const LEGACY_WRONG_HASH = "240be518fabd2724ddb6f04eeb1c68a6b9a4d4b4b5d2b5d2b5d2b5d2b5d2b5d2";
if(localStorage.getItem(KEYS.pass) === LEGACY_WRONG_HASH){
  localStorage.setItem(KEYS.pass, DEFAULT_PASS_HASH);
}

// قراءة البيانات الفعلية من التخزين (تُستبدل الثوابت الأصلية)
Object.assign(SETTINGS, loadJSON(KEYS.settings, DEFAULT_SETTINGS));
UNITS.splice(0, UNITS.length, ...loadJSON(KEYS.units, DEFAULT_UNITS).map(u=>Object.assign({},u)));

/* أدوات تاريخ مشتركة (مصدر واحد لكلا السكربتين) */
const AR_MONTHS = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
const AR_DOW = ["أحد","إثنين","ثلاثاء","أربعاء","خميس","جمعة","سبت"];
function pad(n){return String(n).padStart(2,"0");}
function toISO(d){return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;}

async function sha256(text){
  const buf = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,"0")).join("");
}

// إتاحة الدوال للوحة التحكم
if(!window.MarbellaStore){
  window.MarbellaStore = {
    KEYS, AR_MONTHS, AR_DOW, pad, toISO, loadJSON, saveJSON, sha256,
    getSettings(){ return loadJSON(KEYS.settings, DEFAULT_SETTINGS); },
    setSettings(s){ saveJSON(KEYS.settings, s); Object.assign(SETTINGS, s); },
    getUnits(){ return loadJSON(KEYS.units, DEFAULT_UNITS); },
    setUnits(arr){ saveJSON(KEYS.units, arr); UNITS.splice(0,UNITS.length,...arr.map(u=>Object.assign({},u))); },
    getBookings(){ return loadJSON(KEYS.bookings, []); },
    setBookings(arr){ saveJSON(KEYS.bookings, arr); },
    addBooking(b){ const all=this.getBookings(); all.push(b); this.setBookings(all); },
    /** ربط تاريخ محجوز بالوحدة (يمنع الحجز المزدوج على التقويم العام) */
    markBooked(unitId, iso){
      const units = this.getUnits();
      const u = units.find(x=>x.id===unitId);
      if(u && !u.booked.includes(iso)){ u.booked.push(iso); this.setUnits(units); }
    },
    getPass(){ return localStorage.getItem(KEYS.pass); },
    setPass(hash){ localStorage.setItem(KEYS.pass, hash); },
    /** إعادة تعيين كلمة المرور إلى الافتراضية (admin123) — تُستخدم من شاشة الدخول */
    resetPassword(){ localStorage.setItem(KEYS.pass, DEFAULT_PASS_HASH); },
    /* ===== المفضّلة ===== */
    getFavorites(){ return loadJSON(KEYS.favorites, []); },
    isFavorite(id){ return this.getFavorites().includes(id); },
    toggleFavorite(id){
      const f = this.getFavorites();
      const i = f.indexOf(id);
      if(i>=0) f.splice(i,1); else f.push(id);
      saveJSON(KEYS.favorites, f);
    },
    /* ===== التقييمات/المراجعات ===== */
    getReviews(unitId){ const all = loadJSON(KEYS.reviews, {}); return all[unitId] || []; },
    addReview(unitId, review){
      const all = loadJSON(KEYS.reviews, {});
      (all[unitId] = all[unitId] || []).push(Object.assign({at:new Date().toISOString()}, review));
      saveJSON(KEYS.reviews, all);
    },
    avgRating(unitId){
      const rs = this.getReviews(unitId);
      if(!rs.length) return null;
      return (rs.reduce((s,r)=>s+(+r.rating||0),0)/rs.length);
    },
    resetAll(){
      saveJSON(KEYS.settings, DEFAULT_SETTINGS);
      saveJSON(KEYS.units, DEFAULT_UNITS);
      saveJSON(KEYS.bookings, []);
      localStorage.setItem(KEYS.pass, DEFAULT_PASS_HASH);
      localStorage.setItem(KEYS.schema, String(SCHEMA_VERSION));
      Object.assign(SETTINGS, DEFAULT_SETTINGS);
      UNITS.splice(0,UNITS.length,...DEFAULT_UNITS.map(u=>Object.assign({},u)));
    }
  };
}
