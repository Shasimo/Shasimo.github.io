function toCCW(polygon) {
    /**
     * If the given polygon is defind in a CW order, manipulate it in order
     * to make it CCW
     */
    if (polygon.length === 0) return polygon;

    // find the point with the lowest x-coord
    let leftest = null;
    for (let i = 0; i < polygon.length; i++) {
        if (leftest == null || polygon[i].x < polygon[leftest].x) leftest = i;
    }
    let previous = leftest - 1 < 0 ? polygon.length - 1 : leftest - 1;
    let next = (leftest + 1) % polygon.length;

    // if leftest-1 leftest leftest+1 is straight, keep following the polygon
    // until you encounter a turn
    while (isStraight(polygon[previous], polygon[leftest], polygon[next])) {
        leftest = (leftest + 1) % polygon.length;
        previous = leftest - 1 < 0 ? polygon.length - 1 : leftest - 1;
        next = (leftest + 1) % polygon.length;
    }

    // we are guaranteed that this inside of the polygon is on the left of the point
    // if the polygon is defined in CCW order
    // if leftest-1 leftest leftest+1 is a RT, we have a CW polygon
    if (isLT(polygon[previous], polygon[leftest], polygon[next])) return;

    // at this point, we have the guarantee that the polygon is givent in CW order.
    // we just need to reverse it to get it in CCW order !
    polygon.reverse();
}

function segmentsIntersect(p1l1, p2l1, p1l2, p2l2) {
    /**
     * Returns true iff the segment [p1l1 p2l1] intersects the segment [p1l2 p2L2]
     */
    if ((p1l1.equals(p1l2) && p2l1.equals(p2l2)) || (p1l1.equals(p2l2) && p2l1.equals(p1l2)))
        return true;

    if (p1l1.equals(p1l2) || p1l1.equals(p2l2) || p2l1.equals(p1l2) || p2l1.equals(p2l2))
        return false;

    // remove all cases where orient(i j k) = 0
    if (
        isPointInSegment(p1l1, p2l1, p1l2) ||
        isPointInSegment(p1l1, p2l1, p2l2) ||
        isPointInSegment(p1l2, p2l2, p1l1) ||
        isPointInSegment(p1l2, p2l2, p2l1)
    )
        return true;
    // simply do the test seen in class
    return (
        tertiaryOrient(p1l1, p2l1, p1l2) * tertiaryOrient(p1l1, p2l1, p2l2) < 0 &&
        tertiaryOrient(p1l2, p2l2, p1l1) * tertiaryOrient(p1l2, p2l2, p2l1) < 0
    );
}

function segmentsIntersectNotStrict(p1l1, p2l1, p1l2, p2l2) {
    /**
     * Returns true iff the segment ]p1l1 p2l1[ intersects the segment ]p1l2 p2L2[
     */
    if ((isPointInSegment(p1l1, p2l1, p1l2) && isPointInSegment(p1l1, p2l1, p2l2)) ||
        (isPointInSegment(p1l2, p2l2, p1l1) && isPointInSegment(p1l2, p2l2, p2l1)))
        return false;

    if ((p1l1.equals(p1l2) && p2l1.equals(p2l2)) || (p1l1.equals(p2l2) && p2l1.equals(p1l2)))
        return false;

    if (p1l1.equals(p1l2) || p1l1.equals(p2l2) || p2l1.equals(p1l2) || p2l1.equals(p2l2))
        return false;

    // remove all cases where orient(i j k) = 0
    if (
        isPointInSegment(p1l1, p2l1, p1l2) ||
        isPointInSegment(p1l1, p2l1, p2l2) ||
        isPointInSegment(p1l2, p2l2, p1l1) ||
        isPointInSegment(p1l2, p2l2, p2l1)
    )
        return false;
    // simply do the test seen in class
    return (
        tertiaryOrient(p1l1, p2l1, p1l2) * tertiaryOrient(p1l1, p2l1, p2l2) < 0 &&
        tertiaryOrient(p1l2, p2l2, p1l1) * tertiaryOrient(p1l2, p2l2, p2l1) < 0
    );
}

function checkNoOverlappingEdges(polygon) {
    /**
     * Given a polygon (an array of points), return true if no pair
     * of edges in the polygon are overlapping
     */

    // pick edge 1
    for (let i = 0; i < polygon.length; i++) {
        let j = (i + 1) % polygon.length;

        // pick edge 2
        for (let i2 = 0; i2 < polygon.length; i2++) {
            let j2 = (i2 + 1) % polygon.length;

            // they have to be disjoint
            if (i === i2 || j === j2 || j2 === i || j === i2) continue;

            // simply verify if they are colliding
            if (segmentsIntersect(polygon[i], polygon[j], polygon[i2], polygon[j2]))
                return false;
        }
    }
    // no pair of edges is colliding
    return true;
}

function isInInterval(interval, p, edge){
    let percentage = p.toPercentage(edge);
    return percentage >= interval[0] && percentage <= interval[1];
}

function computeEuclideanDistance(p1, p2) {
    return Math.sqrt(((p2.x - p1.x)**2+(p2.y-p1.y)**2));
}

function toLine(p1, p2) {
    if (p1.x === p2.x) return null;
    let m = (p1.y - p2.y) / (p1.x - p2.x);
    // y = mx + p
    // p1.y = m * p1.x + p => p = p1.y - m * p1.x
    let p = p1.y - m * p1.x;
    return [m, p];
}

function binarySearch(a, b, f) {
    /**
     * Binary searches the index i in [a,b] such that
     * f(i) is true and f(i+1) is false
     * f must be of the form true true ... true false ... false false on [a,b]
     */
    let low = a;
    let high = b;
    do {
        let current = Math.floor((low + high) / 2);

        // found the index !
        if (f(current) && (current === high || !f(current + 1))) return current;
        // current is true: new minimum
        if (f(current)) {
            low = current + 1;
        } else high = current - 1;
    } while (low <= high);

    // f(x) is false for all x \in [a, b]
    return a;
}

function percentageToPoint(percentage, edge) {
    return new Point(edge[0].x * (1-percentage) + edge[1].x * percentage,
        edge[0].y * (1-percentage) + edge[1].y * percentage);
}

function intersectionOfIntervals(int1, int2) {
    if (int1[1] < int2[0] || int2[1] < int1[0]) return null;

    return [Math.max(0, int1[0], int2[0]), Math.min(1, int1[1], int2[1])];
}