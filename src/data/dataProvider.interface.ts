interface DataProviderInterface {
  getStockData(symbol: string): Promise<number[]>
  getStockFullName(symbol: string): Promise<string>
  getCurrentPrice(symbol: string): Promise<number>
}

export default DataProviderInterface
