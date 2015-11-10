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

var SortHelpers = nop();
var RsortHelpers = nop();

var SilentRenderer = function() {
    return {isScheduled: function() { return false; }}
}
var Antialiaser = nop();

var ImagesLoader = nop();
var LoadedImage = nop();

var DefaultCc = nop();
var PositionCc = nop();
var TranslateCc = nop();
var Translate3dCc = nop();

var VisibilityToggle = nop();
var ScaleToggleFactory = nop();
var ScaleToggle = nop();
var FadeToggle = nop();
var SlideToggleFactory = nop();
var SlideToggle = nop();
var RotateToggleFactory = nop();
var RotateToggle = nop();

// var DiscretizerDebug = function() {
//     return {create: nop(), update: nop(), rm: nop()}
// }
var Discretizer = nop();
var DiscretizerCore = nop();

var DragifierApi = function() {
    return {getCoordsChanger: nop()}
}
var Dragifier = nop();
var DragifierCore = nop();
var IntDraggableItem = nop();
var DragifierCells = nop();
var DiscrDraggableItem = nop();