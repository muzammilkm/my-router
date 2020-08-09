import Route from "../models/route.js";

class RouterService {
    /**
     *  @type {Object.<string, Route>}
     */
    routes;
    /**
     *  @type {Route}
     */
    currentRoute;
    /**
     *  @type {Object}
     */
    currentRouteParams;

    constructor() {
    }

    /**
   * Set route data by preparing params & expression.
   * @param {object} routeData
   * @param {string} defaultRoute default route name
   * @param {bool} isCacheTemplate default to true
   * @return {object} this
   */
    init(routeData, defaultRoute, isCacheTemplate = true) {
        this.routes = {};
        for (var routeName in routeData) {
            this.routes[routeName] = new Route(routeName, routeData, isCacheTemplate);
        }
        this.defaultRoute = this.routes[defaultRoute];
        return this;
    }

    /**
     * Get route params
     * @param {Route} route
     * @return {object} params
     */
    getRouteParams(route) {
        const params = {},
            match = route.urlExpr.exec(route.url);

        for (let i = 0; i < route.params.length; i++) {
            params[route.params[i]] = match[i + 1];
        }

        // return Object.assign({}, this.routerParamService.getParams(), params);
        return Object.assign({}, params);
    }

    /**
     * 
     * @param {string} routeName 
     * @returns {Route}
     */
    getRouteByName(routeName) {
        return this.routes[routeName];
    }
    
    /**
     * Check route params are modified or not
     * @param {string} routeName
     * @param {object} params
     * @return {bool}
     */
    isRouteParamChanged(routeName, params) {
        return (this.href(routeName, params) !== this.href(routeName, this.currentRouteParams));
    }

    /**
     * Get url for given route name & params
     * @param {string} routeName
     * @param {object} params
     * @return {string}
     */
    href(routeName, params) {
        routeName = routeName || defaultRoute.name;
        const route = this.routes[routeName];
        if (!route) {
            return;
        }
        return this.paramReplacer(route.relativeUrl, route, params);
    }

    /**
     * Return matched route based on url
     * @param {string} url
     * @return {Route} route
     */
    match(url) {
        for (const routeName in this.routes) {
            let route = this.routes[routeName];
            if (!route.abstract && route.urlExpr.exec(url) !== null) {
                return route;
            }
        }
        return null;
    }

    /**
     * Replace Params for given string with route & params
     * @param {string}
     * @param {object} route
     * @param {object} params
     * @returns {string}
     */
    paramReplacer(str, route, params) {
        if (!str) {
            return;
        }
        for (const i = 0; i < route.params.length; i++) {
            str = str.replace(":" + route.params[i], params[route.params[i]]);
        }
        return str;
    }

    /**
     * 
     * @param {Route} route 
     * @param {object} params 
     */
    updateCurrentState(route, params) {
        this.currentRoute = route;
        this.currentRouteParams = params;
    }
}

export default RouterService;