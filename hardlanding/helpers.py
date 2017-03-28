import pandas as pd
import json

class Table(object):
    df = None
    def __init__(self):
        pass
    def get_dataFrame(self):
        if Table.df is None: # use 'is', not '==', DataFrame can not be compared with 'None'
            path = 'I:/Workspaces/python/django/LRAS/hardlanding/static/csv/table_with_airports.csv'
            Table.df = pd.read_csv(path).dropna()
        return Table.df

class Airport(object):
    df = None
    def __init__(self):
        pass
    def get_dataFrame(self):
        if Airport.df is None:
            path = 'I:/Workspaces/python/django/LRAS/hardlanding/static/csv/airports.csv'
            airport_info = ['Airport ICAO code', 'Name', 'City', 'Country', 'Area', 'Altitude', 
                'Latitude', 'Longitude', 'Magnetic Variation', 'Length', 'Width', 'Magnetic Bearing', 
                'LDA Start Latitude', 'LDA Start Longitude', 'LDA Start Elevation']
            Airport.df = pd.read_csv(path, usecols=airport_info).dropna()
        return Airport.df

def show_the_column(col):
    table = Table().get_dataFrame()
    if col == 'HOUR' or col == 'MONTH':
        temp = table[col].value_counts().sort_index()
        data = map(lambda value, name:  {'value': int(value), 'name': str(name)}, \
                   temp.tolist(), temp.index.tolist())
        return list(data)

def get_column_names():
    df = Table().get_dataFrame()
    names = df.columns.tolist()
    return names

def get_options(data, month):
    optionItem = {}
    if month > 0:
        itemTitle = '2016年{0}月全国机场着陆情况'.format(month)
        seriesData = data.ix[month, ['City', 'Name', 'Longitude', 'Latitude', 'VRTG_MAX']].values.tolist()
    else:
        itemTitle = '2016年全国机场着陆情况'
        seriesData = data[['City', 'Name', 'Longitude', 'Latitude', 'VRTG_MAX']].values.tolist()
    optionItem["title"] = {"text": itemTitle}
    seriesData = list(map(lambda r: {"name": r[0].replace('\'', '-'), "value": r[2:]}, seriesData))
    top10Data = sorted(seriesData, key=lambda x:x["value"][2], reverse=True)[:10]
    top10Data = list(map(lambda x: {"name": x["name"], "value": x["value"][2]}, top10Data))
    optionItem["series"] = [{"name": month, "data": seriesData}, {"name": month, "data": top10Data}]

    yAxisLabels = list(map(lambda item: item["name"], top10Data))
    optionItem["yAxis"] = [{"data": yAxisLabels}]
    return optionItem
    

def get_geo_json(df):
    months = df.loc[:, 'MONTH'].sort_values().unique().tolist()
    data0 = df[['AIRPORT','MONTH', 'City', 'Name', 'Latitude', 'Longitude', 'VRTG_MAX']] \
            .groupby('AIRPORT').max().round(3)
    data = df[['AIRPORT','MONTH', 'City', 'Name', 'Latitude', 'Longitude', 'VRTG_MAX']] \
            .groupby(['MONTH','AIRPORT']).max().round(3)
    
    options = [get_options(data0, 0)]
    for month in months:
        optionItem = get_options(data, month)
        # options: [{"title": itemTitle}, 
        #           {"series": [{"name": month, "data": seriesData}, {"name": month, "data": top10Data}]}, 
        #           {"yAxis": {"data": yAxisLabels}}]
        options.append(optionItem)
    months.insert(0, 0)
    return months, options #

def get_maxvrtg_in_airports(area):
    result = {}
    table_world = Table().get_dataFrame()
    months, options = get_geo_json(table_world)
    result['world'] = {'months': months, 'options': options}

    table_china = table_world.loc[table_world['Country'] == 'CHN', :]
    months, options = get_geo_json(table_china)
    result['china'] = {'months': months, 'options': options}

    result["maptitle"] = '机场着陆情况'
    return json.dumps(result)

