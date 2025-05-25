/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-danger */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircle,
  faFile,
} from '@fortawesome/free-solid-svg-icons';
import covidAlert from '@images/icons/alert.svg';
import infoGreen from '@images/icons/infoGreen.svg';
import checkout from '@images/icons/checkout.svg';
import { getAnnouncementById, markAsReadAnnouncements } from './headerService';

import {
  getLocalDateCustom, getLocalTimeOnly,
  generateErrorMessage,
} from '../../util/appUtils';

const Announcements = () => {
  const dispatch = useDispatch();
  const [announcementById, setAnnouncementById] = useState({});
  const [announcementsInfo, setMarkAsAllRead] = useState({});
  const getIcon = (priority) => {
    let icon = faFile;
    if (priority === 'warning') {
      icon = checkout;
    } else if (priority === 'info') {
      icon = infoGreen;
    } else if (priority === 'alert') {
      icon = covidAlert;
    }
    return icon;
  };

  useEffect(() => {
    if (announcementById && Object.keys(announcementById).length > 0) {
      dispatch(getAnnouncementById(announcementById));
    }
  }, [announcementById]);

  useEffect(() => {
    if (announcementsInfo && announcementsInfo.length > 0) {
      dispatch(markAsReadAnnouncements(announcementsInfo));
    }
  }, [announcementsInfo]);

  const { announcementInfo } = useSelector((state) => state.header);

  return (
    <>
      <Row className="notification-header thin-scrollbar">
        <Col md="12" lg="12" sm="12" xs="12">
          {announcementInfo && announcementInfo.data
            ? (
              <Row>
                <Col md="12" lg="6" sm="12" xs="12">
                  <span className="float-left ml-1 tab_announcement_menu">
                    Latest
                  </span>
                </Col>
                <Col md="12" lg="6" sm="12" xs="12">
                  <span aria-hidden="true" className="float-right mr-1 tab_announcement_menu cursor-pointer" onClick={() => { setMarkAsAllRead(announcementInfo.data); }}>
                    Mark all as read
                  </span>
                </Col>
              </Row>
            )
            : ''}
          {announcementInfo.data && announcementInfo.data.map((actions) => (
            <Row className="pt-3" key={actions.id}>
              <Col md="12" xs="12" sm="12" lg="12">
                <Card className="overflow-hidden cursor-pointer" onClick={() => { setAnnouncementById(actions); }}>
                  <CardBody className="pt-1 pb-1">
                    <Row>
                      <Col md="11" xs="12" sm="7" lg="11" className="p-0">
                        <img src={getIcon(actions.priority)} alt="notification" className="mr-2" height="14" />
                        {actions.name.length > 55
                          ? (
                            <span className="font-weight-800">
                              {actions.name.substring(0, 55)}
                              ...
                            </span>
                          )
                          : <span className="font-weight-800">{actions.name}</span>}
                      </Col>
                      {actions.viewed_on === ''
                        ? (
                          <Col md="1" xs="12" sm="1" lg="1" className="text-right p-0">
                            <FontAwesomeIcon className="mr-2 text-orange" size="sm" icon={faCircle} />
                          </Col>
                        )
                        : ''}
                    </Row>
                    <Row>
                      <Col md="12" xs="12" sm="12" lg="12" className="ml-2">
                        {actions.publisher.length > 60
                          ? (
                            <small className="text-blue">
                              {actions.publisher.substring(0, 60)}
                              ...
                            </small>
                          )
                          : <small className="text-blue">{actions.publisher}</small>}
                        {' '}
                        <small>on</small>
                        {' '}
                        <small>{getLocalDateCustom(actions.commences_on, 'DD MMM YYYY')}</small>
                        {' '}
                        <small>{getLocalTimeOnly(actions.commences_on)}</small>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12" xs="12" sm="12" lg="12" className="pt-1 pb-1 ml-2">
                        {actions.description.length > 120
                          ? <span className="content font-weight-400" dangerouslySetInnerHTML={{ __html: actions.description.substring(0, 120) }} />
                          : <span className="content font-weight-400" dangerouslySetInnerHTML={{ __html: actions.description }} />}
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          ))}
          {announcementInfo && announcementInfo.loading && (
            <Loader />
          )}
          {announcementInfo && announcementInfo.err && (
          <ErrorContent errorTxt={generateErrorMessage(announcementInfo)} />
          )}
        </Col>
      </Row>
    </>
  );
};

export default Announcements;
