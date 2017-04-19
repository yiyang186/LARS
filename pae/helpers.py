import sys
sys.path.append("..")
from base_helpers.base_helpers import *

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