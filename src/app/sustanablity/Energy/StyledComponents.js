import { styled } from '@mui/material/styles';
import { Radio, FormControlLabel } from '@mui/material';

// Custom styled radio button
export const CustomRadio = styled(Radio)({
  color: 'white',
  '&.Mui-checked': {
    color: 'white',
  },
});

// Custom styled FormControlLabel
export const CustomFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  color: 'white',
  textTransform: 'uppercase',
  '& .MuiFormControlLabel-label': {
    color: 'white',
    fontFamily: 'Mulish',
  },
}));
