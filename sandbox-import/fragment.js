class Fragment {
    constructor(vertices) {
        this.origin = this.getOrigin(vertices);
        this.vertices = this.polygonToFragment(vertices);
    }

    draw(sketch, origin) {
        sketch.textSize(smallTS);
        for (let i = 0; i < this.vertices.length; i++) {
            let current = this.vertices[i].add(origin);
            sketch.ellipse(current.x, current.y, 4, 4);
            sketch.text(i, current.x, current.y);
        }
        sketch.textSize(oldTS);

        for (let i = 0; i < this.vertices.length; i++) {
            let j = (i + 1) % this.vertices.length;
            let coordi = this.vertices[i].add(origin);
            let coordj = this.vertices[j].add(origin);
            sketch.line(coordi.x, coordi.y, coordj.x, coordj.y);
        }
    }

    getVertexIndex(point, origin) {
        for (let i = 0; i < this.vertices.length; i++) {
            if (this.vertices[i].add(origin).equals(point)) return i;
        }
        return null;
    }

    getOrigin(input_vertices) {
        let minX = input_vertices[0].x;
        let minY = input_vertices[0].y;
        for (let i = 0; i < input_vertices.length; i++) {
            if (input_vertices[i].x < minX) minX = input_vertices[i].x;
            if (input_vertices[i].y < minY) minY = input_vertices[i].y;
        }
        return new Point(minX, minY);
    }

    polygonToFragment(input_vertices) {
        // input_vertices must already be CCW !
        let ret = [];
        for (let i = 0; i < input_vertices.length; i++) {
            ret.push(
                new Point(
                    input_vertices[i].x - this.origin.x,
                    input_vertices[i].y - this.origin.y
                )
            );
        }
        return ret;
    }
}
