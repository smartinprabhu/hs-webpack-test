/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/no-unresolved */
import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Row, Col, Input,
  FormGroup, Label,
} from 'reactstrap';
import { ThemeProvider } from '@material-ui/core/styles';
import { useFormikContext } from 'formik';
import DOMPurify from 'dompurify';

import Images from './images';
import theme from '../../util/materialTheme';

const DescriptionForm = (props) => {
  const {
    setFieldValue,
    editId,
    formField: {
      Description,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const { description } = formValues;
  const [isEditor, showEditor] = useState(false);

  const onChange = (data) => {
    setFieldValue('description', DOMPurify.sanitize(data.target.value));
  };

  return (
    <Row className="mb-3">
      <ThemeProvider theme={theme}>
        <Col xs={12} sm={10} md={4} lg={4}>
          {!editId && (
            <Images editId={editId} />
          )}
        </Col>
        <Col xs={12} sm={12} md={8} lg={8}>
          <FormGroup>
            <>
              <Label for={Description.name} className="mb-0">
                {Description.label}
              </Label>
              <Input
                name={Description.name}
                label={Description.label}
                value={description}
                onChange={onChange}
                onBlur={onChange}
                type="textarea"
                rows="4"
              />
            </>
            {/* {!isEditor && description.length === 0 && (
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
              <div className="bg-white mb-5">
                <JoditEditor
                  ref={editor}
                  value={description}
                  onChange={onChange}
                  onBlur={onChange}
                />
              </div>
            )} */}
          </FormGroup>
        </Col>
      </ThemeProvider>
    </Row>
  );
};

DescriptionForm.defaultProps = {
  editId: false,
};

DescriptionForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  editId: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.string]),
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default DescriptionForm;
