import os
import time
import re

BASE_DIR = r"c:\Users\rr\Desktop\vifer\نظام حجز الكتروني ل3 استراحات"
INDEX_HTML = os.path.join(BASE_DIR, "index.html")

with open(INDEX_HTML, "r", encoding="utf-8") as f:
    content = f.read()

v = int(time.time())
content = re.sub(r'css/style\.css\?v=\d+', f'css/style.css?v={v}', content)
content = re.sub(r'js/data\.js\?v=\d+', f'js/data.js?v={v}', content)
content = re.sub(r'js/shared\.js\?v=\d+', f'js/shared.js?v={v}', content)
content = re.sub(r'js/app\.js\?v=\d+', f'js/app.js?v={v}', content)

with open(INDEX_HTML, "w", encoding="utf-8") as f:
    f.write(content)

print("Cache busted with version:", v)
