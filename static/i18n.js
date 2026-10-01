/* Solara bilingual UI: English/LTR and Persian/RTL. All calculations retain native numeric values. */
const FA = {
  "SMART SOLAR PLANNING · MADE FOR IRAN": "برنامه‌ریزی هوشمند خورشیدی · ویژه ایران",
  "Location-aware tilt": "زاویه متناسب با موقعیت",
  "Instant load calculation": "محاسبه سریع بار",
  "Interactive solar simulation": "شبیه‌سازی تعاملی خورشید",
  "Locate": "موقعیت",
  "Loads": "مصرف‌کننده‌ها",
  "Configure": "تنظیمات",
  "Explore results": "مشاهده نتایج",
  "ABOUT THE STUDIO": "درباره استودیو",
  "Solar PV planning, simplified": "طراحی ساده‌تر سامانه خورشیدی",
  "Solara helps estimate panel count, daily energy demand, inverter and battery size, panel installation angle and indicative cost for a project in Iran. Choose a location on the map, enter your loads, and explore how the sun position and sky scenario affect estimated output.": "سولارا به برآورد تعداد پنل، انرژی مصرفی روزانه، ظرفیت اینورتر و باتری، زاویه نصب و هزینه تقریبی پروژه در ایران کمک می‌کند. موقعیت را روی نقشه تعیین کنید، بارها را وارد کنید و اثر موقعیت خورشید و شرایط آسمان بر توان خروجی را بررسی کنید.",
  "All results are preliminary. They are not a substitute for a site survey, weather-derived yield study, structural review or licensed electrical engineering design.": "تمام نتایج مقدماتی هستند و جایگزین بازدید محل، بررسی تولید انرژی با داده‌های هواشناسی، ارزیابی سازه یا طراحی برق توسط متخصص دارای صلاحیت نیستند.",
  "SITE-BASED TILT ADVISOR": "راهنمای زاویه نصب بر پایه موقعیت",
  "Suggested installation angle": "زاویه پیشنهادی نصب",
  "Estimated fixed south-facing angle for annual solar collection at the map pin.": "برآورد زاویه ثابت رو به جنوب برای دریافت سالانه تابش در موقعیت انتخاب‌شده روی نقشه.",
  "Annual fixed tilt": "شیب ثابت سالانه",
  "Summer option": "گزینه تابستانی",
  "Winter option": "گزینه زمستانی",
  "Current tilt / relative yield": "زاویه کنونی / بازده نسبی",
  "Panel orientation": "جهت پنل",
  "True south · 180°": "جنوب جغرافیایی · ۱۸۰°",
  "Use suggested angle ↗": "اعمال زاویه پیشنهادی ↗",
  "Choose a location to estimate tilt.": "برای برآورد زاویه، موقعیت را انتخاب کنید.",
  "Calculating angle…": "در حال محاسبه زاویه…",
  "Updated for selected map position.": "بر اساس موقعیت انتخاب‌شده به‌روز شد.",
  "Suggested annual fixed tilt": "شیب ثابت سالانه پیشنهادی",
  "Illustrative clear-sky solar geometry with diffuse-light approximation, sampled over the year. Not actual meteorological optimization. Roof constraints, shading, wind/snow loads and real irradiance may change the best angle; verify with local data before installation.": "مدل تقریبی هندسه خورشید در آسمان صاف به همراه برآورد تابش پراکنده در طول سال؛ بهینه‌سازی بر پایه داده واقعی هواشناسی نیست. محدودیت سقف، سایه، بار باد و برف و تابش واقعی می‌تواند زاویه مناسب را تغییر دهد؛ پیش از نصب با داده‌های محلی بررسی شود.",

  "Solara · Solar System Sizer": "سولارا · محاسبه‌گر سامانه خورشیدی",
  "DESIGN STUDIO": "استودیوی طراحی",
  "WORKSPACE": "محیط کار",
  "◎   Project location": "◎   موقعیت پروژه",
  "◈   System calculator": "◈   محاسبه‌گر سامانه",
  "⚙   Design assumptions": "⚙   فرضیات طراحی",
  "▥   System summary": "▥   خلاصه سامانه",
  "Local mode · No account required": "حالت محلی · بدون نیاز به حساب کاربری",
  "Preliminary sizing · v3.0": "برآورد اولیه · نسخه ۴",
  "SOLAR DESIGN / ESTIMATOR": "طراحی و برآورد خورشیدی",
  "Size your solar system": "سامانه خورشیدی خود را طراحی کنید",
  "Turn appliance demand into a practical first-pass PV, inverter and battery estimate.": "از مصرف وسایل برقی، برآورد اولیه پنل، اینورتر و باتری را به دست آورید.",
  "☀ LOCAL CALCULATOR · MAP NEEDS INTERNET": "☀ محاسبه‌گر محلی · نقشه به اینترنت نیاز دارد",
  "Locate your project in Iran": "موقعیت پروژه در ایران",
  "Search a major city, drag the pin, or click the map to pinpoint your site. City search works offline; map tiles need internet.": "نام شهر را جست‌وجو کنید، نشانگر را جابه‌جا کنید یا روی نقشه کلیک کنید. جست‌وجوی شهر آفلاین است؛ کاشی‌های نقشه به اینترنت نیاز دارند.",
  "IRAN SITE SELECTOR": "انتخاب موقعیت در ایران",
  "Find a city (English or فارسی)": "جست‌وجوی شهر (فارسی یا انگلیسی)",
  "Reset to Tehran": "بازگشت به تهران",
  "Map tiles require an internet connection. City search and coordinates still work offline.": "نمایش نقشه نیازمند اینترنت است؛ جست‌وجوی شهر و ورود مختصات آفلاین کار می‌کنند.",
  "Map data © OpenStreetMap contributors · Zoom, pan, click to place marker, or drag marker · City coordinates are approximate centroids.": "داده‌های نقشه © مشارکت‌کنندگان OpenStreetMap · بزرگ‌نمایی، حرکت و انتخاب نقطه · مختصات شهرها تقریبی است.",
  "Project latitude (°N)": "عرض جغرافیایی پروژه (°N)",
  "Project longitude (°E)": "طول جغرافیایی پروژه (°E)",
  "Solar design date": "تاریخ طراحی خورشیدی",
  "Location name": "نام محل",
  "optional": "اختیاری",
  "Daily energy demand": "مصرف روزانه انرژی",
  "Enter the appliances you expect to power and their approximate daily usage.": "وسایل برقی مورد نظر و مصرف روزانه تقریبی آن‌ها را وارد کنید.",
  "＋ Add appliance": "＋ افزودن وسیله",
  "APPLIANCE": "وسیله برقی",
  "POWER (W)": "توان (وات)",
  "QTY": "تعداد",
  "HOURS / DAY": "ساعت در روز",
  "ENERGY / DAY": "انرژی روزانه",
  "Calculated daily load": "بار روزانه محاسبه‌شده",
  "kWh/day": "کیلووات‌ساعت/روز",
  "System configuration": "پیکربندی سامانه",
  "Use site-specific solar irradiation for better results. Default values are illustrative.": "برای نتیجه دقیق‌تر از تابش ویژه محل استفاده کنید. مقادیر پیش‌فرض صرفاً نمونه‌اند.",
  "System type": "نوع سامانه",
  "Hybrid / solar + battery": "هیبریدی / خورشیدی + باتری",
  "Off-grid": "مستقل از شبکه",
  "Grid-tied / no battery": "متصل به شبکه / بدون باتری",
  "Peak sun hours": "ساعت آفتابی مؤثر",
  "hours/day": "ساعت/روز",
  "Solar panel rating": "توان نامی پنل",
  "W per panel": "وات برای هر پنل",
  "Total production losses": "تلفات کل تولید",
  "Energy reserve": "حاشیه اطمینان انرژی",
  "Panel physical area": "مساحت فیزیکی پنل",
  "m² / panel": "مترمربع/پنل",
  "Peak simultaneous load": "حداکثر بار هم‌زمان",
  "W · 0 = sum of all appliance power": "وات · صفر = مجموع توان وسایل",
  "Inverter capacity margin": "حاشیه ظرفیت اینورتر",
  "Battery storage assumptions": "فرضیات ذخیره‌سازی باتری",
  "Backup autonomy": "مدت پشتیبانی مستقل",
  "days": "روز",
  "Usable depth of discharge": "عمق دشارژ مجاز",
  "Battery delivery efficiency": "بازده تحویل انرژی باتری",
  "Nominal battery bank voltage": "ولتاژ نامی بانک باتری",
  "Installation and price assumptions": "فرضیات نصب و قیمت",
  "Cost is based on prices you enter, not a live supplier quote. Units: Iranian toman.": "هزینه بر اساس قیمت‌های واردشده است، نه استعلام لحظه‌ای فروشنده. واحد: تومان.",
  "Panel tilt from horizontal (°)": "زاویه شیب پنل نسبت به افق (°)",
  "Cloudy-sky transmission (%)": "عبور تابش در هوای ابری (٪)",
  "Price per panel (toman)": "قیمت هر پنل (تومان)",
  "Inverter per kW (toman)": "قیمت اینورتر به ازای هر کیلووات (تومان)",
  "Battery per kWh (toman)": "قیمت باتری به ازای هر کیلووات‌ساعت (تومان)",
  "Mounting per panel (toman)": "هزینه سازه هر پنل (تومان)",
  "Installation & other (%)": "نصب و سایر هزینه‌ها (٪)",
  "Ready when you are.": "آماده محاسبه است.",
  "Reset demo": "بازنشانی نمونه",
  "Calculate system →": "محاسبه سامانه ←",
  "Recommended preliminary sizing": "برآورد اولیه پیشنهادی",
  "Rounded to whole panels and 0.5 kW inverter increments.": "تعداد پنل به عدد صحیح و اینورتر به گام نیم کیلووات گرد شده است.",
  "↗ Print / Save PDF": "↗ چاپ / ذخیره PDF",
  "PV ARRAY SIZE": "ظرفیت آرایه خورشیدی",
  "Installed DC capacity": "ظرفیت DC نصب‌شده",
  "SOLAR PANELS": "پنل‌های خورشیدی",
  "Modules": "ماژول",
  "INVERTER ESTIMATE": "برآورد اینورتر",
  "AC continuous rating*": "توان پیوسته AC*",
  "BATTERY BANK": "بانک باتری",
  "Nominal capacity": "ظرفیت نامی",
  "Interactive solar radiation studio": "استودیوی سه‌بعدی تابش خورشید",
  "Drag to orbit · scroll to zoom · adjust tilt and solar time. Coordinates and season drive the Sun path.": "برای چرخش بکشید · برای بزرگ‌نمایی اسکرول کنید · شیب و زمان خورشیدی را تنظیم کنید. موقعیت و فصل مسیر خورشید را تعیین می‌کنند.",
  "Loading 3D scene…": "در حال بارگذاری نمای سه‌بعدی…",
  "3D preview needs WebGL and the Three.js library (internet on first load). Sizing results work without it.": "نمای سه‌بعدی به WebGL و کتابخانه Three.js (بار اول با اینترنت) نیاز دارد. محاسبات بدون آن هم کار می‌کنند.",
  "N ↑   E →   S ↓": "شمال ↑   شرق →   جنوب ↓",
  "Solar time": "زمان خورشیدی",
  "▶ Play sun path": "▶ پخش مسیر خورشید",
  "Sky scenario": "سناریوی آسمان",
  "Sunny · 100% reference": "آفتابی · مرجع ۱۰۰٪",
  "Cloudy · selected transmission": "ابری · عبور انتخاب‌شده",
  "Sun elevation": "ارتفاع خورشید",
  "Beam incidence": "ضریب برخورد پرتو",
  "Estimated output at selected time": "توان تخمینی در زمان انتخابی",
  "Panel tilt": "شیب پنل",
  "Solar-noon elevation": "ارتفاع خورشید در ظهر خورشیدی",
  "Suggested fixed tilt": "شیب ثابت پیشنهادی",
  "Selected panel tilt": "شیب انتخاب‌شده پنل",
  "Site / date": "محل / تاریخ",
  "Educational visualization using solar-time geometry; time is not local clock time. Output is a simplified irradiance/incidence scenario, not a forecast or guaranteed maximum. South-facing plane shown; no terrain/shading/weather API. WebGL automatically pauses when off-screen or when reduced motion is requested.": "نمایش آموزشی بر اساس هندسه زمان خورشیدی است و زمان، ساعت رسمی محلی نیست. توان خروجی یک سناریوی ساده‌شده است، نه پیش‌بینی یا مقدار حداکثری تضمینی. صفحه رو به جنوب نمایش داده می‌شود؛ عوارض زمین، سایه و داده زنده هواشناسی لحاظ نشده‌اند. نمایش سه‌بعدی خارج از دید یا با تنظیم کاهش حرکت متوقف می‌شود.",
  "☀ SUNNY REFERENCE": "☀ مرجع آفتابی",
  "Illustrative AC-equivalent instant output at 1000 W/m²": "توان لحظه‌ای تقریبی معادل AC در تابش ۱۰۰۰ وات/مترمربع",
  "☁ CLOUDY SCENARIO": "☁ سناریوی ابری",
  "User-set fraction of clear irradiance": "سهم تنظیم‌شده تابش نسبت به آسمان صاف",
  "Indicative installed cost": "برآورد هزینه نصب",
  "toman · editable assumed prices, not quotations": "تومان · قیمت‌های فرضی قابل ویرایش، نه پیش‌فاکتور",
  "Estimated total": "جمع برآوردی",
  "Energy balance": "تراز انرژی",
  "average kWh / day": "میانگین کیلووات‌ساعت/روز",
  "Daily consumption": "مصرف روزانه",
  "Estimated PV output": "تولید تخمینی خورشیدی",
  "Energy target incl. reserve": "هدف انرژی با حاشیه اطمینان",
  "Minimum theoretical array": "حداقل ظرفیت نظری آرایه",
  "Panel footprint only": "فقط سطح پنل‌ها",
  "Estimated 30-day generation": "تولید تخمینی ۳۰ روزه",
  "Engineering notes": "نکات مهندسی",
  "⚠ This is an early-stage energy sizing estimate, not a construction-ready electrical design. Verify worst-month irradiance, shading, PV string voltage, MPPT limits, battery discharge current, inverter surge, mounting, protection and applicable electrical codes with a qualified designer.": "⚠ این ابزار برای برآورد اولیه است و طرح اجرایی برق محسوب نمی‌شود. تابش بدترین ماه، سایه‌اندازی، ولتاژ رشته پنل‌ها، محدودیت MPPT، جریان دشارژ باتری، جریان راه‌اندازی اینورتر، سازه، حفاظت و ضوابط برق را با طراح واجد صلاحیت بررسی کنید.",
  "Solara / A local-first educational sizing tool. Local city search; map tiles load from OpenStreetMap when online. No account or API key.": "سولارا / ابزار آموزشی محلی برای برآورد ظرفیت. جست‌وجوی شهر محلی است؛ نقشه آنلاین از OpenStreetMap بارگذاری می‌شود. بدون حساب کاربری یا کلید API.",
  "Appliance name": "نام وسیله",
  "Power in watts": "توان به وات",
  "Quantity": "تعداد",
  "Hours per day": "ساعت در روز",
  "Remove appliance": "حذف وسیله",
  "Tehran / تهران / Shiraz…": "تهران / Tehran / شیراز…",
  "Interactive map of Iran": "نقشه تعاملی ایران",
  "Three-dimensional solar array, mounting tilt, sunlight beam and animated solar position": "آرایه خورشیدی سه‌بعدی، شیب نصب، تابش و حرکت خورشید",
  "Demo values restored.": "مقادیر نمونه بازنشانی شدند.",
  "Add at least one appliance.": "حداقل یک وسیله اضافه کنید.",
  "Calculating…": "در حال محاسبه…",
  "Calculation complete.": "محاسبه انجام شد.",
  "Calculation failed": "محاسبه ناموفق بود.",
  "Not needed": "نیازی نیست",
  "Grid-tied configuration": "پیکربندی متصل به شبکه",
  "rule of thumb": "قاعده سرانگشتی",
  "south-facing": "رو به جنوب",
  "assumed irradiance vs sunny reference": "تابش فرضی نسبت به مرجع آفتابی",
  "Solar modules": "پنل‌های خورشیدی",
  "Inverter": "اینورتر",
  "Battery": "باتری",
  "Mounting structure": "سازه نصب",
  "Installation & other": "نصب و سایر هزینه‌ها",
  "toman": "تومان",
  "W each": "وات برای هر پنل",
  "Custom location": "موقعیت دلخواه",
  "Project location": "موقعیت پروژه",
  "3D library unavailable": "کتابخانه سه‌بعدی در دسترس نیست",
  "WebGL unavailable · numeric results still work": "WebGL در دسترس نیست · نتایج عددی همچنان کار می‌کنند",
  "3D ready · drag to rotate": "نمای سه‌بعدی آماده است · برای چرخش بکشید",
  "Ⅱ Pause sun path": "Ⅱ توقف مسیر خورشید",
  "The inverter estimate assumes the specified peak load (or all listed appliances if left blank) can run simultaneously. Check motor/compressor starting surge separately.": "برآورد اینورتر فرض می‌کند بار اوج تعیین‌شده (یا در صورت خالی بودن، همه وسایل) هم‌زمان کار می‌کنند. جریان راه‌اندازی موتور و کمپرسور را جداگانه بررسی کنید.",
  "Solar generation is a daily-average approximation, not an hourly or winter-month simulation.": "تولید خورشیدی یک میانگین تقریبی روزانه است، نه شبیه‌سازی ساعتی یا ماه‌های زمستان.",
  "Module area excludes aisle, setbacks, row spacing and shading clearance.": "مساحت پنل‌ها شامل مسیر دسترسی، حریم‌ها، فاصله ردیف‌ها و فاصله لازم برای جلوگیری از سایه نیست.",
  "Battery capacity assumes the full listed daily load is backed up. Size charging power separately if batteries must recharge within a fixed time.": "ظرفیت باتری بر اساس پشتیبانی از کل بار روزانه محاسبه شده است. اگر شارژ مجدد باید در زمان مشخصی انجام شود، توان شارژ را جداگانه محاسبه کنید."
};
const originals = new WeakMap();
let currentLanguage = 'en';
function translate(key) { return currentLanguage === 'fa' ? (FA[key] || key) : key; }
function translateDynamic(message) {
  if (currentLanguage !== 'fa') return message;
  if (FA[message]) return FA[message];
  const expressions = [
    [/^(.*) W each$/, m => `${m[1]} ${FA['W each']}`],
    [/^≈ (.*) Ah at (.*) V$/, m => `≈ ${m[1]} آمپرساعت در ${m[2]} ولت`],
    [/^(.*)° · rule of thumb$/, m => `${m[1]}° · ${FA['rule of thumb']}`],
    [/^(.*)° · south-facing$/, m => `${m[1]}° · ${FA['south-facing']}`],
    [/^(.*)% assumed irradiance vs sunny reference$/, m => `${m[1]}٪ ${FA['assumed irradiance vs sunny reference']}`],
    [/^Solar time (.*)$/, m => `${FA['Solar time']} ${m[1]}`],
    [/^(.*) toman$/, m => `${m[1]} ${FA['toman']}`]
  ];
  for (const [re, fn] of expressions) { const m = message.match(re); if (m) return fn(m); }
  return message;
}
function paintLanguage() {
  document.documentElement.lang = currentLanguage;
  document.documentElement.dir = currentLanguage === 'fa' ? 'rtl' : 'ltr';
  document.title = currentLanguage === 'fa' ? 'سولارا | محاسبه‌گر پنل خورشیدی و زاویه نصب' : 'Solara | Solar Panel Sizing & Tilt Calculator for Iran';
  document.querySelectorAll('[data-lang]').forEach(btn => {
    const active = btn.dataset.lang === currentLanguage;
    btn.classList.toggle('active', active); btn.setAttribute('aria-pressed', String(active));
  });
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = []; while(walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    if (node.parentElement.closest('script,style,textarea,[data-no-translate]')) continue;
    let source = originals.get(node);
    if (source === undefined) {source = node.textContent; originals.set(node, source);}
    const key = source.trim().replace(/\u00a0/g,' ');
    if (!key || (!FA[key] && !/^(Solar time |.* W each$|≈ .* Ah at .* V$|.*° · (rule of thumb|south-facing)$|.*% assumed irradiance vs sunny reference$|.* toman$)/.test(key))) continue;
    const target = translateDynamic(key);
    node.textContent = source.replace(/\S(?:[\s\S]*\S)?/, target);
  }
  document.querySelectorAll('[placeholder],[aria-label],[title]').forEach(el => {
    for (const name of ['placeholder','aria-label','title']) {
      if (!el.hasAttribute(name)) continue;
      const origin = el.dataset['origin' + name.replace(/-([a-z])/g,(_,c)=>c.toUpperCase())] || el.getAttribute(name);
      const attrKey='origin' + name.replace(/-([a-z])/g,(_,c)=>c.toUpperCase());
      el.dataset[attrKey] = origin;
      el.setAttribute(name, translate(origin));
    }
  });
  // User-entered names, technical units, form values and WebGL canvas are not mirrored or translated.
  document.getElementById('iran-map')?.setAttribute('dir','ltr');
  setTimeout(() => window.dispatchEvent(new Event('resize')), 0);
}
function setLanguage(lang) {
  currentLanguage = lang === 'fa' ? 'fa' : 'en';
  try { localStorage.setItem('solara-language', currentLanguage); } catch (_) {}
  if (new URLSearchParams(location.search).get('lang') !== (currentLanguage === 'fa' ? 'fa' : null)) { history.replaceState(null, '', currentLanguage === 'fa' ? '?lang=fa' + location.hash : location.pathname + location.hash); }
  paintLanguage();
  window.SolaraLanguage = currentLanguage;
  window.dispatchEvent(new Event('solara-language-change'));
}
try { currentLanguage = new URLSearchParams(location.search).get('lang') === 'fa' ? 'fa' : (localStorage.getItem('solara-language') === 'fa' ? 'fa' : 'en'); } catch (_) { currentLanguage = new URLSearchParams(location.search).get('lang') === 'fa' ? 'fa' : 'en'; }
window.translateUI = paintLanguage;
window.t = translate;
window.tDynamic = translateDynamic;
window.setSolaraLanguage = setLanguage;
document.querySelectorAll('[data-lang]').forEach(btn => btn.addEventListener('click', () => setLanguage(btn.dataset.lang)));
paintLanguage();
