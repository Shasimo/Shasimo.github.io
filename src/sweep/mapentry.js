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
        if (!this.envA.insert(distanceFunction)) return false;
        this.sA.add(signature);
        return true;
    }

    insertSignatureB(signature, distanceFunction) {
        if (!this.envB.insert(distanceFunction)) return false;
        this.sB.add(signature);
        return true;
    }
}