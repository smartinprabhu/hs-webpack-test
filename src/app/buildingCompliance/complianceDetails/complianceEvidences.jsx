/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import {
  Button,
  Col,
  Row,
  Table,
} from 'reactstrap';
import { Tooltip } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';

import {
  Dialog, DialogContent, DialogContentText, DialogActions,
} from '@mui/material';
import Loader from '@shared/loading';
import download from '@images/icons/downloadBlue.svg';
import editIcon from '@images/icons/edit.svg';
import ErrorContent from '@shared/errorContent';
import DialogHeader from '../../commonComponents/dialogHeader';
import {
  getDefaultNoValue,
  generateErrorMessage, getCompanyTimezoneDate, generateArrayFromValue,getListOfModuleOperations,
} from '../../util/appUtils';
import { getComplianceEvidence, resetComplianceState, resetRenewalDetail } from '../complianceService';
import Renewal from './actionItems/renewal/renewalEdit';
import { resetActivityInfo } from '../../purchase/purchaseService';
import { resetUpdateTenant } from '../../adminSetup/setupService';
import actionCodes from '../data/complianceActionCodes.json';
import { getVersionStatusLabel, getVersionStateColor } from '../utils/utils';

const appModels = require('../../util/appModels').default;
const appConfig = require('../../config/appConfig').default;

