/* Gridifier v2.~.~ source file for custom build.
 * Async Responsive HTML Grids
 * http://gridifier.io
 * 
 * Gridifier is dual-licensed:
 *   Non-commercial license - https://creativecommons.org/licenses/by-nc-sa/4.0/.
 *   Commercial license - http://gridifier.io/license (Commercial license).
 * Read http://gridifier.io/license for details.
 * Copyright 2015 nTech
 */

var Settings = function() {
    // You can replace default settings
    // or extend API settings here and then
    // build custom version of Gridifier.
    // Read more about custom builds at http://gridifier.io/essentials/install
    // Read more about settigns at http://gridifier.io/essentials/settings
    this._settings = {
        grid: "vertical", // "vertical" | "horizontal"
        prepend: "mirrored", // "mirrored" | "default" | "reversed"
        append: "default", // "default" | "reversed"
        intersections: true, // bool
        align: "top", // "top" | "center" | "bottom" | "left" | "right"
        sortDispersion: false, // bool
        "class": "grid-item", // false | string
        data: false, // false | string
        query: false, // false | string
        loadImages: false, // bool

        dragifier: false, // bool | string
        dragifierMode: "i", // "i" | "d"

        gridResize: "fit", // "fit" | "expand" | "disabled"
        gridResizeDelay: 100, // int

        toggleTime: 500, // int
        toggleTiming: "ease", // string
        coordsChangeTime: 300, // int
        coordsChangeTiming: "ease", // string

        rotatePerspective: "200px", // string
        rotateBackface: true, // bool
        rotateAngles: [0, -180, 180, 0], // array[fi, bi, ft, bt] (front,back,init,target)

        widthPtAs: 0, // number
        widthPxAs: 0, // number
        heightPtAs: 0, // number
        heightPxAs: 0, // number

        repackSize: null, // null | int

        // Read about filters at http://gridifier.io/sortings/filters
        filter: {
            selected: "all",
            all: function(item) {
                return true;
            }
            // Define custom filters here
            // , custom: function(item) {
            //      return (someCond) ? true : false;
            // }
        },
        // Read about sorts at http://gridifier.io/sortings/sorts
        sort: {
            selected: "default",
            "default": function(first, second, sort, dom) {
                var sortAttr = "data-gridifier-orig-sort-index";
                return dom.int(dom.get(first, sortAttr)) - dom.int(dom.get(second, sortAttr));
            }
            // Define custom sorts here
            // , customSort: function(first, second, sort) {
            //       // return sort comparator result here
            //       // never return 0 from this function(sorts are unstable in most browsers)
            //   }
        },
        // Read about togglers at http://gridifier.io/api/togglers
        toggle: {
            selected: "scale"
            // To write custom toggler some additional info is required.
            // So, we will write separate chapter about it later.
        },
        // Read about drag decorators at http://gridifier.io/dragifiers/decorators
        drag: {
            selected: "cloneCss",
            cloneCss: function(clone, item, srManager) {
                srManager.copyComputedStyle(item, clone);
            }
            // , customDrag: function(itemClone, item, srManager) {
            //       // Style item clone here
            //   }
        },
        // Read about retransform sorts at http://gridifier.io/sortings/retransform-sorts
        rsort: {
            selected: "default",
            "default": function(cns) {
                return cns;
            }
            // , customRsort: function(connections) {
            //       // Sort connections here. Each connections
            //       // array entry has x1, y1, x2, y2 coords available.
            //       return connections;
            //   }
        },
        // Read about coords changers at http://gridifier.io/api/renderers
        coordsChanger: {
            selected: "translate3dInt"
        },

        insertRange: 3000, // int
        vpResizeDelay: null, // null | int

        queueSize: 12, // int
        queueDelay: 25, // int
        disableQueueOnDrags: true // bool
    }

    var settings = (typeof sourceSettings != "undefined") ? sourceSettings : {};
    this._parse(settings);
}