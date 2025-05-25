/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faCity,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import totalArea from '@images/icons/totalArea.svg';
import allBuildings from '@images/icons/allBuildings.svg';

import './dashboard.scss';
import GoogleMapView from './googleMapView';
import Sites from './sites';
import Notifications from './schoolNotifications';
import { getTotalArrayValue } from '../util/staticFunctions';
import { detectMob, translateText } from '../util/appUtils';

const SchoolDashboard = () => {
  const [viewType, setViewType] = useState('1');
  const [searchTerm, setSearchTerm] = useState('');
  const { userInfo } = useSelector((state) => state.user);
  const onChangeChkManage = (event) => setViewType(event.target.value);

  const isMob = detectMob();

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    const text = event.target.value;
    if (text.length > 0) {
      const query = new RegExp(`(\\b${text}\\b)`, 'gim');
      if (document.getElementById('sitesList') != null) {
        const list = document.getElementById('sitesList').innerHTML;
        const replaceList = list.replace(/(<span>|<\/span>)/igm, '');
        document.getElementById('sitesList').innerHTML = replaceList;
        const replaceTag = replaceList.replace(query, '<span>$1</span>');
        document.getElementById('sitesList').innerHTML = replaceTag;
      }
    }
  };

  return (
    <Row className={isMob ? 'm-0 pt-2 pb-1' : 'm-0 pt-2 pb-2 pr-1 pl-1'}>
      <Col sm="12" md="12" lg="6" xs="12" className={isMob ? 'mb-2' : 'pr-1 pl-1'}>
        <div className="bg-white box-shadow-grey h-100">
          <Row className="m-0 bg-white box-shadow-grey h-100 p-3">
            <Col sm="1" md="2" lg="2" xs="1" className="p-0">
              <img src={allBuildings} alt="actions" className={isMob ? 'mr-1' : 'mr-1 ml-2 circle-icon'} height={isMob ? 'auto' : '10'} width={isMob ? '20' : '10'} />
            </Col>
            <Col sm="11" md="10" lg="10" xs="11" className="p-0">
              <Row>
                <Col sm="12" md="12" lg="5" xs="12">
                  <h3 className="text-grey">{translateText('All Sites', userInfo)}</h3>
                </Col>
                <Col sm="12" md="12" lg="7" xs="12">
                  <span className="float-right">
                    <FormGroup check inline className="mt-2">
                      <Label className="custom-radio-btn mr-1">
                        <Input className="form-check-input" type="radio" name="viewType" onChange={onChangeChkManage} value="0" checked={viewType === '0'} />
                        <span className="checkmark" />
                      </Label>
                      <span className="mb-2">{translateText('List View', userInfo)}</span>
                    </FormGroup>
                    <FormGroup check inline className="mt-2">
                      <Label className="custom-radio-btn mr-1">
                        <Input className="form-check-input" type="radio" name="viewType" onChange={onChangeChkManage} value="1" checked={viewType === '1'} />
                        <span className="checkmark" />
                      </Label>
                      <span className="mb-2">{translateText('Map View', userInfo)}</span>
                    </FormGroup>
                  </span>
                </Col>
              </Row>
              <Row>
                <Col sm="12" md="12" lg="12" xs="12">
                  <div className="arrow_box">
                    <Card className="rounded-0">
                      <CardBody className="p-2">
                        <Row className="m-0 pb-0">
                          <Col sm="12" md="12" lg="9" xs="12" className="p-0 mt-1">
                            <FontAwesomeIcon className="mr-1 ml-1" size="sm" icon={faMapMarkerAlt} />
                            <small>
                              {translateText('Sites', userInfo)}
                              :
                              {' '}
                            </small>
                            {userInfo && userInfo.data && userInfo.data.allowed_companies.length > 0
                              ? <small className="sitescount">{userInfo.data.allowed_companies.length}</small> : ''}
                            <FontAwesomeIcon className="mr-1 ml-2" size="sm" icon={faCity} />
                            <small>
                              {translateText('Buildings', userInfo)}
                              :
                              {' '}
                            </small>
                            {userInfo && userInfo.data && userInfo.data.allowed_companies.length
                              ? <small className="buildingcount">{getTotalArrayValue(userInfo.data.allowed_companies, 'buildings')}</small> : ''}
                            <img src={totalArea} alt="actions" className="mr-1 ml-2" height="10" width="10" />
                            <small>
                              {translateText('Total Area', userInfo)}
                              {' '}
                              :
                            </small>
                            {userInfo && userInfo.data && userInfo.data.allowed_companies.length
                              ? (
                                <small className="totalarea">
                                  {getTotalArrayValue(userInfo.data.allowed_companies, 'area_sqft')}
                                </small>
                              ) : ''}
                            {userInfo && userInfo.data && userInfo.data.allowed_companies.length && userInfo.data.allowed_companies.length > 0 ? <small className="pl-1">{translateText('sq.ft', userInfo)}</small> : ''}
                          </Col>
                          <Col sm="3" md="3" lg="3" xs="12" className="p-0">
                            <Input className="rounded-pill" id="company-search-text" bsSize="sm" placeholder={translateText('Search', userInfo)} value={searchTerm} onChange={handleChange} />
                            <span>
                              <FontAwesomeIcon color="lightgrey" className="search-icon bg-white" icon={faSearch} />
                            </span>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </div>
                </Col>
              </Row>
            </Col>
            {viewType === '0' && (
            <Sites search={searchTerm} />)}
            {viewType === '1' && (
            <GoogleMapView isSchool search={searchTerm} />)}
          </Row>
        </div>
      </Col>
      <Col sm="12" md="12" lg="6" xs="12" className={isMob ? 'mb-2' : 'pr-1 pl-1'}>
        <Notifications modelName={false} />
      </Col>
    </Row>
  );
};
export default SchoolDashboard;
