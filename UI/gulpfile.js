var gulp = require("gulp");

//Required for SASS Compilation
var sass = require("gulp-sass");

//Required for Typescript Compilation and Obfuscation
var tsc = require("gulp-typescript");
var sourcemaps = require("gulp-sourcemaps");
var systemJsBuilder = require("systemjs-builder");


var paths = {
    styles: {
        source: "./Content/scss",
        files: [
            "./Content/scss/bootstrap.scss",
            "./Content/scss/bootstrap-grid.scss",
            "./Content/scss/bootstrap-reboot.scss"
        ],
        destination: "./wwwroot/stylesheets"
    },
    ts: {
        application: {
            source: "./Content/application",
            files: [
                "./Content/application/**/*.ts"
            ],
            destination: "./wwwroot/dist"
        }
    }
}

var displayError = function (error) {
    // Initial building up of the error
    var errorString = `[${error.plugin}]`;
    errorString += ` ${error.message.replace("\n", "")}`; // Removes new line at the end
    // If the error contains the filename or line number add it to the string
    if (error.fileName)
        errorString += ` in ${error.fileName}`;
    if (error.lineNumber)
        errorString += ` on line ${error.lineNumber}`;
    // This will output an error like the following:
    // [gulp-sass] error message in file_name on line 1
    console.error(errorString);
}

gulp.task("sass-components", function () {

    const outputStyle = process.env.NODE_ENV === "production" ? "compressed" : "";

    gulp.src(paths.styles.files[0])
        .pipe(sass({
            outputStyle: outputStyle,
            sourceComments: "map",
            includePaths: [paths.styles.src]
        }).on("error", sass.logError))
        .on("error", function (err) {
            displayError(err);
        })
        .pipe(gulp.dest(paths.styles.destination));
});

gulp.task("set-dev-node-env", function () {
    return process.env.NODE_ENV = "development";
});

gulp.task("set-prod-node-env", function () {
    return process.env.NODE_ENV = "production";
});

//TODO Point to core-js types perhaps so that it knows how to compile without barfing in the Task Runner Explorer
gulp.task("tsc", function () {
    return gulp.src(paths.ts.application.files, { base: "./Content/application" })
        .pipe(sourcemaps.init())
        .pipe(tsc({
            "target": "es5",
            "module": "commonjs",
            "moduleResolution": "node",
            "sourceMap": true,
            "emitDecoratorMetadata": true,
            "experimentalDecorators": true,
            "removeComments": false,
            "noImplicitAny": false,
            "suppressImplicitAnyIndexErrors": true
        }))
        .pipe(sourcemaps.write({ sourceRoot: "./Content/application" }))
        .pipe(gulp.dest(paths.ts.application.destination));
});

gulp.task("dist-config", function () {
    return gulp.src("./Content/configs/system.config.js")
        .pipe(gulp.dest("./wwwroot/dist/configs"));
});

gulp.task("dist", ["dist-config", "tsc"], function() {});

gulp.task("bundle-application", ["dist"], function () {
    const builder = new systemJsBuilder("", "./Content/configs/system.config.js");
    return builder
        .bundle("[./wwwroot/dist/**/*]",
            "./wwwroot/public/application.bundle.min.js",
            {
                minify: true,
                mangle: true,
                sourceMaps: true
            })
        .then(function () {
            console.log("Build Complete");
        })
        .catch(function (err) {
            displayError(err);
        });
});

gulp.task("bundle-dependencies", ["dist"], function () {

    const builder = new systemJsBuilder("", "./Content/configs/system.config.js");
    return builder
        .bundle("dist/**/* - [dist/**/*.js]", "./wwwroot/public/dependencies.bundle.min.js", {
            minify: true,
            mangle: true,
            sourceMaps: true

        })
        .then(function () {
            console.log("Build complete");
        })
        .catch(function (err) {
            console.log("Build error");
            displayError(err);
        });
});

gulp.task("build", ["bundle-application", "bundle-dependencies"], function() {});