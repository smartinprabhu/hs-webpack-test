/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/no-unresolved */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Row, Col, FormGroup, Label, Input,
} from 'reactstrap';
import { ThemeProvider } from '@material-ui/core/styles';
import DOMPurify from 'dompurify';

import { InputField } from '@shared/formFields';
import { useFormikContext } from 'formik';

import theme from '../../util/materialTheme';

const DescriptionForm = (props) => {
  const {
    setFieldValue,
    formField: {
      title,
      descriptionOfBreakdown
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const { description_of_breakdown } = formValues;
  const onActionChange = (data) => {
    setFieldValue('description_of_breakdown', DOMPurify.sanitize(data.target.value));
  };

  return (
    <Row className="subjectForm-input">
      <ThemeProvider theme={theme}>
        <Col xs={12} sm={12} md={12} lg={12}>
          <InputField
            name={title.name}
            label={title.label}
            isRequired
            labelClassName="mb-0"
            className="subjectticket bw-2"
            placeholder="Enter Title"
            type="text"
            maxLength="150"
          />
        </Col>
      </ThemeProvider>
      <Col xs={12} sm={12} md={12} lg={12}>
        <FormGroup className="mb-1">
          <>
            <Label for={descriptionOfBreakdown.name} className="mb-1">
              {descriptionOfBreakdown.label}
              <span className="ml-1 text-danger">*</span>
            </Label>
            <Input
              name={descriptionOfBreakdown.name}
              label={descriptionOfBreakdown.label}
              value={description_of_breakdown}
              onChange={onActionChange}
              isRequired
              onBlur={onActionChange}
              type="textarea"
              rows="2"
              maxLength="150"
            />
          </>
        </FormGroup>
      </Col>
    </Row>
  );
};

DescriptionForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default DescriptionForm;
