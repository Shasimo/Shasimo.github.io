// demonstration zone
let portalTest = null;

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

    if (triangulatedPortalgon !== null && portalTest === null) {
        portalTest = generatePortalgonFromPath(
            triangulatedPortalgon,
            0,
            [triangulatedPortalgon.portals[0]]
            //generateRandomPath(triangulatedPortalgon, 0, 4)
        );
    }
    if (portalTest !== null)
        portalTest.draw(sketch);
}