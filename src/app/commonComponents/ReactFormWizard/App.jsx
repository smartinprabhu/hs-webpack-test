import React from 'react';
import { WizardRoot } from './wizard/WizardRoot';
import WizardNavigation from './components/WizardNavigation/WizardNavigation';
import WizardBox from './components/WizardBox/WizardBox';
import WizardStepContainer from './components/WizardStepContainer/WizardStepContainer';

const App = ({
  steps, onComplete, onDraft, editValue,
}) => (
  <WizardRoot
    steps={steps}
    editValue={editValue}
    onComplete={onComplete}
    onDraft={onDraft}
  >
    <WizardBox>
      <div
        className="hv-80 tree-card-form tree-card-left thin-scrollbar"
      >
        <WizardNavigation />
      </div>
      <div
        className="tree-card-center"
      />
      <div
        className="hv-80 tree-card-form tree-card-right thin-scrollbar"
      >
        <WizardStepContainer />
      </div>
    </WizardBox>
  </WizardRoot>
);

export default App;
