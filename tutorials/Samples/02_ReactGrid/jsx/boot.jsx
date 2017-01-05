var Router = ReactRouter.Router;
var IndexRoute = ReactRouter.IndexRoute;
var Route = ReactRouter.Route;
var hashHistory = ReactRouter.hashHistory;

ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={HomePage} />
            <Route path="/about" component={AboutPage} />
        </Route>
    </Router>
), document.getElementById("app"));