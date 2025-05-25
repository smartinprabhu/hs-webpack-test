import React, {
  useCallback, useMemo, useReducer,
} from 'react';
import _ from 'lodash';
import { currentStepReducer } from './WizardData/WizardDataReducer';
import { WizardDataProvider, useWizardDataContext } from './WizardData/WizardDataContext';
import { WizardAPIProvider, useWizardAPIContext } from './WizardAPI/WizardAPIContext';
import { WizardStateProvider, useWizardStateContext } from './WizardState/WizardStateContext';

export const WizardRoot = ({
  steps: originalSteps = [], onComplete, onDraft, editValue, children,
}) => {
  const mappedSteps = _.map(originalSteps, (step) => ({
    ...step,
    id: step?.id || Math.Random(),
    ignore: step?.ignore || false,
  }));
  const { wizardState, setWizardState } = useWizardStateContext();

  const getResumeIndex = (editdata) => {
    let stepEdit = 0;
    const bulkJson =editdata.bulk_inspection_json && (editdata.bulk_inspection_json).replace(/'/g, '"');
    const bulkjsondata = JSON.parse(bulkJson);
    if (editdata.state === 'Draft' && bulkjsondata) {
      stepEdit = parseInt(bulkjsondata?.currentStep);
    }
    return stepEdit;
  };
  const [{ steps, currentStepIndex }, dispatch] = useReducer(currentStepReducer, {
    steps: mappedSteps,
    // currentStepIndex: 0
    currentStepIndex: editValue && editValue.length && editValue[0].editId ? getResumeIndex(editValue[0].editData) : 1,
  });

  const currentStep = _.get(steps, currentStepIndex);

  // const isCurrentStepFirstStep = currentStepIndex === 0 || !_.find(steps, (step, index) => index < currentStepIndex && !step.ignore);
  const isCurrentStepFirstStep = currentStepIndex === (editValue && editValue.length && editValue[0].editId) ? getResumeIndex(editValue[0].editData) : 1 || !_.find(steps, (step, index) => index < currentStepIndex && !step.ignore);
  const stepsLength = _.size(steps);
  const isCurrentStepLastStep = stepsLength - 1 === currentStepIndex || !_.find(steps, (step, index) => index > currentStepIndex && !step.ignore);
  const currentStepComponent = currentStep?.component;
  const currentStepId = currentStep?.id;

  const data = useMemo(() => ({
    steps,
    editValue,
    currentStepIndex,
    isCurrentStepLastStep,
    isCurrentStepFirstStep,
    stepsLength,
    currentStepComponent,
    currentStepId,
  }), [
    steps,
    editValue,
    currentStepIndex,
    currentStepId,
    currentStep,
    isCurrentStepLastStep,
    isCurrentStepFirstStep,
    stepsLength,
    currentStepComponent,
  ]);

  return (
    <WizardDataProvider value={data}>
      <WizardStateProvider editValue={editValue}>
        <WizardAPIProvider dispatch={useCallback(dispatch, [])} onComplete={onComplete} onDraft={onDraft}>
          {children}
        </WizardAPIProvider>
      </WizardStateProvider>
    </WizardDataProvider>
  );
};

export const useWizardData = useWizardDataContext;
export const useWizardState = useWizardStateContext;
export const useWizardAPI = useWizardAPIContext;
