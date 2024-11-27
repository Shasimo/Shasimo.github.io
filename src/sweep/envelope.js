class Envelope {
    constructor(functionSet) {
        this.envelope = this._createMiniDataStruct(functionSet);
    }

    /*********
     * PRIVATE
     **********/

    _createMiniDataStruct(functionSet){
        return new miniDataStruct(functionSet);
    }

    /************
     * PUBLIC
     **********/

    /*****
     * 
     * Iterate through the whole LocalMinimumList & select the first one at least as high as delta
     * 
     *******/
    nextLocalMinimum(delta) {
        for (let i = 0; i < this.envelope.localMinimumList.length; i++) {
            if (this.envelope.localMinimumList[i].y < delta) continue;
            return this.envelope.localMinimumList[i].copy();
        }
        return new Point(Infinity, Infinity); // no more candidate points
    }

    _isFMinimalSomewhere(f) {
        for (let i = f.interval[0]; i <= f.interval[1]; i += 1 / RESOLUTION) {
            let minimal = true;
            for (let fun of this.envelope.functionsList) {
                if (f.computeDistance(i) >= fun.computeDistance(i)) {
                    minimal = false;
                    break;
                }
            }
            if (minimal === true) return true
        }
        return false;
    }

    /**
     * Insert a new function 
     */
    insert(f) {
        if (!this._isFMinimalSomewhere(f)) return false;

        this.envelope.functionsList.push(f);
        this.envelope = new miniDataStruct(this.envelope.functionsList);
        return true;
    }
}

class miniDataStruct {
    constructor(miniEnvelope) {
        this.functionsList = miniEnvelope;
        this.localMinimumList = this._createLocalMinimaList(miniEnvelope);
    }

    /************
     * PRIVATE
     **********/

    _getOrthogonalProjection(p1, p2Inter, p3Inter) {
        let num = (p1.x - p2Inter.x) * (p3Inter.x - p2Inter.x) + (p1.y - p2Inter.y) * (p3Inter.y - p2Inter.y);
        let dem = (p3Inter.x - p2Inter.x) ** 2 + (p3Inter.y - p2Inter.y) ** 2;
        let middleTerm = num / dem;
        let new_x = p2Inter.x + middleTerm * (p3Inter.x - p2Inter.x);
        let new_y = p2Inter.y + middleTerm * (p3Inter.y - p2Inter.y);
        return new Point(new_x, new_y);
    }

    /**
     * Use orthogonal projection to find the local minimum. If out of the interval, the minimal is the closest interval point.
     * Sort the list of minima by y coordinate. The first one has the lowest y
     */
    _createLocalMinimaList(miniEnvelope) {
        let minima = [];
        for (let i = 0; i < miniEnvelope.length; i++) {
            let localMinimum = null;
            let validInterval = [percentageToPoint(miniEnvelope[i].interval[0], miniEnvelope[i].edgeInterval), percentageToPoint(miniEnvelope[i].interval[1], miniEnvelope[i].edgeInterval)];
            let vertex = miniEnvelope[i].lastVertexPosition;
            let projectedPoint = this._getOrthogonalProjection(vertex, validInterval[0], validInterval[1]);
            let localMinimumPercentage;

            if (isInInterval(miniEnvelope[i].interval, projectedPoint, miniEnvelope[i].edgeInterval)) {
                localMinimum = projectedPoint;
                localMinimumPercentage = localMinimum.toPercentage(miniEnvelope[i].edgeInterval);
            }
            else {
                let distanceP1Inter = computeEuclideanDistance(projectedPoint, validInterval[0]);
                let distanceP2Inter = computeEuclideanDistance(projectedPoint, validInterval[1]);
                localMinimumPercentage = distanceP1Inter > distanceP2Inter ? miniEnvelope[i].interval[1] : miniEnvelope[i].interval[0];
            }

            minima.push(new Point(localMinimumPercentage, miniEnvelope[i].computeDistance(localMinimumPercentage)));
        }
        minima.sort((a, b) => a.y - b.y);
        return minima;
    }
}