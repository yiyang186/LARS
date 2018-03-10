from django.conf import settings
import pandas as pd
import os

wd = 'G:/A320_300_20/'
env_cols = ['_ALTITUDE', '_HEADING_LINEAR', '_WIND_SPD', '_WINDIR']
drv_cols = [
    '_ROLL_CAPT_SSTICK', '_ROLL_CAPT_SSTICK-1', '_ROLL_CAPT_SSTICK-2', '_ROLL_CAPT_SSTICK-3',
    '_ROLL_FO_SSTICK', '_ROLL_FO_SSTICK-1', '_ROLL_FO_SSTICK-2', '_ROLL_FO_SSTICK-3',
    '_PITCH_CAPT_SSTICK', '_PITCH_CAPT_SSTICK-1', '_PITCH_CAPT_SSTICK-2', '_PITCH_CAPT_SSTICK-3', 
    '_PITCH_FO_SSTICK', '_PITCH_FO_SSTICK-1', '_PITCH_FO_SSTICK-2', '_PITCH_FO_SSTICK-3', 
    '_ALTITUDE']
    
usedColumns =['_ALTITUDE', '_GLIDE', '_LOC', 
              '_SSTICK_CAPT', '_SSTICK_CAPT-1', '_SSTICK_CAPT-2', '_SSTICK_CAPT-3',
              '_PITCH_CAPT_SSTICK', '_PITCH_CAPT_SSTICK-1', '_PITCH_CAPT_SSTICK-2', '_PITCH_CAPT_SSTICK-3', 
              '_ROLL_CAPT_SSTICK', '_ROLL_CAPT_SSTICK-1', '_ROLL_CAPT_SSTICK-2', '_ROLL_CAPT_SSTICK-3',
              '_SSTICK_FO', '_SSTICK_FO-1', '_SSTICK_FO-2', '_SSTICK_FO-3',
              '_PITCH_FO_SSTICK', '_PITCH_FO_SSTICK-1', '_PITCH_FO_SSTICK-2', '_PITCH_FO_SSTICK-3', 
              '_ROLL_FO_SSTICK', '_ROLL_FO_SSTICK-1', '_ROLL_FO_SSTICK-2', '_ROLL_FO_SSTICK-3',
              '_HEADING_LINEAR', '_WIND_SPD', '_WINDIR', 
              '_VRTG', '_VRTG-1', '_VRTG-2', '_VRTG-3', '_VRTG-4', '_VRTG-5', '_VRTG-6', '_VRTG-7',
              '_LONG_ACC', '_LONG_ACC-1', '_LONG_ACC-2', '_LONG_ACC-3',
              '_LAT_ACC', '_LAT_ACC-1', '_LAT_ACC-2', '_LAT_ACC-3'
]

sstickCaptColumns = usedColumns[3:7]
pitchCaptColumns = usedColumns[7:11]
rollCaptColumns = usedColumns[11:15]
sstickFoColumns = usedColumns[15:19]
pitchFoColumns = usedColumns[19:23]
rollFoColumns = usedColumns[23: 27]
windColumns = usedColumns[27: 30]
vrtgColumns = usedColumns[30: 38]
longColumns = usedColumns[38: 42]
latgColumns = usedColumns[42:]
    
filename_map = {f.split('_')[-1]: f for f in os.listdir(wd)}

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