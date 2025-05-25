/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import Tooltip from 'react-png-tooltip';
import {
  Drawer,
} from 'antd';
import { ThemeProvider } from '@material-ui/core/styles';

import TooltipComponent from '@shared/tooltipComponent';
import mapicon from '@images/mapicon.png';
import location from '@images/icons/location.png';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';

import googleMapLocationStyles from './googleMapLocationStyles';
import theme from '../util/materialTheme';
import { getColumnArrayByIdCase, generateErrorMessage, translateText } from '../util/appUtils';

import { getCompanyDetail } from '../adminSetup/setupService';
import {
  resetSpaceData, resetSpaceEquipments,
  resetAssetDetails,
} from '../assets/equipmentService';

// import DetailSchoolView from '../antDashboards/detailSchoolView';

const appModels = require('../util/appModels').default;

const GoogleMapLocation = (props) => {
  const {
    companyId, address, text, isSchool,
  } = props;

  const dispatch = useDispatch();

  const [viewModal, setViewModal] = useState(false);
  const [viewId, setViewId] = useState(false);

  const onView = () => {
    setViewId(companyId);
    setViewModal(true);
  };

  const onViewReset = () => {
    dispatch(resetAssetDetails());
    dispatch(resetSpaceData());
    dispatch(resetSpaceEquipments());
    setViewId(false);
    setViewModal(false);
  };

  useEffect(() => {
    if (viewId) {
      dispatch(getCompanyDetail(viewId, appModels.COMPANY));
    }
  }, [viewId]);

  const { userInfo, userRoles } = useSelector((state) => state.user);

  const { companyDetail } = useSelector((state) => state.setup);

  const companyDetailData = companyDetail && companyDetail.data && companyDetail.data.length ? companyDetail.data[0] : false;

  const menuNames = getColumnArrayByIdCase(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'name');

  return (
    <div style={googleMapLocationStyles}>
      <Tooltip className="bg-white rounded-0" style={{ borderRadius: '0' }} tooltip={<img className="mapicon" src={mapicon} alt="Mapicon" />}>
        <Row>
          <Col lg="12" xs="12" md="12" sm="12">
            <b className="float-left mb-2">{text}</b>
          </Col>
        </Row>
        <Row>
          <Col lg="12" xs="12" md="12" sm="12">
            {address
              ? (
                <div className="float-left d-flex mb-2 text-justify">
                  <img className="mr-1" src={location} alt="location" height="15" width="15" />
                  {' '}
                  {address}
                </div>
              ) : ''}
          </Col>
        </Row>
        {menuNames.includes('asset registry') && (
          <Row>
            <Col lg="12" xs="12" md="12" sm="12">
              <div>
                <b className="float-right">
                  {!isSchool && (
                  <a
                    className="text-dark"
                    href="/assets/locations"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {translateText('VIEW MORE', userInfo)}
                    {' '}
                  </a>
                  )}
                  {isSchool && (
                  <a
                    className="text-dark"
                    aria-hidden
                    onClick={() => onView()}
                  >
                    {translateText('VIEW MORE', userInfo)}
                    {' '}
                  </a>
                  )}
                </b>
              </div>
            </Col>
          </Row>
        )}
      </Tooltip>
      <Drawer
        title=""
        closable={false}
        className="drawer-background-color-light-grey"
        width="95%"
        visible={viewModal}
      >
        <div className="drawer-sticky-close">
          <TooltipComponent closeDrawer={() => onViewReset()} />
        </div>
        {companyDetail && companyDetail.loading && (
          <div className="mt-4">
            <Loader />
          </div>
        )}
        {companyDetail && companyDetail.err && (
          <div className="mt-4">
            <ErrorContent errorTxt={generateErrorMessage(companyDetail.err)} />
          </div>
        )}
        {companyDetail && !companyDetail.loading && companyDetailData && (
          <ThemeProvider theme={theme}>
            
          </ThemeProvider>
        )}
      </Drawer>
    </div>
  );
};

GoogleMapLocation.propTypes = {
  text: PropTypes.string.isRequired,
  address: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  isSchool: PropTypes.bool.isRequired,
  companyId: PropTypes.number.isRequired,
};

export default GoogleMapLocation;
