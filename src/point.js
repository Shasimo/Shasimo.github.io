class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        /*
        // simulates bracket overload and keeps accessing '.x/y' available
        return new Proxy(this, {
            get(target, prop) {
                if (prop === "0") return target.x;
                if (prop === "1") return target.y;
                return target[prop]; // Allow normal property access
            },
        });*/
    }

    equals(other) {
        return this.x === other.x && this.y === other.y;
    }

    add(other) {
        return new Point(this.x + other.x, this.y + other.y);
    }

    sub(other) {
        return new Point(this.x - other.x, this.y - other.y);
    }

    dot(other) {
        return this.x * other.x + this.y * other.y;
    }

    norm() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    copy() {
        return new Point(this.x, this.y);
    }

    draw(sketch, color, size) {
        sketch.fill(color);
        sketch.stroke(color);
        sketch.ellipse(this.x, this.y, size, size);
        sketch.fill("black");
        sketch.stroke("black");
    }

    rotate(angle, origin) {
        this.x -= origin.x;
        this.y -= origin.y;
        let oldX = this.x;
        let oldY = this.y;
        this.x = Math.round(oldX * Math.cos(angle) - oldY * Math.sin(angle));
        this.y = Math.round(oldX * Math.sin(angle) + oldY * Math.cos(angle));
        this.x += origin.x;
        this.y += origin.y;
        return this;
    }
}
