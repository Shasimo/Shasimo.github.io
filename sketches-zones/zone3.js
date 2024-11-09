// demonstration zone

function setup_zone3(sketch) {
    sketch.createCanvas(wW, wH).parent('zone-three');
    sketch.fill("black");
    sketch.textSize(normalTS);
    sketch.strokeWeight(2);
}

function draw_zone3(sketch) {
    if (triangulatedPortalgon !== null) {
        drawFragmentsConnectedByPortal(sketch, triangulatedPortalgon, triangulatedPortalgon.portals[0]);
    }
}