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
            if (!newSig.embedding.canSourceSeeDestination(newSig.embeddedPath[i], newSig.embeddedPath[i+1])) return null;
        }

        let lastEdge = newSig.embedding.portals[newSig.embedding.portals.length - 1];
        let v = newSig.embeddedPath[newSig.embeddedPath.length - 1];
        let visibilityInterval = newSig.embedding.computeVisibilityInterval(v, lastEdge);

        let edgeFragment = newSig.embedding.fragments[lastEdge.portalEnd1.fragmentIdx];

        return new DistanceFunction(
            this,
            visibilityInterval,
            v,
            [
                edgeFragment.vertices[lastEdge.portalEnd1.edge[0]].add(edgeFragment.origin),
                edgeFragment.vertices[lastEdge.portalEnd1.edge[1]].add(edgeFragment.origin)
            ],
            distV
        );
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