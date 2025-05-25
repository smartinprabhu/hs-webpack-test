/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/no-unresolved */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Row, Col,
} from 'reactstrap';
import { ThemeProvider } from '@material-ui/core/styles';

import { InputField } from '@shared/formFields';

import theme from '../../util/materialTheme';

const SubjectForm = (props) => {
  const {
    setFieldValue,
    formField: {
      subject,
    },
  } = props;

  return (
    <Row className="subjectForm-input">
      <ThemeProvider theme={theme}>
        <Col xs={12} sm={12} md={12} lg={12}>
          <InputField
            name={subject.name}
            label={subject.label}
            isRequired
            labelClassName="mb-0"
            className="subjectticket bw-2"
            placeholder="Enter subject"
            // onKeyPress={noSpecialChars}
            type="text"
            maxLength="150"
          />
        </Col>
        { /* <Col xs={12} sm={10} md={10} lg={10}>
          <FormGroup>
            <Label for={Description.name} className="mb-0">
              {Description.label}
            </Label>
            {!isEditor && description.length === 0 && (
            <Input
              type="input"
              name={Description.name}
              defaultValue={description}
              className="subjectticket bw-2 mt-0"
              placeholder="Please provide description"
              onClick={() => showEditor(true)}
              onMouseLeave={() => showEditor(false)}
            />
            )}
            {((isEditor) || (description && description.length > 0)) && (
            <div>
              <JoditEditor
                ref={editor}
                value={description}
                onChange={onChange}
                onBlur={onChange}
              />
            </div>
            )}
          </FormGroup>
            </Col> */ }
      </ThemeProvider>
    </Row>
  );
};

SubjectForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default SubjectForm;
