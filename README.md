multivariate-normal-js
=====================

A pure-javascript port of NumPy's `random.multivariate_normal`, for Node.js and the browser.

Check out the [live demo](http://tulip.github.io/multivariate-normal-js)!

From the NumPy docs:

Draw random samples from a multivariate normal distribution.

The multivariate normal, multinormal or Gaussian distribution is a generalization of the one-dimensional normal distribution to higher dimensions. Such a distribution is specified by its mean and covariance matrix. These parameters are analogous to the mean (average or "center") and variance (standard deviation, or "width," squared) of the one-dimensional normal distribution.

See [the NumPy documentation](http://docs.scipy.org/doc/numpy-1.10.0/reference/generated/numpy.random.multivariate_normal.html) additional notes, examples, and references.


Example
====================

To start, just `npm install multivariate-normal`. You can also get one of the
pre-built files from the `dist` folder.

Then you can do:

```javascript
    import MultivariateNormal from "multivariate-normal";
    // or without ES6 import: var MultivariateNormal = require("multivariate-normal").default;
    // or without a CommonJS runtime: <script src="path/to/multivariate-normal.min.js"></script>, and then use the global window.MultivariateNormal.default

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
    distribution.sample(); // => [1.2, 1.8, 3.3]

    var newDistribution = distribution.setMean([3, 2, 1]);
    newDistribution.sample(); // => [2.8, 2.1, 0.7]

    // distributions are immutable
    distribution.getMean(); // => [1, 2, 3];
    newDistribution.getMean(); // => [3, 2, 1];

```

API
====================

##### `MultivariateNormal(mean, covarianceMatrix) -> Distribution`

Arguments:

- `mean` *1-D Array, of length N*: Mean of the N-dimensional distribution.
- `cov` *2-D Array, of shape (N, N)*: Covariance matrix of the distribution. It must be symmetric and positive-semidefinite for proper sampling.

Returns:

- A Distribution object with methods described below. Distributions
are immutable -- the `set` methods return new distributions.


##### `distribution.sample() -> Array`

Draw a random sample from the distribution.

Returns:

- *1-D Array, of length N*: The random sample from the distribution.


##### `distribution.getMean(newMean) -> Array`

Returns the mean of this distribution. The array will be [frozen](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze).

Returns:

- *1-D Array, of length N*: Mean of the distribution.


##### `distribution.setMean(newMean) -> Distribution`

Returns a new Distribution with the same covariance matrix as the current distribution, but a new mean.

Arguments:

- `newMean` *1-D Array, of length N*: Mean of the new distribution.

Returns:

- A new Distribution object.


##### `distribution.getCov(newMean) -> Array`

Returns the covariance of this distribution. The array will be [frozen](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze).

Returns:

- *2-D Array, of shape (N, N)*: Covariance matrix of the distribution.


##### `distribution.setCov(newMean) -> Distribution`

Returns a new Distribution with the same mean as the current distribution, but a new covariance matrix.

Arguments:

- `newMean` *2-D Array, of shape (N, N)*: Covariance matrix of the distribution. It must be symmetric and positive-semidefinite for proper sampling.

Returns:

- A new Distribution object.

Get Involved
====================

If you've found a bug or have a feature request, [file an issue on Github](https://github.com/tulip/multivariate-normal-js/issues).

To get started developing:

1. Clone this repo.
2. `npm install`

Then, you can run the tests with `npm test`, or run the example app with
`npm start` and then navigating to http://localhost:8080.

Contributing
====================

How to submit changes:

1. Fork this repository.
2. Make your changes, including adding or changing appropriate tests.
3. Verify unit tests and linting passes with `npm test`
4. Play around with the example app. Make sure the correlations look correct.
5. Email us as opensource@tulip.co to sign a CLA.
6. Submit a pull request.

Coding Conventions
--------------------

* [Stroustrup Indentation Style](https://en.wikipedia.org/wiki/Indent_style#Variant:_Stroustrup)
* Four spaces, no tabs
* Trailing newline in all files
* Everything in our [eslintrc](.eslintrc.yml)

License
====================

multivariate-normal-js is licensed under the [Apache Public License](LICENSE).


Who's Behind It
====================

Multivariate Normal is maintained by Tulip. We're an MIT startup located in Boston, helping enterprises manage, understand, and improve their manufacturing operations. We bring our customers modern web-native user experiences to the challenging world of manufacturing, currently dominated by ancient enterprise IT technology. We work on Meteor web apps, embedded software, computer vision, and anything else we can use to introduce digital transformation to the world of manufacturing. If these sound like interesting problems to you, [we should talk](mailto:jobs@tulip.co).

