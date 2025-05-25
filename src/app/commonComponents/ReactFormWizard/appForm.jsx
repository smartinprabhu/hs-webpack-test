import React from 'react';
import { WizardRoot } from './wizard/WizardRoot';
import WizardBox from './components/WizardBox/WizardBox';
import WizardStepContainer from './components/WizardStepContainer/WizardStepContainer';

const AppForm = ({ steps, onComplete, onDraft, editValue}) => (
  <WizardRoot
    steps={steps}
    editValue={editValue}
    onComplete={onComplete}
    onDraft={onDraft}
  >
    <WizardBox>
      <div className="tree-card-center" />
      <div className="hv-80 tree-card-form tree-card-full thin-scrollbar">
        <WizardStepContainer />
      </div>
    </WizardBox>
  </WizardRoot>
);

export default AppForm;