def get_data_in_month_and_airport(month, city):
    df = Table().get_dataFrame()
    month = int(month)
    city = city.replace('-', '\'') # Because of "XI'AN"
    if month > 0:
        temp = df.loc[(df['MONTH'] == month) & (df['City'] == city), \
            ['ENTROPY', 'MIX_CROSS_RATE', 'VRTG_MAX', 'AIRPORT', 'Name']]
    else:
        temp = df.loc[df['City'] == city, ['ENTROPY', 'MIX_CROSS_RATE', 'VRTG_MAX', 'AIRPORT', 'Name']]
    code, name = temp.iloc[0][['AIRPORT', 'Name']].values.tolist()
    title = '城市:{0}\r名称:{1}\r代码:{2}\r航班量:{3}'.format(city, name, code, temp.shape[0])
    data = temp.loc[:, ['ENTROPY', 'MIX_CROSS_RATE', 'VRTG_MAX']] \
               .sort_values(by='VRTG_MAX').round(3).values.tolist()
    return title, data

def get_kline(vrtg=1.4, span='W', city=None):
    df = Table().get_dataFrame()
    df['DATETIME'] = pd.to_datetime(df['DATETIME'])
    name = {'D': 'daily', 'W': 'weekly', 'M': 'monthly', 'Q': 'seasonally'}
    if city:
        ts = df.sort_values('DATETIME').set_index('DATETIME')
        ts = ts.loc[ts['City'] == city, 'VRTG_MAX']
        if ts.shape[0] == 0:
            return {'means': [], 'name':name[span]}
    else:
        ts = df.sort_values('DATETIME').set_index('DATETIME')['VRTG_MAX']
    means = (ts > vrtg).resample(span, closed='left').mean().dropna()
    means_date = means.index.map(lambda x: x.strftime('%Y-%m-%d'))
    means = pd.DataFrame({'DATE': means_date, 'means': means.values}).round(3).values.tolist()
    return {'means': means, 'name':name[span]}

def get_kline_ma(vrtg=1.4, window=100, city=None):
    df = Table().get_dataFrame()
    name = 'MA_' + str(window)
    df['DATETIME'] = pd.to_datetime(df['DATETIME'])
    if city:
        ts = df.sort_values('DATETIME').set_index('DATETIME')
        ts = ts.loc[ts['City'] == city, 'VRTG_MAX']
        if ts.shape[0] == 0:
            return {'means': [], 'name':name}
    else:
        ts = df.sort_values('DATETIME').set_index('DATETIME')['VRTG_MAX']

    means = (ts > vrtg).rolling(window=window, center=False).mean().dropna() # maybe use min_periods=5
    means_date = means.index.map(lambda x: x.strftime('%Y-%m-%d'))
    means = pd.DataFrame({'DATE': means_date, 'means': means.values}).round(3).values.tolist()
    categoryData = ts.index.map(lambda x: x.strftime('%Y-%m-%d')).tolist()
    
    return {'means': means, 'name':name}

def get_date_range(start, periods, freq):
    rng = pd.date_range(start, periods=periods, freq=freq)
    rng = rng.map(lambda x: x.strftime('%Y-%m-%d')).tolist()
    return rng

def get_kline_counts(vrtg=1.4, city=None):
    df = Table().get_dataFrame()
    df['DATETIME'] = pd.to_datetime(df['DATETIME'])
    if city:
        ts = df.sort_values('DATETIME').set_index('DATETIME')
        ts = ts.loc[ts['City'] == city, 'VRTG_MAX']
        if ts.shape[0] == 0:
            return []
    else:
        ts = df.sort_values('DATETIME').set_index('DATETIME')['VRTG_MAX']

    counts = (ts > vrtg).resample('D', closed='left').count().dropna()
    counts_date = counts.index.map(lambda x: x.strftime('%Y-%m-%d'))
    counts = pd.DataFrame({'DATE': counts_date, 'counts': counts.values}).round(3).values.tolist()
    return counts

def get_airports():
    df = Table().get_dataFrame()
    temp = df.loc[df['Country'] == 'CHN', :].groupby('AIRPORT')\
             .max()[['City', 'Longitude', 'Latitude', 'Altitude', 'Length']]\
             .round(3)
    data = list(map(lambda r: {"name": r[0].replace('\'', '-'), "value": r[1:]}, \
                temp.values.tolist()))
    return data
