import pandas as pd

class Table(object):
    df = None
    def __init__(self):
        pass
    def get_dataFrame(self):
        if Table.df is None: # use 'is', not '==', DataFrame can not be compared with 'None'
            path = './static/csv/table_with_chinese_airports.csv'
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
            path = './static/csv/chinese_airports.csv'
            Chinese_airports.df = pd.read_csv(path).dropna()
            Chinese_airports.df = Chinese_airports.df.set_index('AIRPORT')
        return Chinese_airports.df

class Airport(object):
    df = None
    def __init__(self):
        pass
    def get_dataFrame(self):
        if Airport.df is None:
            path = './static/csv/airports.csv'
            airport_info = ['Airport ICAO code', 'Name', 'City', 'Country', 'ChineseName', 
                'ChineseCityName', 'ChineseCountryName', 'Area', 'Altitude', 
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

def get_chinese_airport_name(airport):
    ca = Chinese_airports().get_dataFrame()
    cn = ca.ix[airport]['ChineseCityName'] + ca.ix[airport]['ChineseName']
    return cn

def get_pyramid_vrtg():
    table = Table().get_dataFrame()
    data = []
    legend = []
    for i, vrtg in enumerate([1.3, 1.35, 1.4, 1.45, 1.5, 1.55, 1.6, 1.65,1.7]):
        value = table.loc[table['VRTG_MAX'] > vrtg, :].shape[0]
        if i == 0:
            name = '>{0:.2f}: {1}%'.format(vrtg, int(100 * value / table.shape[0]))
        else:
            name = '>{0:.2f}: {1}%'.format(vrtg, int(100 * value / data[i-1]['value']))
        data.append({'value': value, 'name': name})
        legend.append(name)
    return {'data': data, 'legend': legend}


def get_map_scatter_data(data, month):
    optionItem = {}
    if month > 0:
        itemTitle = '2016年{0}月全国机场着陆情况'.format(month)
        seriesData = data.ix[month, ['Longitude', 'Latitude', 'VRTG_MAX', 'ChineseCityName', 'ChineseName']]
    else:
        itemTitle = '2016年全国机场着陆情况'
        seriesData = data[['Longitude', 'Latitude', 'VRTG_MAX', 'ChineseCityName', 'ChineseName']]
    optionItem['title'] = {'text': itemTitle}
    seriesData = list(map(lambda i, r: {'name': r[3]+r[4]+i, 'value': r[:3]}, seriesData.index, seriesData.values.tolist()))
    top10Data = sorted(seriesData, key=lambda x:x['value'][2], reverse=True)[:10]
    top10 = list(map(lambda x: {'name': x['name'], 'value': x['value'][2]}, top10Data))
    optionItem['series'] = [{'name': month, 'data': seriesData}, {'name': month, 'data': top10}]
    
    yAxisLabels = list(map(lambda x: x['name'], top10))
    optionItem['yAxis'] = [{'data': yAxisLabels}]
    return optionItem
    

def get_map_data(df):
    months = df.loc[:, 'MONTH'].sort_values().unique().tolist()
    data0 = df[['AIRPORT','MONTH', 'ChineseCityName', 'ChineseName', 'Latitude', 'Longitude', 'VRTG_MAX']] \
            .groupby('AIRPORT').max().round(3)
    data = df[['AIRPORT','MONTH', 'ChineseCityName', 'ChineseName', 'Latitude', 'Longitude', 'VRTG_MAX']] \
            .groupby(['MONTH','AIRPORT']).max().round(3)
    
    options = [get_map_scatter_data(data0, 0)]
    for month in months:
        optionItem = get_map_scatter_data(data, month)
        # options: [{"title": itemTitle}, 
        #           {"series": [{"name": month, "data": seriesData}, {"name": month, "data": top10Data}]},
        #           {"yAxis": {"data": yAxisLabels}}]
        options.append(optionItem)
    months.insert(0, 0)
    return months, options

def get_maxvrtg_in_airports():
    result = {}
    table_world = Table().get_dataFrame()
    months, options = get_map_data(table_world)
    result['world'] = {'months': months, 'options': options}

    table_china = table_world.loc[table_world['Country'] == 'CHN', :]
    months, options = get_map_data(table_china)
    result['china'] = {'months': months, 'options': options}

    result["maptitle"] = '机场着陆情况'
    return result

def get_data_in_month_and_airport(month, airport):
    df = Table().get_dataFrame()
    month = int(month)
    usedcols = ['ENTROPY', 'MIX_CROSS_RATE', 'VRTG_MAX', 'AIRPORT', 
        'ChineseCityName', 'ChineseName', 'ChineseCountryName']
    if month > 0:
        temp = df.loc[(df['MONTH'] == month) & (df['AIRPORT'] == airport), usedcols]
    else:
        temp = df.loc[df['AIRPORT'] == airport, usedcols]
    print(airport)
    airport, city, name, country = temp.iloc[0]\
        [['AIRPORT', 'ChineseCityName', 'ChineseName', 'ChineseCountryName']].values.tolist()
    title = '{0}{1}{2}机场\r代码:{3}\r航班量:{4}'.format(country, city, name, airport, temp.shape[0])
    data = temp.loc[:, ['ENTROPY', 'MIX_CROSS_RATE', 'VRTG_MAX']] \
               .sort_values(by='VRTG_MAX').round(3).values.tolist()
    return title, data

def get_dict_of_date_and_means(ts, vrtg, span, col):
    if col == 'VRTG_MAX':
        means = (ts[col] > vrtg).resample(span, closed='left').mean().dropna()
    else:
        means = ts[col].resample(span, closed='left').mean().dropna()
    date = means.index.map(lambda x: x.strftime('%Y-%m-%d'))
    means = pd.DataFrame({'DATE': date, 'means': means.values}).round(3).values.tolist()
    span_dict = {'D': '每天', 'W': '每周', 'M': '每月', 'Q': '每季'}
    col_dict = {'VRTG_MAX': '重着陆频率', 'ENTROPY': '环境熵', 'MIX_CROSS_RATE': '逆转率'}
    return {'means': means, 'name':span_dict[span]+col_dict[col]}

def get_kline(vrtg=1.4, span='W', airport=None):
    df = Table().get_dataFrame()
    df['DATETIME'] = pd.to_datetime(df['DATETIME'])
    if airport:
        ts = df.sort_values('DATETIME').set_index('DATETIME')
        if type(airport) == list:
            ts = ts.loc[ts['AIRPORT'].map(lambda x: x in airport), :]
        elif type(airport) == str:
            ts = ts.loc[ts['AIRPORT'] == airport, :]
        if ts.shape[0] == 0:
            return {'means': [], 'name':''}
    else:
        ts = df.sort_values('DATETIME').set_index('DATETIME')
    
    vrtgs_prob_means = get_dict_of_date_and_means(ts, vrtg, span, 'VRTG_MAX')
    entropy_means = get_dict_of_date_and_means(ts, vrtg, span, 'ENTROPY')
    crossRate_means = get_dict_of_date_and_means(ts, vrtg, span, 'MIX_CROSS_RATE')
    return {'vrtgp': vrtgs_prob_means, 'entropy':entropy_means, 'crossrate':crossRate_means}

def get_kline_ma(vrtg=1.4, window=100, airport=None):
    df = Table().get_dataFrame()
    name = 'MA_' + str(window)
    df['DATETIME'] = pd.to_datetime(df['DATETIME'])
    if airport:
        ts = df.sort_values('DATETIME').set_index('DATETIME')
        if type(airport) == list:
            ts = ts.loc[ts['AIRPORT'].map(lambda x: x in airport), :]
        elif type(airport) == str:
            ts = ts.loc[ts['AIRPORT'] == airport, :]
        if ts.shape[0] == 0:
            return {'means': [], 'name':name}
    else:
        ts = df.sort_values('DATETIME').set_index('DATETIME')

    means = (ts['VRTG_MAX'] > vrtg).rolling(window=window, center=False).mean().dropna() # maybe use min_periods=5
    means_date = means.index.map(lambda x: x.strftime('%Y-%m-%d'))
    means = pd.DataFrame({'DATE': means_date, 'means': means.values}).round(3).values.tolist()
    categoryData = ts.index.map(lambda x: x.strftime('%Y-%m-%d')).tolist()
    
    return {'means': means, 'name':name}

def get_date_range(start, periods, freq):
    rng = pd.date_range(start, periods=periods, freq=freq)
    rng = rng.map(lambda x: x.strftime('%Y-%m-%d')).tolist()
    return rng

def get_kline_counts(vrtg=1.4, airport=None):
    df = Table().get_dataFrame()
    df['DATETIME'] = pd.to_datetime(df['DATETIME'])
    if airport:
        ts = df.sort_values('DATETIME').set_index('DATETIME')
        if type(airport) == list:
            ts = ts.loc[ts['AIRPORT'].map(lambda x: x in airport), 'VRTG_MAX']
        elif type(airport) == str:
            ts = ts.loc[ts['AIRPORT'] == airport, 'VRTG_MAX']
        if ts.shape[0] == 0:
            return []
    else:
        ts = df.sort_values('DATETIME').set_index('DATETIME')['VRTG_MAX']

    counts = (ts > vrtg).resample('D', closed='left').count().dropna()
    counts_date = counts.index.map(lambda x: x.strftime('%Y-%m-%d'))
    counts = pd.DataFrame({'DATE': counts_date, 'counts': counts.values}).round(3).values.tolist()
    return counts


def airports_divided_by_altitude(df, a, b):
    plain_port = df.loc[df['Altitude'] <= a, :]
    hill_port = df.loc[(df['Altitude'] > a) & (df['Altitude'] <= b), :]
    plateau_port = df.loc[df['Altitude'] > b, :]
    counts = [
        {'name': '平原\n<{0}ft'.format(a), 'value': plain_port.shape[0]},
        {'name': '丘陵\n{0}~{1}ft'.format(a,b), 'value': hill_port.shape[0]},
        {'name': '高原\n>{0}ft'.format(b), 'value': plateau_port.shape[0]}
    ]
    codes = {
        '平原\n<{0}ft'.format(a): plain_port.index.values.tolist(),
        '丘陵\n{0}~{1}ft'.format(a,b): hill_port.index.values.tolist(),
        '高原\n>{0}ft'.format(b): plateau_port.index.values.tolist()
    }
    return {'counts': counts, 'codes': codes}

def airports_divided_by_length(df, a, b, c):
    l1 = df.loc[df['Length'] <= a, :]
    l2 = df.loc[(df['Length'] > a) & (df['Length'] <= b), :]
    l3 = df.loc[(df['Length'] > b) & (df['Length'] <=c), :]
    l4 = df.loc[df['Length'] > c, :]
    counts = [
        {'name': '<{0}kft'.format(a/1000), 'value': l1.shape[0]},
        {'name': '{0}~{1}kft'.format(a/1000, b/1000), 'value': l2.shape[0]},
        {'name': '{0}~{1}kft'.format(b/1000, c/1000), 'value': l3.shape[0]},
        {'name': '>{0}kft'.format(c/1000), 'value': l4.shape[0]}
    ]
    codes = {
        '<{0}kft'.format(a/1000): l1.index.values.tolist(),
        '{0}~{1}kft'.format(a/1000, b/1000): l2.index.values.tolist(),
        '{0}~{1}kft'.format(b/1000, c/1000): l3.index.values.tolist(),
        '>{0}kft'.format(c/1000): l4.index.values.tolist()
    }
    return {'counts': counts, 'codes': codes}

def get_airports():
    df = Table().get_dataFrame()
    temp = df.loc[df['Country'] == 'CHN', :].groupby('AIRPORT')\
             .max()[['ChineseCityName', 'ChineseName', 'Longitude', 'Latitude', 'Altitude', 'Length']]\
             .round(3)

    altitude = airports_divided_by_altitude(temp, 300, 3000)
    length = airports_divided_by_length(temp, 10000, 11000, 12000)

    airport_info = list(map(lambda i, r: {"name": r[0]+r[1]+i, "value": r[2:]}, \
                temp.index, temp.values.tolist()))
    return {'altitude': altitude, 'length': length, 'info': airport_info}

def get_all_airports_ent_opt():
    df = Table().get_dataFrame()
    ff = df.loc[:, ['ENTROPY', 'MIX_CROSS_RATE', 'VRTG_MAX', 'ChineseCityName','ChineseName', 'DATETIME']].round(3)
    ff['DATETIME'] = ff['DATETIME'].map(str)
    data = []
    means = []
    splits = [0, 1.3, 1.4, 1.5, 1.6, 2]
    for i in range(1, len(splits)):
        dd = ff.loc[(ff['VRTG_MAX'] >= splits[i-1]) & (ff['VRTG_MAX'] < splits[i]), :]
        data.append(dd.values.tolist())
        mm = dd.loc[:, ['ENTROPY', 'MIX_CROSS_RATE', 'VRTG_MAX']].mean().round(3)
        means.append(mm.values.tolist())
    return {'data': data, 'means': means, 'splits': splits}

def get_ent_opt_track():
    df = Table().get_dataFrame()
    ff = df.loc[:, ['ENTROPY', 'MIX_CROSS_RATE', 'VRTG_MAX']].sort_values('VRTG_MAX')
    #splits = [1, 1.05, 1.1, 1.15, 1.2, 1.25, 1.3, 1.35, 1.4, 1.45, 1.5, 1.55, 1.6, 2]
    splits = [x/10.0 for x in range(10, 20)]
    result = []
    for i in range(1, len(splits)):
        temp = ff.loc[(df['VRTG_MAX']>=splits[i-1]) & (df['VRTG_MAX']<splits[i]), :]
        mean = temp.mean().dropna().round(4).values.tolist()
        num = temp.shape[0]
        result.append(mean + [num])
    return result