export class PredictionResult {
    public symbol: string;
    public name: string;
    public resultAmount: number;

    constructor(symbol: string, name: string, resultAmount: number) {
        this.symbol = symbol;
        this.name = name;
        this.resultAmount = resultAmount;
    }
}
