import * as dotenv from 'dotenv'
import StockDataService from './services/stockDataService'
import PredictionService from './services/predictionService'
import FileUtils from './utils/fileUtils'
import { DataProvider } from './data/dataProvider'
import { PredictionResult } from './data/predictionResult'
import * as kleur from 'kleur'

dotenv.config()

async function main() {
  const symbols = ['AAPL', 'GOOG', 'MSFT', 'AMZN', 'META', 'TSLA', 'NVDA', 'PYPL', 'ADBE', 'NFLX']
  const results: PredictionResult[] = []

  for (const symbol of symbols) {
    try {
      console.log(`[${symbol}] ${kleur.blue('Predicting...')}`)
      const result = await predict(symbol)
      results.push(result)
      console.log(`[${result.name}] ${kleur.green('RESULTS:')}`)
      console.log(
        kleur.bgMagenta(`[${result.name}] Predicted next day's closing price: ${result.resultAmount.toFixed(2)}`),
      )
      console.log(kleur.grey(`[${result.name}] Current price: ${result.currentPrice.toFixed(2)}`))

      const difference = ((result.resultAmount - result.currentPrice) / result.currentPrice) * 100
      if (difference >= 0) {
        console.log(kleur.green(`[${result.name}] Difference: ${difference.toFixed(2)}%`))
      } else {
        console.log(kleur.red(`[${result.name}] Difference: ${difference.toFixed(2)}%`))
      }
    } catch (error: any) {
      console.log(`Prediction for ${symbol} Failed!`, error.message)
    }
  }
}

async function predict(symbol: string): Promise<PredictionResult> {
  const stockDataService = new StockDataService(DataProvider.YAHOO_FINANCE)
  const predictionService = new PredictionService()

  try {
    const stockData = await stockDataService.getStockData(symbol)

    // Train the model
    await predictionService.trainModel(stockData)

    // Make a prediction for the next day
    const lastDayPrice = stockData[stockData.length - 1]
    const nextDayPrediction = predictionService.makePrediction(lastDayPrice)

    const stockFullName = await stockDataService.getStockFullName(symbol)

    //console.log(`[${stockFullName}] Predicted next day's closing price: ${nextDayPrediction}`);

    // Save the model to a file (for demonstration purposes)
    //FileUtils.saveToFile(predictionService, `trained/${symbol}-prediction-model.json`);
    const currentPrice = await stockDataService.getCurrentPrice(symbol)

    return new PredictionResult(symbol, stockFullName, nextDayPrediction, currentPrice)
  } catch (error: any) {
    throw new Error(`Error predicting stock price: ${error.message}`)
  }
}

main()
