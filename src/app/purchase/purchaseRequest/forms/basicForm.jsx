/* eslint-disable import/no-unresolved */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Row, Col,
} from 'reactstrap';
import { ThemeProvider } from '@material-ui/core/styles';

import { InputField } from '@shared/formFields';
import theme from '../../../util/materialTheme';

const BasicForm = (props) => {
  const {
    formField: {
      requisitionName,
    },
  } = props;

  return (
    <>
      <Row className="mb-3 pl-3 mr-4">
        <ThemeProvider theme={theme}>
          <Col xs={12} sm={6} md={6} lg={6} className="pr-5">
            <InputField
              name={requisitionName.name}
              label={requisitionName.label}
              isRequired
              formGroupClassName="m-1"
              type="text"
              maxLength="100"
            />
          </Col>
        </ThemeProvider>
      </Row>
    </>
  );
};

BasicForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default BasicForm;
