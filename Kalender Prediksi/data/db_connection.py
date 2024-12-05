
from sqlalchemy import create_engine
import pandas as pd

# Buat koneksi database menggunakan SQLAlchemy
def get_db_connection():
    engine = create_engine('mysql+pymysql://root:My_logis#18@141.136.47.232/db_access_logistic_2020')
    return engine

def fetch_data(query):
    # Gunakan SQLAlchemy engine dengan Pandas
    engine = get_db_connection()
    data = pd.read_sql(query, con=engine)
    return data
