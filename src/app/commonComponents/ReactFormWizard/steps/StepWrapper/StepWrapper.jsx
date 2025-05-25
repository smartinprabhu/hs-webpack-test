import React from 'react';
import styles from './StepWrapper.module.scss';
import ButtonGroup from '../../components/ButtonGroup/ButtonGroup';

const StepWrapper = ({
  children, onNext, onBack, isdisabled,
}) => (
  <div className={styles.root}>
    <div className={styles.content}>
      {children}
    </div>
    <ButtonGroup onNext={onNext} onBack={onBack} isdisabled />
  </div>
);

export default StepWrapper;
