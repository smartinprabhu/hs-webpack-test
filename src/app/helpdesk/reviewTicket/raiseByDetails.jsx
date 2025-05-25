/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Col, Row,
} from 'reactstrap';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';

import {
  getDefaultNoValue,
} from '../../util/appUtils';
import theme from '../../util/materialTheme';

const RaiseByDetails = (props) => {
  const { formValues } = props;

  const useStyles = makeStyles({
    root: {
      color: '#3a4354',
      '&$checked': {
        color: '#3a4354',
      },
    },
  });
  const classes = useStyles();

  return (
    <>
      <span className="d-inline-block pb-1 form-head mb-3 font-weight-bold">Raised By</span>
      <Row className="mr-4">
        <ThemeProvider theme={theme}>
          <Col xs={12} sm={12}>
            <FormGroup row>
              <FormControlLabel
                control={<Checkbox checked={getDefaultNoValue(formValues.raise_by) === 'self'} name="self" color="default" size="small" className={`${classes.root} ml-4`} />}
                label="Self"
              />
              <FormControlLabel
                control={(
                  <Checkbox
                    checked={getDefaultNoValue(formValues.raise_by) === 'other'}
                    name="others"
                    color="default"
                    size="small"
                    className={`${classes.root} ml-4`}
                  />
            )}
                label="Others"
              />
            </FormGroup>
          </Col>
        </ThemeProvider>
      </Row>
    </>
  );
};

RaiseByDetails.propTypes = {
  formValues: PropTypes.shape({
    raise_by: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  }).isRequired,
};

export default RaiseByDetails;
