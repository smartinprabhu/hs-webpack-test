/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-danger */
import React, { useState, useEffect } from 'react';
import {
  Col,
  Row,
  Modal,
  ModalBody,
} from 'reactstrap';
import axios from 'axios';
import { Markup } from 'interweave';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'antd';

import ModalHeaderComponent from '@shared/modalHeaderComponent';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';

import {
  generateErrorMessage, truncateStars, truncateFrontSlashs, getCompanyTimezoneDate,
} from '../../util/appUtils';
import AuthService from '../../util/authService';
import { getClientName } from '../../util/getDynamicClientData';

const appConfig = require('../../config/appConfig').default;

const ReleaseNotes = () => {
  const [vpConfig, setVpConfig] = useState({ loading: false, data: null, err: null });
  const [selectedVersion, setSelectedVersion] = useState(false);
  const [isModal, setModalOpen] = useState(false);

  const WEBAPPAPIURL = `${window.location.origin}/`;

  const { userInfo } = useSelector((state) => state.user);

  const code = getClientName();

  const authService = AuthService();
  const isAuthenticated = authService.getRefreshToken();

  useEffect(() => {
    if (isAuthenticated) {
      // dispatch(getVpConfig(uuid));
      setVpConfig({
        loading: true, data: null, count: 0, err: null,
      });
      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}api/authProviders/allVersions?code=${code}&portalDomain=${window.location.origin}`,
        headers: {
          portalDomain: window.location.origin,
        },
      };
      axios(config)
        .then((response) => setVpConfig({
          loading: false, data: response.data.data, count: response.data.length, err: null,
        }))
        .catch((error) => {
          setVpConfig({
            loading: false, data: null, count: 0, err: error.response,
          });
        });
    }
  }, [isAuthenticated]);

  const viewReleaseNote = (data) => {
    setSelectedVersion(data);
    setModalOpen(true);
  };

  const cancelReleaseNote = () => {
    setSelectedVersion(false);
    setModalOpen(false);
  };

  const detailData = vpConfig && vpConfig.data ? vpConfig.data : '';

  return (
    <>
      <Row className="notification-header thin-scrollbar">
        <Col md="12" lg="12" sm="12" xs="12">
          {detailData && detailData.endpoints && detailData.endpoints.length > 0 && detailData.endpoints.map((ver) => (
            <>
              {ver.web.web_version && (
              <>
                <Row key={ver.web.released_on} className="p-3">
                  <Col md="7" xs="12" sm="7" lg="7" className="p-1 cursor-pointer" onClick={() => viewReleaseNote(ver)}>
                    <Tooltip title="Version Status">
                      <FontAwesomeIcon className={`mr-2 ${ver.release_status === 'Current' ? 'text-success' : ''}`} size="sm" icon={faCheckCircle} />
                    </Tooltip>
                    <Tooltip title="Version">
                      <span className="font-weight-800">{ver.web.web_version}</span>
                    </Tooltip>
                  </Col>
                  <Col md="5" xs="12" sm="5" lg="5" className="text-right p-0">
                    <Tooltip title="Version Released on">
                      <small>{ver.released_on && ver.released_on !== 'False' ? getCompanyTimezoneDate(ver.released_on, userInfo, 'datetime') : '-'}</small>
                    </Tooltip>
                  </Col>
                </Row>
              </>
              )}
            </>
          ))}
          {vpConfig && vpConfig.loading && (
            <Loader />
          )}
          {vpConfig && vpConfig.err && (
          <ErrorContent errorTxt={generateErrorMessage(vpConfig)} />
          )}
        </Col>
        {selectedVersion && (
        <Modal size="lg" className="border-radius-50px modal-dialog-centered purchase-modal" isOpen={isModal}>
          <ModalHeaderComponent title={selectedVersion.web.web_version} imagePath={false} closeModalWindow={() => cancelReleaseNote()} />
          <ModalBody className="mt-0 pt-0">
            <div className="mb-3">
              <span className="text-left">
                <FontAwesomeIcon className={`mr-2 ${selectedVersion.release_status === 'Current' ? 'text-success' : ''}`} size="sm" icon={faCheckCircle} />
                {selectedVersion.release_status}
              </span>
              <span className="float-right">
                <small>
                  Released on :
                  {' '}
                  {selectedVersion.released_on && selectedVersion.released_on !== 'False' ? getCompanyTimezoneDate(selectedVersion.released_on, userInfo, 'datetime') : '-'}
                </small>
              </span>
            </div>
            <Markup content={truncateFrontSlashs(truncateStars(selectedVersion.web.web_release_notes))} />
          </ModalBody>
        </Modal>
        )}
      </Row>
    </>
  );
};

export default ReleaseNotes;
