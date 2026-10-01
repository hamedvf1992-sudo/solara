from flask import Flask, jsonify, render_template, request, Response
from calculator import InputError, calculate
from solar import tilt_recommendation

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 100_000


@app.get("/")
def index():
    lang = 'fa' if request.args.get('lang') == 'fa' else 'en'
    title = 'سولارا | محاسبه‌گر پنل خورشیدی و زاویه نصب' if lang == 'fa' else 'Solara | Solar Panel Sizing & Tilt Calculator for Iran'
    description = ('محاسبه ظرفیت پنل خورشیدی، تعداد پنل‌ها، اینورتر، باتری، هزینه و زاویه نصب پیشنهادی بر اساس موقعیت پروژه در ایران.' if lang == 'fa' else 'Estimate solar panel count, daily load, inverter and battery capacity, installation tilt and indicative solar PV cost for sites across Iran.')
    structured_data = {'@context':'https://schema.org','@type':'WebApplication','name':'Solara Solar System Sizer','description':description,'applicationCategory':'UtilitiesApplication','operatingSystem':'Web','inLanguage':['en','fa'],'isAccessibleForFree':True}
    return render_template('index.html', page_lang=lang, page_title=title, page_description=description, structured_data=structured_data)


@app.post("/api/calculate")
def api_calculate():
    try:
        result = calculate(request.get_json(silent=True))
        return jsonify(result)
    except InputError as exc:
        return jsonify({"error": str(exc)}), 400


@app.get('/api/tilt')
def api_tilt():
    try:
        lat = float(request.args.get('latitude', ''))
        tilt = float(request.args.get('selected_tilt', lat))
        from math import isfinite
        if not isfinite(lat) or not isfinite(tilt) or not 0 <= tilt <= 90:
            raise ValueError()
        return jsonify(tilt_recommendation(lat, tilt))
    except (ValueError, TypeError):
        return jsonify({'error': 'Enter valid latitude (24–40°) and tilt (0–90°)'}), 400
    except Exception as exc:
        from solar import InputError
        if isinstance(exc, InputError):
            return jsonify({'error': str(exc)}), 400
        raise


@app.errorhandler(413)
def too_large(_):
    return jsonify({"error": "Request is too large"}), 413


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)


@app.get('/robots.txt')
def robots():
    return Response('User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ' + request.url_root + 'sitemap.xml\n', mimetype='text/plain')


@app.get('/sitemap.xml')
def sitemap():
    from xml.sax.saxutils import escape
    root = escape(request.url_root)
    urls = [root, root + '?lang=fa']
    xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + ''.join('<url><loc>' + escape(url) + '</loc></url>' for url in urls) + '</urlset>'
    return Response(xml, mimetype='application/xml')
