/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Card, CardBody, Col, Row,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { Select, DatePicker, Spin } from 'antd';

import configurationBlack from '@images/icons/configurationBlack.svg';
import ErrorContent from '@shared/errorContent';


import AssetQuipmentCards from '../assetsDashboard/assetQuipmentCards';
import ChartCards from '../assetsDashboard/chartCards';

import {
  getNinjaDashboard,
} from '../../analytics/analytics.service';
import { generateErrorMessage } from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

const { RangePicker } = DatePicker;

const DashboardView = () => {
  const subMenu = 1;
  const dispatch = useDispatch();
  const [dateRange, setDateRange] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('All');

  const { userInfo } = useSelector((state) => state.user);
  const { allowedCompanies } = useSelector((state) => state.setup);
  const { ninjaDashboard } = useSelector((state) => state.analytics);

  useEffect(() => {
    if (dateRange) {
      if (dateRange && dateRange.length && dateRange[0] && dateRange[0] !== null) {
        const start = `${moment(dateRange[0]).utc().format('YYYY-MM-DD')}T00:00:00.00Z`;
        const end = `${moment(dateRange[1]).utc().format('YYYY-MM-DD')}T23:59:59.00Z`;
        const context = { ksDateFilterEndDate: end, ksDateFilterSelection: 'l_custom', ksDateFilterStartDate: start };
        dispatch(getNinjaDashboard('ks_fetch_dashboard_data', appModels.NINJABOARD, 43, context));
      }
    }
  }, [dateRange]);

  useEffect(() => {
    const context = { ksDateFilterEndDate: false, ksDateFilterSelection: 'l_none', ksDateFilterStartDate: false };
    dispatch(getNinjaDashboard('ks_fetch_dashboard_data', appModels.NINJABOARD, 43, context));
  }, []);

  // eslint-disable-next-line no-nested-ternary
  const userCompanies = allowedCompanies && allowedCompanies.data && allowedCompanies.data.allowed_companies && allowedCompanies.data.allowed_companies.length > 0
    ? allowedCompanies.data.allowed_companies : userInfo && userInfo.data && userInfo.data.allowed_companies && userInfo.data.allowed_companies.length > 0 ? userInfo.data.allowed_companies : [];

  const onChangeDateRange = (values) => {
    setDateRange(values);
  };

  return (
    <Row className="ml-1 mr-1 mt-2 mb-2 p-2 border">
      <Col sm="12" md="12" lg="12" xs="12">
        <Row>
          <Col md="12" sm="12" lg="12" xs="12" className="pt-2">
            <Card className="p-2 mb-2 h-100">
              <CardBody className="p-1 m-0">
                <Row className="position-relative">
                  <Col md="6">
                    <h2 className="text-mandy font-weight-bold">
                      <img
                        src={configurationBlack}
                        width="50"
                        height="50"
                        alt="Engineering"
                        className="mr-2"
                      />
                      Engineering Dashboard
                    </h2>
                  </Col>
                  <Col md="4">
                    <div className="d-flex mt-2">
                      <div className="d-flex flex-column mr-3">
                        <Select
                          options={userCompanies.map((vl) => ({
                            value: vl.id,
                            label: vl.name,
                          }))}
                          value={selectedFilter}
                          onSelect={(value) => setSelectedFilter(value)}
                          style={{ minWidth: 100 }}
                        />
                      </div>
                      {ninjaDashboard && !ninjaDashboard.loading && (
                        <RangePicker
                          onChange={onChangeDateRange}
                          value={dateRange}
                          format="DD-MM-y"
                          size="small"
                          className="mt-n2px"
                        />

                      )}
                    </div>
                  </Col>
                </Row>
                <Row sm="12">
                  <Col className="mt-3">
                    <Card className="border-0">
                      <CardBody>
                        {ninjaDashboard && ninjaDashboard.loading && (
                          <div className="text-center mt-2 mb-2">
                            <Spin />
                          </div>
                        )}
                        {ninjaDashboard && ninjaDashboard.data && !ninjaDashboard.loading && !ninjaDashboard.err && (
                        <AssetQuipmentCards
                          data={ninjaDashboard.data.ks_item_data}
                          dataList={ninjaDashboard.data.ks_gridstack_config}
                        />
                        )}
                        {ninjaDashboard && ninjaDashboard.err && (
                        <ErrorContent errorTxt={generateErrorMessage(ninjaDashboard)} />
                        )}
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
                <>
                  {ninjaDashboard && ninjaDashboard.loading && (
                  <div className="text-center mt-2 mb-2">
                    <Spin />
                  </div>
                  )}

                  <ChartCards
                    data={ninjaDashboard && ninjaDashboard.data ? ninjaDashboard.data.ks_item_data : false}
                    dataList={ninjaDashboard && ninjaDashboard.data ? ninjaDashboard.data.ks_gridstack_config : false}
                  />

                  {ninjaDashboard && ninjaDashboard.err && (
                  <ErrorContent errorTxt={generateErrorMessage(ninjaDashboard)} />
                  )}
                </>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>

  );
};

export default DashboardView;
