import React from "react";
import { HashRouter, Switch, Route } from "react-router-dom";
import Routes from "./routes";

const Router = () => {
  return (
    <HashRouter>
      <Switch>
        {Routes.map((item, index) => (
          <Route key={index} path={item.path}>
            {item.component}
          </Route>
        ))}
      </Switch>
    </HashRouter>
  );
};

export default Router;
