var HomePageControls = React.createClass({
    render: function() {
        return (
            <div className="clearfix">
                <div className="pull-left">
                     <h4>Options:</h4>
                </div>

                <div className="pull-right">
                    <select value={this.props.selectedSort}
                            onChange={this.onSortChange}>
                        <option value="a_z">A - Z</option>
                        <option value="z_a">Z - A</option>
                    </select>

                    <select value={this.props.selectedFilter}
                            onChange={this.onFilterChange}>
                        <option value="all">All</option>
                        <option value="blue">Blue</option>
                        <option value="violet">Violet</option>
                        <option value="red">Red</option>
                    </select>
                </div>
            </div>
        );
    },

    onSortChange: function(e) {
        this.props.onSortChange(e.target.value);
    },

    onFilterChange: function(e) {
        this.props.onFilterChange(e.target.value);
    }
});