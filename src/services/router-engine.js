import { RouterEventType } from "../models/router-event-type.js";
import RouterEvent from "./router-events.js";
import RouterParamService from "./router-param-service.js";
import RouterRenderEngine from "./router-render-enginer.js";
import RouterService from "./router-service.js";

class RouterEngine {
    /**
     *  @type {RouterRenderEngine}
    */
    routerRenderEngine;

    /**
     * @param {RouterService} routerService
     * @param {RouterParamService} routerParamService
     * @param {RouterEvent} routerEvents 
     */
    constructor(routerService, routerParamService, routerEvents) {
        this.routerService = routerService;
        this.routerParamService = routerParamService;
        this.routerEvents = routerEvents;
    }

    /**
     * Navigates to given route name & params
     * @param {string} routeName
     * @param {object} params
     * @return {object} this
     */
    go(routeName, params) {
        const url = this.routerService.href(routeName, params);
        if (url) {
            this.routerParamService.setParams(params);
            window.location.assign(url);
        }
    }

    /**
   * Listen to url change events & should not be called outside of router.
   * @param {string} hash
   * @return {object} this
   */
    hashChanged(hash) {
        const matchedRoute = this.routerService.match(hash);

        if (matchedRoute) {
            const matchedParams = this.routerService.getRouteParams(matchedRoute);
            this.routerEvents.trigger(RouterEventType.OnRouteMatched, [matchedRoute, matchedParams]);
            //matchedRoute.previousUrl = current.route.url || hash;
            //matchedRoute.url = hash;

            this.routerRenderEngine.render(matchedRoute, matchedParams);
        } else {
            if (this.defaultRoute) {
                this.go(this.defaultRoute.name);
            }
        }
        return this;
    }

    /**
     * Initialize the router & this should be invoked on document ready.
     * @param {string} viewSelector
     * @return {object} this
     */
    run(viewSelector) {
        if (!this.hasInitialized) {
            this.routerRenderEngine = new RouterRenderEngine(viewSelector, this.routerService, this.routerEvents);
            this.hasInitialized = true;
            if (window.location.pathname.lastIndexOf(".") === -1 &&
                window.location.pathname.substr(-1) !== "/") {
                window.location.pathname = window.location.pathname + "/";
                return;
            }
            this.routerEvents.onHashChange(() => {
                this.hashChanged(window.location.hash);
            });
            this.hashChanged(window.location.hash);
        }
    }
}

export default RouterEngine;