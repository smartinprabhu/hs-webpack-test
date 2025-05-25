/* eslint-disable no-nested-ternary */
import React, { useState, useMemo } from 'react';
import Box from '@mui/system/Box';
import {
  Card,
  Col,
  CardBody,
  Row,
} from 'reactstrap';
import { useHistory } from 'react-router-dom';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import * as Icons1 from '@fortawesome/free-regular-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment-timezone';
import { Tooltip } from 'antd';
import Drawer from '@mui/material/Drawer';

import ModuleImages from '@shared/moduleImages';

import DrawerHeader from '../../commonComponents/drawerHeader';
import {
  setCurrentTab,
} from '../../inventory/inventoryService';
import {
  getCompanyTimezoneDate,
  getDefaultNoValue,
  getListOfOperations,
} from '../../util/appUtils';
import { AddThemeColor } from '../../themes/theme';
import AuditLog from '../../commonComponents/auditLogs';
import CompleteTask from './completeTask';
import AssignOwner from './assignOwner';
import actionCodes from '../data/complianceActionCodes.json';
import TaskDetail from './taskDetail';
import customData from '../data/customData.json';

import AddHelpdeskSettings from '../siteDetails/helpdesk/addHelpdeskSettings';
import EscalationLevel from '../siteDetails/helpdesk/escalationLevel';
import ProblemCategory from '../siteDetails/helpdesk/problemCategory';
import ProblemCategoryGroup from '../siteDetails/helpdesk/problemCategoryGroup';
import AddInspectionSettings from '../siteDetails/inspectionSchedule/addInspectionSettings';
import PPMSetting from '../siteDetails/preventiveMaintenance/ppmSetting';
import { getHelpdeskSettingDetails, getInspectionSettingDetails, getPPMSettingsDetails, getParentSiteGroups } from '../siteService';

const appModels = require('../../util/appModels').default;

const iconList = Object.keys(Icons)
  .filter((key) => key !== 'fas' && key !== 'prefix')
  .map((icon) => Icons[icon]);

const iconList1 = Object.keys(Icons1)
  .filter((key) => key !== 'far' && key !== 'prefix')
  .map((icon) => Icons1[icon]);

library.add(...iconList);
library.add(...iconList1);

