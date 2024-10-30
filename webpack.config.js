import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'

export default {
    mode: 'development',
    entry: '/public/app.js', // Adjust to your entry file
    output: {
        path: path.resolve('dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react'],
                    },
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html', // Adjust to your HTML template
        }),
    ],
    devServer: {
        static: {
            directory: path.resolve('public'),
        },
        hot: true,
        port: 3000,
        proxy: [
            {
                context: ['/api'], // Matches all routes that start with `/api`
                target: 'http://localhost:3030', // Your Node.js server
                secure: false, // Set to false if you’re working with HTTP
                changeOrigin: true
            }
        ],
    },
}
