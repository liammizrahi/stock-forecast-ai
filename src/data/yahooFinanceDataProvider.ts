// src/data/yahooFinanceDataProvider.ts
import axios from 'axios'
import DataProviderInterface from './dataProvider.interface'

class YahooFinanceDataProvider implements DataProviderInterface {
  private baseUrl: string

  constructor() {
    this.baseUrl = 'https://query1.finance.yahoo.com/v8/finance/chart'
  }

  async getStockData(symbol: string): Promise<number[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/${symbol}`)
      const result = response.data.chart.result[0]
      const closingPrices = result.indicators.quote[0].close

      return closingPrices.reverse()
    } catch (error: any) {
      throw new Error(`Error fetching stock data from Yahoo Finance: ${error.message}`)
    }
  }

  async getStockFullName(symbol: string): Promise<string> {
    try {
      const response = await axios.get(`https://finance.yahoo.com/quote/${symbol}`)
      const start = response.data.indexOf('<title>') + 7
      const end = response.data.indexOf('</title>')
      const fullName = response.data.substring(start, end).split(' (')[0]

      return fullName
    } catch (error: any) {
      throw new Error(`Error fetching stock full name from Yahoo Finance: ${error.message}`)
    }
  }

  async getCurrentPrice(symbol: string): Promise<number> {
    try {
      const response = await axios.get(`${this.baseUrl}/${symbol}`)
      const result = response.data.chart.result[0]
      const price = result.indicators.quote[0].close[result.indicators.quote[0].close.length - 1]
      return price
    } catch (error: any) {
      throw new Error(`Error fetching current price from Yahoo Finance: ${error.message}`)
    }
  }
}

export default YahooFinanceDataProvider
