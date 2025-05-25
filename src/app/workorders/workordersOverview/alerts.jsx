/* eslint-disable import/no-unresolved */
// eslint-disable-next-line import/no-unresolved
import React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Row,
} from 'reactstrap';

import alertIcon from '@images/icons/alerts.svg';
import starBlackIcon from '@images/icons/starBlack.svg';
import starGreyIcon from '@images/icons/starGrey.svg';
import alertMessageBlackIcon from '@images/icons/alertMessageBlack.svg';
import alertMessageRedIcon from '@images/icons/alertMessageRed.svg';
import './workordersOverview.scss';
import alerts from './data/alerts.json';

const Alerts = () => (
  <Card className="p-2 border-0 h-100">
    <CardTitle>
      <h6>
        <img src={alertIcon} className="mr-2" alt="alerts" height="20" width="20" />
        WORK ORDERS ALERTS
      </h6>
    </CardTitle>
    <CardBody className="alarms-list p-0 ml-3 thin-scrollbar">
      {
        alerts && alerts.map((actions, index) => (
          <Row className="pb-2 m-0" key={actions.id}>
            <Col md="12">
              <Card className="border-left-dark bg-thinblue overflow-hidden">
                <CardBody className="pt-1 pb-1">
                  <Row>
                    <Col md="7" xs="6" sm="7" lg="6" className={actions.messageType === 'alert' ? 'p-0 text-danger' : 'p-0'}>
                      <img src={actions.messageType === 'alert' ? alertMessageRedIcon : alertMessageBlackIcon} className="mr-2" alt="alerts" height="13" width="13" />
                      <span className="font-weight-800">{actions.title}</span>
                    </Col>
                    <Col md="5" xs="6" sm="5" lg="6" className="text-right p-0">
                      <small>{actions.date}</small>
                      {'  '}
                      <small>{actions.time}</small>
                      {'  '}
                      <img src={index === 0 ? starBlackIcon : starGreyIcon} alt="alerts" className="mr-2" height="13" width="13" />
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12 pt-2 pb-2 ml-2">
                      <small className={actions.messageType === 'alert' ? 'text-danger' : ''}>{actions.message}</small>
                    </Col>
                  </Row>
                </CardBody>
                <div className={actions.messageType === 'alert' ? 'arrow-down-alert-activity' : 'arrow-down-normal'} />
              </Card>
            </Col>
          </Row>
        ))
        }
    </CardBody>
  </Card>
);
export default Alerts;
