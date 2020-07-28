import Route from "../models/route.js";
import RouterEvent from "./router-events.js";
import { RouterEventType } from './router-event-type.js';

class RouterEngine {
    /**
     * 
     * @param {RouterEvent} routerEvents 
     */
    constructor(routerEvents) {
        this.routerEvents = routerEvents;
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
     * Navigates to given route name & params
     * @param {string} routeName
     * @param {object} params
     * @return {object} this
     */
    go(routeName, params) {
        const url = this.href(routeName, params);
        if (url) {
            // s.paramService.setParams(params);
            window.location.assign(url);
        }
    }


    /**
   * Listen to url change events & should not be called outside of router.
   * @param {string} hash
   * @return {object} this
   */
    hashChanged(hash) {
        let matchedRoute = this.match(hash),
            matchedParams;

        this.routerEvents.trigger(RouterEventType.OnRouteMatched, [matchedRoute, matchedParams]);
        if (matchedRoute) {
            //matchedRoute.previousUrl = current.route.url || hash;
            //matchedRoute.url = hash;
            // matchedParams = s.getRouteParams(matchedRoute);


            // s.renderEngine.processRoute(matchedRoute, matchedParams).then(function () {
            //     $(window).trigger(s.events.routeChangeStart, [
            //         matchedRoute,
            //         matchedParams
            //     ]);
            //     s.renderEngine.render(matchedRoute, matchedParams);
            //     current.route = matchedRoute;
            //     current.params = matchedParams;
            //     $(window).trigger(s.events.routeChangeSuccess, [
            //         matchedRoute,
            //         matchedParams
            //     ]);
            // });
        } else {
            if (this.defaultRoute) {
                this.go(this.defaultRoute.name);
            }
        }
        return this;
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
     * @return {object} route
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
     * Initialize the router & this should be invoked on document ready.
     * @param {string} viewSelector
     * @return {object} this
     */
    run(viewSelector) {
        if (!this.hasInitialized) {
            this.hasInitialized = true;
            if (window.location.pathname.lastIndexOf(".") === -1 &&
                window.location.pathname.substr(-1) !== "/") {
                window.location.pathname = window.location.pathname + "/";
                return;
            }
            //s.renderEngine.setViewSelector(viewSelector);
            this.routerEvents.onHashChange(() => {
                this.hashChanged(window.location.hash);
            });
            this.hashChanged(window.location.hash);
        }
    }
}

export default RouterEngine;