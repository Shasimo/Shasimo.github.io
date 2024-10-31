
const sketch_input = (sketch) => {
    sketch.setup = () => setup_input(sketch);
    sketch.draw = () => draw_input(sketch);
    sketch.mousePressed = () => add_points(sketch);
};


const sketch_zone2 = (sketch) => {
    sketch.setup = () => setup_zone2(sketch); 
    sketch.draw = () => draw_zone2(sketch); 
};


new p5(sketch_input);
new p5(sketch_zone2);