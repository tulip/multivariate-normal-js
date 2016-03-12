/* global Plotly */

// convert [x,y,(z)] pairs from the data generator into separate arrays
const rowsToXY = (rows) => {
    const x = [];
    const y = [];

    rows.forEach((row) => {
        x.push(row[0]);
        y.push(row[1]);
    });

    return { x, y };
};

const rowsToXYZ = (rows) => {
    const x = [];
    const y = [];
    const z = [];

    rows.forEach((row) => {
        x.push(row[0]);
        y.push(row[1]);
        z.push(row[2]);
    });

    return { x, y, z };
};

// draw charts with Plotly
export const drawChart2D = function(rows) {
    const {x, y} = rowsToXY(rows);

    const data = [{
        x: x,
        y: y,
        mode: "markers",
        type: "scattergl",
        marker: { opacity: 0.3 },
    }];

    Plotly.newPlot("renderTarget", data);
};

export const drawChart3D = function(rows) {
    const {x, y, z} = rowsToXYZ(rows);

    const data = [{
        x: x,
        y: y,
        z: z,
        mode: "markers",
        type: "scatter3d",
        marker: { opacity: 0.3 },
    }];

    Plotly.newPlot("renderTarget", data);
};
