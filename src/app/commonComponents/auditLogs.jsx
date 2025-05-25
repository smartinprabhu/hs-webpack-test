/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-danger */
import React, { useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import DOMPurify from 'dompurify';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import buildingIcon from '@images/icons/buildingBlue.svg';
import { getAuditLogs } from '../assets/equipmentService';
import {
  getCompanyTimezoneDate,
  generateErrorMessage,
  getColumnArrayById,
} from '../util/appUtils';

const appModels = require('../util/appModels').default;

const AuditLog = React.memo((props) => {
  const { ids, isMiniFont } = props;
  const dispatch = useDispatch();
  const { auditLogs } = useSelector((state) => state.equipment);
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (ids) {
      if (ids && ids.length > 0 && ids[0].id) {
        const idd = getColumnArrayById(ids, 'id');
        dispatch(getAuditLogs(idd, appModels.MESSAGE));
      } else {
        dispatch(getAuditLogs(ids, appModels.MESSAGE));
      }
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

  function getLinkReplace(text) {
    const result = text.replace('<a ', "<a class='cursor-pointer'");
    return result;
  }

  function getEvents(events) {
    const liItems = [];
    for (let i = 0; i < events.length; i += 1) {
      if (events[i].old_value || events[i].new_value) {
        liItems.push(
          <li className="font-tiny" key={i}>
            {events[i].old_value && events[i].new_value
              ? `${events[i].changed_field} : `
              : ''}
            {events[i].old_value
              ? events[i].old_value
              : events[i].changed_field}
            {events[i].new_value
                            && typeof events[i].new_value !== 'boolean' && (
                            <FontAwesomeIcon
                              size="sm"
                              icon={faArrowRight}
                              className="mt-0 mb-0 mr-1 ml-1"
                            />
            )}
            {events[i].field_type === 'datetime'
              ? getCompanyTimezoneDate(
                events[i].new_value,
                userInfo,
                'datetime',
              )
              : events[i].new_value}
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
    <>
      {ids ? (
        <Timeline
          sx={{
            [`& .${timelineItemClasses.root}:before`]: {
              flex: 0,
              padding: 0,
            },
          }}
        >
          {auditLogs
                    && auditLogs.data
                    && auditLogs.data.length > 0
                    && auditLogs.data.map(
                      (log) => (log.body || getEventsLength(log.tracking_value_ids) > 0) && (
                      <TimelineItem className="mb-2">
                        <TimelineSeparator>
                          <img
                            src={buildingIcon}
                            alt="Building"
                            className="w-auto height-20 my-2"
                          />
                          <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent
                          sx={{
                            fontFamily: 'Suisse Intl',
                            fontSize: isMiniFont ? '0.7rem' : '1rem',
                          }}
                        >
                          <h5 className="timeline-title mb-0 font-weight-700 font-medium">
                            {log.author_id ? log.author_id[1] : ''}
                          </h5>
                          <p className="text-grayish-blue mt-1 font-tiny">
                            {getCompanyTimezoneDate(log.date, userInfo, 'datetime')}
                          </p>
                          <p
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(getLinkReplace(log.body.replace('/web', imagePath)), { USE_PROFILES: { html: true } }),
                            }}
                          />
                          <ul className="time-ul">
                            {getEvents(
                              log.tracking_value_ids ? log.tracking_value_ids : [],
                            )}
                          </ul>
                        </TimelineContent>
                      </TimelineItem>
                      ),
                    )}
          {auditLogs && auditLogs.loading && (
          <div>
            <Loader />
          </div>
          )}
          {((auditLogs && auditLogs.err) || (auditLogs
                    && auditLogs.data
                    && auditLogs.data.length === 0
                    && !auditLogs.loading)) && (
                    <ErrorContent errorTxt={generateErrorMessage(auditLogs)} />
          )}
        </Timeline>
      ) : (
        <ErrorContent errorTxt="No Data Found" />
      )}
    </>
  );
});

AuditLog.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  ids: PropTypes.array.isRequired,
};

export default AuditLog;
