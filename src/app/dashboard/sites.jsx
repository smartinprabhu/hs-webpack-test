/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
  Button,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCaretRight,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';
import {
  Drawer,
  Tooltip,
} from 'antd';
import { ThemeProvider } from '@material-ui/core/styles';

import './dashboard.scss';
import closeCircle from '@images/icons/closeCircle.svg';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';

import { getCompanyDetail } from '../adminSetup/setupService';
import {
  resetSpaceData, resetSpaceEquipments,
  resetAssetDetails,
} from '../assets/equipmentService';
import { generateErrorMessage, translateText } from '../util/appUtils';

import theme from '../util/materialTheme';

const appModels = require('../util/appModels').default;

const Sites = (props) => {
  const { search } = props;
  const { userInfo } = useSelector((state) => state.user);
  const [searchResults, setSearchResults] = useState(userInfo && userInfo.data && userInfo.data.allowed_companies);

  const dispatch = useDispatch();

  const [viewModal, setViewModal] = useState(false);
  const [viewId, setViewId] = useState(false);

  const { companyDetail } = useSelector((state) => state.setup);

  const companyDetailData = companyDetail && companyDetail.data && companyDetail.data.length ? companyDetail.data[0] : false;

  const onView = (companyId) => {
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

  useEffect(() => {
    if (userInfo && userInfo.data && search) {
      const searchText = search.toLowerCase();
      const results = userInfo && userInfo.data && userInfo.data.allowed_companies.filter(
        (obj) => obj.name.toLowerCase().includes(searchText) || (obj.street_address && (obj.street_address.toLowerCase().includes(searchText))),
      );
      setSearchResults(results);
    } else {
      const results = userInfo && userInfo.data && userInfo.data.allowed_companies;
      setSearchResults(results);
    }
  }, [userInfo, search]);

  const companyDataList = searchResults && searchResults.length > 0 ? searchResults : [];
  return (
    <Col md={12} lg={12} xs={12} sm={12} className="p-0 pt-2">
      <Card className="rounded-0">
        <CardBody>
          <h5>
            {translateText('All Sites', userInfo)}
            {' '}
            :
          </h5>
          {userInfo && userInfo.loading && (
            <span data-testid="loading-sites"><Loader id="loading-sites" /></span>
          )}
          <Row className="scroll-column rounded m-0 pb-3 pl-3 pr-3 pt-2 thin-scrollbar">
            <Col sm="12" xs="12" md="12" lg="12" className="pl-1 siteList companyListView">
              {companyDataList && companyDataList.length > 0 && companyDataList.map((companyRes) => (
                <Row className="site-list p-1 ml-4" id="sitesList" key={companyRes.id}>
                  <Col sm="12" xs="12" md="12" lg="12" onClick={() => onView(companyRes.id)} className="cursor-pointer p-0 d-flex">
                    <FontAwesomeIcon className="float-left mr-2 mt-1" icon={faCaretRight} />
                    <div className="font-weight-600">{companyRes.name}</div>
                    {companyRes && companyRes.street_address && (
                      <div className="font-weight-300">
                        {' '}
                        ,
                        {companyRes.street_address}
                      </div>
                    )}
                  </Col>
                </Row>
              ))}
            </Col>
          </Row>
          {(userInfo && userInfo.err) && (
          <Row className="scroll-column rounded m-0 p-3 thin-scrollbar">
            <Col sm="12" xs="12" md="12" lg="12" className="pl-1 siteList">
              <ErrorContent errorTxt={userInfo.err.statusText ? userInfo.err.statusText : 'Something went wrong'} />
            </Col>
          </Row>
          )}
          {(userInfo && !userInfo.loading && !userInfo.err) && (companyDataList && companyDataList.length <= 0) && (
          <Row className="scroll-column rounded m-0 p-3 thin-scrollbar">
            <Col sm="12" xs="12" md="12" lg="12" className="pl-1 siteList">
              <ErrorContent errorTxt="No data found." />
            </Col>
          </Row>
          )}
          <Drawer
            title=""
            closable={false}
            className="drawer-background-color-light-grey"
            width="95%"
            visible={viewModal}
          >
            <div className="drawer-sticky-close">
              <Tooltip title="Close" placement="left">
                <Button className="rounded-pill bg-white" size="sm" onClick={() => onViewReset()}>
                  <img src={closeCircle} aria-hidden className="" height="15" width="15" alt="close" />
                </Button>
              </Tooltip>
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
        </CardBody>
      </Card>
    </Col>
  );
};

Sites.propTypes = {
  search: PropTypes.string.isRequired,
};

export default Sites;
