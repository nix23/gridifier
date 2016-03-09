var App = function() {};

proto(App, {
    init: function() {
        this._bindEvents();

        this._createGrid();
        this._createItems();
        this._connectItemsToGrid();
    },

    _bindEvents: function() {
        var me = this;

        $("#asc").on("change", function(e) {
            me._grid.sort(e.target.value).resort();
        });
        $("#filter").on("change", function(e) {
            me._grid.filter(e.target.value);
        });
    },

    _createGrid: function() {
        var me = this;
        var $grid = $(".grid");

        me._grid = new Gridifier($grid, {
            class: "item",
            toggle: "scaleWithFade",
            sort: {
                selected: "a_z",
                a_z: function(first, second, sort) {
                    return sort.byData(first, second, "data-sort");
                },
                z_a: function(first, second, sort) {
                    return sort.byData(first, second, "data-sort", true);
                }
            },
            filter: {
                "selected": "all",
                "red": function(item) { return $(item).hasClass("redItem"); },
                "violet": function(item) { return $(item).hasClass("violetItem"); },
                "blue": function(item) { return $(item).hasClass("blueItem"); }
            }
        });    
    },

    _createItems: function() {
        var itemsData = [
            {text: "Omicron"},
            {text: "Psi"},
            {text: "Alpha"},
            {text: "Chi"},
            {text: "Eta"},
            {text: "Omega"},
            {text: "Zeta"},
            {text: "Epsilon"},
            {text: "Delta"},
            {text: "Lambda"},
            {text: "Nu"},
            {text: "Theta"},
            {text: "Pi"},
            {text: "Mu"},
            {text: "Xi"},
            {text: "Upsih"}
        ];

        for(var i = 0; i < itemsData.length; i++)
            this._createItem(itemsData[i].text);
    },

    _createItem: function(text) {
        var item = '';
        var data = 'data-sort="' + text + '"';

        var filters = ["redItem", "violetItem", "blueItem"];
        var colorClass = filters[Math.floor(Math.random() * 3)];

        item += '<div class="item col-xs-12 col-sm-6 col-md-4 col-lg-3 ' + colorClass + '" ' + data + '>';
        item += '   <div class="item-wrapper">';
        item += '       <h2>' + text + '</h2>';
        item += '   </div>';
        item += '</div>';

        $(".grid").append($.parseHTML(item));
    },

    _connectItemsToGrid: function() {
        this._grid.appendNew();
    }
});