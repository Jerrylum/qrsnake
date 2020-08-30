const fs = require('fs');
 
const html_minify = require('html-minifier').minify;
const Terser = require('terser');
const QRCode = require('qrcode');


(async function() {
    console.log('Start build');

    var htmlCode = fs.readFileSync('./src/index.html', 'utf8');
    var jsCode = fs.readFileSync('./src/app.js', 'utf8');

    var jsResult = await Terser.minify(jsCode, {
        mangle: {
            toplevel: true,
            reserved: []
        }
    });

    var htmlResult = html_minify(htmlCode, {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        preventAttributesEscaping: true,
        processConditionalComments: true,
        removeAttributeQuotes: true,
        removeComments: true,
        removeOptionalTags: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyCSS: true,
        // minifyJS: function(code, inline) {
        //     return jsResult.code;
        // }
    }).replace(/<script>[^]*<\/script>/g, `<script>${jsResult.code}</script>`);

    console.log('\nRaw Result:', htmlResult.length, 'chars');
    console.log('------------START------------' + htmlResult + '------------END------------');

    var urlResult = 'data:text/html,' + htmlResult.replace(/\#/g, '%23');

    console.log('\nUrl Result:', urlResult.length, 'chars');
    console.log('------------START------------' + urlResult + '------------END------------');

    QRCode.toFile('./dist/qrcode.png', urlResult, function (error) {
        if (error) console.error(error)
        console.log('\nGenerated QR Code');
    });
})();