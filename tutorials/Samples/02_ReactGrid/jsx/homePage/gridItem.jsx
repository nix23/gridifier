var HomePageGridItem = React.createClass({
    render: function() {
        var className = "item item col-xs-12 col-sm-6 col-md-4 col-lg-3";
        className += " " + this.props.item.color;

        return (
            <div className={className}
                 data-sort={this.props.item.text}>
                 <div className="item-wrapper">
                     <h2>{this.props.item.text}</h2>
                 </div>
            </div>
        );
    },

    componentDidMount: function() {
        this.props.onMount();
    }
});