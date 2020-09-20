import React from "react";
import { connect } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import {  TextField,  Button, Paper, Table, TableCell, TableBody, TableHead, TableRow, IconButton } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { injectIntl } from "react-intl";

import {  Portlet,  PortletBody,  PortletHeader } from "../../partials/content/Portlet";

import * as api from "../../crud/channel.crud"
import { actions } from "../../store/ducks/channel.duck";
import MySnackBar from "../../partials/MySnackBar";
import MyAlertDialog from "../../partials/MyAlertDialog";

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

function ChannelComp(props) {
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
        setValues(values => ({...values, success: "Loading channels success!"}));
        props.loadAll(result.data || []);
      })
      .catch((error) => {
        setValues(values => ({...values, error: "Error in loading channels!"}));
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
          setValues({...values, editingStatus: "", success: "Updating channel success!"})
        })
        .catch((error) => {
          setValues({...values, editingStatus: "", error: "Error in updating channel!"})
          props.setActionProgress(false);
        })
    }else{
      props.setActionProgress(true);
      api.create(row)
        .then((result) => {
          props.create(result.data)
          setValues({...values, editingStatus: "", success: "Creating channel success!"})
        })
        .catch((error) => {
          setValues({...values, editingStatus: "", error: "Error in creating channel!"})
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
      confirmMessage: "Do you want to delete selected channel?",
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
        setValues({...values, confirmOpen:false, success: "Deleting channel success!"})
      })
      .catch((error) => {
        setValues({...values, confirmOpen:false, error: "Error in deleting channel!"})
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

  console.log(values.editingStatus, values.dataInline)

  return (
    <>
      <Portlet>
        <PortletHeader title="Manage Channels">
        </PortletHeader>
        <PortletBody>
          <div className="mb-2">
            <Button variant="contained" color="primary" onClick={() => onEditItem(null)}>
              <AddIcon /> Add Channel
            </Button>
            {!!props.channel.isSaving && <CircularProgress size={20} thickness={5} className="ml-2"/>}
          </div>
          {!!props.channel.isLoading && <CircularProgress className={classes.progress} />}
          {!props.channel.isLoading && <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Media</TableCell>
                  <TableCell>Channel</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.channel.list.map((row, index) => (
                  <TableRow key={`data-${row.id}`}>
                    <TableCell component="th" scope="row">
                      {row.media}
                    </TableCell>
                    <TableCell>{row.channel}</TableCell>
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
        onClose={()=>setValues({...values, snackOpen: false})}
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
          <DialogTitle id="alert-dialog-title">{values.editingStatus} Channel</DialogTitle>
          <DialogContent>
            <div className="row row-full-height ml-1 mt-0">
              <TextField
                key="cur-pass"
                label="Media"
                value={(values.dataInline && values.dataInline.media) || ""}
                onChange={handleChange("media")}
                margin="normal"
              />
              <br />
              <TextField
                key="new-pass"
                label="Channel"
                value={(values.dataInline && values.dataInline.channel) || ""}
                onChange={handleChange("channel")}
                margin="normal"
              />
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
    ({ channel }) => ({ channel }),
    actions
  )(ChannelComp)
);