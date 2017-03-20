import pandas as pd
import json

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
    df = df.loc[df['Country'] == 'CHN', :]
    months = df.loc[:, 'MONTH'].sort_values().unique().tolist()
    data = df[['AIRPORT','MONTH', 'City', 'Name', 'Latitude', 'Longitude', 'VRTG_MAX']] \
        .groupby(['MONTH','AIRPORT']).max().round(3)
    
    options = []
    for month in months:
        optionItem = {}
        itemTitle = '2016年{0}月全国机场着陆情况'.format(month)
        optionItem["title"] = {"text": itemTitle}
        seriesData = data.ix[month, ['City', 'Name', 'Longitude', 'Latitude', 'VRTG_MAX']].values.tolist()
        seriesData = list(map(lambda r: {"name": r[0].replace('\'', '-')+' '+r[1], "value": r[2:]}, seriesData))
        optionItem["series"] = [{"data": seriesData}]
        options.append(optionItem)
    #months = list(map(lambda m: str(m), months))
    return months, json.dumps(options)