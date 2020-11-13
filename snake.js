//Canvas and document information
const c = document.getElementById("can");
const ctx = c.getContext("2d");
const width = can.width;
const height = can.height;
const rez = 20;

export class Snake {
    constructor() {
        this.body = [];
        this.body[0] = [0, 0];
        this.pressUp = false;
        this.pressDown = false;
        this.pressLeft = false;
        this.pressRight = false;
        this.dirx = rez;
        this.diry = 0;
        this.len = 1;
    }

    update() {
        let head = [...this.body[this.body.length - 1]];
        this.body.shift();
        head[0] += this.dirx;
        head[1] += this.diry;
        this.body.push(head);
    }

    endGame() {
        let x = this.body[this.body.length - 1][0];
        let y = this.body[this.body.length - 1][1];

        if (x >= width || x < 0 || y >= height || y < 0) {
            console.log("beep");
            return true;
        }

        for (let i = 0; i < this.body.length - 1; i++) {
            let part = this.body[i];
            if (part[0] == x && part[1] == y) {
                return true;

            }
        }
        return false;
    }

    show() {
        for (let i = 0; i < this.body.length; i++) {
            ctx.fillStyle = "black";
            ctx.fillRect(this.body[i][0], this.body[i][1], rez, rez);
        }
    }

    grow() {
        let head = [...this.body[this.body.length - 1]];
        this.len++;
        head[0] += this.dirx;
        head[1] += this.diry;
        this.body.push(head);
    }

}