import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';

let model: use.UniversalSentenceEncoder | null = null;

export async function loadModel() {
  if (!model) {
    model = await use.load();
  }
  return model;
}

export async function embedText(text: string): Promise<tf.Tensor2D> {
  const model = await loadModel();
  const embeddings = await model.embed([text]);
  return embeddings as tf.Tensor2D;
}

export async function getSimilarity(text1: string, text2: string): Promise<number> {
  const [embedding1, embedding2] = await Promise.all([
    embedText(text1),
    embedText(text2)
  ]);
  
  const similarity = tf.tidy(() => {
    const distance = tf.losses.cosineDistance(embedding1, embedding2, 0);
    return distance.dataSync()[0];
  });
  
  // Clean up tensors
  tf.dispose([embedding1, embedding2]);
  
  return 1 - similarity;
}
