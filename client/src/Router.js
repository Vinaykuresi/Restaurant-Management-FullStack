import React from "react";
import { Switch, Route } from "react-router-dom";

import HomePage from "./Component/Home/Home";
import customerRegister from "./Component/Customer/CustomerRegister/Register";
import customerLogin from "./Component/Customer/CustomerLogin/Login";
import adminLogin from "./Component/Admin/AdminLogin/Login";
import adminRegister from "./Component/Admin/AdminRegister/Register";
import customerDashborad from "./Component/Customer/Dashboard/Dashboard";
import adminDashboard from "./Component/Admin/Dashboard/Dashboard";
import addMeal from "./Component/Admin/Logic/Add/AddMeal";
import updateMeal from "./Component/Admin/Logic/Update/UpdateMeal";
import RoutePath from "./RoutePath";

export default () => (
  <Switch>
    <Route exact path={RoutePath.Home} component={HomePage} />
    <Route path={RoutePath.userRegister} component={customerRegister} />
    <Route exact path={RoutePath.userLogin} component={customerLogin} />
    <Route exact path={RoutePath.adminLogin} component={adminLogin} />
    <Route exact path={RoutePath.adminRegister} component={adminRegister} />
    <Route path={RoutePath.meal} component={customerDashborad} />
    <Route path={RoutePath.adminDashboard} component={adminDashboard} />
    <Route path={RoutePath.addMeal} component={addMeal} />
    <Route path={RoutePath.updateMeal} component={updateMeal} />
  </Switch>
);
