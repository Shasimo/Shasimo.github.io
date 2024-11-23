
let constructing_portalgon = null;
let portalgon = null;

let buttons = []; // used for dynamic positioning on window resize
function setupInput(sketch) {
    let canvas = sketch.createCanvas(wW, wH).parent('zone-one');
    let width = canvas.position().x;
    let height = canvas.position().y;
    sketch.fill("black");
    sketch.textSize(40);

    constructing_portalgon = new PortalgonBuilder();
    buttons.push(createCustomButton(sketch, "Reset", width, height +80, (e) => {
        e.stopPropagation();
        constructing_portalgon.resetBuild();
    }));
    buttons.push(createCustomButton(sketch, "Reset fragment", width, height +110, (e) => {
        e.stopPropagation();
        constructing_portalgon.resetFragment();
    }));
    buttons.push(createCustomButton(sketch, "Next Fragment", width,height +140, (e) => {
        e.stopPropagation();
        constructing_portalgon.validate_fragment();
    }));
    buttons.push(createCustomButton(sketch,"Pick Portals", width,height +170, (e) => {
        e.stopPropagation();
        constructing_portalgon.pick_portals();
    }));
    buttons.push(createCustomButton(sketch, "Next Portal", width, height +200, (e) => {
        e.stopPropagation();
        constructing_portalgon.next_portal();
    }));
    buttons.push(createCustomButton(sketch, "Finish", width,height +230, (e) => {
        e.stopPropagation();
        portalgon = constructing_portalgon.finish();
    }));

}

function createCustomButton(sketch, label, offsetX, offsetY, callback) {
    let button = sketch.createButton(label);
    button.position(offsetX+ 20, offsetY); // Initial positioning
    button.mousePressed(callback);
    return { button, offsetY }; // Store the button and its offset
}

function drawInput(sketch) {
    sketch.background(BACKGROUND_COLOR);
    drawGrid(gridToggle, sketch);
    constructing_portalgon.draw(sketch);
    constructing_portalgon.drawPreviewPoint(previewPoint, sketch);
}


function mousePressure(sketch) {
    if (portalgon === null)
        constructing_portalgon.click(new Point(previewPoint.x, previewPoint.y));
    else
        clickZone2();
}

//broken
function handleCanvasResize(sketch) {
    sketch.resizeCanvas(wW, wH);
    buttons.forEach(({ button, offsetY }) => {
        //console.log(button);
        //console.log(sketch.canvas.width)
        //button.position(sketch.position().x + 20, offsetY);
    });
}
