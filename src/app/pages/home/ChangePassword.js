import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import {  TextField,  Button } from "@material-ui/core";
import CircularProgress from '@material-ui/core/CircularProgress';

import {  Portlet,  PortletBody,  PortletHeader } from "../../partials/content/Portlet";

import { changePassword } from "../../crud/auth.crud"

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


export default function Profile() {
  const classes = useStyles();
  
  const [values, setValues] = React.useState({
    curPass: "",
    newPass: "",
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
    changePassword(values.curPass, values.newPass, 
      (msg) => {
        console.log('changePassword success');
        setValues({ ...values, isSaving: false, success: msg, error: '' })
      },
      (msg) => {
        setValues({ ...values, isSaving: false, success: '', error: msg })
      }
    );
  };

  return (
    <>
      <Portlet>
        <PortletHeader title="Change Password">
        </PortletHeader>
        <PortletBody>
          <div className="row row-full-height ml-3">
            <form noValidate autoComplete="off">
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
                key="cur-pass"
                label="Current Password"
                value={values.curPass}
                onChange={handleChange("curPass")}
                margin="normal"
                type="password"
                autoComplete="current-password"
              />
              <br />
              <TextField
                key="new-pass"
                label="New Password"
                value={values.newPass}
                onChange={handleChange("newPass")}
                margin="normal"
                type="password"
                autoComplete="new-password"
              />
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
