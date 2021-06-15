const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require ('terser-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = {
    //Punto de entrada de la aplicación
    entry:'./src/index.js',
    // Punto de salida donde se va a compilar
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'[name].[contenthash].js', //Nombre del archivo final
        assetModuleFilename:'assets/images/[hash][ext][query]'
    },
    resolve:{
        extensions:['.js'], // extenciones que puede leer
        alias:{
            '@utils': path.resolve(__dirname,'src/utils/'),
            '@templates': path.resolve(__dirname,'src/templates/'),
            '@styles': path.resolve(__dirname,'src/styles/'),
            '@images': path.resolve(__dirname,'src/assets/images/'),
        }
    },
    mode:"production",
    module:{
        rules:[
            {
                test:/\.m?js$/, // utiliza cualquier extención m.js o js
                exclude:/node_modules/,
                use:{
                    loader:'babel-loader'
                }
            },
            {
                test:/\.css|.styl$/i,
                use:[MiniCssExtractPlugin.loader,
                'css-loader',
                'stylus-loader'
                ]
            },
            {
                test:/\.png/,
                type:'asset/resource',
            },
            {
                test:/\.(woff|woff2)$/,
                use:{
                    loader:'url-loader',
                    options:{
                        limit:10000,
                        minitype:"application/font-woff",
                        name:"[name].[contenthash].[ext]",
                        outputPath:"./assets/fonts",
                        publicPath:"../assets/fonts",
                        esModule:false,
                    }
                }
            }
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            inject:true,
            template:'./public/index.html',
            filename:'./index.html'
        }),
        new MiniCssExtractPlugin({
            filename:'assets/[name].[contenthash].css'
        }),
        new CopyPlugin({
            patterns:[
                {
                    from:path.resolve(__dirname,"src","assets/images"),
                    to:"assets/images",
                }
            ]
        }),
        new Dotenv(),
        new CleanWebpackPlugin()
    ],
    optimization:{
        minimize:true,
        minimizer:[
            new CssMinimizerPlugin(),
            new TerserPlugin()

        ]
    }
}