import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import {  TextField,  Button, Paper, Table, TableCell, TableBody, TableHead, TableRow } from "@material-ui/core";
import {  Portlet,  PortletBody,  PortletHeader } from "../../partials/content/Portlet";
import CircularProgress from '@material-ui/core/CircularProgress';
import MySnackBar from "../../partials/MySnackBar";
import Notice from "../../partials/content/Notice";

import GameStackChart from '../../widgets/ReportGameStack';

import { actions as actions_report } from "../../store/ducks/report.duck";
import * as api from '../../crud/report.crud';

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

function ReportComp(props) {
  const classes = useStyles();

  const [values, setValues] = React.useState({
    dateFrom: moment().format("YYYY-MM-DD"),
    dateTo: moment().format("YYYY-MM-DD"),

    error: "",
    success: "",

    snackOpen : false,
    snackType : "info",
    snackMessage: "",

    selectedChannelId: 0,
    selectedOfferId: 0,
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
  
  const loadData = React.useMemo(() => (dateFrom, dateTo) => {
    dateFrom = dateFrom || moment().format("YYYY-MM-DD");
    dateTo = dateTo || moment().format("YYYY-MM-DD");

    props.setLoading(true);
    api.loadGameSummary(dateFrom, dateTo)
      .then((result) => {
        console.log("Loading game summary data success!")
        props.loadGameSummary(result.data);
      })
      .catch((error) => {
        console.log(error);
        console.log("Error in loading game summary data!")
        props.setLoading(false);
      })

    api.loadGameStats(dateFrom, dateTo)
      .then((result) => {
        console.log("Loading game stats data success!")
        props.loadGameStats(result.data);
      })
      .catch((error) => {
        console.log(error);
        console.log("Error in loading game stats data!")
        props.setLoading(false);
      })
  }, []);

  React.useEffect(() => {
    loadData();
  }, []);

  const handleChangeDate = (key) => (event) => {
    setValues({...values, [key]: event.target.value})
  }

  return (
    <>
      <Notice>
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
        <Button variant="contained" color="primary" onClick={() => loadData(values.dateFrom, values.dateTo)} className="ml-3">
          Refresh Data
        </Button>
        {!!props.report.isLoading && <CircularProgress className={classes.progress} />}
        </div>
      </Notice>

      <div className="row">
        <div className="col-xl-12">
          <GameStackChart data={ props.report.game_amount_data }/>
        </div>
      </div>

      <Portlet className="mt-4">
        <PortletHeader title="Stats">
        </PortletHeader>
        <PortletBody>
          {!!props.report.isLoading && <CircularProgress className={classes.progress} />}
          {!props.report.isLoading && <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Game</TableCell>
                  <TableCell>Media/Channel</TableCell>
                  <TableCell>Amount(€)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.report.game_stats.map((row, index) => (
                  <TableRow key={`data-${row.date}`}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.game_name}</TableCell>
                    <TableCell>{row.provider}</TableCell>
                    <TableCell>{row.total_amount}</TableCell>
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
    </>
  );
}

export default injectIntl(
  connect(
    ({ report }) => ({ report }),
    {
      setLoading: actions_report.setLoading,
      loadGameSummary: actions_report.loadGameSummary,
      loadGameStats: actions_report.loadGameStats
    }
  )(ReportComp)
);