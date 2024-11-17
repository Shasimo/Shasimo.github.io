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
            null,
            null
        );
        let embedded = ret[0];
        let v = ret[1][ret[1].length - 1];
        let visibilityInterval = newSig.computeVisibilityInterval(embedded, edge, v);
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

    getLastVertexIdxInPath() {
        for (let i = this.path.length - 1; i >= 0; i--)
            if (!(this.path[i] instanceof Portal))
                return i;
        return -1;
    }

    computeVisibilityInterval(embeddedPortalgon, edge, v) {
        let interval = [0, 1];
        let edgeFragment = embeddedPortalgon.fragments[edge.portalEnd1.fragmentIdx];
        let edgeVert1 = edgeFragment.vertices[edge.portalEnd1.edge[0]].add(edgeFragment.origin);
        let edgeVert2 = edgeFragment.vertices[edge.portalEnd1.edge[1]].add(edgeFragment.origin)
        let edgeLine = toLine(edgeVert1, edgeVert2);
        console.log(edgeVert1, edgeVert2);

        for (let i = this.getLastVertexIdxInPath() + 1; i < this.path.length - 1; i++) {
            let currentPortal = this.path[i];       // path[i] is a portal
            let currentFragment = embeddedPortalgon.fragments[currentPortal.portalEnd1.fragmentIdx];
            let portalVertices = [
                currentFragment.vertices[currentPortal.portalEnd1.edge[0]].add(currentFragment.origin),
                currentFragment.vertices[currentPortal.portalEnd1.edge[1]].add(currentFragment.origin)
            ];

            for (let j = 0; j < portalVertices.length; j++) {
                let l1 = toLine(v, portalVertices[j]);

                // vertical edge
                if (edgeLine === null) {

                }

                // if the two lines are parallel, to restriction on the interval because either we see
                // the whole edge or we see none of it: the interval is not touched
                if (l1[0] === edgeLine[0]) continue;

                let intersectionX = (edgeLine[1] - l1[1]) / (l1[0] - edgeLine[0]);
                let alpha = 0;

                if (edgeVert1.x !== edgeVert2.x) {
                    alpha = (intersectionX - edgeVert1.x) / (edgeVert2.x - edgeVert1.x);
                } else {
                    let intersectionY = l1[0] * intersectionX + l1[1];
                    alpha = (intersectionY - edgeVert1.y) / (edgeVert2.y - edgeVert1.y);
                }

                if (0 > alpha || 1 < alpha) continue;
                // vision limited !
                console.log(alpha);
            }
        }

        return interval;
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