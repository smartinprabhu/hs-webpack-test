/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import React from 'react';
import {
  Button,
  Col,
  Row,
  Spinner,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileExcel,
} from '@fortawesome/free-solid-svg-icons';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';

const DataExport = (props) => {
  const {
    afterReset,
  } = props;

  const { reports } = useSelector((state) => state.ppm);

  const handleExcelExport = () => {
    try {
      const downloadLink = document.createElement('a');
      document.body.appendChild(downloadLink);
      const elem = window.document.createElement('a');
      elem.target = '_blank';
      if (reports && reports.data && reports.data.length > 0 && reports.data[reports.data.length - 1].download_url !== false) {
        elem.href = reports.data[reports.data.length - 1].download_url;
      }
      document.body.appendChild(elem);
      elem.click();
      document.body.removeChild(elem);
    } catch (e) {
      console.log(e);
    }
    if (afterReset) afterReset();
  };

  return (
    <Row>
      <Col md="12" sm="12" lg="12">
        <div className="p-3 text-center">
          <FontAwesomeIcon className="fa-3x" size="lg" icon={faFileExcel} />
          <h5>Excel</h5>
          <Button
            type="button"
            color="dark"
            className="bg-zodiac"
            disabled={reports && reports.loading}
            onClick={() => handleExcelExport()}
          >
            {(reports && reports.loading) ? (
              <Spinner size="sm" color="light" className="mr-2" />
            ) : (<span />)}
            {' '}
            Download
          </Button>
        </div>
      </Col>
      {reports && reports.err && (
        <Col md="12" sm="12" lg="12" xs="12">
          <SuccessAndErrorFormat response={reports} />
        </Col>
      )}
    </Row>
  );
};

DataExport.propTypes = {
  afterReset: PropTypes.func.isRequired,
};

export default DataExport;
