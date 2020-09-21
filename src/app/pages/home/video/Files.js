import React from "react";
import { connect } from "react-redux";
import { Player } from 'video-react';
import * as _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import {  TextField,  Button, IconButton, FormControl, InputLabel, Select, FormControlLabel, LinearProgress } from "@material-ui/core";
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import DeleteIcon from '@material-ui/icons/Delete';

import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { injectIntl } from "react-intl";

import {  Portlet,  PortletBody,  PortletHeader } from "../../../partials/content/Portlet";

import * as api from "../../../crud/videos.crud"
import { actions } from "../../../store/ducks/video-files.duck";
import { loadAll as loadAllCategories } from "../../../crud/categories.crud"
import { actions as actions_categories } from "../../../store/ducks/categories.duck";

import MySnackBar from "../../../partials/MySnackBar";
import MyAlertDialog from "../../../partials/MyAlertDialog";
import { Link } from "react-router-dom";
import { ArrowUpward, ChevronLeftSharp, SaveAlt } from "@material-ui/icons";

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
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
    minWidth: 300,
  },
  previewLogo: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  imgOverlay: {
    position: 'absolute',
    textAlign: 'right',
    left: 0,
    textColor: 'black',
    width: '100%',
    fontSize: '20px',
    fontWeight: '400',
    marginTop: theme.spacing(-1)
  },
  imgVideoFile: {
    padding: theme.spacing(2),
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    '-webkit-transition': 'all ease-out .3s',
    transition: 'all ease-out .3s',
    "&:hover": {
      padding: theme.spacing(1.5),
      cursor: "pointer",
    }
  },
}));

