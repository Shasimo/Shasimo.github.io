// demonstration zone
let portalTest = null;
let portalTestPoints = null;
let spm = null;
let refreshPath = false;

function setup_zone3(sketch) {
    sketch.createCanvas(wW, wH).parent('zone-three');
    sketch.fill("black");
    sketch.textSize(normalTS);
    sketch.strokeWeight(2);
}

function draw_zone3(sketch) {
    sketch.background(BACKGROUND_COLOR);

    if (triangulatedPortalgon !== null && portalTest === null && portalTestPoints === null && destination !== null && source !== null && spm === null) {
        spm = new ShortestPathMap(triangulatedPortalgon.copy(), source[0].copy(), source[1]);
        spm.construct();
    }

    if (refreshPath === true) {
        let sig = spm.query(destination[1], destination[0].copy());

        if (sig === null) {
            console.log("No signature found.");
            portalTestPoints = [];
            refreshPath = false;
            return;
        }
        let ret = generateEmbeddingFromSignature(triangulatedPortalgon.copy(), sig, destination[1], destination[0].copy());
        portalTest = ret[0];
        portalTestPoints = ret[1];
        refreshPath = false;
    }

    if (portalTestPoints === []) {
        sketch.text("No path found.", 30, 100);
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