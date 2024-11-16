class Portalgon {
    constructor(fragments, portals) {
        this.fragments = fragments;
        this.portals = portals;
    }

    draw(sketch) {
        for (let i = 0; i < this.fragments.length; i++) {
            this.fragments[i].draw(sketch, this.fragments[i].origin, i);
        }

        for (let i = 0; i < this.portals.length; i++) {
            this.portals[i].draw(sketch, this.fragments);
        }
    }

    copy() {
        let fragmentsCopy = [];
        let portalsCopy = [];
        for (let i = 0; i < this.fragments.length; i++)
            fragmentsCopy.push(this.fragments[i].copy());
        for (let i = 0; i < this.portals.length; i++)
            portalsCopy.push(this.portals[i].copy());

        return new Portalgon(fragmentsCopy, portalsCopy);
    }
}
