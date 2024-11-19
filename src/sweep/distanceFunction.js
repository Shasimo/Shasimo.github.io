
class DistanceFunction{
    // f _sigma|e()
    constructor(signature, interval, distanceLastVertexFromSource, vertex, edge) {
        this.signature = signature;
        this.interval = interval; // percentages limiting an interval on edgeInterval
        this.distanceLastVertexFromSource = distanceLastVertexFromSource;
        this.lastVertexPosition = vertex;
        this.edgeInterval = edge;
    }

    computeDistance(percentage) {
        if(percentage >= this.interval[0] && percentage <= this.interval[1]) {
            let pointOnInterval = percentageToPoint(percentage, this.edgeInterval);
            return this.distanceLastVertexFromSource + computeEuclideanDistance(this.lastVertexPosition, pointOnInterval);
        }
        return Infinity;
    }

}

