/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Row, Col,
} from 'reactstrap';
import { ThemeProvider } from '@material-ui/core/styles';

import { CheckboxField } from '@shared/formFields';
import theme from '../../../util/materialTheme';

const ScheduleForm = React.memo((props) => {
  const {
    editId,
    reloadData,
    setFieldValue,
    formField: {
      mo,
      tu,
      we,
      th,
      fr,
      sa,
      su,
      atStart,
      atDone,
      atReview,
      enforceTime,
      allowFuture,
      allowPast,
      nfcScanStart,
      nfcScanDone,
      qrScanStart,
      qrScanDone,
    },
  } = props;
  const [refresh, setRefresh] = useState(reloadData);

  useEffect(() => {
    setRefresh(reloadData);
  }, [reloadData]);

  useEffect(() => {
    if (refresh === '1' && !editId) {
      setFieldValue('mo', 0);
      setFieldValue('tu', 0);
      setFieldValue('we', 0);
      setFieldValue('th', 0);
      setFieldValue('fr', 0);
      setFieldValue('sa', 0);
      setFieldValue('su', 0);
    }
  }, [refresh, editId]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <Row className="p-2">
          <Col xs={12} sm={6} md={6} lg={6} className="mt-3">
            <h5 className="font-weight-600 font-15 text-info">Exclude Days</h5>
            <CheckboxField
              name={mo.name}
              label={mo.label}
            />
            <CheckboxField
              name={tu.name}
              label={tu.label}
            />
            <CheckboxField
              name={we.name}
              label={we.label}
            />
            <CheckboxField
              name={th.name}
              label={th.label}
            />
            <CheckboxField
              name={fr.name}
              label={fr.label}
            />
            <CheckboxField
              name={sa.name}
              label={sa.label}
            />
            <CheckboxField
              name={su.name}
              label={su.label}
            />
          </Col>
          <Col xs={6} sm={6} md={6} lg={6} className="mt-3">
            <h5 className="font-weight-600 font-15 text-info">Photo Required</h5>
            <CheckboxField
              name={atStart.name}
              label={atStart.label}
            />
            <CheckboxField
              name={atReview.name}
              label={atReview.label}
            />
            <CheckboxField
              name={atDone.name}
              label={atDone.label}
            />
          </Col>
        </Row>
        <hr />
        <Row className="p-2">
          <Col xs={6} sm={6} md={6} lg={6}>
            <h5 className="font-weight-600 font-15 text-info">Enforce Time</h5>
            <CheckboxField
              name={enforceTime.name}
              label={enforceTime.label}
            />
            <CheckboxField
              name={allowFuture.name}
              label={allowFuture.label}
            />
            <CheckboxField
              name={allowPast.name}
              label={allowPast.label}
            />
          </Col>
          <Col xs={6} sm={6} md={6} lg={6}>
            <h5 className="font-weight-600 font-15 text-info">QR Scan</h5>
            <CheckboxField
              name={qrScanStart.name}
              label={qrScanStart.label}
            />
            <CheckboxField
              name={qrScanDone.name}
              label={qrScanDone.label}
            />
          </Col>
        </Row>
        <hr />
        <Row className="p-2">
          <Col xs={6} sm={6} md={6} lg={6}>
            <h5 className="font-weight-600 font-15 text-info">NFC</h5>
            <CheckboxField
              name={nfcScanStart.name}
              label={nfcScanStart.label}
            />
            <CheckboxField
              name={nfcScanDone.name}
              label={nfcScanDone.label}
            />
          </Col>
        </Row>
      </ThemeProvider>
    </>
  );
});

ScheduleForm.defaultProps = {
  editId: undefined,
};

ScheduleForm.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  reloadData: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default ScheduleForm;
