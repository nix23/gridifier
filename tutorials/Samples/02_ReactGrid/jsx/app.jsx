var App = React.createClass({
    render: function() {
        return (
            <div className="container-fluid">
                <Header/>
                {this.props.children}
            </div>
        );
    }
});