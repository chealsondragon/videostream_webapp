import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { TextField } from "@material-ui/core";
import clsx from "clsx";
import * as auth from "../../store/ducks/auth.duck";
import { login } from "../../crud/auth.crud";
import URL from "../../helpers/url";

function Login(props) {
  const { intl } = props;
  const [loading, setLoading] = useState(false);
  const [loadingButtonStyle, setLoadingButtonStyle] = useState({
    paddingRight: "0.5rem"
  });

  const enableLoading = () => {
    setLoading(true);
    setLoadingButtonStyle({ paddingRight: "1.5rem" });
  };

  const disableLoading = () => {
    setLoading(false);
    setLoadingButtonStyle({ paddingRight: "0.5rem" });
  };

  return (
    <>
      <Formik
        initialValues={{
          email: "admin@admin.com",
          password: "aaa"
        }}
        validate={values => {
          const errors = {};

          if (!values.email) {
            // https://github.com/formatjs/react-intl/blob/master/docs/API.md#injection-api
            errors.email = intl.formatMessage({
              id: "AUTH.VALIDATION.REQUIRED_EMAIL"
            });
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = intl.formatMessage({
              id: "AUTH.VALIDATION.INVALID_FIELD"
            });
          }

          if (!values.password) {
            errors.password = intl.formatMessage({
              id: "AUTH.VALIDATION.REQUIRED_PASSWORD"
            });
          }

          return errors;
        }}
        onSubmit={(values, { setStatus, setSubmitting }) => {
          enableLoading();
          setTimeout(() => {
            login(values.email, values.password)
              .then(({ data : { access_token } }) => {
                console.log('login');
                disableLoading();
                setSubmitting(false);
                props.login(access_token);
              })
              .catch((error) => {
                const errorMsg = error.description || error.message || 'Unspecified error';
                console.log('login', errorMsg);

                disableLoading();
                setSubmitting(false);
                setStatus(
                  intl.formatMessage({
                    id: "AUTH.VALIDATION.INVALID_LOGIN"
                  })
                );
              });
          }, 1000);
        }}
      >
        {({
          values,
          status,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting
        }) => (
            <form
              noValidate={true}
              autoComplete="off"
              className="kt-form-auth"
              onSubmit={handleSubmit}
            >
              {status && (
                <div role="alert" className="alert alert-danger">
                  <div className="alert-text">{status}</div>
                </div>
              )}

              <div className="form-group auth-form-field">
                <TextField
                  type="email"
                  label="Email"
                  margin="normal"
                  className="kt-width-full"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  helperText={touched.email && errors.email}
                  error={Boolean(touched.email && errors.email)}
                />
              </div>

              <div className="form-group auth-form-field">
                <TextField
                  type="password"
                  margin="normal"
                  label="Password"
                  className="kt-width-full"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  helperText={touched.password && errors.password}
                  error={Boolean(touched.password && errors.password)}
                />
              </div>

              <div className="kt-login__forgot">
                <Link
                  to={URL.FORGOT_PASSWORD()}
                  className="kt-link kt-login__link-forgot"
                >
                  <FormattedMessage id="AUTH.GENERAL.FORGOT_BUTTON" />
                </Link>
              </div>

              <button
                id="kt_login_signin_submit"
                type="submit"
                disabled={isSubmitting}
                className={`btn btn-primary btn-elevate kt-login__btn-primary ${clsx(
                  {
                    "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light": loading
                  }
                )}`}
                style={loadingButtonStyle}
              >
                Sign In
                </button>

              <div className="kt-login__signup">
                <span className="kt-login__signup-label">
                  Not a member?
                  </span>
                <Link to={URL.REGISTER()} className="kt-link kt-login__signup-link">
                  Create account
                  </Link>
              </div>
            </form>
          )}
      </Formik>


    </>
  );
}

export default injectIntl(
  connect(
    null,
    auth.actions
  )(Login)
);
