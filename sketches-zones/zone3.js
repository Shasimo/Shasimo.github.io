// demonstration zone
let portalTest = null;
let portalTestPoints = null;

function setup_zone3(sketch) {
    sketch.createCanvas(wW, wH).parent('zone-three');
    sketch.fill("black");
    sketch.textSize(normalTS);
    sketch.strokeWeight(2);
}

function draw_zone3(sketch) {
    sketch.background(200);
    sketch.text("Embedding of random path", 30, 50);

    if (triangulatedPortalgon !== null && portalTest === null && source !== null && destination !== null) {
        let res = generateEmbeddingFromSignature(
            triangulatedPortalgon,
            new Signature(
                source[1],
                source[0].copy(),
                [triangulatedPortalgon.portals[0], 0]
            ),
            destination[1],
            destination[0].copy()
        );
        console.log(res);
        portalTest = res[0];
        portalTestPoints = res[1];
    }
    if (portalTest !== null && portalTestPoints !== null) {
        portalTest.draw(sketch);
        portalTestPoints[0].draw(sketch, "blue", 8);
        portalTestPoints[portalTestPoints.length - 1].draw(sketch, "red", 8);
        for (let i = 0; i < portalTestPoints.length - 1; i++) {
            let p1 = portalTestPoints[i];
            let p2 = portalTestPoints[i + 1];
            sketch.stroke("grey");
            sketch.line(p1.x, p1.y, p2.x, p2.y);
            sketch.stroke("black");
        }
    }
}