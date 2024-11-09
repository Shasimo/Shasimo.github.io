function drawFragmentsConnectedByPortal(sketch, portalgon, portal) {
    let fragment1 = portalgon.fragments[portal.portalEnd1.fragmentIdx].copy();
    let fragment2 = portalgon.fragments[portal.portalEnd2.fragmentIdx].copy();

    let portalCopy = portal.copy();

    let portalgonToDraw = new Portalgon([fragment1, fragment2], [portalCopy]);

    let v1 = portalCopy.portalEnd1.vertex2.sub(portalCopy.portalEnd1.vertex1);
    let v2 = portalCopy.portalEnd2.vertex2.sub(portalCopy.portalEnd2.vertex1);

    let angle = getAngleBetween(v1, v2);

    fragment2.rotate(-angle);

    portalCopy.portalEnd1.fragmentIdx = 0;
    portalCopy.portalEnd2.fragmentIdx = 1;
    portalCopy.portalEnd1.vertex1 = fragment1.vertices[portalCopy.portalEnd1.edge[0]];
    portalCopy.portalEnd2.vertex1 = fragment2.vertices[portalCopy.portalEnd2.edge[0]];
    portalCopy.portalEnd1.vertex2 = fragment1.vertices[portalCopy.portalEnd1.edge[1]];
    portalCopy.portalEnd2.vertex2 = fragment2.vertices[portalCopy.portalEnd2.edge[1]];

    console.log(portalgonToDraw);
    portalgonToDraw.draw(sketch);
}

function getAngleBetween(v1, v2) {
    let angle = Math.acos(v1.dot(v2) / (v1.norm() * v2.norm()));
    let p3 = new Point(-v1.y, v1.x);
    if (tertiaryOrient(new Point(0, 0), p3, v2) <= 0)
        angle = -angle;
    return angle;
}