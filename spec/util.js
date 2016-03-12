import _ from "lodash";
import Numeric from "numeric";

// given an aribrarily nested array, rounds each value to 2 decimal places
export const roundMatrix = (matrix, precision=2) => {
    if (_.isArray(matrix)) {
        return matrix.map(el => roundMatrix(el, precision));
    }
    else {
        const rounded = _.round(matrix, precision);

        if (rounded === 0) {
            // rounded could be either 0 or -0. Jasmine doesn't consider
            // those two to be the same (because it uses _.isEqual), but
            // they are ===.
            return 0;
        }
        else {
            return rounded;
        }
    }
};

// Algorithm for estimating the covariance matrix from a matrix of data.
// Based on http://stats.seandolinar.com/making-a-covariance-matrix-in-r/
export const cov = (dataMatrix) => {
    const rows = dataMatrix.length;
    const cols = dataMatrix[0].length;

    // compute means
    const means = _.range(cols).map(col => _.mean(_.map(dataMatrix, col)));

    // create a matrix of means of the same dimensions as the data matrix
    const matrixOfMeans = _.times(rows, _.constant(means));

    // compute the difference matrix
    const differenceMatrix = Numeric.sub(dataMatrix, matrixOfMeans);

    // C = 1/(n-1) * (D^T * D)
    return Numeric.mul(
        1/(rows-1),
        Numeric.dot(
            Numeric.transpose(differenceMatrix),
            differenceMatrix
        )
    );
};

// Generate a random, valid covariance matrix
export const randomCovarianceMatrix = (size) => {
    // we randomly generate symmetrical matrices with 1s on the diagonal
    // until we find one that's positive semidefinite

    /* eslint no-constant-condition: 0 */
    while (true) {
        // create a random upper-triangular matrix
        const upperTriangular = _.times(size, row => {
            return _.times(size, col => {
                if (col > row) {
                    return Math.random() * 2 - 1;
                }
                else {
                    return 0;
                }
            });
        });

        // add the transpose to make it symmetric, and give it 1s in the diagonal
        const lowerTriangular = Numeric.transpose(upperTriangular);
        const diag = Numeric.diag(_.times(size, _.constant(1)));

        const matrix = Numeric.add(upperTriangular, lowerTriangular, diag);

        // check that it's positive semidefinite
        const eigenvalues = Numeric.eig(matrix).lambda.x;
        if (_.every(eigenvalues, v => v > 0)) {
            return matrix;
        }
    }
};

// validates that a given array is an array of numbers with the specified
// length
export const shouldBeVector = (maybeVector, length) => {
    if (!_.isArray(maybeVector)) {
        throw new Error("vector must be an array");
    }

    if (!_.every(maybeVector, _.isNumber)) {
        throw new Error("vector must be an array of numbers");
    }

    if (maybeVector.length !== length) {
        throw new Error(`Expected vector to have length ${length}, but it had length ${maybeVector.length}`);
    }
};

// validates that two matrices are pairwise equal to withing a given delta
// (default 0.05)
export const matricesShouldBeApproxEqual = (a, b, maxDiff=0.05) => {
    a.forEach((aRow, rowIdx) => {
        aRow.forEach((aVal, colIdx) => {
            const bVal = b[rowIdx][colIdx];

            if (Math.abs(aVal - bVal) > maxDiff) {
                throw new Error(`Expected ${JSON.stringify(a)} to approximately equal ${JSON.stringify(b)}, but there was a difference at [${rowIdx},${colIdx}]`);
            }
        });
    });
};

