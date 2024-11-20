class Type1Event {
    constructor(distanceFunction, minimumXCoord) {
        this.distanceFunction = distanceFunction;
        this.minimumXCoord = minimumXCoord;
    }
}

class Type2Event {
    constructor(distanceFunction, intersectionXCoord) {
        this.distanceFunction = distanceFunction;
        this.intersectionXCoord = intersectionXCoord;
    }
}

class Type3Event {
    constructor(distanceFunctionEnvA, distanceFunctionEnvB, intersectionXCoord) {
        this.distanceFunctionEnvA = distanceFunctionEnvA;
        this.distanceFunctionEnvB = distanceFunctionEnvB;
        this.intersectionXCoord = intersectionXCoord;
    }
}