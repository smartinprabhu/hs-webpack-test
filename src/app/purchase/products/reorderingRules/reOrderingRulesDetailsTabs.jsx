/* eslint-disable no-lone-blocks */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import { useSelector } from 'react-redux';
import { Tabs } from 'antd';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import { generateErrorMessage } from '../../../util/appUtils';
import ReOrederingOverview from './reOrederingOverview';
import tabs from './tabs.json';

const { TabPane } = Tabs;

const ReOrderingRulesDetailsTabs = () => {
  const [currentTab, setActive] = useState('Reordering Overview');
  const [reOrderingRule, setReOrderingRule] = useState(false);
  const { userInfo } = useSelector((state) => state.user);

  const {
    reOrderingRuleDetailsInfo,
  } = useSelector((state) => state.purchase);

  const changeTab = (key) => {
    setActive(key);
  };
  useEffect(() => {
    if (userInfo && userInfo.data && reOrderingRuleDetailsInfo && reOrderingRuleDetailsInfo.data && reOrderingRuleDetailsInfo.data.length) {
      setReOrderingRule(reOrderingRuleDetailsInfo.data[0]);
    }
  }, [reOrderingRuleDetailsInfo, userInfo]);

  return (
    <Card className="border-0 globalModal-sub-cards bg-lightblue">
      {reOrderingRuleDetailsInfo && (reOrderingRuleDetailsInfo.data && reOrderingRuleDetailsInfo.data.length > 0) && (
        <CardBody className="pr-0 pl-2">
          <Row className="ml-1 mr-1">
            <Col md={12} sm={12} xs={12} lg={12} className="pr-1 pl-1">
              <Tabs defaultActiveKey={currentTab} onChange={changeTab}>
                {tabs && tabs.tabsList.map((tabData) => (
                  <TabPane tab={tabData.name} key={tabData.name} />
                ))}
              </Tabs>
              <div className="tab-content-scroll hidden-scrollbar">
                {currentTab === 'Reordering Overview'
                  ? <ReOrederingOverview detail={reOrderingRuleDetailsInfo} />
                  : ''}
              </div>
            </Col>
          </Row>
          <br />
        </CardBody>
      )}
      {reOrderingRuleDetailsInfo && reOrderingRuleDetailsInfo.loading && (
        <CardBody className="mt-4" data-testid="loading-case">
          <Loader />
        </CardBody>
      )}
      {(reOrderingRuleDetailsInfo && reOrderingRuleDetailsInfo.err) && (
        <CardBody>
          <ErrorContent errorTxt={generateErrorMessage(reOrderingRuleDetailsInfo)} />
        </CardBody>
      )}
    </Card>
  );
};

{ /*
    <>
      <Row>
        <Col md="12" sm="12" lg="12" xs="12">
          <Card className="border-0 h-100">
            {reOrderingRule && (
            <CardBody>
              <Row>
                <Col md={12} sm={12} xs={12} lg={12}>
                  <Tabs defaultActiveKey={currentTab} onChange={changeTab}>
                    {formTabs && formTabs.map((tabData) => (
                      <TabPane tab={tabData.name} key={tabData.name} />
                    ))}
                  </Tabs>
                  {reOrderingRule && currentTab === 'General Information' ? (
                    <Row className="ml-1 mr-1 mt-1">
                      <Col sm="6" md="6" lg="6">
                        <h5>Rules</h5>
                        <Col sm="12" md="12" lg="12" className="mt-3">
                          <Row className="m-0">
                            <span className="font-weight-500">
                              Minimum Quantity
                            </span>
                          </Row>
                          <Row className="m-0">
                            <span className="p-0 font-weight-800 text-capital">
                              {reOrderingRule.product_min_qty ? reOrderingRule.product_min_qty : getDefaultNoValue(reOrderingRule.product_min_qty)}
                            </span>
                          </Row>
                        </Col>
                        <hr className="mt-3" />
                        <Col sm="12" md="12" lg="12" className="mt-3">
                          <Row className="m-0">
                            <span className="font-weight-500">
                              Maximum Quantity
                            </span>
                          </Row>
                          <Row className="m-0">
                            <span className="p-0 font-weight-800 text-capital">
                              {reOrderingRule.product_max_qty ? reOrderingRule.product_max_qty : getDefaultNoValue(reOrderingRule.product_max_qty)}
                            </span>
                          </Row>
                        </Col>
                        <hr className="mt-3" />
                        <Col sm="12" md="12" lg="12" className="mt-3">
                          <Row className="m-0">
                            <span className="font-weight-500">
                              Quantity Multiple
                            </span>
                          </Row>
                          <Row className="m-0">
                            <span className="p-0 font-weight-800 text-capital">
                              {reOrderingRule.qty_multiple ? reOrderingRule.qty_multiple : getDefaultNoValue(reOrderingRule.qty_multiple)}
                            </span>
                          </Row>
                        </Col>
                        <hr className="mt-3" />
                      </Col>
                      <Col sm="6" md="6" lg="6">
                        <h5>Misc</h5>
                        <Col sm="12" md="12" lg="12" className="mt-3">
                          <Row className="m-0">
                            <span className="font-weight-500">
                              Lead Time
                            </span>
                          </Row>
                          <Row className="m-0">
                            <span className="p-0 font-weight-800 text-capital">
                              {reOrderingRule.lead_days ? reOrderingRule.lead_days : getDefaultNoValue(reOrderingRule.lead_days)}
                            </span>
                          </Row>
                        </Col>
                        <hr className="mt-3" />
                        <Col sm="12" md="12" lg="12" className="mt-3">
                          <Row className="m-0">
                            <span className="font-weight-500">
                              Lead Type
                            </span>
                          </Row>
                          <Row className="m-0">
                            <span className="p-0 font-weight-800 text-capital">
                              {reOrderingRule.lead_type ? reOrderingRule.lead_type : getDefaultNoValue(reOrderingRule.lead_type)}
                            </span>
                          </Row>
                        </Col>
                        <hr className="mt-3" />
                        <Col sm="12" md="12" lg="12" className="mt-3">
                          <Row className="m-0">
                            <span className="font-weight-500">
                              Product Unit Of Measure
                            </span>
                          </Row>
                          <Row className="m-0">
                            <span className="p-0 font-weight-800 text-capital">
                              {reOrderingRule.product_uom && reOrderingRule.product_uom.length ? reOrderingRule.product_uom[1] : getDefaultNoValue(reOrderingRule.product_uom)}
                            </span>
                          </Row>
                        </Col>
                        <hr className="mt-3" />
                      </Col>
                    </Row>
                  ) : ''}
                </Col>
              </Row>
            </CardBody>
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
}; */ }

export default ReOrderingRulesDetailsTabs;