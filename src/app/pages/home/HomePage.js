import React, { Suspense, lazy } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import URL from "../../helpers/url";

import Builder from "./Builder";
import Dashboard from "./Dashboard";
import DocsPage from "./docs/DocsPage";

import ChangePassword from "./ChangePassword";
import Profile from "./Profile";
import ProfileType from "./ProfileType";
import Users from "./Users";

import Lang from "./Lang";
import Plan from "./Plan";
import SerieType from "./SerieType";
import Category from "./Category";

import Video from './video/Index';
import EditVideo from './video/Edit';

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
          <Redirect exact from="/" to={URL.STATS_VIDEO()} />
        }
        <Route path={URL.BUILDER()} component={Builder} />
        <Route path={URL.DASHBOARD()} component={Dashboard} />
        <Route path={URL.GOOGLE_MATERIAL()} component={GoogleMaterialPage} />
        <Route path={URL.REACT_BOOTSTRAP()} component={ReactBootstrapPage} />
        <Route path={URL.DOCS()} component={DocsPage} />
        
        <Route path={URL.CHANGE_PASSWORD()} component={ChangePassword} />
        <Route path={URL.PROFILE()} component={Profile} />
        <Route path={URL.PROFILE_TYPE()} component={ProfileType} />
        <Route path={URL.USERS()} component={Users} />

        <Route path={URL.PLAN()} component={Plan} />
        <Route path={URL.LANG()} component={Lang} />
        <Route path={URL.SERIE_TYPE()} component={SerieType} />
        <Route path={URL.CATEGORY()} component={Category} />
        
        <Route path={URL.LIST_VIDEO()} component={Video} />
        <Route path={URL.EDIT_VIDEO()} component={EditVideo} />

        <Route path={URL.STATS_VIDEO()} component={ReportVideo} />
        <Route path={URL.STATS_USER()} component={ReportUser} />
        <Route path={URL.STATS_PAYMENT()} component={ReportPayment} />

        <Redirect to={URL.NOTFOUND()} />
      </Switch>
    </Suspense>
  );
}
