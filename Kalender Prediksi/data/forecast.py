from statsmodels.tsa.arima.model import ARIMA
import pandas as pd
from data.db_connection import fetch_data

# Fungsi utama untuk forecasting
def get_forecast_data():
    with open("data/query.sql", "r") as file:
        query = file.read()

    data = fetch_data(query)
    data['Tanggal Pickup'] = pd.to_datetime(data['Tanggal Pickup'])

    forecasts = []
    for customer, group in data.groupby('Nama Customer'):
        group.set_index('Tanggal Pickup', inplace=True)
        group = group[~group.index.duplicated(keep='first')]
        group = group.asfreq('D').fillna(0)

        def arima_forecast(series, days=30):
            model = ARIMA(series, order=(5, 1, 0))
            model_fit = model.fit()
            forecast = model_fit.forecast(steps=days)
            return forecast

        forecast_koli = arima_forecast(group['Koli'])
        forecast_berat = arima_forecast(group['Berat'])
        forecast_revenue = arima_forecast(group['Revenue'])

        forecast_dates = pd.date_range(start=group.index[-1] + pd.Timedelta(days=1), periods=30)
        forecast_df = pd.DataFrame({
            'Tanggal Pickup': forecast_dates,
            'Nama Customer': customer,
            'Koli': forecast_koli,
            'Berat': forecast_berat,
            'Revenue': forecast_revenue
        })
        forecasts.append(forecast_df)

    return pd.concat(forecasts, ignore_index=True)

# Fungsi untuk menyimpan data ke cache
def save_forecast_to_cache(data, file_name='forecast_cache.parquet'):
    data.to_parquet(file_name, index=False)

# Fungsi untuk memuat data dari cache
def load_forecast_from_cache(file_name='forecast_cache.parquet'):
    return pd.read_parquet(file_name)
