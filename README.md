# منتجعات ماربيلا — نظام الحجز الإلكتروني

نظام حجز لاستراحات/شاليهات متعددة، يعمل على الجوال والحاسوب. جميع البيانات والتفضيلات مخزّنة في **Firebase** (Firestore + Authentication) — لا يُستخدم `localStorage`/`sessionStorage` أو كاش PWA نهائياً.

## المزايا
- معرض صور لكل استراحة
- موقع على خرائط جوجل
- تقويم تفاعلي يعرض المواعيد المتاحة والمحجوزة
- إرسال طلبات الحجز مباشرة عبر واتساب (اختيار الاستراحة والتاريخ)
- تكامل مع وسائل التواصل (انستغرام، تيك توك، واتساب)
- تصميم عربي RTL متجاوب بالكامل
- واجهة متقدمة مع أنيميشن وتأثيرات بصرية
- لوحة تحكم للأدمن محمية بـ Firebase Authentication
- تفضيلات لكل زائر (الثيم، اللغة، المفضّلة) تُحفظ في Firestore عبر مصادقة مجهولة

## بنية المشروع
```text
index.html                  ← الصفحة الرئيسية (البطل، الاستراحات، الخريطة، التقويم)
unit-details.html           ← صفحة تفاصيل الاستراحة + التقييمات
faq.html                    ← الأسئلة الشائعة
cancellation-policy.html     ← سياسة الإلغاء
about.html                  ← من نحن
admin.html                  ← لوحة التحكم (محمية بـ Firebase Auth)
css/
  ├── style.css             ← التنسيق الرئيسي
  └── admin.css             ← تنسيق لوحة التحكم
js/
  ├── firebase-loader.js    ← مُحمِّل Firebase المركزي (يحقن وسميات CDN + utils + الإعداد + data.js)
  ├── utils.js              ← أدوات عامة (esc() لتهريب HTML ومنع XSS)
  ├── firebase-config.js    ← إعداد Firebase + بريد الأدمن (ADMIN_EMAIL) + تفعيل offline persistence
  ├── theme-init.js         ← تفادي وميض الثيم (يُحمّل في <head> كل صفحة)
  ├── data.js               ← البيانات الافتراضية + طبقة MarbellaStore (Firestore/Auth)
  ├── shared.js             ← أدوات مشتركة (اللغة، الثيم، التنقل، Lightbox بفخ تركيز)
  ├── app.js                ← منطق الصفحة الرئيسية (التقويم، واتساب، الواجهة)
  ├── unit-details.js       ← منطق صفحة التفاصيل (المعرض، التقييمات)
  ├── faq.js                ← منطق صفحة الأسئلة الشائعة
  ├── cancellation-policy.js ← منطق صفحة سياسة الإلغاء
  ├── about.js              ← تهيئة صفحة من نحن
  └── admin.js              ← منطق لوحة التحكم (CRUD + Auth)
assets/images/              ← صور الاستراحات والشعار
```

## التشغيل محلياً
افتح `index.html` في المتصفح، أو شغّل خادماً محلياً:
```powershell
python -m http.server 8000
```
ثم زر: `http://localhost:8000`

> ملاحظة: تحتاج الصفحات إلى اتصال بالإنترنت لتحميل Firebase وتحميل/حفظ البيانات من Firestore.

