function orient(a, b, c) {
    /**
     * Returns something
     *   <  0 if a b c is a left turn
     *   == 0 if a b c is straight
     *   >  0 if a b c is a right turn
     */

    let det =
        b.x * c.y - a.x * c.y + a.x * b.y - b.y * c.x + a.y * c.x - a.y * b.x;

    // Since the y-axis is flipped, we should input the opposite of every P.y in
    // the above formula but since there is exactly one P.y in every term of the sum,
    // we can simply flip the output and return a left turn when the determinant is
    // negative instead of positive.
    return det;
}

function tertiaryOrient(a, b, c) {
    /**
     * Returns
     *   -1 if a b c is a left turn
     *    0 if a b c is straight
     *    1 if a b c is a right turn
     */
    let det = orient(a, b, c);
    if (det < 0) return -1;

    if (det === 0) return 0;

    return 1;
}

function isLT(a, b, c) {
    /**
     * Return True iff a b c is a left turn
     */
    return orient(a, b, c) < 0;
}

function isRT(a, b, c) {
    /**
     * Return True iff a b c is a right turn
     */
    return orient(a, b, c) > 0;
}

function isStraight(a, b, c) {
    /**
     * Return True iff a b c is straight
     */
    return orient(a, b, c) === 0;
}
