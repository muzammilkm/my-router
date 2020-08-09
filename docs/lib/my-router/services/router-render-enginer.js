import { RouterEventType } from "../models/router-event-type.js";
import RouterService from "./router-service.js";
import Route from "../models/route.js";
import RouterEvent from "./router-events.js";

class RouterRenderEngine {
    /**
     * @param {string} selector
     * @param {RouterService} routerService
     * @param {RouterEvent} routerEvents
     */
    constructor(selector, routerService, routerEvents) {
        this.viewSelector = selector;
        this.routerService = routerService;
        this.routerEvents = routerEvents;
        this.templateCache = {};
    }

    /**
     * Raise view destroy event before rendering the view.
     * @param {string} url
     */
    clean(segments, till) {
        for (let i = segments.length - 1; i >= till; i--) {
            const _route = this.routerService.getRouteByName(segments[i]);
            this.routerEvents.trigger(RouterEventType.OnViewDestroyed, [_route]);
        }
    };

    /**
     * Download the template from server via ajax call.
     * @param {string} url
     * @param {bool} cache
     * @return {Promise}
     */
    getViewTemplate(url, templateUrl, cache) {
        return fetch(url, {
            cache: cache ? 'force-cache' : 'no-store',
            dataType: 'html'
        }).then((response) => {
            return response.text();
        }).then((content) => {
            this.templateCache[templateUrl] = content;
        });
    };

    /**
     * Check route template available in template cache or download the template.
     * @param {Route} route
     * @param {object} params
     * @return {Promise}
     */
    processRoute(route, params) {
        const requests = [];

        for (var i = 0; i < route.segments.length; i++) {
            var _route = this.routerService.getRouteByName(route.segments[i]);
            if (Array.isArray(_route.resolve)) {
                for (var j = 0; j < _route.resolve.length; j++) {
                    var cb = _route.resolve[j];
                    if (typeof (cb) === "function") {
                        requests.push(new Promise(cb(route, params)));
                    }
                }
            } else if (typeof (_route.resolve) === "function") {
                requests.push(new Promise(_route.resolve(route, params)));
            }

            if (!this.templateCache[_route.templateUrl] || !_route.cache) {
                var templateUrl = this.routerService.paramReplacer(_route.templateUrl, _route, params);
                requests.push(this.getViewTemplate(templateUrl, _route.templateUrl, _route.cache));
            }
        }

        return Promise.all(requests);
    };

    /**
     * Render changed route from template cache & notify successfully rendered view.
     * @param {Route} route
     * @param {Object} params
     */
    render(route, params) {
        this.processRoute(route, params)
            .then(() => {
                const currentRoute = this.routerService.currentRoute;
                let reload = currentRoute == null;

                this.routerEvents.trigger(RouterEventType.OnRouteChangeStart, [route, params]);
                for (var i = 0; i < route.segments.length; i++) {
                    var _route = this.routerService.getRouteByName(route.segments[i]),
                        $page = document.querySelectorAll(this.viewSelector)[i];

                    if (!reload) {
                        reload = (route.segments[i] !== currentRoute.segments[i]) ||
                            (i + 1 === route.segments.length) ||
                            (this.routerService.isRouteParamChanged(route.segments[i], params));
                        if (reload) {
                            this.clean(currentRoute.segments, i);
                        }
                    }

                    if (reload) {
                        $page.innerHTML = this.templateCache[_route.templateUrl];
                        this.routerEvents.trigger(RouterEventType.OnRenderViewSuccess, [_route, route, params]);
                    }
                }
                this.routerService.updateCurrentState(route, params);
                this.routerEvents.trigger(RouterEventType.OnRouteChangeSuccess, [route, params]);
            });
        return this;
    };
}

export default RouterRenderEngine;
