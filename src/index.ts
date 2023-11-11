import * as dotenv from 'dotenv';
import StockDataService from './services/stockDataService';
import PredictionService from './services/predictionService';
import FileUtils from './utils/fileUtils';

dotenv.config();

async function main() {
    const apiKey: string = String(process.env.ALPHA_VANTAGE_API_KEY || '');
    const symbols = ['AAPL', 'GOOG', 'MSFT', 'AMZN', 'FB', 'TSLA', 'NVDA', 'PYPL', 'ADBE', 'NFLX'];

    for(const symbol of symbols) {
        await predict(symbol, apiKey);
    }
}

async function predict(symbol: string, apiKey: string) {
    const stockDataService = new StockDataService(apiKey);
    const predictionService = new PredictionService();

    try {
        const stockData = await stockDataService.getStockData(symbol);

        // Train the model
        await predictionService.trainModel(stockData);

        // Make a prediction for the next day
        const lastDayPrice = stockData[stockData.length - 1];
        const nextDayPrediction = predictionService.makePrediction(lastDayPrice);

        const getStockFullName = await stockDataService.getStockFullName(symbol);

        console.log(`[${getStockFullName}] Predicted next day's closing price: ${nextDayPrediction}`);

        // Save the model to a file (for demonstration purposes)
        FileUtils.saveToFile(predictionService, 'predictionModel.json');
    } catch (error: any) {
        console.error('Error:', error.message);
    }
}

main();
