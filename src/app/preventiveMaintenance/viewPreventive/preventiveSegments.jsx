import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Row,
  Col,
} from 'reactstrap';
import { useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';

import { Tabs } from 'antd';

import Loader from '../../shared/loading';
import ErrorContent from '../../shared/errorContent';

import { generateErrorMessage } from '../../util/appUtils';

import Assets from './assets';
// import PPMOverview from './ppmOverview';
import PreventiveOverview from './preventiveOverview';
import Options from './options';
import tabs from './tabs.json';

const { TabPane } = Tabs;

const PreventiveSegments = ({ isInspection }) => {
  const [currentTab, setActive] = useState('PPM Overview');
  const { ppmDetail } = useSelector((state) => state.ppm);

  useEffect(() => {
    setActive('PPM Overview');
  }, [ppmDetail]);

  const changeTab = (key) => {
    setActive(key);
  };

  return (
    <>
      <Card className="border-0 bg-lightblue globalModal-sub-cards">
        {ppmDetail && (ppmDetail.data && ppmDetail.data.length > 0) && (
        <CardBody className="pr-0 pl-0">
          <Row>
            <Col md={12} sm={12} xs={12} lg={12} className="pr-1 pl-3">
              <Tabs defaultActiveKey={currentTab} onChange={changeTab}>
                {tabs && tabs.tabsList.map((tabData) => (
                  <TabPane tab={tabData.name} key={tabData.name} />
                ))}
              </Tabs>
              <div className="tab-content-scroll hidden-scrollbar">
                {currentTab === 'PPM Overview'
                  ? <PreventiveOverview isInspection={isInspection} />
                  : ''}
                {currentTab === 'Assets'
                  ? <Assets isInspection={isInspection} />
                  : ''}
                {currentTab === 'Options'
                  ? <Options isInspection={isInspection} />
                  : ''}
              </div>
            </Col>
          </Row>
          <br />
        </CardBody>
        )}
        {ppmDetail && ppmDetail.loading && (
        <CardBody className="mt-4" data-testid="loading-case">
          <Loader />
        </CardBody>
        )}
        {(ppmDetail && ppmDetail.err) && (
        <CardBody>
          <ErrorContent errorTxt={generateErrorMessage(ppmDetail)} />
        </CardBody>
        )}
      </Card>
      {/* <Card className="border-0 h-100">
        <CardBody>
          <Row>
            <Nav>
              {tabs && tabs.tabsList.map((item) => (
                <div className="mr-2 ml-3" key={item.id}>
                  <NavLink className="nav-link-item pt-2 pb-1 pl-1 pr-1" active={currentTab === item.name} href="#" onClick={() => setActive(item.name)}>{item.name}</NavLink>
                </div>
              ))}
            </Nav>
          </Row>
          <br />
          {currentTab === 'Assets'
            ? <Assets isInspection={isInspection} />
            : ''}
          {currentTab === 'Details'
            ? <Details isInspection={isInspection} />
            : ''}
          {currentTab === 'Options'
            ? <Options />
            : ''}
        </CardBody>
              </Card> */}

    </>
  );
};

PreventiveSegments.propTypes = {
  isInspection: PropTypes.bool,
};
PreventiveSegments.defaultProps = {
  isInspection: false,
};

export default PreventiveSegments;
