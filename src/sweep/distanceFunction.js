
class DistanceFunction{
    constructor(signature, interval, vertex, edge, distanceLastVertexFromSource=0) {
        this.signature = signature;
        this.interval = interval;
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

    getPointsInterval() {
        return [percentageToPoint(this.interval[0], this.edgeInterval), percentageToPoint(this.interval[1], this.edgeInterval)];
    }

}

