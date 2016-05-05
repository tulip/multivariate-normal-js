/* eslint-disable */

import MN from "./index.js";

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = MN;
}
else if (typeof define === "function" && define.amd) {
    define([], function() {
        return MN;
    });
}
else if (typeof window === "object") {
    window.MN = MN;
}
else {
    console.warn("Could not export MultivariableNormal");
}
