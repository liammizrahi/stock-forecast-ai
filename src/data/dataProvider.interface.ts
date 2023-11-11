interface DataProviderInterface {
    getStockData(symbol: string): Promise<number[]>;
    getStockFullName(symbol: string): Promise<string>;
}

export default DataProviderInterface;
