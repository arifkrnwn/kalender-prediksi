from flask import Flask, render_template, jsonify
from data.forecast import get_forecast_data, load_forecast_from_cache, save_forecast_to_cache
import os

app = Flask(__name__)

@app.route('/')
def index():
    # Render index.html dari folder templates
    return render_template('index.html')

@app.route('/api/forecast', methods=['GET'])
def forecast_api():
    cache_file = 'forecast_cache.parquet'
    events = []

    # Periksa apakah file cache tersedia
    if os.path.exists(cache_file):
        print("Loading forecast data from cache...")
        forecast_data = load_forecast_from_cache(cache_file)
    else:
        print("Generating new forecast data...")
        forecast_data = get_forecast_data()
        save_forecast_to_cache(forecast_data, cache_file)

    # Transformasikan data ke format FullCalendar
    for _, row in forecast_data.iterrows():
        events.append({
            "title": f"Koli: {row['Koli']:.2f}",
            "start": row['Tanggal Pickup'].strftime('%Y-%m-%d'),
            "extendedProps": {
                "Customer": row['Nama Customer'],
                "Koli": f"{row['Koli']:.2f}",
                "Berat": f"{row['Berat']:.2f}",
                "Revenue": f"{row['Revenue']:.2f}"
            }
        })

    return jsonify(events)

if __name__ == '__main__':
    app.run(debug=True)
