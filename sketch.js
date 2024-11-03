/* eslint-disable no-undef, no-unused-vars */


// Each block of sketch relates to one appearing canvas,
//  link actions to their draw, setup and other functions to define behavior
const sketch_input = (sketch) => {
    sketch.setup = () => setupInput(sketch);
    sketch.draw = () => drawInput(sketch);
    sketch.mousePressed = () => mousePressure(sketch);
    sketch.mouseMoved = () => snapMouseToGrid(sketch);
};


const sketch_zone2 = (sketch) => {
    sketch.setup = () => setup_zone2(sketch); 
    sketch.draw = () => draw_zone2(sketch); 
};

const sketch_zone3 = (sketch) => {
    sketch.setup = () => setup_zone3(sketch);
    sketch.draw = () => draw_zone3(sketch);
};


new p5(sketch_input);
new p5(sketch_zone2);
new p5(sketch_zone3);