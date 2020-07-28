import { RouterExpr } from "./../services/router-expr.js";

class Route {
  constructor(name, routesData, isCacheTemplate) {
    this.params = [];
    this.segments = [];
    this.relativeUrl = "";
    this.templateUrl = "";
    this.url = "";
    this.urlExpr = "";

    Object.assign(this, routesData[name]);
    this.name = name;
    this.cache = this.hasOwnProperty("cache") ? this.cache : isCacheTemplate;

    let _routeName = [],
      paramMatch;

    for (var segment of name.split(".")) {
      _routeName.push(segment);
      let _segment = _routeName.join(".")
      this.segments.push(_segment);
      if (!routesData[_segment]) {
        console.error("Missing route ", _segment);
      } else {
        this.relativeUrl += routesData[_segment].url;
      }
    }

    while ((paramMatch = RouterExpr.Param_Matcher.exec(this.relativeUrl)) !== null) {
      this.params.push(paramMatch[1]);
    }
    this.urlExpr = new RegExp("^" + this.relativeUrl.replace(RouterExpr.Param_Matcher, RouterExpr.Param_Replacer) + "$");
  }

  template() { }
}

export default Route;
