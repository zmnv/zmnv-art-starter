var minifyJs = require("terser").minify;
var minifyHtml = require('html-minifier-terser').minify;

const path = require("path");
const fs = require('fs-extra');
const fsOrig = require('fs');

const __DEV__ = !!process.argv.includes("--dev");

console.log('__dirname', __dirname);

function build() {
    const bundle = require('esbuild').buildSync({
        entryPoints: ['src/app.js'],
        bundle: true,
        // minify: true,
        write: false,
        outdir: './dist',
        // outfile: `./dist/${jsFileName}`,
        target: ['chrome58', 'firefox57', 'safari11', 'edge16']
    });

    return bundle;
}

(async () => {
    let hash = (Math.random() + 1).toString(36).substring(4);
    const jsFileName = `zashi.${hash}.js`;

    fs.removeSync('./dist');
    fs.mkdirSync('./dist');
    fs.copySync('./public', './dist', function (err) {
        if (err) {
            console.error(err);
        } else {
            console.log("success!");
        }
    });

    const bundle = build();

    fs.writeFileSync(`./dist/${jsFileName}`, bundle.outputFiles[0].contents, {encoding: 'utf8'});

    if (!__DEV__) {
        var result = await minifyJs(fs.readFileSync(`./dist/${jsFileName}`, "utf8"), {
            compress: {
                dead_code: true,
                global_defs: {
                    DEBUG: false
                }
            }
        });

        fs.writeFileSync(`./dist/${jsFileName}`, result.code);
    }


    const html = fs.readFileSync("./public/index.html", "utf8");
    const after = html.replace('%%_SRC_%%', jsFileName);

    if (!__DEV__) {
        const htmlToMinify = after.replace('%%_LIVE_%%', '');
        var resultHtml = await minifyHtml(htmlToMinify, {
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
        });

        fs.writeFileSync("./dist/index.html", resultHtml, {encoding: 'utf8'});
    }

    if (__DEV__) {
        fs.writeFileSync("./dist/index.html", after, {encoding: 'utf8'});

        const port = 3000;

        require("live-server").start({
            port,
            open: true,
            host: "localhost",
            logLevel: 1, // or 1 for more logs
            watch: [
                './src/**/*.js',
              path.resolve(__dirname, "./dist/index.html"),
            ],
            root: path.resolve(__dirname, "./dist"),
            wait: 100,
            // ignore: path.resolve(__dirname, "../www/*.js"),
            middleware: [
              async (req, res, next) => {
                if (req.url === `/${jsFileName}`) {
                  const src = build().outputFiles[0].text;
                  res.setHeader("Content-Type", "text/javascript");
                  res.end(src);
                } else {
                  next(null);
                }
              },
            ],
          })
    }

})();

