import React from 'react';
import { useWizardData, useWizardState } from '../../wizard/WizardRoot.jsx';
import NavigationStep from '../NavigationStep/NavigationStep.jsx';

const WizardNavigation = () => {
  const { steps, currentStepIndex } = useWizardData();
  const { wizardState } = useWizardState();

  if (wizardState?.ignoreNavigation) {
    return null;
  }

  return (
    steps.length > 0 && steps
      .map(({
        id, name, status, ignore,
      }, index) => (
        <NavigationStep
          stepId={id}
          stepName={name}
          isCurrentStep={index === currentStepIndex}
          status={status}
          index={index}
          currentStepIndex={currentStepIndex}
          key={id}
          ignore={ignore}
        />
      ))
  );
};

export default WizardNavigation;
