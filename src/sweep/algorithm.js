class SPMFinder {
    constructor(portalgon, source, sourceFragmentIdx) {
        this.portalgon = portalgon;
        this.s = source;
        this.sourceFragmentIdx = sourceFragmentIdx;

        // event heap: (delta, event)
        this.eventHeap = new MinHeap();

        // edge -> MapEntry for that edge (SA, SV, envs...)
        this.edgeMap = new Map();

        // map from fragmentIdx -> {portals adjacent to that fragment}
        this.portalFragmentIdxMap = this.computePortalFragmentIdxMap();
    }

    computePortalFragmentIdxMap() {
        let res = new Map();

        for (let p = 0; p < this.portalgon.portals.length; p++) {
            let current = this.portalgon.portals[p];
            if (res.has(current.portalEnd1.fragmentIdx))
                res.get(current.portalEnd1.fragmentIdx).add(current);
            else
                res.set(current.portalEnd1.fragmentIdx, new Set([current]));

            if (res.has(current.portalEnd2.fragmentIdx))
                res.get(current.portalEnd2.fragmentIdx).add(current);
            else
                res.set(current.portalEnd2.fragmentIdx, new Set([current]));
        }
        return res;
    }

    init() {
        for (let portal of this.portalFragmentIdxMap.get(this.sourceFragmentIdx)) {
            let me = new MapEntry();
            let sig = new Signature(this.sourceFragmentIdx, this.s, []);
            let event = me.addInSA(sig, sig.toDistanceFunction(this.portalgon, portal));
            this.edgeMap.set(portal, me);
            this.eventHeap.add(event);
        }
    }

    run() {
        this.init();
        while (!this.eventHeap.isEmpty()) {
            let r = this.eventHeap.pop();
            let delta = r[0];
            let event = r[1];
            // do stuff
            console.log(delta, event);
        }
    }
}