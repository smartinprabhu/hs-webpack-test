/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import {
  Button,
  Col,
  Row,
  Spinner,
} from 'reactstrap';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileExcel,
} from '@fortawesome/free-solid-svg-icons';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';

const DataExport = () => {
  const [filePath, setFilePath] = useState(false);

  const {
    slaEvalutionReport,
  } = useSelector((state) => state.workorder);

  useEffect(() => {
    if (slaEvalutionReport && slaEvalutionReport.data && slaEvalutionReport.data.length > 0 && slaEvalutionReport.data[0].download_link) {
      const Url = slaEvalutionReport.data[0].download_link.length > 0 && slaEvalutionReport.data[0].download_link[0].url;
      const apiUrl = window.localStorage.getItem('api-url');
      const filepath = `${apiUrl}/${Url}`;
      setFilePath(filepath);
    }
  }, [slaEvalutionReport]);

  return (
    <Row>
      <Col md="12" sm="12" lg="12">
        <div className="p-3 text-center">
          <FontAwesomeIcon className="fa-3x" size="lg" icon={faFileExcel} />
          <h5>Excel</h5>
          <a href={filePath} rel="noreferrer" target="_blank">
            <Button
              type="button"
              color="dark"
              className="bg-zodiac"
              disabled={slaEvalutionReport && slaEvalutionReport.loading}
            >
              {(slaEvalutionReport && slaEvalutionReport.loading) ? (
                <Spinner size="sm" color="light" className="mr-2" />
              ) : (<span />)}
              {' '}
              Download
            </Button>
          </a>
        </div>
      </Col>
      {slaEvalutionReport && slaEvalutionReport.err && (
        <Col md="12" sm="12" lg="12" xs="12">
          <SuccessAndErrorFormat response={slaEvalutionReport} />
        </Col>
      )}
    </Row>
  );
};

export default DataExport;
