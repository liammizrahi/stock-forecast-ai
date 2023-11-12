export class PredictionResult {
  public symbol: string
  public name: string
  public resultAmount: number
  public currentPrice: number

  constructor(symbol: string, name: string, resultAmount: number, currentPrice: number) {
    this.symbol = symbol
    this.name = name
    this.resultAmount = resultAmount
    this.currentPrice = currentPrice
  }
}
