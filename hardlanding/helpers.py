import pandas as pd

def show_the_column(col):
    table = pd.read_csv('I:/Data/cast/samples/merged_table.csv')
    if col == 'HOUR' or col == 'MONTH':
        temp = table[col].value_counts().sort_index()
        data = map(lambda value, name:  {'value': int(value), 'name': str(name)}, temp.tolist(), temp.index.tolist())
        return list(data)

def get_column_names():
    df = pd.read_csv('I:/Data/cast/samples/merged_table.csv')
    names = df.columns.tolist()
    return names