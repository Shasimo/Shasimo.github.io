
let constructing_portalgon = null;
let portalgon = null;

function setupInput(sketch) {
    let canvas = sketch.createCanvas(wW, wH).parent('zone-one');
    let width = canvas.position().x;
    let height = canvas.position().y;
    sketch.fill("black");
    sketch.textSize(40);

    constructing_portalgon = new PortalgonBuilder();

    let button = sketch.createButton("Reset");
    button.position(width + 20, height + 80);
    button.mousePressed(function (e) {
        e.stopPropagation();
        constructing_portalgon.resetBuild();
    });

    let button2 = sketch.createButton("Reset fragment");
    button2.position(width + 20, height + 110);
    button2.mousePressed(function (e) {
        e.stopPropagation();
        constructing_portalgon.resetFragment();
    });

    let button3 = sketch.createButton("Next Fragment");
    button3.position(width + 20, height + 140);
    button3.mousePressed(function (e) {
        e.stopPropagation();
        constructing_portalgon.validate_fragment();
    });

    let button5 = sketch.createButton("Pick Portals");
    button5.position(width + 20, height + 170);
    button5.mousePressed(function (e) {
        e.stopPropagation();
        constructing_portalgon.pick_portals();
    });

    let button6 = sketch.createButton("Next Portal");
    button6.position(width + 20, height + 200);
    button6.mousePressed(function (e) {
        e.stopPropagation();
        constructing_portalgon.next_portal();
    });

    let button7 = sketch.createButton("Finish");
    button7.position(width + 20, height + 230);
    button7.mousePressed(function (e) {
        e.stopPropagation();
        portalgon = constructing_portalgon.finish();
    });
  }

function drawInput(sketch) {
    sketch.background(200);
    sketch.text("Draw some Portalgon", 30, 50);
    drawGrid(gridToggle, sketch);
    constructing_portalgon.draw(sketch);
    constructing_portalgon.drawPreviewPoint(previewPoint, sketch);
}


function mousePressure(sketch) {
    constructing_portalgon.click(new Point(previewPoint.x, previewPoint.y));
}
  