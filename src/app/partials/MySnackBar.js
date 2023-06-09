import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import { amber, green } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import { makeStyles } from '@material-ui/core/styles';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const useStyles1 = makeStyles(theme => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.main,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  boundary: {
    position: "fixed",
    top: "20px",
    right: "20px"
  }
}));

export default function MySnackBar(props) {
  const classes = useStyles1();
  const { className, message, onClose, variant, vertical, horizontal, open } = props;
  const Icon = variantIcon[variant];

  return (
    <Snackbar
        anchorOrigin={{
          vertical,
          horizontal
        }}
        open={open}
        autoHideDuration={6000}
        onClose={onClose}
        className={classes.boundary}
      >
      <SnackbarContent
        className={clsx(classes[variant], className)}
        aria-describedby="client-snackbar"
        message={
          <span id="client-snackbar" className={classes.message}>
            <Icon className={clsx(classes.icon, classes.iconVariant)} />
            {message || "Empty Message"}
          </span>
        }
        action={[
          <IconButton key="close" aria-label="Close" color="inherit" onClick={onClose}>
            <CloseIcon className={classes.icon} />
          </IconButton>,
        ]}
      />
    </Snackbar>
  );
}

MySnackBar.propTypes = {
  className: PropTypes.string,
  message: PropTypes.node,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
  vertical: PropTypes.string,
  horizontal: PropTypes.string,
  open: PropTypes.bool
};

const useStyles2 = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

export function CustomizedSnackbars() {
  const classes = useStyles2();
  const [open, setOpen] = React.useState(false);

  function handleClick() {
    setOpen(true);
  }

  function handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  }

  return (
    <div>
      <Button variant="outlined" className={classes.margin} onClick={handleClick}>
        Open success snackbar
      </Button>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <MySnackBar
          onClose={handleClose}
          variant="success"
          message="This is a success message!"
        />
      </Snackbar>
      <MySnackBar
        variant="error"
        className={classes.margin}
        message="This is an error message!"
      />
      <MySnackBar
        variant="warning"
        className={classes.margin}
        message="This is a warning message!"
      />
      <MySnackBar
        variant="info"
        className={classes.margin}
        message="This is an information message!"
      />
      <MySnackBar
        variant="success"
        className={classes.margin}
        message="This is a success message!"
      />
    </div>
  );
}