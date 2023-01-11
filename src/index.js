import isArray from "lodash.isarray";
import { validateMean, validateCovAndGetSVD } from "./validation.js";
import Distribution from "./distribution.js";

const MultivariateNormal = (unvalidatedMean, unvalidatedCov, seed) => {
    if (!isArray(unvalidatedMean)) {
        throw new Error("mean must be an array");
    }

    const n = unvalidatedMean.length;
    const mean = validateMean(unvalidatedMean, n);
    const { cov, svd } = validateCovAndGetSVD(unvalidatedCov, n);

    return Distribution(n, mean, cov, svd, seed);
};

export default MultivariateNormal;
