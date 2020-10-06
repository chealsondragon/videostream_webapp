import React from "react";
import { connect } from "react-redux";
import * as _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import { Input, Chip, TextField,  Button, IconButton, FormControl, InputLabel, Select, FormControlLabel, LinearProgress } from "@material-ui/core";
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import URL from "../../../helpers/url";

import CircularProgress from '@material-ui/core/CircularProgress';
import { injectIntl } from "react-intl";

import {  Portlet,  PortletBody,  PortletHeader } from "../../../partials/content/Portlet";

import * as api from "../../../crud/videos.crud"
import { actions } from "../../../store/ducks/videos.duck";
import { loadAll as loadAllCategories } from "../../../crud/categories.crud"
import { actions as actions_categories } from "../../../store/ducks/categories.duck";
import { loadAll as loadAllSerieTypes } from "../../../crud/serie_type.crud"
import { actions as actions_serie_types } from "../../../store/ducks/serie_type.duck";
import { loadAll as loadAllPlans } from "../../../crud/plan.crud"
import { actions as actions_plans } from "../../../store/ducks/plan.duck";
import { loadAll as loadAllLangs } from "../../../crud/language.crud"
import { actions as actions_langs } from "../../../store/ducks/language.duck";

import MySnackBar from "../../../partials/MySnackBar";
import { Link } from "react-router-dom";
import {  ChevronLeftSharp, ExpandLessOutlined, ExpandMoreOutlined, ExpandMoreRounded, LanguageOutlined, SaveAlt } from "@material-ui/icons";

import VideoFiles from './Files';

