import _ from "lodash";
import Numeric from "numeric";

// freezes nested arrays
const deepFreeze = (ary) => {
    if (_.isArray(ary)) {
        ary.forEach(deepFreeze);
        Object.freeze(ary);
    }
};

// validates a mean vector that's supposed to be of length n
//
// on success, freezes mean and returns it
const validateMean = (mean, n) => {
    // must be an array
    if (!_.isArray(mean)) {
        throw new Error("Mean must be an array");
    }

    // must be an array of numbers
    if (!_.every(mean, _.isNumber)) {
        throw new Error("Mean must be an array of numbers");
    }

    // must have the correct length
    if (mean.length !== n) {
        throw new Error(`Expected mean to have length ${n}, but had length ${mean.length}`);
    }

    Object.freeze(mean);

    return mean;
};

// validates a covariance matrix that's supposed to be NxN. If successful,
// computes the SVD, freezes cov, and returns {cov, svd: { u, s, v }}
const validateCovAndGetSVD = (cov, n) => {
    // must be an array
    if (!_.isArray(cov)) {
        throw new Error("Covariance must be an array");
    }

    // must have n elements
    if (cov.length !== n) {
        throw new Error(`Covariance matrix had ${cov.length} rows, but it should be a ${n}x${n} square matrix`);
    }

    // validate each row
    cov.forEach((row, idx) => {
        // must be an array
        if (!_.isArray(row)) {
            throw new Error(`Row ${idx} of covariance matrix was not an array`);
        }

        // must have n elements
        if (row.length !== n) {
            throw new Error(`Row ${idx} of covariance matrix had length ${row.length}, but it should have length ${n}`);
        }

        // each element must be a number
        if (!_.every(row, _.isNumber)) {
            throw new Error(`Row ${idx} of covariance matrix contained a non-numeric value`);
        }
    });

    // matrix must be positive semidefinite
    const eigenvalues = Numeric.eig(cov).lambda.x;
    if (_.some(eigenvalues, v => v < 0)) {
        throw new Error("Covariance isn't positive semidefinite");
    }

    // matrix must be symmetric
    if (!Numeric.same(Numeric.transpose(cov), cov)) {
        throw new Error("Covariance isn't symmetric");
    }

    // do decomposition
    // We use the SVD algorithm from Numeric.js because it's efficient and
    // reliable. Sylvester includes an SVD algorithm that doesn't hand some
    // edge cases and is also extremely slow (takes ~500ms to compute and SVD
    // for a 15x15 matrix). Numeric can do a 250x250 matrix in ~500ms.
    //
    // There's also node-svd, which is a wrapper around a C implementation.
    // It's slightly faster than Numeric (it can do a 370x370 matrix in ~500ms),
    // but can't run the browser and doesn't handle some edge cases well.
    const { U: u, S: s, V: v } = Numeric.svd(cov);

    // deep freeze cov and svd
    deepFreeze(cov);
    deepFreeze(u);
    deepFreeze(s);
    deepFreeze(v);

    return {
        cov: cov,
        svd: { u, s, v },
    };
};


export { validateMean, validateCovAndGetSVD };
