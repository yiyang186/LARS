import sys
sys.path.append("..")
from base_helpers.base_helpers import *
span_dict = {'D': '每天', 'W': '每周', 'M': '每月', 'Q': '每季'}
col_dict = {'VRTG_MAX': '重着陆频率', 'ENTROPY': '环境熵', 'MIX_CROSS_RATE': '逆转率'}

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

def get_date_range(start, periods, freq):
    rng = pd.date_range(start, periods=periods, freq=freq)
    rng = rng.map(lambda x: x.strftime('%Y-%m-%d')).tolist()
    return rng

def get_dict_of_date_and_means(ts, span, col):
    means = ts[col].resample(span, closed='left').mean().dropna()
    date = means.index.map(lambda x: x.strftime('%Y-%m-%d'))
    means = pd.DataFrame({'DATE': date, 'means': means.values}).round(3).values.tolist()
    return {'means': means, 'name':span_dict[span]+col_dict[col]}

def get_kline_counts(vrtg=0, airport=None):
    df = Table().get_dataFrame()
    df['DATETIME'] = pd.to_datetime(df['DATETIME'])
    ts = df.sort_values('DATETIME').set_index('DATETIME')['VRTG_MAX']
    counts = (ts > vrtg).resample('D', closed='left').count().dropna()
    counts_date = counts.index.map(lambda x: x.strftime('%Y-%m-%d'))
    counts = pd.DataFrame({'DATE': counts_date, 'counts': counts.values}).round(3).values.tolist()
    return counts
    
def get_kline(span):
    df = Table().get_dataFrame()
    df['DATETIME'] = pd.to_datetime(df['DATETIME'])
    ts = df.sort_values('DATETIME').set_index('DATETIME')
    
    entropy_means = get_dict_of_date_and_means(ts, span, 'ENTROPY')
    crossRate_means = get_dict_of_date_and_means(ts, span, 'MIX_CROSS_RATE')
    return {'entropy':entropy_means, 'crossrate':crossRate_means}