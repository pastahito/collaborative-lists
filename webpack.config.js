const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {

    entry: './app/src/entry.js',

    output: {
        path: __dirname + '/app/dist',
        publicPath: '/',
        filename: 'js/bundle.js'
    },

    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.jsx?$/,
                loader: 'babel-loader',
                options: {
                    presets: ['react']
                }
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    use: 'css-loader'
                })
            }
        ]
    },

    plugins: [
        new ExtractTextPlugin({
            filename: 'css/bundle.css',
            disable: false,
            allChunks: true
        })
    ]

}
