# Stock Market Forecast
## Introduction
Stocks closing value forecast using machine learning models. The models used are:
* Tensorflow LSTM

## Data
The data providers supported for now are:
* [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
* [Polygon.io](https://polygon.io/)
* [Yahoo Finance](https://finance.yahoo.com/)
 
You need to register an API key from one of these providers

Save your key into .env file as `ALPHA_VANTAGE_API_KEY=your_api_key` (see .env.template)

# Usage
## Install dependencies
```bash
npm install
```
To run the app:
```bash
npm start
```
