class Portalgon {
    constructor() {
        this.fragments = [];
        this.portals = [];
    }

    draw() {}

    printEdges() {
        console.log("Edges:");
        this.edges.forEach((edge, index) => {
            console.log(
                `Edge ${index + 1}: (${edge[0][0]}, ${edge[0][1]}) -> (${edge[1][0]}, ${
                    edge[1][1]
                })`
            );
        });
    }
}
