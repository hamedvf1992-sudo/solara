# Solara · Solar PV system sizing (Flask)

A local, responsive preliminary solar sizing calculator. No account, paid service, API key, or domain required.

## Run in VS Code

1. Open this folder in VS Code.
2. In its terminal, run the commands appropriate for your system:

**Windows PowerShell:**
```powershell
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe app.py
```

**macOS/Linux:**
```bash
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python app.py
```

3. Open http://127.0.0.1:5000 in your browser. Stop with Ctrl+C.

## Test

With the environment active, run `python -m unittest discover -s tests -v` (or use `.venv\Scripts\python.exe -m unittest discover -s tests -v` on Windows).

## Sizing methodology

- Daily appliance energy (Wh/day) = sum of watts × quantity × hours/day.
- Target energy = daily energy × (1 + energy reserve fraction).
- Minimum DC array watts = target energy / [peak-sun-hours × (1 − total system-loss fraction)].
- Whole panels = ceil(minimum array W / panel nameplate W).
- Estimated mean production (Wh/day) = installed array W × peak-sun-hours × (1 − loss fraction).
- Inverter estimate = peak simultaneous W × (1 + inverter margin), rounded up to the next 500 W. If peak is left zero, assumes all listed appliance rated watts run simultaneously.
- Battery nominal kWh = backed-up daily kWh × days autonomy / (depth-of-discharge fraction × battery delivery efficiency fraction). Ah = kWh × 1000 / system voltage.
- Module area includes module footprints only, not walkways/setbacks/row spacing.

The default **20% combined loss** is an illustrative design assumption (do not add a second inverter-loss factor). Replace peak sun hours with site/month-specific plane-of-array irradiation before using the estimates. The default 20% is **not** represented as NREL's PVWatts default; PVWatts uses its own detailed performance methods and system-loss inputs. See https://pvwatts.nrel.gov/ and https://developer.nlr.gov/docs/solar/pvwatts/v8/ for a more accurate, climate-based grid PV estimate.

## Important limitations

Educational first-pass sizing only, not installation/permit design. Does not model seasonal production, power time series, tariff/export policy, PV module voltage/current and string layout, MPPT selection, battery power/current limits and cycle life, thermal effects, surge current, or wiring/protection. Refrigerators and ACs should use metered or datasheet daily kWh if possible: average duty cycle differs from continuous rated-power operation. Consult a qualified local electrical/solar designer before purchasing or installing equipment.

## Added site and scenario features

- Select a location with an interactive Leaflet/OpenStreetMap map and draggable marker; map tiles/CDN require internet. Manual coordinates and the bundled bilingual Iranian city search still work when disconnected (the search works even without Leaflet).
- Choose a date and south-facing PV panel tilt. Solar-noon elevation is approximated from latitude and solar declination, not a live sun/weather measurement. Suggested tilt of latitude degrees is a starting rule of thumb, not an optimization.
- Sunny reference is 1000 W/m² DC nameplate equivalent reduced by a user-entered combined loss and approximate noon incidence factor. Cloudy output scales that sunny scenario by user-entered cloud transmission; neither is an actual forecast nor a measured maximum. Inverter clipping is not simulated and the labels are illustrative AC-equivalent. Do not multiply these instantaneous values by 24 to estimate daily energy.
- Editable price inputs in Iranian toman generate a scenario cost breakdown. Default price figures are placeholders, **not verified current Iranian market prices or supplier quotes**. Set them to actual component quotes before planning purchases.
- A minimal CSS panel and sun drawing animates position/tilt without a 3D library; respects reduced-motion preferences.

## Three.js solar scene (v3)

After clicking **Calculate system**, a compact interactive WebGL visualization appears in the results: drag to orbit, scroll to zoom, drag the solar-time slider (06:00–18:00), play/pause the path, and toggle sunny/cloudy. Changing location, date, panel tilt, or cloud transmission and recalculating updates the illustration. The panel faces geographic south. The solar path uses latitude and seasonal declination; displayed time is **solar time**, not Iranian wall-clock time. Sunlight lines, panel geometry, and orbit are schematic, not ray tracing. Instantaneous power is a simplified reference scenario with an altitude and incidence multiplier; no measured hourly irradiance, shadows or forecast are used.

The page loads pinned Three.js v0.152.2 from jsDelivr. An internet connection is therefore required to display the 3D scene unless you replace the CDN reference with a local copy of that library. Other calculator features work without it. The scene caps pixel density, uses simple meshes and lines, pauses rendering off-screen, and respects reduced-motion preferences. A fallback message is displayed when WebGL or the CDN is unavailable.


## v4 English / فارسی

Select **EN** or **فارسی** in the top header. Your selection persists locally in the browser. Persian sets `html lang=fa dir=rtl`, while English restores `lang=en dir=ltr`. Map and 3D WebGL controls intentionally stay LTR; coordinates, date and numeric entries keep their conventional direction. The client language pack is `static/i18n.js`; no translation API or internet connection is needed for language selection. The calculator API remains unchanged.


## v5: site-based tilt advisor (English/Persian)
Selecting a city, clicking the Iran map, dragging its marker or entering coordinates automatically requests `/api/tilt?latitude=35.6892&selected_tilt=36`. Shows an annual fixed tilt calculated using an illustrative month-weighted clear-sky geometry sweep, plus summer/winter ±15° alternatives and selected-tilt relative modeled yield. **Use suggested angle** updates the numeric tilt control and, if sizing results are visible, recalculates and updates the Three.js panel. South-facing reference is true south (azimuth 180°). The advisor assumes no obstacles and uniform representative weather; it is not a site-specific meteorological or construction recommendation. Longitude is part of the map position but does not affect this geometry-only estimate at a fixed latitude. For actual tilt optimization, evaluate historical site-specific irradiation and roof/shading/structural constraints using PVWatts or equivalent models.

## v6 map layout fix
The Leaflet tile layout now has locally served fallback CSS so a blocked Leaflet stylesheet does not produce blank space and tiles stacked at the map's right side. A resize observer refreshes the map after layout changes. The project marker is CSS-only and needs no external icon image. Map tiles and the Leaflet JS library still require internet. If upgrading while Flask is running, refresh with Ctrl+F5.


## v7 design, localization and SEO
- New responsive visual design, lightweight CSS hero art and reduced-motion support.
- English and Persian Vazirmatn (Google Fonts, with Tahoma offline fallback), direction-safe map/3D, labels and forms.
- Metadata, Open Graph, canonical/hreflang links, JSON-LD WebApplication, robots.txt and sitemap.xml. `/` is English and `/?lang=fa` is Persian. The interactive UI uses client-side translations.
- SEO metadata is most useful after deployment on a public domain; `localhost` cannot be indexed. Do not block robots on the production domain; preview the localized content before deployment.
- Original sizing algorithms, calculations and map/Three.js functionality retained.
