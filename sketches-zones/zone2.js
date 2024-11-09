// demonstration zone
let triangulatedPortalgon = null;
function setup_zone2(sketch) {
    sketch.createCanvas(wW, wH).parent('zone-two');
    sketch.fill("black");
    sketch.textSize(normalTS);
    sketch.strokeWeight(2);
}

function draw_zone2(sketch) {
    sketch.background(200);
    sketch.text("Zone3", 30, 50);

    if (portalgon !== null && triangulatedPortalgon === null) {
        triangulatedPortalgon = triangulate(portalgon);
        console.log(triangulatedPortalgon);
    }
    if (triangulatedPortalgon !== null) {
        triangulatedPortalgon.draw(sketch);
    }
}