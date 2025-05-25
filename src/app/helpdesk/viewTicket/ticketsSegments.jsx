/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Button,
  CardHeader,
  Collapse,
  Col,
  Row,
} from 'reactstrap';
import { useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';
import {
  faAngleDown, faAngleUp,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Tabs } from 'antd';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import TicketBasicInfo from './ticketBasicInfo';
import SlaInfo from './slaInfo';
import AuditLog from '../../assets/assetDetails/auditLog';
import Documents from './documents';
import Comments from './comments';
import Orders from './orders';
import OrderChecklists from './orderChecklists';
import OrderRemediations from './orderRemediations';
import Injuries from './injuries';
import Damages from './damages';
import tabs from './tabs.json';

import { generateErrorMessage } from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

const { TabPane } = Tabs;
const TicketsSegments = (props) => {
  const {
    isIncident, setParentTicket, setCurrentTicket, type,
  } = props;
  const [currentTab, setActive] = useState('Ticket Overview');
  const [currentCollapse, setCollapse] = useState('Injuries');

  const changeTab = (key) => {
    setActive(key);
  };
  const {
    ticketDetail,
    ticketDetailTab,
  } = useSelector((state) => state.ticket);

  useEffect(() => {
    if (ticketDetailTab && ticketDetailTab.data) {
      setActive(ticketDetailTab.data);
    } else {
      setActive('Ticket Overview');
    }
  }, [ticketDetailTab]);

  useEffect(() => {
    if (isIncident) {
      setActive('Incident Overview');
    } else {
      setActive('Ticket Overview');
    }
  }, [isIncident]);

  const listSegments = isIncident ? tabs.tabsListIncident : tabs.tabsList;

  return (
    <Card className="border-0 bg-lightblue globalModal-sub-cards">
      {ticketDetail && (ticketDetail.data && ticketDetail.data.length > 0) && (
        <CardBody className="pl-0 pr-0">
          <Row>
            <Col md={12} sm={12} xs={12} lg={12} className="pl-1 pr-1">
              <Tabs defaultActiveKey={currentTab} activeKey={currentTab} onChange={changeTab}>
                {listSegments && listSegments.map((tabData) => (
                  <TabPane tab={tabData.name} key={tabData.name} />
                ))}
              </Tabs>

              <div className="">
                {currentTab === 'Ticket Overview' || currentTab === 'Incident Overview'
                  ? <TicketBasicInfo type={type} detailData={ticketDetail} isIncident={isIncident} setParentTicket={setParentTicket} setCurrentTicket={setCurrentTicket} />
                  : ''}
                {currentTab === 'SLA'
                  ? <SlaInfo />
                  : ''}
                {currentTab === 'Comments'
                  ? <Comments />
                  : ''}
                {currentTab === 'Attachments'
                  ? (
                    <Documents
                      viewId={ticketDetail.data[0].id}
                      ticketNumber={ticketDetail.data[0].ticket_number ? ticketDetail.data[0].ticket_number : ''}
                      resModel={appModels.HELPDESK}
                      model={appModels.DOCUMENT}
                      additionalExtensions={['.msg']}
                    />
                  )
                  : ''}
                {currentTab === 'Notes'
                  ? (
                    <>
                      <Comments />
                      <AuditLog ids={ticketDetail.data[0].message_ids} />
                    </>
                  )
                  : ''}
                {currentTab === 'Resolutions'
                  ? <Orders detailData={ticketDetail} />
                  : ''}
                {currentTab === 'Assessments'
                  ? <OrderChecklists />
                  : ''}
                {currentTab === 'Remediations'
                  ? <OrderRemediations />
                  : ''}
                {currentTab === 'Injuries and Damages'
                  ? (
                    <>
                      <div
                        id="accordion"
                        className="accordion-wrapper mb-3 border-0"
                        key="Injuries"
                      >
                        <Card className="border-0">
                          <CardHeader id="headingInjuries" className="p-2 bg-lightgrey border-0">
                            <Button
                              block
                              color="text-dark"
                              id="headingInjuries"
                              className="text-left m-0 p-0 border-0 box-shadow-none"
                              onClick={() => setCollapse('Injuries')}
                              aria-expanded={currentCollapse}
                              aria-controls="collapseInjuries"
                            >
                              <span className="collapse-heading font-weight-800">
                                Injuries
                                {' '}
                              </span>
                              {currentCollapse === 'Injuries'
                                ? <FontAwesomeIcon className="float-right font-weight-300" size="lg" icon={faAngleUp} />
                                : <FontAwesomeIcon className="float-right font-weight-300" size="lg" icon={faAngleDown} />}
                            </Button>
                          </CardHeader>

                          <Collapse
                            isOpen={currentCollapse === 'Injuries'}
                            data-parent="#accordion"
                            id="collapseInjuries"
                            className="border-0"
                            aria-labelledby="headingInjuries"
                          >
                            <Injuries />
                          </Collapse>
                        </Card>
                      </div>
                      <div
                        id="accordion"
                        className="accordion-wrapper mb-3 border-0"
                        key="Damages"
                      >
                        <Card className="border-0">
                          <CardHeader id="headingDamages" className="p-2 bg-lightgrey border-0">
                            <Button
                              block
                              color="text-dark"
                              id="headingDamages"
                              className="text-left m-0 p-0 border-0 box-shadow-none"
                              onClick={() => setCollapse('Damages')}
                              aria-expanded={currentCollapse}
                              aria-controls="collapseDamages"
                            >
                              <span className="collapse-heading font-weight-800">
                                Damages
                                {' '}
                              </span>
                              {currentCollapse === 'Damages'
                                ? <FontAwesomeIcon className="float-right font-weight-300" size="lg" icon={faAngleUp} />
                                : <FontAwesomeIcon className="float-right font-weight-300" size="lg" icon={faAngleDown} />}
                            </Button>
                          </CardHeader>

                          <Collapse
                            isOpen={currentCollapse === 'Damages'}
                            data-parent="#accordion"
                            id="collapseDamages"
                            className="border-0"
                            aria-labelledby="headingDamages"
                          >
                            <Damages />
                          </Collapse>
                        </Card>
                      </div>
                    </>
                  )
                  : ''}
              </div>
            </Col>
          </Row>
          <br />
        </CardBody>
      )}
      {ticketDetail && ticketDetail.loading && (
        <CardBody className="mt-4" data-testid="loading-case">
          <Loader />
        </CardBody>
      )}
      {(ticketDetail && ticketDetail.err) && (
        <CardBody>
          <ErrorContent errorTxt={generateErrorMessage(ticketDetail)} />
        </CardBody>
      )}
    </Card>
  );
};

TicketsSegments.propTypes = {
  isIncident: PropTypes.bool,
  setParentTicket: PropTypes.func.isRequired,
  setCurrentTicket: PropTypes.func.isRequired,
};
TicketsSegments.defaultProps = {
  isIncident: false,
};

export default TicketsSegments;
