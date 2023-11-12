import * as tf from '@tensorflow/tfjs-node'

interface NormalizationParameters {
  xsMax: tf.Tensor
  xsMin: tf.Tensor
  ysMax: tf.Tensor
  ysMin: tf.Tensor
}

class StockPredictionModel {
  private model: tf.Sequential
  private normalizationParameters: NormalizationParameters | null

  constructor() {
    this.model = tf.sequential()
    this.model.add(tf.layers.dense({ units: 10, inputShape: [1], activation: 'linear' }))
    this.model.add(tf.layers.dense({ units: 1, activation: 'linear' }))
    this.model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' })

    // Set TensorFlow.js logging level to suppress progress indicators
    process.env.TF_CPP_MIN_LOG_LEVEL = '1' // '1' corresponds to 'warn'

    this.normalizationParameters = null
  }

  async train(data: number[]): Promise<void> {
    // Prepare training data
    const xs = tf.tensor1d(data.slice(0, -1))
    const ys = tf.tensor1d(data.slice(1))

    // Normalize the data
    const xsMax = xs.max()
    const xsMin = xs.min()
    const ysMax = ys.max()
    const ysMin = ys.min()

    const normalizedXs = xs.sub(xsMin).div(xsMax.sub(xsMin))
    const normalizedYs = ys.sub(ysMin).div(ysMax.sub(ysMin))

    // Train the model
    await this.model.fit(normalizedXs, normalizedYs, { epochs: 100, verbose: 0 })

    // Save normalization parameters for future predictions
    this.normalizationParameters = {
      xsMax,
      xsMin,
      ysMax,
      ysMin,
    }
  }

  predict(data: number): number {
    if (!this.normalizationParameters) {
      throw new Error('Model not trained yet. Please train the model before making predictions.')
    }

    // Normalize input data
    const normalizedData =
      (data - this.normalizationParameters.xsMin.dataSync()[0]) /
      (this.normalizationParameters.xsMax.dataSync()[0] - this.normalizationParameters.xsMin.dataSync()[0])

    // Make a prediction
    const input = tf.tensor2d([[normalizedData]])
    const prediction = this.model.predict(input) as tf.Tensor
    const denormalizedPrediction = prediction
      .mul(this.normalizationParameters.ysMax.sub(this.normalizationParameters.ysMin))
      .add(this.normalizationParameters.ysMin)

    return denormalizedPrediction.dataSync()[0]
  }
}

export default StockPredictionModel
