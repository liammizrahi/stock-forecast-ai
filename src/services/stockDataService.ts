import AlphaAdvantageDataProvider from '../data/alphaAdvantageDataProvider';
import {DataProvider} from "../data/dataProvider";
import DataProviderInterface from "../data/dataProvider.interface";
import PolygonIoDataProvider from "../data/polygonIoDataProvider";

class StockDataService {
    private dataProvider: DataProviderInterface;

    constructor(dataProvider: DataProvider) {
        switch(dataProvider) {
            case DataProvider.ALPHA_VANTAGE:
                this.dataProvider = new AlphaAdvantageDataProvider();
                break;
            case DataProvider.POLYGON_IO:
                this.dataProvider = new PolygonIoDataProvider();
                break;
            default:
                throw new Error(`Invalid data provider: ${dataProvider}`);
        }
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
