
let constructing_portalgon = new PortalgonBuilder();

function setupInput(sketch) {
    let canvas = sketch.createCanvas(wW, wH).parent('zone-one');
    let width = canvas.position().x;
    let height = canvas.position().y;
    sketch.fill("black");
    sketch.textSize(40);
    // Put setup code here
    sketch.fill("black");
    sketch.textSize(40);
    button = sketch.createButton("Reset");
    button.position(width + 20, height + 80);
    button.mousePressed(function (e) {
        e.stopPropagation();
        constructing_portalgon.resetBuild();
    });

    button2 = sketch.createButton("Reset fragment");
    button2.position(width + 20, height + 110);
    button2.mousePressed(function (e) {
        e.stopPropagation();
        constructing_portalgon.resetFragment();
    });

    button3 = sketch.createButton("Next Fragment");
    button3.position(width + 20, height + 140);
    button3.mousePressed(function (e) {
        e.stopPropagation();
        constructing_portalgon.validate_fragment();
    });

    button4 = sketch.createButton("Toggle grid");
    button4.position(width + 20, height + 170);
    button4.mousePressed(function (e) {
        e.stopPropagation();
        gridToggle = !gridToggle;
    });

    button5 = sketch.createButton("Finish portalgon");
    button5.position(width + 20, height + 170);
    button5.mousePressed(function (e) {
        e.stopPropagation();
        constructing_portalgon.pick_portals();
    });

  }

function drawInput(sketch) {
    sketch.background(200);
    sketch.text("ひさしぶりだな。。。ぜははははは", 30, 50);
    drawGrid(gridToggle, sketch);
    constructing_portalgon.draw(sketch);
    constructing_portalgon.drawPreviewPoint(previewPoint, sketch);
}


function mousePressure(sketch) {
    constructing_portalgon.click(new Point(previewPoint.x, previewPoint.y));
}

//function mouseMotion(sketch) {
//    snapMouseToGrid();
//}

  