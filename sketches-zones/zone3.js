// demonstration zone
let portalTest = null;
let portalTestPoints = null;

function setup_zone3(sketch) {
    sketch.createCanvas(wW, wH).parent('zone-three');
    sketch.fill("black");
    sketch.textSize(normalTS);
    sketch.strokeWeight(2);
}

function generateRandomPath(portalgon, originFragmentIdx, length) {
    let ret = [];

    let lastFragmentIdx = originFragmentIdx;
    let lastChosenPortal = null;

    while (ret.length < length) {
        let validPortals = [];
        for (let i = 0; i < portalgon.portals.length; i++) {
            if (i !== lastChosenPortal && (portalgon.portals[i].portalEnd1.fragmentIdx === lastFragmentIdx ||
                portalgon.portals[i].portalEnd2.fragmentIdx === lastFragmentIdx))
                validPortals.push(portalgon.portals[i]);
        }

        lastChosenPortal = Math.floor(Math.random() * validPortals.length);
        let chosen = validPortals[lastChosenPortal];
        ret.push(chosen);
        if (chosen.portalEnd1.fragmentIdx === lastFragmentIdx)
            lastFragmentIdx = chosen.portalEnd2.fragmentIdx;
        else
            lastFragmentIdx = chosen.portalEnd1.fragmentIdx;
    }

    return ret;
}

function draw_zone3(sketch) {
    sketch.background(200);
    sketch.text("Embedding of random path", 30, 50);

    if (triangulatedPortalgon !== null && portalTest === null && source !== null && destination !== null) {
        let res = generateEmbeddingFromPath(
            triangulatedPortalgon,
            source[1],
            destination[1],
            [triangulatedPortalgon.portals[0], 0],
            //generateRandomPath(triangulatedPortalgon, 0, 4)
            source[0].copy(),
            destination[0].copy()
        );
        console.log(res);
        portalTest = res[0];
        portalTestPoints = res[1];
    }
    if (portalTest !== null && portalTestPoints !== null) {
        portalTest.draw(sketch);
        portalTestPoints[0].draw(sketch, "blue", 8);
        portalTestPoints[portalTestPoints.length - 1].draw(sketch, "red", 8);
        for (let i = 0; i < portalTestPoints.length - 1; i++) {
            let p1 = portalTestPoints[i];
            let p2 = portalTestPoints[i + 1];
            sketch.stroke("grey");
            sketch.line(p1.x, p1.y, p2.x, p2.y);
            sketch.stroke("black");
        }
    }
}