const useStyles = makeStyles(theme => ({
  formControl: {
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
    minWidth: 300,
  },
  previewLogo: {
    width: '100%',
    objectFit: 'contain',
    marginTop: theme.spacing(1)
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
    maxWidth: "36px"
  },
  multiLangBlock: {
  }
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

function MyComp(props) {
  const classes = useStyles();

  const id = _.get(props, 'match.params.id');
  const main_video = _.get(
    props.videos.list.filter((x) => x.id === parseInt(id, 10)),
    ['0']
  );
  
  const [values, setValues] = React.useState({
    dataInline: { ...main_video, category_id: main_video && main_video.categories && main_video.categories.map(x => x.category_id) },

    editingStatus: !!main_video ? "EDIT" : "ADD", // "" | "ADD" | "EDIT"
    multiLangTitleEditing: false,
    multiLangDescriptionEditing: false,

    error: "",
    success: "",

    snackOpen : false,
    snackType : "info",
    snackMessage: "",

    confirmOpen : false,
    confirmTitle : "",
    confirmMessage : "",
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

  const categoryNames = React.useMemo(() => {
    var names = {};
    props.categories.list.map(cat => {
      names[cat.id] = cat.name;
    });
    return names;
  }, [props.categories]);

  React.useEffect(() => {
    loadAllCategories()
      .then((result) => {
        console.log("Loading categories success!")
        props.loadAllCategories(result.data || []);
      })
      .catch((error) => {
        console.log("Loading categories fail!")
      })
    loadAllPlans()
      .then((result) => {
        console.log("Loading plans success!")
        props.loadAllPlans(result.data || []);
      })
      .catch((error) => {
        console.log("Loading plans fail!")
      })
    loadAllSerieTypes()
      .then((result) => {
        console.log("Loading serie types success!")
        props.loadAllSerieTypes(result.data || []);
      })
      .catch((error) => {
        console.log("Loading serie types fail!")
      })
    loadAllLangs()
      .then((result) => {
        console.log("Loading langs success!")
        props.loadAllLangs(result.data || []);
      })
      .catch((error) => {
        console.log("Loading langs fail!")
      })
  }, []);

  const onEditSave = () => {
    const row = values.dataInline;
    
    if(!row) setValues({...values, error: "No valid data to save!"})
    else if(!row.title) setValues({...values, error: "Please input default title!"})
    else if(!row.description) setValues({...values, error: "Please input default description!"})
    else if(!row.title_logo) setValues({...values, error: "Please input title logo url!"})
    else if(!row.cover) setValues({...values, error: "Please input cover url!"})
    else if(!row.boxart_image) setValues({...values, error: "Please input boxart_image url!"})
    else if(!row.bob_background) setValues({...values, error: "Please input bobbackground_image url!"})
    else if(!row.jawbone_title_logo) setValues({...values, error: "Please input jawbone_title_logo url!"})
    else if(!row.ptrack_content_image) setValues({...values, error: "Please input ptrack_content_image url!"})
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

  const handleChange = name => event => {
    setValues({ ...values, dataInline: { ...values.dataInline, [name]: event.target.value }});
  };

  const handleCheck = name => event => {
    setValues({ ...values, dataInline: { ...values.dataInline, [name]: event.target.checked }});
  };

  var dictTitle = {}; 
  var dictDescription = {};
  try{
    dictTitle = JSON.parse(values.dataInline && values.dataInline.multilang_title);
    dictDescription = JSON.parse(values.dataInline && values.dataInline.multilang_description);
  }catch(e){
  }

  return (
    <>
      <Portlet key="main">
        <PortletHeader title={values.editingStatus === "EDIT" ? "Edit Video" : "Create Video"}>
        </PortletHeader>
        <PortletBody>
          <div className="col-md-12">
            <Link to={URL.LIST_VIDEO()} className="mr-2">
              <Button variant="contained" color="secondary">
                <ChevronLeftSharp/> Back to All Videos
              </Button>
            </Link>
            <Button variant="contained" color="primary" onClick={() => onEditSave()}>
              <SaveAlt/> Save Changes
            </Button>
            {!!props.videos.isSaving && <CircularProgress size={20} thickness={5} className="ml-2"/>}
          </div>
          <div className="d-flex flex-row">
            <div className="col-md-8 col-sm-6 col-xs-12">
              <TextField
                  key="title"
                  label="Title (Default)"
                  value={(values.dataInline && values.dataInline.title) || ""}
                  onChange={handleChange("title")}
                  margin="normal"
              />
              <div className={classes.multiLangBlock}>
              {values.multiLangTitleEditing && props.language.list.map(row => 
                <TextField
                  key={`title-${row.name}`}
                  label={`Title (${row.name})`}
                  value={(values.dataInline && values.dataInline[`title_${row.lang_code}`]) || (dictTitle && dictTitle[row.lang_code]) || ""}
                  onChange={handleChange(`title_${row.lang_code}`)}
                  margin="normal"
                />
              )}
              </div>
              <Button variant="contained" color="inherit" size="small" onClick={() => setValues(values => ({ ...values, multiLangTitleEditing: !values.multiLangTitleEditing }))}>
                {values.multiLangTitleEditing && <ExpandLessOutlined/>}{!values.multiLangTitleEditing && <ExpandMoreOutlined/>} Multi-Lang Title
              </Button>
              <br/>
              <TextField
                  key="description"
                  label="Description (Default)"
                  value={(values.dataInline && values.dataInline.description) || ""}
                  onChange={handleChange("description")}
                  margin="normal"
              />
              <div className={classes.multiLangBlock}>
              {values.multiLangDescriptionEditing && props.language.list.map(row => 
                <TextField
                  key={`description-${row.name}`}
                  label={`Description (${row.name})`}
                  value={(values.dataInline && values.dataInline[`description_${row.lang_code}`]) || (dictDescription && dictDescription[row.lang_code]) || ""}
                  onChange={handleChange(`description_${row.lang_code}`)}
                  margin="normal"
                />
              )}
              </div>
              <Button variant="contained" color="inherit" size="small" onClick={() => setValues(values => ({ ...values, multiLangDescriptionEditing: !values.multiLangDescriptionEditing }))}>
                {values.multiLangDescriptionEditing && <ExpandLessOutlined/>}{!values.multiLangDescriptionEditing && <ExpandMoreOutlined/>} Multi-Lang Description
              </Button>
              <br/>
              <TextField
                  key="title_logo"
                  label="Title Logo URL (612x260)"
                  value={(values.dataInline && values.dataInline.title_logo) || ""}
                  onChange={handleChange("title_logo")}
                  margin="normal"
              /><br/>
              <TextField
                  key="cover"
                  label="Cover URL (1280x720)"
                  value={(values.dataInline && values.dataInline.cover) || ""}
                  onChange={handleChange("cover")}
                  margin="normal"
              /><br/>
              <TextField
                  key="boxart_image"
                  label="Boxart Image URL (341x192)"
                  value={(values.dataInline && values.dataInline.boxart_image) || ""}
                  onChange={handleChange("boxart_image")}
                  margin="normal"
              /><br/>
              <TextField
                  key="bob_background"
                  label="Bob background URL (720x394)"
                  value={(values.dataInline && values.dataInline.bob_background) || ""}
                  onChange={handleChange("bob_background")}
                  margin="normal"
              /><br/>
              <TextField
                  key="jawbone_title_logo"
                  label="Jawbone Title Logo URL (550x124)"
                  value={(values.dataInline && values.dataInline.jawbone_title_logo) || ""}
                  onChange={handleChange("jawbone_title_logo")}
                  margin="normal"
              /><br/>
              <TextField
                  key="ptrack_content_image"
                  label="Ptrack Content Image URL (848x477)"
                  value={(values.dataInline && values.dataInline.ptrack_content_image) || ""}
                  onChange={handleChange("ptrack_content_image")}
                  margin="normal"
              /><br/>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="select-multiple-chip">Select Category</InputLabel>
                <Select
                  multiple
                  value={(values.dataInline && values.dataInline.category_id) || (values.dataInline && values.dataInline.categories && values.dataInline.categories.map(x => x.category_id)) || []}
                  onChange={handleChange("category_id")}
                  input={<Input id="select-multiple-chip" />}
                  renderValue={selected => (
                    <div className={classes.chips}>
                      {selected.map(value => (
                        <Chip key={value} label={categoryNames[value] || ""} className={classes.chip} />
                      ))}
                    </div>
                  )}
                  MenuProps={MenuProps}
                >
                  {props.categories.list.map(cat => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl><br/>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="age-helper">Select Serie Type</InputLabel>
                <Select
                  value={(values.dataInline && values.dataInline.serie_type_id) || 0}
                  onChange={handleChange("serie_type_id")}
                >
                  {props.serie_type.list.map(type => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl><br/>
              <TextField
                id="activate_at"
                label="Activate At"
                type="date"
                defaultValue={values.dataInline && values.dataInline.activate_at}
                className={classes.TextField}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleChange('activate_at')}
              />
              <TextField
                id="deactivate_at"
                label="Deactivate At"
                type="date"
                defaultValue={values.dataInline && values.dataInline.deactivate_at}
                className={classes.TextField}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleChange('deactivate_at')}
              /><br/>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="age-helper">Watch Condition Plan ()</InputLabel>
                <Select
                  value={(values.dataInline && values.dataInline.condition_plan_id) || 0}
                  onChange={handleChange("condition_plan_id")}
                >
                  <MenuItem value="0">
                    <em>&nbsp;</em>
                  </MenuItem>
                  {props.plan.list.map(pl => (
                    <MenuItem key={pl.id} value={pl.id}>
                      {pl.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl><br/>
              <TextField
                type="number"
                key="Price-per-hour"
                label="Price per hour"
                defaultValue={(values.dataInline && values.dataInline.price_per_hour) || 0}
                onChange={handleChange('price_per_hour')}
                className={classes.TextField}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
              <TextField
                type="number"
                key="Price-to-buy"
                label="Price to buy"
                defaultValue={(values.dataInline && values.dataInline.price_to_buy) || 0}
                onChange={handleChange('price_to_buy')}
                className={classes.TextField}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              /><br/>
              {/* <FormControlLabel
                control={
                  <Checkbox checked={!!(values.dataInline && values.dataInline.is_series) || false} onChange={handleCheck('is_series')} />
                }
                label="Is Series"
              /><br/> */}
            </div>
            <div className="col-md-4 col-sm-6 col-xs-12 d-flex flex-column flex-start">
              <span className="text-black-50 mt-3">Preview Title Logo</span>
              <img src={(values.dataInline && values.dataInline.title_logo)} 
                className={classes.previewLogo} 
                alt="No logo available"
              />
              <span className="text-black-50 mt-3">Preview Cover</span>
              <img src={(values.dataInline && values.dataInline.cover)} 
                className={classes.previewLogo} 
                alt="No logo available"
              />
              <span className="text-black-50 mt-3">Preview Boxart Image</span>
              <img src={(values.dataInline && values.dataInline.boxart_image)} 
                className={classes.previewLogo} 
                alt="No logo available"
              />
              <span className="text-black-50 mt-3">Preview Bob background</span>
              <img src={(values.dataInline && values.dataInline.bob_background)} 
                className={classes.previewLogo} 
                alt="No logo available"
              />
              <span className="text-black-50 mt-3">Preview Jawbone Title Logo</span>
              <img src={(values.dataInline && values.dataInline.jawbone_title_logo)} 
                className={classes.previewLogo} 
                alt="No logo available"
              />
              <span className="text-black-50 mt-3">Preview Ptrack Content Image</span>
              <img src={(values.dataInline && values.dataInline.ptrack_content_image)} 
                className={classes.previewLogo} 
                alt="No logo available"
              />
            </div>
          </div>
          
        </PortletBody>
      </Portlet>
      {values.editingStatus === "EDIT" && 
        <VideoFiles
          video_id={id}
          video={main_video}
          videos={props.videos}
          categories={props.categories}
          serie_type={props.serie_type}
          plan={props.plan}
          language={props.language}
        />
      }
      <MySnackBar 
        open={values.snackOpen} 
        message={values.snackMessage} 
        onClose={()=>setValues({...values, snackOpen: false, error: "", success: ""})}
        variant={values.snackType}
        vertical="top"
        horizontal="right"
      />
    </>
  );
}

export default injectIntl(
  connect(
    ({ videos, categories, serie_type, plan, language }) => ({ videos, categories, serie_type, plan, language }),
    {
      ...actions,
      loadAllCategories: actions_categories.loadAll,
      loadAllSerieTypes: actions_serie_types.loadAll,
      loadAllPlans: actions_plans.loadAll,
      loadAllLangs: actions_langs.loadAll,
    }
  )(MyComp)
);