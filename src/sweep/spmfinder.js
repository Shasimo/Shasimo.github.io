class SPMFinder {
    constructor(portalgon, source, sourceFragmentIdx) {
        this.portalgon = portalgon;
        this.s = source;
        this.sourceFragmentIdx = sourceFragmentIdx;

        // event heap: (delta, event)
        this.eventHeap = new MinHeap();

        // edge -> MapEntry for that edge (SA, SV, envs...)
        this.edgeMap = new Map();

        // map from fragmentIdx -> {portals adjacent to that fragment}
        this.portalFragmentIdxMap = this.computePortalFragmentIdxMap();
    }

    computePortalFragmentIdxMap() {
        let res = new Map();

        for (let p = 0; p < this.portalgon.portals.length; p++) {
            let current = this.portalgon.portals[p];
            if (res.has(current.portalEnd1.fragmentIdx))
                res.get(current.portalEnd1.fragmentIdx).add(current);
            else
                res.set(current.portalEnd1.fragmentIdx, new Set([current]));

            if (res.has(current.portalEnd2.fragmentIdx))
                res.get(current.portalEnd2.fragmentIdx).add(current);
            else
                res.set(current.portalEnd2.fragmentIdx, new Set([current]));
        }
        return res;
    }

    init() {
        this.insertNewSignatures(
            new Type1Event(null, this.sourceFragmentIdx, null, null),
            0
        );
    }

    run() {
        this.init();
        while (!this.eventHeap.isEmpty()) {
            let r = this.eventHeap.pop();
            let delta = r[0];
            let event = r[1];

            console.log(delta, event);

            if (event instanceof Type1Event)
                this.runType1Event(event, delta)
        }
    }

    runType1Event(event, delta) {
        // at time delta, a minimum of a function is encountered:
        // we need to insert it in env≤∂ and env=∂
        let dataOfEdge = this.edgeMap.get(event.edge);

        // dataOfEdge.envLDelta.insert(event.minimumXCoord, event.distanceFunction);
        // dataOfEdge.envDelta.insert(event.minimumXCoord, event.distanceFunction);

        this.insertNewSignatures(event, delta);
    }

    insertNewSignatures(event, delta) {
        // insert new signatures into adjacent edges
        for (let portal of this.portalFragmentIdxMap.get(event.fragmentIdxOut)) {

            if (!this.edgeMap.has(portal)) this.edgeMap.set(portal, new MapEntry());
            let currentMapEntry = this.edgeMap.get(portal);

            // cannot go back from the portal we went through to get here
            if (portal === event.edge) continue;
            for (let portalEnd of [portal.portalEnd1, portal.portalEnd2]) {
                if (portalEnd.fragmentIdx !== event.fragmentIdxOut) continue;

                let newPath;
                if (event.distanceFunction !== null) {
                    newPath = [...event.distanceFunction.signature.path];
                    newPath.push(event.edge);
                } else newPath = [];

                let sig = new Signature(this.sourceFragmentIdx, this.s, newPath);
                let df = sig.toDistanceFunction(this.portalgon, portal);

                if (df.interval === null) continue; // unreachable portal

                let nextLocMin;
                let fragmentIdxOut;
                if (portalEnd === portal.portalEnd1) {
                    fragmentIdxOut = portal.portalEnd2.fragmentIdx;
                    if (!currentMapEntry.insertSignatureA(sig, df)) continue;
                    nextLocMin = currentMapEntry.envA.nextLocalMinimum(delta);
                } else {
                    fragmentIdxOut = portal.portalEnd1.fragmentIdx;
                    if (!currentMapEntry.insertSignatureB(sig, df)) continue;
                    nextLocMin = currentMapEntry.envB.nextLocalMinimum(delta);
                }

                this.eventHeap.add([nextLocMin.y, new Type1Event(portal, fragmentIdxOut, df, nextLocMin.x)]);
            }
        }
    }

    runType2Event(event, delta) {

    }

    runType3Event(event, delta) {

    }
}