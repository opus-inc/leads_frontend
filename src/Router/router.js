import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Routes from "./routes";

const Router = () => {
  return (
    <BrowserRouter basename="/738857258e">
      <Switch>
        {Routes.map((item, index) => (
          <Route key={index} path={item.path}>
            {item.component}
          </Route>
        ))}
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
