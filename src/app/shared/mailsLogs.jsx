/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-danger */
import React, { useEffect } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { useSelector, useDispatch } from 'react-redux';
import DOMPurify from 'dompurify';

import Loader from '@shared/loading';
import noData1 from '@images/icons/noData1.png';
import noData2 from '@images/icons/noData2.png';
import noData3 from '@images/icons/noData3.png';
import ErrorContent from '@shared/errorContent';
import buildingIcon from '@images/icons/buildingBlue.svg';
import { getMailLogs } from '../workPermit/workPermitService';
import { getCompanyTimezoneDate, generateErrorMessage } from '../util/appUtils';
import '../assets/assetDetails/style.scss';

const appModels = require('../util/appModels').default;

const MailsLogs = React.memo((props) => {
  const { modelId, statusId } = props;
  const dispatch = useDispatch();
  const { mailLogs } = useSelector((state) => state.workpermit);
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (modelId && statusId) {
      dispatch(getMailLogs(modelId, statusId));
    }
  }, [modelId]);

  function getEventsLength(events) {
    let count = 0;
    for (let i = 0; i < events.length; i += 1) {
      if (events[i].old_value || events[i].new_value) {
        count += 1;
      }
    }
    return count;
  }

  function getEvents(events) {
    const liItems = [];
    for (let i = 0; i < events.length; i += 1) {
      if (events[i].old_value || events[i].new_value) {
        liItems.push(
          <li className="font-tiny" key={i}>
            {events[i].old_value && events[i].new_value ? `${events[i].changed_field} : ` : '' }
            {events[i].old_value ? events[i].old_value : events[i].changed_field}
            {(events[i].new_value && typeof events[i].new_value !== 'boolean') && (
            <FontAwesomeIcon size="sm" icon={faArrowRight} className="mt-0 mb-0 mr-1 ml-1" />
            )}
            {events[i].field_type === 'datetime' ? getCompanyTimezoneDate(events[i].new_value, userInfo, 'datetime') : events[i].new_value}
          </li>,
        );
      }
    }
    return liItems;
  }

  const apiUrl = window.localStorage.getItem('api-url');
  const replaceText = '/web';
  const imagePath = `${apiUrl}${replaceText}`;

  return (
    <Row className="bg-white viewTicket-auditLog p-2">
      <Col sm="12" md="12" lg="12" xs="12" className="">
        <VerticalTimeline animate className="vertical-time-icons" layout="1-column">
          {React.createElement('div', {}, '')}
          {mailLogs && mailLogs.data && mailLogs.data.length > 0 && mailLogs.data.map((log) => (
            (log.body) && (
              <VerticalTimelineElement
                className="vertical-timeline-item"
                key={log.id}
                icon={(
                  <div className="timeline-icon border-info">
                    <img src={buildingIcon} alt="Building" className="w-auto height-20 log-img-center mt-2" />
                  </div>
                 )}
              >
                <h5 className="timeline-title mb-0 font-weight-700 font-medium word-break-content">{log.subject}</h5>
                <p className="text-grayish-blue m-0 font-tiny word-break-content">{log.email_to}</p>
                <p className="text-grayish-blue m-0 font-tiny">{getCompanyTimezoneDate(log.date, userInfo, 'datetime')}</p>
                <p className="m-0" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize((log.body).replace('/web', imagePath), { USE_PROFILES: { html: true } }) }} />
              </VerticalTimelineElement>
            )
          ))}
        </VerticalTimeline>
        {mailLogs && mailLogs.loading && (
          <div>
            <Loader />
          </div>
        )}
        {mailLogs && (mailLogs.data && mailLogs.data.length === 0) && !mailLogs.loading && (
          <div className="text-center p-3">
            <img src={noData1} alt="nodata1" className="nodata-image1" />
            <img src={noData2} alt="noData2" className="nodata-image2" />
            <img src={noData3} alt="No Data" className="nodata-image3" />
          </div>
        )}
        {(mailLogs && mailLogs.err) && (
          <ErrorContent errorTxt={generateErrorMessage(mailLogs)} />
        )}
      </Col>
    </Row>
  );
});

MailsLogs.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  modelId: PropTypes.number.isRequired,
  statusId: PropTypes.number.isRequired,
};

export default MailsLogs;
