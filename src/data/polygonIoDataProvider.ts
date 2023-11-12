import axios from 'axios'
import DataProviderInterface from './dataProvider.interface'

class PolygonIoDataProvider implements DataProviderInterface {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = String(process.env.POLIGON_API_KEY || '')
    this.baseUrl = 'https://api.polygon.io'
  }

  async getStockData(symbol: string): Promise<number[]> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/v2/aggs/ticker/${symbol}/range/1/day/20220101/${
          new Date().toISOString().split('T')[0]
        }?apiKey=${this.apiKey}`,
      )

      const results = response.data.results
      const closingPrices = results.map((dailyData: any) => dailyData.c)

      return closingPrices.reverse() // Reverse the array to get oldest to newest
    } catch (error: any) {
      throw new Error(`Error fetching stock data from Polygon.io: ${error.message}`)
    }
  }

  async getStockFullName(symbol: string): Promise<string> {
    try {
      const response = await axios.get(`${this.baseUrl}/v3/reference/tickers/${symbol}?apiKey=${this.apiKey}`)
      const fullName = response.data.results.name || 'N/A'

      return fullName
    } catch (error: any) {
      return symbol
      throw new Error(`Error fetching ${symbol}'s stock full name from Polygon.io: ${error.message}`)
    }
  }

  async getCurrentPrice(symbol: string): Promise<number> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/v1/open-close/${symbol}/${this.getLastBusinessDay()}?adjusted=true&apiKey=${this.apiKey}`,
      )
      const price = parseFloat(response.data.close)
      return price
    } catch (error: any) {
      throw new Error(`Error fetching current price from Polygon.io: ${error.message}`)
    }
  }

  private getLastBusinessDay(): string {
    const today = new Date()

    // Check if today is a weekend (Saturday or Sunday)
    while (today.getDay() === 0 || today.getDay() === 6) {
      today.setDate(today.getDate() - 1) // Go back one day
    }

    // Format the date as "yyyy-mm-dd"
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }
}

export default PolygonIoDataProvider
