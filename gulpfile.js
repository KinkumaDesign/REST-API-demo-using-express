var gulp = require('gulp');
var webpack = require('webpack');
var del = require('del');

function buildJS(mode, callback){

    //export settings =========
    var settings = {
        context: __dirname + '/public/src',
        entry:'./js/Main.js',
        output: {
            path: 'public/js',
            filename: 'main.js'
        },
        plugins:[]
    };
    //==============

    settings.module = {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    };

    if(mode == "debug"){
        settings.devtool = 'source-map';
    }else if(mode == "release"){
        settings.plugins.push(
            new webpack.DefinePlugin({
                "process.env": { NODE_ENV: JSON.stringify("production") }
            }),
            new webpack.optimize.UglifyJsPlugin({
                compress: { warnings: false }
            })
        );
    }

    webpack(settings, function(err, stats){
        if(err){
            console.error('webpack fatal error', err);
            return;
        }
        var jsonStats = stats.toJson();
        if(jsonStats.errors.length > 0){
            console.error('bundle error');
            jsonStats.errors[0].split('\n').map(function(errLine){
                console.error(errLine);
            });
            return;
        }
        if(jsonStats.warnings.length > 0){
            console.log('bundle warning', jsonStats.warnings);
        }
        console.log('bundle complete');
        if(callback){
            callback();
        }
    })
}

/**
 * debug mode
 * without compress js. React development mode. with sourcemap
 */
gulp.task('bundle_debug', function(){
    buildJS("debug");
});

/**
 * release mode
 * compress js. React production mode. delete sourcemap
 */
gulp.task('bundle_release', function(){
    buildJS("release", function(){
        del('./public/js/*.map');
    });
});
