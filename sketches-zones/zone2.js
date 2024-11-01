// demonstration zone

function setup_zone2(sketch) {
    sketch.createCanvas(wW, wH).parent('zone-two');
    sketch.fill("black");
    sketch.textSize(40);
    sketch.strokeWeight(2);
}

function draw_zone2(sketch) {
    sketch.background(200);
    sketch.text("Hello Sacha & Mathieu", 30, 50);

    if (portalgon !== null) {
        portalgon.draw(sketch);
    }

    // Note : useful for further usage of algorithms on our portalgon
    // uncomment and you'll end up duplicating the first input zone input
    //drawInput(sketch);
}