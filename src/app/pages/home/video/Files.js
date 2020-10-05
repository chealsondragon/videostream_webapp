import React from "react";
import { connect } from "react-redux";
import * as _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import {  TextField,  Button, Table, TableCell, TableBody, TableHead, TableRow, IconButton, LinearProgress, FormControl, InputLabel, Select, Tooltip } from "@material-ui/core";
import MenuItem from '@material-ui/core/MenuItem';
import DeleteIcon from '@material-ui/icons/Delete';

import EditIcon from '@material-ui/icons/Edit';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { injectIntl } from "react-intl";

import {  Portlet,  PortletBody,  PortletHeader } from "../../../partials/content/Portlet";

import * as api from "../../../crud/videos.crud"
import { actions } from "../../../store/ducks/video-files.duck";

import MySnackBar from "../../../partials/MySnackBar";
import MyAlertDialog from "../../../partials/MyAlertDialog";
import { ArrowUpward, PhotoAlbum, PlayCircleOutline } from "@material-ui/icons";
import { Carousel } from "react-bootstrap";
import ReactNetflixPlayer from 'react-netflix-player';

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
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  TextField: {
    // marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  svgFlag: {
    maxWidth: "30px",
    marginRight: theme.spacing(1),
  },
}));

function MyComp(props) {
  const classes = useStyles();
  
  // const typeString = ["Free", "Pay to Watch", "Basic Subscription", "Premium Subscription"];

  const id = props.video_id;
  const main_video = props.video;
  
  const [values, setValues] = React.useState({
    dataInline: {},
    dataFileInline: null,
    dataUpload: { role: 0, lang_id: 1, no1: 1, no2: 1, no3: 1, no4: 1, no5: 1 },

    editingStatus: "", // "" | "ADD" | "EDIT"

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

    showScreenshot: false,
    showScreenshotFile: null,
    playingVideo: false,
    playingVideoFile: null,
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

  const loadVideos = (lang_id) => {
    props.setLoading(true);
    api.loadVideos(id, typeof lang_id !== "undefined" ? (lang_id||0) : (values.search_lang || 0))
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
      api.updateFile(row.id, row)
        .then((result) => {
          props.update(result.data)
          setValues({...values, editingStatus: "", success: "Updating video file success!"})
        })
        .catch((error) => {
          setValues({...values, editingStatus: "", error: "Error in updating video file!"})
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
        setValues({...values, confirmOpen:false, success: "Deleting video file success!", dataFileInline: null})
      })
      .catch((error) => {
        setValues({...values, confirmOpen:false, error: "Error in deleting video file!", dataFileInline: null})
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

  const onSearchByLang = (event) => {
    setValues({ ...values, search_lang: event.target.value });
    loadVideos(event.target.value);
  }

  const handleChange = name => event => {
    setValues({ ...values, dataInline: { ...values.dataInline, [name]: event.target.value }});
  };

  const handleChangeUpload = name => event => {
    setValues({ ...values, dataUpload: { ...values.dataUpload, [name]: event.target.value }});
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
        formData.set('file', chunk, `${file.name}.part`);
        formData.set('video_id', id);
        formData.set('role', (values.dataUpload && values.dataUpload.role) || 0);
        formData.set('lang_id', (values.dataUpload && values.dataUpload.lang_id) || 1);
        formData.set('sub_title', (values.dataUpload && values.dataUpload.sub_title) || "");
        formData.set('ads_timepoint', (values.dataUpload && values.dataUpload.ads_timepoint) || 0);
        formData.set('no1', (values.dataUpload && values.dataUpload.no1) || 1);
        formData.set('no2', (values.dataUpload && values.dataUpload.no2) || 1);
        formData.set('no3', (values.dataUpload && values.dataUpload.no3) || 1);
        formData.set('no4', (values.dataUpload && values.dataUpload.no4) || 1);
        formData.set('no5', (values.dataUpload && values.dataUpload.no5) || 1);

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

  const playVideo = (file) => {
    setValues({...values, playingVideo: true, playingVideoFile: file});
  }

  const stopPlaying = () => {
    setValues({...values, playingVideo: false, playingVideoFile: null});
  }

  const getClipLabel = (video, file) => {
    if(!video || !video.serie_type || !file) return  "";
    if(file.role === 1) return "Trailer";
    if(file.role === 2) return "Intro";
    if(file.role === 3){
      return "Ads at " + getTimeString(file.ads_timepoint || 0);
    }

    const depth = video.serie_type.depth || 0;
    if(depth === 0) return "Movie";
    var label = `${video.serie_type.name_depth1} ${file.no1}`;
    if(depth > 1)
      label += ` ${video.serie_type.name_depth2} ${file.no2}`;
    if(depth > 2)
      label += ` ${video.serie_type.name_depth3} ${file.no3}`;
    if(depth > 3)
      label += ` ${video.serie_type.name_depth4} ${file.no4}`;
    if(depth > 4)
      label += ` ${video.serie_type.name_depth5} ${file.no5}`;

    return label;
  }

  const getClipDuration = (file) => {
    return getTimeString(parseFloat(file && file.duration) || 0)
  }
  
  const getTimeString = (time) => {
    var totalSec = parseFloat(time);
    var min = parseInt(totalSec/60);
    var hr = parseInt(min/60);
    var sec = (totalSec-min*60).toFixed(2);
    min -= hr*60;
  
    return `${hr}h ${min}m ${sec}s`;
  }

  const serie_type = main_video && main_video.serie_type;

  return (
    <div style={{ display:"flex", flexDirection: "row" }}>
      <Portlet key="videos" className="col-md-8 mr-2">
        <PortletHeader title="Video Files">
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="select-lang">Search By Language...</InputLabel>
            <Select
              value={values.search_lang || 0}
              onChange={onSearchByLang}
            >
              <MenuItem key={0} value={0}>
                <span>&nbsp;</span>
              </MenuItem>
              {props.language.list.map(type => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </PortletHeader>
        <PortletBody>
          {!!props.video_files.isLoading && <CircularProgress className={classes.progress} />}
          {!props.video_files.isLoading && 
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Clip Number</TableCell>
                  <TableCell>Sub Title</TableCell>
                  <TableCell>Language</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.video_files.list.map((row, index) => (
                  <TableRow key={`data-${row.id}`}>
                    <TableCell component="th" scope="row">{getClipLabel(main_video, row)}</TableCell>
                    <TableCell>
                      {row.sub_title}
                    </TableCell>
                    <TableCell>
                      <img src={row.lang && row.lang.svg_url} alt={row.name} className={classes.svgFlag}/>
                      {row.lang && row.lang.name}
                    </TableCell>
                    <TableCell>
                      {getClipDuration(row)}
                    </TableCell>
                    <TableCell className="p-0">
                      <Tooltip title="View Screenshots" aria-label="Screenshots">
                        <IconButton aria-label="Preview" onClick={()=>setValues({...values, showScreenshot: true, showScreenshotFile: row})}>
                          <PhotoAlbum/>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Play Video" aria-label="Play-Video">
                        <IconButton aria-label="Play" onClick={() => playVideo(row)}>
                          <PlayCircleOutline/>
                        </IconButton>
                      </Tooltip>
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
        }
        </PortletBody>
      </Portlet>
      <Portlet key="upload" className="col-md-4">
        <PortletHeader title="Upload">
        </PortletHeader>
        <PortletBody>
          <div className="d-flex flex-row" key="body-progress-group">        
            {values.fileUploding && <div className="col-md-10" key="1213">
              <h5>{`Uploading ${values.fileName}...`}</h5>
              <LinearProgress className="mt-2 mb-3 d-none" variant="determinate" color="secondary" value={values.fileUploadProgress} />
            </div>}
          </div>
          <div className="d-flex flex-column" key="body-upload-group">
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="age-helper">Select Video Role</InputLabel>
              <Select
                value={(values.dataUpload && values.dataUpload.role) || 0}
                onChange={handleChangeUpload("role")}
              >
                <MenuItem key="role-clip" value={0}>
                  Clip
                </MenuItem>
                <MenuItem key="role-ads" value={3}>
                  Ads
                </MenuItem>
                <MenuItem key="role-intro" value={2}>
                  Intro
                </MenuItem>
                <MenuItem key="role-trailer" value={1}>
                  Trailer
                </MenuItem>
              </Select>
            </FormControl><br/>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="select-lang">Select Language</InputLabel>
              <Select
                value={(values.dataUpload && values.dataUpload.lang_id) || 1}
                onChange={handleChangeUpload("lang_id")}
              >
                {props.language.list.map(type => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl><br/>
            <TextField
              id="sub_title"
              label="Input Sub title"
              value={(values.dataUpload && values.dataUpload.sub_title) || ""}
              className={classes.TextField}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleChangeUpload('sub_title')}
            /><br/>
            {(values.dataUpload && values.dataUpload.role === 3) &&
            <TextField
              id="ads_timepoint"
              label="Ads Timepoint (second)"
              type="number"
              value={(values.dataUpload && values.dataUpload.ads_timepoint) || 0}
              className={classes.TextField}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleChangeUpload('ads_timepoint')}
            />}
            {(values.dataUpload && values.dataUpload.role === 0) && serie_type && serie_type.depth > 0 &&
            <TextField
              id="no1"
              label={`Number ${(values.dataUpload && values.dataUpload.role === 0) && serie_type && serie_type.name_depth1}`}
              type="number"
              value={(values.dataUpload && values.dataUpload.no1) || ""}
              className={classes.TextField}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleChangeUpload('no1')}
            />}
            {(values.dataUpload && values.dataUpload.role === 0) && serie_type && serie_type.depth > 1 &&
            <TextField
              id="no2"
              label={`Number ${(values.dataUpload && values.dataUpload.role === 0) && serie_type && serie_type.name_depth2}`}
              type="number"
              value={(values.dataUpload && values.dataUpload.no2) || ""}
              className={classes.TextField}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleChangeUpload('no2')}
            />}
            {(values.dataUpload && values.dataUpload.role === 0) && serie_type && serie_type.depth > 2 &&
            <TextField
              id="no3"
              label={`Number ${(values.dataUpload && values.dataUpload.role === 0) && serie_type && serie_type.name_depth3}`}
              type="number"
              value={(values.dataUpload && values.dataUpload.no3) || ""}
              className={classes.TextField}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleChangeUpload('no3')}
            />}
            {(values.dataUpload && values.dataUpload.role === 0) && serie_type && serie_type.depth > 3 &&
            <TextField
              id="no4"
              label={`Number ${(values.dataUpload && values.dataUpload.role === 0) && serie_type && serie_type.name_depth4}`}
              type="number"
              value={(values.dataUpload && values.dataUpload.no4) || ""}
              className={classes.TextField}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleChangeUpload('no4')}
            />}
            {(values.dataUpload && values.dataUpload.role === 0) && serie_type && serie_type.depth > 4 &&
            <TextField
              id="no5"
              label={`Number ${(values.dataUpload && values.dataUpload.role === 0) && serie_type && serie_type.name_depth5}`}
              type="number"
              value={(values.dataUpload && values.dataUpload.no5) || ""}
              className={classes.TextField}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleChangeUpload('no5')}
            />}<br/>
    
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
          {values.fileUploding && <div className="col-md-10" key="1213">
            <h5>{`Uploading ${values.fileName}...`}</h5>
            <LinearProgress className="mt-2 mb-3 d-none" variant="determinate" color="secondary" value={values.fileUploadProgress} />
          </div>}
        </PortletBody>
      </Portlet>
      <MyAlertDialog
        open={values.confirmOpen}
        handleOK={onAgreeDelete}
        handleCancel={onDisAgreeDelete}
        message={values.confirmMessage}
        title={values.confirmTitle}
      />
      <MySnackBar 
        open={values.snackOpen} 
        message={values.snackMessage} 
        onClose={()=>setValues({...values, snackOpen: false, error: "", success: ""})}
        variant={values.snackType}
        vertical="top"
        horizontal="right"
      />
      <Dialog
        key="gallery"
        open={values.showScreenshot || false}
        maxWidth="lg"
        onClose={null}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Video Screnshots</DialogTitle>
        <DialogContent>
          <Carousel>
            {values.showScreenshotFile && values.showScreenshotFile.logo_path_upload && 
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={`${process.env.REACT_APP_API_BASE_URL || document.location.origin}/storage/videos/${values.showScreenshotFile.logo_path_upload}`}
                alt=""
              />
              <Carousel.Caption>
                <h3>Upload Screenshot</h3>
              </Carousel.Caption>
            </Carousel.Item>}
            {values.showScreenshotFile && values.showScreenshotFile.logo_path1 && 
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={`${process.env.REACT_APP_API_BASE_URL || document.location.origin}/storage/videos/${values.showScreenshotFile.logo_path1}`}
                alt=""
              />
              <Carousel.Caption>
                <h3>Screenshot 1</h3>
              </Carousel.Caption>
            </Carousel.Item>}
            {values.showScreenshotFile && values.showScreenshotFile.logo_path2 && 
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={`${process.env.REACT_APP_API_BASE_URL || document.location.origin}/storage/videos/${values.showScreenshotFile.logo_path2}`}
                alt=""
              />
              <Carousel.Caption>
                <h3>Screenshot 2</h3>
              </Carousel.Caption>
            </Carousel.Item>}
            {values.showScreenshotFile && values.showScreenshotFile.logo_path3 && 
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={`${process.env.REACT_APP_API_BASE_URL || document.location.origin}/storage/videos/${values.showScreenshotFile.logo_path3}`}
                alt=""
              />
              <Carousel.Caption>
                <h3>Screenshot 3</h3>
              </Carousel.Caption>
            </Carousel.Item>}
          </Carousel>
        </DialogContent>
        <DialogActions>
          <Button color="primary" autoFocus onClick={()=>setValues({...values, showScreenshot: false, showScreenshotFile: null})}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        key="edit"
        open={values.editingStatus !== ""}
        onClose={onEditCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{values.editingStatus} Video File</DialogTitle>
        <DialogContent>
          <div className="row row-full-height ml-1 mt-0 d-flex flex-column">
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="age-helper">Select Video Role</InputLabel>
              <Select
                value={(values.dataInline && values.dataInline.role) || 0}
                onChange={handleChange("role")}
              >
                <MenuItem key="role-clip" value={0}>
                  Clip
                </MenuItem>
                <MenuItem key="role-ads" value={3}>
                  Ads
                </MenuItem>
                <MenuItem key="role-intro" value={2}>
                  Intro
                </MenuItem>
                <MenuItem key="role-trailer" value={1}>
                  Trailer
                </MenuItem>
              </Select>
            </FormControl><br/>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="select-lang">Select Language</InputLabel>
              <Select
                value={(values.dataInline && values.dataInline.lang_id) || 1}
                onChange={handleChange("lang_id")}
              >
                {props.language.list.map(type => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl><br/>
            <TextField
              id="sub_title"
              label="Input Sub title"
              value={(values.dataInline && values.dataInline.sub_title) || ""}
              className={classes.TextField}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleChange('sub_title')}
            /><br/>
            {(values.dataInline && values.dataInline.role === 3) &&
            <TextField
              id="ads_timepoint"
              label="Ads Timepoint (second)"
              type="number"
              value={(values.dataInline && values.dataInline.ads_timepoint) || 0}
              className={classes.TextField}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleChange('ads_timepoint')}
            />}
            {(values.dataInline && values.dataInline.role === 0) && serie_type && serie_type.depth > 0 &&
            <TextField
              id="no1"
              label={`Number ${(values.dataInline && values.dataInline.role === 0) && serie_type && serie_type.name_depth1}`}
              type="number"
              value={(values.dataInline && values.dataInline.no1) || ""}
              className={classes.TextField}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleChange('no1')}
            />}
            {(values.dataInline && values.dataInline.role === 0) && serie_type && serie_type.depth > 1 &&
            <TextField
              id="no2"
              label={`Number ${(values.dataInline && values.dataInline.role === 0) && serie_type && serie_type.name_depth2}`}
              type="number"
              value={(values.dataInline && values.dataInline.no2) || ""}
              className={classes.TextField}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleChange('no2')}
            />}
            {(values.dataInline && values.dataInline.role === 0) && serie_type && serie_type.depth > 2 &&
            <TextField
              id="no3"
              label={`Number ${(values.dataInline && values.dataInline.role === 0) && serie_type && serie_type.name_depth3}`}
              type="number"
              value={(values.dataInline && values.dataInline.no3) || ""}
              className={classes.TextField}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleChange('no3')}
            />}
            {(values.dataInline && values.dataInline.role === 0) && serie_type && serie_type.depth > 3 &&
            <TextField
              id="no4"
              label={`Number ${(values.dataInline && values.dataInline.role === 0) && serie_type && serie_type.name_depth4}`}
              type="number"
              value={(values.dataInline && values.dataInline.no4) || ""}
              className={classes.TextField}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleChange('no4')}
            />}
            {(values.dataInline && values.dataInline.role === 0) && serie_type && serie_type.depth > 4 &&
            <TextField
              id="no5"
              label={`Number ${(values.dataInline && values.dataInline.role === 0) && serie_type && serie_type.name_depth5}`}
              type="number"
              value={(values.dataInline && values.dataInline.no5) || ""}
              className={classes.TextField}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleChange('no5')}
            />}<br/>
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
      <Dialog
        key="playing"
        open={values.playingVideo && values.playingVideoFile && true}
        maxWidth="lg"
        onClose={null}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Play Video</DialogTitle>
        <DialogContent>
          {values.playingVideo && values.playingVideoFile && <ReactNetflixPlayer
          // Vídeo Link - Just data is required
            src={`${process.env.REACT_APP_API_BASE_URL || document.location.origin}/storage/videos/${values.playingVideoFile.file_path}`}
            // src={"http://videoinvalid"}
            title={getClipLabel(main_video, values.playingVideoFile)}
            subTitle={values.playingVideoFile.sub_title}
            titleMedia={getClipLabel(main_video, values.playingVideoFile)}
            extraInfoMedia={values.playingVideoFile.sub_title}
            // Text language of player
            playerLanguage="en"
            // Action when the button X (close) is clicked
            onCrossClick={() => stopPlaying()}
            backButton={() => stopPlaying()}
            // The player use the all viewport
            fullPlayer
            autoPlay
            startPosition={0}
            // The info of the next video action
            // dataNext={{ title: 'Next Video.' }}
            // The action call when the next video is clicked
            onNextClick={() => {}}
            // The list reproduction data, will be render in this order
            // reprodutionList={[
            //   {
            //     nome: 'Opening',
            //     id: 1,
            //     playing: true,
            //   },
            //   {
            //     nome: 'Teste',
            //     id: 2,
            //     playing: false,
            //   },
            // ]}
            // The function call when a item in reproductionList is clicked
            onClickItemListReproduction={(id, playing) => {
              return {
                id,
                playing,
              };
            }}
            // The function is call when the video finish
            onEnded={() => stopPlaying()}
            // The function is call when the video is playing (One time for frame)
            onTimeUpdate={(evt) => {evt.persist(); console.log("playing:", evt)}}
            // Enable the orverlay when player is paused
            overlayEnabled
            // Enabled the auto clode controlls of player
            autoControllCloseEnabled
            // Style
            primaryColor="#03dffc"
            secundaryColor="#ffffff"
            fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"

            // subtitleMedia="/teste.vtt"
          />}
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
  );
}

export default injectIntl(
  connect(
    ({ video_files }) => ({ video_files }),
    {
      ...actions,
    }
  )(MyComp)
);