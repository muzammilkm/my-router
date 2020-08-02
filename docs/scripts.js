import Router from "./lib/my-router/index.js";

class Main {
  constructor() {
    let routes = {};
    routes["home"] = {
      url: "#/",
      templateUrl: "templates/home.html",
      test: "Home"
    };

    routes["contact"] = {
      url: "#/contact",
      templateUrl: "templates/contact.html",
      test: "contacts"
    };

    routes["users"] = {
      abstract: true,
      url: "#/users",
      templateUrl: "templates/contact.html",
      test: "Users"
    };

    routes["users.list"] = {
      url: "/list",
      templateUrl: "templates/index.html",
      test: "List User"
    };

    routes["users.add"] = {
      url: "/add",
      templateUrl: "templates/index.html",
      test: "Add User"
    };

    this.state = "some";
    Router.init(routes, "home", false).run(".my-view");
    Router.onRouteChanged((route, param) => {
      console.log("Route Changed", this.state, route, param);
    });
    Router.go("home");
  }
}

new Main();