const ModelsScroll = ({ setTaskModel, detailData, taskModel }) => {
  const [modelList, setModelList] = useState([]);
  const [taskList, setTasksList] = useState({});
  const [currentModel, setCurrentModel] = useState(false);
  const [actionModal, showActionModal] = useState(false);
  const [viewModal, showViewModsl] = useState(false);
  const [assignModal, showAssignModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(false);

  const [actionId, setActionId] = useState(false);
  const [actionName, setActionName] = useState(false);
  const [actionDrawer, setActionDrawer] = useState(false);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const history = useHistory();
  const dispatch = useDispatch();

  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');
  const isAssignUser = allowedOperations.includes(actionCodes['Assign Owner']);

  useMemo(() => {
    if (detailData && detailData.length) {
      setModelList(detailData);
      if (currentTask && currentTask.id) {
        const moduleData = detailData.filter((item) => item.id === currentModel);
        const reData = moduleData && moduleData.length && moduleData[0].onboarding_task_ids ? moduleData[0].onboarding_task_ids.filter((item) => item.id === currentTask.id) : false;
        if (reData && reData.length) {
          setCurrentTask(reData[0]);
        }
      }
      if (currentModel) {
        const taskData = detailData.filter((item) => item.id === currentModel);
        setTasksList(taskData);
      }
    }
  }, [detailData]);

  useMemo(() => {
    if (taskModel) {
      setCurrentModel(taskModel);
    }
  }, [taskModel]);

  const addDays = (days) => {
    const result = new Date();
    result.setDate(result.getDate() + days);
    return result;
  };

  const onOpenComplete = (data) => {
    setCurrentTask(data);
    showActionModal(true);
  };

  const onOpenTask = (data) => {
    setCurrentTask(data);
    showViewModsl(true);
  };

  const onCloseTask = () => {
    setCurrentTask(false);
    showViewModsl(false);
  };

  const isParent = userInfo && userInfo.data && userInfo.data.is_parent;
  const siteId = userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.id;

  const onOpenAction = (act, taskId, moduleInfo, name) => {
    if (customData.taskNavigationsList[act]) {
      dispatch(getParentSiteGroups(siteId, appModels.COMPANY));
      const navObj = customData.taskNavigationsList[act];
      if (navObj.is_link && navObj.is_link === 'Yes') {
        setActionId(false);
        setActionName(false);
        setActionDrawer(false);
        history.push(window.location.pathname);
        if (navObj.tab_name) {
          dispatch(setCurrentTab(navObj.tab_name));
        }
        history.push({ pathname: navObj.navigation_path, state: { taskId, moduleId: moduleInfo.id } });
      } else if (navObj.is_link && navObj.is_drawer === 'Yes') {
        if (navObj.parent_only === 'Yes' && isParent) {
          setActionId(act);
          setActionName(name);
          setActionDrawer(true);
        } else if (navObj.parent_only === 'No') {
          setActionId(act);
          setActionName(name);
          setActionDrawer(true);
          if (act === 'manage_helpdesk_main_settings') {
            dispatch(getHelpdeskSettingDetails(siteId, appModels.MAINTENANCECONFIG));
          }
          if (act === 'manage_inspection_common_settings') {
            dispatch(getInspectionSettingDetails(siteId, appModels.INSPECTIONCONFIG));
          }
          if (act === 'manage_ppm_main_settings') {
            dispatch(getPPMSettingsDetails(userInfo.data.company.id, appModels.PPMWEEKCONFIG));
          }
        }
      }
    } else {
      setActionId(false);
      setActionName(false);
      setActionDrawer(false);
    }
  };

  const closeActionDrawer = () => {
    setActionId(false);
    setActionName(false);
    setActionDrawer(false);
  };

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

  useMemo(() => {
    if (currentModel) {
      const taskData = detailData.filter((item) => item.id === currentModel);
      setTasksList(taskData);
    }
  }, [currentModel]);

  function getStatusCount(data, sta) {
    let res = 0;
    if (data && data.length) {
      const statusDatas = data.filter((item) => item.state === sta);
      res = statusDatas.length;
    }
    return res;
  }

  const userId = userInfo && userInfo.data && userInfo.data.id;

  return (
    <Box
      className="p-0"
      sx={{ display: 'flex', alignItems: 'center', gap: '0%' }}
    >
      <Box
        className="p-2"
        sx={{ width: '20%' }}
      >
        <Card
          style={{
            height: '100vh',
            position: 'sticky',
            top: 0,
            overflowY: 'auto',
          }}
          className="thin-scrollbar"
        >

          <CardBody className="p-0">
            {modelList.map((item, index) => (
              <div
                aria-hidden
                className="p-0 cursor-pointer"
                onClick={() => setCurrentModel(item.id)}
                style={item.id === currentModel ? { backgroundColor: AddThemeColor({}).color, color: 'white' } : {}}
              >
                <div className="display-flex content-center p-2">
                  <div style={{
                    border: item.state === 'Done' ? '1px solid #70b652' : item.state === 'Open' ? '1px solid #6c757d' : '1px solid #ffa000',
                    padding: '7px',
                    borderRadius: '50%',
                    backgroundColor: item.state === 'Done' ? '#70b652' : item.state === 'Open' ? '#6c757d' : '#ffa000',
                    display: 'inline-flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  >
                    <ModuleImages moduleName={item.module_id && item.module_id.name ? item.module_id.name : ''} />
                  </div>
                  <p className="font-family-tab mb-0 ml-2 font-weight-700">{getDefaultNoValue(item.name)}</p>
                </div>
                <p className="font-tiny font-family-tab ml-4 pl-3 mb-2">
                  {getStatusCount(item.onboarding_task_ids, 'Done')}
                  {' '}
                  of
                  {' '}
                  {item.onboarding_task_ids && item.onboarding_task_ids.length > 0 ? item.onboarding_task_ids.length : 0}
                  {' '}
                  tasks Completed
                </p>
                <hr className="m-0 p-0" />
              </div>
            ))}
          </CardBody>
        </Card>

      </Box>
      <Box
        className="p-2"
        sx={{ width: '50%' }}
      >
        {taskList && taskList.length > 0 && (
          <>
            <Card
              style={{
                height: '100vh',
                position: 'sticky',
                top: 0,
                overflowY: 'auto',
                overflowX: 'hidden',
              }}
              className="thin-scrollbar p-0"
            >
              <div className="p-3">
                <h5 className="font-family-tab">
                  <Tooltip title="Back to Overview" placement="top">
                    <span className="cursor-pointer mr-2" onClick={() => setTaskModel(false)}>
                      <FontAwesomeIcon
                        icon={Icons.faArrowLeft}
                        size="sm"
                      />
                    </span>
                  </Tooltip>
                  {getDefaultNoValue(taskList[0].name)}

                  <span className="float-right">

                    {!(taskList[0].responsible_person_id && taskList[0].responsible_person_id.name) && isAssignUser && (
                      <Tooltip title="Add Owner" placement="top">
                        <span className="cursor-pointer" onClick={() => showAssignModal(true)}>
                          <FontAwesomeIcon
                            icon={Icons.faUser}
                            size="sm"
                          />
                        </span>
                      </Tooltip>
                    )}
                  </span>

                </h5>
                <p className="font-family-tab font-tiny mb-0">{getDefaultNoValue(taskList[0].description)}</p>
                {(taskList[0].responsible_person_id && taskList[0].responsible_person_id.name) && (
                <p className="font-family-tab font-tiny mt-2">{getDefaultNoValue(taskList[0].responsible_person_id.name)}</p>
                )}
                <p className="font-family-tab font-weight-800 mt-3 mb-0">Tasks</p>
              </div>

              <CardBody className="p-0">
                <hr className="m-0 p-0" />
                {taskList[0].onboarding_task_ids && taskList[0].onboarding_task_ids.map((item, index) => (
                  <div
                    aria-hidden
                    className="p-0"
                  >
                    <Row className="content-center p-3">
                      <Col md="9" sm="12" lg="9" xs="12" className="mb-0">
                        <div className="display-flex content-center">
                          <Tooltip title={item.state} placement="top">
                            <div
                              style={{
                                border: item.state === 'Done' ? '1px solid #70b652' : item.state === 'Open' ? '1px solid #1092dc' : '1px solid #ffa000',
                                padding: '10px',
                                borderRadius: '50%',
                                backgroundColor: item.state === 'Done' ? '#70b652' : item.state === 'Open' ? '#1092dc' : '#ffa000',
                                display: 'inline-flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                              aria-hidden
                              className="cursor-pointer"
                              onClick={() => onOpenTask(item)}
                            >

                              <FontAwesomeIcon
                                icon={item.state === 'Done' ? Icons.faCheckCircle : item.state === 'Open' ? Icons.faTasks : Icons.faHourglass}
                                size="md"
                                style={{ color: 'white', borderRadius: '50%' }}
                              />

                            </div>
                          </Tooltip>
                          <p
                            aria-hidden
                            className="font-family-tab mb-0 ml-2 font-weight-700 cursor-pointer"
                            onClick={() => onOpenTask(item)}
                          >
                            {getDefaultNoValue(item.name)}
                          </p>
                          {item.action && item.action_button_name && (
                            <span
                              aria-hidden
                              onClick={() => onOpenAction(item.action, item.id, taskList[0], item.name)}
                              className="font-family-tab text-info ml-2 cursor-pointer font-tiny"
                            >
                              {item.action_button_name}
                              <FontAwesomeIcon
                                icon={Icons.faExternalLink}
                                size="xs"
                                className="ml-1 cursor-pointer"
                              />
                            </span>
                          )}
                        </div>
                        <p className="font-tiny font-family-tab ml-4 pl-3 mb-0 cursor-pointer" aria-hidden onClick={() => onOpenTask(item)}>
                          {getDefaultNoValue(item.type)}
                        </p>
                        <p className="font-tiny font-family-tab ml-4 pl-3 mb-0 cursor-pointer" aria-hidden onClick={() => onOpenTask(item)}>
                          {getDefaultNoValue(item.description)}
                        </p>
                      </Col>
                      <Col md="3" sm="12" lg="3" xs="12" className="mb-0">
                        <p className="font-family-tab font-tiny mb-0">{item.state === 'Done' ? `Completed on ${getCompanyTimezoneDate(item.done_on, userInfo, 'date')}` : `Due on ${getCompanyTimezoneDate(addDays(item.days_required), userInfo, 'date')}`}</p>
                        <p className="font-family-tab font-tiny mb-0">{item.state !== 'Done' ? getDueDays(addDays(item.days_required)) : ''}</p>
                        {item.state !== 'Done' && (taskList[0].responsible_person_id && taskList[0].responsible_person_id.user_id && taskList[0].responsible_person_id.user_id.id && taskList[0].responsible_person_id.user_id.id === userId) && (
                        <div className="text-right mt-2 mr-3">
                          <Tooltip title="Complete the task" placement="top">
                            <FontAwesomeIcon
                              icon={Icons.faCheckCircle}
                              size="lg"
                              className="cursor-pointer"
                              onClick={() => onOpenComplete(item)}
                            />
                          </Tooltip>
                        </div>
                        )}
                      </Col>
                    </Row>
                    <hr className="m-0 p-0" />
                  </div>
                ))}
              </CardBody>
            </Card>
            {actionModal && (
            <CompleteTask
              actionModal
              moduleData={taskList[0]}
              detailData={currentTask}
              atFinish={() => showActionModal(false)}
              atCancel={() => showActionModal(false)}
            />
            )}
            <Drawer
              PaperProps={{
                sx: { width: '90%' },
              }}
              anchor="right"
              open={viewModal}
              ModalProps={{
                disableEnforceFocus: true,
              }}
            >
              <DrawerHeader
                headerName={currentTask && currentTask.name ? currentTask.name : 'Task'}
                imagePath={false}
                isEditable={false}
                onClose={() => onCloseTask()}

              />
              <TaskDetail detailedData={currentTask} moduleData={taskList && taskList.length > 0 ? taskList[0] : false} />

            </Drawer>
            {assignModal && (
            <AssignOwner
              assignModal
              moduleData={taskList[0]}
              atFinish={() => showAssignModal(false)}
              atCancel={() => showAssignModal(false)}
            />
            )}
            <Drawer
              PaperProps={{
                sx: { width: '85%' },
              }}
              ModalProps={{
                disableEnforceFocus: true,
              }}
              anchor="right"
              open={actionDrawer}
            >
              <DrawerHeader
                headerName={actionName}
                imagePath=""
                onClose={closeActionDrawer}
              />
              {actionId === 'manage_helpdesk_problem_category' && (
              <ProblemCategory />
              )}
              {actionId === 'manage_helpdesk_problem_category_group' && (
              <ProblemCategoryGroup />
              )}
              {actionId === '' && (
              <EscalationLevel />
              )}
              {actionId === 'manage_helpdesk_main_settings' && (
              <AddHelpdeskSettings editId={siteId} closeModal={closeActionDrawer} />
              )}
              {actionId === 'manage_helpdesk_escalation_level' && (
              <EscalationLevel />
              )}
              {actionId === 'manage_inspection_common_settings' && (
              <AddInspectionSettings editId={siteId} closeModal={closeActionDrawer} />
              )}
              {actionId === 'manage_ppm_main_settings' && (
              <PPMSetting editId={siteId} closeModal={closeActionDrawer} />
              )}
            </Drawer>
          </>
        )}
      </Box>
      <Box
        className="p-2"
        sx={{ width: '30%' }}
      >

        <Card
          style={{
            height: '100vh',
            position: 'sticky',
            top: 0,
            overflowY: 'auto',
          }}
          className="thin-scrollbar p-0"
        >
          <p className="font-family-tab font-weight-800 m-3">Activity</p>
          {taskList && taskList.length > 0 && (
          <AuditLog ids={taskList[0].message_ids} isMiniFont />
          )}
        </Card>
      </Box>
    </Box>
  );
};
export default ModelsScroll;
