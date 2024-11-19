class Signature {
    constructor(originFragmentIdx, sourcePoint, path) {
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

        let edgeFragment = embedded.fragments[edge.portalEnd1.fragmentIdx];
        return new DistanceFunction(
            this,
            visibilityInterval,
            0,
            v,
            [
                edgeFragment.vertices[edge.portalEnd1.edge[0]].add(edgeFragment.origin),
                edgeFragment.vertices[edge.portalEnd1.edge[1]].add(edgeFragment.origin)
            ]
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
        let edgeFragment = embeddedPortalgon.fragments[edge.portalEnd1.fragmentIdx];
        let edgeVert1 = edgeFragment.vertices[edge.portalEnd1.edge[0]].add(edgeFragment.origin);
        let edgeVert2 = edgeFragment.vertices[edge.portalEnd1.edge[1]].add(edgeFragment.origin)
        let resolution = 1000;
        let interval = null;

        for (let lower = 0; lower <= resolution; lower++) {
            let alpha = lower / resolution;
            let current = new Point(
                edgeVert1.x * (1 - alpha) + edgeVert2.x * alpha,
                edgeVert1.y * (1 - alpha) + edgeVert2.y * alpha
            );

            // check if the edge is really visible
            if (this.canSourceSeeDestination(v, current, embeddedPortalgon)) {
                interval = [alpha, null];
                break;
            }
        }

        if (interval === null) return null;

        interval[1] = binarySearch(interval[0] * resolution, resolution, p => {
            let alpha = p / resolution;
            let current = new Point(
                edgeVert1.x * (1 - alpha) + edgeVert2.x * alpha,
                edgeVert1.y * (1 - alpha) + edgeVert2.y * alpha
            );
            return this.canSourceSeeDestination(v, current, embeddedPortalgon);
        }) / resolution;

        if (interval[1] === null) throw new Error("Upper end of the interval is null: this should NOT happen.");

        return interval;
    }

    canSourceSeeDestination(source, destination, embedding) {
        let previousPortalV1 = null;
        let previousPortalV2 = null;
        for (let k = this.getLastVertexIdxInPath() + 1; k < this.path.length; k++) {
            let fragmentToCheck = embedding.fragments[this.path[k].portalEnd1.fragmentIdx];
            let currentPortalV1 = fragmentToCheck.vertices[this.path[k].portalEnd1.edge[0]].add(fragmentToCheck.origin);
            let currentPortalV2 = fragmentToCheck.vertices[this.path[k].portalEnd1.edge[1]].add(fragmentToCheck.origin);
            for (let l = 0; l < fragmentToCheck.vertices.length; l++) {
                let p1 = fragmentToCheck.vertices[l].add(fragmentToCheck.origin);
                let p2 = fragmentToCheck.vertices[(l + 1) % fragmentToCheck.vertices.length].add(fragmentToCheck.origin);
                if (isPointInSegment(p1, p2, destination)) continue;

                if ((currentPortalV1.equals(p1) && currentPortalV2.equals(p2)) || (currentPortalV1.equals(p2) && currentPortalV2.equals(p1))) continue;

                if (previousPortalV1 !== null && previousPortalV2 !== null &&
                    ((previousPortalV1.equals(p1) && previousPortalV2.equals(p2)) || (previousPortalV1.equals(p2) && previousPortalV2.equals(p1)))) continue;

                if (segmentsIntersectNotStrict(source, destination, p1, p2)) return false;
            }
            previousPortalV1 = currentPortalV1;
            previousPortalV2 = currentPortalV2;
        }
        return true;
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