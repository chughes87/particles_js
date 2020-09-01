const path = require("path");
const NodemonPlugin = require('nodemon-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve('./dist'),
        filename: 'main.js',
    },
    plugins: [
        new NodemonPlugin(),
    ],
};