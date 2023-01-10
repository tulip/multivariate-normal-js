/* globals describe, it, expect */

import MultivariateNormal from "multivariate-normal";
import Numeric from "numeric";

describe("The MultivariateNormal function", () => {

    it("should return a distribution when given valid values", () => {
        const dist = MultivariateNormal([1, 2], Numeric.identity(2));

        expect(typeof dist.sample).toEqual("function");
    });

    it("should throw an error when given a non-array", () => {
        expect(() => MultivariateNormal(1, Numeric.identity(2)))
            .toThrowError(Error, "mean must be an array");
    });

});
