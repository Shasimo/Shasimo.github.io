class MapEntry {
    constructor () {
        this.env = new Envelope([]);
    }

    insertSignature(signature, distanceFunction) {
        return this.env.insert(distanceFunction);
    }
}