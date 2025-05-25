/* eslint-disable import/no-unresolved */
import DrawerHeader from '@shared/drawerHeader';
import { Drawer } from 'antd';
import * as PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {  Col, Row } from 'reactstrap';
import { Button } from '@mui/material';
import {
  setInitialValues,
} from '../../../purchase/purchaseService';
import {
  getAuditSettingDetails
} from '../../siteService';
import {
  resetUpdateProductCategory,
} from '../../../pantryManagement/pantryService';
import AddAuditSettings from './addAuditSettings';

const appModels = require('../../../util/appModels').default;

const AuditSystemInfo = (props) => {
  const {
    detailData,
    setDetailViewClose,
  } = props;
  const dispatch = useDispatch();
  const {
    auditSettingsInfo,
  } = useSelector((state) => state.site);

  const [isRedirectOne, setRedirectOne] = useState(false);

  const editId = detailData && detailData.id ? detailData.id : false;

  const closeManage = () => {
    dispatch(setInitialValues(false, false, false, false));
    setRedirectOne(false);
    setDetailViewClose(true);
  };

  const onLoadManageSettings = () => {
    dispatch(getAuditSettingDetails(detailData.id, appModels.AUDITCONFIG));
    if (document.getElementById('auditSettingsForm')) {
      document.getElementById('auditSettingsForm').reset();
    }
    dispatch(resetUpdateProductCategory());
    setRedirectOne(true);
    setDetailViewClose(false);
  };

  const closeEditWindow = () => {
    if (document.getElementById('auditSettingsForm')) {
      document.getElementById('auditSettingsForm').reset();
    }
    dispatch(resetUpdateProductCategory());
    setRedirectOne(false);
    setDetailViewClose(true);
  };

  return (
    detailData && (
      <>
        <Row className="ml-0 mt-3 mr-0">
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0">
              Settings
            </span>
          </Col>
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <Button
              variant="contained"
              size="sm"
              disabled={auditSettingsInfo && auditSettingsInfo.data && auditSettingsInfo.data.length <= 0}
              className="hoverColor pb-05 pt-05 float-right mr-4 font-11 rounded-pill mb-1 mr-2"
              onClick={() => onLoadManageSettings()}
            >
              Manage
            </Button>
          </Col>
        </Row>
        <p className="mt-2" />
        <Drawer
          title=""
          closable={false}
          width={1250}
          visible={isRedirectOne}
        >
          <DrawerHeader
            title="Audit Settings"
            imagePath=""
            closeDrawer={closeManage}
          />
          <AddAuditSettings editId={editId} closeModal={closeEditWindow} />
        </Drawer>
      </>
    )
  );
};

AuditSystemInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
  setDetailViewClose: PropTypes.func.isRequired,
};
export default AuditSystemInfo;
