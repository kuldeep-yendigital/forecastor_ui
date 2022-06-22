const gulp = require('gulp');
const webdriver = require('gulp-webdriver');
const path = require('path');

module.exports = function (conf) {

    const isWin = /^win/.test(process.platform);
    const cmd = isWin ? 'wdio.cmd' : 'wdio';
    const fullConfPath = path.resolve(process.cwd(), conf).replace('.js', '');
    const config = require(fullConfPath).config;

    const returnPipe = gulp.src(conf)
        .pipe(webdriver({
            wdioBin: path.join(__dirname, 'node_modules', '.bin', cmd)
        }));

    return returnPipe;
};
