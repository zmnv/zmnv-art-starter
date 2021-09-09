var minifyJs = require("terser").minify;
var minifyHtml = require('html-minifier-terser').minify;

const fs = require('fs-extra');

(async () => {
    let hash = (Math.random() + 1).toString(36).substring(4);
    const jsFileName = `zashi.${hash}.js`;

    fs.removeSync('./dist');

    await require('esbuild').build({
        entryPoints: ['src/app.js'],
        bundle: true,
        // minify: true,
        outfile: `dist/${jsFileName}`,
        target: ['chrome58','firefox57','safari11','edge16']
    }).catch(() => process.exit(1))

    var result = await minifyJs(fs.readFileSync(`./dist/${jsFileName}`, "utf8"), {
        compress: {
            dead_code: true,
            global_defs: {
                DEBUG: false
            }
        }
    });

    fs.writeFileSync(`dist/${jsFileName}`, result.code);


    const html = fs.readFileSync("public/index.html", "utf8");
    const after = html.replace('%%_SRC_%%', jsFileName);

    var resultHtml = await minifyHtml(after, {
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
    });

    fs.writeFileSync("./dist/index.html", resultHtml);

    fs.copy('./public', './dist', function (err) {
        if (err) {
          console.error(err);
        } else {
          console.log("success!");
        }
      });

})();

