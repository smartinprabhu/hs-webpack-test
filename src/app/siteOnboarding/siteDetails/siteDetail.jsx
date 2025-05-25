/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  CardBody,
} from 'reactstrap';
import { Box } from '@mui/system';
import * as PropTypes from 'prop-types';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import SiteDetailInfo from './siteDetailInfo';
import SiteDetailTabs from './siteDetailTabs';
import SiteModules from './siteModules';
import { getStatusOfModules } from '../utils/utils';
import { generateErrorMessage } from '../../util/appUtils';
import {
  getCopyAllowedModule, getHelpdeskSettingDetails, getInspectionSettingDetails, getPPMSettingsDetails, getWorkpermitSettingDetails, getInventorySettingDetails, getParentSiteGroups,
  getMailRoomSettingDetails, getPantrySettingDetails, getAuditSettingDetails, getWarehousesIds, getVMSSettingDetails,
} from '../siteService';
import { getCompanyDetail } from '../../adminSetup/setupService';

const appModels = require('../../util/appModels').default;

const SiteDetail = (props) => {
  const {
    setEditId, editId,
  } = props;
  const dispatch = useDispatch();
  const { siteDetails, onBoardCopyInfo } = useSelector((state) => state.site);
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (siteDetails && siteDetails.data && siteDetails.data.length) {
      dispatch(getCompanyDetail(userInfo.data.company.id, appModels.COMPANY));
      dispatch(getParentSiteGroups(siteDetails.data[0].id, appModels.COMPANY));
      dispatch(getWarehousesIds(siteDetails.data[0].id, appModels.WAREHOUSE));
      dispatch(getHelpdeskSettingDetails(siteDetails.data[0].id, appModels.MAINTENANCECONFIG));
      dispatch(getCopyAllowedModule(siteDetails.data[0].id, appModels.ONBOARDCOPYMODULE));
      dispatch(getWorkpermitSettingDetails(siteDetails.data[0].id, appModels.WPCONFIGURATION));
      dispatch(getInspectionSettingDetails(siteDetails.data[0].id, appModels.INSPECTIONCONFIG));
      dispatch(getInventorySettingDetails(siteDetails.data[0].id, appModels.INVENTORYCONFIG));
      dispatch(getPPMSettingsDetails(siteDetails.data[0].id, appModels.PPMWEEKCONFIG));
      dispatch(getMailRoomSettingDetails(siteDetails.data[0].id, appModels.MAILROOMCONFIG));
      dispatch(getPantrySettingDetails(siteDetails.data[0].id, appModels.PANTRYCONFIG));
      dispatch(getVMSSettingDetails(userInfo.data.company.id, appModels.VMSCONFIGURATION));
      dispatch(getAuditSettingDetails(siteDetails.data[0].id, appModels.AUDITCONFIG));
    }
  }, [siteDetails]);

  const loading = (siteDetails && siteDetails.loading) || (onBoardCopyInfo && onBoardCopyInfo.loading);

  return (
    <Box>
      <SiteDetailInfo setEditId={setEditId} editId={editId}  />
      {getStatusOfModules(onBoardCopyInfo)
        ? <SiteModules />
        : <SiteDetailTabs />}
      {loading && (
        <CardBody className="mt-4" data-testid="loading-case">
          <Loader />
        </CardBody>
      )}
      {(siteDetails && siteDetails.err && !loading) && (
        <CardBody>
          <ErrorContent errorTxt={generateErrorMessage(siteDetails)} />
        </CardBody>
      )}
      {(onBoardCopyInfo && onBoardCopyInfo.err && !loading) && (
        <CardBody>
          <ErrorContent errorTxt={generateErrorMessage(onBoardCopyInfo)} />
        </CardBody>
      )}
    </Box>
  );
};

SiteDetail.propTypes = {
  setDetailViewClose: PropTypes.func.isRequired,
};

export default SiteDetail;
