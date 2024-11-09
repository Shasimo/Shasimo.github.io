const gridSize = 40; // Size of each grid square
const gridColor = "black"; // no use yet
const previewPointColor = "black";
const previewPointPortalColor = "red";
let previewPoint = new Point(0, 0); // Variable to hold the current preview point
let gridToggle = true;

function drawGrid(flag, sketch) {
    // Vertical
    sketch.strokeWeight(0.3);
    if (flag) {
        for (let x = 0; x <= sketch.width; x += gridSize) {
            sketch.line(x, 0, x, sketch.height);
        }

        // Horizontal
        for (let y = 0; y <= sketch.height; y += gridSize) {
            sketch.line(0, y, sketch.width, y);
        }
    }
    sketch.strokeWeight(2);
}

function snapMouseToGrid(sketch) {
    let x = Math.round(sketch.mouseX / gridSize) * gridSize;
    let y = Math.round(sketch.mouseY / gridSize) * gridSize;
    previewPoint = new Point(x, y);
}
