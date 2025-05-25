/* eslint-disable import/no-unresolved */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Row, Col, Card, CardBody,
} from 'reactstrap';
import { ThemeProvider } from '@material-ui/core/styles';

import { InputField } from '@shared/formFields';
import theme from '../../../util/materialTheme';

const DescriptionForm = (props) => {
  const {
    formField: {
      description,
    },
  } = props;

  return (
    <>
      <Card className="no-border-radius mb-2">
        <CardBody className="p-0 bg-porcelain">
          <p className="ml-3 mb-1 mt-1 font-weight-600 font-side-heading">Description</p>
        </CardBody>
      </Card>
      <Row className="mb-3 pl-3 mr-4">
        <ThemeProvider theme={theme}>
          <Col xs={12} sm={12} md={12} lg={12} className="pr-5">
            <InputField
              name={description.name}
              label={description.label}
              labelClassName="font-weight-500"
              formGroupClassName="ml-0 mr-1 mb-1 mt-1"
              type="textarea"
              rows="3"
              maxLength="750"
            />
          </Col>
        </ThemeProvider>
      </Row>
    </>
  );
};

DescriptionForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default DescriptionForm;
