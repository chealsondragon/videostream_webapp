import React from "react";
import { Formik } from "formik";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FormattedMessage, injectIntl } from "react-intl";
import { Checkbox, FormControlLabel, TextField } from "@material-ui/core";
import * as auth from "../../store/ducks/auth.duck";
import { register } from "../../crud/auth.crud";

function Registration(props) {
  const { intl } = props;

  return (
    <Formik
      initialValues={{
        email: "",
        firstname: "",
        lastname: "",
        password: "",
        user_id: "",
        acceptTerms: true,
        newsletter: true,
      }}
      validate={values => {
        const errors = {};

        if (!values.email) {
          errors.email = intl.formatMessage({
            id: "AUTH.VALIDATION.REQUIRED_FIELD"
          });
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
        ) {
          errors.email = intl.formatMessage({
            id: "AUTH.VALIDATION.INVALID_FIELD"
          });
        }

        if (!values.firstname) {
          errors.firstname = intl.formatMessage({
            id: "AUTH.VALIDATION.REQUIRED_FIELD"
          });
        }

        if (!values.lastname) {
          errors.lastname = intl.formatMessage({
            id: "AUTH.VALIDATION.REQUIRED_FIELD"
          });
        }

        if (!values.lastname) {
          errors.user_id = intl.formatMessage({
            id: "AUTH.VALIDATION.REQUIRED_FIELD"
          });
        }

        if (!values.password) {
          errors.password = intl.formatMessage({
            id: "AUTH.VALIDATION.REQUIRED_FIELD"
          });
        }

        if (!values.acceptTerms) {
          errors.acceptTerms = "Accept Terms";
        }

        return errors;
      }}
      onSubmit={(values, { setStatus, setSubmitting }) => {
        register(
          values.user_id,
          values.email,
          values.firstname,
          values.lastname,
          values.password,
          )
          .then(({ data: { accessToken } }) => {
            props.history.push('/auth/login');
            // props.register(accessToken);
          })
          .catch(() => {
            setSubmitting(false);
            setStatus(
              intl.formatMessage({
                id: "AUTH.VALIDATION.INVALID_LOGIN"
              })
            );
          });
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
          <form onSubmit={handleSubmit} noValidate autoComplete="off" className="kt-form-auth">
            <p className="auth-form-header">
              <FormattedMessage id="AUTH.REGISTER.TITLE" />
            </p>

            {status && (
              <div role="alert" className="alert alert-danger">
                <div className="alert-text">{status}</div>
              </div>
            )}

            <div className="form-group mb-0  auth-form-field-compact">
              <TextField
                margin="dense"
                label="User ID"
                className="kt-width-full"
                name="user_id"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.user_id}
                helperText={touched.user_id && errors.user_id}
                error={Boolean(touched.user_id && errors.user_id)}
              />
            </div>

            <div className="form-group mb-0  auth-form-field-compact">
              <TextField
                margin="dense"
                label="First Name"
                className="kt-width-full"
                name="firstname"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstname}
                helperText={touched.firstname && errors.firstname}
                error={Boolean(touched.firstname && errors.firstname)}
              />
            </div>

            <div className="form-group mb-0  auth-form-field-compact">
              <TextField
                margin="dense"
                label="Last Name"
                className="kt-width-full"
                name="lastname"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastname}
                helperText={touched.lastname && errors.lastname}
                error={Boolean(touched.lastname && errors.lastname)}
              />
            </div>

            <div className="form-group mb-0  auth-form-field-compact">
              <TextField
                label="Email"
                margin="dense"
                className="kt-width-full"
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                helperText={touched.email && errors.email}
                error={Boolean(touched.email && errors.email)}
              />
            </div>

            <div className="form-group mb-0  auth-form-field-compact">
              <TextField
                type="password"
                margin="dense"
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

            <div className="form-group mb-0 kt-register__checks">
              <FormControlLabel
                label={
                  <div className="kt-register__checks-text">
                    Agree to Privacy Policy & Terms of Service
                      <div>
                      By creating your account, you agree to the Soarin{" "}
                      <a
                        href="https://www.soarinenergy.com/terms-of-service/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Terms of Service
                        </a>{" "}and{" "}
                      <a href="https://www.soarinenergy.com/privacy-policy-2/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Privacy policy
                        </a>.
                      </div>
                  </div>
                }
                control={
                  <Checkbox
                    color="primary"
                    name="acceptTerms"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    checked={values.acceptTerms}
                  />
                }
              />
            </div>

            <div className="kt-login__actions">
              <button
                disabled={isSubmitting || !values.acceptTerms}
                className="btn btn-primary btn-elevate kt-login__btn-primary auth__btn-compact"
              >
                Register
                </button>

              <Link to="/auth">
                <button type="button" className="btn btn-secondary btn-elevate kt-login__btn-secondary">
                  Back
                  </button>
              </Link>
            </div>
          </form>
        )}
    </Formik>
  );
}

export default injectIntl(
  connect(
    null,
    auth.actions
  )(Registration)
);
