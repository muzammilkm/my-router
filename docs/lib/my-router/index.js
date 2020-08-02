import RouterEvent from "./services/router-events.js";
import RouterEngine from "./services/router-engine.js";
import RouterParamService from "./services/router-param-service.js";
import RouterService from "./services/router-service.js";

class MyRouter {
  constructor() {
    this.routes;
    this.route;
    this.params;
    this.hasInitialized = false;
  }

  /**
   * Set route data by preparing params & expression.
   * @param {object} routeData
   * @param {string} defaultRoute default route name
   * @param {bool} isCacheTemplate default to true
   * @return {object} this
   */
  init(routeData, defaultRoute, isCacheTemplate = true) {
    routerService.init(routeData, defaultRoute, isCacheTemplate);
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

  /**
   * 
   * @param {string} routeName 
   * @param {object} params 
   */
  go(routeName, params) {
    routerEngine.go(routeName, params);
  }

  onRouteChanged(handler) {
    routerEvents.onRouteMatched(handler);
  }
}

const routerEvents = new RouterEvent();
const routerParamSerivce = new RouterParamService();
const routerService = new RouterService();
const routerEngine = new RouterEngine(routerService, routerParamSerivce, routerEvents);
export default new MyRouter();
