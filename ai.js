//import * as game from "/game.js";

//Canvas and document information
const c = document.getElementById("can");
const ctx = c.getContext("2d");
const width = can.width;
const height = can.height;
const learningrate = 0.01;

/*
Features:
    - The obstacle on the right of the snake head
    - The obstacle on the left of the snake head
    - The obstacle in front of the snake head
    - Suggested direction
    So far, these features keep the snake from dying

    - The normalized angle between the snake head and the food
    This makes the score go up
*/

//Making the model:

export const model = tf.sequential();
model.add(tf.layers.dense({ inputShape: [5], units: 25, activation: 'relu' })); // Hidden
model.add(tf.layers.dense({ units: 1, activation: 'linear' })); // Output
const sgdOpt = tf.train.sgd(learningrate);
const config = {
    optimizer: "adam",
    loss: "meanSquaredError"
}
model.compile(config);

export async function train(inputs, outputs) {
    console.log(inputs.print(), outputs.print());
    let history = await model.fit(inputs, outputs, {
        batchSize: 32,
        epochs: 3,
        shuffle: true,
        callbacks: {onEpochEnd: (epoch, logs) => console.log("epoch:", epoch, logs.loss)}
      });

    inputs.dispose();
    outputs.dispose();
    console.log(history.history.loss[0]);
    console.log("Num: ", tf.memory().numTensors);
    console.log("training completed");
}


export function predict(input) {
    return model.predict(input);
}