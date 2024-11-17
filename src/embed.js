function generateEmbeddingFromPath(portalgon, originFragmentIdx, destFragmentIdx, path, sourcePoint, endPoint) {
    /**
     * Generates an embedding of a certain path
     *
     * portalgon: the origin portalgon where the path is set
     * originFragmentIdx: the idx of the first fragment of the path
     * path: a list of Portals and ints:
     *          if int: the index of the vertex that the path goes through in the last fragment up to that point
     *          if Portal: the next portal that the path takes
     * sourcePoint: the point the path starts from (relative to the origin of the first fragment
     * endPoint: the point the path ends in (relative to the origin of the last fragment)
     */
    let originFragment = portalgon.fragments[originFragmentIdx].copy();
    let originFragmentIdxs = [originFragmentIdx];
    let points = [sourcePoint.add(portalgon.fragments[originFragmentIdx].origin)];
    originFragment.fragmentIdx = 0;

    let embeddedPortalgon = new Portalgon([originFragment],  []);

    let lastPortalIdxInPath = 0;

    for (let i = 0; i < path.length; i++)
        if (path[i] instanceof Portal)
            lastPortalIdxInPath = i;

    for (let i = 0; i < path.length; i++) {
        let nbFragments = embeddedPortalgon.fragments.length - 1;
        if (path[i] instanceof Portal) {
            let currentPortal = path[i].copy();
            if (currentPortal.portalEnd2.fragmentIdx === originFragmentIdxs[nbFragments])
                currentPortal.swapEnds();
            else if (currentPortal.portalEnd1.fragmentIdx !== originFragmentIdxs[nbFragments]) {
                console.log(originFragmentIdxs, currentPortal, nbFragments);
                throw new Error("Invalid path");
            }

            if (i === lastPortalIdxInPath) {
                portalgon.fragments[currentPortal.portalEnd2.fragmentIdx].attachedVertex = endPoint;
            }
            let newFragmentPortal = getFragmentsConnectedByPortal(portalgon, embeddedPortalgon.fragments[nbFragments], currentPortal);
            embeddedPortalgon.fragments.push(newFragmentPortal[0]);
            embeddedPortalgon.portals.push(newFragmentPortal[1]);
            originFragmentIdxs.push(currentPortal.portalEnd2.fragmentIdx);
        } else
            points.push(
                embeddedPortalgon.fragments[nbFragments].vertices[path[i]].add(
                    embeddedPortalgon.fragments[nbFragments].origin)
            );
    }

    if (originFragmentIdxs[originFragmentIdxs.length - 1] !== destFragmentIdx)
        throw new Error(`Path does not end in fragment ${destFragmentIdx}.`);

    points.push(embeddedPortalgon.fragments[embeddedPortalgon.fragments.length - 1].attachedVertex.add(embeddedPortalgon.fragments[embeddedPortalgon.fragments.length - 1].origin));

    return [embeddedPortalgon, points];
}

function getFragmentsConnectedByPortal(portalgon, fragment1, portal) {
    /**
     * portalgon is the source portalgon
     * fragment1 is the fragment (already placed)
     * portal is the portal that must be linked: portal.portalEnd1 is in fragment1
     *      and portal.portalEnd2 is in the fragment to be built
     *
     * returns the list [newFragment, newPortal]
     */

    let fragment2 = portalgon.fragments[portal.portalEnd2.fragmentIdx].copy();

    let portalCopy = portal.copy();
    portalCopy.portalEnd1.fragmentIdx = fragment1.fragmentIdx;
    portalCopy.portalEnd1.vertex1 = fragment1.vertices[portalCopy.portalEnd1.edge[0]];
    portalCopy.portalEnd1.vertex2 = fragment1.vertices[portalCopy.portalEnd1.edge[1]];

    let v1 = portalCopy.portalEnd1.vertex2.sub(portalCopy.portalEnd1.vertex1);
    let v2 = portalCopy.portalEnd2.vertex2.sub(portalCopy.portalEnd2.vertex1);

    let angle = getAngleBetween(v1, v2);

    fragment2.rotate(-angle, fragment2.getCenter());

    portalCopy.portalEnd2.fragmentIdx = fragment1.fragmentIdx + 1;
    portalCopy.portalEnd2.vertex1 = fragment2.vertices[portalCopy.portalEnd2.edge[0]];
    portalCopy.portalEnd2.vertex2 = fragment2.vertices[portalCopy.portalEnd2.edge[1]];

    fragment2.fragmentIdx = fragment1.fragmentIdx + 1;
    fragment2.origin = portalCopy.portalEnd1.vertex1.sub(portalCopy.portalEnd2.vertex1).add(fragment1.origin);

    if (isOverlapping(fragment1, fragment2, portalCopy.portalEnd1.getOrderedEdge(), portalCopy.portalEnd2.getOrderedEdge())) {
        fragment2.flip(portalCopy.portalEnd2.edge[0], portalCopy.portalEnd2.edge[1]);
    }

    return [fragment2, portalCopy];
}

function isOverlapping(fragment1, fragment2, exceptEdgeF1, exceptEdgeF2) {
    // check that there is no overlap with any of the edges of the other fragments
    for (let e11 = 0; e11 < fragment1.vertices.length; e11++) {
        let e12 = (e11 + 1) % fragment1.vertices.length;
        if (e11 === exceptEdgeF1[0] && e12 === exceptEdgeF1[1]) continue;
        for (let e21 = 0; e21 < fragment2.vertices.length; e21++) {
            let e22 = (e21 + 1) % fragment2.vertices.length;
            if (e21 === exceptEdgeF2[0] && e22 === exceptEdgeF2[1]) continue;

            if (
                segmentsIntersect(
                    fragment1.vertices[e11].add(fragment1.origin),
                    fragment1.vertices[e12].add(fragment1.origin),
                    fragment2.vertices[e21].add(fragment2.origin),
                    fragment2.vertices[e22].add(fragment2.origin),
                )
            )
                return true;
        }
    }
    for (let i = 0; i < 3; i++) {
        if (i === exceptEdgeF2[0] || i === exceptEdgeF2[1]) continue;
        if (isInTriangle(
            fragment1.vertices[0].add(fragment1.origin),
            fragment1.vertices[1].add(fragment1.origin),
            fragment1.vertices[2].add(fragment1.origin),
            fragment2.vertices[i].add(fragment2.origin)
        )) return true;
    }
    for (let i = 0; i < 3; i++) {
        if (i === exceptEdgeF1[0] || i === exceptEdgeF1[1]) continue;
        if (isInTriangle(
            fragment2.vertices[0].add(fragment2.origin),
            fragment2.vertices[1].add(fragment2.origin),
            fragment2.vertices[2].add(fragment2.origin),
            fragment1.vertices[i].add(fragment1.origin)
        )) return true;
    }

    return false;
}

function getAngleBetween(v1, v2) {
    let angle = Math.acos(v1.dot(v2) / (v1.norm() * v2.norm()));
    if (tertiaryOrient(v1, new Point(0, 0), v2) > 0)
        angle = -angle;
    return angle;
}