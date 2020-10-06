import React from "react";
import { connect } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import {  TextField,  Button, Paper, Table, TableCell, TableBody, TableHead, TableRow, IconButton } from "@material-ui/core";
import Chip from '@material-ui/core/Chip';

import URL from "../../../helpers/url";

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
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
}));

function MyComp(props) {
  const classes = useStyles();
  
  const [values, setValues] = React.useState({
    dataInline: null,

    editingStatus: "", // "" | "ADD" | "EDIT"
    searchName: "",

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
        setValues({...values, confirmOpen:false, success: "Deleting video success!", dataInline: null})
      })
      .catch((error) => {
        setValues({...values, confirmOpen:false, error: "Error in deleting video!", dataInline: null})
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
    setValues({ ...values, dataInline: { ...values.dataInline, [name]: event.target.value }});
  };

  const onSearchNameChange = evt => {
    evt.persist()
    setValues(values => ({...values, searchName: evt.target.value}));
  }
  const onSearchName = evt => {
    evt.persist()
    if(evt.keyCode === 13){
      props.setLoading(true);
      api.loadAll(values.searchName)
        .then((result) => {
          props.loadAll(result.data || []);
        })
        .catch((error) => {
          props.setLoading(false);
        })
    }
  }

  return (
    <>
      <Portlet>
        <PortletHeader title="Manage Videos">
          <TextField
              key="search-name"
              label="Search Title... (Press enter to go search)"
              value={values.searchName}
              onChange={onSearchNameChange}
              onKeyDown={onSearchName}
              margin="normal"
              className="w-25 pull-right"
            />
        </PortletHeader>
        <PortletBody>
          <div className="mb-2">
            <Link to={URL.EDIT_VIDEO({id: "new"})}>
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
                  <TableCell>No</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell style={{ minWidth: 150 }}>Serie Type</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell style={{ minWidth: 120 }}>Watch Under<br/>(At least 1 Required)</TableCell>
                  <TableCell>Activate/Deactivate At</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.videos.list.map((row, index) => (
                  <TableRow key={`data-${row.id}`}>
                    <TableCell component="th" scope="row">{index+1}</TableCell>
                    <TableCell component="th" scope="row">{row.title}</TableCell>
                    <TableCell>
                      {row.serie_type &&
                        <span className="text-primary">
                          {row.serie_type.name}<br/>
                          <span className="text-success">
                            {row.serie_type.depth > 0 && row.serie_type.name_depth1}
                            {row.serie_type.depth > 1 && " > " + row.serie_type.name_depth2}
                            {row.serie_type.depth > 2 && " > " + row.serie_type.name_depth3}
                            {row.serie_type.depth > 3 && " > " + row.serie_type.name_depth4}
                            {row.serie_type.depth > 4 && " > " + row.serie_type.name_depth5}
                          </span>
                        </span>
                      }<br/>
                    </TableCell>
                    <TableCell>
                      <div className={classes.chips}>
                        {row && row.categories && row.categories.map(entry => (
                          entry.category && <Chip key={entry.category_id} label={entry.category.name || ""} className={classes.chip} />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>
                      <span className="text-success">Pay per hr: </span>{row.price_per_hour || 0}$<br/>
                      <span className="text-success">Pay total: </span>{row.price_to_buy || 0}$<br/>
                      <span className="text-success">Plan: </span>{row.condition_plan && row.condition_plan.name}
                    </TableCell>
                    <TableCell>{row.activate_at || "Not Defined"}/{row.deactivate_at || "Not Defined"}</TableCell>
                    <TableCell className="p-0">
                      <Link to={URL.EDIT_VIDEO({id: row.id})}>
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