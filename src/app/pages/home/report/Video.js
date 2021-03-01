import React, { useMemo } from "react";
import { useSelector, connect } from "react-redux";
import {
  Portlet,
  PortletBody,
  PortletHeader,
  PortletHeaderToolbar
} from "../../../partials/content/Portlet";

import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import {  TextField,  Button, Paper, Table, TableCell, TableBody, TableHead, TableRow } from "@material-ui/core";
import CircularProgress from '@material-ui/core/CircularProgress';
import MySnackBar from "../../../partials/MySnackBar";
import Notice from "../../../partials/content/Notice";

import WatchTime from "../../../widgets/Report/WatchTime";
import LatestWatch from "../../../widgets/Report/LatestWatch";
import TopRated from "../../../widgets/Report/TopRated";

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
  genRoot: {
    width: '100%',
    overflowX: 'auto',
    padding: '10px',
    marginBottom: '-30px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  searchRoot: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    background: "#ffffff",
    border: "1px solid #ffffff",
    color: "#282a3c",
  },
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },

  formControl: {
    margin: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(2),
    minWidth: 200,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  LinkPreview: {
    color: "blue",
    fontSize: "11px"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

export default function Dashboard() {
  const classes = useStyles();

  const [values, setValues] = React.useState({
    dateFrom: moment().add(-1,'M').format("YYYY-MM-DD"),
    dateTo: moment().format("YYYY-MM-DD"),

    error: "",
    success: "",

    snackOpen: false,
    snackType: "info",
    snackMessage: "",

    isLoading: false,
  });

  const handleChangeDate = (key) => (event) => {
    setValues({...values, [key]: event.target.value})
  }

  const loadData = React.useMemo(() => (dateFrom, dateTo) => {
    dateFrom = dateFrom || moment().format("YYYY-MM-DD");
    dateTo = dateTo || moment().format("YYYY-MM-DD");

    console.log(dateFrom, dateTo)
  }, []);

  return (
    <>
      <Notice className="d-flex flex-column align-content-center ">
        <div className={classes.searchRoot}>
        <TextField
          key="date_from"
          label="Date From"
          type="date"
          value={values.dateFrom}
          onChange={handleChangeDate("dateFrom")}
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          key="date_to"
          label="Date To"
          type="date"
          value={values.dateTo}
          onChange={handleChangeDate("dateTo")}
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button variant="contained" color="secondary" onClick={() => loadData(values.dateFrom, values.dateTo)} className="ml-3 d-none">
          RELOAD
        </Button>
        {!!values.isLoading && <CircularProgress className={classes.progress} />}
        </div>
      </Notice>
      <Portlet>
        <PortletBody fit={true}>
          <div className="row row-no-padding row-col-separator-xl mt-3">
            <div className="col-12">
              <WatchTime
                title="Watch Time(min)"
                desc=""
                dateFrom={values.dateFrom}
                dateTo={values.dateTo}
              />
            </div>
          </div>
        </PortletBody>
      </Portlet>

      <div className="row">
        <div className="col-xl-6">
          <TopRated dateFrom={values.dateFrom} dateTo={values.dateTo}/>
        </div>
        <div className="col-xl-6">
          <LatestWatch dateFrom={values.dateFrom} dateTo={values.dateTo}/>
        </div>
      </div>
    </>
  );
}
