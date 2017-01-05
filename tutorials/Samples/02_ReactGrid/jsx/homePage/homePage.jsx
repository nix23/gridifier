var HomePage = React.createClass({
    getInitialState: function() {
        return {
            selectedSort: "a_z",
            selectedFilter: "all",
            items: [],
        };
    },

    componentDidMount: function() {
        this._grid = new Gridifier(ReactDOM.findDOMNode(this.refs.grid), {
            class: "item",
            toggle: "scaleWithFade",
            sort: {
                selected: this.state.selectedSort,
                a_z: function(first, second, sort) {
                    return sort.byData(first, second, "data-sort");
                },
                z_a: function(first, second, sort) {
                    return sort.byData(first, second, "data-sort", true);
                }
            },
            filter: {
                "selected": this.state.selectedFilter,
                "red": function(item) { return item.classList.contains("redItem"); },
                "violet": function(item) { return item.classList.contains("violetItem"); },
                "blue": function(item) { return item.classList.contains("blueItem"); }
            }
        }); 

        var filters = ["redItem", "violetItem", "blueItem"];
        var getColor = function() { return filters[Math.floor(Math.random() * 3)]; };

        var fakeApiCall = function() {
            return [
                {text: "Omicron", color: getColor()},
                {text: "Psi", color: getColor()},
                {text: "Alpha", color: getColor()},
                {text: "Chi", color: getColor()},
                {text: "Eta", color: getColor()},
                {text: "Omega", color: getColor()},
                {text: "Zeta", color: getColor()},
                {text: "Epsilon", color: getColor()},
                {text: "Delta", color: getColor()},
                {text: "Lambda", color: getColor()},
                {text: "Nu", color: getColor()},
                {text: "Theta", color: getColor()},
                {text: "Pi", color: getColor()},
                {text: "Mu", color: getColor()},
                {text: "Xi", color: getColor()},
                {text: "Upsih", color: getColor()}
            ];
        };

        var me = this;
        this.setState({items: fakeApiCall()});
    },

    componentWillUnmount: function() {
        this._grid.destroy();
    },

    render: function() {
        return (
            <div>
                <h1>React + Gridifier Demo Grid</h1>
                
                <div className="row">
                    <HomePageControls
                        selectedSort={this.state.selectedSort}
                        selectedFilter={this.state.selectedFilter}
                        onSortChange={this.onSortChange}
                        onFilterChange={this.onFilterChange} />

                    <HomePageGrid
                        ref="grid"
                        items={this.state.items}
                        onMount={this.onNewItemMount} />
                </div>
            </div>
        );
    },

    onNewItemMount: function() {
        this._grid.appendNew();
    },

    onSortChange: function(val) {
        var me = this;
        this.setState({selectedSort: val}, function() { 
            me._grid.sort(val).resort();
        });
    },

    onFilterChange: function(val) {
        var me = this;
        this.setState({selectedFilter: val}, function() {
            me._grid.filter(val);
        });
    }
});