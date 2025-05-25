import React from 'react';
import styles from './WizardStepContainer.module.scss';
import { useWizardData} from '../../wizard/WizardRoot.jsx';

const WizardStepContainer = () => {
  const {currentStepComponent: CurrentStepComponent, currentStepId} = useWizardData();

  return (
    <main className={styles.main}>
     {/* <h3>{currentStepId}</h3>*/}
      <div className={styles.content}>
       <CurrentStepComponent/>
      </div>
    </main>
  );
};

export default WizardStepContainer;
