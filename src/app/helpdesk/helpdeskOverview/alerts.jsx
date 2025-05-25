/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Row,
} from 'reactstrap';

import alertIcon from '@images/icons/alerts.svg';
import alertMessageBlack from '@images/icons/alertMessageBlack.svg';
import alertMessageRed from '@images/icons/alertMessageRed.svg';
import starBlack from '@images/icons/starBlack.svg';
import starGrey from '@images/icons/starGrey.svg';
import './helpdeskOverview.scss';
import alerts from './data/alerts.json';

const Alerts = () => (
  <Card className="p-2 border-0 h-100">
    <CardTitle className="mb-0">
      <h6>
        <img src={alertIcon} className="mr-2" alt="alerts" width="20" height="20" />
        SLA ALERTS
      </h6>
    </CardTitle>
    <CardBody className="alarms-list p-0 ml-3 thin-scrollbar">
      {
        alerts && alerts.map((actions, index) => (
          <Row className="pb-2 m-0" key={actions.id}>
            <Col md="12" sm="12" xs="12" lg="12">
              <Card className={actions.messageType === 'alert' ? 'border-left-reddark bg-thinblue overflow-hidden' : 'border-left-dark bg-thinblue overflow-hidden'}>
                <CardBody className="pt-1 pb-1">
                  <Row>
                    <Col md="7" sm="7" xs="7" lg="7" className={actions.messageType === 'alert' ? 'p-0 text-torchred' : 'p-0'}>
                      <img src={actions.messageType === 'alert' ? alertMessageRed : alertMessageBlack} className="mr-2" alt="issuecategory" height="13" />
                      <span className="font-weight-800">{actions.title}</span>
                    </Col>
                    <Col md="5" sm="5" xs="5" lg="5" className="text-right p-0">
                      <small>{actions.date}</small>
                          &nbsp;
                      <small>{actions.time}</small>
                          &nbsp;
                      <img src={index === 0 ? starBlack : starGrey} alt="issuecategory" height="13" />
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12" sm="12" xs="12" lg="12" className="pt-2 pb-2 ml-2">
                      <small className={actions.messageType === 'alert' ? 'text-torchred' : ''}>{actions.message}</small>
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
