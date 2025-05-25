import React, {createContext, useContext, useMemo} from 'react';
import {useWizardStateContext} from '../WizardState/WizardStateContext.jsx';

export const WIZARD_API_ACTIONS = {
  MOVE_TO_PREVIOUS_STEP: 'MOVE_TO_PREVIOUS_STEP',
  MOVE_TO_NEXT_STEP: 'MOVE_TO_NEXT_STEP',
  MOVE_TO_STEP_BY_ID: 'MOVE_TO_STEP_BY_ID',
  MOVE_TO_STEP_BY_INDEX: 'MOVE_TO_STEP_BY_INDEX',
  UPDATE_STEP_STATUS: 'UPDATE_STEP_STATUS',
  TOGGLE_IGNORE_STEP: 'TOGGLE_IGNORE_STEP'
};

const WizardAPIContext = createContext({
  moveToPreviousStep: () => {},
  moveToNextStep: () => {},
  moveToStepById: (id) => {},
  moveToStepByIndex: (stepIndex) => {},
  onComplete: (wizardState) => {},
  onDraft: (wizardState) => {},
  toggleIgnoreStep: (stepId, newState) => {}
});

export const useWizardAPIContext = () => useContext(WizardAPIContext);

export const WizardAPIProvider = ({dispatch, children, onComplete, onDraft}) => {
  const {wizardState} = useWizardStateContext();

  const api = useMemo(() => ({
      moveToPreviousStep: () => dispatch({type: WIZARD_API_ACTIONS.MOVE_TO_PREVIOUS_STEP}),
      moveToNextStep: () => dispatch({type: WIZARD_API_ACTIONS.MOVE_TO_NEXT_STEP}),
      moveToStepById: id => dispatch({
        type: WIZARD_API_ACTIONS.MOVE_TO_STEP_BY_ID,
        payload: {id}
      }),
      moveToStepByIndex: stepIndex => dispatch({
        type: WIZARD_API_ACTIONS.MOVE_TO_STEP_BY_INDEX,
        payload: {stepIndex}
      }),
      onComplete: () => onComplete(wizardState),
      onDraft: () => onDraft(wizardState),
      toggleIgnoreStep: (stepId, newState) => dispatch({
        type: WIZARD_API_ACTIONS.TOGGLE_IGNORE_STEP,
        payload: {stepId, newState}
      })
    }
  ), [wizardState]);

  return (
    <WizardAPIContext.Provider value={api}>
      {children}
    </WizardAPIContext.Provider>
  );
};
