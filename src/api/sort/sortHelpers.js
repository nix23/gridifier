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

SortHelpers = function() {
    var me = this;
    this._applyReplacers = function(value, replacers) {
        for(var i = 0; i < replacers.length; i++)
            value = value.replace(replacers[i][0], replacers[i][1]);

        return value;
    }

    var sortHelpers = {
        byOriginalPos: function(first, second) {
            return Dom.int(Dom.get(first, C.COLL.SORT_INDEX_DATA)) - Dom.int(Dom.get(second, C.COLL.SORT_INDEX_DATA));
        },

        byComparator: function(firstItemComp, secondItemComp, reverseOrder) {
            var orderReverser = (reverseOrder) ? -1 : 1;

            if(firstItemComp > secondItemComp)
                return 1 * orderReverser;
            else if(firstItemComp < secondItemComp)
                return -1 * orderReverser;

            return 0;
        },

        byMultipleComparators: function(first, second, comps) {
            for(var i = 0; i < comps.length; i++) {
                var result = this.byComparator(comps[i].forFirst, comps[i].forSecond, comps[i].reverseOrder);
                if(result == 0) {
                    if(i == comps.length - 1)
                        return this.byOriginalPos(first, second);

                    continue;
                }

                return result;
            }
        },

        buildComparators: function(first, second, compGetterFn, compParam, compParamReplacers, reverseOrder) {
            if(typeof compParam == "undefined")
                err("No sort comp param.");

            if(!Dom.isArray(compParam))
                var compParams = [[compParam, reverseOrder]];
            else {
                var compParams = [];
                for(var i = 0; i < compParam.length; i++) {
                    var reverseOrder = false;
                    if(compParam[i].indexOf("|desc") !== -1) {
                        reverseOrder = true;
                        compParam[i] = compParam[i].replace("|desc", "");
                    }

                    compParams.push([compParam[i], reverseOrder]);
                }
            }

            var comparators = [];
            for(var i = 0; i < compParams.length; i++) {
                comparators.push({
                    forFirst: compGetterFn(first, compParams[i][0], compParamReplacers),
                    forSecond: compGetterFn(second, compParams[i][0], compParamReplacers),
                    reverseOrder: compParams[i][1]
                });
            }

            return comparators;
        },

        sortBy: function(first, second, compGetterFn, compParam, reverseOrder, compParamReplacers) {
            return this.byMultipleComparators(
                first, second, this.buildComparators(
                    first, second, compGetterFn, compParam, compParamReplacers || false, reverseOrder || false
                )
            );
        }
    };

    var comparators = {
        Data: function(item, attr) { return Dom.get(item, attr); },
        Content: function(item) { return item.innerHTML; },
        Query: function(item, query) { return Dom.find.byQuery(item, query)[0].innerHTML; }
    };
    var replacer = function(val, replacers, toType) {
        return (!replacers) ? toType(val) : toType(this._applyReplacers(val, replacers));
    }
    var types = {
        Def: function(val) { return val; },
        Int: function(val) { return Dom.int(val); },
        Float: function(val) { return parseFloat(val); }
    }
    var createCompFn = function(valGetter, typeConv) {
        return function(item, compParam, replacers) {
            return replacer.call(me, valGetter(item, compParam), replacers, typeConv);
        }
    }
    var createCompExecFn = function(compFn, noCompParam) {
        if(!noCompParam) {
            return function(first, second, compParam, reverseOrder, replacers) {
                return this.sortBy(first, second, compFn, compParam, reverseOrder, replacers);
            }
        }
        else {
            return function(first, second, reverseOrder, replacers) {
                return this.sortBy(first, second, compFn, null, reverseOrder, replacers);
            }
        }
    }

    var comparatorFns = {};
    for(var compName in comparators) {
        for(var typeName in types) {
            var compFnName = "by" + compName + ((typeName == "Def") ? "" : typeName);
            comparatorFns[compFnName] = createCompFn(comparators[compName], types[typeName]);
            sortHelpers[compFnName] = createCompExecFn(comparatorFns[compFnName], compName == "Content");
        }
    }

    sortHelpers.comparatorFns = comparatorFns;
    return sortHelpers;
}