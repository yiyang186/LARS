from django.conf import settings
import pandas as pd

class Table(object):
    df = None
    def __init__(self):
        pass
    def get_dataFrame(self):
        if Table.df is None: # use 'is', not '==', DataFrame can not be compared with 'None'
            path = settings.STATIC_PATH + 'csv/table_with_chinese_airports.csv'
            Table.df = pd.read_csv(path).dropna()
        return Table.df

class Chinese_airports(object):
    # by using Chinses_airports().get_dataFrame().ix['ZBAA']
    # you can get {'Name': '首都','City': '北京', 'Country': 中国}
    df = None
    def __init__(self):
        pass
    def get_dataFrame(self):
        if Chinese_airports.df is None:
            path = settings.STATIC_PATH + 'csv/table_with_chinese_airports.csv'
            Chinese_airports.df = pd.read_csv(path).dropna()
            Chinese_airports.df = Chinese_airports.df.set_index('AIRPORT')
        return Chinese_airports.df

class Airport(object):
    df = None
    def __init__(self):
        pass
    def get_dataFrame(self):
        if Airport.df is None:
            path = settings.STATIC_PATH + 'csv/airports.csv'
            airport_info = ['Airport ICAO code', 'Name', 'City', 'Country', 'ChineseName', 
                'ChineseCityName', 'ChineseCountryName', 'Area', 'Altitude', 
                'Latitude', 'Longitude', 'Magnetic Variation', 'Length', 'Width', 'Magnetic Bearing', 
                'LDA Start Latitude', 'LDA Start Longitude', 'LDA Start Elevation']
            Airport.df = pd.read_csv(path, usecols=airport_info).dropna()
        return Airport.df

class Overrun(object):
    data = None
    def __init__(self):
        pass
    def get_data(self):
        if Overrun.data is None:
            path = settings.STATIC_PATH + 'csv/data.txt'
            Overrun.data = ""
            with open(path) as f:
                for line in f.readlines():
                    Overrun.data += line
        return Overrun.data