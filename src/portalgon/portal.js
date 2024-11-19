class PortalEnd {
    constructor(vertex1, vertex2, fragmentIdx, vertexIdx1, vertexIdx2) {
        this.mainVertexIdx = vertexIdx1;
        this.vertex1 = vertex1;
        this.vertex2 = vertex2;
        this.fragmentIdx = fragmentIdx;
        this.isReversed = false;
        this.edge = [vertexIdx1, vertexIdx2];
    }

    isMainVertexIdx(vertexIdx) {
        return vertexIdx === this.mainVertexIdx;
    }

    getOrderedEdge() {
        if (this.isReversed)
            return [this.edge[1], this.edge[0]];
        return this.edge;
    }

    getLength() {
        return Math.sqrt((this.vertex1.x - this.vertex2.x) ** 2 + (this.vertex1.y - this.vertex2.y) ** 2);
    }

    reverse() {
        let temp = this.edge[0];
        let temp2 = this.vertex1;
        this.edge[0] = this.edge[1];
        this.vertex1 = this.vertex2;
        this.edge[1] = temp;
        this.vertex2 = temp2;
        this.isReversed = !this.isReversed;
    }

    draw(sketch, fragments) {
        let p1 = this.vertex1.add(fragments[this.fragmentIdx].origin);
        let p2 = this.vertex2.add(fragments[this.fragmentIdx].origin);

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

    copy() {
        let ret = new PortalEnd(this.vertex1.copy(), this.vertex2.copy(), this.fragmentIdx, this.edge[0], this.edge[1]);
        if (ret.mainVertexIdx !== this.mainVertexIdx) {
            ret.isReversed = true;
            ret.mainVertexIdx = this.mainVertexIdx;
        }
        return ret;
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

    swapEnds() {
        let temp = this.portalEnd1;
        this.portalEnd1 = this.portalEnd2;
        this.portalEnd2 = temp;
    }

    draw(sketch, fragments) {
        if (this.color == null){
            this.color = sketch.color(sketch.random(255), sketch.random(255), sketch.random(255));
        }

        sketch.stroke(this.color);
        if (this.portalEnd1 != null) this.portalEnd1.draw(sketch, fragments);
        if (this.portalEnd2 != null) this.portalEnd2.draw(sketch, fragments);
        sketch.stroke("black");
    }

    copy() {
        let ret = new Portal();
        ret.setFirstEnd(this.portalEnd1.copy());
        ret.setSecondEnd(this.portalEnd2.copy());
        ret.color = this.color;
        return ret;
    }
}
