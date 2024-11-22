class MapEntry {
    constructor () {
        this.env = new Envelope([]);
    }

    insertSignature(distanceFunction) {
        return this.env.insert(distanceFunction);
    }
}