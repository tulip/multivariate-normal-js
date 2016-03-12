import _ from "lodash";
import MultivariateNormal from "multivariate-normal";

export const generateData = (params) => {
    const dist = MultivariateNormal(params.means, params.cov);
    return _.times(params.points, dist.sample);
};
