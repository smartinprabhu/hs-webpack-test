/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Col,
} from 'reactstrap';

import MuiTextField from '../../../commonComponents/formFields/muiTextField';

const RequestorForm = (props) => {
  const {
    formField: {
      title,
    },
  } = props;

  return (
    <>
      {/* <Typography sx={{ fontWeight: 600, fontSize: '18px' }}>Checklist Info</Typography> */}
      <Col xs={6} sm={6} md={6} lg={6} className="mt-2">
        <MuiTextField placeholder={title.placeHolder} name={title.name} label={title.label} isRequired type="text" inputProps={{ maxLength: 150 }} />
      </Col>
    </>
  );
};

RequestorForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default RequestorForm;
