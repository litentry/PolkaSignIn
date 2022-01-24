module.exports = {
    configureWebpack: (config) => {
        config.module.rules.push({
            test: /\.js$/,
            use: [
                {
                    loader: require.resolve('@open-wc/webpack-import-meta-loader')
                }
            ]
        })
    }
}