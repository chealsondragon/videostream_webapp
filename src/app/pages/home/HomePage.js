import React, { Suspense, lazy } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import Builder from "./Builder";
import Dashboard from "./Dashboard";
import DocsPage from "./docs/DocsPage";
import ChangePassword from "./ChangePassword";

import Profile from "./Profile";
import Channels from "./Channels";
import Links from "./Links";
import Report from "./Report";

import { LayoutSplashScreen } from "../../../_metronic";

const GoogleMaterialPage = lazy(() =>
  import("./google-material/GoogleMaterialPage")
);
const ReactBootstrapPage = lazy(() =>
  import("./react-bootstrap/ReactBootstrapPage")
);

export default function HomePage() {
  // useEffect(() => {
  //   console.log('Home page');
  // }, []) // [] - is required if you need only one call
  // https://reactjs.org/docs/hooks-reference.html#useeffect

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from root URL to /dashboard. */
          <Redirect exact from="/" to="/report" />
        }
        <Route path="/builder" component={Builder} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/change-password" component={ChangePassword} />
        <Route path="/google-material" component={GoogleMaterialPage} />
        <Route path="/react-bootstrap" component={ReactBootstrapPage} />
        <Route path="/docs" component={DocsPage} />
        
        <Route path="/profile" component={Profile} />
        <Route path="/channels" component={Channels} />
        <Route path="/links" component={Links} />
        <Route path="/report" component={Report} />

        <Redirect to="/error/error-v1" />
      </Switch>
    </Suspense>
  );
}
