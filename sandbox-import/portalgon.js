class Portalgon {
    constructor(fragments, portals) {
        this.fragments = fragments;
        this.portals = portals;
        this.fragmentation = []; // collection of fragments: output of the triangulated this.fragments
        this.portalChords = [];
        this.triangulatePortalgon();
    }

    draw(sketch) {
        for (let i = 0; i < this.fragments.length; i++) {
            this.fragments[i].draw(sketch, this.fragments[i].origin);
        }

        for (let i = 0; i < this.portals.length; i++) {
            this.portals[i].draw(sketch);
        }
    }

    drawTriangulation(sketch) {
        for (let i = 0; i < this.fragmentation.length; i++) {
            this.fragmentation[i].draw(sketch, this.fragmentation[i].origin);
        }

        for (let i = 0; i < this.portals.length; i++) {
            this.portals[i].draw(sketch);
            this.portalChords[i].draw(sketch);
        }
    }

    triangulatePortalgon(sketch){
        this.triangulate(sketch)
    }

    triangulate(sketch) {
        /**
         * Given a polygon, returns the list of chords (pairs of points) that need
         * to be added in order to get a triangulation of the original polygon
         */
        for (let f =0; f<this.fragments.length; f++) {

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
                            let vertices_of_triangle = [unremovedPoints[previous], unremovedPoints[j], unremovedPoints[next]]
                            let edge_indices = [originalIndices[previous], originalIndices[next]];
                            let portal_and_triangle = this.createTriangleFragment(sketch, this.fragments[f], vertices_of_triangle, edge_indices);
                            this.fragmentation.push(portal_and_triangle[1]);
                            this.portalChords.push(portal_and_triangle[0]);
                            unremovedPoints = removeIthElementOfArray(unremovedPoints, j);
                            originalIndices.splice(j, 1); // Also update the original indices array
                        }
                    }
                }
            }
        }
    }

    createTriangleFragment(sketch, original_fragment, vertices_points,edge_vertices_original_indices){

        let triangleFragment = new Fragment(vertices_points);
        //create its portalEnd
        let chordPortal = new Portal();
        let portalEnd1 = new PortalEnd(triangleFragment, 0, 2)
        let portalEnd2 = new PortalEnd(original_fragment, edge_vertices_original_indices[0], edge_vertices_original_indices[1])
        chordPortal.setFirstEnd(portalEnd1); // portal put on triangle ear (on first and last vertex)
        chordPortal.setSecondEnd(portalEnd2); // portal put on remaining uncut piece
        //chordPortal.color = sketch.color(sketch.random(255), sketch.random(255), sketch.random(255)); // how is color handled to be drawn ?
        return [chordPortal,triangleFragment];
    }



}