## إعداد Firebase (مطلوب مرة واحدة)
1. أنشئ مشروعاً على [Firebase Console](https://console.firebase.google.com/) وضع قيم `firebaseConfig` في `js/firebase-config.js` (موجودة مسبقاً).
2. **Authentication ← Sign-in method** فعّل:
   - **Email/Password** (لحساب الأدمن).
   - **Anonymous** (مطلوب لـ: تفضيلات الزوار الثيم/اللغة/المفضّلة **وإرسال الحجوزات والتقييمات**). إذا عطّلته، فلن تُحفظ الحجوزات في Firestore ولن يراها الأدمن رغم إرسالها عبر واتساب.
3. **Authentication ← Users** أنشئ مستخدماً ببريد وكلمة مرور. يجب أن يطابق البريد قيمة `ADMIN_EMAIL` في `js/firebase-config.js` (الافتراضي `admin@marbella-resorts.com` — عدّله إلى بريد تملكه إن أردت استعادة كلمة المرور لاحقاً).
4. **Firestore Database** أنشئ قاعدة البيانات. ستُزرع الإعدادات والاستراحات تلقائياً عند أول تشغيل.
5. **ImgBB** (لرفع صور الاستراحات) احصل على مفتاح API مجاني من [api.imgbb.com](https://api.imgbb.com/) وأدخله من لوحة التحكم ← الإعدادات ← «مفتاح ImgBB API». (لا حاجة لتفعيل Firebase Storage — انظر قسم «رفع الصور» أدناه).

### مجموعات Firestore المستخدمة
| المجموعة | الوثيقة | الغرض |
|---|---|---|
| `settings` | `main` | الإعدادات العامة (العلامة، واتساب، روابط…) |
| `units` | `{unitId}` | بيانات الاستراحات + التواريخ المحجوزة + الإعجابات |
| `bookings` | تلقائية | طلبات الحجز |
| `reviews` | تلقائية | تقييمات الضيوف |
| `users` | `{uid}` | تفضيلات الزائر/الأدمن (lang, theme, favorites) |

### قواعد أمان Firestore المقترحة
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() { return request.auth != null; }
    function isAdmin() { return isSignedIn() && request.auth.token.email == 'admin@marbella-resorts.com'; }

    function isStr(v, maxLen) { return v is string && v.size() <= maxLen; }

    function validBooking(d) {
      return d is map
        && d.keys().hasOnly(['id','unitId','unitName','date','name','phone','price','currency','notes','createdAt'])
        && d.keys().hasAll(['id','unitId','unitName','date','name','phone','price','currency','createdAt'])
        && isStr(d.id, 64)
        && isStr(d.unitId, 64)
        && isStr(d.unitName, 120)
        && isStr(d.date, 20)
        && isStr(d.name, 100)
        && isStr(d.phone, 30)
        && d.price is number && d.price >= 0
        && isStr(d.currency, 10)
        && isStr(d.createdAt, 40)
        && (!d.keys().hasAll(['notes']) || isStr(d.notes, 1000));
    }

    function validReview(d) {
      return d is map
        && d.keys().hasOnly(['unitId','name','text','rating','createdAt'])
        && d.keys().hasAll(['unitId','name','text','rating','createdAt'])
        && isStr(d.unitId, 64)
        && isStr(d.name, 100)
        && isStr(d.text, 1000)
        && d.rating is number && d.rating % 1 == 0 && d.rating >= 1 && d.rating <= 5
        && isStr(d.createdAt, 40);
    }

    match /settings/main { allow read: if true; allow write: if isAdmin(); }

    match /units/{id} {
      allow read: if true;
      // الكتابة للأدمن فقط. (إن أردت السماح بتحديث الإعجابات/التواريخ من الموقع فعّل السطر التالي بدلاً منه)
      allow write: if isAdmin();
    }

    match /bookings/{id} {
      allow read: if isAdmin();
      allow create: if isSignedIn() && validBooking(request.resource.data);   // الزوار المسجّلون كمجهولين يمكنهم إرسال طلب
      allow delete, update: if isAdmin();
    }

    match /reviews/{id} {
      allow read: if true;
      allow create: if isSignedIn() && validReview(request.resource.data);
      allow delete, update: if isAdmin();
    }

    match /users/{uid} {
      allow read, delete: if isSignedIn() && request.auth.uid == uid;
      allow create, update: if isSignedIn() && request.auth.uid == uid
        && request.resource.data.keys().hasOnly(['lang','theme','favorites','updatedAt','createdAt']);
    }
  }
}
```
> ملاحظة: عند جعل كتابة `units` للأدمن فقط، لن تُحدّث الإعجابات/التواريخ تلقائياً من الموقع (وهو الأأمن). يمكن للأدمن إدارة التواريخ المحجوزة من لوحة التحكم.

### رفع صور الاستراحات (عبر ImgBB — مجاني تماماً)
يستخدم المشروع **ImgBB** لرفع صور الاستراحات بدل Firebase Storage (مجاني تماماً، مساحة غير محدودة، لا يطلب بطاقة بنكية). المفتاح يُخزَّن في `SETTINGS.imgbbKey` (في Firestore تحت `settings/main`).

#### الحصول على مفتاح ImgBB مجاني
1. افتح [api.imgbb.com](https://api.imgbb.com/) ← سجّل/سجّل الدخول بحساب Google أو بريد.
2. اضغط **Get API key** ← انسخ **API Key**.
3. في لوحة التحكم ← تبويب **الإعدادات** ← الصق المفتاح في حقل **«مفتاح ImgBB API (لرفع الصور)»** ← احفظ.

> ملاحظات:
> - رفع الصور يتم من المتصفح مباشرةً إلى ImgBB عبر `https://api.imgbb.com/1/upload`؛ لا حاجة لتفعيل Firebase Storage.
> - ImgBB المجاني لا يدعم حذف الصور عبر API؛ عند حذف صورة من لوحة التحكم تُزال الإشارة من بيانات الاستراحة فقط (يبقى الملف على خادم ImgBB). لرابط الحذف اختياري يُخزَّن في الاستجابة لكنه يتطلب استدعاء متصفح.
> - حدود ImgBB المجانية سخية (رفع حتى 32MB/صورة، ~300 رفع/دقيقة) — تكفي موقعاً بهذا الحجم براحة.

## التخصيص
- لتعديل الإعدادات والاستراحات بسرعة: `js/data.js` يحتوي المصفوفات الافتراضية (`SETTINGS`, `UNITS`) التي تُزرع في Firestore عند أول تشغيل. بعدها تُدار البيانات من لوحة التحكم.
- لتغيير الشعار: استبدل `assets/images/logo.png`.

## لوحة التحكم
افتح `admin.html`. الدخول عبر حساب الأدمن (Email/Password) في Firebase Authentication.
- إدارة التواريخ المحجوزة، تعديل الأسعار والأوصاف، سجل الحجوزات، تصدير CSV، الإعدادات العامة، تغيير كلمة المرور.
- عرض وحذف تقييمات الضيوف (قسم «التقييمات»).
- رفع/إزالة صور الاستراحات عبر ImgBB من نافذة تعديل الاستراحة (المفتاح من الإعدادات).
- «نسيت كلمة المرور؟» يرسل رابط استعادة عبر البريد المسجّل في `ADMIN_EMAIL`.

## النشر
المشروع صفحات ثابتة — يصلح للنشر على GitHub Pages أو Firebase Hosting أو أي استضافة ثابتة.

> **ملاحظة حول CSP:** `js/firebase-loader.js` يحقن وسميات Firebase عبر `document.write` أثناء التحليل الأولي. لا يوجد CSP حالياً. إن أضفت سياسة أمان محتوى لاحقاً (موصى بها على Firebase Hosting عبر `firebase.json`/`_headers`)، يجب أن تسمح `script-src` بـ `https://www.gstatic.com` و `'self'`، وألا تمنع السكربتات المُدرجة عبر المُحلّل (parser-inserted) — وإلا فلن يُحمَّل Firebase ويصبح الموقع غير وظيفي.

