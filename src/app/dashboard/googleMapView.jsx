/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Col,
} from 'reactstrap';
import { useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';
import GoogleMapReact from 'google-map-react';

import './dashboard.scss';
import GoogleMapLocation from './googleMapLocation';

const appConfig = require('../config/appConfig').default;

const GoogleMapView = (props) => {
  const { isSchool, search } = props;
  const { userInfo } = useSelector((state) => state.user);

  const [searchResults, setSearchResults] = useState(userInfo && userInfo.data && userInfo.data.allowed_companies);
  const [defaultLatandLong, setDefaultLatandLong] = useState(null);

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.allowed_companies && search) {
      const searchText = search.toLowerCase();

      const results = userInfo && userInfo.data && userInfo.data.allowed_companies.filter(
        (obj) => obj.name.toLowerCase().includes(searchText) || (obj.street_address && (obj.street_address.toLowerCase().includes(searchText))),
      );
      const validLatLong = results.filter(
        (obj) => (isFinite(obj.latitude) && Math.abs(obj.latitude) <= 90) && (isFinite(obj.longitude) && (Math.abs(obj.longitude) <= 180)),
      );
      setSearchResults(validLatLong);
    } else {
      const results = userInfo && userInfo.data && userInfo.data.allowed_companies;
      if (results && results.length > 0) {
        const validLatLong = results.filter(
          (obj) => (isFinite(obj.latitude) && Math.abs(obj.latitude) <= 90) && (isFinite(obj.longitude) && (Math.abs(obj.longitude) <= 180)),
        );
        setSearchResults(validLatLong);
      }
    }
  }, [userInfo, search]);

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company && userInfo.data.allowed_companies) {
      const data = userInfo.data.allowed_companies.filter((company) => company.id === userInfo.data.company.id);
      const defaultData = userInfo.data.allowed_companies.filter((company) => (company.latitude && company.longitude));
      if (data && data.length && data[0].latitude && data[0].longitude) {
        setDefaultLatandLong({ lat: Number(data[0].latitude), lng: Number(data[0].longitude) });
      } else if (defaultData && defaultData.length) {
        setDefaultLatandLong({ lat: Number(defaultData[0].latitude), lng: Number(defaultData[0].longitude) });
      } else {
        setDefaultLatandLong({ lat: Number(12.977937), lng: Number(77.582821) });
      }
    }
  }, [userInfo]);

  const companyDataList = searchResults && searchResults.length > 0 ? searchResults : [];

  return (
    <Col xs="12" md="12" lg="12" sm="12" className="p-0 pt-2">
      <Card className={isSchool ? 'border-0' : ''}>
        <CardBody className="p-2">
          {search && companyDataList && companyDataList.length === 0 && (
            <div className="text-danger text-center mb-1">
              {`${search}`}
              {' '}
              Location not found
            </div>
          )}
          <div className="map">
            {defaultLatandLong && userInfo && userInfo.data && userInfo.data.company
              && (
              <GoogleMapReact
                bootstrapURLKeys={{ key: appConfig.GOOGLEAPIKEY }}
                defaultZoom={11}
                defaultCenter={defaultLatandLong}
              >
                {companyDataList && companyDataList.map((company) => (
                  company.latitude && company.latitude !== false && company.longitude && company.longitude !== false
                    ? (
                      <GoogleMapLocation
                        key={company.id}
                        lat={company.latitude}
                        lng={company.longitude}
                        text={company.name}
                        address={company.street_address && (company.street_address)}
                        isSchool={isSchool}
                        companyId={company.id}
                      />
                    )
                    : ''
                ))}
              </GoogleMapReact>
              )}
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

GoogleMapView.propTypes = {
  search: PropTypes.string.isRequired,
  isSchool: PropTypes.bool.isRequired,
};

export default GoogleMapView;
