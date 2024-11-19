let stickFigureX = 50; // Initial X position of the stick figure
let stickFigureY = 200; // Y position of the stick figure
let walkSpeed = 2; // Speed of walking
let portal1X = 300; // Position of the first portal
let portal2X = 600; // Position of the second portal
let portalY = 200; // Y position of the portals
let inPortal = false; // Track if the stick figure is in a portal

function setupAnim(sketch) {
    sketch.createCanvas(700, 400).parent('walking-animation');
}

function drawAnim(sketch) {
    sketch.background(200);

    // Draw portals
    drawPortal(sketch, portal1X, portalY, sketch.color(100, 150, 255));
    drawPortal(sketch, portal2X, portalY, sketch.color(100, 150, 255));

    if (!inPortal) {
        // Draw stick figure walking
        drawStickFigure(sketch, stickFigureX, stickFigureY);
        stickFigureX += walkSpeed;

        // Check if the stick figure enters the first portal
        if (sketch.dist(stickFigureX, stickFigureY, portal1X, portalY) < 30) {
            inPortal = true;
            setTimeout(() => {
                // Teleport to the second portal
                stickFigureX = portal2X + 40;
                inPortal = false;
            }, 500); // Delay to simulate teleportation
        }
    }
}

// Function to draw a stick figure at a given position
function drawStickFigure(sketch, x, y) {
    sketch.stroke(0);
    sketch.strokeWeight(2);

    // Head
    sketch.fill(0);
    sketch.circle(x, y - 20, 20);

    // Body
    sketch.line(x, y - 10, x, y + 20);

    // Arms
    sketch.line(x, y, x - 15, y + 10);
    sketch.line(x, y, x + 15, y + 10);

    // Legs (walking animation)
    let legSwing = Math.sin(sketch.frameCount * 0.1) * 10;
    sketch.line(x, y + 20, x - 10 + legSwing, y + 40);
    sketch.line(x, y + 20, x + 10 - legSwing, y + 40);
}

// Function to draw a portal
function drawPortal(sketch, x, y, col) {
    sketch.noFill();
    sketch.strokeWeight(5);
    sketch.stroke(col);
    sketch.ellipse(x, y, 0, 100);

}