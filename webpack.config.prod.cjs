module.exports = {
    mode: 'production',
    output: {
        filename: 'gridviz-eurostat.min.js',
        library: 'gviz_es',
        libraryTarget: 'umd',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        babelrc: false,
                        cacheDirectory: true,
                        sourceMaps: false,
                    },
                },
            },
        ],
    },
    devtool: false,
    watch: false,
    optimization: {
        usedExports: true,
        minimize: true,
    },

    experiments: {
        asyncWebAssembly: true,
        //syncWebAssembly: true
    },
}
