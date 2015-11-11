var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var compress = require('gulp-compress');
var gzip = require('gulp-gzip');
var rename = require('gulp-rename');

var banner = "";

banner += "/* Gridifier v<%= pkg.version %> custom build.\n";
banner += " * Async Responsive HTML Grids\n";
banner += " * http://gridifier.io\n";
banner += " * \n";
banner += " * Gridifier is dual-licensed:\n";
banner += " *   Non-commercial license - https://creativecommons.org/licenses/by-nc-sa/4.0/ \n";
banner += " *   Commercial license - http://gridifier.io/license (Commercial license)\n";
banner += " * Read http://gridifier.io/license for details.\n";
banner += " * Copyright " + (new Date()).getFullYear() + " nTech\n";
banner += " */\n\n";

var api = "src/api/";
var core = "src/core/";

// Optional classes
var selectable = [
    // Required for renderer antialiasing. (Read http://gridifier.io/api/renderers)
    // If you are not using 'width(Px|Pt)As || height(Px|Pt)As', you can comment out next line
    core + "core/antialiaser.js",

    // Required for horizontal grids. (Read http://gridifier.io/grids/grid-types)
    // If you are using only vertical grids, you can comment out next 6 lines.
    core + "grid/horizontal/appender.js",
    core + "grid/horizontal/connections.js",
    core + "grid/horizontal/coordsFinder.js",
    core + "grid/horizontal/prepender.js",
    core + "grid/horizontal/reversedAppender.js",
    core + "grid/horizontal/reversedPrepender.js",

    // Required for vertical grids. (Read http://gridifier.io/grids/grid-types)
    // If you are using only horizontal grids, you can comment out next 6 lines.
    core + "grid/vertical/appender.js",
    core + "grid/vertical/connections.js",
    core + "grid/vertical/coordsFinder.js",
    core + "grid/vertical/prepender.js",
    core + "grid/vertical/reversedAppender.js",
    core + "grid/vertical/reversedPrepender.js",

    // Required for render after silentAppend inserts. 
    // (Read http://gridifier.io/grids/insert-types)
    // If you are not using 'silentAppend/silentRender' fns, you can comment out next line.
    core + "renderer/silent.js",

    // Required for images loading.
    // (Insert operations will wait while all item images are loaded)
    // (Read http://gridifier.io/grids/insert-types)
    // If you aren't using 'loadImages: true' setting, you can comment out next 2 lines.
    core + "images/image.js",
    core + "images/loader.js",

    // Required for dragifiers.
    // (Read http://gridifier.io/dragifiers)
    // If you are not using dragifiers, you can comment out next 3 lines.
    core + "dragifier/core.js",
    core + "dragifier/dragifier.js",
    api + "dragifier/dragifier.js",

    // Required for intersection dragifiers.
    // (Read http://gridifier.io/dragifiers)
    // If you are using only discretization dragifiers or not
    // using dragifiers, you can comment out next line.
    core + "dragifier/intersection/item.js",

    // Required for discretization dragifiers.
    // (Read http://gridifier.io/dragifiers)
    // If you are using only intersection dragifiers or not
    // using dragifiers, you can comment out next 4 lines.
    core + "discretizer/core.js",
    core + "discretizer/discretizer.js",
    core + "dragifier/discretization/cells.js",
    core + "dragifier/discretization/item.js",

    // Required for coords changer drivers.
    // (Read http://gridifier.io/api/renderers)
    // If you are not using position/translate coords changers, 
    // you can comment out next 2 lines.
    api + "coordsChanger/position.js",
    api + "coordsChanger/translate.js",

    // Required for using built-in rsort functions.
    // (Read http://gridifier.io/sortings/retransform-sorts)
    // If you are not using areaEvenly, area(Asc|Desc) and other fns, 
    // you can comment out next line.
    api + "sort/rsortHelpers.js",

    // Required for using sort helper object functions.
    // (Passed as 3-rd param in all sort fn-s by default)
    // (Read http://gridifier.io/sortings/sorts)
    // If you are not using sort helper object, you can comment out next line.
    api + "sort/sortHelpers.js",

    // Required for using rotate toggler fns. (Read http://gridifier.io/api/togglers)
    // If you are not using them, you can comment out next 2 lines.
    api + "toggle/factory/rotate.js",
    api + "toggle/rotate.js",

    // Required for using scale toggler fns. (Read http://gridifier.io/api/togglers)
    // If you are not using them, you can comment out next 2 lines.
    api + "toggle/factory/scale.js",
    api + "toggle/scale.js",

    // Required for using slide toggler fns. (Read http://gridifier.io/api/togglers)
    // If you are not using them, you can comment out next 2 lines.
    api + "toggle/factory/slide.js",
    api + "toggle/slide.js",

    // Required for fade toggler.
    api + "toggle/fade.js"
];

