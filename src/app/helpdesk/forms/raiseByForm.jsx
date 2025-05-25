/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Row, Col,
} from 'reactstrap';
import { ThemeProvider } from '@material-ui/core/styles';

import { CheckboxFieldGroup } from '@shared/formFields';
import theme from '../../util/materialTheme';

const raiseByForm = (props) => {
  const {
    formField: {
      raisedBy,
    },
  } = props;
  return (
    <>
      <Row className="mr-5">
        <ThemeProvider theme={theme}>
          <Col xs={12} sm={12} md={12} lg={12}>
            <span className="font-weight-bold mb-4 d-inline-block">Raised By</span>
            <br />
            <CheckboxFieldGroup
              name={raisedBy.name}
              checkedvalue="self"
              id="self"
              className="checkbox-left-ml"
              label={raisedBy.label1}
            />
            <CheckboxFieldGroup
              name={raisedBy.name}
              checkedvalue="other"
              id="other"
              className="checkbox-right-ml"
              label={raisedBy.label}
            />
          </Col>
        </ThemeProvider>
      </Row>
    </>
  );
};

raiseByForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default raiseByForm;
