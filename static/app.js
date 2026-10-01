const rows = document.getElementById('appliance-rows');
const form = document.getElementById('sizing-form');
const statusEl = document.getElementById('status');
const defaults = [
  ['LED lighting', 12, 8, 6], ['Refrigerator (average running W)', 120, 1, 10],
  ['Television', 90, 1, 4], ['Laptop', 65, 2, 5], ['Wi-Fi router', 12, 1, 24],
  ['Ceiling fan', 60, 2, 8]
];
const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num = (n, digits = 2) => Number(n).toLocaleString(undefined, { maximumFractionDigits: digits, minimumFractionDigits: digits });
function addRow(name = '', watts = 100, qty = 1, hours = 4) {
  const tr = document.createElement('tr');
  tr.innerHTML = `<td><input class="appliance-name" maxlength="70" aria-label="Appliance name" value="${escapeHtml(name)}" placeholder="Appliance name" required></td>
    <td><input class="watts" aria-label="Power in watts" type="number" min="0.1" max="100000" step="any" value="${watts}" required></td>
    <td><input class="quantity" aria-label="Quantity" type="number" min="1" max="100" step="1" value="${qty}" required></td>
    <td><input class="hours" aria-label="Hours per day" type="number" min="0" max="24" step="any" value="${hours}" required></td>
    <td class="row-energy">–</td><td><button type="button" class="remove" aria-label="Remove appliance" title="Remove appliance">×</button></td>`;
  tr.querySelector('.remove').addEventListener('click', () => { tr.remove(); updateLoad(); });
  tr.querySelectorAll('input').forEach(input => input.addEventListener('input', updateLoad));
  rows.append(tr); updateLoad(); window.translateUI?.();
}
function getAppliances() {
  return [...rows.querySelectorAll('tr')].map(tr => ({
    name: tr.querySelector('.appliance-name').value,
    watts: Number(tr.querySelector('.watts').value),
    quantity: Number(tr.querySelector('.quantity').value),
    hours: Number(tr.querySelector('.hours').value)
  }));
}
function updateLoad() {
  let total = 0;
  [...rows.querySelectorAll('tr')].forEach(tr => {
    const w = Number(tr.querySelector('.watts').value);
    const q = Number(tr.querySelector('.quantity').value);
    const h = Number(tr.querySelector('.hours').value);
    const wh = w * q * h;
    total += wh;
    tr.querySelector('.row-energy').textContent = Number.isFinite(wh) ? num(wh / 1000) + ' kWh' : '–';
  });
  document.getElementById('load-preview').innerHTML = `${num(total / 1000)} <small>kWh/day</small>`;
}
function updateBatteryVisibility() {
  const hidden = form.elements.system_type.value === 'grid';
  const block = document.getElementById('battery-fields');
  block.hidden = hidden;
  block.querySelectorAll('input, select').forEach(el => el.disabled = hidden);
}
function resetDemo() {
  rows.innerHTML = ''; defaults.forEach(item => addRow(...item));
  form.reset(); updateBatteryVisibility(); updateLoad();
  document.getElementById('results').hidden = true;
  setLocation(35.6892, 51.389, 'Tehran', true); setToday();
  statusEl.textContent = window.t?.('Demo values restored.') || 'Demo values restored.'; window.translateUI?.();
}
document.getElementById('add-row').addEventListener('click', () => addRow());
document.getElementById('reset-btn').addEventListener('click', resetDemo);
form.elements.system_type.addEventListener('change', updateBatteryVisibility);
let lastResult = null;
function showResults(r, scroll = true) {
  lastResult = r;
  const set = (id, val) => document.getElementById(id).textContent = val;
  set('installed-pv', `${num(r.installed_pv_kw, 3)} kWp`);
  set('panels', String(r.panel_count));
  set('panel-sub', `${num(r.assumptions.panel_watts, 0)} W each`);
  set('inverter', `${num(r.inverter_kw, 1)} kW`);
  set('battery', r.battery ? `${num(r.battery.nominal_kwh)} kWh` : 'Not needed');
  set('battery-sub', r.battery ? `≈ ${num(r.battery.nominal_ah, 0)} Ah at ${r.battery.voltage} V` : 'Grid-tied configuration');
  set('consumption-text', `${num(r.daily_kwh)} kWh`);
  set('generation-text', `${num(r.estimated_daily_kwh)} kWh`);
  set('target', `${num(r.target_daily_kwh)} kWh/day`);
  set('minimum', `${num(r.required_pv_kw)} kWp`);
  set('area', `${num(r.module_area_m2, 1)} m²`);
  set('month', `${num(r.estimated_monthly_kwh, 1)} kWh`);
  const max = Math.max(r.daily_kwh, r.estimated_daily_kwh, 0.001);
  document.getElementById('consumption-bar').style.width = `${r.daily_kwh / max * 100}%`;
  document.getElementById('generation-bar').style.width = `${r.estimated_daily_kwh / max * 100}%`;
  document.getElementById('notes-list').replaceChildren(...r.notes.map(note => { const li = document.createElement('li'); li.textContent = window.t?.(note) || note; return li; }));
  const solar = r.solar;
  set('solar-elevation', `${num(solar.solar_noon_elevation_deg, 1)}°`);
  set('suggested-tilt', `${num(solar.suggested_tilt_deg, 0)}° · annual clear-sky model`);
  set('selected-tilt', `${num(solar.selected_tilt_deg, 0)}° · south-facing`);
  set('solar-site', `${document.getElementById('location-label').value || num(solar.latitude, 2) + '° N'} · ${solar.design_date}`);
  set('sunny-output', `${num(solar.sunny_kw, 2)} kW`);
  set('cloudy-output', `${num(solar.cloudy_kw, 2)} kW`);
  set('cloud-sub', `${num(solar.cloud_transmission_percent, 0)}% assumed irradiance vs sunny reference`);
  window.Solara3D?.setData(solar, r.installed_pv_kw, r.assumptions.loss_percent);
  const prices = r.cost;
  const labels = [['Solar modules',prices.panels], ['Inverter',prices.inverter],
    ['Battery',prices.battery], ['Mounting structure',prices.mounting],
    ['Installation & other',prices.installation_and_other]];
  const costLines = document.getElementById('cost-lines'); costLines.replaceChildren();
  labels.forEach(([label, amount]) => { const line = document.createElement('div');
    const a = document.createElement('span'); const b = document.createElement('strong');
    a.textContent = window.t?.(label) || label; b.textContent = num(amount, 0); line.append(a, b); costLines.append(line); });
  set('cost-total', `${num(prices.total, 0)} toman`);
  const results = document.getElementById('results'); results.hidden = false;
  window.translateUI?.();
  if (scroll) results.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  if (!rows.children.length) { statusEl.textContent = window.t?.('Add at least one appliance.') || 'Add at least one appliance.'; return; }
  const data = Object.fromEntries(new FormData(form).entries());
  data.appliances = getAppliances();
  statusEl.textContent = window.t?.('Calculating…') || 'Calculating…';
  document.getElementById('calculate-btn').disabled = true;
  try {
    const response = await fetch('/api/calculate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Calculation failed');
    showResults(result); statusEl.textContent = window.t?.('Calculation complete.') || 'Calculation complete.';
  } catch (error) { statusEl.textContent = window.t?.(error.message) || error.message; }
  finally { document.getElementById('calculate-btn').disabled = false; }
});
// A bundled, instantly searchable city list. This needs no geocoding API or account.
const iranCities = [
 ['Tehran','تهران',35.6892,51.389],['Mashhad','مشهد',36.2605,59.6168],
 ['Isfahan','اصفهان',32.6546,51.668],['Shiraz','شیراز',29.5918,52.5837],
 ['Tabriz','تبریز',38.0962,46.2738],['Karaj','کرج',35.8327,50.9916],
 ['Qom','قم',34.6416,50.8746],['Ahvaz','اهواز',31.3183,48.6706],
 ['Kermanshah','کرمانشاه',34.3142,47.065],['Urmia','ارومیه',37.5527,45.0761],
 ['Rasht','رشت',37.2682,49.5891],['Zahedan','زاهدان',29.4963,60.8629],
 ['Yazd','یزد',31.8974,54.3569],['Kerman','کرمان',30.2839,57.0834],
 ['Bandar Abbas','بندرعباس',27.1832,56.2666],['Arak','اراک',34.0954,49.7013],
 ['Hamedan','همدان',34.7989,48.515],['Sanandaj','سنندج',35.3149,46.9988],
 ['Gorgan','گرگان',36.8456,54.4393],['Sari','ساری',36.5633,53.0601],
 ['Qazvin','قزوین',36.2688,50.0041],['Zanjan','زنجان',36.6769,48.4963],
 ['Ardabil','اردبیل',38.2498,48.2933],['Bojnurd','بجنورد',37.4747,57.329],
 ['Birjand','بیرجند',32.8663,59.2211],['Semnan','سمنان',35.5769,53.3971],
 ['Bushehr','بوشهر',28.9234,50.8203],['Ilam','ایلام',33.6374,46.4227],
 ['Khorramabad','خرم‌آباد',33.4878,48.3558],['Shahrekord','شهرکرد',32.3256,50.8644],
 ['Yasuj','یاسوج',30.6682,51.588],['Kashan','کاشان',33.985,51.41],
 ['Abadan','آبادان',30.3392,48.3043],['Dezful','دزفول',32.3831,48.4236],
 ['Neyshabur','نیشابور',36.2133,58.7958],['Sabzevar','سبزوار',36.2126,57.6819],
 ['Chabahar','چابهار',25.2919,60.643],['Qeshm','قشم',26.9581,56.2719],
 ['Kish','کیش',26.532,53.982],['Bam','بم',29.1077,58.357],
 ['Maragheh','مراغه',37.389,46.237],['Gonbad-e Kavus','گنبد کاووس',37.2501,55.1672]
];
let iranMap, projectMarker;
function setToday() {
  const today = new Date();
  const local = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0,10);
  document.getElementById('design_date').value = local;
}
function setLocation(lat, lon, label='', moveMap=true) {
  lat = Number(lat); lon = Number(lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;
  if (lat < 24 || lat > 40 || lon < 44 || lon > 64) return;
  document.getElementById('latitude').value = lat.toFixed(4);
  document.getElementById('longitude').value = lon.toFixed(4);
  document.getElementById('location-label').value = label;
  if (projectMarker) projectMarker.setLatLng([lat, lon]);
  if (moveMap && iranMap) iranMap.setView([lat,lon], Math.max(iranMap.getZoom(), 9));
  updateTiltAdvisor();
}
function initMap() {
  if (typeof L === 'undefined') return;
  iranMap = L.map('iran-map', {scrollWheelZoom:false, zoomAnimation:true}).setView([32.4, 53.7], 5);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18, attribution:'© OpenStreetMap contributors'
  }).addTo(iranMap);
  const pin = L.divIcon({className:'leaflet-div-icon', html:'<span class="project-map-pin" aria-hidden="true"></span>', iconSize:[20,20], iconAnchor:[10,10]});
  projectMarker = L.marker([35.6892,51.389], {draggable:true, icon:pin}).addTo(iranMap).bindPopup('Project location');
  projectMarker.on('dragend', () => {
    const pos=projectMarker.getLatLng(); setLocation(pos.lat,pos.lng,'Custom location',false);
  });
  iranMap.on('click', ev => setLocation(ev.latlng.lat,ev.latlng.lng,'Custom location',false));
  const recalcMap = () => iranMap?.invalidateSize({pan:false, debounceMoveend:true});
  requestAnimationFrame(() => requestAnimationFrame(recalcMap));
  window.addEventListener('load', recalcMap, {once:true});
  window.addEventListener('resize', recalcMap);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) recalcMap(); });
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(recalcMap).observe(document.getElementById('iran-map'));
}
function setupSearch() {
  const search=document.getElementById('city-search');
  const options=document.getElementById('city-options');
  let matches=[]; let active=-1;
  const normalize = text => String(text).normalize('NFKC').toLowerCase().replace(/[ي]/g,'ی').replace(/[ك]/g,'ک').replace(/[\u200c\s-]/g,'');
  function choose(city) {
    setLocation(city[2],city[3],city[0]); search.value=`${city[0]} / ${city[1]}`;
    options.hidden=true; active=-1;
  }
  function render() {
    const q=normalize(search.value);
    matches=(q ? iranCities.filter(c=>normalize(c[0]).includes(q)||normalize(c[1]).includes(q)) : iranCities).slice(0,8);
    options.replaceChildren(); active=-1;
    matches.forEach(city => {
      const b=document.createElement('button'); b.type='button'; b.setAttribute('role','option');
      b.textContent=`${city[0]} · ${city[1]}`; b.addEventListener('click',()=>choose(city)); options.append(b);
    });
    options.hidden=matches.length===0;
  }
  search.addEventListener('input',render); search.addEventListener('focus',render);
  search.addEventListener('keydown',ev=>{
    if (options.hidden) return;
    if (ev.key==='ArrowDown'||ev.key==='ArrowUp') {
      ev.preventDefault(); active=(active+(ev.key==='ArrowDown'?1:-1)+matches.length)%matches.length;
      [...options.children].forEach((b,i)=>b.classList.toggle('selected',i===active));
    } else if (ev.key==='Enter' && matches.length) {ev.preventDefault(); choose(matches[Math.max(active,0)]);}
    else if (ev.key==='Escape') options.hidden=true;
  });
  document.addEventListener('click',ev=>{if(!ev.target.closest('.search-wrap')) options.hidden=true;});
  document.getElementById('site-tehran').addEventListener('click',()=>{search.value='Tehran / تهران';choose(iranCities[0]);});
  for(const id of ['latitude','longitude']) document.getElementById(id).addEventListener('change',()=>{
    setLocation(document.getElementById('latitude').value,document.getElementById('longitude').value,'Custom location',true);
  });
}
let tiltRequest = 0;
let latestRecommendation = null;
async function updateTiltAdvisor() {
  const requestNumber = ++tiltRequest;
  const lat = document.getElementById('latitude').value;
  const selected = document.getElementById('tilt_degrees').value;
  const status = document.getElementById('advisor-status');
  document.getElementById('apply-annual').disabled = true;
  status.textContent = window.t?.('Calculating angle…') || 'Calculating angle…';
  try {
    const response = await fetch(`/api/tilt?latitude=${encodeURIComponent(lat)}&selected_tilt=${encodeURIComponent(selected)}`);
    const recommendation = await response.json();
    if (requestNumber !== tiltRequest) return;
    if (!response.ok) throw Error(recommendation.error || 'Angle unavailable');
    latestRecommendation = recommendation;
    document.getElementById('advisor-annual').textContent = `${recommendation.annual_tilt_deg}°`;
    document.getElementById('advisor-summer').textContent = `${recommendation.summer_tilt_deg}°`;
    document.getElementById('advisor-winter').textContent = `${recommendation.winter_tilt_deg}°`;
    document.getElementById('advisor-current').textContent = `${recommendation.selected_tilt_deg}° / ${recommendation.selected_relative_yield_percent}%`;
    document.getElementById('advisor-direction').textContent = window.t?.('True south · 180°') || 'True south · 180°';
    document.getElementById('apply-annual').disabled = false;
    status.textContent = window.t?.('Updated for selected map position.') || 'Updated for selected map position.';
  } catch(error) {
    if(requestNumber !== tiltRequest) return;
    latestRecommendation = null;
    status.textContent = error.message;
  }
}
document.getElementById('tilt_degrees').addEventListener('change', updateTiltAdvisor);
document.getElementById('apply-annual').addEventListener('click', () => {
  if(!latestRecommendation) return;
  document.getElementById('tilt_degrees').value = latestRecommendation.annual_tilt_deg;
  updateTiltAdvisor();
  if(lastResult && !document.getElementById('results').hidden) {
    // Recalculate outputs and synchronize the 3D panel with the applied tilt.
    form.requestSubmit();
  }
});
setToday(); setupSearch(); initMap(); resetDemo();

window.addEventListener('solara-language-change', () => {
  if (lastResult && !document.getElementById('results').hidden) showResults(lastResult, false);
});
