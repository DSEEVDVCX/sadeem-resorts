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
  { name: "خالد الشمري", nameEn: "Khaled Al-Shammari", role: "ضيف", roleEn: "Guest", text: "الموقع هادئ وقريب من كل الخدمات، والتواصل عبر واتساب كان سريعًا.", textEn: "Quiet location close to all services, and WhatsApp communication was fast.", rating: 4 },
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
   === طبقة التخزين: Firebase (Firestore + Auth) ===
   كل البيانات (الإعدادات، الاستراحات، الحجوزات، التقييمات،
   والتفضيلات: الثيم/اللغة/المفضّلة) تُخزَّن في Firebase.
   لا يُستخدم localStorage / sessionStorage نهائياً.
   ============================================================ */

const DEFAULT_SETTINGS = Object.assign({}, SETTINGS);
const DEFAULT_UNITS    = JSON.parse(JSON.stringify(UNITS));


/* أدوات تاريخ مشتركة */
const AR_MONTHS = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
const AR_DOW = ["أحد","إثنين","ثلاثاء","أربعاء","خميس","جمعة","سبت"];
function pad(n){return String(n).padStart(2,"0");}
function toISO(d){return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;}



if(!window.MarbellaStore){
  const _prefs = { lang:null, theme:null, favorites:[] };

  window.MarbellaStore = {
    AR_MONTHS, AR_DOW, pad, toISO,

    /* ===== التفضيلات (الثيم/اللغة/المفضّلة) — مخزّنة في Firestore تحت users/{uid} ===== */
    getLang(){ return _prefs.lang || "ar"; },
    getTheme(){
      if(_prefs.theme) return _prefs.theme;
      try{ return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; }
      catch(e){ return "light"; }
    },
    getFavorites(){ return _prefs.favorites.slice(); },
    isFavorite(id){ return _prefs.favorites.includes(id); },

    async setLang(lang){ _prefs.lang = lang; await this._savePrefs(); },
    toggleTheme(){
      const dark = this.getTheme() !== "dark";
      _prefs.theme = dark ? "dark" : "light";
      this._applyTheme();
      this._savePrefs();
    },
    toggleFavorite(id){
      const i = _prefs.favorites.indexOf(id);
      let add;
      if(i>=0){ _prefs.favorites.splice(i,1); add=false; }
      else { _prefs.favorites.push(id); add=true; }
      this._savePrefs(); // تُحفظ المفضّلة في users/{uid} (تعمل تحت قواعد self-write)
      // ملاحظة: عدّاد الإعجابات (units.likes) يُدار من الأدمن فقط بموجب قواعد الأمان؛
      // لا نُصدر كتابة موعودة بالرفض من جانب الزائر المجهول.
      return add;
    },

    _applyTheme(){
      const dark = this.getTheme()==="dark";
      document.documentElement.classList.toggle("theme-dark", dark);
      const t = document.getElementById("theme-toggle");
      if(t){ const i=t.querySelector("i"); if(i) i.className = dark?"fa-solid fa-sun":"fa-solid fa-moon"; }
    },
    _applyPrefs(){
      this._applyTheme();
      if(typeof window.updateLanguage === "function") window.updateLanguage(this.getLang());
      window.dispatchEvent(new Event("prefsReady"));
    },
    async _savePrefs(){
      try{
        const u = window.auth && window.auth.currentUser;
        if(!u || !window.db) return;
        await db.collection("users").doc(u.uid).set({
          lang: _prefs.lang, theme: _prefs.theme, favorites: _prefs.favorites,
          updatedAt: new Date().toISOString()
        }, { merge:true });
      }catch(e){ /* قواعد الأمان قد تمنع؛ نتجاهل بهدوء */ }
    },

    /* ===== التهيئة ===== */
    async initData(){
      if(!window.db) return;
      try{
        const [setDoc, unitsSnap] = await Promise.all([
          db.collection("settings").doc("main").get(),
          db.collection("units").get()
        ]);
        if(!setDoc.exists){ await db.collection("settings").doc("main").set(DEFAULT_SETTINGS); Object.assign(SETTINGS, DEFAULT_SETTINGS); }
        else { Object.assign(SETTINGS, setDoc.data()); }

        if(unitsSnap.empty){
          for(const u of DEFAULT_UNITS) await db.collection("units").doc(u.id).set(u);
          UNITS.splice(0, UNITS.length, ...JSON.parse(JSON.stringify(DEFAULT_UNITS)));
        } else {
          const fetched = [];
          unitsSnap.forEach(d => fetched.push(d.data()));
          fetched.sort((a,b)=>String(a.id).localeCompare(String(b.id)));
          UNITS.splice(0, UNITS.length, ...fetched);
        }
      }catch(e){ console.error("Firebase fetch error:", e.code, e.message, e); }
    },
    _initAuth(){
      return new Promise(resolve => {
        if(!window.auth){ this._applyPrefs(); return resolve(); }
        let done = false;
        const finish = () => { if(!done){ done=true; try{this._applyPrefs();}catch(e){} resolve(); } };
        auth.onAuthStateChanged(async (user) => {
          if(user){
            await this._loadPrefs(user.uid);
            try{ this._applyPrefs(); }catch(e){} // أعد التطبيق دائماً حتى لو انتهى المهلة الزمنية مسبقاً
            finish();
          }
          else { try{ await auth.signInAnonymously(); }catch(e){ finish(); } }
        });
        // أمان: لا نعلّق الصفحة إلى الأبد إن تعذّرت المصادنة
        setTimeout(finish, 4000);
      });
    },
    async _loadPrefs(uid){
      try{
        const ref = db.collection("users").doc(uid);
        const d = await ref.get();
        if(d.exists){
          const data = d.data();
          _prefs.lang = data.lang || "ar";
          _prefs.theme = data.theme || null;
          _prefs.favorites = Array.isArray(data.favorites) ? data.favorites : [];
        } else {
          await ref.set({ lang:"ar", theme:null, favorites:[], createdAt:new Date().toISOString() });
        }
      }catch(e){ console.warn("prefs load failed", e); }
    },
    async initFirebaseData(){
      // المصادقة أولاً ثم جلب/زرع البيانات
      await this._initAuth();
      await this.initData();
    },

    /* ===== الإعدادات ===== */
    getSettings(){ return Object.assign({}, SETTINGS); },
    async setSettings(s){
      Object.assign(SETTINGS, s);
      if(window.db) await db.collection("settings").doc("main").set(s);
    },

    /* ===== الاستراحات ===== */
    getUnits(){ return JSON.parse(JSON.stringify(UNITS)); },
    async setUnits(arr){
      UNITS.splice(0, UNITS.length, ...JSON.parse(JSON.stringify(arr)));
      if(!window.db) return;
      const batch = db.batch();
      arr.forEach(u => batch.set(db.collection("units").doc(u.id), u));
      await batch.commit();
    },

    /* ===== الحجوزات ===== */
    async getBookings(){
      if(!window.db) return [];
      try{
        const snap = await db.collection("bookings").get();
        const bks = [];
        snap.forEach(d => { const data = d.data(); data.id = d.id; bks.push(data); });
        bks.sort((a,b)=> String(b.createdAt||"").localeCompare(String(a.createdAt||"")));
        return bks;
      }catch(e){ console.error("getBookings failed", e); return []; }
    },
    async addBooking(b){
      if(!window.db) return;
      b.createdAt = new Date().toISOString();
      await db.collection("bookings").add(b);
    },
    async deleteBooking(id){
      if(!window.db) return;
      await db.collection("bookings").doc(id).delete();
    },

    /* ===== التقييمات ===== */
    async getReviews(unitId){
      if(!window.db) return [];
      const snap = await db.collection("reviews").where("unitId","==",unitId).get();
      const rs = [];
      snap.forEach(d => rs.push(d.data()));
      return rs;
    },
    async addReview(unitId, review){
      if(!window.db) return;
      review.unitId = unitId;
      review.createdAt = new Date().toISOString();
      await db.collection("reviews").add(review);
    },

    /* ===== إعادة التعيين الكامل (لوحة التحكم) ===== */
    async resetAll(){
      if(!window.db) return;
      // الإعدادات والاستراحات (إعادة زرع الافتراضي)
      await db.collection("settings").doc("main").set(DEFAULT_SETTINGS);
      Object.assign(SETTINGS, DEFAULT_SETTINGS);
      const unitBatch = db.batch();
      DEFAULT_UNITS.forEach(u => unitBatch.set(db.collection("units").doc(u.id), JSON.parse(JSON.stringify(u))));
      await unitBatch.commit();
      UNITS.splice(0, UNITS.length, ...JSON.parse(JSON.stringify(DEFAULT_UNITS)));
      // حذف الحجوزات على دفعات (حد 500 عملية لكل batch) — يُعاد رمي الخطأ ليُعالَج في الواجهة
      let snap = await db.collection("bookings").limit(450).get();
      while(!snap.empty){
        const b = db.batch();
        snap.forEach(d => b.delete(d.ref));
        await b.commit();
        snap = await db.collection("bookings").limit(450).get();
      }
    }
  };
}
