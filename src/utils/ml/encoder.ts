import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';

let model: use.UniversalSentenceEncoder | null = null;

export async function loadModel() {
  if (!model) {
    model = await use.load();
  }
  return model;
}

export async function embedText(text: string): Promise<tf.Tensor> {
  const model = await loadModel();
  const embedding = await model.embed(text);
  return embedding;
}

export async function getSimilarity(text1: string, text2: string): Promise<number> {
  const embeddings = await Promise.all([
    embedText(text1),
    embedText(text2)
  ]);
  
  const similarity = tf.losses.cosineDistance(
    embeddings[0], 
    embeddings[1],
    0
  );
  
  const score = await similarity.data();
  
  embeddings.forEach(e => e.dispose());
  similarity.dispose();
  
  return 1 - score[0];
}