function MyComp(props) {
  const classes = useStyles();
  
  // const typeString = ["Free", "Pay to Watch", "Basic Subscription", "Premium Subscription"];

  const id = _.get(props, 'match.params.id');
  const main_video = _.get(
    props.videos.list.filter((x) => x.id === parseInt(id, 10)),
    ['0']
  );
  
  const [values, setValues] = React.useState({
    dataInline: main_video || {},
    dataFileInline: null,

    editingStatus: !!main_video ? "EDIT" : "ADD", // "" | "ADD" | "EDIT"

    error: "",
    success: "",

    snackOpen : false,
    snackType : "info",
    snackMessage: "",

    confirmOpen : false,
    confirmTitle : "",
    confirmMessage : "",

    fileUploding: false,
    fileUploadProgress: 0,
    fileName : "",

    playingVideoUrl : "",
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

  const loadVideos = () => {
    props.setLoading(true);
    api.loadVideos(id)
      .then((result) => {
        setValues(values => ({...values, success: "Loading video files success!"}));
        props.loadAll(result.data || []);
      })
      .catch((error) => {
        setValues(values => ({...values, error: "Error in loading video files!"}));
        props.setLoading(false);
      })
  }

  React.useEffect(() => {
    loadVideos();

    loadAllCategories()
      .then((result) => {
        console.log("Loading channels success!")
        props.loadAllCategories(result.data || []);
      })
      .catch((error) => {
        console.log("Loading channels fail!")
      })
  }, []);

  const onEditSave = () => {
    const row = values.dataInline;
    
    if(!row) setValues({...values, error: "No valid data to save!"})
    else if(!row.title) setValues({...values, error: "Please input title!"})
    else if(!row.description) setValues({...values, error: "Please input description!"})
    else if(!row.title_logo) setValues({...values, error: "Please input logo url!"})
    else if(!row.category_id) setValues({...values, error: "Please select category!"})
    else if(typeof row.type == 'undefined') setValues({...values, error: "Please select watch type!"})
    else{
      row.is_series = row.is_series || false;
      if(!!row.id){
        props.setActionProgress(true);
        api.update(row.id, row)
          .then((result) => {
            props.update(result.data)
            setValues({...values, editingStatus: "EDIT", dataInline: result.data.data, success: "Updating video success!"})
          })
          .catch((error) => {
            setValues({...values, error: "Error in updating video!"})
            props.setActionProgress(false);
          })
      }else{
        props.setActionProgress(true);
        api.create(row)
          .then((result) => {
            props.create(result.data)
            setValues({...values, editingStatus: "EDIT", dataInline: result.data.data, success: "Creating video success!"})
          })
          .catch((error) => {
            setValues({...values, error: "Error in creating video!"})
            props.setActionProgress(false);
          })
      }
    }
  }

  const onDeleteItem = row => {
    if(!row)  return;

    setValues({
      ...values,
      confirmOpen: true,
      confirmTitle: "Confirm",
      confirmMessage: "Do you want to delete selected video file?",
      dataFileInline: row
    });
  }

  const onAgreeDelete = () => {
    const row = values.dataFileInline;
    setValues({...values, confirmOpen:false, dataFileInline: null})

    if(!row)  return;

    props.setActionProgress(true);
    api.removeFile(row.id)
      .then((result) => {
        props.delete(row.id);
        setValues({...values, confirmOpen:false, success: "Deleting video file success!"})
      })
      .catch((error) => {
        setValues({...values, confirmOpen:false, error: "Error in deleting video file!"})
        props.setActionProgress(false);
      })
      .finally(() => {
        setValues({...values, confirmOpen:false, dataFileInline: null})
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

  const handleCheck = name => event => {
    setValues({ ...values, dataInline: { ...values.dataInline, [name]: event.target.checked }});
    console.log(event.target.checked)
  };

  const onSelectUpload = event => {
    if(values.dataInline && !values.dataInline.is_series && props.video_files.list.length >= 1){
      setValues({...values, confirmOpen:false, error: "This is single seria video. You can keep only 1 video file."})
    }
    var file = event.target.files.item(0);
    if (file !== null) {
      createChunks(file);
    }
  }
  
  const createChunks = async(file) => {
    let size = 3 * 1024 * 1024;
    let chunks = Math.ceil(file.size / size);
    
    setValues({ ...values, fileName: file.name });

    for (let i = 0; i < chunks; i++) {
        const chunk = file.slice(
            i * size, Math.min(i * size + size, file.size), file.type
        );

        let formData = new FormData();
        formData.set('is_last', i + 1 === chunks);
        formData.set('video_id', values.dataInline && values.dataInline.id);
        formData.set('file', chunk, `${file.name}.part`);

        setValues({ ...values, fileUploding: true, fileUploadProgress: 0 });
        await api.upload(formData).then((res) => {
          if(i+1 === chunks){
            setValues({ ...values, fileUploding: false, fileUploadProgress: 0 });
            loadVideos();
          }
          else
            setValues({ ...values, fileUploding: true, fileUploadProgress: (i + 1) / chunks * 100 });

          if (res.data && res.data.uploaded) {
            console.log("data upload sucess", i+1);
          }
        }).catch(err => {
          if(i+1 === chunks)
            setValues({ ...values, fileUploding: false, fileUploadProgress: 0 });
          console.error(err);
        });
    }
  }

  const playVideo = (url) => {
    console.log(url)
    //setValues({...values, playingVideoUrl: url});
    window.open(url, "_blank")
  }

  const stopPlaying = () => {
    setValues({...values, playingVideoUrl: ""});
  }

  return (
    <>
      <Portlet key="main">
        <PortletHeader title={values.editingStatus === "EDIT" ? "Edit Video" : "Create Video"}>
        </PortletHeader>
        <PortletBody>
          <div className="col-md-12">
            <Link to="/videos" className="mr-2">
              <Button variant="contained" color="secondary">
                <ChevronLeftSharp/> Back to All Videos
              </Button>
            </Link>
            <Button variant="contained" color="primary" onClick={() => onEditSave()}>
              <SaveAlt/> Save Changes
            </Button>
            {!!props.video_files.isSaving && <CircularProgress size={20} thickness={5} className="ml-2"/>}
          </div>
          <div className="d-flex flex-row">
            <div className="col-md-6">
              <TextField
                  key="title"
                  label="Title"
                  value={(values.dataInline && values.dataInline.title) || ""}
                  onChange={handleChange("title")}
                  margin="normal"
              /><br/>
              <TextField
                  key="description"
                  label="Description"
                  value={(values.dataInline && values.dataInline.description) || ""}
                  onChange={handleChange("description")}
                  margin="normal"
              /><br/>
              <TextField
                  key="title_logo"
                  label="Logo URL"
                  value={(values.dataInline && values.dataInline.title_logo) || ""}
                  onChange={handleChange("title_logo")}
                  margin="normal"
              /><br/>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="age-helper">Select Category</InputLabel>
                <Select
                  value={(values.dataInline && values.dataInline.category_id) || 0}
                  onChange={handleChange("category_id")}
                >
                  <MenuItem value="0">
                    <em>&nbsp;</em>
                  </MenuItem>
                  {Array.isArray(props.categories.list) && props.categories.list.map((row, index) => (
                    <MenuItem key={row.id} value={row.id}>{`${row.name}`}</MenuItem>
                  ))}
                </Select>
              </FormControl><br/>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="age-helper">Select Watch Type</InputLabel>
                <Select
                  value={(values.dataInline && values.dataInline.type) || 0}
                  onChange={handleChange("type")}
                >
                  <MenuItem value="0">
                    <em>&nbsp;</em>
                  </MenuItem>
                  <MenuItem value="1">
                    <em>Free</em>
                  </MenuItem>
                  <MenuItem value="2">
                    <em>Pay to Watch</em>
                  </MenuItem>
                  <MenuItem value="3">
                    <em>Basic Subscription</em>
                  </MenuItem>
                  <MenuItem value="4">
                    <em>Premium Subscription</em>
                  </MenuItem>
                </Select>
              </FormControl><br/>
              <TextField
                label="Price"
                id="simple-start-adornment"
                onChange={handleChange('price')}
                InputProps={{
                  startAdornment: <InputAdornment position="start">€</InputAdornment>,
                }}
              /><br/>
              <FormControlLabel
                control={
                  <Checkbox checked={!!(values.dataInline && values.dataInline.is_series) || false} onChange={handleCheck('is_series')} />
                }
                label="Is Series"
              />
            </div>
            <div className="col-md-6">
              <span className="text-black-50">Preview Logo</span><br/>
              <img src={(values.dataInline && values.dataInline.title_logo) || "https://fiverr-res.cloudinary.com/videos/so_3.473103,t_main1,q_auto,f_auto/ylvg1pdgmaftrql79u7s/do-fire-video-intro-animation.png"} 
                className={classes.previewLogo} 
                alt="No logo available"
              />
            </div>
          </div>
          
        </PortletBody>
      </Portlet>
      {values.editingStatus === "EDIT" && <Portlet key="videos">
        <PortletHeader title="Video Files">
        </PortletHeader>
        <PortletBody>
          <div className="d-flex flex-row">
            <div className="col-md-2">
              <form className="form-group" noValidate autoComplete="off">
                <input
                    accept="video/*"
                    style={{ display: "none" }}
                    id="contained-button-file"
                    multiple
                    type="file"
                    onChange={(e) => onSelectUpload(e)}
                />
                <label htmlFor="contained-button-file">
                  <Button
                    variant="contained"
                    color="primary"
                    component="span"
                    disabled={values.fileUploding}
                  >
                    <ArrowUpward/> Upload New File
                    {values.fileUploding && <CircularProgress size={20} thickness={5} className="ml-2"/>}
                  </Button>
                </label>
              </form>
            </div>
            {values.fileUploding && <div className="col-md-10">
              <h5>{`Uploading ${values.fileName}...`}</h5>
              <LinearProgress className="mt-2 mb-3 d-none" variant="determinate" color="secondary" value={values.fileUploadProgress} />
            </div>}
          </div>
          {!!props.video_files.isLoading && <CircularProgress className={classes.progress} />}
          {!props.video_files.isLoading && 
          <div className="col-md-12">
            {props.video_files.list.map((row, index) => (
              <>
                {(index)%4 == 0 && <div key={`clearfixer-${index+1}`} className="col-md-12 float-left"></div>}
                <div className="col-md-3 float-left" key={`clip-pane-${index}`}>
                  <div className="w-100 h-100" >
                    <div className={classes.imgOverlay}>
                      {(values.dataInline && values.dataInline.is_series && `Serie-${index+1}`) || ""}
                      <IconButton aria-label="Delete" onClick={() => onDeleteItem(row)}>
                        <DeleteIcon />
                      </IconButton>
                    </div>
                    <img className={classes.imgVideoFile} src={`${process.env.REACT_APP_API_BASE_URL || "/"}/storage/videos/${row.logo_path}`}
                      onClick={() => playVideo(`${process.env.REACT_APP_API_BASE_URL || "/"}/storage/videos/${row.file_path}`)}>
                    </img>
                  </div>
                </div>
              </>
             ))}
          </div>}
        </PortletBody>
      </Portlet>}
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
          open={false}
          // open={values.playingVideoUrl !== ""}
          onClose={() => stopPlaying()}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Preview Video</DialogTitle>
          <DialogContent>
            <Player
              videoId="video-1"
              style={{ zIndex: 1, position:'absolute', top:0, left: 0, width: '100%', height: '100%' }}
              className="w-100 h-100"
            >
              <source src={values.playingVideoUrl} />
            </Player>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default injectIntl(
  connect(
    ({ videos, video_files, categories }) => ({ videos, video_files, categories }),
    {
      ...actions,
      loadAllCategories: actions_categories.loadAll,
    }
  )(MyComp)
);