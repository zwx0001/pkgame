import React from "react";
import { Router, Switch } from "dva/router";
import routers from "./routerConfig";
import RouterView from "./routerview";
function routerView({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <RouterView routers={routers} />
      </Switch>
    </Router>
  );
}
export default routerView;