// Required classes
var required = [
    // Loader start
    core + "loader/loaderPrefix.js",

    // Bootstrap start
    core + "bootstrap/funcs.js",
    core + "bootstrap/mocks.js",
    core + "bootstrap/vars.js",

    // Sizes Resolver
    core + "bootstrap/sizesResolver/sizesResolver.js",
    core + "bootstrap/sizesResolver/init.js",
    core + "bootstrap/sizesResolver/outerWidth.js",
    core + "bootstrap/sizesResolver/outerHeight.js",

    // Bootstrap end
    core + "bootstrap/event.js",
    core + "bootstrap/prefixer.js",
    core + "bootstrap/dom.js",

    // Connections
    core + "core/connections/connections.js",
    core + "core/connections/intersector.js",
    core + "core/connections/ranges.js",
    core + "core/connections/sorter.js",
    core + "core/connections/xyIntersector.js",

    // Connectors
    core + "core/connectors/cleaner.js",
    core + "core/connectors/connectors.js",
    core + "core/connectors/intersector.js",
    core + "core/connectors/reposition.js",
    core + "core/connectors/rounder.js",
    core + "core/connectors/selector.js",
    core + "core/connectors/shifter.js",
    core + "core/connectors/sorter.js",

    // Item
    core + "core/item/collector.js",
    core + "core/item/guid.js",
    core + "core/item/item.js",

    // Managers
    core + "core/manager/cssManager.js",
    core + "core/manager/srManager.js",

    // Operations
    core + "core/operation/disconnector.js",
    core + "core/operation/filtrator.js",
    core + "core/operation/resorter.js",

    // Core
    core + "core/core.js",
    core + "core/eventEmitter.js",
    core + "core/iterator.js",
    core + "core/operation.js",
    core + "core/position.js",
    core + "core/rounder.js",

    // Grid
    core + "grid/grid.js",

    // Insert
    core + "inserter/append.js",
    core + "inserter/insert.js",
    core + "inserter/prepend.js",
    core + "inserter/queue.js",

    // Renderer
    core + "renderer/connections.js",
    core + "renderer/queue.js",
    core + "renderer/renderer.js",

    // Reposition
    core + "reposition/data.js",
    core + "reposition/queue.js",
    core + "reposition/reposition.js",

    // Coords changer
    api + "coordsChanger/coordsChanger.js",
    api + "coordsChanger/default.js",

    // Settings
    api + "settings/settings.js",
    api + "settings/funcs.js",

    // Rsort
    api + "sort/rsort.js",

    // Toggle
    api + "toggle/toggle.js",
    api + "toggle/syncer.js",
    api + "toggle/visibility.js"
];

var loader = [
    // Objects builder
    core + "gridifier.js",

    // Loader end
    core + "loader/loaderPostfix.js"
];

var buildSrcFiles = [];
for(var i = 0; i < required.length; i++)
    buildSrcFiles.push(required[i]);
for(var i = 0; i < selectable.length; i++)
    buildSrcFiles.push(selectable[i]);
for(var i = 0; i < loader.length; i++)
    buildSrcFiles.push(loader[i]);

gulp.task('concat', function () {
    return gulp
        .src(buildSrcFiles, {base: 'src/'})
        .pipe(concat('gridifier-custom.js'))
        .pipe(gulp.dest('dist'))
    ;
});

var preserves = 0;
gulp.task('compress', ['concat'], function () {
    return gulp
        .src('dist/gridifier-custom.js')
        .pipe(uglify({
            preserveComments: function(node, comment) {
                if(preserves == 1) return false;
                if(/(.*)comment(.*)/i.test(comment.type)) {
                    if(/Gridifier/i.test(comment.value)) {
                        preserves++;
                        return true;
                    }
                    else
                        return false;
                }
            },
            output: {beautify: true}
        }))
        .pipe(gulp.dest('dist'))
    ;
});

var minPreserves = 0;
gulp.task('compress-min', ['concat', 'compress'], function () {
    return gulp
        .src('dist/gridifier-custom.js')
        .pipe(uglify({
            preserveComments: function(node, comment) {
                if(minPreserves == 1) return false;
                if(/(.*)comment(.*)/i.test(comment.type)) {
                    if(/Gridifier/i.test(comment.value)) {
                        minPreserves++;
                        return true;
                    }
                    else 
                        return false;
                }
            }
        }))
        .pipe(rename('gridifier-custom.min.js'))
        .pipe(gulp.dest('dist'))
  ;
});

gulp.task('zip', ['concat', 'compress', 'compress-min'], function() {
    gulp.src('dist/gridifier-custom.min.js')
    .pipe(gzip())
    .pipe(rename('gridifier-custom.min.js.gz'))
    .pipe(gulp.dest('dist/gzip'))
    ;
});

gulp.task('default', ["concat", "compress", "compress-min", "zip"]);

