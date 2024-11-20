class ShortestPathMap {
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
        this.insertNewSignatures(this.sourceFragmentIdx, null, null, 0);
    }

    construct() {
        this.init();
        while (!this.eventHeap.isEmpty()) {
            let r = this.eventHeap.pop();
            let delta = r[0];
            let event = r[1];

            if (event instanceof Type1Event)
                this.runType1Event(event, delta);
            if (event instanceof Type4Event)
                this.runType4Event(event, delta);
        }
    }

    query(destinationFragmentIdx, destinationPos) {
        let bestSignature = null;
        let bestDistance = Infinity;
        for (let portal of this.portalFragmentIdxMap.get(destinationFragmentIdx)) {
            for (let distanceFunction of this.edgeMap.get(portal).envA.envelope.functionsList) {
                if (distanceFunction.signature.path[distanceFunction.signature.getLastPortalIdxInPath()].portalEnd2.fragmentIdx !== destinationFragmentIdx)
                    continue;

                let ret = generateEmbeddingFromSignature(
                    this.portalgon,
                    distanceFunction.signature,
                    destinationFragmentIdx,
                    destinationPos
                );
                let verticesOfPath = ret[1];
                let lastVertexEmbedPos = verticesOfPath[verticesOfPath.length - 2];
                let destinationEmbedPos = verticesOfPath[verticesOfPath.length - 1];
                let embed = ret[0];
                if (embed.canSourceSeeDestination(lastVertexEmbedPos, destinationEmbedPos)) {
                    let totalDist = 0;
                    for (let i = 0; i < verticesOfPath.length - 1; i++)
                        totalDist += computeEuclideanDistance(verticesOfPath[i], verticesOfPath[i+1]);

                    if (bestDistance > totalDist) {
                        bestDistance = totalDist;
                        bestSignature = distanceFunction.signature;
                    }
                }
            }
            for (let distanceFunction of this.edgeMap.get(portal).envB.envelope.functionsList) {
                if (distanceFunction.signature.path[distanceFunction.signature.getLastPortalIdxInPath()].portalEnd2.fragmentIdx !== destinationFragmentIdx)
                    continue;

                let ret = generateEmbeddingFromSignature(
                    this.portalgon,
                    distanceFunction.signature,
                    destinationFragmentIdx,
                    destinationPos
                );
                let verticesOfPath = ret[1];
                let lastVertexEmbedPos = verticesOfPath[verticesOfPath.length - 2];
                let destinationEmbedPos = verticesOfPath[verticesOfPath.length - 1];
                let embed = ret[0];
                if (embed.canSourceSeeDestination(lastVertexEmbedPos, destinationEmbedPos)) {
                    let totalDist = 0;
                    for (let i = 0; i < verticesOfPath.length - 1; i++)
                        totalDist += computeEuclideanDistance(verticesOfPath[i], verticesOfPath[i+1]);

                    if (bestDistance > totalDist) {
                        bestDistance = totalDist;
                        bestSignature = distanceFunction.signature;
                    }
                }
            }
        }
        return bestSignature;
    }

    runType1Event(event, delta) {
        // at time delta, a minimum of a function is encountered:
        // we need to insert it in env≤∂ and env=∂
        let dataOfEdge = this.edgeMap.get(event.edge);

        // dataOfEdge.envLDelta.insert(event.minimumXCoord, event.distanceFunction);
        // dataOfEdge.envDelta.insert(event.minimumXCoord, event.distanceFunction);

        this.insertNewSignatures(event.fragmentIdxOut, event.edge, event.distanceFunction, delta);
    }

    insertNewSignatures(fragmentIdx, edge, distanceFunction, delta) {
        // insert new signatures into adjacent edges
        for (let portal of this.portalFragmentIdxMap.get(fragmentIdx)) {

            if (!this.edgeMap.has(portal)) this.edgeMap.set(portal, new MapEntry());
            let currentMapEntry = this.edgeMap.get(portal);

            // cannot go back from the portal we went through to get here
            if (portal === edge) continue;
            for (let portalEnd of [portal.portalEnd1, portal.portalEnd2]) {
                if (portalEnd.fragmentIdx !== fragmentIdx) continue;

                let newPath;
                if (distanceFunction !== null) {
                    newPath = [...distanceFunction.signature.path, edge];
                } else newPath = [];

                let sig = new Signature(this.sourceFragmentIdx, this.s, newPath);

                let distV = 0;
                if (distanceFunction !== null) distV = distanceFunction.distanceLastVertexFromSource;
                let df = sig.toDistanceFunction(this.portalgon, portal, distV);

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

                let fragmentOut = this.portalgon.fragments[fragmentIdxOut];
                this.eventHeap.add([nextLocMin.y, new Type1Event(portal, fragmentIdxOut, df)]);
                if (0 === df.interval[0]) {
                    let dist = df.computeDistance(0);

                    // idx is the idx of the reached vertex in the fragment that was just reached
                    let idx;
                    for (idx = 0; idx < fragmentOut.vertices.length; idx++)
                        if (fragmentOut.vertices[idx].add(fragmentOut.origin).equals(df.edgeInterval[0])) break;

                    this.eventHeap.add([dist, new Type4Event(portal, fragmentIdxOut, df, idx)]);
                }
                if (1 === df.interval[1]) {
                    let dist = df.computeDistance(1);

                    let idx;
                    for (idx = 0; idx < fragmentOut.vertices.length; idx++)
                        if (fragmentOut.vertices[idx].add(fragmentOut.origin).equals(df.edgeInterval[1])) break;

                    this.eventHeap.add([dist, new Type4Event(portal, fragmentIdxOut, df, idx)]);
                }
            }
        }
    }

    runType4Event(event, delta) {
        let sig = new Signature(this.sourceFragmentIdx, this.s, [...event.distanceFunction.signature.path, event.touchedVertex]);
        let distf = sig.toDistanceFunction(this.portalgon, event.edge, delta);
        if (distf === null) return;
        this.insertNewSignatures(event.fragmentIdxOut, event.edge, distf, delta);
    }

    runType2Event(event, delta) {

    }

    runType3Event(event, delta) {

    }
}