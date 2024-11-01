function triangulate(polygon) {
    /**
     * Given a polygon, returns the list of chords (pairs of points) that need
     * to be added in order to get a triangulation of the original polygon
     */
    let n = polygon.length;
    let unremovedPoints = createCopy(polygon);

    let chordsToAdd = [];

    // loop until we are left with only a triangle
    while (unremovedPoints.length > 3) {
        // find an ear by testing every vertex that has not yet been removed
        for (let j = 0; j < unremovedPoints.length; j++) {
            let previous = j - 1 < 0 ? unremovedPoints.length - 1 : j - 1;
            let next = (j + 1) % unremovedPoints.length;
            // convex vertex
            if (
                isLT(
                    unremovedPoints[previous],
                    unremovedPoints[j],
                    unremovedPoints[next]
                )
            ) {
                let ear = true;
                // to be an ear, we need every other point that was not removed
                // to not be in the triangle previous - j - next
                for (let k = 0; k < unremovedPoints.length; k++) {
                    if (k == previous || k == j || k == next) continue;
                    if (
                        isInTriangle(
                            unremovedPoints[previous],
                            unremovedPoints[j],
                            unremovedPoints[next],
                            unremovedPoints[k]
                        )
                    ) {
                        ear = false;
                        break;
                    }
                }
                if (ear == true) {
                    // we found an ear !
                    // we can add the found chord to the triangulation and
                    // remove the ear
                    chordsToAdd.push([unremovedPoints[previous], unremovedPoints[next]]);
                    unremovedPoints = removeIthElementOfArray(unremovedPoints, j);
                }
            }
        }
    }
    return chordsToAdd;
}

function removeIthElementOfArray(arr, i) {
    /**
     * Returns an array with every elements except the one indexed i
     */
    ret = [];
    for (let j = 0; j < arr.length; j++) {
        if (j != i) ret.push(arr[j]);
    }
    return ret;
}

function createCopy(arr) {
    /**
     * Returns a copy of the given array
     */
    ret = [];
    for (let p = 0; p < arr.length; p++) {
        ret.push(arr[p]);
    }
    return ret;
}
