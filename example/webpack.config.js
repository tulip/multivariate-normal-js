module.exports = {
    entry: "./js/main.js",
    output: {
        path: __dirname,
        filename: "bundle.js",
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components|vendor)/,
                loader: "babel",
                query: {
                    presets: ["es2015"],
                },
            },
            {
                test: /\.json$/,
                loader: "json",
            },
        ],
    },
    devtool: "source-map",
};
