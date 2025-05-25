/* eslint-disable import/no-unresolved */
import { Button, Drawer } from '@mui/material';
import * as PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import {
  resetUpdateProductCategory,
} from '../../../pantryManagement/pantryService';
import DrawerHeader from '../../../commonComponents/drawerHeader';
import {
  getEscalationLevelFilters,
  getHelpdeskSettingDetails,
  getProblemCategoryFilters,
  getProblemCategoryGroupFilters,
} from '../../siteService';
import AddHelpdeskSettings from './addHelpdeskSettings';
import EscalationLevel from './escalationLevel';
import ProblemCategory from './problemCategory';
import ProblemCategoryGroup from './problemCategoryGroup';

const appModels = require('../../../util/appModels').default;

const HelpdeskInfo = (props) => {
  const {
    detailData,
  } = props;
  const dispatch = useDispatch();
  const {
    helpdeskSettingsInfo,
  } = useSelector((state) => state.site);
  const { parentSiteGroupInfo } = useSelector((state) => state.site);

  const [isRedirectOne, setRedirectOne] = useState(false);
  const [isRedirectTwo, setRedirectTwo] = useState(false);
  const [isRedirectThree, setRedirectThree] = useState(false);
  const [isRedirectFour, setRedirectFour] = useState(false);

  const editId = detailData && detailData.id ? detailData.id : false;

  const closeManage = () => {
    // dispatch(setInitialValues(false, false, false, false));
    setRedirectOne(false);
    setRedirectTwo(false);
    setRedirectThree(false);
    setRedirectFour(false);
  };

  const onLoadManageCategory = () => {
    dispatch(getProblemCategoryFilters([]));
    setRedirectOne(true);
  };

  const onLoadManageCategoryGroup = () => {
    dispatch(getProblemCategoryFilters([]));
    dispatch(getProblemCategoryGroupFilters([]));
    setRedirectFour(true);
  };

  const onLoadManageEscalation = () => {
    dispatch(getEscalationLevelFilters([]));
    setRedirectTwo(true);
  };

  const onLoadManageSettings = () => {
    dispatch(getHelpdeskSettingDetails(detailData.id, appModels.MAINTENANCECONFIG));
    if (document.getElementById('helpdeskSettingsForm')) {
      document.getElementById('helpdeskSettingsForm').reset();
    }
    dispatch(resetUpdateProductCategory());
    setRedirectThree(true);
  };

  const closeEditWindow = () => {
    if (document.getElementById('helpdeskSettingsForm')) {
      document.getElementById('helpdeskSettingsForm').reset();
    }
    dispatch(resetUpdateProductCategory());
    setRedirectThree(false);
  };

  const isProblemCategorySiteSpecific = helpdeskSettingsInfo && helpdeskSettingsInfo.data && helpdeskSettingsInfo.data.length > 0 && helpdeskSettingsInfo.data[0].has_site_specific_category;

  const problemCategoryType = helpdeskSettingsInfo && helpdeskSettingsInfo.data && helpdeskSettingsInfo.data.length > 0 && helpdeskSettingsInfo.data[0].problem_category_type;

  const parentSiteArray = parentSiteGroupInfo && parentSiteGroupInfo.data
    && parentSiteGroupInfo.data.length && parentSiteGroupInfo.data.filter((item) => item.parent_id && item.parent_id[0] === detailData.id);
  const isParentIds = !!(parentSiteArray && parentSiteArray.length && parentSiteArray.length > 0);
  const isParent = detailData.is_parent;
  const isSiteParent = problemCategoryType && problemCategoryType === 'Site';

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
              disabled={helpdeskSettingsInfo && helpdeskSettingsInfo.data && helpdeskSettingsInfo.data.length <= 0}
              className="hoverColor pb-05 pt-05 float-right mr-4 font-11 rounded-pill mb-1 mr-2"
              onClick={() => onLoadManageSettings()}
            >
              Manage
            </Button>
          </Col>
        </Row>
        {!isProblemCategorySiteSpecific ? (
          (isParentIds || isParent) && isSiteParent && (
          <Row className="m-0">
            <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
              <span className="m-0 p-0">
                Problem Category
              </span>
            </Col>
            <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
              <Button
                variant="contained"
                size="sm"
                className="hoverColor pb-05 pt-05 float-right mr-4 font-11 rounded-pill mb-1 mr-2"
                    // disabled={problemCategoryType && problemCategoryType !== 'Site'}
                onClick={() => onLoadManageCategory()}
              >
                Manage
              </Button>
            </Col>
          </Row>
          ))
          : (
            <Row className="m-0">
              <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
                <span className="m-0 p-0">
                  Problem Category Group
                </span>
              </Col>
              <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
                <Button
                  variant="contained"
                  size="sm"
                  disabled={problemCategoryType && problemCategoryType !== 'Site'}
                  className="hoverColor pb-05 pt-05 float-right mr-4 font-11 rounded-pill mb-1 mr-2"
                  onClick={() => onLoadManageCategoryGroup()}
                >
                  Manage
                </Button>
              </Col>
            </Row>
          )}
        <Row className="m-0">
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0">
              Escalation Level
            </span>
          </Col>
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0">
              <Button
                variant="contained"
                size="sm"
                className="hoverColor pb-05 pt-05 float-right mr-4 font-11 rounded-pill mb-1 mr-2"
                onClick={() => onLoadManageEscalation()}
              >
                Manage
              </Button>
            </span>
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
          open={isRedirectOne}
        >
          <DrawerHeader
            headerName="Problem Category"
            imagePath=""
            onClose={closeManage}
          />
          <ProblemCategory />
        </Drawer>

        <Drawer
          PaperProps={{
            sx: { width: '85%' },
          }}
          ModalProps={{
            disableEnforceFocus: true,
          }}
          anchor="right"
          open={isRedirectFour}
        >
          <DrawerHeader
            headerName="Problem Category Group"
            imagePath=""
            onClose={closeManage}
          />
          <ProblemCategoryGroup />
        </Drawer>

        <Drawer
          PaperProps={{
            sx: { width: '85%' },
          }}
          ModalProps={{
            disableEnforceFocus: true,
          }}
          anchor="right"
          open={isRedirectTwo}
        >
          <DrawerHeader
            headerName="Escalation Level"
            imagePath=""
            onClose={closeManage}
          />
          <EscalationLevel />
        </Drawer>
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
            headerName="Helpdesk Settings"
            imagePath=""
            onClose={closeManage}
          />
          <AddHelpdeskSettings editId={editId} closeModal={closeEditWindow} />
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
