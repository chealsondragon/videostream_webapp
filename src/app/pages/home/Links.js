import React from "react";
import { connect } from "react-redux";
import { get } from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import {  Button, Paper, Table, TableCell, TableBody, TableHead, TableRow, IconButton } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { injectIntl } from "react-intl";

import {  Portlet,  PortletBody,  PortletHeader } from "../../partials/content/Portlet";

import * as api from '../../crud/link.crud'
import { actions } from "../../store/ducks/link.duck";

import { loadAll as loadAllChannel } from '../../crud/channel.crud'
import { actions as actions_channel } from "../../store/ducks/channel.duck";

import { loadAll as loadAllOffer } from '../../crud/offer.crud'
import { actions as actions_offer } from "../../store/ducks/offer.duck";

import MySnackBar from "../../partials/MySnackBar";

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
  }
}));

function LinkComp(props) {
  const classes = useStyles();
  
  const [values, setValues] = React.useState({
    dataInline: null,

    error: "",
    success: "",

    snackOpen : false,
    snackType : "info",
    snackMessage: "",
    
    selectedChannelId: 0,
    selectedOfferId: 0,
  });

  function handleChangeChannel(event) {
    setValues({...values, selectedChannelId: event.target.value})
  }

  function handleChangeOffer(event) {
    setValues({...values, selectedOfferId: event.target.value})
  }

  const loadLinks = React.useMemo(() => () => {
    props.setLoading(true);
    api.loadAll(props.auth.user.user_id)
      .then((result) => {
        //setValues({...values, success: "Loading links success!"})
        console.log("Loading links success!")
        props.loadAll(result.data || []);
      })
      .catch((error) => {
        //setValues({...values, error: "Error in loading links!"})
        console.log("Error in loading links!")
        props.setLoading(false);
      })
  }, []);

  function generateLink(){
    const selectedChannel = get(
      props.channel.list.filter((x) => x.id === values.selectedChannelId),
      ['0']
    );
    const selectedOffer = get(
      props.offer.list.filter((x) => x.id === values.selectedOfferId),
      ['0']
    );

    if(selectedOffer && selectedChannel){
      props.setActionProgress(true);
      api.generate({ 
          influencer_id: props.auth.user.user_id, 
          id_idcgame: selectedOffer.id_idcgame,
          utm_medium: `${props.auth.user.user_id}_${selectedChannel.media}_${selectedChannel.channel}`,
          offer_id: selectedOffer.offer_id
        })
        .then((result) => {
          setValues({...values, success: "Generating link success!"})
          //props.loadAll(result.data || []);
          loadLinks();
        })
        .catch((error) => {
          setValues({...values, error: "Error in generating link!"})
          props.setLoading(false);
        }).finally(() => {
          props.setActionProgress(false);
        })
    }
  }

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
    loadLinks();
    
    loadAllChannel()
      .then((result) => {
        console.log("Loading channels success!")
        props.loadAllChannel(result.data || []);
      })
      .catch((error) => {
        console.log("Loading channels fail!")
      })

    loadAllOffer()
      .then((result) => {
        console.log("Loading offers success!")
        props.loadAllOffer(result.data || []);
      })
      .catch((error) => {
        console.log("Loading offers fail!")
      })
  }, []);

  const previewLink = React.useMemo(() => {
    const selectedChannel = get(
      props.channel.list && Array.isArray(props.channel.list) && props.channel.list.filter((x) => x.id === values.selectedChannelId),
      ['0']
    );
    const selectedOffer = get(
      props.offer.list && Array.isArray(props.offer.list) && props.offer.list.filter((x) => x.id === values.selectedOfferId),
      ['0']
    );
    
    if(!selectedChannel || !selectedOffer)
      return "";

    return {
      landing: process.env.REACT_APP_LINK_TEMPLATE_LANDING
            .replace("{game_seo}", selectedOffer.game_seo)
            .replace("{utm_medium}", `${props.auth.user.user_id}_${selectedChannel.media}_${selectedChannel.channel}`)
            .replace("{utm_campaign}", `{campaign_id}_${selectedOffer.game_seo}`),
      home: process.env.REACT_APP_LINK_TEMPLATE_GAME_HOME
            .replace("{game_seo}", selectedOffer.game_seo)
            .replace("{utm_medium}", `${props.auth.user.user_id}_${selectedChannel.media}_${selectedChannel.channel}`)
            .replace("{utm_campaign}", `{campaign_id}_${selectedOffer.game_seo}`)
    }
  }, [props, values.selectedChannelId, values.selectedOfferId]);

  const copyLinkToClipBoard = (link) => {
    var textField = document.createElement('textarea')
    textField.innerText = link
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()

    setValues({...values, snackOpen: true, snackMessage: "Link copied to clipboard", snackType: "success"})
  }

  return (
    <>
      <Portlet>
        <PortletHeader title="Manage Links">
        </PortletHeader>
        <PortletBody>
          <Paper className={classes.genRoot}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="age-helper">Channel</InputLabel>
              <Select
                value={values.selectedChannelId}
                onChange={handleChangeChannel}
                input={null}
              >
                <MenuItem value="0">
                  <em>&nbsp;</em>
                </MenuItem>
                {Array.isArray(props.channel.list) && props.channel.list.map((row, index) => (
                  <MenuItem key={row.id} value={row.id}>{`${row.media}-${row.channel}`}</MenuItem>
                ))}
              </Select>
              <FormHelperText>Select channel</FormHelperText>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="age-helper">Offer</InputLabel>
              <Select
                value={values.selectedOfferId}
                onChange={handleChangeOffer}
                input={null}
              >
                <MenuItem value="0">
                  <em>&nbsp;</em>
                </MenuItem>
                {Array.isArray(props.offer.list) &&  props.offer.list.map((row, index) => (
                  <MenuItem key={row.id} value={row.id}>{`${row.game_name}-${row.percent}%`}</MenuItem>
                ))}
              </Select>
              <FormHelperText>Select offer</FormHelperText>
            </FormControl>
            <div>
              <Button variant="contained" color="primary" onClick={() => generateLink()}>
                <AddIcon /> Generate Link
              </Button>
              {!!props.link.isSaving && <CircularProgress size={20} thickness={5} className="ml-2"/>}
              <FormHelperText className={classes.LinkPreview}>Link Preview: {previewLink.landing}</FormHelperText>
            </div>
          </Paper>
        </PortletBody>
        <PortletBody>
          {!!props.link.isLoading && <CircularProgress className={classes.progress} />}
          {!props.link.isLoading && <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Created At(UTC)</TableCell>
                  <TableCell>Game</TableCell>
                  <TableCell>Media/Channel</TableCell>
                  <TableCell>Link</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.link.list.map((row, index) => (
                  <TableRow key={`data-${row.id}`}>
                    <TableCell component="th" scope="row">
                      {row.created_at}
                    </TableCell>
                    <TableCell>{row.game && row.game.name}</TableCell>
                    <TableCell>{get(row.utm_medium.split("_"), ['1'])}/{get(row.utm_medium.split("_"), ['2'])}</TableCell>
                    <TableCell>
                      <a target='_blank' rel="noopener noreferrer" href={row.link_game_home}>{row.link_game_home}</a>
                      <IconButton aria-label="Edit" onClick={() => copyLinkToClipBoard(row.link_game_home)}>
                        <EditIcon />
                      </IconButton><br/>
                      <a target='_blank' rel="noopener noreferrer" href={row.link_landing}>{row.link_landing}</a>
                      <IconButton aria-label="Edit" onClick={() => copyLinkToClipBoard(row.link_landing)}>
                        <EditIcon />
                      </IconButton><br/>
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
    </>

  );
}

export default injectIntl(
  connect(
    ({ link, channel, offer, auth }) => ({ link, channel, offer, auth }),
    {
      ...actions,
      loadAllChannel: actions_channel.loadAll,
      loadAllOffer: actions_offer.loadAll
    }
  )(LinkComp)
);