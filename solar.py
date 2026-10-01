"""Simple solar-noon geometry and transparent scenario estimates, not a weather service."""
from datetime import date
from math import asin, cos, degrees, radians, sin, pi, exp
from math import isfinite

class InputError(ValueError):
    pass

def number(data, key, low, high, default=None):
    try:
        value = float(data.get(key, default))
    except (TypeError, ValueError):
        raise InputError(f"{key}: enter a number") from None
    if not isfinite(value) or not low <= value <= high:
        raise InputError(f"{key}: expected {low}–{high}")
    return value


# Monthly representative-day clear-sky geometry proxy, NOT measured irradiance.
# South-facing fixed panels in Iran, 1-degree tilt sweep. Weather/shading/wind/roof
# constraints are intentionally excluded. Used for comparative angle suggestions only.
MONTH_DAYS = (31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31)
MID_DAYS = (15, 45, 74, 105, 135, 166, 196, 227, 258, 288, 319, 349)

def tilt_recommendation(latitude, current_tilt=None):
    if not 24 <= latitude <= 40:
        raise InputError('latitude: expected 24–40')
    samples = []
    lat = radians(latitude)
    for doy, days in zip(MID_DAYS, MONTH_DAYS):
        gamma = 2*pi/365*(doy-1)
        dec = (0.006918 - 0.399912*cos(gamma) + 0.070257*sin(gamma)
               - 0.006758*cos(2*gamma) + 0.000907*sin(2*gamma)
               - 0.002697*cos(3*gamma) + 0.00148*sin(3*gamma))
        for quarter in range(24, 73):  # solar times 06:00 through 18:00, 15 min
            hour_angle = radians((quarter/4-12)*15)
            up = sin(lat)*sin(dec)+cos(lat)*cos(dec)*cos(hour_angle)
            if up <= 0: continue
            north = cos(lat)*sin(dec)-sin(lat)*cos(dec)*cos(hour_angle)
            # Smooth atmospheric approximation for comparative beam and diffuse terms.
            dni = 900*exp(-0.14/max(up, 0.08))
            dhi = 110*up
            ghi = dni*up+dhi
            samples.append((days, up, north, dni, dhi, ghi))
    def score(degrees_tilt):
        t = radians(degrees_tilt)
        c, st = cos(t), sin(t)
        return sum(days*(dni*max(0,up*c-north*st)
                          +dhi*(1+c)/2 + ghi*.2*(1-c)/2)
                   for days,up,north,dni,dhi,ghi in samples)
    scores = [(tilt, score(tilt)) for tilt in range(0, 61)]
    optimum, maximum = max(scores, key=lambda v:v[1])
    current = latitude if current_tilt is None else current_tilt
    return {'annual_tilt_deg': optimum,
            'summer_tilt_deg': max(0, optimum-15),
            'winter_tilt_deg': min(60, optimum+15),
            'direction': 'True south (azimuth 180°)',
            'latitude_rule_deg': round(latitude),
            'selected_tilt_deg': round(current, 1),
            'selected_relative_yield_percent': round(100*score(current)/maximum, 1),
            'method': 'Illustrative annual clear-sky, isotropic diffuse 1° sweep; no local weather, shade, roof geometry or terrain'}


def solar_scenario(data, panel_count, panel_watts, loss_percent):
    lat = number(data, 'latitude', 24, 40, 35.6892)
    lon = number(data, 'longitude', 44, 64, 51.3890)
    try:
        day = date.fromisoformat(str(data.get('design_date') or date.today().isoformat()))
    except ValueError:
        raise InputError('design_date: enter a valid date') from None
    # NOAA-style approximate solar declination via fractional year, sufficient for conceptual tilt display.
    gamma = 2 * pi / 365 * (day.timetuple().tm_yday - 1)
    decl = degrees(0.006918 - 0.399912*cos(gamma) + 0.070257*sin(gamma)
                   - 0.006758*cos(2*gamma) + 0.000907*sin(2*gamma)
                   - 0.002697*cos(3*gamma) + 0.00148*sin(3*gamma))
    noon_elevation = max(0, 90 - abs(lat - decl))
    tilt = number(data, 'tilt_degrees', 0, 90, round(lat))
    cloud = number(data, 'cloud_percent', 0, 100, 25)
    # South-facing north-of-tropics approximation at local solar noon.
    incidence = max(0, cos(radians(lat - decl - tilt)))
    # An explicit user scenario: 1000 W/m² clear-sky reference, cloud transmission as entered.
    clear_kw = panel_count * panel_watts / 1000 * (1 - loss_percent/100) * incidence
    cloudy_kw = clear_kw * cloud / 100
    return {'latitude': lat, 'longitude': lon, 'design_date': day.isoformat(),
            'solar_noon_elevation_deg': round(noon_elevation, 1),
            'solar_declination_deg': round(decl, 1), 'noon_sun_azimuth': 'South' if lat > decl else 'North',
            'suggested_tilt_deg': tilt_recommendation(lat, tilt)['annual_tilt_deg'], 'selected_tilt_deg': tilt,
            'incidence_factor': round(incidence, 3),
            'sunny_kw': round(clear_kw, 3), 'cloudy_kw': round(cloudy_kw, 3),
            'cloud_transmission_percent': cloud,
            'sunny_reference_irradiance_w_m2': 1000,
            'tilt_recommendation': tilt_recommendation(lat, tilt)}


def estimate_cost(data, panels, inverter_kw, battery):
    panel_price = number(data, 'price_per_panel', 0, 10_000_000_000, 8_000_000)
    inverter_price = number(data, 'price_per_inverter_kw', 0, 10_000_000_000, 10_000_000)
    battery_price = number(data, 'price_per_battery_kwh', 0, 10_000_000_000, 12_000_000)
    structure = number(data, 'structure_per_panel', 0, 10_000_000_000, 1_500_000)
    extras = number(data, 'installation_percent', 0, 100, 15)
    subtotal_panels = panel_price * panels
    subtotal_inverter = inverter_price * inverter_kw
    subtotal_battery = battery_price * battery['nominal_kwh'] if battery else 0
    subtotal_structure = structure * panels
    subtotal = subtotal_panels + subtotal_inverter + subtotal_battery + subtotal_structure
    install = subtotal * extras / 100
    return {'currency': 'IRR toman (user-entered illustrative prices)',
            'panels': round(subtotal_panels), 'inverter': round(subtotal_inverter),
            'battery': round(subtotal_battery), 'mounting': round(subtotal_structure),
            'installation_and_other': round(install), 'total': round(subtotal + install)}
