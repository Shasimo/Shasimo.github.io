class MapEntry {
    constructor () {
        this.envA = new Envelope([]);
        this.envB = new Envelope([]);
        this.sA = new Set();
        this.sB = new Set();
        this.envLDelta = new BinarySearchTree();
        this.envDelta = new BinarySearchTree();
    }

    insertSignatureA(signature, distanceFunction) {
        this.sA.add(signature);
        this.envA.insert(distanceFunction);
    }

    insertSignatureB(signature, distanceFunction) {
        this.sB.add(signature);
        this.envB.insert(distanceFunction);
    }
}