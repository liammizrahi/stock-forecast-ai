import axios from 'axios';
import DataProviderInterface from "./dataProvider.interface";

class PolygonIoDataProvider implements DataProviderInterface {
    private apiKey: string;
    private baseUrl: string;

    constructor() {
        this.apiKey = String(process.env.POLIGON_API_KEY || '');
        this.baseUrl = 'https://api.polygon.io';
    }

    async getStockData(symbol: string): Promise<number[]> {
        try {
            const response = await axios.get(`${this.baseUrl}/v2/aggs/ticker/${symbol}/range/1/day/20220101/${new Date().toISOString().split('T')[0]}?apiKey=${this.apiKey}`);

            const results = response.data.results;
            const closingPrices = results.map((dailyData: any) => dailyData.c);

            return closingPrices.reverse(); // Reverse the array to get oldest to newest
        } catch (error: any) {
            throw new Error(`Error fetching stock data from Polygon.io: ${error.message}`);
        }
    }

    async getStockFullName(symbol: string): Promise<string> {
        try {
            const response = await axios.get(`${this.baseUrl}/v3/reference/tickers/${symbol}?apiKey=${this.apiKey}`);
            const fullName = response.data.results.name || 'N/A';

            return fullName;
        } catch (error: any) {
            return symbol;
            throw new Error(`Error fetching ${symbol}'s stock full name from Polygon.io: ${error.message}`);
        }
    }
}

export default PolygonIoDataProvider;
