import React from "react";
import { connect } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import {  TextField,  Button } from "@material-ui/core";
import CircularProgress from '@material-ui/core/CircularProgress';
import { injectIntl } from "react-intl";

import {  Portlet,  PortletBody,  PortletHeader } from "../../partials/content/Portlet";

import { changeProfile } from "../../crud/auth.crud"
import * as auth from "../../store/ducks/auth.duck";

const useStyles = makeStyles(theme => ({
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));


function Profile(props) {
  const classes = useStyles();
  
  const [values, setValues] = React.useState({
    firstname: props.user.firstname,
    lastname: props.user.lastname,
    email: props.user.email,

    address_line1: props.user.address_line1 || "",
    address_line2: props.user.address_line2 || "",
    vat_number: props.user.vat_number || "",

    isSaving: false,
    error: "",
    success: ""
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSubmit = event => {
    event.preventDefault();

    setValues({ ...values, isSaving: true, success: '', error: '' });
    changeProfile(values, 
      (msg) => {
        setValues({ ...values, isSaving: false, success: msg, error: '' })
        props.requestUser();
      },
      (msg) => {
        setValues({ ...values, isSaving: false, success: '', error: msg })
      }
    );
  };

  return (
    <>
      <Portlet>
        <PortletHeader title="Update Profile">
        </PortletHeader>
        <PortletBody>
          <div className="row row-full-height ml-3">
            <form noValidate autoComplete="off" className="w-50">
              {values.error && (
                <div role="alert" className="alert alert-danger">
                  <div className="alert-text">{values.error}</div>
                </div>
              )}
              {values.success && (
                <div role="alert" className="alert alert-success">
                  <div className="alert-text">{values.success}</div>
                </div>
              )}
              <TextField
                key="firstname"
                label="First Name"
                value={values.firstname}
                onChange={handleChange("firstname")}
                margin="normal"
              />
              <br />
              <TextField
                key="lastname"
                label="Last Name"
                value={values.lastname}
                onChange={handleChange("lastname")}
                margin="normal"
              />
              <br />
              <TextField
                key="email"
                label="Email"
                value={values.email}
                onChange={handleChange("email")}
                margin="normal"
              />
              <br />
              <TextField
                key="address_line1"
                label="Address Line1"
                value={values.address_line1}
                onChange={handleChange("address_line1")}
                margin="normal"
              />
              <br />
              <TextField
                key="address_line2"
                label="Address Line2"
                value={values.address_line2}
                onChange={handleChange("address_line2")}
                margin="normal"
              />
              <br />
              <TextField
                key="vat_number"
                label="Vat Number"
                value={values.vat_number}
                onChange={handleChange("vat_number")}
                margin="normal"
              />
              <br />
              <div className="mt-2">
                <Button variant="contained"
                    color="primary"
                    onClick={handleSubmit} 
                    disabled={values.isSaving}
                    type="submit">
                  Submit
                  {values.isSaving && <CircularProgress size={24} className={classes.buttonProgress} />}
                </Button>            
              </div>
            </form>
          </div>
        </PortletBody>
      </Portlet>
    </>
  );
}

export default injectIntl(
  connect(
    ({ auth: { user } }) => ({ user }),
    auth.actions
  )(Profile)
);