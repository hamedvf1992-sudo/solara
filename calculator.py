"""Transparent preliminary solar-system energy sizing. Not electrical design."""
from math import ceil, isfinite
from solar import solar_scenario, estimate_cost, InputError as SolarInputError


class InputError(ValueError):
    pass


def number(data, key, low, high, default=None):
    raw = data.get(key, default)
    if raw is None or isinstance(raw, bool):
        raise InputError(f"{key}: a number is required")
    try:
        value = float(raw)
    except (TypeError, ValueError):
        raise InputError(f"{key}: enter a valid number") from None
    if not isfinite(value) or not low <= value <= high:
        raise InputError(f"{key}: value must be between {low} and {high}")
    return value


def calculate(data):
    if not isinstance(data, dict):
        raise InputError("Invalid request body")
    items = data.get("appliances")
    if not isinstance(items, list) or not 1 <= len(items) <= 100:
        raise InputError("Add between 1 and 100 appliances")
    parsed = []
    for i, item in enumerate(items, 1):
        if not isinstance(item, dict):
            raise InputError(f"Appliance {i}: invalid row")
        name = str(item.get("name", "")).strip()[:70] or f"Appliance {i}"
        watts = number(item, "watts", 0.1, 100000)
        qty = number(item, "quantity", 1, 100)
        if not qty.is_integer():
            raise InputError(f"Appliance {i}: quantity must be a whole number")
        hours = number(item, "hours", 0, 24)
        daily_wh = watts * qty * hours
        parsed.append({"name": name, "watts": watts, "quantity": int(qty),
                       "hours": hours, "daily_wh": round(daily_wh, 2),
                       "connected_w": watts * qty})
    daily_wh = sum(x["daily_wh"] for x in parsed)
    if daily_wh <= 0:
        raise InputError("Total daily energy must be greater than zero")
    sun = number(data, "sun_hours", 0.5, 10, 4.5)
    loss = number(data, "loss_percent", 0, 70, 20)
    panel_w = number(data, "panel_watts", 50, 1000, 550)
    panel_area = number(data, "panel_area", 0.5, 5, 2.6)
    reserve = number(data, "reserve_percent", 0, 100, 15)
    peak_w = number(data, "peak_load_watts", 0, 1000000, 0)
    inverter_margin = number(data, "inverter_margin_percent", 0, 100, 25)
    grid_mode = data.get("system_type", "hybrid")
    if grid_mode not in ("grid", "hybrid", "offgrid"):
        raise InputError("Select a valid system type")
    target_wh = daily_wh * (1 + reserve / 100)
    required_pv_w = target_wh / (sun * (1 - loss / 100))
    panels = ceil(required_pv_w / panel_w)
    actual_pv_w = panels * panel_w
    production_wh = actual_pv_w * sun * (1 - loss / 100)
    sum_connected = sum(x["connected_w"] for x in parsed)
    # By default use connected load as a conservative simultaneous-running proxy.
    design_peak = peak_w if peak_w > 0 else sum_connected
    suggested_inverter_w = ceil(design_peak * (1 + inverter_margin / 100) / 500) * 500
    result = {
        "daily_kwh": round(daily_wh / 1000, 2),
        "monthly_kwh": round(daily_wh * 30 / 1000, 1),
        "target_daily_kwh": round(target_wh / 1000, 2),
        "required_pv_kw": round(required_pv_w / 1000, 2),
        "panel_count": panels,
        "installed_pv_kw": round(actual_pv_w / 1000, 3),
        "estimated_daily_kwh": round(production_wh / 1000, 2),
        "estimated_monthly_kwh": round(production_wh * 30 / 1000, 1),
        "module_area_m2": round(panels * panel_area, 1),
        "design_peak_w": round(design_peak),
        "inverter_kw": round(suggested_inverter_w / 1000, 2),
        "appliances": parsed,
        "assumptions": {"sun_hours": sun, "loss_percent": loss, "reserve_percent": reserve,
                        "panel_watts": panel_w, "system_type": grid_mode},
        "battery": None,
        "notes": ["The inverter estimate assumes the specified peak load (or all listed appliances if left blank) can run simultaneously. Check motor/compressor starting surge separately.",
                  "Solar generation is a daily-average approximation, not an hourly or winter-month simulation.",
                  "Module area excludes aisle, setbacks, row spacing and shading clearance."],
    }
    if grid_mode != "grid":
        days = number(data, "autonomy_days", 0.1, 10, 1)
        dod = number(data, "battery_dod_percent", 10, 100, 80)
        efficiency = number(data, "battery_efficiency_percent", 50, 100, 90)
        voltage = number(data, "battery_voltage", 12, 1000, 48)
        battery_kwh = daily_wh * days / 1000 / (dod / 100) / (efficiency / 100)
        result["battery"] = {"nominal_kwh": round(battery_kwh, 2),
                             "nominal_ah": round(battery_kwh * 1000 / voltage),
                             "voltage": voltage, "autonomy_days": days,
                             "dod_percent": dod, "efficiency_percent": efficiency}
        result["notes"].append("Battery capacity assumes the full listed daily load is backed up. Size charging power separately if batteries must recharge within a fixed time.")
    try:
        result["solar"] = solar_scenario(data, panels, panel_w, loss)
        result["cost"] = estimate_cost(data, panels, result["inverter_kw"], result["battery"])
    except SolarInputError as exc:
        raise InputError(str(exc)) from None
    return result
