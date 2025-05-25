/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/require-default-props */
/* eslint-disable import/no-unresolved */
import React from 'react';
import * as PropTypes from 'prop-types';
import SettingsIcon from '@mui/icons-material/Settings';
import HandymanIcon from '@mui/icons-material/Handyman';
import SummarizeIcon from '@mui/icons-material/Summarize';
import { makeStyles } from '@material-ui/core/styles';

import { AddThemeColor } from '../../themes/theme';

const StepIcon = (props) => {
  const { active, completed, className } = props;

  const icons = {
    1: <HandymanIcon />,
    2: <SettingsIcon />,
    3: <SummarizeIcon />,
  };

  const useStyles = makeStyles((theme) => ({
    root: {
      zIndex: 1,
      color: '#fff',
      width: 50,
      height: 50,
      display: 'flex',
      borderRadius: '50%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: (props) => {
        if (props.completed) {
          return AddThemeColor({}).color; // color for completed state
        }
        if (props.active) {
          return AddThemeColor({}).color; // color for active state
        }
        return theme.palette.grey[500]; // default color
      },
    },
  }));

  const classes = useStyles({ active, completed });

  return (
    <div className={`${classes.root} ${className}`}>
      {icons[String(props.icon)]}
    </div>
  );
};

StepIcon.propTypes = {
  /**
     * Whether this step is active.
     * @default false
     */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
     * Mark the step as completed. Is passed to child components.
     * @default false
     */
  completed: PropTypes.bool,
  /**
     * The label displayed in the step icon.
     */
  icon: PropTypes.node,
};
export default StepIcon;
