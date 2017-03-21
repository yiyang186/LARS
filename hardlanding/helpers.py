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
        # seriesData: [{"name": City+Name, "value": [longitude, latitude', VRTG_MAX]} , {...}, ...]
        seriesData = list(map(lambda r: {"name": r[0].replace('\'', '-'), "value": r[2:]}, seriesData))
        top10Data = sorted(seriesData, key=lambda x:x["value"][2], reverse=True)[:10]
        top10Data = list(map(lambda x: {"name": x["name"], "value": x["value"][2]}, top10Data))
        optionItem["series"] = [{"name": month, "data": seriesData}, {"name": month, "data": top10Data}]

        yAxisLabels = list(map(lambda item: item["name"], top10Data))
        optionItem["yAxis"] = [{"data": yAxisLabels}]
        # options: [{"title": itemTitle}, 
        #           {"series": [{"name": month, "data": seriesData}, {"name": month, "data": top10Data}]}, 
        #           {"yAxis": {"data": yAxisLabels}}]
        options.append(optionItem)

    return months, json.dumps(options)

def get_data_in_month_and_airport(month, city):
    df = pd.read_csv('I:/Data/cast/table_with_airports.csv')
    city = city.replace('-', '\'') # Because of "XI'AN"
    temp = df.loc[(df['MONTH'] == int(month)) & (df['City'] == city), \
        ['ENTROPY', 'MIX_CROSS_RATE', 'VRTG_MAX', 'AIRPORT', 'Name']]
    code, name = temp.iloc[0][['AIRPORT', 'Name']].values.tolist()
    title = '城市:{0}\r机场名称:{1}\r机场代码:{2}'.format(city, name, code)
    data = temp.loc[:, ['ENTROPY', 'MIX_CROSS_RATE', 'VRTG_MAX']].round(3).values.tolist()
    return title, data