import {createContext, useContext} from 'react';

export const WizardDataContext = createContext({
  steps: [],
  currentStepIndex: 0,
  isCurrentStepLastStep: null,
  isCurrentStepFirstStep: null,
  stepsLength: 0,
  currentStepComponent: null,
  currentStepId: null
});

export const useWizardDataContext = () => useContext(WizardDataContext);

export const WizardDataProvider = WizardDataContext.Provider;
