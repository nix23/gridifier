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

RsortHelpers = function(settings) {
    this._createBySizesRsorts(settings);
}

proto(RsortHelpers, {
    _createBySizesRsorts: function(settings) {
        var me = this;
        var oneBatch = 100000;
        var api = bind("addApi", settings);

        var calculateAreas = function(cns) {
            for(var i = 0; i < cns.length; i++) {
                var width = Math.abs(cns[i].x2 - cns[i].x1) + 1;
                var height = Math.abs(cns[i].y2 - cns[i].y1) + 1;

                cns[i].area = Math.round(width * height);
                cns[i].isLandscape = (width >= height);
            }
        }

        var packByAreas = function(cns) {
            var areasWithCns = [];
            for(var i = 0; i < cns.length; i++) {
                var newArea = true;

                for(var j = 0; j < areasWithCns.length; j++) {
                    if(areasWithCns[j].area == cns[i].area) {
                        areasWithCns[j].cns.push(cns[i]);
                        newArea = false;
                        break;
                    }
                }

                if(newArea)
                    areasWithCns.push({area: cns[i].area, cns: [cns[i]]});
            }

            return areasWithCns;
        }

        var packByOrientation = function(cns) {
            var areasWithCns = [{area: "landscape", cns: []}, {area: "portrait", cns: []}];
            for(var i = 0; i < cns.length; i++) {
                var index = (cns[i].isLandscape) ? 0 : 1;
                areasWithCns[index].cns.push(cns[i]);
            }

            return areasWithCns;
        }

        var sortEvenly = function(cns, fstGroupSize, byOrientation) {
            var byOrientation = byOrientation || false;

            if(!byOrientation) {
                var areasWithCns = packByAreas(cns);
                // Stable sort here(all areas are unique, desc)
                areasWithCns.sort(function(fst, snd) {
                    return parseFloat(snd.area) - parseFloat(fst.area);
                });
            }
            else
                var areasWithCns = packByOrientation(cns);

            var sortedCns = [];
            var allEmpty = false;
            while(!allEmpty) {
                var noChanges = true;
                for(var i = 0; i < areasWithCns.length; i++) {
                    if(areasWithCns[i].cns.length != 0) {
                        if(i == 0) {
                            for(var j = 0; j < fstGroupSize; j++) {
                                if(areasWithCns[i].cns.length != 0)
                                    sortedCns.push(areasWithCns[i].cns.shift());
                            }
                        }
                        else
                            sortedCns.push(areasWithCns[i].cns.shift());

                        noChanges = false;
                    }
                }

                if(noChanges)
                    allEmpty = true;
            }

            return sortedCns;
        }

        var savePositions = function(cns) {
            var nextPos = 0;
            for(var i = 0; i < cns.length; i++)
                cns[i].rsortPos = ++nextPos;
        }

        var cnsToBatches = function(cns, batchSize) {
            var cnBatches = [];
            var nextBatch = [];
            for(var i = 0; i < cns.length; i++) {
                nextBatch.push(cns[i]);
                if((i + 1) % batchSize == 0) {
                    cnBatches.push(nextBatch);
                    nextBatch = [];
                }
            }
            if(nextBatch.length != 0)
                cnBatches.push(nextBatch);

            return cnBatches;
        }

        var batchesToCns = function(cns, cnBatches) {
            cns.splice(0, cns.length);
            for(var i = 0; i < cnBatches.length; i++) {
                for(var j = 0; j < cnBatches[i].length; j++)
                    cns.push(cnBatches[i][j]);
            }

            return cns;
        }

        var createByAreaEvenlyRsort = function(batchSize, fstGroupSize) {
            return function(cns) {
                calculateAreas(cns);
                savePositions(cns);

                var cnBatches = cnsToBatches(cns, batchSize); 
                for(var i = 0; i < cnBatches.length; i++)
                    cnBatches[i] = sortEvenly(cnBatches[i], fstGroupSize);

                return batchesToCns(cns, cnBatches);
            }
        }

        api("rsort", "areaEvenly", createByAreaEvenlyRsort(oneBatch, 1));

        var sizes = [2, 3, 4, 5];
        var evenlySorts = [];
        for(var i = 0; i < sizes.length; i++)
            evenlySorts.push(["areaEvenlyAll-" + sizes[i], oneBatch, sizes[i]]);

        var bs = [1,2,3,4];
        for(var i = 5; i <= 50; i += 5) 
            bs.push(i);
        for(var i = 0; i < bs.length; i++) {
            for(var j = 1; j <= 5; j++)
                evenlySorts.push(["areaEvenly" + bs[i] + "-" + j, bs[i], j]);
        }

        for(var i = 0; i < evenlySorts.length; i++) {
            var es = evenlySorts[i];
            api("rsort", es[0], createByAreaEvenlyRsort(es[1], es[2]));
        }

        var createByAreaRsort = function(reverseOrder) {
            var reversor = (reverseOrder) ? -1 : 1;
            return function(cns) {
                calculateAreas(cns);
                savePositions(cns);

                var cnBatches = cnsToBatches(cns, oneBatch);
                for(var i = 0; i < cnBatches.length; i++) {
                    cnBatches[i].sort(function(first, second) {
                        if(first.area > second.area)
                            return -1 * reversor;
                        else if(first.area < second.area)
                            return 1 * reversor;
                        else
                            return first.rsortPos - second.rsortPos;
                    });
                }

                return batchesToCns(cns, cnBatches);
            }
        }

        api("rsort", "areaDesc", createByAreaRsort(false));
        api("rsort", "areaAsc", createByAreaRsort(true));
        api("rsort", "orientationEvenly", function(cns) {
            calculateAreas(cns);
            savePositions(cns);

            var cnBatches = cnsToBatches(cns, oneBatch);
            for(var i = 0; i < cnBatches.length; i++)
                cnBatches[i] = sortEvenly(cnBatches[i], 1, true);

            return batchesToCns(cns, cnBatches);
        });
    }
});