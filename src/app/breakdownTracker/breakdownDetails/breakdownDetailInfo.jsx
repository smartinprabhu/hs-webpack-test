/* eslint-disable import/no-unresolved */
import {
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'antd';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ButtonDropdown, Card,
  CardBody,
  Col, DropdownItem, DropdownMenu, DropdownToggle, Row,
} from 'reactstrap';
import moment from 'moment-timezone';

import handPointerBlack from '@images/drawerLite/actionLite.svg';
import assetDefault from '@images/drawerLite/assetLite.svg';
import locationBlack from '@images/drawerLite/locationLite.svg';
import logsIcon from '@images/drawerLite/statusLite.svg';
import {
  extractIdObject, extractNameObject, getDefaultNoValue, getAllCompanies, getToday, truncate,
} from '../../util/appUtils';
import {
  resetUpdateParts,
  resetActionNoData,
} from '../../workorders/workorderService';
import {
  getStatus,
} from '../../survey/surveyService';

import Action from './actionItems/action';

const appModels = require('../../util/appModels').default;

const TrackerDetailInfo = ({
  offset,
}) => {
  const dispatch = useDispatch();
  const defaultActionText = 'Breakdown Actions';
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [changeLocationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const changeLocationDropdownToggle = () => setLocationDropdownOpen(!changeLocationDropdownOpen);
  const [actionModal, showActionModal] = useState(false);
  const [actionId, setActionId] = useState('');
  const [actionValue, setActionValue] = useState('');
  const { surveyStatus } = useSelector((state) => state.survey);
  const { trackerDetails } = useSelector((state) => state.breakdowntracker);

  const viewData = trackerDetails && (trackerDetails.data && trackerDetails.data.length > 0) ? trackerDetails.data[0] : false;
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);

  useEffect(() => {
    if ((userInfo && userInfo.data)) {
      dispatch(getStatus(companies, appModels.BREAKDOWNSTATE));
    }
  }, [userInfo]);

  const switchStatus = (status, statusName) => {
    setActionId(status);
    setSelectedActions(statusName);
    setActionValue(statusName);
    showActionModal(true);
  };

  const checkActionAllowed = (actionName) => {
    let allowed = false;
    const vrState = viewData && viewData.state_id ? extractNameObject(viewData.state_id, 'name') : '';

    const stateConditonOne = ['In Progress', 'On Hold'];
    const stateConditonTwo = ['Closed', 'On Hold'];
    const stateConditonThree = ['In Progress'];

    if (vrState === 'Open' && stateConditonOne.includes(actionName)) {
      allowed = true;
    }
    if (vrState === 'In Progress' && stateConditonTwo.includes(actionName)) {
      allowed = true;
    }
    if (vrState === 'On Hold' && stateConditonThree.includes(actionName)) {
      allowed = true;
    }
    return allowed;
  };

  const cancelStateChange = () => {
    dispatch(resetUpdateParts());
    dispatch(resetActionNoData());
  };

  const loading = trackerDetails && trackerDetails.loading;
  const stageId = viewData.stage_id ? extractIdObject(viewData.state_id) : '';
  const stateName = getDefaultNoValue(extractNameObject(viewData.state_id, 'name'));

  function getAge(dueDate, closeDate) {
    const d = moment.utc(dueDate).local().format();
    const dateFuture = new Date(d);

    const dateCurrent = closeDate && closeDate !== '' ? new Date(moment.utc(closeDate).local().format()) : new Date();

    const diffTime = Math.round(dateFuture - dateCurrent) / 1000;

    const totalSeconds = Math.abs(diffTime);

    const days = totalSeconds / 86400;
    const temp1 = totalSeconds % 86400;
    const hours = temp1 / 3600;
    const temp2 = temp1 % 3600;
    const minutes = temp2 / 60;

    if (Math.floor(days) > 0) {
      return `${Math.floor(days)}D ${Math.floor(hours)}H ${Math.floor(minutes)} Mins`;
    }
    if (Math.floor(hours) > 0) {
      return `${Math.floor(hours)}H ${Math.floor(minutes)} Mins`;
    }

    return `${Math.floor(minutes)} Mins`;
  }

  function removeDuplicateActions(data) {
    return [...new Map(data.map((item) => [item.name, item])).values()];
  }

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {!loading && viewData && (
        <Row className="mt-3 globalModal-header-cards">
          <Col sm="12" md="3" lg="3" xs="12" className="p-0">
            <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
              <CardBody className="p-2">
                <Row className="m-0">
                  <Col sm="12" md="12" lg="12" xs="12" className="">
                    <p className="mb-0 font-weight-500 font-tiny">
                      TITLE
                    </p>
                    <p className="mb-0 font-weight-700">
                      <Tooltip title={getDefaultNoValue(viewData.title)} placement="right">
                        {truncate(getDefaultNoValue(viewData.title), '70')}
                      </Tooltip>
                    </p>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col sm="12" md="3" lg="3" xs="12" className="p-0">
            {viewData.type && viewData.type === 'Space' && (
              <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
                <CardBody className="p-2">
                  <Row className="m-0">
                    <Col sm="12" md="9" lg="9" xs="12" className="">
                      <p className="mb-0 font-weight-500 font-tiny">
                        LOCATION
                      </p>
                      <p className="mb-0 font-weight-700">
                        {getDefaultNoValue(extractNameObject(viewData.space_id, 'path_name'))}
                      </p>
                    </Col>
                    <Col sm="12" md="3" lg="3" xs="12" className="">
                      <img src={locationBlack} alt="asset" width="30" height="30" className="mt-3" />
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            )}
            {viewData.type && viewData.type === 'Equipment' && (
              <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
                <CardBody className="p-2">
                  <Row className="m-0">
                    <Col sm="12" md="9" lg="9" xs="12" className="">
                      <p className="mb-0 font-weight-500 font-tiny">
                        ASSET
                      </p>
                      <p className="mb-0 font-weight-700">
                        {getDefaultNoValue(extractNameObject(viewData.equipment_id, 'name'))}
                      </p>
                    </Col>
                    <Col sm="12" md="3" lg="3" xs="12" className="">
                      <img src={assetDefault} alt="asset" width="30" height="30" className="mt-3" />
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            )}
          </Col>
          <Col sm="12" md="3" lg="3" xs="12" className="p-0">
            <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
              <CardBody className="p-2">
                <Row className="m-0">
                  <Col sm="12" md="9" lg="9" xs="12" className="">
                    <p className="mb-0 font-weight-500 font-tiny">
                      STATUS
                    </p>
                    <p className="mb-0 font-weight-700">
                      <div style={{
                        color: `${'#'}${getDefaultNoValue(extractNameObject(viewData.state_id, 'color_code')) !== '' ? `${getDefaultNoValue(extractNameObject(viewData.state_id, 'color_code'))} ` : '374152'}`,
                      }}
                      >
                        {getDefaultNoValue(extractNameObject(viewData.state_id, 'name'))}
                      </div>
                    </p>
                    <p className="mb-0 font-weight-700 text-danger">
                      Age -
                      {' '}
                      {`${getAge(viewData.incident_date, stateName === 'Closed' ? viewData.closed_on : '')}`}
                    </p>
                  </Col>
                  <Col sm="12" md="3" lg="3" xs="12" className="">
                    <img src={logsIcon} alt="asset" width="30" height="30" className="mt-3" />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col sm="12" md="3" lg="3" xs="12" className="p-0">
            <Card className="h-100 no-border-radius border-0">
              <CardBody className="p-2">
                <Row className="m-0">
                  <Col sm="12" md="9" lg="9" xs="12" className="">
                    <p className="mb-0 font-weight-500 font-tiny">
                      ACTIONS
                    </p>
                    <p className="mb-0 font-weight-700">
                      <div className="mr-2 mt-1">
                        <ButtonDropdown size="xs" isOpen={changeLocationDropdownOpen} toggle={changeLocationDropdownToggle} className="actionDropdown">
                          <DropdownToggle
                            caret
                            className="pb-05 pt-05 font-11 rounded-pill btn-navyblue text-left"
                          >
                            <span className="font-weight-700">
                              {selectedActions}
                              <FontAwesomeIcon size="sm" color="primary" className="float-right mt-1" height="20" width="20" icon={faChevronDown} />
                            </span>
                          </DropdownToggle>
                          <DropdownMenu>
                            {surveyStatus && surveyStatus.data && surveyStatus.data.length && surveyStatus.data.length > 0 && (
                              <>
                                {removeDuplicateActions(surveyStatus.data).map((st) => (
                                  checkActionAllowed(st.name) && (
                                    <DropdownItem
                                      id="switchLocation"
                                      key={st.id}
                                      onClick={() => switchStatus(st.id, st.name)}
                                      disabled={stageId === st.id}
                                    >
                                      {st.name === 'Closed' ? 'Close' : st.name}
                                    </DropdownItem>
                                  )
                                ))}
                              </>
                            )}
                          </DropdownMenu>
                        </ButtonDropdown>
                      </div>
                    </p>
                  </Col>
                  <Col sm="12" md="3" lg="3" xs="12" className="">
                    <img src={handPointerBlack} alt="asset" width="20" className="mt-3" />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          {actionModal && (
            <Action
              atFinish={() => {
                showActionModal(false); cancelStateChange(); setSelectedActions(defaultActionText);
              }}
              offset={offset}
              actionId={actionId}
              actionValue={actionValue}
              details={trackerDetails}
              actionModal
            />
          )}
        </Row>
      )}
    </>
  );
};

export default TrackerDetailInfo;
