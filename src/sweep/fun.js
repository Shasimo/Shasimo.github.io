
class FunSignatureEdge{
    // f _sigma|e()
    constructor(signature, interval, distanceLastVertexFromSource, vertex, edge) {
        this.signature = signature;
        this.interval = interval; // couple of points
        this.distanceLastVertexFromSource = distanceLastVertexFromSource;
        this.lastVertexPosition = vertex;
        this.edgeDestination = edge;
    }

    computeDistance(p){ // p is supposed already on edge
        if(isInInterval(this.interval, p)) {
            return this.distanceLastVertexFromSource + computeEuclideanDistance(p, this.lastVertexPosition);

        }
        return Infinity;
    }

}

