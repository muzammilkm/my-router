import { RouterEventType } from '../models/router-event-type.js';

class RouterEvent {
    constructor() {
        this.handlers = {};
    }

    trigger(eventName, eventData) {
        if (this.handlers[eventName]) {
            this.handlers[eventName].apply(this, eventData);
        }
    }

    /**
     * Subscribe route change started event.
     * @param {function} handler
     * @return {object} this
     */
    onRouteBeforeChange(handler) {
        window.addEventListener(RouterEventType.OnRouteChangeStart, handler, false);
        return this;
    };

    /**
     * Subscribe route change sucess event.
     * @param {function} handler
     * @return {object} this
     */
    onRouteChanged(handler) {
        window.addEventListener(RouterEventType.routeChangeSuccess, handler, false);
        return this;
    };

    /**
     * Subscribe route matched event.
     * @param {function} handler
     * @return {object} this
     */
    onRouteMatched(handler) {
        this.handlers[RouterEventType.OnRouteMatched] = handler;
        return this;
    };

    /**
     * Subscribe route not matched event.
     * @param {function} handler
     * @return {object} this
     */
    onRouteNotMatched(handler) {
        window.addEventListener(RouterEventType.OnRouteNotMatched, handler, false);
        return this;
    };

    /**
     * Subscribe view change event.
     * @param {function} handler
     * @return {object} this
     */
    onViewChange(handler) {
        window.addEventListener(RouterEventType.OnRenderViewSuccess, handler, false);
        return this;
    };

    /**
     * Subscribe view destroy event.
     * @param {function} handler
     * @return {object} this
     */
    onViewDestroyed(handler) {
        window.addEventListener(RouterEventType.OnViewDestroyed, handler, false);
        return this;
    };

    onHashChange(handler) {
        window.addEventListener('hashchange', handler);
        return this;
    }
}

export default RouterEvent;