class Type1Event {
    constructor(edge, fragmentIdxOut, distanceFunction, minimumXCoord) {
        this.edge = edge;
        this.fragmentIdxOut = fragmentIdxOut;
        this.distanceFunction = distanceFunction;
        this.minimumXCoord = minimumXCoord;
    }
}

class Type2Event {
    constructor(edge, distanceFunction, intersectionXCoord) {
        this.edge = edge;
        this.distanceFunction = distanceFunction;
        this.intersectionXCoord = intersectionXCoord;
    }
}

class Type3Event {
    constructor(edge, distanceFunctionEnvA, distanceFunctionEnvB, intersectionXCoord) {
        this.edge = edge;
        this.distanceFunctionEnvA = distanceFunctionEnvA;
        this.distanceFunctionEnvB = distanceFunctionEnvB;
        this.intersectionXCoord = intersectionXCoord;
    }
}