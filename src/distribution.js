import { validateMean, validateCovAndGetSVD } from "./validation.js";
import gaussian from "gaussian";
import Numeric from "numeric";

// Low-level distribution constructor. NOT a public API.
//
// n: dimensionality of the distribtion
// mean: vector of mean, of length n.
// cov: covarance matrix, of size n-by-n.
// svd: { u, s, v } from decomposition of cov
//
// preconditions:
//   - mean and cov have been validated
//   - mean and cov are frozen

const standardNormalDist = gaussian(0, 1);

const standardNormalVector = (length) => {
    const ary = [];

    for (let i = 0; i < length; i++) {
        ary.push(standardNormalDist.ppf(Math.random()));
    }

    return ary;
};

const Distribution = (n, mean, cov, { u, s, v }) => {
    return {
        sample() {
            // From numpy (paraphrased):
            //   x = standard_normal(n)
            //   x = np.dot(x, np.sqrt(s)[:, None] * v)
            //   x += mean
            //
            // https://github.com/numpy/numpy/blob/a835270d718d299535606d7104fd86d9b2aa68a6/numpy/random/mtrand/mtrand.pyx

            // np.sqrt(s)[:, None] * v
            //
            // This is an elegant way in numpy to multiply each column of
            // v by sqrt(s). Unfortunately, we don't have numpy, so we do this
            // manually
            const sqrtS = s.map(Math.sqrt);
            const scaledV = v.map(row => {
                return row.map((val, colIdx) => {
                    return val * sqrtS[colIdx];
                });
            });

            // We populate a row vector with a standard normal distribution
            // (mean 0, variance 1), and then multiply it with scaledV
            const standardNormal = standardNormalVector(n);

            // compute the correlated dsitribution based on the covariance
            // matrix
            const variants = Numeric.dot(standardNormal, Numeric.transpose(scaledV));

            // add the mean
            return variants.map((variant, idx) => variant + mean[idx]);
        },

        getMean() {
            return mean;
        },

        setMean(unvalidatedMean) {
            const newMean = validateMean(unvalidatedMean, n);
            return Distribution(n, newMean, cov, { u, s, v });
        },

        getCov() {
            return cov;
        },

        setCov(unvalidatedCov) {
            const { cov: newCov, svd: newSVD } = validateCovAndGetSVD(unvalidatedCov, n);
            return Distribution(n, mean, newCov, newSVD);
        },
    };
};

export default Distribution;
