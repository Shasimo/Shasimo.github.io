class Portalgon {
    constructor(fragments, portals) {
        this.fragments = fragments;
        this.portals = portals;
    }

    draw(sketch) {
        for (let i = 0; i < this.fragments.length; i++) {
            this.fragments[i].draw(sketch, this.fragments[i].origin, i);
        }

        for (let i = 0; i < this.portals.length; i++) {
            this.portals[i].draw(sketch, this.fragments);
        }
    }

    copy() {
        let fragmentsCopy = [];
        let portalsCopy = [];
        for (let i = 0; i < this.fragments.length; i++)
            fragmentsCopy.push(this.fragments[i].copy());
        for (let i = 0; i < this.portals.length; i++)
            portalsCopy.push(this.portals[i].copy());

        return new Portalgon(fragmentsCopy, portalsCopy);
    }

    /*
    doesPathGoThroughEveryFragment(embeddedPath) {
        let fragmentsToCheck = [...Array(this.fragments.length).keys()];

        for (let i = 0; i < embeddedPath.length - 1; i++) {
            for (let p = 0; p <= RESOLUTION; p++) {
                let alpha = p / RESOLUTION;
                let current = new Point(
                    embeddedPath[i].x * (1 - alpha) + embeddedPath[i + 1].x * alpha,
                    embeddedPath[i].y * (1 - alpha) + embeddedPath[i + 1].y * alpha
                );

                for (let f = fragmentsToCheck.length - 1; f >= 0; f--) {
                    let currentFragment = this.fragments[fragmentsToCheck[f]];
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
     */

    computeVisibilityInterval(v, vertexFragmentIdx, edge) {
        let edgeFragment = this.fragments[edge.portalEnd1.fragmentIdx];
        let edgeVert1 = edgeFragment.vertices[edge.portalEnd1.edge[0]].add(edgeFragment.origin);
        let edgeVert2 = edgeFragment.vertices[edge.portalEnd1.edge[1]].add(edgeFragment.origin)
        let interval = null;

        for (let lower = 0; lower <= RESOLUTION; lower++) {
            let alpha = lower / RESOLUTION;
            let current = new Point(
                edgeVert1.x * (1 - alpha) + edgeVert2.x * alpha,
                edgeVert1.y * (1 - alpha) + edgeVert2.y * alpha
            );

            if (this.canSourceSeeDestination(v, current, vertexFragmentIdx, edge.portalEnd1.fragmentIdx)) {
                interval = [alpha, null];
                break;
            }
        }

        if (interval === null) return null;

        for (let upper = RESOLUTION; upper >= interval[0] * RESOLUTION; upper--) {
            let alpha = upper / RESOLUTION;
            let current = new Point(
                edgeVert1.x * (1 - alpha) + edgeVert2.x * alpha,
                edgeVert1.y * (1 - alpha) + edgeVert2.y * alpha
            );

            if (this.canSourceSeeDestination(v, current, vertexFragmentIdx, edge.portalEnd1.fragmentIdx)) {
                interval[1] = alpha;
                break;
            }
        }

        /*
        interval[1] = binarySearch(interval[0] * RESOLUTION, RESOLUTION, p => {
            let alpha = p / RESOLUTION;
            let current = new Point(
                edgeVert1.x * (1 - alpha) + edgeVert2.x * alpha,
                edgeVert1.y * (1 - alpha) + edgeVert2.y * alpha
            );
            return this.canSourceSeeDestination(v, current, vertexFragmentIdx, edge.portalEnd1.fragmentIdx);
        }) / RESOLUTION;
         */

        if (interval[1] === null) throw new Error("Upper end of the interval is null: this should NOT happen.");

        return interval;
    }

    isPortalPosition(p1, p2) {
        for (let p = 0; p < this.portals.length; p++) {
            let currentPortalE1 = this.portals[p].portalEnd1;
            let fragmentE1 = this.fragments[currentPortalE1.fragmentIdx];
            if ((currentPortalE1.vertex1.add(fragmentE1.origin).equals(p1) && currentPortalE1.vertex2.add(fragmentE1.origin).equals(p2)) ||
                (currentPortalE1.vertex2.add(fragmentE1.origin).equals(p1) && currentPortalE1.vertex1.add(fragmentE1.origin).equals(p2)))
                return true;
        }
        return false;
    }

    canSourceSeeDestination(source, destination, sourceFragmentIdx, destinationFragmentIdx) {

        let midPoint = new Point((source.x + destination.x) / 2, (source.y + destination.y) / 2);
        let isPathInSomeTriangle = false;

        // we CANNOT check every fragment because the embedding could be self-intersecting.
        // because we are checking for a straight-line visibility, there cannot be any self-intersections going on
        // between the fragments of the source and the destination
        for (let f = sourceFragmentIdx; f <= destinationFragmentIdx; f++) {
            let currentFragment = this.fragments[f];
            for (let l = 0; l < currentFragment.vertices.length; l++) {
                let p1 = currentFragment.vertices[l].add(currentFragment.origin);
                let p2 = currentFragment.vertices[(l + 1) % currentFragment.vertices.length].add(currentFragment.origin);
                if (isPointInSegment(p1, p2, destination)) continue;
                if (this.isPortalPosition(p1, p2)) continue;

                if (segmentsIntersectNotStrict(source, destination, p1, p2)) return false;
            }

            // we need to make SURE that the path goes INSIDE the portalgon (the only way that the above check does not
            // detect is if the path goes FULLY out of the portalgon
            // this means that we can pick any point in between and check whether some point on the line is in one
            // of the fragments
            if (isInTriangle(
                currentFragment.vertices[0].add(currentFragment.origin),
                currentFragment.vertices[1].add(currentFragment.origin),
                currentFragment.vertices[2].add(currentFragment.origin),
                midPoint)
            )
                isPathInSomeTriangle = true;
        }

        return isPathInSomeTriangle;
    }
}
