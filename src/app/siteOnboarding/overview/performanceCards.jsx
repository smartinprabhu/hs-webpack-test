/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-underscore-dangle */
import React, { useState, useMemo } from 'react';
import {
  Col,
  Card,
  CardBody,
  Progress,
  Row,
} from 'reactstrap';
import Box from '@mui/system/Box';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import * as Icons1 from '@fortawesome/free-regular-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';
import moment from 'moment-timezone';
import { Tooltip } from 'antd';

import ModuleImages from '@shared/moduleImages';

import {
  getCompanyTimezoneDate,
  getDefaultNoValue,
  getListOfOperations,
} from '../../util/appUtils';
import { newpercalculate } from '../../util/staticFunctions';
import AssignOwner from './assignOwner';
import actionCodes from '../data/complianceActionCodes.json';

const iconList = Object.keys(Icons)
  .filter((key) => key !== 'fas' && key !== 'prefix')
  .map((icon) => Icons[icon]);

const iconList1 = Object.keys(Icons1)
  .filter((key) => key !== 'far' && key !== 'prefix')
  .map((icon) => Icons1[icon]);

library.add(...iconList);
library.add(...iconList1);

const PerformanceCards = ({
  detailData, status, setTaskModel, color,
}) => {
  const [statusData, setStatusData] = useState([]);
  const [assignModal, showAssignModal] = useState(false);
  const [currentModule, setCurrentModule] = useState(false);

  const { userInfo, userRoles } = useSelector((state) => state.user);

  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');
  const isAssignUser = allowedOperations.includes(actionCodes['Assign Owner']);

  useMemo(() => {
    if (detailData) {
      const statusDatas = detailData.filter((item) => item.state === status);
      setStatusData(status === 'All' ? detailData : statusDatas);
    }
  }, [detailData, status]);

  const getProgressColor = (percentage) => {
    let color = 'secondary';
    if (percentage >= 1 && percentage < 30) {
      color = 'danger';
    }
    if (percentage >= 30 && percentage < 50) {
      color = 'primary';
    }
    if (percentage >= 50 && percentage < 70) {
      color = 'warning';
    }
    if (percentage >= 70 && percentage < 90) {
      color = 'info';
    }
    if (percentage >= 90) {
      color = 'success';
    }
    return color;
  };

  const getStatusColor = (sta) => {
    let res = 'black';
    if (sta === 'In Progress') {
      res = '#ffa000';
    } else if (sta === 'Open') {
      res = '#6c757d';
    } else if (sta === 'Done') {
      res = '#70b652';
    }
    return res;
  };

  function getStatusCount(data, sta) {
    let res = 0;
    if (data && data.length) {
      const statusDatas = data.filter((item) => item.state === sta);
      res = statusDatas.length;
    }
    return res;
  }

  function getDueDays(endDate) {
    if (!endDate) return '';

    const now = moment().startOf('day'); // Current date at midnight
    const dueDate = moment.utc(endDate).local().startOf('day'); // Convert endDate to local and set to midnight

    if (!dueDate.isValid()) return ''; // Validate the endDate

    if (dueDate.isSameOrAfter(now, 'day')) {
      const days = dueDate.diff(now, 'days'); // Difference in days (date only)
      if (days === 0) {
        return <span className="font-tiny text-warning">(Due on Today)</span>;
      }
      return (
        <span className="font-tiny text-info">
          (Due in
          {' '}
          {days}
          {' '}
          {days > 1 ? 'days' : 'day'}
          )
        </span>
      );
    }
    const expiredDays = now.diff(dueDate, 'days'); // Difference in days when expired
    return (
      <span className="font-tiny text-danger">
        (
        {expiredDays}
        {' '}
        {expiredDays > 1 ? 'days' : 'day'}
        {' '}
        delay)
      </span>
    );
  }

  const onAssign = (data) => {
    setCurrentModule(data);
    showAssignModal(true);
  };

  return (
    <Box
      className="p-2"
    >
      <Row className="">
        {detailData && statusData && statusData.length > 0 && statusData.map((item, index) => (
          <Col md="4" sm="12" lg="4" xs="12" className="mb-2 pr-0 pb-1">
            <Card key={item.id} className="h-100">
              <CardBody className="p-3">
                <div className="display-flex content-center cursor-pointer" onClick={() => setTaskModel(item.id)}>
                  <Tooltip title={item.state} placement="top">
                    <div style={{
                      border: `1px solid ${status === 'All' ? getStatusColor(item.state) : color}`,
                      padding: '10px',
                      borderRadius: '50%',
                      backgroundColor: status === 'All' ? getStatusColor(item.state) : color,
                      display: 'inline-flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    >
                      <ModuleImages moduleName={item.module_id && item.module_id.name ? item.module_id.name : ''} />
                    </div>
                  </Tooltip>
                  <p className="font-family-tab mb-0 ml-2 font-weight-700">{getDefaultNoValue(item.name)}</p>
                </div>
                <Row className="content-center cursor-pointer" onClick={() => setTaskModel(item.id)}>
                  <Col md="6" sm="12" lg="6" xs="12" className="mb-2 mt-2">
                    <Progress
                      style={{ height: '0.7rem' }}
                      value={newpercalculate(item.onboarding_task_ids && item.onboarding_task_ids.length > 0 ? item.onboarding_task_ids.length : 0, item.onboarding_task_ids && item.onboarding_task_ids.length > 0 ? getStatusCount(item.onboarding_task_ids, 'Done') : 0)}
                      className="w-100"
                      color={getProgressColor(newpercalculate(item.onboarding_task_ids && item.onboarding_task_ids.length > 0 ? item.onboarding_task_ids.length : 0, item.onboarding_task_ids && item.onboarding_task_ids.length > 0 ? getStatusCount(item.onboarding_task_ids, 'Done') : 0))}
                    />

                    <span className="font-tiny font-family-tab ml-2">
                      {getStatusCount(item.onboarding_task_ids, 'Done')}
                      {' '}
                      /
                      {item.onboarding_task_ids && item.onboarding_task_ids.length > 0 ? item.onboarding_task_ids.length : 0}
                      {' '}
                      tasks
                    </span>
                  </Col>
                  <Col md="6" sm="12" lg="6" xs="12" className="mb-2 mt-2">
                    <span className="font-tiny font-family-tab mr-1">{getCompanyTimezoneDate(item.target_date_from, userInfo, 'date')}</span>
                    -
                    <span className="font-tiny font-family-tab ml-1">{getCompanyTimezoneDate(item.target_date_to, userInfo, 'date')}</span>
                    <p className="mb-0 font-family-tab">{item.state !== 'Done' ? getDueDays(item.target_date_to) : <span className="font-tiny text-success">{`Completed on ${getCompanyTimezoneDate(item.done_on, userInfo, 'date')}`}</span>}</p>
                  </Col>
                </Row>
                <Row className="content-center">
                  <Col md="6" sm="12" lg="6" xs="12" className="mt-2">
                    {item.responsible_person_id && item.responsible_person_id.name ? (
                      <Tooltip title="Owner" placement="top">

                        <FontAwesomeIcon
                          icon={Icons.faUser}
                          size="sm"
                        />
                        <span className="font-tiny font-family-tab ml-2">{item.responsible_person_id.name}</span>
                      </Tooltip>
                    ) : (
                      <>
                        {isAssignUser && (
                          <Tooltip title="Click here to add owner" placement="top">
                            <span className="cursor-pointer" onClick={() => onAssign(item)}>
                              <FontAwesomeIcon
                                icon={Icons.faPlus}
                                size="sm"
                              />
                              <span className="font-tiny font-family-tab ml-2">Add Owner</span>
                            </span>
                          </Tooltip>
                        )}
                      </>
                    )}
                  </Col>
                  <Col md="6" sm="12" lg="6" xs="12" className="mt-2">
                    <Tooltip title="Last Updated on" placement="top">
                      <FontAwesomeIcon
                        icon={Icons.faPencilAlt}
                        size="sm"
                      />
                      <span className="font-tiny font-family-tab ml-2">{getCompanyTimezoneDate(item.__last_update, userInfo, 'datetime')}</span>
                    </Tooltip>
                  </Col>
                </Row>
              </CardBody>
            </Card>
            {assignModal && (
            <AssignOwner
              assignModal
              moduleData={currentModule}
              atFinish={() => showAssignModal(false)}
              atCancel={() => showAssignModal(false)}
            />
            )}
          </Col>
        ))}
      </Row>
    </Box>
  );
};
export default PerformanceCards;
