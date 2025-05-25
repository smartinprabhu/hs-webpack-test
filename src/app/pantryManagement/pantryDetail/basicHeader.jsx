/* eslint-disable new-cap */
/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';

import archieveBlue from '@images/icons/archieveBlue.png';
import ticketIcon from '@images/icons/ticketBlue.svg';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import {
  generateErrorMessage, truncate, extractNameObject,
} from '../../util/appUtils';
import {
  resetUpdateParts,
} from '../../workorders/workorderService';
import customData from '../data/customData.json';
import ActionPantry from './actionItems/actionPantry';

const BasicHeader = () => {
  const dispatch = useDispatch();
  const [changeLocationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const changeLocationDropdownToggle = () => setLocationDropdownOpen(!changeLocationDropdownOpen);

  const [actionModal, showActionModal] = useState(false);
  const [actionValue, setActionValue] = useState('');
  const [actionHead, setActionHead] = useState('');
  const [actionMethod, setActionMethod] = useState('');

  const { userInfo } = useSelector((state) => state.user);
  const { pantryDetails } = useSelector((state) => state.pantry);

  const isUserError = userInfo && userInfo.err;
  const isUserLoading = userInfo && userInfo.loading;
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (pantryDetails && pantryDetails.err) ? generateErrorMessage(pantryDetails) : userErrorMsg;

  const switchStatus = (statusName, head, method) => {
    setActionValue(statusName);
    setActionHead(head);
    setActionMethod(method);
    // showActionModal(true);
  };

  const cancelStateChange = () => {
    dispatch(resetUpdateParts());
  };

  const stage = pantryDetails && pantryDetails.data && pantryDetails.data.length && pantryDetails.data.length > 0 ? pantryDetails.data[0].state : '';

  return (
    <>
      <Card className="border-0 h-100">
        {pantryDetails && (pantryDetails.data && pantryDetails.data.length > 0) && (
        <CardBody data-testid="success-case" className="pb-1 pt-1 pl-2 pr-2">
          <Row>
            <Col sm="12" md="5" lg="5" xs="12" className="card-mb-3">
              <h4 className="mb-0 ml-1">
                <img src={ticketIcon} alt="ticket" width="15" height="15" className="w-auto ml-2 mr-2" />
                {pantryDetails && (pantryDetails.data && pantryDetails.data.length > 0) ? truncate(pantryDetails.data[0].name, 30) : ''}
              </h4>
              <div className="ml-4 pl-2">
                <img src={archieveBlue} alt="space" className="mr-1 pb-2px" width="15" height="13" />
                <span
                  className="mr-2 font-weight-500 font-tiny"
                >
                  {pantryDetails && (pantryDetails.data && pantryDetails.data.length > 0) ? extractNameObject(pantryDetails.data[0].employee_id, 'name') : ''}
                </span>
              </div>
            </Col>
            <Col sm="12" md="7" lg="7" xs="12">
              <span className="float-right">
                <ButtonDropdown size="xs" isOpen={changeLocationDropdownOpen} toggle={changeLocationDropdownToggle} className="mr-1 actionDropdown">
                  <DropdownToggle caret className="pb-05 pt-05 font-11 border-primary bg-white text-primary pr-1 mb-1 mr-2 mt-2">
                    <span className="font-weight-700">
                      {stage}
                      <FontAwesomeIcon size="sm" color="primary" className="float-right ml-2 mt-1" height="20" width="20" icon={faChevronDown} />
                    </span>
                  </DropdownToggle>
                  <DropdownMenu className="headerdropdown-list thin-scrollbar">
                    {customData && customData.pantryStates && (
                      <>
                        {customData.pantryStates.map((st) => (
                          st.label !== 'Draft' && (
                          <DropdownItem
                            id="switchLocation"
                            key={st.id}
                            onClick={() => switchStatus(st.label, st.heading, st.methodName)}
                            disabled
                          >
                            {st.label}
                          </DropdownItem>
                          )))}
                      </>
                    ) }
                  </DropdownMenu>
                </ButtonDropdown>
              </span>
            </Col>
          </Row>
        </CardBody>
        )}
        {actionModal && (
        <ActionPantry
          atFinish={() => {
            showActionModal(false); cancelStateChange();
          }}
          actionValue={actionValue}
          actionHead={actionHead}
          actionMethod={actionMethod}
          details={pantryDetails}
          actionModal
        />
        )}
        {((pantryDetails && pantryDetails.loading) || (isUserLoading)) && (
        <CardBody className="mt-4" data-testid="loading-case">
          <Loader />
        </CardBody>
        )}
        {((pantryDetails && pantryDetails.err) || (isUserError)) && (
        <CardBody>
          <ErrorContent errorTxt={errorMsg} />
        </CardBody>
        )}
      </Card>
    </>
  );
};

export default BasicHeader;
