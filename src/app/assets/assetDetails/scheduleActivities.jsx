/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-danger */
import React, { useEffect } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
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
import { getMailActivityLogs } from '../equipmentService';
import { getCompanyTimezoneDate, generateErrorMessage } from '../../util/appUtils';
import './style.scss';

const appModels = require('../../util/appModels').default;

const scheduleActivities = React.memo((props) => {
  const { resModalName, resId } = props;
  const dispatch = useDispatch();
  const { mailActivityLogs } = useSelector((state) => state.equipment);
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (resModalName && resId) {
      dispatch(getMailActivityLogs(resModalName, resId, appModels.MAILACTIVITY));
    }
  }, [resModalName, resId]);

  return (
    <Row>
      <Col sm="12" md="12" lg="12" xs="12" className="audits-list thin-scrollbar">
        <VerticalTimeline animate className="vertical-time-icons" layout="1-column">
          {React.createElement('div', {}, '')}
          {mailActivityLogs && mailActivityLogs.data && mailActivityLogs.data.length > 0 && mailActivityLogs.data.map((log) => (
            log.note && (
              <VerticalTimelineElement
                className="vertical-timeline-item"
                key={log.id}
                icon={(
                  <div className="timeline-icon border-info">
                    <img src={buildingIcon} alt="Building" className="w-auto height-20 log-img-center mt-2" />
                  </div>
                 )}
              >

                <h5 className="timeline-title mb-0 font-weight-700 font-medium">{log.summary}</h5>
                <p className="text-grayish-blue m-0 font-tiny">{getCompanyTimezoneDate(log.date_deadline, userInfo, 'date')}</p>
                <p className="m-0" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(log.note, { USE_PROFILES: { html: true } }) }} />
              </VerticalTimelineElement>
            )
          ))}
        </VerticalTimeline>
        {mailActivityLogs && mailActivityLogs.loading && (
          <div>
            <Loader />
          </div>
        )}
        {mailActivityLogs && (mailActivityLogs.data && mailActivityLogs.data.length === 0 && !mailActivityLogs.err) && !mailActivityLogs.loading && (
          <div className="text-center p-3">
            <img src={noData1} alt="nodata1" className="nodata-image1" />
            <img src={noData2} alt="noData2" className="nodata-image2" />
            <img src={noData3} alt="No Data" className="nodata-image3" />
          </div>
        )}
        {(mailActivityLogs && mailActivityLogs.err) && (
          <ErrorContent errorTxt={generateErrorMessage(mailActivityLogs)} />
        )}
      </Col>
    </Row>
  );
});

scheduleActivities.propTypes = {
  resModalName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  resId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]).isRequired,
};

export default scheduleActivities;
