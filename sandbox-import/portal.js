class PortalEnd {
    constructor(fragment, vertexIdx1, vertexIdx2) {
        this.fragment = fragment;
        this.edge = [vertexIdx1, vertexIdx2];
    }

    isMainVertexIdx(vertexIdx) {
        return vertexIdx === this.getMainVertexIdx();
    }

    getMainVertexIdx() {
        if ((this.edge[0] + 1) % this.fragment.vertices.length === this.edge[1])
            return this.edge[0];
        return this.edge[1];
    }

    getLength() {
        let p1 = this.fragment.vertices[this.edge[0]];
        let p2 = this.fragment.vertices[this.edge[1]];
        return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
    }

    reverse() {
        let temp = this.edge[0];
        this.edge[0] = this.edge[1];
        this.edge[1] = temp;
    }

    draw(sketch) {
        let p1 = this.fragment.vertices[this.edge[0]].add(this.fragment.origin);
        let p2 = this.fragment.vertices[this.edge[1]].add(this.fragment.origin);

        // https://stackoverflow.com/a/44892083
        sketch.line(p1.x, p1.y, p2.x, p2.y); //draw a line beetween the vertices

        // this code is to make the arrow point
        sketch.push(); //start new drawing state
        let angle = Math.atan2(p1.y - p2.y, p1.x - p2.x); //gets the angle of the line
        sketch.translate(p2.x, p2.y); //translates to the destination vertex
        sketch.rotate(angle - sketch.HALF_PI); //rotates the arrow point
        sketch.triangle(
            -ARROW_HEAD_SIZE * 0.5,
            ARROW_HEAD_SIZE,
            ARROW_HEAD_SIZE * 0.5,
            ARROW_HEAD_SIZE,
            0,
            -ARROW_HEAD_SIZE / 2
        ); //draws the arrow point as a triangle
        sketch.pop();
    }
}

class Portal {
    constructor() {
        this.portalEnd1 = null;
        this.portalEnd2 = null;
        this.color = null;
    }

    setFirstEnd(portalEnd) {
        this.portalEnd1 = portalEnd;
        return true;
    }

    setSecondEnd(portalEnd) {
        if (this.portalEnd1.getLength() !== portalEnd.getLength()) return false;
        this.portalEnd2 = portalEnd;
        return true;
    }

    deleteEnd1() {
        this.portalEnd1 = this.portalEnd2;
        this.portalEnd2 = null;
    }

    deleteEnd2() {
        this.portalEnd2 = null;
    }

    draw(sketch) {
        sketch.stroke(this.color);
        if (this.portalEnd1 != null) this.portalEnd1.draw(sketch);
        if (this.portalEnd2 != null) this.portalEnd2.draw(sketch);
        sketch.stroke("black");
    }
}
