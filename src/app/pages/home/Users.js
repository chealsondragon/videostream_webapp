import React from "react";
import { connect } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import {  TextField,  Button, Paper, Table, TableCell, TableBody, TableHead, TableRow, IconButton, Select } from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { injectIntl } from "react-intl";

import {  Portlet,  PortletBody,  PortletHeader } from "../../partials/content/Portlet";

import * as api from "../../crud/users.crud"
import { actions } from "../../store/ducks/users.duck";
import MySnackBar from "../../partials/MySnackBar";
import MyAlertDialog from "../../partials/MyAlertDialog";

var moment = require('moment'); // require

const useStyles = makeStyles(theme => ({
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
}));

function UserComp(props) {
  const classes = useStyles();
  
  const [values, setValues] = React.useState({
    dataInline: null,

    editingStatus: "", // "" | "ADD" | "EDIT"

    error: "",
    success: "",

    snackOpen : false,
    snackType : "info",
    snackMessage: "",

    confirmOpen : false,
    confirmTitle : "",
    confirmMessage : ""
  });

  React.useEffect(() => {
    if(!!values.error)
      setValues(values => ({
        ...values,
        snackOpen: true, snackMessage: values.error, snackType: "error"
      }));
  }, [values.error]);
  React.useEffect(() => {
    if(!!values.success)
      setValues(values => ({
        ...values,
        snackOpen: true, snackMessage: values.success, snackType: "success"
      }));
  }, [values.success]);

  React.useEffect(() => {
    props.setLoading(true);
    api.loadAll()
      .then((result) => {
        setValues(values => ({...values, success: "Loading users success!"}));
        props.loadAll(result.data || []);
      })
      .catch((error) => {
        setValues(values => ({...values, error: "Error in loading users!"}));
        props.setLoading(false);
      })
  }, []);

  const onEditItem = row => {
    setValues({
      ...values,
      editingStatus: !!row ? "EDIT" : "ADD",
      dataInline: row
    });
  }

  const onEditSave = () => {
    const row = values.dataInline;
    setValues({
      ...values,
      editingStatus: "",
      dataInline: null
    });

    if(!row) return;

    if(!!row.id){
      props.setActionProgress(true);
      api.update(row.id, row)
        .then((result) => {
          props.update(result.data)
          setValues({...values, editingStatus: "", success: "Updating user success!"})
        })
        .catch((error) => {
          setValues({...values, editingStatus: "", error: "Error in updating user!"})
          props.setActionProgress(false);
        })
    }else{
      props.setActionProgress(true);
      api.create(row)
        .then((result) => {
          props.create(result.data)
          setValues({...values, editingStatus: "", success: "Creating user success!"})
        })
        .catch((error) => {
          setValues({...values, editingStatus: "", error: "Error in creating user!"})
          props.setActionProgress(false);
        })
    }
  }

  const onEditCancel = () => {
    setValues({
      ...values,
      editingStatus: "",
      dataInline: null
    });
  }

  const onDeleteItem = row => {
    if(!row)  return;

    setValues({
      ...values,
      confirmOpen: true,
      confirmTitle: "Confirm",
      confirmMessage: "Do you want to delete selected user?",
      dataInline: row
    });
  }

  const onAgreeDelete = () => {
    const row = values.dataInline;
    setValues({...values, confirmOpen:false, dataInline: null})

    if(!row)  return;

    props.setActionProgress(true);
    api.remove(row.id)
      .then((result) => {
        props.delete(row.id);
        setValues({...values, confirmOpen:false, success: "Deleting user success!"})
      })
      .catch((error) => {
        setValues({...values, confirmOpen:false, error: "Error in deleting user!"})
        props.setActionProgress(false);
      })
      .finally(() => {
        setValues({...values, confirmOpen:false, dataInline: null})
      })
  }

  const onDisAgreeDelete = () => {
    setValues({
      ...values,
      confirmOpen: false,
      confirmTitle: "",
      confirmMessage: "",
      dataInline: null
    });
  }

  const handleChange = name => event => {
    setValues({ ...values, dataInline: { ...values.dataInline, [name]: event.target.value }});
  };

  const formatUTCDateTime = (utc) => {
    return moment(utc).format("MM/DD/YYYY hh:mm:ss");
  }

  return (
    <>
      <Portlet>
        <PortletHeader title="Manage Users">
        </PortletHeader>
        <PortletBody>
          <div className="mb-2">
            {/* <Button variant="contained" color="primary" onClick={() => onEditItem(null)}>
              <AddIcon /> Add User
            </Button> */}
            {!!props.users.isSaving && <CircularProgress size={20} thickness={5} className="ml-2"/>}
          </div>
          {!!props.users.isLoading && <CircularProgress className={classes.progress} />}
          {!props.users.isLoading && <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Subscription</TableCell>
                  <TableCell>Last Watch</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.users.list.map((row, index) => (
                  <TableRow key={`data-${row.id}`}>
                    <TableCell component="th" scope="row">
                      {row.firstname} {row.lastname}
                    </TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.role && row.role.name}</TableCell>
                    <TableCell>{row.plan && row.plan.name}</TableCell>
                    <TableCell>{row.last_watching_state && formatUTCDateTime(row.last_watching_state.created_at)}</TableCell>
                    <TableCell className="p-0">
                      <IconButton aria-label="Edit" onClick={() => onEditItem(row)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton aria-label="Delete" onClick={() => onDeleteItem(row)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>}
        </PortletBody>
      </Portlet>
      <MySnackBar 
        open={values.snackOpen} 
        message={values.snackMessage} 
        onClose={()=>setValues({...values, snackOpen: false, error: "", success: ""})}
        variant={values.snackType}
        vertical="top"
        horizontal="right"
      />
      <MyAlertDialog
        open={values.confirmOpen}
        handleOK={onAgreeDelete}
        handleCancel={onDisAgreeDelete}
        message={values.confirmMessage}
        title={values.confirmTitle}
      />
      <div>
        <Dialog
          open={values.editingStatus !== ""}
          onClose={onEditCancel}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{values.editingStatus} user</DialogTitle>
          <DialogContent>
            <div className="row row-full-height ml-1 mt-0">
              <TextField
                key="first-name"
                label="First Name"
                value={(values.dataInline && values.dataInline.firstname) || ""}
                onChange={handleChange("firstname")}
                margin="normal"
              />
              <br />
              <TextField
                key="last-name"
                label="Last Name"
                value={(values.dataInline && values.dataInline.lastname) || ""}
                onChange={handleChange("lastname")}
                margin="normal"
              />
              <TextField
                key="email"
                label="Email"
                type="email"
                value={(values.dataInline && values.dataInline.email) || ""}
                onChange={handleChange("email")}
                margin="normal"
              />
              <Select
                className="mt-3"
                label="Role"
                value={values.dataInline && values.dataInline.role_id}
                onChange={handleChange("role_id")}
              >
                <MenuItem key={1} value={1}>Admin</MenuItem>
                <MenuItem key={2} value={2}>Content</MenuItem>
                <MenuItem key={3} value={3}>User</MenuItem>
              </Select>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={onEditSave} color="primary">
              OK
            </Button>
            <Button onClick={onEditCancel} color="primary" autoFocus>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>

  );
}

export default injectIntl(
  connect(
    ({ users }) => ({ users }),
    actions
  )(UserComp)
);