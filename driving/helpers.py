import sys, os
import numpy as np
import pandas as pd
sys.path.append("..")
from base_helpers.base_helpers import *

files = os.listdir(wd)

th = 0
th_w = 1
# indics = (2251, 230, 191, 23, 100, 111, 1000)
# ii = 2
NEED = slice(267, 297)
# risks = [[0, 0, 0.05, 0.0223, 0.0634, 0.0423, 0, 0.0242, 0.2534, 0.33433, 0.1043],
#             [0, 0, 0, 0.0242, 0.2534, 0.33433, 0.1043, 0.1134, 0.0423, 0, 0],
#             [0, 0.06, 0.1342, 0.1834, 0.1443,0.22433, 0.1934, 0.11, 0.0423, 0, 0]]
# risk = risks[ii]
# risk[0] = 1.0 - sum(risk)
# print(risk[0])
# assert risk[0] > 0

def get_title(i, max_vrtg):
    fn = files[i].split('_')
    airport = Table().get_dataFrame()
    name, city, contry = airport.loc[airport['Airport ICAO code'] == fn[-3], ['ChineseName','ChineseCityName','ChineseCountryName']].values[0, :]
    location_string = contry + city + name  + '机场'
    time_string = '{}年{}月{}日{}:{}:{}({:.2f})'.format(*fn[0].split('-')[:6], max_vrtg)
    return location_string + ' ' + time_string

def transfer_to_polar(roll_data, pitch_data):
    radius = np.sqrt(roll_data ** 2 + pitch_data ** 2)
    angles = np.where(radius == 0, 0, np.arcsin(pitch_data / radius) / np.pi * 180)
    return np.c_[radius, angles].astype(np.int32).tolist() 

def removesame(x):
    l = [x[0]]
    for i in range(1, x.size):
        if x[i] != l[-1]:
            l.append(x[i])
    return np.array(l)

def draw_drv(df):
    sstickCapt = df[sstickCaptColumns].values.ravel()
    sstickFo = df[sstickFoColumns].values.ravel()

    pitchCaptSstick = df[pitchCaptColumns].values.ravel()
    pitchFoSstick = df[pitchFoColumns].values.ravel()
    pitchSstick = pitchCaptSstick + pitchFoSstick
    
    rollCaptSstick = df[rollCaptColumns].values.ravel()
    rollFoSstick = df[rollFoColumns].values.ravel()
    rollSstick = rollCaptSstick + rollFoSstick
    
    pitchOpt = (pitchSstick[:-1] * pitchSstick[1:] <= th) & (pitchSstick[:-1] != pitchSstick[1:])
    rollOpt = (rollSstick[:-1] * rollSstick[1:] <= th) & (rollSstick[:-1] != rollSstick[1:])
    opt = pitchOpt | rollOpt
    
    cross = pitchSstick ** 2 + rollSstick ** 2
    stick_polar = transfer_to_polar(pitchSstick, rollSstick)

    st = 0
    ed = 20
    crosses = []
    opt_rate = np.zeros(11)
    crs_rate = np.zeros(11)
    for i in range(11):
        crosses.append(stick_polar[st:ed])
        opt_rate[i] = opt[st:ed].mean()
        dc = np.diff(removesame(cross[st:ed]))
        crs_rate[i] = np.mean(dc[1:] * dc[:-1] <= th)
        if len(dc) == 0:
            crs_rate[i] = 0
        st += 10
        ed += 10 
    return crosses, opt_rate, crs_rate

def decompose_wind(df):
    wind_long =(-df['_WIND_SPD'] * np.cos((df['_HEADING_LINEAR'] - df['_WINDIR']) / 180.0 * np.pi)).values
    wind_lati =(-df['_WIND_SPD'] * np.sin((df['_HEADING_LINEAR'] - df['_WINDIR']) / 180.0 * np.pi)).values
    return wind_long, wind_lati

def env_code(array, th):
    return [str(e) for e in (array / th).astype('int')]

def entropy(array):
    from collections import defaultdict
    d = defaultdict(int)
    for k in array:
        d[k] += 1
    s = sum(d.values())
    p = np.array([v / s for k, v in d.items()])
    return -(p * np.log(p)).sum()

def draw_env(df):
    lo, la = decompose_wind(df)
    wind = np.c_[(lo, la)]
    code = env_code(wind, th_w)

    code_map = {k: v for v, k in enumerate(set(code))}
    code_num = [code_map[k] for k in code]
    
    st = 0
    ed = 5
    ent = np.zeros(11)
    codes = []
    for i in range(11):
        codes.append(code_num[st:ed])
        ent[i] = entropy(code[st:ed])
        st += 2
        ed += 2
    return codes, ent

def get_time_drv_env(i):
    df = pd.read_csv(wd+files[i], usecols=usedColumns)
    df = df.fillna(method='pad')
    max_vrtg = df[vrtgColumns].max().max()
    df = df.iloc[NEED, :]

    crosses, opt_rate, crs_rate = draw_drv(df)
    codes, ent = draw_env(df)
    opt_rate = np.array(opt_rate)
    opt_rate = (opt_rate - opt_rate.min()) / (opt_rate.max() - opt_rate.min())
    crs_rate = np.array(crs_rate)
    crs_rate = (crs_rate - crs_rate.min()) / (crs_rate.max() - crs_rate.min())
    ent = np.array(ent)
    ent = (ent - ent.min()) / (ent.max() - ent.min())

    attention = np.abs(crs_rate - ent) + np.random.randn(11) / 20
    attention = attention / attention.sum()
    return max_vrtg, crosses, codes, ent.tolist(), crs_rate.tolist(), \
           opt_rate.tolist(), attention.tolist()

def get_driving_data_by_who(who, i):
    df = pd.read_csv(wd + files[i], usecols=drv_cols)
    roll_col = list(filter(lambda col: 'ROLL' in col and who in col, drv_cols))
    roll_data = df[roll_col].values.ravel()
    pitch_col = list(filter(lambda col: 'PITCH' in col and who in col, drv_cols))
    pitch_data = df[pitch_col].values.ravel()
    return transfer_to_polar(roll_data, pitch_data)

def get_driving_data():
    data = {}
    i = np.random.randint(0, 5000, 1)[0]
    data['capt'] = get_driving_data_by_who('CAPT', i)
    data['fo'] = get_driving_data_by_who('FO', i)

    (max_vrtg, 
    crosses, 
    codes, 
    ent, 
    crs_rate, 
    opt_rate, 
    attention) = get_time_drv_env(i)

    data['title'] = get_title(i, max_vrtg)
    data['crosses'] = crosses
    data['codes'] = codes
    data['ent'] = ent
    data['crs_rate'] = crs_rate
    data['opt_rate'] = opt_rate
    data['attention'] = attention
    return data
