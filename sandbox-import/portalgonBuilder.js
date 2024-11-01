class PortalgonBuilder {
    constructor() {
        // fragments is the list of already validated fragments
        this.fragments = [];
        this.vertices = [];
        this.overlappingEdges = false;
        this.pickingPortalsPhase = false;
        this.built = false;
        this.current_portal = new Portal();
        this.portals = [];
    }

    click(point) {
        if (this.pickingPortalsPhase == false) this.addVertex(point);
        else {
            let i = 0;
            let index = null;
            for (; i < this.fragments.length; i++) {
                index = this.fragments[i].getVertexIndex(
                    point,
                    this.fragments[i].origin
                );
                if (index != null) {
                    break;
                }
            }
            if (index == null) return;
            this.togglePortal(i, index);
        }
    }

    togglePortal(fragmentIdx, vertexIdx) {
        let p1 = this.current_portal.portalEnd1;
        let p2 = this.current_portal.portalEnd2;
        if (p1 == null) {
            this.current_portal.setFirstEnd(
                new PortalEnd(this.fragments[fragmentIdx], vertexIdx)
            );
        } else {
            if (
                this.fragments[fragmentIdx] == p1.fragment &&
                p1.isMainVertexIdx(vertexIdx)
            ) {
                if (p1.isMainVertexIdx(p1.edge[0])) p1.reverse();
                else this.current_portal.deleteEnd1();
                return;
            }
            if (p2 == null) {
                this.current_portal.setSecondEnd(
                    new PortalEnd(this.fragments[fragmentIdx], vertexIdx)
                );
            } else {
                if (
                    this.fragments[fragmentIdx] == p2.fragment &&
                    p2.isMainVertexIdx(vertexIdx)
                ) {
                    if (p2.isMainVertexIdx(p2.edge[0])) p2.reverse();
                    else this.current_portal.deleteEnd2();
                    return;
                }
            }
        }
    }

    drawPreviewPoint(previewPoint, sketch) {
        if (!this.pickingPortalsPhase) {
            sketch.ellipse(previewPoint.x, previewPoint.y, 10, 10);
        } else {
            if (!this.isVertex(previewPoint)) return;
            sketch.fill(previewPointPortalColor);
            sketch.ellipse(previewPoint.x, previewPoint.y, 10, 10);
        }
        sketch.fill(previewPointColor);
    }

    isVertex(point) {
        for (let i in this.fragments) {
            if (
                this.fragments[i].getVertexIndex(point, this.fragments[i].origin) !=
                null
            )
                return true;
        }
        return false;
    }

    addVertex(point) {
        for (let i = 0; i < this.vertices.length; i++) {
            if (this.vertices[i].equals(point)) return;
        }

        this.vertices.push(point);
    }

    draw(sketch) {
        sketch.fill("gray");
        sketch.stroke("gray");
        for (let i = 0; i < this.fragments.length; i++) {
            this.fragments[i].draw(sketch,this.fragments[i].origin);
        }
        sketch.fill("black");
        sketch.stroke("black");

        sketch.stroke("red");
        this.current_portal.draw(sketch);
        sketch.stroke("black");

        this.drawBuildingFragment(sketch);
    }

    drawBuildingFragment(sketch) {
        if (this.built) {
            return;
        }

        sketch.textSize(smallTS);
        for (let i in this.vertices) {
            sketch.ellipse(this.vertices[i].x, this.vertices[i].y, 4, 4);
            sketch.text(i, this.vertices[i].x, this.vertices[i].y);
        }
        sketch.textSize(oldTS);

        for (let i = 0; i < this.vertices.length; i++) {
            let j = (i + 1) % this.vertices.length;
            sketch.line(
                this.vertices[i].x,
                this.vertices[i].y,
                this.vertices[j].x,
                this.vertices[j].y
            );
        }

        if (this.overlappingEdges) sketch.text("Invalid fragment !", 300, 100);
    }

    cleanVertices() {
        // clean out points lying on segments
        const cleanedVertices = [];

        for (let i = 0; i < this.vertices.length; i++) {
            const prev =
                this.vertices[(i - 1 + this.vertices.length) % this.vertices.length];
            const current = this.vertices[i];
            const next = this.vertices[(i + 1) % this.vertices.length];

            // Only add `current` if it is not on the segment `prev -> next`
            if (!isPointInSegment(prev, next, current)) {
                cleanedVertices.push(current);
            }
        }

        this.vertices = cleanedVertices;
    }

    resetBuild() {
        this.resetFragment();
        this.fragments = [];
        this.pickingPortalsPhase = false;
        this.portals = [];
        this.current_portal = new Portal();
    }

    resetFragment() {
        this.vertices = [];
        this.edges = [];
        this.overlappingEdges = false;
        this.built = false;
    }

    validate_fragment() {
        if (this.vertices.length < 3) return;
        toCCW(this.vertices);
        this.cleanVertices();

        if (!checkNoOverlappingEdges(this.vertices)) {
            this.overlappingEdges = true;
            return;
        }

        // check that there is no overlap with any of the edges of the other fragments
        for (let current = 0; current < this.vertices.length; current++) {
            let next = (current + 1) % this.vertices.length;
            for (let i = 0; i < this.fragments.length; i++) {
                for (let j = 0; j < this.fragments[i].vertices.length; j++) {
                    let j2 = (j + 1) % this.fragments[i].vertices.length;
                    if (
                        segmentsIntersect(
                            this.vertices[current],
                            this.vertices[next],
                            this.fragments[i].vertices[j].add(this.fragments[i].origin),
                            this.fragments[i].vertices[j2].add(this.fragments[i].origin)
                        )
                    ) {
                        this.overlappingEdges = true;
                        return;
                    }
                }
            }
        }

        this.fragments.push(new Fragment(this.vertices));
        this.vertices = [];
    }

    pick_portals() {
        if (this.fragments.length == 0 || this.vertices.length > 0) return;
        this.pickingPortalsPhase = true;
    }
}
