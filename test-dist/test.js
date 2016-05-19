var MultivariateNormal = require("../dist/multivariate-normal.js").default;

// means of our three dimensions
var meanVector = [1, 2, 3];

// covariance between dimensions. This examples makes the first and third
// dimensions highly correlated, and the second dimension independent.
var covarianceMatrix = [
    [ 1.0, 0.0, 0.9 ],
    [ 0.0, 1.0, 0.0 ],
    [ 0.9, 0.0, 1.0 ],
];

var distribution = MultivariateNormal(meanVector, covarianceMatrix);
console.log(distribution.sample()); // => [1.2, 1.8, 3.3]

var newDistribution = distribution.setMean([3, 2, 1]);
console.log(newDistribution.sample()); // => [2.8, 2.1, 0.7]

// distributions are immutable
console.log(distribution.getMean()); // => [1, 2, 3];
console.log(newDistribution.getMean()); // => [3, 2, 1];
