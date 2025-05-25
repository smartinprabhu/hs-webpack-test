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
import DOMPurify from 'dompurify';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { useSelector, useDispatch } from 'react-redux';

import Loader from '@shared/loading';
import noData1 from '@images/icons/noData1.png';
import noData2 from '@images/icons/noData2.png';
import noData3 from '@images/icons/noData3.png';
import ErrorContent from '@shared/errorContent';
import buildingIcon from '@images/icons/buildingBlue.svg';
import { getAuditLogs } from '../equipmentService';
import { getCompanyTimezoneDate, generateErrorMessage } from '../../util/appUtils';
import './style.scss';

const appModels = require('../../util/appModels').default;

const logNotes = React.memo((props) => {
  const { ids } = props;
  const dispatch = useDispatch();
  const { auditLogs } = useSelector((state) => state.equipment);
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (ids) {
      dispatch(getAuditLogs(ids, appModels.MESSAGE));
    }
  }, [ids]);

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
            {events[i].new_value}
          </li>,
        );
      }
    }
    return liItems;
  }

  return (
    <Row>
      <Col sm="12" md="12" lg="12" xs="12" className="audits-list thin-scrollbar">
        <VerticalTimeline animate className="vertical-time-icons" layout="1-column">
          {React.createElement('div', {}, '')}
          {auditLogs && auditLogs.data && auditLogs.data.length > 0 && auditLogs.data.map((log) => (
            ((log.body) || getEventsLength(log.tracking_value_ids) > 0) && (
              <VerticalTimelineElement
                className="vertical-timeline-item"
                key={log.id}
                icon={(
                  <div className="timeline-icon border-info">
                    <img src={buildingIcon} alt="Building" className="w-auto height-20 log-img-center mt-2" />
                  </div>
                 )}
              >

                <h5 className="timeline-title mb-0 font-weight-700 font-medium">{log.author_id ? log.author_id[1] : ''}</h5>
                <p className="text-grayish-blue m-0 font-tiny">{getCompanyTimezoneDate(log.date, userInfo, 'datetime')}</p>
                <p className="m-0" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(log.body, { USE_PROFILES: { html: true } }) }} />
                <ul className="time-ul m-0">
                  {getEvents(log.tracking_value_ids ? log.tracking_value_ids : [])}
                </ul>
              </VerticalTimelineElement>
            )
          ))}
        </VerticalTimeline>
        {auditLogs && auditLogs.loading && (
          <div>
            <Loader />
          </div>
        )}
        {auditLogs && (auditLogs.data && auditLogs.data.length === 0) && !auditLogs.loading && (
          <div className="text-center p-3">
            <img src={noData1} alt="nodata1" className="nodata-image1" />
            <img src={noData2} alt="noData2" className="nodata-image2" />
            <img src={noData3} alt="No Data" className="nodata-image3" />
          </div>
        )}
        {(auditLogs && auditLogs.err) && (
          <ErrorContent errorTxt={generateErrorMessage(auditLogs)} />
        )}
      </Col>
    </Row>
  );
});

logNotes.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  ids: PropTypes.array.isRequired,
};

export default logNotes;
