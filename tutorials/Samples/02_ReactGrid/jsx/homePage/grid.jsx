var HomePageGrid = React.createClass({
    render: function() {
        var createGridItem = function(item) {
            return <HomePageGridItem item={item} onMount={this.props.onMount} />;
        };

        return (
            <div className="grid">
                {this.props.items.map(createGridItem, this)}
            </div>
        );
    }
});