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

    computeVisibilityInterval(v, edge) {
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

            if (this.canSourceSeeDestination(v, current)) {
                interval = [alpha, null];
                break;
            }
        }

        if (interval === null) return null;

        interval[1] = binarySearch(interval[0] * RESOLUTION, RESOLUTION, p => {
            let alpha = p / RESOLUTION;
            let current = new Point(
                edgeVert1.x * (1 - alpha) + edgeVert2.x * alpha,
                edgeVert1.y * (1 - alpha) + edgeVert2.y * alpha
            );
            return this.canSourceSeeDestination(v, current);
        }) / RESOLUTION;

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

    canSourceSeeDestination(source, destination) {

        for (let f = 0; f < this.fragments.length; f++) {
            let currentFragment = this.fragments[f];
            for (let l = 0; l < currentFragment.vertices.length; l++) {
                let p1 = currentFragment.vertices[l].add(currentFragment.origin);
                let p2 = currentFragment.vertices[(l + 1) % currentFragment.vertices.length].add(currentFragment.origin);
                if (isPointInSegment(p1, p2, destination)) continue;
                if (this.isPortalPosition(p1, p2)) continue;

                if (segmentsIntersectNotStrict(source, destination, p1, p2)) return false;
            }
        }

        return true;
    }
}
