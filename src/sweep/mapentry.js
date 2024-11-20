class MapEntry {
    constructor () {
        this.envA = new Envelope([]);
        this.envB = new Envelope([]);
        this.env = new Envelope([]);
        this.sA = new Set();
        this.sB = new Set();
        this.envDelta = [];
    }

    addInSA(signature, distanceFunction) {
        this.sA.add(signature);
        this.envA.insert(distanceFunction);
        this.env.insert(distanceFunction);
        // probably wrong
        let nextLocMin = this.envA.nextLocalMinimum(0);
        return [nextLocMin.y, new Type1Event(distanceFunction, nextLocMin.x)];
    }

    addInSB(signature, distanceFunction) {
        this.sB.add(signature);
        this.envB.insert(distanceFunction);
        this.env.insert(distanceFunction);
        // probably wrong
        let nextLocMin = this.envB.nextLocalMinimum(0);
        return [nextLocMin.y, new Type1Event(distanceFunction, nextLocMin.x)];
    }
}