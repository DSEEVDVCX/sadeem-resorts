/* ============================================================
   مُحمِّل Firebase المركزي — يحقن وسميات SDK المتوافقة (compat) +
   ملف الإعداد + data.js بشكل متزامن أثناء تحليل الصفحة،
   فيُركَّز رقم إصدار Firebase في مكان واحد (هنا فقط).
   يُستدعى في <body> قبل shared.js / admin.js ومنطق الصفحة.

   ملاحظة: document.write متزامن أثناء التحليل الأولي للصفحة فقط،
   وهو النمط المعتمد لتحميل SDKs خارجية بالترتيب قبل منطق التطبيق.
   ============================================================ */
(function () {
  var FB_VERSION = "10.9.0"; // غيّر رقم إصدار Firebase هنا فقط ليُطبّق على كل الصفحات
  var V = "?v=4";            // cache-busting: زِده عند كل تعديل على ملفات js المحلية
  var cdn = "https://www.gstatic.com/firebasejs/" + FB_VERSION + "/firebase-";
  document.write(
    '<script src="' + cdn + 'app-compat.js"><\/script>' +
    '<script src="' + cdn + 'firestore-compat.js"><\/script>' +
    '<script src="' + cdn + 'auth-compat.js"><\/script>' +
    '<script src="js/utils.js' + V + '"><\/script>' +
    '<script src="js/firebase-config.js' + V + '"><\/script>' +
    '<script src="js/data.js' + V + '"><\/script>'
  );
})();
