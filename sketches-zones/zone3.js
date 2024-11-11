// demonstration zone
let portalTest = null;

function setup_zone3(sketch) {
    sketch.createCanvas(wW, wH).parent('zone-three');
    sketch.fill("black");
    sketch.textSize(normalTS);
    sketch.strokeWeight(2);
}

function draw_zone3(sketch) {
    if (triangulatedPortalgon !== null && portalTest === null) {
        portalTest = getFragmentsConnectedByPortal(triangulatedPortalgon, triangulatedPortalgon.portals[0]);
    }
    if (portalTest !== null)
        portalTest.draw(sketch);
}