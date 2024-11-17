class Signature {
    constructor(originFragmentIdx, sourcePoint, path) {
        /*
        * originFragmentIdx: the idx of the first fragment of the path
        * path: a list of Portals and ints:
        *          if int: the index of the vertex that the path goes through in the last fragment up to that point
        *          if Portal: the next portal that the path takes
        * sourcePoint: the point the path starts from (relative to the origin of the first fragment
        * endPoint: the point the path ends in (relative to the origin of the last fragment)
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
            } else
                this.path.push(path[i]);
        }
    }

    toDistanceFunction(portalgon, edge) {
        /**
         * Computes f_{\sigma|e}
         */
        let newSig = this.copy();
        newSig.path.push(edge.copy());

        let ret = generateEmbeddingFromSignature(
            portalgon,
            newSig,
            this.path[this.getLastPortalIdxInPath()].portalEnd2.fragmentIdx,
            new Point(0, 0)
        );
        let embedded = ret[0];
        let visibilityInterval = this.computeVisibilityInterval(embedded);
        return new DistanceFunction(
            this,
            visibilityInterval,
            0,
            ret[1][ret[1].length - 2],
            );
    }

    getLastPortalIdxInPath() {
        for (let i = this.path.length - 1; i >= 0; i--)
            if (this.path[i] instanceof Portal)
                return i;
        return -1;
    }

    computeVisibilityInterval(embeddedPortalgon, edge) {

    }

    copy() {
        let path = [];
        for (let i = 0; i < this.path.length; i++) {
            if (this.path[i] instanceof Portal)
                path.push(this.path[i].copy());
            else
                path.push(this.path[i]);
        }
        return new Signature(this.originFragmentIdx, this.source.copy(), path);
    }
}