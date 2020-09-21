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

import * as api from "../../crud/categories.crud"
import { actions } from "../../store/ducks/categories.duck";
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

function CategoryComp(props) {
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
        setValues(values => ({...values, success: "Loading categories success!"}));
        props.loadAll(result.data || []);
      })
      .catch((error) => {
        setValues(values => ({...values, error: "Error in loading categories!"}));
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
          setValues({...values, editingStatus: "", success: "Updating category success!"})
        })
        .catch((error) => {
          setValues({...values, editingStatus: "", error: "Error in updating category!"})
          props.setActionProgress(false);
        })
    }else{
      props.setActionProgress(true);
      api.create(row)
        .then((result) => {
          props.create(result.data)
          setValues({...values, editingStatus: "", success: "Creating category success!"})
        })
        .catch((error) => {
          setValues({...values, editingStatus: "", error: "Error in creating category!"})
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
      confirmMessage: "Do you want to delete selected category?",
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
        setValues({...values, confirmOpen:false, success: "Deleting category success!"})
      })
      .catch((error) => {
        setValues({...values, confirmOpen:false, error: "Error in deleting category!"})
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

  return (
    <>
      <Portlet>
        <PortletHeader title="Manage Categories">
        </PortletHeader>
        <PortletBody>
          <div className="mb-2">
            <Button variant="contained" color="primary" onClick={() => onEditItem(null)}>
              <AddIcon /> Add Category
            </Button>
            {!!props.categories.isSaving && <CircularProgress size={20} thickness={5} className="ml-2"/>}
          </div>
          {!!props.categories.isLoading && <CircularProgress className={classes.progress} />}
          {!props.categories.isLoading && <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.categories.list.map((row, index) => (
                  <TableRow key={`data-${row.id}`}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell>{row.description}</TableCell>
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
          <DialogTitle id="alert-dialog-title">{values.editingStatus} category</DialogTitle>
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
    ({ categories }) => ({ categories }),
    actions
  )(CategoryComp)
);