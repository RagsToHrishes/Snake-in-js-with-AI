import * as snake from "./snake.js";
import * as AI from "./ai.js";

//Canvas and document information
const c = document.getElementById("can");
const ctx = c.getContext("2d");
const width = can.width;
const height = can.height;
const state = document.getElementById("state");
const score = document.getElementById("score");
const restart1 = document.getElementById("restart");
let model;
let numOfNoSurvive = 0;
let numOfWrongDir= 0;
let numOfRightDir = 0;

//Global constants:
let end = false;
const rez = 20;

//Features to keep track of:
let obsleft
let obsright
let obsfront

//utility functions:
function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }
    var max = arr[0];
    var maxIndex = 0;
    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}

function randomIntFromInterval(min, max) // min and max included
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}

//restart function:
function restart() {
    snake1.body = [];
    snake1.body[0] = [0, 0];
    snake1.dirx = rez;
    snake1.diry = 0;
    snake1.len = 1;
    end = false;
    state.innerHTML = "Have Fun!";
    score.innerHTML = "0";
    food1.x = Math.floor((Math.random() * (width)) / rez) * rez;
    food1.y = Math.floor((Math.random() * (height)) / rez) * rez;

}

restart1.onclick = restart;

let dir;

//Input handling
function press(evt) {
    if (evt.key == "w") {
        if (snake1.diry != rez) {
            snake1.diry = -rez;
            snake1.dirx = 0;
            dir = "u";
        }
    } else if (evt.key == "s") {
        if (snake1.diry != -rez) {
            snake1.diry = rez;
            snake1.dirx = 0;
            dir = "d";
        }
    } else if (evt.key == "a") {
        if (snake1.dirx != rez) {
            snake1.diry = 0;
            snake1.dirx = -rez;
            dir = "l";
        }
    } else if (evt.key == "d") {
        if (snake1.dirx != -rez) {
            snake1.diry = 0;
            snake1.dirx = rez;
            dir = "r";
        }
    }

}
//document.addEventListener("keydown", press, false);

//Food class:
class Food {
    constructor() {
        this.x = Math.floor((Math.random() * (width)) / rez) * rez;
        this.y = Math.floor((Math.random() * (height)) / rez) * rez;
        console.log(this.x, this.y);

        this.width = rez;
        this.height = rez;
    }

    update() {
        for (let i = 0; i < snake1.body.length; i++) {
            if (snake1.body[i][0] == this.x && snake1.body[i][1] == this.y || end == true) {
                this.x = Math.floor((Math.random() * (width)) / rez) * rez;
                this.y = Math.floor((Math.random() * (height)) / rez) * rez;
                snake1.grow();
                score.innerHTML = (parseInt(score.innerHTML) + 1).toString();
                return true;
            }
        }

        return false;
    }

    show() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

}


//Creating the objects in the game:
let snake1 = new snake.Snake();
let food1 = new Food();



function update() {
    let score;

    if (snake1.endGame()) {
        state.innerHTML = "Game Over"
        end = true;
        score = -1;
    } else if (!end) {
        let head = snake1.body[snake1.body.length - 1];
        let hx = head[0];
        let hy = head[1];
        let fx = food1.x;
        let fy = food1.y;
        let eat = false;
        let prevlen = snake1.len;
        let distB = Math.sqrt((Math.pow((fx-hx), 2)) + (Math.pow(fy-hy,2)));
        snake1.update();
        if(food1.update()){
            eat = true;
        }
        head = snake1.body[snake1.body.length - 1];
        hx = head[0];
        hy = head[1];
        fx = food1.x;
        fy = food1.y;
        let newlen = snake1.len;
        let distA = Math.sqrt((Math.pow((fx-hx), 2)) + (Math.pow(fy-hy,2)));
        console.log(hx, hy, fx, fy, distA, distB);
        if(distA < distB || newlen > prevlen){
            score = 1;
        }else{
            score = 0;
        }
    }

    return score;
}

function draw() {
    if (end) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, width, height);
    } else {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, width, height);
        snake1.show();
        food1.show();
    }
}

function findingLeftRightFront() {
    //Get the features and information around the snake
    let features = [0, 0, 0];
    let head = snake1.body[snake1.body.length - 1];
    let hr;
    let hl;
    let hf;
    //set direction ****
    if (snake1.dirx == rez && snake1.diry == 0) {
        dir = "r";
    }
    if (snake1.dirx == -rez && snake1.diry == 0) {
        dir = "l";
    }
    if (snake1.dirx == 0 && snake1.diry == rez) {
        dir = "d";
    }
    if (snake1.dirx == 0 && snake1.diry == -rez) {
        dir = "u";
    }

    //Find left right and forward based on direction
    switch (dir) {
        case "u":
            hr = [head[0] + rez, head[1]];
            hl = [head[0] - rez, head[1]];
            hf = [head[0], head[1] - rez];
            break;
        case "d":
            hr = [head[0] - rez, head[1]];
            hl = [head[0] + rez, head[1]];
            hf = [head[0], head[1] + rez];
            break;
        case "l":
            hr = [head[0], head[1] - rez];
            hl = [head[0], head[1] + rez];
            hf = [head[0] - rez, head[1]];
            break;
        case "r":
            hr = [head[0], head[1] + rez];
            hl = [head[0], head[1] - rez];
            hf = [head[0] + rez, head[1]];
            break;
    }

    //Body part
    //right, left, forward
    for (let i = 0; i < snake1.body.length - 1; i++) {
        let part = snake1.body[i];
        if (part[0] == hr[0] && part[1] == hr[1]) {
            features[0] = 1;
        }
        if (part[0] == hl[0] && part[1] == hl[1]) {
            features[1] = 1;
        }
        if (part[0] == hf[0] && part[1] == hf[1]) {
            features[2] = 1;
        }
    }

    //Boundaries
    if (hr[0] >= width || hr[0] < 0 || hr[1] >= height || hr[1] < 0) {
        features[0] = 1;
    }
    if (hl[0] >= width || hl[0] < 0 || hl[1] >= height || hl[1] < 0) {
        features[1] = 1;
    }
    if (hf[0] >= width || hf[0] < 0 || hf[1] >= height || hf[1] < 0) {
        features[2] = 1;
    }

    return features;
}

