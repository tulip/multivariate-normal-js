/* globals describe, it, expect */

import { validateMean, validateCovAndGetSVD } from "multivariate-normal/validation.js";
import { roundMatrix } from "./util";

describe("The validation function", () => {

    describe("for the mean", () => {

        it("should return the valud if it's valid", () => {
            expect(validateMean( [],       0 )).toEqual( [] );
            expect(validateMean( [1],      1 )).toEqual( [1] );
            expect(validateMean( [1, 2.3], 2 )).toEqual( [1, 2.3] );
        });

        it("should freeze its argument", () => {
            expect(Object.isFrozen(validateMean( [],       0 ))).toEqual(true);
            expect(Object.isFrozen(validateMean( [1],      1 ))).toEqual(true);
            expect(Object.isFrozen(validateMean( [1, 2.3], 2 ))).toEqual(true);
        });

        it("should check that it's an array", () => {
            expect(() => validateMean(1, 1))
                .toThrowError(Error, "Mean must be an array");

            expect(() => validateMean(undefined, 0))
                .toThrowError(Error, "Mean must be an array");
        });

        it("should check that it's an array of numbers", () => {
            expect(() => validateMean([1, "foo", 3], 3))
                .toThrowError(Error, "Mean must be an array of numbers");

            expect(() => validateMean(undefined, 0))
                .toThrowError(Error, "Mean must be an array");
        });

        it("should check that it's the right length", () => {
            expect(() => validateMean([], 1))
                .toThrowError(Error, "Expected mean to have length 1, but had length 0");

            expect(() => validateMean([1, 2, 3], 2))
                .toThrowError(Error, "Expected mean to have length 2, but had length 3");
        });

    });

    describe("for the covariance matrix", () => {

        it("should return the covariance matrix", () => {
            const { cov } = validateCovAndGetSVD([
                [ 1, 0 ],
                [ 0, 1 ],
            ], 2);

            expect(cov).toEqual([
                [ 1, 0 ],
                [ 0, 1 ],
            ]);
        });

        it("should deep-freeze the covariance matrix", () => {
            const { cov } = validateCovAndGetSVD([
                [ 1, 0 ],
                [ 0, 1 ],
            ], 2);

            expect(Object.isFrozen(cov)).toEqual(true);
            expect(Object.isFrozen(cov[0])).toEqual(true);
            expect(Object.isFrozen(cov[1])).toEqual(true);
        });

        it("should return the SVD for a simple identity matrix", () => {
            const { svd: { u, s, v } } = validateCovAndGetSVD([
                [ 1, 0 ],
                [ 0, 1 ],
            ], 2);

            expect(roundMatrix(u)).toEqual([
                [ -1,  0 ],
                [  0, -1 ],
            ]);

            expect(roundMatrix(v)).toEqual([
                [ -1,  0 ],
                [  0, -1 ],
            ]);

            expect(roundMatrix(s)).toEqual([
                1,
                1,
            ]);
        });

        it("should return the SVD for a 2x2 matrix", () => {
            const { svd: { u, s, v } } = validateCovAndGetSVD([
                [ 1,   0.9 ],
                [ 0.9, 1   ],
            ], 2);

            expect(roundMatrix(u)).toEqual([
                [ -0.71, -0.71 ],
                [ -0.71,  0.71 ],
            ]);

            expect(roundMatrix(v)).toEqual([
                [ -0.71, -0.71 ],
                [ -0.71,  0.71 ],
            ]);

            expect(roundMatrix(s)).toEqual([
                1.9,
                0.1,
            ]);
        });

        it("should return the SVD for a 3x3 matrix", () => {
            const { svd: { u, s, v } } = validateCovAndGetSVD([
                [ 1,   0, 0.9 ],
                [ 0,   1, 0   ],
                [ 0.9, 0, 1   ],
            ], 3);

            expect(roundMatrix(u)).toEqual([
                [ -0.71, 0, -0.71 ],
                [  0,    1,  0    ],
                [ -0.71, 0,  0.71 ],
            ]);

            expect(roundMatrix(v)).toEqual([
                [ -0.71, 0, -0.71 ],
                [  0,    1,  0    ],
                [ -0.71, 0,  0.71 ],
            ]);

            expect(roundMatrix(s)).toEqual([
                1.9,
                1,
                0.1,
            ]);
        });

        it("should check that it's an array", () => {
            expect(() => validateCovAndGetSVD(1, 1))
                .toThrowError(Error, "Covariance must be an array");

            expect(() => validateCovAndGetSVD(undefined, 0))
                .toThrowError(Error, "Covariance must be an array");
        });

        it("should check that it has the right length", () => {
            expect(() => validateCovAndGetSVD([[1, 2]], 2))
                .toThrowError(Error, "Covariance matrix had 1 rows, but it should be a 2x2 square matrix");
        });

        it("should check that every row is an array", () => {
            expect(() => validateCovAndGetSVD([[1, 2], 2], 2))
                .toThrowError(Error, "Row 1 of covariance matrix was not an array");
        });

        it("should check that every row is the right length", () => {
            expect(() => validateCovAndGetSVD([[1, 2], [2]], 2))
                .toThrowError(Error, "Row 1 of covariance matrix had length 1, but it should have length 2");
        });

        it("should check that every row contains only number", () => {
            expect(() => validateCovAndGetSVD([[1, 2], [2, "x"]], 2))
                .toThrowError(Error, "Row 1 of covariance matrix contained a non-numeric value");
        });

        it("should check that it's positive semidefinite", () => {
            // more correlated with each other than with themselves
            const cov1 = [[1, 1 + 1e-10], [1 + 1e-10, 1]];

            expect(() => validateCovAndGetSVD(cov1, 2))
                .toThrowError(Error, "Covariance isn't positive semidefinite");

            // X and Y are correlated, and Y and Z are correlated, but
            // X and Z aren't correlated
            const cov2 = [
                [1,   0.9, 0.9],
                [0.9, 1,   0],
                [0.9, 0,   1],
            ];

            expect(() => validateCovAndGetSVD(cov2, 3))
                .toThrowError(Error, "Covariance isn't positive semidefinite");
        });

        it("should check that it's symmetric", () => {
            const cov = [
                [1, 0.9],
                [0.8, 1],
            ];

            expect(() => validateCovAndGetSVD(cov, 2))
                .toThrowError(Error, "Covariance isn't symmetric");
        });
    });

});
