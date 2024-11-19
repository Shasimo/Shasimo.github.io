
class FunSignatureEdge{
    // f _sigma|e()
    constructor(signature, interval, distanceLastVertexFromSource, vertex, edge) {
        this.signature = signature;
        this.interval = interval; // couple of points
        this.distanceLastVertexFromSource = distanceLastVertexFromSource;
        this.lastVertexPosition = vertex;
        this.edgeDestination = edge;
    }

    computeDistancePercentage(p){
        if (isInInterval(this.interval, p)){
            let distStartVertex = computeEuclideanDistance(p, this.interval[0]);
            let distEndVertex = computeEuclideanDistance(p, this.interval[1]);
            let intervalLength = distEndVertex + distStartVertex;
            if (intervalLength === 0){return NaN;}

            let percentageClosenessStart = (distEndVertex / intervalLength) * 100; // start--*------end -> percentage closeness start = 7/10 *100 = 70/100
            let percentageClosenessEnd = (distStartVertex / intervalLength) * 100; //                   -> percentage closeness start = 3/10 *100 = 30/100
            return [percentageClosenessStart, percentageClosenessEnd];
        }
        return Infinity;
    }

    computeDistance(p){ // p is supposed already on edge
        if(isInInterval(this.interval, p)) {
            return this.distanceLastVertexFromSource + computeEuclideanDistance(p, this.lastVertexPosition);
        }
        return Infinity;
    }

}

