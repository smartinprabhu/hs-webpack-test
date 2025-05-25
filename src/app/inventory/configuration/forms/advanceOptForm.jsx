/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

import PropTypes from 'prop-types';
import { useFormikContext } from 'formik';
import MuiCheckboxField from '../../../commonComponents/formFields/muiCheckbox';

const AdvanceOptForm = React.memo((props) => {
  const {
    formField: {
      showOperations,
      showReserved,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    show_operations,
  } = formValues;

  return (
    <>
      <div className='pt-3'>
        <MuiCheckboxField
          name={showOperations.name}
          label={showOperations.label}
        />
        {!show_operations
          ? (
            <MuiCheckboxField
              name={showReserved.name}
              label={showReserved.label}
            />

          ) : ''}
      </div>
    </>
  );
});

AdvanceOptForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired
};

export default AdvanceOptForm;
