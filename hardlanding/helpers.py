import sys
sys.path.append("..")
from base_helpers.base_helpers import *

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
    cn = ca.ix[airport]['ChineseCityName'].values[0] + ca.ix[airport]['ChineseName'].values[0]
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
        {'name': '<{0}kft'.format(int(a/1000)), 'value': l1.shape[0]},
        {'name': '{0}~{1}kft'.format(int(a/1000), int(b/1000)), 'value': l2.shape[0]},
        {'name': '{0}~{1}kft'.format(int(b/1000), int(c/1000)), 'value': l3.shape[0]},
        {'name': '>{0}kft'.format(int(c/1000)), 'value': l4.shape[0]}
    ]
    codes = {
        '<{0}kft'.format(int(a/1000)): l1.index.values.tolist(),
        '{0}~{1}kft'.format(int(a/1000), int(b/1000)): l2.index.values.tolist(),
        '{0}~{1}kft'.format(int(b/1000), int(c/1000)): l3.index.values.tolist(),
        '>{0}kft'.format(int(c/1000)): l4.index.values.tolist()
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
