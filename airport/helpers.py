import sys
sys.path.append("..")
from base_helpers.base_helpers import *

def get_chinese_airport_name(airport):
    ca = Chinese_airports().get_dataFrame()
    cn = ca.ix[airport]['ChineseCityName'] + ca.ix[airport]['ChineseName']
    return cn

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