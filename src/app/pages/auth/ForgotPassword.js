import React, { Component } from "react";
import { Formik } from "formik";
import { connect } from "react-redux";
import { TextField } from "@material-ui/core";
import { Link, Redirect } from "react-router-dom";
import { FormattedMessage, injectIntl } from "react-intl";
import * as auth from "../../store/ducks/auth.duck";
import { forgotPassword } from "../../core/auth";
import URL from "../../helpers/url";

class ForgotPassword extends Component {
  state = { isRequested: false };

  render() {
    const { intl } = this.props;
    const { isRequested } = this.state;

    if (isRequested) {
      return <Redirect to={URL.AUTH()} />;
    }

    return (
      <Formik
        initialValues={{ email: "" }}
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

          return errors;
        }}
        onSubmit={(values, { setStatus, setSubmitting }) => {
          forgotPassword(values.email,
            () => {
              this.setState({ isRequested: true });
            }, () => {
              setSubmitting(false);
              setStatus(
                intl.formatMessage(
                  { id: "AUTH.VALIDATION.NOT_FOUND" },
                  { name: values.email }
                )
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
            <form onSubmit={handleSubmit} className="kt-form-auth">
              <p className="auth-form-header">
                <FormattedMessage id="AUTH.FORGOT.TITLE" />
              </p>

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
                  fullWidth={true}
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  helperText={touched.email && errors.email}
                  error={Boolean(touched.email && errors.email)}
                />
              </div>

              <div className="kt-login__actions">
                <button
                  type="submit"
                  className="btn btn-primary btn-elevate kt-login__btn-primary auth__btn-compact"
                  disabled={isSubmitting}
                >
                  Reset password
                    </button>

                <Link
                  to={URL.AUTH()}
                  className="btn btn-secondary btn-elevate kt-login__btn-secondary"
                >
                  Back
                    </Link>
              </div>
            </form>
          )}
      </Formik>
    );
  }
}

export default injectIntl(
  connect(
    null,
    auth.actions
  )(ForgotPassword)
);
