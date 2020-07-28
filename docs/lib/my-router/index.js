import RouterEvent from "./services/router-events.js";
import RouterEngine from "./services/router-engine.js";

class Router {
  constructor() {
    this.routes;
    this.route;
    this.params;
    this.hasInitialized = false;
  }

  // /**
  //  * Get current route params
  //  * @return {object} params
  //  */
  // getCurrentParams() {
  //   return this.params;
  // }

  // /**
  //  * Get current route
  //  * @return {object} route
  //  */
  // getCurrentRoute() {
  //   return this.route;
  // }

  // /**
  //  * Get route by name
  //  * @param {string} routeName
  //  * @return {object} route
  //  */
  // getRouteName(routeName) {
  //   return this.routes[routeName];
  // }

  /**
   * Get route params
   * @param {object} route
   * @return {object} params
   */
  // getRouteParams(route) {
  //   var s = this,
  //     params = {},
  //     match = route.urlExpr.exec(route.url);

  //   for (var i = 0; i < route.params.length; i++) {
  //     params[route.params[i]] = match[i + 1];
  //   }

  //   return $.extend({}, s.paramService.getParams(), params);
  // }

  /**
   * Navigates to given route name & params
   * @param {string} routeName
   * @param {object} params
   * @return {object} this
   */
  // go(routeName, params) {
  //   console.log("Navigate to given route", this.routes[routeName]);
  //   var s = this,
  //     url = s.href(routeName, params);
  //   if (url) {
  //     s.paramService.setParams(params);
  //     window.location.assign(url);
  //   }
  //   return s;
  // }

  /**
   * Get url for given route name & params
   * @param {string} routeName
   * @param {object} params
   * @return {string}
   */
  // href(routeName, params) {
  //   routeName = routeName || defaultRoute;
  //   var s = this,
  //     route = s.routes[routeName];
  //   if (!route) {
  //     return;
  //   }
  //   return s.paramReplacer(route.relativeUrl, route, params);
  // }



  /**
   * Check route params are modified or not
   * @param {string} routeName
   * @param {object} params
   * @return {bool}
   */
  // isRouteParamChanged(routeName, params) {
  //   var s = this;
  //   return (
  //     s.href(routeName, params) !== s.href(routeName, s.getCurrentParams())
  //   );
  // }


  /**
   * Replace Params for given string with route & params
   * @param {string}
   * @param {object} route
   * @param {object} params
   * @returns {string}
   */
  // paramReplacer(str, route, params) {
  //   if (!str) {
  //     return;
  //   }
  //   for (var i = 0; i < route.params.length; i++) {
  //     str = str.replace(":" + route.params[i], params[route.params[i]]);
  //   }

  //   return str;
  // }

  /**
   * Set route data by preparing params & expression.
   * @param {object} routeData
   * @param {string} defaultRoute default route name
   * @param {bool} isCacheTemplate default to true
   * @return {object} this
   */
  init(routeData, defaultRoute, isCacheTemplate = true) {
    routerEngine.init(routeData, defaultRoute, isCacheTemplate);
    return this;
  }

  /**
   * Initialize the router & this should be invoked on document ready.
   * @param {string} viewSelector
   * @return {object} this
   */
  run(viewSelector) {
    routerEngine.run(viewSelector);
    return this;
  }

  onRouteChanged(handler) {
    routerEvents.onRouteMatched(handler);
  }
}

let routerEvents = new RouterEvent();
let routerEngine = new RouterEngine(routerEvents);
export default new Router();
