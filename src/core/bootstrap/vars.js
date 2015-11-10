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

// Constant Prefixes-Postfixes
var CP = {
    DATA: "data-gridifier",
    OWCACHED: "-cached-per-ow",
    OHCACHED: "-cached-per-oh",
    ERR: "Gridifier error: ",

    NOT_NATIVE: "is not jQuery/Native DOM object.",
    IS_ACTIVE: "-toggle-is-active"
}

// Class constants
var C = {
    SRM: {
        CACHED_PER_OW_ITEM_GUID_DATA: CP.DATA + CP.OWCACHED + "-guid",
        CACHED_PER_OH_ITEM_GUID_DATA: CP.DATA + CP.OHCACHED + "-guid",
        CACHED_PER_OW_DATA: CP.DATA + CP.OWCACHED,
        CACHED_PER_OH_DATA: CP.DATA + CP.OHCACHED,
        EMPTY_DATA: "e"
    },

    COLL: {
        SORT_INDEX_DATA: CP.DATA + "-orig-sort-index",
        NOT_COLLECTABLE_DATA: CP.DATA + "-not-collectable"
    },

    ITEM: {
        IS_CONNECTED_DATA: CP.DATA + "-connected"
    },

    REND: {
        CN_RENDERED_DATA: CP.DATA + "-cn-rendered",
        SCH_TO_HIDE_DATA: CP.DATA + "-sch-to-hide",
        SILENT_DATA: CP.DATA + "-sch-for-silentr"
    },

    DRAGIFIER_REPOS_DELAY: 20,
    DRAGIFIER_DISCR_REPOS_DELAY: 100,
    IS_DRAGGABLE_DATA: CP.DATA + "-is-draggable",

    GUID_DATA: CP.DATA + "-guid",
    RANGE_SIZE: 500,
    REFLOW_FIX_DELAY: 0,
    UPDATE_Z_DELAY: 100,

    INSERT_QUEUE_DELAY: 100,
    INSERT_BATCH_DELAY: 100,
    RENDER_QUEUE_DELAY: 20,
    RENDER_DEF_DELAY: 40,

    // Soft disconnects are used in filters.(After hard disconnect items
    // shouldn't show on filter show)
    DISC_TYPES: {SOFT: 0, HARD: 1},
    DISC_BATCH: 12,
    DISC_DELAY: 60,

    RSORT_REPOS_DELAY: 20,
    MAX_Z: "16777271"
}

// Toggle constants
var TOGGLE = {
    IS_ACTIVE: CP.DATA + CP.IS_ACTIVE,
    IS_ACTIVE_WITH_CC: CP.DATA + CP.IS_ACTIVE + "-with-cc",
    SYNCER_DATA: CP.DATA + "-toggle-syncer-id"
}

// Rotate constants
var ROTATE = {
    MATRICES: {
        X: "1, 0, 0, ",  Y: "0, 1, 0, ",  Z: "0, 0, 1, ",
        XY: "1, 1, 0, ", XZ: "1, 0, 1, ", YZ: "0, 1, 1, ",
        XYZ: "1, 1, 1, "
    },
    FNS: {X: "rotateX", Y: "rotateY", Z: "rotateZ"},
    FADES: {NONE: 0, FULL: 1, ON_HIDE_MIDDLE: 2},
    GUID_DATA: CP.DATA + "rotate-guid",
    SCENE_CLASS_PREFIX: "gridifierRotateSceneId"
}

// Connector constants
var CRS = {
    INITIAL_GUID: -1,
    SHIFTED: 8,
    APPEND: {DEF: 0, REV: 1},
    PREPEND: {DEF: 2, REV: 3},
    LEFT: {TOP: 0, BOTTOM: 1},
    BOTTOM: {RIGHT: 2, LEFT: 3},
    RIGHT: {TOP: 4, BOTTOM: 5},
    TOP: {LEFT: 6, RIGHT: 7},
    CLEANERS: {INSIDE: 0, INSIDE_OR_BEFORE: 1}
}

// Operation constants
var OPS = {
    PREPEND: 0, REV_PREPEND: 1, APPEND: 2,
    REV_APPEND: 3, MIR_PREPEND: 4, INS_BEFORE: 5, INS_AFTER: 6,
    SIL_APPEND: 7
}

var RENDER_OPS = {
    SHOW: 0, HIDE: 1, RENDER: 2, DEL_RENDER: 3
}

// Api setting constants
var AS = {
    FILTER: "filter", SORT: "sort", TOGGLE: "toggle", DRAG: "drag", RSORT: "rsort", COORDSCHANGER: "coordsChanger"
}

// Error constants
var E = {
    NOT_NATIVE: "one of items " + CP.NOT_NATIVE,
    GRID_NOT_NATIVE: "grid " + CP.NOT_NATIVE,

    NO_CNS: "no inserted items",
    CANT_FIND_CN: "can't find conn. by item",

    WRONG_IBA_ITEM: "wrong insertBefore/After targetItem",
    TOO_BIG_ITEM: "too wide(ver.grid)/too tall(hor.grid) item"
}

// Event consts
var EV = {
    SHOW: "Show", HIDE: "Hide", GRID_RESIZE: "GridResize", CSS_CHANGE: "CssChange", REPOSITION_END: "RepositionEnd",
    REPOSITION: "Reposition", DISCONNECT: "Disconnect", INSERT: "Insert", DRAG_END: "DragEnd"
}

// Internal event consts
var INT_EV = {
    REPOSITION_END_FOR_DRAG: "RepositionEndForDrag", BEFORE_SHOW_FOR_RSORT: "BeforeShowForRsort",
    SET_SETTING_FOR_NZER: "SetSettingForNzer", RSORT_CHANGE: "RsortChange"
}