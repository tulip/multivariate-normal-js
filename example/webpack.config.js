module.exports = {
    entry: "./js/main.js",
    output: {
        path: __dirname,
        filename: "bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components|vendor)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/env"],
                    },
                },
            },
            {
                test: /\.json$/,
                use: {
                    loader: "json",
                },
            },
        ],
    },
    devtool: "source-map",
};