const ComplianceEvidences = React.memo((props) => {
  const { ids } = props;
  const officeViewerApiLink = 'https://view.officeapps.live.com/op/embed.aspx';
  const dispatch = useDispatch();
  const [renewalModal, showRenewalModal] = useState(false);
  const [selectedId, setSelectedId] = useState(false);
  const [editData, setEditData] = useState([]);
  const [preview, setPreview] = useState(false);
  const [ImageLink, setImageLink] = useState(false);
  const [downloadImageLink, setDownloadImageLink] = useState(false);
  const { complianceDetails } = useSelector((state) => state.compliance);
  const imageExtension = ['jpg', 'jpeg', 'svg', 'png'];

  const {
    tenantUpdateInfo,
  } = useSelector((state) => state.setup);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { complianceEvidence } = useSelector((state) => state.compliance);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Building Compliance', 'code');

  const isDownloadAllowed = allowedOperations.includes(actionCodes['Download Evidence Document']);

  useEffect(() => {
    if (selectedId && complianceEvidence && complianceEvidence.data) {
      const teamData = generateArrayFromValue(complianceEvidence.data, 'id', selectedId.id);
      setEditData(teamData);
    }
  }, [selectedId]);
  
  useEffect(() => {
    if (ids) {
      setImageLink(false);
      setDownloadImageLink(false);
      dispatch(getComplianceEvidence(ids, appModels.COMPLIANCEEVIDENCES));
    } else {
      dispatch(getComplianceEvidence([], appModels.COMPLIANCEEVIDENCES));
    }
  }, [ids]);

  function getRow(evidenceData) {
    const tableTr = [];
    for (let i = 0; i < evidenceData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2 w-25">
            <Tooltip title={getDefaultNoValue(evidenceData[i].description)} placement="right">
              {getDefaultNoValue(evidenceData[i].description)}
            </Tooltip>
          </td>
          <td className="p-2">{getDefaultNoValue(getCompanyTimezoneDate(evidenceData[i].evidences_date, userInfo, 'datetime'))}</td>
          <td className="p-2">{getDefaultNoValue(evidenceData[i].user_id ? evidenceData[i].user_id[1] : '')}</td>
          <td className="p-2">
            <span className={`text-${getVersionStateColor(evidenceData[i].version_status)}`}>
              {getDefaultNoValue(getVersionStatusLabel(evidenceData[i].version_status))}
            </span>
          </td>
          <td className="p-2">
            {' '}
            {/* evidenceData[i].download_link && (
            <Tooltip title="View">
              <img
                aria-hidden="true"
                src={eyeBlueIcon}
                className="mr-3 cursor-pointer"
                height="12"
                width="12"
                alt="View"
                onClick={() => { setPreview(true); setImageLink(evidenceData[i].file_path); setDownloadImageLink(evidenceData[i].download_link); }}
              />
            </Tooltip>
            ) */}
            <Tooltip title="Edit Evidence">
              <img
                aria-hidden="true"
                src={editIcon}
                className="mr-3 cursor-pointer"
                height="12"
                width="12"
                alt="edit"
                onClick={() => { setSelectedId(evidenceData[i]); showRenewalModal(true); }}
              />
            </Tooltip>
            {isDownloadAllowed && evidenceData[i].download_link ? (
              <a href={evidenceData[i].download_link} rel="noreferrer" target="_blank" download aria-hidden="true">
                <Tooltip title="File Download">
                  <img
                    src={download}
                    className="mr-1 cursor-pointer"
                    alt="download"
                    height="15"
                    aria-hidden="true"
                  />
                </Tooltip>
              </a>
            ) : '-'}
          </td>
        </tr>,
      );
    }
    return tableTr;
  }

  const closeEditModalWindow = () => {
    if (complianceDetails && complianceDetails.data && tenantUpdateInfo && tenantUpdateInfo.data) {
      const idEvidence = complianceDetails.data.length > 0 && complianceDetails.data[0].compliance_evidences_ids ? complianceDetails.data[0].compliance_evidences_ids : [];
      dispatch(getComplianceEvidence(idEvidence, appModels.COMPLIANCEEVIDENCES));
    }
    dispatch(resetUpdateTenant());
    dispatch(resetComplianceState());
    dispatch(resetActivityInfo());
    dispatch(resetRenewalDetail());
    showRenewalModal(false);
    setSelectedId(false);
    setEditData([]);
  };

  function getUrlExtension(url) {
    let urlLink = false;
    if (url) {
      urlLink = url.split(/[#?]/)[0].split('.').pop().trim();
    }
    return urlLink;
  }

  return (
    <>
      <Row>
        <Col sm="12" md="12" lg="12" xs="12" className="p-3 bg-white comments-list thin-scrollbar">
          {(complianceEvidence && complianceEvidence.data) && (
          <div>
            <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
              <thead>
                <tr>
                  <th className="p-2 min-width-200">
                    Description
                  </th>
                  <th className="p-2 min-width-100">
                    Date Time
                  </th>
                  <th className="p-2 min-width-100">
                    User
                  </th>
                  <th className="p-2 min-width-100">
                    Version Status
                  </th>
                  <th className="p-2 min-width-100">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {getRow(complianceEvidence && complianceEvidence.data ? complianceEvidence.data : [])}
              </tbody>
            </Table>
            <hr className="m-0" />
          </div>
          )}
          {complianceEvidence && complianceEvidence.loading && (
          <Loader />
          )}
          {(complianceEvidence && complianceEvidence.err) && (
          <ErrorContent errorTxt={generateErrorMessage(complianceEvidence)} />
          )}
          {(!ids && complianceEvidence && !complianceEvidence.err) && (
          <ErrorContent errorTxt="" />
          )}
        </Col>
      </Row>
      <Dialog maxWidth="lg" open={preview}>
        <DialogHeader title="FILE" imagePath={false} onClose={() => { setPreview(false); }} sx={{ width: '1000px' }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {imageExtension.includes(getUrlExtension(ImageLink)) && (
            <img
              src={ImageLink}
              alt="view document"
              width="100%"
            />
            )}
            {!imageExtension.includes(getUrlExtension(`${window.location.origin}${ImageLink}`)) && (
            <iframe src={`${officeViewerApiLink}?src=${downloadImageLink}`} width="100%" title="SLA " height="565px" frameBorder="0"> </iframe>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            className="btn-cancel"
            size="sm"
            onClick={() => {
              setPreview(false);
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {complianceDetails && complianceDetails.data && (
      <Dialog maxWidth="lg" open={renewalModal}>
        <DialogHeader title="Edit Compliance Evidences" imagePath={false} onClose={closeEditModalWindow} response={tenantUpdateInfo} sx={{ width: '1000px' }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Renewal closeModal={closeEditModalWindow} selectedId={selectedId} editData={editData} />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      )}
    </>
  );
});

ComplianceEvidences.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  ids: PropTypes.array.isRequired,
};

export default ComplianceEvidences;
