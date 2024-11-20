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

    _computeIntervalContinum(interval, precision) {
        let array = [];
        let nb_points = 10**precision;
        let new_percentage;
        for(let i = 1; i < nb_points; i++) {
            new_percentage = interval[0] + i * (interval[1] - interval[0])/nb_points;
            array.push(new_percentage);
        }
        return array;
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
        for(let i = 0; i<this.envelope.localMinimumList.length; i++) {
            if(this.envelope.localMinimumList[i].y <= delta) {continue;}
            return new Point(this.envelope.localMinimumList[i].x, this.envelope.localMinimumList[i].y);
        }
        return new Point(Infinity, Infinity); // no more candidate points
    }

    nextVertex(f, q) {
        let precision = 5;
        let valueArray = this._computeIntervalContinum(f.interval, precision);

        let idxFirstFunction = binarySearch(0, this.envelope.sortedIntervalsOnX.length - 1, (c) => isInInterval(this.envelope.sortedIntervalsOnX[c].interval, q, this.envelope.sortedIntervalsOnX[c].edgeInterval));
        let functionFPrime = this.envelope.sortedIntervalsOnX[idxFirstFunction];

        let idxQx = binarySearch(0, valueArray.length - 1, c => valueArray[c] <= q.toPercentage(f.edgeInterval));
        let vk = binarySearch(0, valueArray.length - 1, c => valueArray[c] <= percentageToPoint(functionFPrime.interval[1], functionFPrime.edgeInterval));
        let idxIntersection = binarySearch(idxQx, vk, p => f.computeDistance(valueArray[p]) <= functionFPrime.computeDistance(valueArray[p]));

        if(!(idxIntersection === idxQx)) {return percentageToPoint(valueArray[idxIntersection], f.edgeInterval);}

        let candidates = [];
        let left = this.envelope.sortedIntervalsOnX.filter(element => element.getPointsInterval()[0].x < q.x);
        let right = this.envelope.sortedIntervalsOnX.filter(element => element.getPointsInterval()[1].x > q.x);
        let functionToIterate = left.concat(right);
        for(let i = 0; i < functionToIterate.length; i++) {
            functionFPrime = functionToIterate[i];
            let vj = binarySearch(0, valueArray.length - 1, c => valueArray[c] <= percentageToPoint(functionFPrime.interval[0], functionFPrime.edgeInterval));
            vk = binarySearch(0, valueArray.length - 1, c => valueArray[c] <= percentageToPoint(functionFPrime.interval[1], functionFPrime.edgeInterval));

            let idxIntersection = binarySearch(vj, vk, p => f.computeDistance(valueArray[p]) <= functionFPrime.computeDistance(valueArray[p]));
            if (!(idxIntersection === vj)) { //
                candidates.push(percentageToPoint(valueArray[idxIntersection], f.edgeInterval));
            }
            if (idxIntersection === vj && (f.computeDistance(valueArray[idxIntersection]) === functionFPrime.computeDistance(valueArray[vj]))) {
                candidates.push(percentageToPoint(valueArray[idxIntersection], f.edgeInterval));
            }
        }
        if (candidates.length === 0){
            return new Point(Infinity, Infinity);
        }

        candidates.sort((a, b) => a.y - b.y);
        return candidates.find(candidate => candidate.y > q.y);

    }

    /**
     * Insert a new function 
     */
    insert(f) {
        this.envelope.functionsList.push(f);
        this.envelope = new miniDataStruct(this.envelope.functionsList);
    }

}

class miniDataStruct {
    constructor(miniEnvelope) {
        this.sortedIntervalsOnX = this._sortFunctionByInterval(miniEnvelope);
        this.functionsList = miniEnvelope;
        this.localMinimumList = this._createLocalMinimaList(miniEnvelope);
    }

    /************
     * PRIVATE
     **********/

    _sortFunctionByInterval(miniEnvelope) {
        return miniEnvelope.sort((a, b) => a.getPointsInterval()[0].x - b.getPointsInterval()[0].x);
    }

    _getOrthogonalProjection(p1, p2Inter, p3Inter) {
        let num = (p1.x - p2Inter.x) * (p3Inter.x - p2Inter.x) + (p1.y - p2Inter.y) * (p3Inter.y - p2Inter.y);
        let dem = (p3Inter.x - p2Inter.x)**2 + (p3Inter.y - p2Inter.y)**2;
        let middleTerm = num/dem;
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
            if(isInInterval(validInterval, projectedPoint, miniEnvelope[i].edgeInterval)) {
                localMinimum = projectedPoint;
            }
            else {
                let distanceP1Inter = computeEuclideanDistance(projectedPoint, validInterval[0]);
                let distanceP2Inter = computeEuclideanDistance(projectedPoint, validInterval[1]);
                localMinimum = distanceP1Inter > distanceP2Inter ? validInterval[0] : validInterval[1];
            }
            minima.push(localMinimum);
        }
        minima.sort((a, b) => a.y - b.y);
        return minima;
    }

}