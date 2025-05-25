/* eslint-disable react/jsx-props-no-spreading */
// import Switch from '@material-ui/core/Switch';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';

// eslint-disable-next-line import/prefer-default-export
// export const ToggleSwitch = withStyles((theme) => ({
//   root: {
//     width: 28,
//     height: 16,
//     padding: 0,
//     display: 'flex',
//   },
//   switchBase: {
//     padding: 2,
//     color: theme.palette.grey[500],
//     '&$checked': {
//       transform: 'translateX(12px)',
//       color: theme.palette.common.white,
//       '& + $track': {
//         opacity: 1,
//         backgroundColor: '#54c500',
//         borderColor: '#54c500',
//       },
//     },
//   },
//   thumb: {
//     width: 12,
//     height: 12,
//     boxShadow: 'none',
//   },
//   track: {
//     border: `1px solid ${theme.palette.grey[500]}`,
//     borderRadius: 16 / 2,
//     opacity: 1,
//     backgroundColor: theme.palette.common.white,
//   },
//   checked: {},
// }))(Switch);

export const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  root1: {
    '&:checked': {
      backGround: '#3a4354',
    },
  },
  label: {
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
  },
  selectedLabel: {
    height: '120px',
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
  },
  labelRoot: {
    display: 'flex',
    alignItems: 'center',
    height: 'inherit',
    padding: theme.spacing(1),
    backgroundColor: '#fff',
  },
  selectedLabelRoot: {
    alignItems: 'center',
    padding: theme.spacing(1),
    backgroundColor: '#fff',
  },
  expanded: {},
  statusMsg: {
    fontSize: '10px',
  },
}));

export const useStyles2 = makeStyles({
  root: {
    color: 'default',
    '&$checked': {
      color: '#3a4354',
    },
  },
});

export const CustomCheckbox = withStyles({
  root: {
    color: '#00001d',
    '&$checked': {
      color: '#3a4354',
    },
  },
  checked: {},
  // eslint-disable-next-line react/jsx-props-no-spreading
// eslint-disable-next-line react/react-in-jsx-scope
})((props) => <Checkbox color="default" size="small" {...props} />);
