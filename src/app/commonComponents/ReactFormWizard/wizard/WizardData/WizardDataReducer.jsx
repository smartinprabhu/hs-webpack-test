import _ from 'lodash';
import { WIZARD_API_ACTIONS } from '../WizardAPI/WizardAPIContext';

export const currentStepReducer = ({ steps, currentStepIndex }, { type, payload }) => {
  switch (type) {
    case WIZARD_API_ACTIONS.MOVE_TO_PREVIOUS_STEP:
      if (currentStepIndex === 0) {
        return { steps, currentStepIndex };
      }

      const prevIndex = _.findLastIndex(steps, (step, index) => index < currentStepIndex && !step.ignore);

      return { steps, currentStepIndex: prevIndex < 0 ? currentStepIndex : prevIndex };
    case WIZARD_API_ACTIONS.MOVE_TO_NEXT_STEP:
      if (currentStepIndex >= _.size(steps) - 1) {
        return { steps, currentStepIndex };
      }

      const nextIndex = _.findIndex(steps, (step, index) => index > currentStepIndex && !step.ignore);

      return { steps, currentStepIndex: nextIndex < 0 ? currentStepIndex : nextIndex };
    case WIZARD_API_ACTIONS.MOVE_TO_STEP_BY_ID:
      const { id } = payload;
      const targetIndex = _.findIndex(steps, { id });

      if (targetIndex < 0) {
        return { steps, currentStepIndex };
      }

      if (steps[targetIndex].ignore) {
        return { steps, currentStepIndex };
      }

      return { steps, currentStepIndex: targetIndex };
    case WIZARD_API_ACTIONS.MOVE_TO_STEP_BY_INDEX:
      const { stepIndex } = payload;
      if (stepIndex < 0 || stepIndex >= _.size(steps)) {
        return { steps, currentStepIndex };
      }

      if (steps[stepIndex].ignore) {
        return { steps, currentStepIndex };
      }

      return { steps, currentStepIndex: stepIndex };
    case WIZARD_API_ACTIONS.TOGGLE_IGNORE_STEP:
      const { stepId, newState } = payload;
      const stepsCopy = _.map(steps, (step) => (step.id === stepId ? { ...step, ignore: newState } : step));
      return { steps: stepsCopy, currentStepIndex };
    default:
      return { steps, currentStepIndex };
  }
};
