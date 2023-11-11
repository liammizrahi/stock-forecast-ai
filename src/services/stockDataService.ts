// src/services/stockDataService.ts
import AlphaAdvantageDataProvider from '../data/alphaAdvantageDataProvider';

class StockDataService {
    private dataProvider: AlphaAdvantageDataProvider;

    constructor(apiKey: string) {
        this.dataProvider = new AlphaAdvantageDataProvider(apiKey);
    }

    async getStockData(symbol: string): Promise<number[]> {
        try {
            const stockData = await this.dataProvider.getStockData(symbol);
            return stockData;
        } catch (error: any) {
            throw new Error(`Error getting stock data: ${error.message}`);
        }
    }

    async getStockFullName(symbol: string): Promise<string> {
        try {
            const stockFullName = await this.dataProvider.getStockFullName(symbol);
            return stockFullName;
        } catch (error: any) {
            throw new Error(`Error getting stock full name: ${error.message}`);
        }
    }
}

export default StockDataService;
