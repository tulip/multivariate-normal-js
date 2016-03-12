/* globals alert */
/* eslint no-alert: 0 */

import { drawChart2D, drawChart3D } from "./plot";
import { generateData } from "./data";
import { serializeForm } from "./util";
import $ from "jquery";

const NUM_POINTS = 5000;

const Forms = {
    init() {
        // form handlers
        $("form.2d").submit(function(evt) {
            evt.preventDefault();

            const f = serializeForm("form.2d");

            try {
                const data = generateData({
                    points: NUM_POINTS,
                    means: [f.meanX, f.meanY],
                    cov: [
                        [ f.cov00, f.cov01 ],
                        [ f.cov10, f.cov11 ],
                    ],
                });
                drawChart2D(data);
            }
            catch (e) {
                alert(e.message);
            }
        });

        $("form.3d").submit(function(evt) {
            evt.preventDefault();

            const f = serializeForm("form.3d");

            try {
                const data = generateData({
                    points: NUM_POINTS,
                    means: [f.meanX, f.meanY, f.meanZ],
                    cov: [
                        [ f.cov00, f.cov01, f.cov02 ],
                        [ f.cov10, f.cov11, f.cov12 ],
                        [ f.cov20, f.cov21, f.cov22 ],
                    ],
                });
                drawChart3D(data);
            }
            catch (e) {
                alert(e.message);
            }
        });
    },
};

export default Forms;
