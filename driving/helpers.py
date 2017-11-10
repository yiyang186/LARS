import sys, os
import numpy as np
import pandas as pd
sys.path.append("..")
from base_helpers.base_helpers import *

files = os.listdir(wd)

def get_driving_data_by_who(who, i):
    df = pd.read_csv(wd + files[i], usecols=drv_cols)
    roll_col = list(filter(lambda col: 'ROLL' in col and who in col, drv_cols))
    roll_data = df[roll_col].values.ravel()
    pitch_col = list(filter(lambda col: 'PITCH' in col and who in col, drv_cols))
    pitch_data = df[pitch_col].values.ravel()
    radius = np.sqrt(roll_data ** 2 + pitch_data ** 2)
    angles = np.where(radius == 0, 0, np.arcsin(pitch_data / radius) / np.pi * 180) 
    return np.c_[radius, angles].astype(np.int32).tolist()

def get_driving_data():
    data = {}
    i = np.random.randint(0, 5000, 1)[0]
    data['capt'] = get_driving_data_by_who('CAPT', i)
    data['fo'] = get_driving_data_by_who('FO', i)
    return data
