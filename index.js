const path = require("path");
const fs = require("fs-extra");
const minifyJs = require("terser").minify;
const minifyHtml = require("html-minifier-terser").minify;
const { replaceAll } = require("./tools/replaceAll");

const __DEV__ = !!process.argv.includes("--dev");
const __WITH_CONSOLE_META__ = !!process.argv.includes("--clg");

function build() {
  const bundle = require("esbuild").buildSync({
    entryPoints: ["src/app.js"],
    bundle: true,
    // minify: true,
    write: false,
    outdir: "./dist",
    // outfile: `./dist/${jsFileName}`,
    target: ["chrome58", "firefox57", "safari11", "edge16"],
  });

  return bundle;
}

(async () => {
  let hash = (Math.random() + 1).toString(36).substring(4);
  const jsFileName = `zashifrovano.${hash}.js`;

  fs.removeSync("./dist");
  fs.mkdirSync("./dist");

  fs.copySync(path.resolve(__dirname, "./public"), "./dist");

  const bundle = build();

  fs.writeFileSync(`./dist/${jsFileName}`, bundle.outputFiles[0].contents, {
    encoding: "utf8",
  });

  if (!__DEV__) {
    var result = await minifyJs(
      fs.readFileSync(`./dist/${jsFileName}`, "utf8"),
      {
        compress: {
          dead_code: true,
          global_defs: {
            DEBUG: false,
          },
        },
      }
    );

    fs.writeFileSync(`./dist/${jsFileName}`, result.code);
  }

  const html = fs.readFileSync("./public/index.html", "utf8");
  let htmlReady = html.replace("%%_SRC_%%", jsFileName);

  let metadataConsole = __WITH_CONSOLE_META__
    ? fs.readFileSync("./tools/metaConsoleTemplate.js", "utf8")
    : "";
  const metadata = require("./public/metadata.json");

  Object.keys(metadata).forEach((key) => {
    const pattern = `%%_META_${key}_%%`;
    const value = metadata[key];
    htmlReady = replaceAll(htmlReady, pattern, value);
    if (__WITH_CONSOLE_META__)
      metadataConsole = replaceAll(metadataConsole, pattern, value);
  });

  htmlReady = htmlReady.replace(
    "%%_METACONSOLE_%%",
    __WITH_CONSOLE_META__ ? `<script>${metadataConsole}</script>` : ""
  );

  if (!__DEV__) {
    const htmlToMinify = htmlReady.replace("%%_LIVE_%%", "");
    htmlReady = await minifyHtml(htmlToMinify, {
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true,
    });

    fs.writeFileSync("./dist/index.html", htmlReady, { encoding: "utf8" });
  }

  if (__DEV__) {
    fs.writeFileSync("./dist/index.html", htmlReady, { encoding: "utf8" });

    const port = 3000;

    require("live-server").start({
      port,
      open: true,
      host: "localhost",
      logLevel: 1,
      watch: ["./src/**/*.js", path.resolve(__dirname, "./dist/index.html")],
      root: path.resolve(__dirname, "./dist"),
      wait: 100,
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
    });
  }
})();
