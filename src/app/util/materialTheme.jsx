import { createTheme } from '@material-ui/core';

const materialTheme = createTheme({
  typography: {
    body1: {
      fontFamily: 'Lato,sansSerif',
      fontWeight: 400,
      fontSize: '0.875rem',
    },
    h6: {
      fontFamily: 'Lato,sansSerif',
      fontWeight: 400,
    },
  },
});

export default materialTheme;
