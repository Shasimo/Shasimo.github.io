class mainDataStruct {
    // maintains a lower envelope
    constructor(functionSet) {
        //this.functionSet = functionSet;
        this.listMiniEnveloppe = this.createMiniEnvelope(functionSet);
        //this.lowerEnvelope = void;
    }

    createMiniEnvelope(functionSet){
        let numberOfMiniEnvelopes = Math.ceil(Math.log(functionSet.length)); //log m
        let nb_functions = Math.floor(Math.log(functionSet.length)); //to find the i in 2^i
        let list = [];
        for(let i = 0; i < numberOfMiniEnvelopes; i++){
            let start = i * nb_functions;
            let end = min((i + 1) * nb_functions, functionSet.length-1);
            let miniEnvelope = new miniEnvelope(functionSet.slice(start, end));
            list.push(miniEnvelope);
        }
        return list;
    }

    compareHeight(idx, delta) {
        return this.listMiniEnveloppe.localMinimumList[idx].y <= delta;
    }

    nextLocalMinimum(delta) {
        let list = [];
        for(let i = 0; i < this.listMiniEnveloppe; i++) {
            let idxLocalMinimum = binarySearch(0, this.listMiniEnveloppe[i].localMinimumList.length-1, (idx) => this.compareHeight(idx, delta))+1;
            let currentLocalMinimum = this.listMiniEnveloppe[i].localMinimumList[idxLocalMinimum];
            list.push(currentLocalMinimum);

        }
        list.sort((a, b) => a.y - b.y);
        return list[0];
    }

    nextVertex(f, q) {}

    insert(f) {//inserts a new function into the lower envelope env_f
    }

    tests(){

    }

}

class miniEnvelope {
    constructor(miniEnveloppe) {
        this.binaryTreeSearch = null;
        this.localMinimumList = this.createLocalMinimaList(miniEnveloppe);
    }

    getOrthogonalProjection(p1, p2Inter, p3Inter) {
        let num = (p1.x - p2Inter.x) * (p3Inter.x - p2Inter.x) + (p1.y - p2Inter.y) * (p3Inter.y - p2Inter.y);
        let dem = (p3Inter.x - p2Inter.x)**2 + (p3Inter.y - p2Inter.y)**2;
        let middleTerm = num/dem;
        let new_x = p2Inter.x + middleTerm * (p3Inter.x - p2Inter.x);
        let new_y = p2Inter.y + middleTerm * (p3Inter.y - p2Inter.y);
        return new Point(new_x, new_y);
    }

    createLocalMinimaList(miniEnveloppe) {
        let minima = [];
        for (let i = 0; i < miniEnveloppe.length; i++) {
            let localMinimum = null;
            let validInterval = [miniEnveloppe[i].interval[0], miniEnveloppe[i].interval[1]];
            let vertex = miniEnveloppe[i].lastVertexPosition;
            let projectedPoint = this.getOrthogonalProjection(vertex, validInterval[0], validInterval[1]);
            if(isInInterval(validInterval, projectedPoint)) {
                localMinimum = projectedPoint
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