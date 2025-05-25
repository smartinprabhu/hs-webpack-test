/* eslint-disable camelcase */
// useDocumentUploader.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormikContext } from 'formik';

import {
  resetupdateUserPasswordInfo,
  resetPasswordExists,
} from '../../setupService';

const CurrentPasswordValidation = () => {
  const { values: formValues } = useFormikContext();
  const {
    current_password, new_password, password,
  } = formValues;
  const { updateUserPasswordInfo } = useSelector((state) => state.setup);

  const dispatch = useDispatch();

  useEffect(() => {
    if (updateUserPasswordInfo && !updateUserPasswordInfo.data) {
      dispatch(resetupdateUserPasswordInfo());
    }
  }, [updateUserPasswordInfo, current_password, new_password, password]);

  return (
    <span />
  );
};

export default CurrentPasswordValidation;
