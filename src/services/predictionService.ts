import StockPredictionModel from '../models/stockPredictionModel';

class PredictionService {
    private model: StockPredictionModel;

    constructor() {
        this.model = new StockPredictionModel();
    }

    async trainModel(data: number[]): Promise<void> {
        await this.model.train(data);
    }

    makePrediction(data: number): number {
        return this.model.predict(data);
    }
}

export default PredictionService;
