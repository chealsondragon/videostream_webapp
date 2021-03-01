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

import QuickStatsChart from "../../../widgets/Report/QuickStatsChart";
import NewUsers from "../../../widgets/Report/NewUsers";
import TopActiveUsers from "../../../widgets/Report/TopActiveUsers";
import TopWatchingUsers from "../../../widgets/Report/TopWatchingUsers";
import * as api from "../../../crud/report.crud";

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
    data: [],
  });

  const handleChangeDate = (key) => (event) => {
    setValues({...values, [key]: event.target.value})
  }

  const loadData = React.useMemo(() => (dateFrom, dateTo) => {
    dateFrom = dateFrom || moment().format("YYYY-MM-DD");
    dateTo = dateTo || moment().format("YYYY-MM-DD");

    console.log(dateFrom, dateTo)
  }, []);

  React.useEffect(() => {
    api.getUserData(values.dateFrom, values.dateTo)
      .then(result => {
        result.data && setValues({...values, data: result.data})
      })
      .catch(error => {
        console.log(error)
      })
  }, [values.dateFrom, values.dateTo])

  return (
    <>
      <Notice className="d-none flex-column align-content-center">
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
      <div className="row">
        <div className="col-xl-12">
          <div className="row row-full-height">
            <div className="col-sm-4 col-md-4 col-lg-4">
              <Portlet className=" kt-portlet--border-bottom-brand">
                <PortletBody fluid={true}>
                  <QuickStatsChart
                    value={values.data && values.data.total_user || 0}
                    desc="Total Users"
                  />
                </PortletBody>
              </Portlet>

            </div>

            <div className="col-sm-4 col-md-4 col-lg-4">

              <Portlet className=" kt-portlet--border-bottom-brand">
                <PortletBody fluid={true}>
                  <QuickStatsChart
                    value={values.data && values.data.total_profile || 0}
                    desc="Profile Created"
                  />
                </PortletBody>
              </Portlet>
            </div>

            <div className="col-sm-4 col-md-4 col-lg-4">
              <Portlet className=" kt-portlet--border-bottom-brand">
                <PortletBody fluid={true}>
                  <QuickStatsChart
                    value={values.data && values.data.subscribers || 0}
                    desc="Subscribers"
                  />
                </PortletBody>
              </Portlet>

            </div>

          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-xl-4">
          <TopActiveUsers profiles={values.data && values.data.active_profiles || []}/>
        </div>
        <div className="col-xl-4">
          <NewUsers profiles={values.data && values.data.recent_created_profiles || []}/>
        </div>
        <div className="col-xl-4">
          <TopWatchingUsers profiles={values.data && values.data.top_watching_profiles || []}/>
        </div>
      </div>
    </>
  );
}
