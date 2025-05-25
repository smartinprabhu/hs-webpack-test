/* eslint-disable import/no-unresolved */
import { Button, Drawer } from '@mui/material';
import * as PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import DrawerHeader from '../../../commonComponents/drawerHeader';
import {
  setInitialValues,
} from '../../../purchase/purchaseService';
import {
  resetUpdateProductCategory,
} from '../../../pantryManagement/pantryService';
import {
  getSLAConfig,
} from '../../../slaAudit/auditService';
import { setAllowedHostId, setAllowedDomainId } from '../../siteService';
import AddSLASettings from './addSLASettings';

const appModels = require('../../../util/appModels').default;

const HelpdeskInfo = (props) => {
  const {
    detailData,
  } = props;
  const dispatch = useDispatch();
  const {
    siteDetails,
  } = useSelector((state) => state.site);
  const {
    slaAuditConfig,
  } = useSelector((state) => state.slaAudit);

  const [isRedirectThree, setRedirectThree] = useState(false);
  const [editId, setEditId] = useState(false);

  const closeManage = () => {
    dispatch(setAllowedHostId([]));
    dispatch(setAllowedDomainId([]));
    dispatch(setInitialValues(false, false, false, false));
    setRedirectThree(false);
  };

  const onLoadManageSettings = () => {
    if (siteDetails && siteDetails.data && siteDetails.data.length) {
      dispatch(getSLAConfig(siteDetails.data[0].id, appModels.SLAAUDITCONFIG));
      setEditId(detailData && detailData.id ? detailData.id : false);
    }
    if (document.getElementById('slaSettingsForm')) {
      document.getElementById('slaSettingsForm').reset();
    }
    dispatch(resetUpdateProductCategory());
    setRedirectThree(true);
  };

  const closeEditWindow = () => {
    if (document.getElementById('slaSettingsForm')) {
      document.getElementById('slaSettingsForm').reset();
    }
    dispatch(resetUpdateProductCategory());
    setRedirectThree(false);
  };

  return (
    detailData && (
      <>
        <Row className="ml-0 mt-3 mr-0 mb-3">
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0">
              Settings
            </span>
          </Col>
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <Button
              variant="contained"
              size="sm"
              disabled={slaAuditConfig && slaAuditConfig.data && slaAuditConfig.data.length <= 0}
              className="hoverColor pb-05 pt-05 float-right mr-4 font-11 rounded-pill mb-1 mr-2"
              onClick={() => onLoadManageSettings()}
            >
              Manage
            </Button>
          </Col>
        </Row>
        <p className="mt-2" />
        <Drawer
          PaperProps={{
            sx: { width: '85%' },
          }}
          ModalProps={{
            disableEnforceFocus: true,
          }}
          anchor="right"
          open={isRedirectThree}
        >
          <DrawerHeader
            headerName="SLA KPI Settings"
            imagePath=""
            onClose={closeManage}
          />
          <AddSLASettings editId={editId} closeModal={closeEditWindow} />
        </Drawer>
      </>
    )
  );
};

HelpdeskInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default HelpdeskInfo;
