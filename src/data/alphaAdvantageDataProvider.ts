import axios from 'axios';
import DataProviderInterface from "./dataProvider.interface";

class AlphaAdvantageDataProvider implements DataProviderInterface {
    private apiKey: string;
    private baseUrl: string;

    constructor() {
        this.apiKey = String(process.env.ALPHA_VANTAGE_API_KEY || '');
        this.baseUrl = 'https://www.alphavantage.co/query';
    }

    async getStockData(symbol: string): Promise<number[]> {
        try {
            const response = await axios.get(this.baseUrl, {
                params: {
                    function: 'TIME_SERIES_DAILY',
                    symbol: symbol,
                    apikey: this.apiKey,
                },
            });

            const timeSeriesData = response.data['Time Series (Daily)'];
            const closingPrices = Object.values(timeSeriesData).map((dailyData: any) => parseFloat(dailyData['4. close']));

            return closingPrices.reverse(); // Reverse the array to get oldest to newest
        } catch (error: any) {
            throw new Error(`Error fetching stock data: ${error.message}`);
        }
    }

    async getStockFullName(symbol: string): Promise<string> {
        try {
            const response = await axios.get(this.baseUrl, {
                params: {
                    function: 'SYMBOL_SEARCH',
                    keywords: symbol,
                    apikey: this.apiKey,
                },
            });

            const bestMatch = response.data.bestMatches[0];
            const fullName = bestMatch ? bestMatch['2. name'] : 'N/A';

            return fullName;
        } catch (error: any) {
            throw new Error(`Error fetching stock full name: ${error.message}`);
        }
    }
}

export default AlphaAdvantageDataProvider;
