// You can use this file to build custom version of gridifier.
// Read http://gridifier.io/essentials/install.

module.exports = function(grunt) {
    var banner = "";

    banner += "/* Gridifier v<%= pkg.version %> custom build.\n";
    banner += " * Async Responsive HTML Grids\n";
    banner += " * http://gridifier.io\n";
    banner += " * \n";
    banner += " * Gridifier is dual-licensed:\n";
    banner += " *   GPLV3 per non-commercial usage; \n";
    banner += " *   Commercial license per commercial usage.\n";
    banner += " * Read http://gridifier.io/license for details.\n";
    banner += " * Copyright 2015 nTech\n";
    banner += " */\n\n";

    var api = "src/api/";
    var core = "src/core/";

    var buildSrcFiles = [
        // Loader start
        core + "loader/loaderPrefix.js", // Required

        // Sizes Resolver
        core + "bootstrap/sizesResolver/sizesResolver.js", // Required
        core + "bootstrap/sizesResolver/init.js", // Required
        core + "bootstrap/sizesResolver/outerWidth.js", // Required
        core + "bootstrap/sizesResolver/outerHeight.js", // Required

        // Bootstrap
        core + "bootstrap/event.js", // Required
        core + "bootstrap/prefixer.js", // Required
        core + "bootstrap/dom.js", // Required
        core + "bootstrap/bootstrap.js", // Required

        // Main
        core + "gridifier.js", // Required

        // Core
        core + "core/collector.js", // Required
        core + "core/connectedItemMarker.js", // Required
        core + "core/disconnector.js", // Required
        core + "core/eventEmitter.js", // Required
        core + "core/filtrator.js", // Required
        core + "core/guid.js", // Required
        core + "core/itemClonesManager.js", // Required
        core + "core/iterator.js", // Required
        core + "core/lifecycleCallbacks.js", // Required
        core + "core/normalizer.js", // Required
        core + "core/operation.js", // Required
        core + "core/resorter.js", // Required
        core + "core/responsiveClassesManager.js", // Required
        core + "core/sizesResolverManager.js", // Required

        // Connections core
        core + "connections/connections.js", // Required
        core + "connections/connectionsIntersector.js", // Required

        // Connectors core
        core + "connectors/connectors.js", // Required
        core + "connectors/connectorsIntersector.js", // Required
        core + "connectors/connectorsNormalizer.js", // Required
        core + "connectors/connectorsShifter.js", // Required
        core + "connectors/transformerConnectors.js", // Required

        // Discretizer
        // This classes are required per grid discretization dragifiers.
        // Read http://gridifier.io/dragifiers.
        // If you are using only connection intersection dragifiers, you can comment out next 3 lines.
        core + "discretizer/discretizer.js", // Optional
        core + "discretizer/horizontalCore.js", // Optional
        core + "discretizer/verticalCore.js", // Optional

        // Dragifiers core
        core + "dragifier/dragifier.js", // Required
        core + "dragifier/core.js", // Required
        core + "dragifier/renderer.js", // Required

        // Connection intersection dragifier
        // This class is required per intersection dragifier.
        // Read http://gridifier.io/dragifiers.
        // If you are using only grid discretization dragifier, you can comment out next line.
        core + "dragifier/connectionIntersection/draggableItem.js", // Optional

        // Grid discretization dragifier
        // This classes are required per grid discretization dragifier.
        // Read http://gridifier.io/dragifiers.
        // If you are using only intersection dragifier, you can comment out next 2 lines.
        core + "dragifier/gridDiscretization/cells.js", // Optional
        core + "dragifier/gridDiscretization/draggableItem.js", // Optional

        // Errors
        core + "errors/apiSettings.js", // Required
        core + "errors/collector.js", // Required
        core + "errors/core.js", // Required
        core + "errors/coreSettings.js", // Required
        core + "errors/error.js", // Required

        // Grid
        core + "grid/grid.js", // Required
        core + "grid/gridSizesUpdater.js", // Required

        // Operations
        core + "operations/append.js", // Required
        core + "operations/prepend.js", // Required
        core + "operations/queue.js", // Required

        // Renderer
        core + "renderer/renderer.js", // Required
        core + "renderer/rendererConnections.js", // Required
        core + "renderer/schedulator.js", // Required
        core + "renderer/silentRenderer.js", // Required

        // Settings
        core + "settings/apiSettingsParser.js", // Required
        core + "settings/coreSettingsParser.js", // Required
        core + "settings/settings.js", // Required

        // Sizes Transformer
        core + "sizesTransformer/emptySpaceNormalizer.js", // Required
        core + "sizesTransformer/itemNewPxSizesFinder.js", // Required
        core + "sizesTransformer/itemNewRawSizesFinder.js", // Required
        core + "sizesTransformer/itemsReappender.js", // Required
        core + "sizesTransformer/itemsToReappendFinder.js", // Required
        core + "sizesTransformer/sizesTransformer.js", // Required
        core + "sizesTransformer/transformedConnectionsSorter.js", // Required
        core + "sizesTransformer/transformedItemMarker.js", // Required

        // Transformer operations
        core + "transformerOperations/optionsParser.js", // Required
        core + "transformerOperations/toggle.js", // Required
        core + "transformerOperations/transform.js", // Required

        // Horizontal grid 
        // This classes are required per horizontal grids.
        // Read http://gridifier.io/grid-types.
        // If you are using only vertical grids, you can comment out next 13 lines.
        core + "horizontalGrid/appender.js", // Optional
        core + "horizontalGrid/itemCoordsExtractor.js", // Optional
        core + "horizontalGrid/prepender.js", // Optional
        core + "horizontalGrid/reversedAppender.js", // Optional
        core + "horizontalGrid/reversedPrepender.js", // Optional
        core + "horizontalGrid/connections/connections.js", // Optional
        core + "horizontalGrid/connections/connectionsHorizontalIntersector.js", // Optional
        core + "horizontalGrid/connections/connectionsIntersector.js", // Optional
        core + "horizontalGrid/connections/connectionsRanges.js", // Optional
        core + "horizontalGrid/connections/connectionsSorter.js", // Optional
        core + "horizontalGrid/connectors/connectorsCleaner.js", // Optional
        core + "horizontalGrid/connectors/connectorsSelector.js", // Optional
        core + "horizontalGrid/connectors/connectorsSorter.js", // Optional

        // Vertical grid 
        // This classes are required per vertical grids.
        // Read http://gridifier.io/grid-types.
        // If you are using only horizontal grids, you can comment out next 13 lines.
        core + "verticalGrid/appender.js", // Optional
        core + "verticalGrid/itemCoordsExtractor.js", // Optional
        core + "verticalGrid/prepender.js", // Optional
        core + "verticalGrid/reversedAppender.js", // Optional
        core + "verticalGrid/reversedPrepender.js", // Optional
        core + "verticalGrid/connections/connections.js", // Optional
        core + "verticalGrid/connections/connectionsVerticalIntersector.js", // Optional
        core + "verticalGrid/connections/connectionsIntersector.js", // Optional
        core + "verticalGrid/connections/connectionsRanges.js", // Optional
        core + "verticalGrid/connections/connectionsSorter.js", // Optional
        core + "verticalGrid/connectors/connectorsCleaner.js", // Optional
        core + "verticalGrid/connectors/connectorsSelector.js", // Optional
        core + "verticalGrid/connectors/connectorsSorter.js", // Optional

        // Api
        api + "coordsChanger.js", // Required
        api + "dragifier.js", // Required
        api + "filter.js", // Required
        api + "rotate.js", // Required
        api + "sizesChanger.js", // Required
        api + "slide.js", // Required
        api + "sort.js", // Required
        api + "toggle.js", // Required
        api + "toggleTimeouter.js", // Required

        // Loader end
        core + "loader/loaderPostfix.js" // Required
    ];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                separator: '\r\n\r\n',
            },

            customBuild: {
                src: buildSrcFiles,
                dest: 'build/gridifier-custom.js'
            }
        },

        uglify: {
            customBuild: {
                options: {
                    banner: banner,
                    beautify: true,
                    compress: false
                },
                src: 'build/gridifier-custom.js',
                dest: 'build/gridifier-custom.js'
            },
            customMinBuild: {
                options: {
                    banner: banner,
                    compress: {
                        drop_console: true
                    }
                },
                src: 'build/gridifier-custom.js',
                dest: 'build/gridifier-custom.min.js'
            }
        },

        compress: {
            customBuild: {
                options: {
                    mode: 'gzip'
                },
                files: [{
                    src: ['build/gridifier-custom.min.js'],
                    dest: 'build/gzip/gridifier-custom.min.gz.js'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.registerTask('default', [
        'concat:customBuild', 
        'uglify:customBuild', 
        'uglify:customMinBuild',
        'compress:customBuild'
    ]);
};