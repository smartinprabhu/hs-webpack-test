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
import AddMailRoomSetting from './addMailRoomSetting';
import {
  resetUpdateProductCategory,
} from '../../../pantryManagement/pantryService';
import { getMailRoomSettingDetails } from '../../siteService';

const appModels = require('../../../util/appModels').default;

const MailRoomInfo = (props) => {
  const {
    detailData,
    setDetailViewClose,
  } = props;
  const dispatch = useDispatch();
  const {
    mailroomSettingsInfo,
  } = useSelector((state) => state.site);

  const [isRedirect, setRedirect] = useState(false);

  const editId = detailData && detailData.id ? detailData.id : false;


  const onLoadManageSettings = () => {
    dispatch(getMailRoomSettingDetails(detailData.id, appModels.MAILROOMCONFIG));
    if (document.getElementById('mailRoomSettingsForm')) {
      document.getElementById('mailRoomSettingsForm').reset();
    }
    setRedirect(true);
    setDetailViewClose(false);
  };

  const closeManage = () => {
    dispatch(setInitialValues(false, false, false, false));
    setRedirect(false);
    setDetailViewClose(true);
  };

  const closeEditWindow = () => {
    if (document.getElementById('mailRoomSettingsForm')) {
      document.getElementById('mailRoomSettingsForm').reset();
    }
    setRedirect(false);
    setDetailViewClose(true);
    dispatch(resetUpdateProductCategory());
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
              disabled={mailroomSettingsInfo && mailroomSettingsInfo.data && mailroomSettingsInfo.data.length <= 0}
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
          visible={isRedirect}
        >
          <DrawerHeader
            title="Mailroom Management Settings"
            imagePath=""
            closeDrawer={closeManage}
          />
          <AddMailRoomSetting editId={editId} closeModal={closeEditWindow} />
        </Drawer>
      </>
    )
  );
};

MailRoomInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
  setDetailViewClose: PropTypes.func.isRequired,
};
export default MailRoomInfo;