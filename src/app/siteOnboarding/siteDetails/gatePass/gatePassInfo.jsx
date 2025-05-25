/* eslint-disable import/no-unresolved */
import DrawerHeader from '@shared/drawerHeader';
import { Drawer } from 'antd';
import * as PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { Button } from '@mui/material';
import {
  setInitialValues,
} from '../../../purchase/purchaseService';
import {
  getGatePassDetails, setRecipientsLocationId,
} from '../../siteService';
import {
  resetUpdateProductCategory,
} from '../../../pantryManagement/pantryService';

import AddGatePassSettings from './addGatePassSettings';

const appModels = require('../../../util/appModels').default;

const GatePassInfo = (props) => {
  const {
    detailData,
    setDetailViewClose,
  } = props;
  const dispatch = useDispatch();
  const {
    gatePassSettingsInfo,
  } = useSelector((state) => state.site);

  const [isRedirectThree, setRedirectThree] = useState(false);

  const editId = detailData && detailData.id ? detailData.id : false;

  const closeManage = () => {
    dispatch(setInitialValues(false, false, false, false));
    setRedirectThree(false);
    setDetailViewClose(true);
  };

  const onLoadManageSettings = () => {
    dispatch(getGatePassDetails(detailData.id, appModels.GATEPASSCONFIGURATION));
    if (document.getElementById('gatePassSettingsForm')) {
      document.getElementById('gatePassSettingsForm').reset();
    }
    dispatch(setRecipientsLocationId([]));
    setRedirectThree(true);
    setDetailViewClose(false);
  };

  const closeEditWindow = () => {
    if (document.getElementById('gatePassSettingsForm')) {
      document.getElementById('gatePassSettingsForm').reset();
    }
    resetUpdateProductCategory();
    setRedirectThree(false);
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
              disabled={gatePassSettingsInfo && gatePassSettingsInfo.data && gatePassSettingsInfo.data.length <= 0}
              className="hoverColor pb-05 pt-05 float-right mr-4 font-11 rounded-pill mb-1 mr-2"
              onClick={() => onLoadManageSettings()}
            >
              Manage
            </Button>
          </Col>
        </Row>
        <Drawer
          title=""
          closable={false}
          width={1250}
          visible={isRedirectThree}
        >
          <DrawerHeader
            title="Gatepass Settings"
            imagePath=""
            closeDrawer={closeManage}
          />
          <AddGatePassSettings editId={editId} closeModal={closeEditWindow} />
        </Drawer>
      </>
    )
  );
};

GatePassInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
  setDetailViewClose: PropTypes.func.isRequired,
};
export default GatePassInfo;
