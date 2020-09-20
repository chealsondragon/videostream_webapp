import React, { useEffect } from "react";
import { Link, Redirect, Route, Switch } from "react-router-dom";
import Registration from "./Registration";
import ForgotPassword from "./ForgotPassword";
import Login from "./Login";
import { Helmet } from "react-helmet";
import "../../../_metronic/_assets/sass/pages/login/login-1.scss";


export default function AuthPage() {
  useEffect(() => {
    // window.easy_background("#authpage",
    //   { slide: images, delay: [10000, 10000, 10000] }, []);
  });

  return (
    <>
      {/* https://github.com/nfl/react-helmet */}
      <Helmet>
        {/* <link
            type="text/css"
            rel="stylesheet"
            href={toAbsoluteUrl(
                "/assets/css/demo1/style.bundle.css"
            )}
        />
        <link
          type="text/css"
          rel="stylesheet"
          href={toAbsoluteUrl(
            "/assets/css/demo1/pages/login/login-1.css"
          )}
        /> */}
      </Helmet>

      <div className="kt-grid kt-grid--ver kt-grid--root" id="authpage">
        <div
          id="kt_login"
          className="kt-grid kt-grid--hor kt-grid--root kt-login kt-login--v1"
          style={{ alignItems:"center" }}
        >
          <div className="auth-panel">
            <div className="kt-grid__item">
              <Link to="/" className="kt-auth__logo">
                <h1>
                  Influencer IDC
                </h1>
                {/* <img
                  alt="Logo"
                  src={toAbsoluteUrl("/media/logos/logo-black-sm.png")}
                /> */}
              </Link>
            </div>

            <Switch>
              <Route path="/auth/login" component={Login} />
              <Route path="/auth/registration" component={Registration} />
              <Route
                path="/auth/forgot-password"
                component={ForgotPassword}
              />

              <Redirect from="/auth" exact={true} to="/auth/login" />
            </Switch>

            <div className="kt-auth__footer">
              <a href="https://www.soarinenergy.com/terms-of-service/" className="kt-link-auth">
                Terms of Service
              </a>
              <a href="https://www.soarinenergy.com/privacy-policy-2/" className="kt-link-auth">
                Privacy policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
