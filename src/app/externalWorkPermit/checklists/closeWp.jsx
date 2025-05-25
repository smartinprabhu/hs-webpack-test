/* eslint-disable radix */
/* eslint-disable array-callback-return */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  
  Modal,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import axios from 'axios';
import Button from '@mui/material/Button';

import ModalHeaderComponent from '@shared/modalHeaderComponent';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';

import checkCircleBlack from '@images/icons/checkCircleBlack.svg';
import closeCircle from '@images/icons/closeCircle.svg';
import closeCircleWhite from '@images/icons/closeCircleWhite.svg';
import checkWhite from '@images/icons/checkWhite.svg';
import { getCustomButtonName } from '../../workPermit/utils/utils';

const appConfig = require('../../config/appConfig').default;

const CloseWp = (props) => {
  const {
    atReject,
    atDone,
    detailData,
    accid,
    wpConfigData,
  } = props;

  const [startInfo, setStartInfo] = useState({ loading: false, data: null, err: null });

  const [isButtonHover, setButtonHover] = useState(false);

  const WEBAPPAPIURL = `${window.location.origin}/`;

  const acceptStartWo = () => {
    if (detailData && detailData.requestor_id && detailData.requestor_id.id) {
      setStartInfo({ loading: true, data: null, err: null });

      const postDataValues = {
        // mro_timesheet_ids: [[0, 0, { mro_order_id: detailData.order_id.id, start_date: getDateTimeUtc(new Date()), reason: 'Start' }]],
        // employee_id: detailData.requestor_id.id,
        state: 'done',
      };

      const data = {
        id: detailData.order_id.id,
        values: postDataValues,
      };

      const postData = new FormData();
      postData.append('values', JSON.stringify(data.values));
      if (typeof payload === 'object') {
        Object.keys(data).map((payloadObj) => {
          if (payloadObj !== 'id') {
            postData.append(payloadObj, data[payloadObj]);
          }
          return postData;
        });
      }
      postData.append('id', data.id);

      const config = {
        method: 'post',
        url: `${WEBAPPAPIURL}public/api/v4/wp/updateWPorder`,
        headers: {
          'Content-Type': 'multipart/form-data',
          portalDomain: window.location.origin,
          accountId: accid,
        },
        data: postData,
      };

      axios(config)
        .then((response) => {
          if (response.data.data) {
            setStartInfo({ loading: false, data: response.data.data, err: null });
            atDone();
          } else if (response.data && response.data.error && response.data.error.message) {
            setStartInfo({ loading: false, data: null, err: response.data.error.message });
          }
        })
        .catch((error) => {
          setStartInfo({ loading: false, data: null, err: error });
        });
    }
  };

  return (
    <Modal size="md" className="border-radius-50px modal-dialog-centered" isOpen>
      <ModalHeaderComponent
        imagePath={checkCircleBlack}
        closeModalWindow={() => atReject()}
        title="Finish Work"
        response={startInfo}
      />

      <ModalBody>
        <div className="text-center mt-3 mb-3">
          <h5 className="mb-3">
            Are you sure to
            {' '}
            {getCustomButtonName('Closed', wpConfigData)}
            {' '}
            the work permit ?
          </h5>
          {(startInfo && startInfo.loading) && (
            <div className="text-center mt-4 mb-4">
              <Loader />
            </div>
          )}
          {(startInfo && startInfo.err) && (
            <div className="text-center mt-3 mb-3">
              <SuccessAndErrorFormat response={startInfo} />
            </div>
          )}
        </div>
      </ModalBody>
      <ModalFooter className="mr-3 ml-3">
        <Button
          type="button"
          size="md"
          variant="contained"
          className="hoverColor btn-cancel text-dark rounded-pill mr-2"
          onClick={() => atReject()}
          disabled={startInfo && startInfo.loading}
          onMouseLeave={() => setButtonHover(false)}
          onMouseEnter={() => setButtonHover(true)}
          color="danger"
        >
          <span className="page-actions-header content-center">
            <img src={isButtonHover ? closeCircleWhite : closeCircle} className="mr-2" alt="Deny" width="13" height="13" />
            <span>Cancel</span>
          </span>
        </Button>
        <Button
          type="button"
          size="md"
          className="rounded-pill"
          onClick={() => acceptStartWo()}
           variant="contained"
        >
          <img src={checkWhite} className="mr-2" alt="Prepare" width="13" height="13" />
          <span>{getCustomButtonName('Closed', wpConfigData)}</span>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

CloseWp.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  atReject: PropTypes.func.isRequired,
  atDone: PropTypes.func.isRequired,
};
export default CloseWp;
