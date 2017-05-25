import sys, os, time
sys.path.append("..")
from base_helpers.base_helpers import *
import numpy as np
from tqdm import tqdm
import sklearn.cluster as skc
from functools import wraps

span_dict = {'D': '每天', 'W': '每周', 'M': '每月', 'Q': '每季'}
col_dict = {'VRTG_MAX': '重着陆频率', 'ENTROPY': '环境熵', 'MIX_CROSS_RATE': '逆转率'}
wd = 'L:/A320_300_20/'
num_pregress = 0

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

def get_date_range(start, end, freq):
    rng = pd.date_range(start, end, freq=freq)
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

def get_progress():
    return num_pregress

def decompose_wind(df):
    wind_long =(-df['_WIND_SPD'] * np.cos((df['_HEADING_LINEAR'] - df['_WINDIR']) / 180.0 * np.pi)).values
    wind_lati =(-df['_WIND_SPD'] * np.sin((df['_HEADING_LINEAR'] - df['_WINDIR']) / 180.0 * np.pi)).values
    return wind_long, wind_lati

def entropy(array, threshold_border, db_eps):
    borders = np.arange(array.size-1)[np.abs(np.diff(array)) > threshold_border] + 1
    if borders.size == 0:
        return 0.0
    section_means = np.zeros(borders.size + 1)
    section_means[0] =array[: borders[0]].mean()
    section_means[-1] =array[borders[-1]: ].mean()
    for i in range(1, section_means.size - 1):
        section_means[i] =array[borders[i-1]: borders[i]].mean()
    db = skc.DBSCAN(eps=db_eps, min_samples=1).fit(section_means.reshape(-1,1))
    labels = pd.Series(db.labels_)
    pk = labels.value_counts() / labels.size
    ent = -(pk * np.log(pk)).sum()
    return ent

def get_feature_from_rawdata(func, colname, used, cbt, low, high, func1=None):
    global num_pregress
    t1 = time.time()
    files = os.listdir(wd)
    table = pd.DataFrame(columns=['FILENAME', colname])
    files_num = len(files)
    # for i, fileName in enumerate(tqdm(files, miniters=3000, ncols=100)):
    for i, fileName in enumerate(files):
        num_pregress = i * 100 / files_num
        idf = pd.read_csv(wd+fileName, usecols=used)
        idf = idf.fillna(method='pad')
        idf = idf.loc[(idf['_ALTITUDE'] < int(high)) & (idf['_ALTITUDE'] > int(low)), used]
        result = func(idf, cbt, used, func1)
        new = pd.DataFrame({'FILENAME': fileName.split('_')[-1], 
                            colname: result},
                            index=[i])
        table = table.append(new, ignore_index=True)
    t2 = time.time()
    return table, t2-t1

def wind_rate(idf, cbt, used, func1=None):
    wind_y, wind_x = decompose_wind(idf)
    ent_x, ent_y = 0, 0
    if 'y' in cbt:
        ent_y = func1(wind_y, 2, 1)
    if 'x' in cbt:
        ent_x = func1(wind_x, 2, 1)
    result = ent_x + ent_y
    return result

def drv_sstick(idf, used, st):
    colcapt = used[st: st + 4]
    colfo = used[st + 4: st + 8]
    sstickcapt = idf[colcapt].values.ravel()
    sstickfo = idf[colfo].values.ravel()
    sstick = sstickcapt + sstickfo
    return sstick

def crossrate(sstick, a):
    return ((sstick[:-1] * sstick[1:]) < a).mean()

def optrate(sstick, a):
    return np.diff(np.abs(sstick) > 0).mean()

def drv_rate(idf, cbt, used, func1=None):
    rate_x, rate_y = 0, 0
    if 'x' in cbt:
        sstick_x = drv_sstick(idf, used, 0)
        rate_x = func1(sstick_x, -1.0)
    if 'y' in cbt:
        sstick_y = drv_sstick(idf, used, 8)
        rate_y = func1(sstick_y, -1.0)
    rate = rate_x + rate_y
    return rate

def arange_by_time(table, colname, span):
    df = Table().get_dataFrame()
    table = table.merge(df)
    table['DATETIME'] = pd.to_datetime(table['DATETIME'])
    ts = table.sort_values('DATETIME').set_index('DATETIME')
    means = ts[colname].resample(span, closed='left').mean().dropna()
    date = means.index.map(lambda x: x.strftime('%Y-%m-%d'))
    res = pd.DataFrame({'DATE': date, 'means': means.values}).round(3).values.tolist()
    return res

def get_driving_features(obj='drv', ftr='cross', cbt='x+y', span='1W', low=0, high=100):
    colname = '_'.join([obj, ftr, cbt, span, low, high])
    if obj == 'env':
        func0, func1 = wind_rate, entropy
        used = ['_ALTITUDE', '_HEADING_LINEAR', '_WIND_SPD', '_WINDIR']
    elif obj == 'drv':
        func0 = drv_rate
        if ftr == 'cross':
            func1 = crossrate
        if ftr == 'opt':
            func1 = optrate
        used = [
            '_ROLL_CAPT_SSTICK', '_ROLL_CAPT_SSTICK-1', '_ROLL_CAPT_SSTICK-2', '_ROLL_CAPT_SSTICK-3',
            '_ROLL_FO_SSTICK', '_ROLL_FO_SSTICK-1', '_ROLL_FO_SSTICK-2', '_ROLL_FO_SSTICK-3',
            '_PITCH_CAPT_SSTICK', '_PITCH_CAPT_SSTICK-1', '_PITCH_CAPT_SSTICK-2', '_PITCH_CAPT_SSTICK-3', 
            '_PITCH_FO_SSTICK', '_PITCH_FO_SSTICK-1', '_PITCH_FO_SSTICK-2', '_PITCH_FO_SSTICK-3', 
            '_ALTITUDE', ]

    table, t = get_feature_from_rawdata(func0, colname, used, cbt, low, high, func1=func1)
    res = arange_by_time(table, colname, span)
    return res