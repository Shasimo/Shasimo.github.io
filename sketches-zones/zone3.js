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

    if (triangulatedPortalgon !== null && portalTest === null && portalTestPoints === null && destination !== null && source !== null) {
        let originalPortalgon = triangulatedPortalgon.copy();
        let spm = new ShortestPathMap(originalPortalgon, source[0].copy(), source[1]);

        spm.construct();
        let sig = spm.query(destination[1], destination[0].copy());

        if (sig === null) {
            console.log("No signature found.");
            portalTestPoints = [];
            return;
        }
        let ret = generateEmbeddingFromSignature(originalPortalgon, sig, destination[1], destination[0].copy());
        portalTest = ret[0];
        portalTestPoints = ret[1];
    }

    if (portalTest !== null && portalTestPoints !== null) {
        portalTest.draw(sketch);
        portalTestPoints[0].draw(sketch, "blue", 8);
        portalTestPoints[portalTestPoints.length - 1].draw(sketch, "red", 8);
        for (let i = 0; i < portalTestPoints.length - 1; i++) {
            let p1 = portalTestPoints[i];
            let p2 = portalTestPoints[i + 1];
            sketch.stroke("green");
            sketch.line(p1.x, p1.y, p2.x, p2.y);
            sketch.stroke("black");
        }
    }
}