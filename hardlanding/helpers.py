import pandas as pd

def show_the_column(col):
    table = pd.read_csv('I:/Data/cast/table_with_airports.csv')
    if col == 'HOUR' or col == 'MONTH':
        temp = table[col].value_counts().sort_index()
        data = map(lambda value, name:  {'value': int(value), 'name': str(name)}, \
                   temp.tolist(), temp.index.tolist())
        return list(data)

def get_column_names():
    df = pd.read_csv('I:/Data/cast/table_with_airports.csv')
    names = df.columns.tolist()
    return names

def get_maxvrtg_in_airports():
    df = pd.read_csv('I:/Data/cast/table_with_airports.csv')
    data = df.loc[df['Country'] == 'CHN', ['AIRPORT', 'Longitude', 'Latitude', 'VRTG_MAX']] \
             .groupby("AIRPORT").max().round(3).values.tolist()
    return data