
function setup_input(sketch) {
  let canvas = sketch.createCanvas(wW, wH).parent('zone-one'); 
  let width = canvas.position().x
  let height = canvas.position().y

  sketch.fill("black");
  sketch.textSize(40);
  button = sketch.createButton("Clear");
  button.position(width + 30, height + 70);
  button.mousePressed(resetpoints);
  }
  
  function resetpoints() {
    points = [];
  }
  
function draw_input(sketch) {
    sketch.background(200);
    for (i in points) {
      sketch.ellipse(points[i].x, points[i].y, 4, 4);
    }
    sketch.text("Hello world", 30, 50);
  }

function add_points(sketch) {
  points.push(new Point(sketch.mouseX, sketch.mouseY)); 

}

  