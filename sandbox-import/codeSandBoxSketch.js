/* eslint-disable no-undef, no-unused-vars */

let constructing_portalgon = new PortalgonBuilder();

function setup() {
    createCanvas(windowWidth, windowHeight);
    // Put setup code here
    fill("black");
    textSize(40);
    button = createButton("Reset");
    button.position(20, 80);
    button.mousePressed(function (e) {
        e.stopPropagation();
        constructing_portalgon.resetBuild();
    });

    button2 = createButton("Reset fragment");
    button2.position(20, 110);
    button2.mousePressed(function (e) {
        e.stopPropagation();
        constructing_portalgon.resetFragment();
    });

    button3 = createButton("Next Fragment");
    button3.position(20, 140);
    button3.mousePressed(function (e) {
        e.stopPropagation();
        constructing_portalgon.validate_fragment();
    });

    button4 = createButton("Toggle grid");
    button4.position(20, 170);
    button4.mousePressed(function (e) {
        e.stopPropagation();
        gridToggle = !gridToggle;
    });

    button5 = createButton("Finish portalgon");
    button5.position(20, 170);
    button5.mousePressed(function (e) {
        e.stopPropagation();
        constructing_portalgon.pick_portals();
    });
}

function draw() {
    background(200);
    text("ひさしぶりだな。。。ぜははははは", 30, 50);
    drawGrid(gridToggle);
    constructing_portalgon.draw();
    constructing_portalgon.drawPreviewPoint(previewPoint);
}

function mousePressed() {
    constructing_portalgon.click(new Point(previewPoint.x, previewPoint.y));
}

function mouseMoved() {
    snapMouseToGrid();
}

// This Redraws the Canvas when resized
windowResized = function () {
    resizeCanvas(windowWidth, windowHeight);
};
