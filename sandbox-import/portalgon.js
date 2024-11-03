class Portalgon {
    constructor(fragments, portals) {
        this.fragments = fragments;
        this.portals = portals;
    }

    draw(sketch) {
        for (let i = 0; i < this.fragments.length; i++) {
            this.fragments[i].draw(sketch, this.fragments[i].origin);
        }

        for (let i = 0; i < this.portals.length; i++) {
            this.portals[i].draw(sketch);
        }
    }

    triangulate() {
        /**
         * Given a polygon, returns the list of chords (pairs of points) that need
         * to be added in order to get a triangulation of the original polygon
         */
        let newPortalgon= new Portalgon([], []);
        let map = new Map();

        for (let f = 0; f < this.fragments.length; f++) {

            let originalIndices = this.fragments[f].vertices.map((_, index) => index); // Maintain original indices;
            let unremovedPoints = createCopy(this.fragments[f].vertices);

            // loop until we are left with only a triangle
            while (unremovedPoints.length > 3) {
                // find an ear by testing every vertex that has not yet been removed
                for (let j = 0; j < unremovedPoints.length; j++) {
                    let previous = j - 1 < 0 ? unremovedPoints.length - 1 : j - 1;
                    let next = (j + 1) % unremovedPoints.length;
                    // convex vertex
                    if (isLT(unremovedPoints[previous], unremovedPoints[j], unremovedPoints[next])) {
                        let ear = true;
                        // to be an ear, we need every other point that was not removed
                        // to not be in the triangle previous - j - next
                        for (let k = 0; k < unremovedPoints.length; k++) {
                            if (k === previous || k === j || k === next) continue;
                            if (isInTriangle(unremovedPoints[previous], unremovedPoints[j], unremovedPoints[next], unremovedPoints[k])) {
                                ear = false;break;}
                        }
                        if (ear === true) {
                            // we found an ear !
                            // we can add the found chord to the triangulation and
                            // remove the ear
                            let vertices_of_triangle = [unremovedPoints[previous].add(this.fragments[f].origin), unremovedPoints[j].add(this.fragments[f].origin), unremovedPoints[next].add(this.fragments[f].origin)]
                            let edge_indices = [originalIndices[previous], originalIndices[next]];
                            let new_fragment_idx = newPortalgon.fragments.length;
                            let portal_and_triangle = this.createTriangleFragment(this.fragments[f], new_fragment_idx, f, vertices_of_triangle, edge_indices);
                            newPortalgon.fragments.push(portal_and_triangle[1]);
                            newPortalgon.portals.push(portal_and_triangle[0]);

                            if (!map.has([f, originalIndices[previous]])) {
                                map.set([f, originalIndices[previous]].toString(), [newPortalgon.fragments.length - 1, 0]);
                            }

                            if (!map.has([f, originalIndices[j]])) {
                                map.set([f, originalIndices[j]].toString(), [newPortalgon.fragments.length - 1, 1]);
                            }

                            unremovedPoints = removeIthElementOfArray(unremovedPoints, j);
                            originalIndices.splice(j, 1); // Also update the original indices array
                        }
                    }
                }
            }
            // still a triangle?
        }

        console.log(newPortalgon.portals);

        for (let p = 0; p < this.portals.length; p++) {
            let oldPortal = this.portals[p];
            let portal = new Portal();
            let portalEnd1 = new PortalEnd(
                newPortalgon.fragments[map.get([oldPortal.portalEnd1.fragmentIdx, oldPortal.portalEnd1.edge[0]].toString())[0]],
                map.get([oldPortal.portalEnd1.fragmentIdx, oldPortal.portalEnd1.edge[0]].toString())[0],
                map.get([oldPortal.portalEnd1.fragmentIdx, oldPortal.portalEnd1.edge[0]].toString())[1],
                map.get([oldPortal.portalEnd1.fragmentIdx, oldPortal.portalEnd1.edge[1]].toString())[1]
            );
            let portalEnd2 = new PortalEnd(
                newPortalgon.fragments[map.get([oldPortal.portalEnd2.fragmentIdx, oldPortal.portalEnd2.edge[0]].toString())[0]],
                map.get([oldPortal.portalEnd2.fragmentIdx, oldPortal.portalEnd2.edge[0]].toString())[0],
                map.get([oldPortal.portalEnd2.fragmentIdx, oldPortal.portalEnd2.edge[0]].toString())[1],
                map.get([oldPortal.portalEnd2.fragmentIdx, oldPortal.portalEnd2.edge[1]].toString())[1]
            );
            portal.setFirstEnd(portalEnd1);
            portal.setSecondEnd(portalEnd2);
            portal.color = this.portals[p].color;
            newPortalgon.portals.push(portal);
        }

        return newPortalgon;
    }

    createTriangleFragment(original_fragment, new_fragment_idx, idx, vertices_points, edge_vertices_original_indices){

        let triangleFragment = new Fragment(vertices_points);
        //create its portalEnd
        let chordPortal = new Portal();
        let portalEnd1 = new PortalEnd(triangleFragment, new_fragment_idx, 0, 2)
        let portalEnd2 = new PortalEnd(original_fragment, idx, edge_vertices_original_indices[0], edge_vertices_original_indices[1])
        chordPortal.setFirstEnd(portalEnd1); // portal put on triangle ear (on first and last vertex)
        chordPortal.setSecondEnd(portalEnd2); // portal put on remaining uncut piece
        return [chordPortal,triangleFragment];
    }



}
