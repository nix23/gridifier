/* Gridifier v2.~.~ source file for custom build.
 * Async Responsive HTML Grids
 * http://gridifier.io
 * 
 * Gridifier is dual-licensed:
 *   GPLV3 per non-commercial usage; 
 *   Commercial license per commercial usage.
 * Read http://gridifier.io/license for details.
 * Copyright 2015 nTech
 */

var RsortApi = function() {
    this._created = false;
    this._repositionTimeout = null;

    var me = this;
    ev.onRsortChange(function() {
        me._update.call(me);
    });

    this._update();
}

proto(RsortApi, {
    _update: function() {
        var me = this;
        var rsort = settings.get("rsort").selected;

        if(rsort != "default" && !this._created) {
            this._created = true;
            new RsortHelpers(settings);
        }

        me._change(rsort);
    },

    _change: function(rsort) {
        var me = this;
        // Don't remove def rSorter. (Unnecessary rep-ions will be triggered.)
        if(rsort == "default")
            ev.onBeforeShowForRsort(null);
        else {
            ev.onBeforeShowForRsort(function() {
                clearTimeout(me._repositionTimeout);
                me._repositionTimeout = setTimeout(function() {
                    me._reposition();
                }, C.RESORT_REPOS_DELAY);
            });
        }
    },

    _reposition: function() {
        if(settings.get("repackSize") == null) {
            reposition.all();
            return;
        }

        var repackSize = settings.get("repackSize");
        var items = gridifier.all();

        if(items.length < repackSize) {
            reposition.all();
            return;
        }

        reposition.fromFirstSortedCn([items[items.length - repackSize]]);
    }
});