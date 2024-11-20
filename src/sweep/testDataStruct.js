



function testDataStruct() {
    /*class FunSignatureEdge{
        // f _sigma|e()
        constructor(signature, interval, distanceLastVertexFromSource, vertex, edge) {
    */
    let v = new Point(0,0);
    let interval = [new Point(2,1), new Point(2,2)];
    let edge = [new Point(200,0), new Point(200,3)];
    let distanceSource = 2;
    let signature = [v, edge];
    let f1 = new DistanceFunction(signature, interval, distanceSource, v, edge);

    let v2 = new Point(5,5);
    let interval2 = [new Point(100,100), new Point(100,0)];
    let edge2 = [new Point(100,100), new Point(100,0)];
    let distanceSource2 = 3;
    let signature2 = [v2, edge2];
    let f2 = new DistanceFunction(signature2, interval2, distanceSource2, v2, edge2);


    let signature3 = [];
    let v3 = new Point(0,0); // v3 is closer to an edge than everybody else meaning the next min is on its interval
    let interval3 = [new Point(10,10), new Point(10,-10)];
    let edge3 = [new Point(10,10), new Point(10,-10)];
    let distanceSource3 = 1;

    let f3 = new DistanceFunction(signature3, interval3, distanceSource3, v3, edge3);


    // env
    let functionList = [f1, f2, f3];
    let MDS = new Envelope(functionList);
    let localMinimum = MDS.nextLocalMinimum(2);
    let awaited = v2;
    if (!localMinimum.equals(v3)){
        console.log("Answer :", localMinimum, "Awaited := ", awaited );

    }else{
        console.log("Test : Local Minimum Successfull : ", awaited, " == ",localMinimum);
    }
}

// testDataStruct();