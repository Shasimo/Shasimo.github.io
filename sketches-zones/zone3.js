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
        let spm = new SPMFinder(triangulatedPortalgon, source[0].copy(), source[1]);
        spm.run();
        console.log(spm);
        portalTest = 1;
    }
}