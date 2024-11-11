function getFragmentsConnectedByPortal(portalgon, portal) {
    let fragment1 = portalgon.fragments[portal.portalEnd1.fragmentIdx].copy();
    let fragment2 = portalgon.fragments[portal.portalEnd2.fragmentIdx].copy();

    let portalCopy = portal.copy();

    let portalgonToDraw = new Portalgon([fragment1, fragment2], [portalCopy]);

    let v1 = portalCopy.portalEnd1.vertex2.sub(portalCopy.portalEnd1.vertex1);
    let v2 = portalCopy.portalEnd2.vertex2.sub(portalCopy.portalEnd2.vertex1);

    let angle = getAngleBetween(v1, v2);

    fragment2.rotate(-angle, fragment2.getCenter());

    portalCopy.portalEnd1.fragmentIdx = 0;
    portalCopy.portalEnd2.fragmentIdx = 1;
    portalCopy.portalEnd1.vertex1 = fragment1.vertices[portalCopy.portalEnd1.edge[0]];
    portalCopy.portalEnd2.vertex1 = fragment2.vertices[portalCopy.portalEnd2.edge[0]];
    portalCopy.portalEnd1.vertex2 = fragment1.vertices[portalCopy.portalEnd1.edge[1]];
    portalCopy.portalEnd2.vertex2 = fragment2.vertices[portalCopy.portalEnd2.edge[1]];

    fragment2.origin = portalCopy.portalEnd1.vertex1.sub(portalCopy.portalEnd2.vertex1).add(fragment1.origin);

    if (isOverlapping(fragment1, fragment2, portalCopy.portalEnd1.getOrderedEdge(), portalCopy.portalEnd2.getOrderedEdge()))
        fragment2.flip(portalCopy.portalEnd2.edge[0], portalCopy.portalEnd2.edge[1]);

    return portalgonToDraw;
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
    return false;
}

function getAngleBetween(v1, v2) {
    let angle = Math.acos(v1.dot(v2) / (v1.norm() * v2.norm()));
    if (tertiaryOrient(v1, new Point(0, 0), v2) > 0)
        angle = -angle;
    return angle;
}