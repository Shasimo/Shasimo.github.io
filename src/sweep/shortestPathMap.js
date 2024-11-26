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
        let id = 0;

        for (let p = 0; p < this.portalgon.portals.length; p++) {
            let current = this.portalgon.portals[p];
            current.id = id++;
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
        }
    }

    query(destinationFragmentIdx, destinationPos) {
        let bestSignature = null;
        let bestDistance = Infinity;

        if (!this.portalFragmentIdxMap.has(destinationFragmentIdx)) {
            if (destinationFragmentIdx === this.sourceFragmentIdx)
                return new Signature(this.portalgon.copy(), this.sourceFragmentIdx, this.s, []);
            return null;    // unreachable fragment
        }

        // with the way the algorithm is setup, the signature [s] is in no envelope.
        // we need to account for it if the destination fragment is the same as the source fragment
        if (destinationFragmentIdx === this.sourceFragmentIdx) {
            bestSignature = new Signature(this.portalgon.copy(), this.sourceFragmentIdx, this.s, []);
            bestDistance = computeEuclideanDistance(destinationPos, this.s);
        }

        for (let portal of this.portalFragmentIdxMap.get(destinationFragmentIdx)) {
            if (!this.edgeMap.has(portal)) continue;    // portal unreachable from the source

            for (let distanceFunction of this.edgeMap.get(portal).env.envelope.functionsList) {

                console.log(distanceFunction);

                // has to exist because we are not in the original source fragment
                let lastPortalIdx = distanceFunction.signature.getLastPortalIdxInPath();
                if (distanceFunction.signature.path[lastPortalIdx].portalEnd2.fragmentIdx !== destinationFragmentIdx)
                    continue;

                console.log("passed");

                let ret = generateEmbeddingFromSignature(
                    this.portalgon.copy(),
                    distanceFunction.signature,
                    destinationFragmentIdx,
                    destinationPos
                );

                let verticesOfPath = ret[1];
                let lastVertexEmbedPos = verticesOfPath[verticesOfPath.length - 2];
                let destinationEmbedPos = verticesOfPath[verticesOfPath.length - 1];
                let embed = ret[0];

                if (embed.canSourceSeeDestination(lastVertexEmbedPos, destinationEmbedPos,
                    distanceFunction.signature.getFragmentIdxOfVertex(verticesOfPath.length - 2), embed.fragments.length - 1)
                    && embed.doesPathGoThroughEveryFragment(verticesOfPath)) {
                    let totalDist = 0;
                    for (let i = 0; i < verticesOfPath.length - 1; i++)
                        totalDist += computeEuclideanDistance(verticesOfPath[i], verticesOfPath[i + 1]);

                    if (bestDistance > totalDist) {
                        bestDistance = totalDist;
                        bestSignature = distanceFunction.signature;
                    }
                }
            }
        }

        console.log("-----");

        return bestSignature;
    }

    runType1Event(event, delta) {
        this.insertNewSignatures(event.fragmentIdxOut, event.edge, event.distanceFunction, delta);
    }

    insertNewSignatures(fragmentIdx, edge, distanceFunction, delta) {
        // we just touched edge (entering fragmentIdx) using the signature in distanceFunction at distance delta
        if (!this.portalFragmentIdxMap.has(fragmentIdx)) return;

        let newPath = [];
        if (distanceFunction !== null) {
            newPath = [...distanceFunction.signature.path];
        }

        let sig = new Signature(this.portalgon.copy(), this.sourceFragmentIdx, this.s, newPath);

        let distV = 0;
        if (distanceFunction !== null) distV = distanceFunction.distanceLastVertexFromSource;

        // insert new signatures into adjacent edges
        for (let portal of this.portalFragmentIdxMap.get(fragmentIdx)) {

            // cannot go back from the portal we went through to get here
            if (edge !== null && portal.equals(edge)) continue;

            if (!this.edgeMap.has(portal)) this.edgeMap.set(portal, new MapEntry());
            let currentMapEntry = this.edgeMap.get(portal);

            for (let portalEnd of [portal.portalEnd1, portal.portalEnd2]) {
                // only care about the end of the portal we are touching first
                if (portalEnd.fragmentIdx !== fragmentIdx) continue;

                let df = sig.toDistanceFunction(this.portalgon.copy(), portal, distV);

                if (df === null || df.interval === null) continue; // unreachable portal

                // idx of the fragment that we are coming TO
                let fragmentIdxOut = portalEnd === portal.portalEnd1 ? portal.portalEnd2.fragmentIdx : portal.portalEnd1.fragmentIdx;

                let fragmentOut = df.signature.getSecondToLastFragmentInEmbedding().copy();

                if (0 === df.interval[0]) {
                    let dist = df.computeDistance(0);

                    // idx is the idx of the reached vertex in the fragment that was just reached
                    let idx;
                    for (idx = 0; idx < fragmentOut.vertices.length; idx++)
                        if (fragmentOut.vertices[idx].add(fragmentOut.origin).equals(df.edgeInterval[0])) break;

                    if (idx !== 3) {
                        let sig = new Signature(
                            this.portalgon.copy(),
                            this.sourceFragmentIdx,
                            this.s,
                            [...newPath, idx],
                        );
                        let distf = sig.toDistanceFunction(this.portalgon.copy(), portal, dist);
                        if (distf !== null && distf.interval !== null) {
                            if (currentMapEntry.insertSignature(distf)) {
                                this.eventHeap.add([dist, new Type1Event(portal, fragmentIdxOut, distf)]);
                            }
                        }
                    }
                }
                if (1 === df.interval[1]) {
                    let dist = df.computeDistance(1);

                    let idx;
                    for (idx = 0; idx < fragmentOut.vertices.length; idx++)
                        if (fragmentOut.vertices[idx].add(fragmentOut.origin).equals(df.edgeInterval[1])) break;

                    if (idx !== 3) {
                        let sig = new Signature(
                            this.portalgon.copy(),
                            this.sourceFragmentIdx,
                            this.s,
                            [...newPath, idx],
                        );
                        let distf = sig.toDistanceFunction(this.portalgon.copy(), portal, dist);
                        if (distf !== null && distf.interval !== null) {
                            if (currentMapEntry.insertSignature(distf)) {
                                this.eventHeap.add([dist, new Type1Event(portal, fragmentIdxOut, distf)]);
                            }
                        }
                    }
                }

                // we have to make sure that if the previous interval was of size 0, we force the valid signatures to
                // be the one where we go through a vertex. This is made to prevent the algorithms of building
                // self-intersecting paths where the destination lands miraculously next to the source,
                // enabling a signature without any vertices except s that should turn but should'nt
                /*if (distanceFunction !== null && distanceFunction.interval !== null &&
                    Math.abs(distanceFunction.interval[0] - distanceFunction.interval[1]) < 1 / RESOLUTION)
                    continue;*/

                if (currentMapEntry.insertSignature(df)) {
                    let nextLocMin = currentMapEntry.env.nextLocalMinimum(delta);
                    this.eventHeap.add([nextLocMin.y, new Type1Event(portal, fragmentIdxOut, df)]);
                }
            }
        }
    }

    runType4Event(event, delta) {
        let sig = new Signature(
            this.portalgon.copy(),
            this.sourceFragmentIdx,
            this.s,
            [...event.distanceFunction.signature.path, event.touchedVertex],
        );
        let distf = sig.toDistanceFunction(this.portalgon.copy(), event.edge, delta);
        if (distf === null) return;
        this.insertNewSignatures(event.fragmentIdxOut, event.edge, distf, delta);
    }
}