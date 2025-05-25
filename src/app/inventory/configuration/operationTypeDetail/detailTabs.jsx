/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as PropTypes from 'prop-types';
import { Tabs } from 'antd';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import tabs from './tabs.json';
import OperationOverview from './operationOverview';
import { generateErrorMessage } from '../../../util/appUtils';

const { TabPane } = Tabs;
const OperationDetailTabs = (props) => {
  const {
    detail,
  } = props;
  const [currentTab, setActive] = useState('Operation Overview');

  /* function checkAllowed(name, state) {
    let result = true;
    if (name === 'Inventory Adjustments' && state !== 'done') {
      result = false;
    }
    return result;
  } */

  const changeTab = (key) => {
    setActive(key);
  };

  return (
    <Card className="border-0 globalModal-sub-cards bg-lightblue">
      {detail && (detail.data && detail.data.length > 0) && (
        <CardBody className="pl-0 pr-0">
          <Row className="ml-0 mr-1">
            <Col md={12} sm={12} xs={12} lg={12} className="pl-0 pr-1">
              <Tabs defaultActiveKey={currentTab} onChange={changeTab}>
                {tabs && tabs.tabsList.map((tabData) => (
                  <TabPane tab={tabData.name} key={tabData.name} />
                ))}
              </Tabs>
              <div className="tab-content-scroll hidden-scrollbar">
                {currentTab === 'Operation Overview'
                  ? <OperationOverview detail={detail} />
                  : ''}
              </div>
            </Col>
          </Row>
          <br />
        </CardBody>
      )}
      {detail && detail.loading && (
        <CardBody className="mt-4" data-testid="loading-case">
          <Loader />
        </CardBody>
      )}
      {(detail && detail.err) && (
        <CardBody>
          <ErrorContent errorTxt={generateErrorMessage(detail)} />
        </CardBody>
      )}
    </Card>
  );
};
// eslint-disable-next-line no-lone-blocks
{ /*
    <Row>
      <Col md="12" sm="12" lg="12" xs="12">
        <Card className="border-0">
          {detail && (detail.data && detail.data.length > 0) && (
            <CardBody>
              <Row>
                <Col md={12} sm={12} xs={12} lg={12}>
                  {tabs && tabs.tabsList.map((tabData) => (
                    checkAllowed(tabData.name, detail.data[0].state ? detail.data[0].state : '')
                      && (
                      <div
                        id="accordion"
                        className="accordion-wrapper mb-3 border-0"
                        key={tabData.name}
                      >
                        <Card className="border-0">
                          <CardHeader id={`heading${tabData.name}`} className="p-2 bg-lightgrey border-0">
                            <Button
                              block
                              color="text-dark"
                              id={`heading${tabData.name}`}
                              className="text-left m-0 p-0 border-0 box-shadow-none"
                              onClick={() => setActive(tabData.name)}
                              aria-expanded={currentTab}
                              aria-controls={`collapse${tabData.name}`}
                            >
                              <span className="collapse-heading font-weight-800">
                                {tabData.name}
                                {' '}
                              </span>
                              {currentTab === tabData.name
                                ? <FontAwesomeIcon className="float-right font-weight-300" size="lg" icon={faAngleUp} />
                                : <FontAwesomeIcon className="float-right font-weight-300" size="lg" icon={faAngleDown} />}
                            </Button>
                          </CardHeader>

                          <Collapse
                            isOpen={currentTab === tabData.name}
                            data-parent="#accordion"
                            id={`collapse${tabData.name}`}
                            className="border-0"
                            aria-labelledby={`heading${tabData.name}`}
                          >
                            {currentTab === tabData.name && currentTab === 'Inventory Details'
                              ? <Products />
                              : ''}
                            {currentTab === tabData.name && currentTab === 'Inventory Adjustments'
                              ? <ProductsAdjustments />
                              : ''}
                          </Collapse>
                        </Card>
                      </div>
                      )
                  ))}
                </Col>
              </Row>
              <br />
            </CardBody>
          )}
        </Card>
      </Col>
    </Row>
  );
}; */ }

OperationDetailTabs.propTypes = {
  detail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};
export default OperationDetailTabs;
