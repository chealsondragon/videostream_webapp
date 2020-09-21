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

import {  Portlet,  PortletBody,  PortletHeader } from "../../../partials/content/Portlet";

import * as api from "../../../crud/videos.crud"
import { actions } from "../../../store/ducks/videos.duck";
import MySnackBar from "../../../partials/MySnackBar";
import MyAlertDialog from "../../../partials/MyAlertDialog";
import { Link } from "react-router-dom";

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

function MyComp(props) {
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
        setValues(values => ({...values, success: "Loading videos success!"}));
        props.loadAll(result.data || []);
      })
      .catch((error) => {
        setValues(values => ({...values, error: "Error in loading videos!"}));
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
          setValues({...values, editingStatus: "", success: "Updating video success!"})
        })
        .catch((error) => {
          setValues({...values, editingStatus: "", error: "Error in updating video!"})
          props.setActionProgress(false);
        })
    }else{
      props.setActionProgress(true);
      api.create(row)
        .then((result) => {
          props.create(result.data)
          setValues({...values, editingStatus: "", success: "Creating video success!"})
        })
        .catch((error) => {
          setValues({...values, editingStatus: "", error: "Error in creating video!"})
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
      confirmMessage: "Do you want to delete selected video and all its files?",
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
        setValues({...values, confirmOpen:false, success: "Deleting video success!"})
      })
      .catch((error) => {
        setValues({...values, confirmOpen:false, error: "Error in deleting video!"})
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

  const typeString = ["", "Free", "Pay to Watch", "Basic Subscription", "Premium Subscription"];

  return (
    <>
      <Portlet>
        <PortletHeader title="Manage Videos">
        </PortletHeader>
        <PortletBody>
          <div className="mb-2">
            <Link to={`/edit_video/new`}>
              <Button variant="contained" color="primary" onClick={() => onEditItem(null)}>
                <AddIcon /> Add video
              </Button>
            </Link>
            {!!props.videos.isSaving && <CircularProgress size={20} thickness={5} className="ml-2"/>}
          </div>
          {!!props.videos.isLoading && <CircularProgress className={classes.progress} />}
          {!props.videos.isLoading && <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Serie/Single</TableCell>
                  <TableCell>Files Uploaded</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.videos.list.map((row, index) => (
                  <TableRow key={`data-${row.id}`}>
                    <TableCell component="th" scope="row">{row.title}</TableCell>
                    <TableCell>{row.category && row.category.name}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{row.is_series ? "Serie" : "Single"}</TableCell>
                    <TableCell>{(row.files && row.files.length) || 0}</TableCell>
                    <TableCell>{row.type === 2 ? (typeString[row.type]+`(€${row.price||0})`) : (typeString[row.type] || "Default")}</TableCell>
                    <TableCell className="p-0">
                      <Link to={`/edit_video/${row.id}`}>
                        <IconButton aria-label="Edit">
                          <EditIcon />
                        </IconButton>
                      </Link>
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
          <DialogTitle id="alert-dialog-title">{values.editingStatus} video</DialogTitle>
          <DialogContent>
            <div className="row row-full-height ml-1 mt-0">
              <TextField
                key="name"
                label="Name"
                value={(values.dataInline && values.dataInline.name) || ""}
                onChange={handleChange("name")}
                margin="normal"
              />
              <br />
              <TextField
                key="description"
                label="Description"
                value={(values.dataInline && values.dataInline.description) || ""}
                onChange={handleChange("description")}
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
    ({ videos }) => ({ videos }),
    actions
  )(MyComp)
);