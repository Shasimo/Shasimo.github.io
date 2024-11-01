function isInTriangle(a, b, c, p) {
    /**
     * Return True iff the point p in contained within
     * the closed triangle a b c
     */

    // if p is sitting on the boundary of the triangle, it is in the triangle
    if (
        isPointInSegment(a, b, p) ||
        isPointInSegment(b, c, p) ||
        isPointInSegment(c, a, p)
    )
        return true;

    let test1 = tertiaryOrient(a, b, p);
    let test2 = tertiaryOrient(b, c, p);
    let test3 = tertiaryOrient(c, a, p);

    if (test1 == 0 || test2 == 0 || test3 == 0) {
        // at this point, we know that p is not on the boundary of
        // the triangle a b c: having p aligned with any of the triangle's
        // sides means that p HAS to be not on the boundary i.e. on the outsite
        return false;
    }

    // otherwise, we accept iff we always turn right or always turn left
    // (it depends on the order of a, b, c)
    return test1 == test2 && test2 == test3;
}

function isPointInSegment(a, b, p) {
    /**
     * Given three aligned points a, b and p
     * Returns True iff p is on the segment [a,b]
     */
    // cannot be on the segment if the points are not even aligned
    if (orient(a, b, p) != 0) return false;

    // if a and b are the same point, return true iff p is too
    if (a.x == b.x && a.y == b.y) return a.x == p.x && a.y == p.y;

    // is on the segment if p is either a or b
    if ((a.x == p.x && a.y == p.y) || (b.x == p.x && b.y == p.y)) return true;

    let c;

    // c is a new point, not collinear with a, b and p
    if (a.x == b.x) c = new Point(a.x + 1, a.y);
    else c = new Point(a.x, a.y + 1);

    // if p in not contained in [a,b], we know that c a p must turn in the
    // opposite way of c b p
    return tertiaryOrient(c, a, p) == -tertiaryOrient(c, b, p);
}
