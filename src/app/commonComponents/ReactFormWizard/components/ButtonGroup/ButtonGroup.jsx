import React from 'react';
import _ from 'lodash';
import { Button } from '@mui/material';

import { useWizardAPI, useWizardData, useWizardState } from '../../wizard/WizardRoot.jsx';
import { checkMaintenanceRequiredFields, checkMaintenanceRequiredFieldsCombine } from '../../../../adminSetup/utils/utils.jsx';

const ButtonGroup = ({ onBack, onNext }) => {
  const { isCurrentStepLastStep, isCurrentStepFirstStep, currentStepIndex, stepsLength } = useWizardData();
  const {
    moveToPreviousStep, moveToNextStep, onComplete, onDraft,
  } = useWizardAPI();
  const { editValue } = useWizardData();
  const { wizardState, setWizardState } = useWizardState();
  const btnDisabled = stepsLength === 4 ? !checkMaintenanceRequiredFields([wizardState], currentStepIndex) : !checkMaintenanceRequiredFieldsCombine([wizardState], currentStepIndex); 
  return (
    <div className="buttonGroup-step-form sticky-button-85drawer">
      {/* {!isCurrentStepFirstStep && ( */}
      {((stepsLength === 3 && (isCurrentStepLastStep || currentStepIndex === 1) && wizardState.state !== 'Done') || (stepsLength === 4 && (isCurrentStepLastStep || currentStepIndex === 2) && wizardState.state !== 'Done')) && (
        <Button
          // className={styles.button}
          disabled={btnDisabled}
          sx={btnDisabled ? { backgroundColor: '#0000001f !important', cursor: 'not-allowed !important' } : { backgroundColor: '#d3ad3a !important' }}
          variant="contained"
          className="submit-btn-auto"
          onClick={() => { onDraft(); }}
        >
          Save As Draft
        </Button>
      )}
      {(currentStepIndex !== 0) && (
        <Button
          // className={styles.button}
          sx={{ backgroundColor: '#4a4f53 !important' }}
          variant="contained"
          className="submit-btn"
          onClick={() => {
            _.isFunction(onBack) && onBack();
            moveToPreviousStep();
          }}
        >
          Back
        </Button>
      )}
      <Button
        // className={styles.button}
        disabled={btnDisabled}
        variant="contained"
        className={isCurrentStepLastStep ? 'submit-btn-auto float-right' : 'submit-btn float-right'}
        onClick={() => {
          _.isFunction(onNext) && onNext();
          isCurrentStepLastStep ? onComplete() : moveToNextStep();
        }}
      >
        {editValue && editValue[0].editId && isCurrentStepLastStep && wizardState.state === 'Draft' ? 'Update & Publish' : editValue && editValue[0].editId && isCurrentStepLastStep ? 'Update' : editValue && !editValue[0].editId && isCurrentStepLastStep ? 'Save & Publish' : 'Next'}
      </Button>
    </div>
  );
};

export default ButtonGroup;
