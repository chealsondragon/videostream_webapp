import React from "react";
import { connect } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import {  TextField,  Button, Paper, Table, TableCell, TableBody, TableHead, TableRow, IconButton } from "@material-ui/core";

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';

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

import { loadAll as loadAllCategories } from '../../crud/categories.crud'
import { actions as actions_categories } from "../../store/ducks/categories.duck";

import * as api from "../../crud/serie_type.crud"
import { actions } from "../../store/ducks/serie_type.duck";
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

  formControl: {
    minWidth: 120,
    maxWidth: 500,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

function SerieTypeComp(props) {
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
    loadAllCategories()
      .then((result) => {
        console.log("Loading categories success!")
        props.loadAllCategories(result.data || []);
      })
      .catch((error) => {
        console.log("Loading categories fail!")
      })

    props.setLoading(true);
    api.loadAll()
      .then((result) => {
        setValues(values => ({...values, success: "Loading serie_types success!"}));
        props.loadAll(result.data || []);
      })
      .catch((error) => {
        setValues(values => ({...values, error: "Error in loading serie_types!"}));
        props.setLoading(false);
      })
  }, []);

  const categoryNames = React.useMemo(() => {
    var names = {};
    props.categories.list.map(cat => {
      names[cat.id] = cat.name;
    });
    return names;
  }, [props.categories]);

  const onEditItem = row => {
    setValues({
      ...values,
      editingStatus: !!row ? "EDIT" : "ADD",
      dataInline: row,
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
          setValues({...values, editingStatus: "", success: "Updating serie_type success!"})
        })
        .catch((error) => {
          setValues({...values, editingStatus: "", error: "Error in updating serie_type!"})
          props.setActionProgress(false);
        })
    }else{
      props.setActionProgress(true);
      api.create(row)
        .then((result) => {
          props.create(result.data)
          setValues({...values, editingStatus: "", success: "Creating serie_type success!"})
        })
        .catch((error) => {
          setValues({...values, editingStatus: "", error: "Error in creating serie_type!"})
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
      confirmMessage: "Do you want to delete selected serie_type?",
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
        setValues({...values, confirmOpen:false, success: "Deleting serie_type success!", dataInline: null})
      })
      .catch((error) => {
        setValues({...values, confirmOpen:false, error: "Error in deleting serie_type!", dataInline: null})
        props.setActionProgress(false);
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
    var val = event.target.value;
    if(name === "depth"){
      val = Math.min(5, Math.max(0, val));
    }
    setValues({ ...values, dataInline: { ...values.dataInline, [name]: val }});
  };

  return (
    <>
      <Portlet>
        <PortletHeader title="Manage Serie Types">
        </PortletHeader>
        <PortletBody>
          <div className="mb-2">
            <Button variant="contained" color="primary" onClick={() => onEditItem(null)}>
              <AddIcon /> Add Serie Type
            </Button>
            {!!props.serie_type.isSaving && <CircularProgress size={20} thickness={5} className="ml-2"/>}
          </div>
          {!!props.serie_type.isLoading && <CircularProgress className={classes.progress} />}
          {!props.serie_type.isLoading && <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Clip Order</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.serie_type.list.map((row, index) => (
                  <TableRow key={`data-${row.id}`}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell>{row.description || ""}</TableCell>
                    <TableCell>
                      {row.depth > 0 && row.name_depth1}
                      {row.depth > 1 && " > " + row.name_depth2}
                      {row.depth > 2 && " > " + row.name_depth3}
                      {row.depth > 3 && " > " + row.name_depth4}
                      {row.depth > 4 && " > " + row.name_depth5}
                    </TableCell>
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
          <DialogTitle id="alert-dialog-title">{values.editingStatus} Serie Type</DialogTitle>
          <DialogContent>
            <div className="row row-full-height ml-1 mt-0">
              <TextField
                key="cur-name"
                label="Name"
                value={(values.dataInline && values.dataInline.name) || ""}
                onChange={handleChange("name")}
                margin="normal"
              />
              <br />
              <TextField
                key="cur-description"
                label="Description"
                value={(values.dataInline && values.dataInline.description) || ""}
                onChange={handleChange("description")}
                margin="normal"
              />
              <br />
              <TextField
                key="depth"
                type="number"
                label="Depth"
                value={(values.dataInline && values.dataInline.depth) || 0}
                onChange={handleChange("depth")}
                margin="normal"
              />
              <br />
              {((values.dataInline && parseInt(values.dataInline.depth)) || 0) > 0 && 
              <>
                <TextField
                  key="name-depth1"
                  label="Name Depth1"
                  value={(values.dataInline && values.dataInline.name_depth1) || ""}
                  onChange={handleChange("name_depth1")}
                  margin="normal"
                />
                <br />
              </>}
              {((values.dataInline && parseInt(values.dataInline.depth)) || 0) > 1 && 
              <>
                <TextField
                  key="name-depth2"
                  label="Name Depth2"
                  value={(values.dataInline && values.dataInline.name_depth2) || ""}
                  onChange={handleChange("name_depth2")}
                  margin="normal"
                />
                <br />
              </>}
              {((values.dataInline && parseInt(values.dataInline.depth)) || 0) > 2 && 
              <>
                <TextField
                  key="name-depth3"
                  label="Name Depth3"
                  value={(values.dataInline && values.dataInline.name_depth3) || ""}
                  onChange={handleChange("name_depth3")}
                  margin="normal"
                />
                <br />
              </>}
              {((values.dataInline && parseInt(values.dataInline.depth)) || 0) > 3 && 
              <>
                <TextField
                  key="name-depth4"
                  label="Name Depth4"
                  value={(values.dataInline && values.dataInline.name_depth4) || ""}
                  onChange={handleChange("name_depth4")}
                  margin="normal"
                />
                <br />
              </>}
              {((values.dataInline && parseInt(values.dataInline.depth)) || 0) > 4 && 
              <>
                <TextField
                  key="name-depth5"
                  label="Name Depth5"
                  value={(values.dataInline && values.dataInline.name_depth5) || ""}
                  onChange={handleChange("name_depth5")}
                  margin="normal"
                />
                <br />
              </>}
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
    ({ categories, serie_type }) => ({ categories, serie_type }),
    {
      ...actions,
      loadAllCategories: actions_categories.loadAll,
    }
  )(SerieTypeComp)
);