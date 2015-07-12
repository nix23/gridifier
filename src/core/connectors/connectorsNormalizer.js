/* Gridifier v1.~.~ source file for custom build.
 * Async Responsive HTML Grids
 * http://gridifier.io
 * 
 * Gridifier is dual-licensed:
 *   GPLV3 per non-commercial usage; 
 *   Commercial license per commercial usage.
 * Read http://gridifier.io/license for details.
 * Copyright 2015 nTech
 */

Gridifier.ConnectorsNormalizer = function(a, b, c) {
    var d = this;
    this._connections = null;
    this._connectors = null;
    this._settings = null;
    this._css = {};
    this._construct = function() {
        d._connections = a;
        d._connectors = b;
        d._settings = c;
    };
    this._bindEvents = function() {};
    this._unbindEvents = function() {};
    this.destruct = function() {
        d._unbindEvents();
    };
    this._construct();
    return this;
};

Gridifier.ConnectorsNormalizer.prototype.applyConnectionRoundingPerConnector = function(a, b) {
    a.originalX1 = a.x1;
    a.originalX2 = a.x2;
    a.originalY1 = a.y1;
    a.originalY2 = a.y2;
    if (Gridifier.Connectors.isBottomLeftSideConnector(b) || Gridifier.Connectors.isRightTopSideConnector(b)) {
        a.x1 = Math.floor(a.x1);
        a.y1 = Math.floor(a.y1);
    } else if (Gridifier.Connectors.isLeftTopSideConnector(b) || Gridifier.Connectors.isBottomRightSideConnector(b)) {
        a.x2 = Math.ceil(a.x2);
        a.y1 = Math.floor(a.y1);
    } else if (Gridifier.Connectors.isLeftBottomSideConnector(b) || Gridifier.Connectors.isTopRightSideConnector(b)) {
        a.x2 = Math.ceil(a.x2);
        a.y2 = Math.ceil(a.y2);
    } else if (Gridifier.Connectors.isTopLeftSideConnector(b) || Gridifier.Connectors.isRightBottomSideConnector(b)) {
        a.x1 = Math.floor(a.x1);
        a.y2 = Math.ceil(a.y2);
    }
};

Gridifier.ConnectorsNormalizer.prototype.unapplyConnectionRoundingPerConnector = function(a, b) {
    a.x1 = a.originalX1;
    a.y1 = a.originalY1;
    a.x2 = a.originalX2;
    a.y2 = a.originalY2;
};