import * as dotenv from 'dotenv';
import StockDataService from './services/stockDataService';
import PredictionService from './services/predictionService';
import FileUtils from './utils/fileUtils';
import {DataProvider} from "./data/dataProvider";
import {PredictionResult} from "./data/predictionResult";

dotenv.config();

async function main() {
    const symbols = ['AAPL', 'GOOG', 'MSFT', 'AMZN', 'FB', 'TSLA', 'NVDA', 'PYPL', 'ADBE', 'NFLX'];
    let results: PredictionResult[] = [];

    for(const symbol of symbols) {
        try {
            const result = await predict(symbol);
            results.push(result);
        }
        catch (error: any) {
            console.log(`Prediction for ${symbol} Failed!`, error.message);
        }
    }

    console.log(results);
}

async function predict(symbol: string): Promise<PredictionResult> {
    const stockDataService = new StockDataService(DataProvider.POLYGON_IO);
    const predictionService = new PredictionService();

    try {
        const stockData = await stockDataService.getStockData(symbol);

        // Train the model
        await predictionService.trainModel(stockData);

        // Make a prediction for the next day
        const lastDayPrice = stockData[stockData.length - 1];
        const nextDayPrediction = predictionService.makePrediction(lastDayPrice);

        const stockFullName = await stockDataService.getStockFullName(symbol);

        //console.log(`[${stockFullName}] Predicted next day's closing price: ${nextDayPrediction}`);

        // Save the model to a file (for demonstration purposes)
        FileUtils.saveToFile(predictionService, `.trained/${symbol}-prediction-model.json`);

        return (new PredictionResult(symbol, stockFullName, nextDayPrediction));
    } catch (error: any) {
        throw new Error(`Error predicting stock price: ${error.message}`);
    }
}

main();
