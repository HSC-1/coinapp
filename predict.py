import requests
from statsmodels.tsa.arima_model import ARIMA
import pandas as pd
def Predict(coinname: str):
    url = "https://api.upbit.com/v1/candles/days"
    querystring = {"market":coinname,"count":"365","convertingPriceUnit":"KRW"}
    response = requests.request("GET", url, params=querystring)
    date = min(len(response.json()),365)
    a = []
    b = []
    for i in range(date):
        c = response.json()[date-i-1]['trade_price']
        a.append(c)
        c = response.json()[date-i-1]['candle_date_time_kst'].split("T")[0]
        b.append(c)
    fu_list = []
    for i in range(3):
        fu_list.append(c[:-2]+str(int(c[-2:])+i+1))
    aa = pd.DataFrame(a,index=b,columns=['close'])
    model = ARIMA(a, order=(1,1,0))
    fitting = model.fit(disp=-1)
    fc, se, conf = fitting.forecast(3, alpha=0.05)
    low = list(map(lambda x: conf[:][x][0],range(3)))
    up = list(map(lambda x: conf[:][x][1],range(3)))
    predi = pd.DataFrame([low,fc,up],index=fu_list,columns=['prediction_low','prediction','prediction_high'])
    return aa,predi