function findAngleToFood() {
    let head = snake1.body[snake1.body.length - 1];
    let hx = head[0];
    let hy = head[1];
    let fx = food1.x;
    let fy = food1.y;
    let dirx = snake1.dirx;
    let diry = snake1.diry;

    //get two vectors a and b: a - unit vector direction of snake, b - unit vector direction from head to food
    let a = [(dirx+hx) - hx, (diry+hy) - hy];
    let b = [fx - hx, fy - hy];



    let dista = Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2));
    let distb = Math.sqrt(Math.pow(b[0], 2) + Math.pow(b[1], 2));


    a = [(a[0]/ dista), (a[1]/dista)];
    b = [(b[0]/ distb), (b[1]/distb)];

    dista = Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2));
    distb = Math.sqrt(Math.pow(b[0], 2) + Math.pow(b[1], 2));

    //cos0 = x/y

    let x = (a[0] * b[0]) + (a[1] * b[1]);
    let y = dista * distb;


    let angle = Math.acos(x / y) / (Math.PI);
    if(Number.isNaN(angle)){
        console.log("CHECK");
        angle = 0;
    }

    console.log(angle);

    return angle;
}

function moveSnakeOnValue(val) {
    if (val == 0) {
        console.log("right");
        switch (dir) {
            case "u":
                snake1.diry = 0;
                snake1.dirx = rez;
                break;
            case "d":
                snake1.diry = 0;
                snake1.dirx = -rez;
                break;
            case "l":
                snake1.diry = -rez;
                snake1.dirx = 0;
                break;
            case "r":
                snake1.diry = rez;
                snake1.dirx = 0;
                break;
        }
    }
    if (val == 1) {
        console.log("left");
        switch (dir) {
            case "u":
                snake1.diry = 0;
                snake1.dirx = -rez;
                break;
            case "d":
                snake1.diry = 0;
                snake1.dirx = rez;
                break;
            case "l":
                snake1.diry = rez;
                snake1.dirx = 0;
                break;
            case "r":
                snake1.diry = -rez;
                snake1.dirx = 0;
                break;
        }
    }
    if (val == 2) {
        console.log("forward");
        switch (dir) {
            case "u":
                snake1.diry = -rez;
                snake1.dirx = 0;
                break;
            case "d":
                snake1.diry = rez;
                snake1.dirx = 0;
                break;
            case "l":
                snake1.diry = 0;
                snake1.dirx = -rez;
                break;
            case "r":
                snake1.diry = 0;
                snake1.dirx = rez;
                break;
        }
    }
}

function gameloop() {
    if (!end) {
        //fix after generating data
        let featuresr = findingLeftRightFront();
        featuresr.push(findAngleToFood());
        featuresr.push(0);


        let featuresl = findingLeftRightFront();
        featuresl.push(findAngleToFood());
        featuresl.push(1);

        let featuresf = findingLeftRightFront();
        featuresf.push(findAngleToFood());
        featuresf.push(2);

        let outputr1 = AI.predict(tf.tensor2d([featuresr]));


        let outputl1 = AI.predict(tf.tensor2d([featuresl]));


        let outputf1 = AI.predict(tf.tensor2d([featuresf]));

        let outputr = outputr1.dataSync();
        let outputl = outputl1.dataSync();
        let outputf = outputf1.dataSync();

        let outputs = [outputr[0], outputl[0], outputf[0]];

        console.log(featuresr, featuresl, featuresf);
        console.log(outputs);
        let i = indexOfMax(outputs);
        console.log(i);

        console.log(snake1.body[0]);
        moveSnakeOnValue(i);


        //find max from output and set snake direction
        let score = update();
        draw();
    } else {
        food1.update();
        restart();
    }
}

export async function generateTrainingData() {
    let dataToTrain = [];
    let inputdata = [];
    let outputdata = [];

    for (let i = 0; i < 5000; i++) {
        while (!end) {
            //generate input data [right, left, front, angle to food, suggested direction]
            let score = update();
            let f1 = findingLeftRightFront();
            f1.push(findAngleToFood());
            let dir = randomIntFromInterval(0, 2);
            f1.push(dir);

            //0 - right, 1 - left, 2- forward

            //move the snake using the suggested direction and get output
            moveSnakeOnValue(dir);
            if(score == -1){
                numOfNoSurvive++;
            }else if(score == 0){
                numOfWrongDir++;
            }else if(score == 1){
                numOfRightDir++;
            }

            //update data
            inputdata.push(f1);
            outputdata.push([score]);
        }
        restart();
    }

    dataToTrain.push(inputdata, outputdata);
    console.log(dataToTrain);
    return dataToTrain;
}

async function first() {
    //order of runtime
    //model = await tf.loadLayersModel('/My NN model/my-amazingmodel.json');
    let inputs;
    let outputs;

    await generateTrainingData().then((data) => {
        console.log(data[0]);
        console.log(data[1]);
        inputs = tf.tensor2d(data[0]);
        outputs = tf.tensor2d(data[1]);
    });
    console.log(numOfNoSurvive,numOfWrongDir,numOfRightDir);
    console.log(tf.memory().numTensors);
    await AI.train(inputs, outputs);
    window.setInterval(gameloop, 1000/8);
    //await AI.model.save('downloads://my-amazingmodel');
}



first();