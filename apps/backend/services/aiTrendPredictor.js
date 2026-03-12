import * as tf from "@tensorflow/tfjs";

/* ======================================================
   TRAIN MODEL
====================================================== */
export async function trainTrendModel(history) {
  if (!history.length) return null;

  const xs = history.map((h, i) => i);
  const ys = history.map((h) => h.sales);

  const xsTensor = tf.tensor(xs);
  const ysTensor = tf.tensor(ys);

  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 16, inputShape: [1] }));
  model.add(tf.layers.dense({ units: 1 }));

  model.compile({
    optimizer: "adam",
    loss: "meanSquaredError",
  });

  await model.fit(xsTensor, ysTensor, {
    epochs: 100,
    verbose: 0,
  });

  return model;
}

/* ======================================================
   PREDICT NEXT SALES
====================================================== */
export async function predictNext(history) {
  if (history.length < 3) return 0;

  const model = await trainTrendModel(history);

  const nextX = tf.tensor([history.length]);
  const pred = model.predict(nextX);

  return Math.round(pred.dataSync()[0]);
}