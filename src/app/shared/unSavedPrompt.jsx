import React from 'react';
import { Prompt } from 'react-router-dom';
import { useFormikContext } from 'formik';

const UnSavedPrompt = () => {
  const formik = useFormikContext();
  return (
    <Prompt
      when={formik.dirty}
      message="Are you sure you want to leave? You have unsaved changes."
    />
  );
};

export default UnSavedPrompt;
