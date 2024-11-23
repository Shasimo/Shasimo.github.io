class Signature {
    constructor(portalgon, originFragmentIdx, sourcePoint, path) {
        /*
        * originFragmentIdx: the idx of the first fragment of the path
        * path: a list of Portals and ints:
        *          if int: the index of the vertex that the path goes through in the last fragment up to that point
        *          if Portal: the next portal that the path takes
        * sourcePoint: the point the path starts from (relative to the origin of the first fragment
        */
        this.originFragmentIdx = originFragmentIdx;
        this.source = sourcePoint;

        this.path = [];

        let lastFragmentIdx = this.originFragmentIdx;
        for (let i = 0; i < path.length; i++) {
            if (path[i] instanceof Portal) {
                let currentPortal = path[i].copy();
                if (currentPortal.portalEnd2.fragmentIdx === lastFragmentIdx)
                    currentPortal.swapEnds();
                else if (currentPortal.portalEnd1.fragmentIdx !== lastFragmentIdx) {
                    throw new Error("Invalid path");
                }
                this.path.push(currentPortal);
                lastFragmentIdx = currentPortal.portalEnd2.fragmentIdx;
            } else
                this.path.push(path[i]);
        }

        let r = generateEmbeddingFromSignature(portalgon, this, lastFragmentIdx, null);
        this.embedding = r[0];
        this.embeddedPath = r[1];
    }

    toDistanceFunction(portalgon, edge, distV) {
        /**
         * Computes f_{\sigma|e}
         */

        // create a new signature when we add the last edge at the end, in that way we know which edge we aim
        // for in the last fragment of the embedding
        let newSig = this.copy(portalgon.copy(), edge.copy());

        for (let i = 0; i < newSig.embeddedPath.length - 1; i++) {
            if (!newSig.embedding.canSourceSeeDestination(newSig.embeddedPath[i], newSig.embeddedPath[i+1],
                newSig.getFragmentIdxOfVertex(i), newSig.getFragmentIdxOfVertex(i+1)))
                return null;
        }

        if (!newSig.doesPathGoThroughEveryFragment()) return null;

        let lastEdge = newSig.embedding.portals[newSig.embedding.portals.length - 1];
        let v = newSig.embeddedPath[newSig.embeddedPath.length - 1];
        let visibilityInterval = newSig.embedding.computeVisibilityInterval(v, newSig.getFragmentIdxOfVertex(newSig.embeddedPath.length - 1), lastEdge);

        let edgeFragment = newSig.embedding.fragments[lastEdge.portalEnd1.fragmentIdx];

        return new DistanceFunction(
            newSig,
            visibilityInterval,
            v,
            [
                edgeFragment.vertices[lastEdge.portalEnd1.edge[0]].add(edgeFragment.origin),
                edgeFragment.vertices[lastEdge.portalEnd1.edge[1]].add(edgeFragment.origin)
            ],
            distV
        );
    }

    doesPathGoThroughEveryFragment() {
        let fragmentsToCheck = [...Array(this.getLastFragmentInEmbedding()).keys()];
        fragmentsToCheck = removeIthElementOfArray(fragmentsToCheck, 0);

        for (let i = 0; i < this.embeddedPath.length - 1; i++) {
            for (let p = 0; p <= RESOLUTION; p++) {
                let alpha = p / RESOLUTION;
                let current = new Point(
                    this.embeddedPath[i].x * (1 - alpha) + this.embeddedPath[i + 1].x * alpha,
                    this.embeddedPath[i].y * (1 - alpha) + this.embeddedPath[i + 1].y * alpha
                );

                for (let f = fragmentsToCheck.length - 1; f >= 0; f--) {
                    let currentFragment = this.embedding[fragmentsToCheck[f]];
                    if (isInTriangle(
                        currentFragment.vertices[0].add(currentFragment.origin),
                        currentFragment.vertices[1].add(currentFragment.origin),
                        currentFragment.vertices[2].add(currentFragment.origin),
                        current)
                    )
                        fragmentsToCheck = removeIthElementOfArray(fragmentsToCheck, f);
                }
            }
        }

        return fragmentsToCheck.length === 0;
    }

    getSecondToLastFragmentInEmbedding() {
        return this.embedding.fragments[this.embedding.fragments.length - 2];
    }

    getLastFragmentInEmbedding() {
        return this.embedding.fragments[this.embedding.fragments.length - 1];
    }

    getFragmentIdxOfVertex(vertexIdx) {
        if (vertexIdx === -1) return 0;

        let nbVertices = 0;
        let fragmentIdx = 0;
        for (let i = 0; i < this.path.length; i++) {
            if (nbVertices === vertexIdx) break;
            if (this.path[i] instanceof Portal)
                fragmentIdx++;
            else
                nbVertices++;
        }

        // we have not encountered any vertex, return the fragmentidx of the source
        if (nbVertices === 0) return 0;

        return fragmentIdx;
    }

    getLastPortalIdxInPath() {
        for (let i = this.path.length - 1; i >= 0; i--)
            if (this.path[i] instanceof Portal)
                return i;
        return -1;
    }

    getLastVertexIdxInPath() {
        for (let i = this.path.length - 1; i >= 0; i--)
            if (!(this.path[i] instanceof Portal))
                return i;
        return -1;
    }

    copy(portalgon, newEdge) {
        let path = [];
        for (let i = 0; i < this.path.length; i++) {
            if (this.path[i] instanceof Portal)
                path.push(this.path[i].copy());
            else
                path.push(this.path[i]);
        }
        if (newEdge !== null)
            path.push(newEdge);

        return new Signature(portalgon, this.originFragmentIdx, this.source.copy(), path);
    }
}