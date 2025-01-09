import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from datetime import datetime

# Load data from CSV files
def load_data():
    df_dort = pd.read_csv(r'C:\Users\uid908086\Downloads\New folder\Timeseries_51.514_7.465_SA3_2000kwp_crystSi_14_39deg.csv',
                          delimiter=';', skiprows=10, skipfooter=12, engine='python')
    df_dort['location'] = 'Dortmund'

    df_castel = pd.read_csv(r'C:\Users\uid908086\Downloads\New folder\Timeseries_41.977_12.869_SA3_2000kwp_crystSi_14_36deg.csv',
                            delimiter=';', skiprows=10, skipfooter=12, engine='python')
    df_castel['location'] = 'Castel Madama'

    df_catania = pd.read_csv(r'C:\Users\uid908086\Downloads\New folder\Timeseries_37.502_15.087_SA3_2000kwp_crystSi_14_39deg.csv',
                             delimiter=';', skiprows=10, skipfooter=12, engine='python')
    df_catania['location'] = 'Catania'

    df_rome = pd.read_csv(r'C:\Users\uid908086\Downloads\New folder\Timeseries_41.892_12.511_SA3_2000kwp_crystSi_14_36deg.csv',
                          delimiter=';', skiprows=10, skipfooter=12, engine='python')
    df_rome['location'] = 'Rome'

    df = pd.concat([df_dort, df_castel, df_catania, df_rome])
    df['DateTime'] = pd.to_datetime(df['time'], format='%Y-%m-%dT%H:%M:%S')
    df['DateTimeDate'] = df['DateTime'].dt.date
    return df

# Filter data by year and location
def filter_data(df, year_plot):
    return df[(df['DateTime'].dt.year.isin(year_plot))]

# Generate plots
def generate_plots(df):
    df['P_MWh'] = df['P_Wh'] / 1000000
    df_pivot = df.pivot_table(index='DateTimeDate', columns='location', values='P_MWh', aggfunc='sum')

    # Daily cumulative production
    df_pivot.plot(figsize=(20, 10), lw=0.8, title='Daily Cumulative Production (MWh)')
    plt.grid(True)
    plt.show()

    # Hourly production
    df_hourly = df.groupby([df['DateTime'].dt.hour, 'location'])['P_MWh'].sum().unstack()
    df_hourly.plot(figsize=(20, 10), lw=0.8, title='Hourly Production (MWh)')
    plt.grid(True)
    plt.show()

# Battery (BESS) simulation
def simulate_bess(df):
    bess_max_mwh = 2.0
    bess_min_charge_pct = 0.1
    bess_loss = 0.02
    bess_initial_charge = 0.0

    bess_data = []
    start = datetime.now()

    for idx, row in df.iterrows():
        if idx == 0:
            row['bess_charge_start'] = bess_initial_charge
        else:
            row['bess_charge_start'] = bess_data[-1]['bess_charge_end']

        # Charge logic
        if row['P_MWh'] > row['C_MWh']:
            row['bess_available_load'] = max(row['P_MWh'] - row['C_MWh'], 0)
            row['prod_to_bess_hourly_load'] = min(row['bess_available_load'], bess_max_mwh - row['bess_charge_start'])
            row['bess_charge_end'] = row['bess_charge_start'] + row['prod_to_bess_hourly_load']
        else:
            # Discharge logic
            row['bess_available_disch_gross'] = max(row['C_MWh'] - row['P_MWh'], 0)
            row['bess_hourly_loss'] = bess_loss * row['bess_charge_start']
            row['bess_to_consumption_hourly_gross'] = min(row['bess_available_disch_gross'], row['bess_charge_start'] - bess_min_charge_pct * bess_max_mwh)
            row['bess_to_consumption_hourly_net'] = row['bess_to_consumption_hourly_gross'] - row['bess_hourly_loss']
            row['bess_charge_end'] = row['bess_charge_start'] - row['bess_to_consumption_hourly_gross']

        bess_data.append(row)

    df_bess = pd.DataFrame(bess_data)
    df_bess.plot(x='DateTime', y=['bess_charge_start', 'bess_charge_end'], figsize=(20, 10), lw=1.2, title='BESS State of Charge (MWh)')
    plt.grid(True)
    plt.show()

    return df_bess

# Consumption simulation
def simulate_consumption(df):
    def clip_normal_value(loc, scale, min_val, max_val):
        return np.clip(np.random.normal(loc=loc, scale=scale), min_val, max_val)

    df_uc = df[['DateTime']].copy()
    st_dev = 0.050

    df_uc['C_MWh'] = df_uc['DateTime'].apply(lambda x:
        clip_normal_value(0.075, st_dev, 0.050, 0.100) if x.hour in range(1, 7) else
        clip_normal_value(0.200, st_dev, 0.150, 0.300) if x.hour in range(7, 9) else
        clip_normal_value(0.550, st_dev, 0.450, 0.700) if x.hour in range(9, 13) else
        clip_normal_value(0.500, st_dev, 0.400, 0.600) if x.hour in range(13, 15) else
        clip_normal_value(0.150, st_dev, 0.100, 0.200))

    df_uc['G_MWh'] = df_uc['C_MWh'].div(0.9)
    df_uc.set_index('DateTime').plot(figsize=(20, 10), lw=0.5, title='Consumption (MWh)')
    plt.grid(True)
    plt.show()

    print(df_uc.describe())
    print(df_uc.sum())

    df_uc.set_index('DateTime').cumsum().plot(figsize=(20, 10), lw=1.0, title='Cumulated Consumption (MWh)')
    plt.grid(True)
    plt.show()

    return df_uc

# Combine production and consumption
def combine_data(df_prod, df_uc):
    df_tot = pd.merge(df_prod.set_index('DateTime'), df_uc.set_index('DateTime'), how='inner', right_index=True).reset_index()
    df_tot['net_MWh'] = df_tot['P_MWh'] - df_tot['C_MWh']
    df_tot[['net_MWh', 'P_MWh', 'C_MWh']].set_index('DateTime').plot(figsize=(20, 10), lw=1.0, title='Production and Consumption (MWh)')
    plt.grid(True)
    plt.show()

    df_tot.cumsum().plot(figsize=(20, 10), lw=1.0, title='Cumulated (MWh)')
    plt.grid(True)
    plt.show()

    return df_tot

# Main execution
def main():
    df = load_data()
    year_plot = [2020, 2021, 2022]
    df_filtered = filter_data(df, year_plot)
    generate_plots(df_filtered)
    df_uc = simulate_consumption(df_filtered)
    df_bess = simulate_bess(df_filtered)
    combine_data(df_filtered, df_uc)

if __name__ == "__main__":
    main()
