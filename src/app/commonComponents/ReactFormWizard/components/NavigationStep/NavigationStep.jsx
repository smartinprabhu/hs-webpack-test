import {
  ListItem, ListItemText, Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { useWizardAPI } from '../../wizard/WizardRoot.jsx';

const NavigationStep = ({
  stepId, stepName, isCurrentStep, ignore, index, currentStepIndex,
}) => {
  const { moveToStepById } = useWizardAPI();
  const [isHovered, setIsHovered] = React.useState(false);

  const handleClick = () => {
    if (isCurrentStep) {
      return;
    }
    moveToStepById(stepId);
  };

  if (ignore) {
    return null;
  }

  const getStyle = (currentStep) => {
    let styleApply = {
      borderLeft: '12px solid #00000040',
      borderRadius: '4px',
      background: '#0000000d',
      margin: '15px 3px',
      padding: '6px 5px',
      cursor: 'pointer',
    };
    if (currentStep) {
      styleApply = {
        borderLeft: '12px solid #168dfc',
        borderRadius: '4px',
        background: '#0789b50d',
        margin: '15px 3px',
        padding: '6px 5px',
        cursor: 'pointer',
      };
    }
    if (index < currentStepIndex) {
      styleApply = {
        borderLeft: '12px solid #28a745',
        borderRadius: '4px',
        background: '#28a7450d',
        margin: '15px 3px',
        padding: '6px 5px',
        cursor: 'pointer',
      };
    }
    return styleApply;
  };

  return (
    <Box
      sx={getStyle(isCurrentStep)}
      onClick={(index > currentStepIndex) ? {} : handleClick}
      // onClick={index === 0 || (index > currentStepIndex) || (index < currentStepIndex && index === 0) ? {} : handleClick}
      // onClick={ handleClick}
    >
      <ListItem
        alignItems="flex-start"
        disablePadding
      >
        <ListItemText
          disableTypography
          primary={<Typography variant="body2" sx={{ fontWeight: 600, fontSize: '17px' }}>{stepId}</Typography>}
        />
      </ListItem>
      <ListItem
        alignItems="flex-start"
        disablePadding
      >
        <ListItemText
          secondary={(
            <Typography
              sx={{ display: 'inline', fontSize: '15px' }}
              component="span"
              variant="body2"
              color="text.primary"
            >
              {stepName}
            </Typography>
        )}
        />
      </ListItem>
    </Box>
  );
};

export default NavigationStep;
