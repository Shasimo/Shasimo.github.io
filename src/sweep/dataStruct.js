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
    /*
    let potential = binarySearch(1, polygon.length - 2, (x) =>
        isLT(polygon[0], polygon[x], p)
      );
    */

    computeArray(p1Inter, p2Inter, precision) {
        let array = [];
        let nb_points = 10**precision;
        let new_x;
        let new_y;
        for(let i = 1; i < nb_points; i++) {
            new_x = p1Inter.x + i * (p2Inter.x - p1Inter.x)/(nb_points);
            new_y = p1Inter.y + i * (p2Inter.y - p1Inter.y)/(nb_points);
            array.push(new Point(new_x, new_y));
        }
        return array;
    }



    nextVertex(f, q) { //take all functions , compute every intersection (just look on x axis (left AND right) by binary searching, retrieve the), take the minimum
        //[f, f, f, f, f, f,f] (a, b, f'). a, b

        //[faux, faux, | vrai, vrai, vrai, vrai, vrai, vrai, | faux, faux, ]

        let idxFirstFunction = binarySearch(0, this.listMiniEnvelope.sortedIntervalsOnX.length - 1, (c) => isInInterval(this.listMiniEnvelope.sortedIntervalsOnX[c].interval, q));
        let functionFPrime = this.listMiniEnvelope.sortedIntervalsOnX[idxFirstFunction];
        //est-ce que il y a une intersection
        let candidatesOfNextPoints = [];
        let precision = 5;
        this.valueArray = this.computeArray(f.interval[0], f.interval[1], precision);

        //let idxQx = binarySearch(0, this.valueArray.length - 1, c => this.valueArray[c] <= q.x);
        let idxQx = Math.floor(((q.x-f.interval[0].x)/(f.interval[1].x-f.interval[0].x))*10**precision)
        let idxIntersection = binarySearch(idxQx, this.valueArray.length - 1, p => f.computeDistance(this.valueArray[p]) < functionFPrime.computeDistance(this.valueArray[p]));
        if (!(idxIntersection === idxQx)) {
            return this.valueArray[idxIntersection];
        }
        if (f.computeDistance(this.valueArray[idxQx]) === functionFPrime.computeDistance(this.valueArray[idxIntersection])) {
            return new Point(q.x, q.y);
        }
        //////////
        return new Point(Infinity, Infinity);



    }

    insert(f) {//inserts a new function into the lower envelope env_f

    }

}

class miniEnvelope {
    constructor(miniEnvelope) {
        this.sortedIntervalsOnX = this.sortFunctionByInterval(miniEnvelope);
        this.miniEnvelope = miniEnvelope;
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
            let validInterval = [miniEnvelope[i].interval[0], miniEnvelope[i].interval[1]];
            let vertex = miniEnvelope[i].lastVertexPosition;
            let projectedPoint = this.getOrthogonalProjection(vertex, validInterval[0], validInterval[1]);
            if(isInInterval(validInterval, projectedPoint)) {
                localMinimum = projectedPoint
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
        //console.log("Minima=", minima);
        return minima;
    }

}

class envTree {

}

class envNode{ // each node is

}