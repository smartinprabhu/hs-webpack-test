/* eslint-disable camelcase */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/no-unresolved */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Row, Col, FormGroup, Label, Input,
} from 'reactstrap';
import { ThemeProvider } from '@material-ui/core/styles';
import { useFormikContext } from 'formik';
import DOMPurify from 'dompurify';

import theme from '../../util/materialTheme';

const RemarksForm = (props) => {
  const {
    setFieldValue,
    formField: {
      remark,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const { remarks } = formValues;

  const onChange = (data) => {
    setFieldValue('remarks', DOMPurify.sanitize(data.target.value));
  };

  return (
    <ThemeProvider theme={theme}>
      <Row className="mb-3 requestorForm-input">
        <Col xs={12} sm={12} md={6} lg={6}>
          <FormGroup className="mb-1">
            <>
              <Label for={remark.name} className="mb-1">
                {remark.label}
              </Label>
              <Input
                name={remark.name}
                label={remark.label}
                value={remarks}
                onChange={onChange}
                onBlur={onChange}
                type="textarea"
                rows="3"
              />
            </>
          </FormGroup>
        </Col>
      </Row>
    </ThemeProvider>
  );
};

RemarksForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default RemarksForm;
