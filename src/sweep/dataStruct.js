class mainDataStruct {
    // maintains a lower envelope
    constructor(functionSet) {
        //this.functionSet = functionSet;
        this.listMiniEnvelope = this.createMiniEnvelope(functionSet);
        //this.lowerEnvelope = void;
    }

    createMiniEnvelope(functionSet){
        let envelope = new miniEnvelope(functionSet);


        console.log("envelope = ", envelope);
        return envelope;
    }

    nextLocalMinimum(delta) {
        for(let i = 0; i<this.listMiniEnvelope.localMinimumList.length; i++) {
            if(this.listMiniEnvelope.localMinimumList[i].y <= delta) {continue;}
            return new Point(this.listMiniEnvelope.localMinimumList[i].x, this.listMiniEnvelope.localMinimumList[i].y);
        }
        return new Point(Infinity, Infinity); // no more candidate points
    }

    computeArray(interval, precision) {
        let array = [];
        let nb_points = 10**precision;
        let new_percentage;
        for(let i = 1; i < nb_points; i++) {
            new_percentage = interval[0] + i * (interval[1] - interval[0])/nb_points;
            array.push(new_percentage);
        }
        return array;
    }

    nextVertex(f, q) { //take all functions , compute every intersection (just look on x axis (left AND right) by binary searching), take the minimum
        let numberOfFunctions = this.listMiniEnvelope.sortedIntervalsOnX.length;
        let idxFirstFunction = binarySearch(0, numberOfFunctions - 1, (c) => isInInterval(this.listMiniEnvelope.sortedIntervalsOnX[c].interval, q, this.listMiniEnvelope.sortedIntervalsOnX[c].edgeInterval));
        let precision = 5;
        let valueArray = this.computeArray(f.interval, precision);

        let functionFPrime = this.listMiniEnvelope.sortedIntervalsOnX[idxFirstFunction];
        let idxQx = binarySearch(0, valueArray.length - 1, c => valueArray[c] <= q.toPercentage(f.edgeInterval));
        let v_j1 = binarySearch(0, valueArray.length - 1, c => valueArray[c] <= percentageToPoint(functionFPrime.interval[1], functionFPrime.edge));
        let idxIntersection = binarySearch(idxQx, v_j1, p => f.computeDistance(valueArray[p]) <= functionFPrime.computeDistance(valueArray[p]));

        if(!(idxIntersection === idxQx)) {return percentageToPoint(valueArray[idxIntersection], f.edgeInterval);}

        //Case 2

        let candidates = [];
        for(let i = 0; i < numberOfFunctions; i++) {
            functionFPrime = this.listMiniEnvelope.sortedIntervalsOnX[i];
            let vj = binarySearch(0, valueArray.length - 1, c => valueArray[c] <= percentageToPoint(functionFPrime.interval[0], functionFPrime.edge));
            let vk = binarySearch(0, valueArray.length - 1, c => valueArray[c] <= percentageToPoint(functionFPrime.interval[1], functionFPrime.edge));

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

    insert(f) {//inserts a new function into the lower envelope env_f
        let new_function_sets = this.listMiniEnvelope.functionsList.push(f);
        this.listMiniEnvelope = new miniEnvelope((new_function_sets));
    }

}

class miniEnvelope {
    constructor(miniEnvelope) {
        this.sortedIntervalsOnX = this.sortFunctionByInterval(miniEnvelope);
        this.functionsList = miniEnvelope;
        this.localMinimumList = this.createLocalMinimaList(miniEnvelope);
    }

    sortFunctionByInterval(miniEnvelope) {
        return miniEnvelope.sort((a, b) => a.interval[0].x - b.interval[0].x);
    }

    getOrthogonalProjection(p1, p2Inter, p3Inter) {
        let num = (p1.x - p2Inter.x) * (p3Inter.x - p2Inter.x) + (p1.y - p2Inter.y) * (p3Inter.y - p2Inter.y);
        let dem = (p3Inter.x - p2Inter.x)**2 + (p3Inter.y - p2Inter.y)**2;
        let middleTerm = num/dem;
        let new_x = p2Inter.x + middleTerm * (p3Inter.x - p2Inter.x);
        let new_y = p2Inter.y + middleTerm * (p3Inter.y - p2Inter.y);
        return new Point(new_x, new_y);
    }

    createLocalMinimaList(miniEnvelope) {
        let minima = [];
        for (let i = 0; i < miniEnvelope.length; i++) {
            let localMinimum = null;
            let validInterval = [percentageToPoint(miniEnvelope[i].interval[0], miniEnvelope[i].edgeInterval), percentageToPoint(miniEnvelope[i].interval[1], miniEnvelope[i].edgeInterval)];
            let vertex = miniEnvelope[i].lastVertexPosition;
            let projectedPoint = this.getOrthogonalProjection(vertex, validInterval[0], validInterval[1]);
            if(isInInterval(validInterval, projectedPoint, miniEnvelope[i].edgeInterval)) {
                localMinimum = projectedPoint;
                console.log("localMinimum in interval = ", localMinimum)
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

class envTree {

}

class envNode{ // each node is

}