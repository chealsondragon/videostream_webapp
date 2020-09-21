import React, { Suspense, lazy } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import Builder from "./Builder";
import Dashboard from "./Dashboard";
import DocsPage from "./docs/DocsPage";
import ChangePassword from "./ChangePassword";

import Profile from "./Profile";
import Channels from "./Channels";
import Report from "./Report";

import Users from "./Users";
import Category from "./Category";

import Videos from './video/Index';
import VideoFiles from './video/Files';

import ReportVideo from "./report/Video";
import ReportUser from "./report/User";
import ReportPayment from "./report/Payment";

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
          <Redirect exact from="/" to="/stats_video" />
        }
        <Route path="/builder" component={Builder} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/change-password" component={ChangePassword} />
        <Route path="/google-material" component={GoogleMaterialPage} />
        <Route path="/react-bootstrap" component={ReactBootstrapPage} />
        <Route path="/docs" component={DocsPage} />
        
        <Route path="/profile" component={Profile} />
        {/* <Route path="/channels" component={Channels} />
        <Route path="/links" component={Links} /> */}
        <Route path="/report" component={Report} />

        <Route path="/users" component={Users} />
        <Route path="/categories" component={Category} />
        
        <Route path="/videos" component={Videos} />
        <Route path="/edit_video/:id" component={VideoFiles} />

        <Route path="/stats_video" component={ReportVideo} />
        <Route path="/stats_user" component={ReportUser} />
        <Route path="/payment" component={ReportPayment} />

        <Redirect to="/error/error-v1" />
      </Switch>
    </Suspense>
  );
}
