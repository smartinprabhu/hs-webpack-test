/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
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
import * as PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';

import locationBlack from '@images/drawerLite/locationLite.svg';
import assetDefault from '@images/drawerLite/assetLite.svg';
import envelopeIcon from '@images/icons/envelope.svg';
import handPointerBlack from '@images/drawerLite/actionLite.svg';
import logsIcon from '@images/drawerLite/statusLite.svg';
import {
  getDefaultNoValue, extractIdObject,
  getAllowedCompanies,
} from '../../util/appUtils';
import {
  resetUpdateParts,
} from '../../workorders/workorderService';
import {
  getStatus,
} from '../surveyService';
import {
  getTypeLabel, getSurveyStateLabel,
} from '../utils/utils';

import Action from './actionItems/actionSurvey';

const appModels = require('../../util/appModels').default;

const WorkPermitDetailInfo = (props) => {
  const { detailData } = props;
  const dispatch = useDispatch();
  const defaultActionText = 'Survey Actions';
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [changeLocationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const changeLocationDropdownToggle = () => setLocationDropdownOpen(!changeLocationDropdownOpen);
  const [actionModal, showActionModal] = useState(false);
  const [actionId, setActionId] = useState('');
  const [actionValue, setActionValue] = useState('');

  const { surveyStatus } = useSelector((state) => state.survey);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);

  const viewData = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0] : false;

  useEffect(() => {
    if ((userInfo && userInfo.data)) {
      dispatch(getStatus(companies, appModels.SURVEYSTAGE));
    }
  }, [userInfo]);

  const switchStatus = (status, statusName) => {
    setActionId(status);
    setSelectedActions(statusName);
    setActionValue(statusName);
    showActionModal(true);
  };

  const cancelStateChange = () => {
    dispatch(resetUpdateParts());
  };

  const loading = detailData && detailData.loading;
  const stageId = viewData.stage_id ? extractIdObject(viewData.stage_id) : '';

  return (
    !loading && viewData && (
    <Row className="mt-3 globalModal-header-cards">
      <Col sm="12" md="3" lg="3" xs="12" className="p-0">
        <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
          <CardBody className="p-2">
            <Row className="m-0">
              <Col sm="12" md="9" lg="9" xs="12" className="">
                <p className="mb-0 font-weight-500 font-tiny">
                  TITLE
                </p>
                <p className="mb-0 font-weight-700">
                  {getDefaultNoValue(viewData.title)}
                </p>
              </Col>
              <Col sm="12" md="3" lg="3" xs="12" className="">
                <img src={envelopeIcon} alt="asset" width="30" className="mt-3" />
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
      <Col sm="12" md="3" lg="3" xs="12" className="p-0">
        <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
          <CardBody className="p-2">
            <Row className="m-0">
              <Col sm="12" md="9" lg="9" xs="12" className="">
                <p className="mb-0 font-weight-500 font-tiny">
                  CATEGORY TYPE
                </p>
                <p className="mb-0 font-weight-700">
                  {getTypeLabel(viewData.category_type)}
                </p>
              </Col>
              <Col sm="12" md="3" lg="3" xs="12" className="">
                <img src={viewData.category_type === 'e' ? assetDefault : locationBlack} alt="asset" width="20" className="mt-3" />
              </Col>
            </Row>
          </CardBody>
        </Card>
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
                  {getSurveyStateLabel(getDefaultNoValue(viewData.stage_id ? viewData.stage_id[1] : ''))}
                </p>
              </Col>
              <Col sm="12" md="3" lg="3" xs="12" className="">
                <img src={logsIcon} alt="asset" width="25" className="mt-3" />
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
                          {surveyStatus.data.map((st) => (
                            <DropdownItem
                              id="switchLocation"
                              key={st.id}
                              onClick={() => switchStatus(st.id, st.name)}
                              disabled={stageId === st.id}
                            >
                              {st.name}
                            </DropdownItem>
                          ))}
                        </>
                        ) }
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
        actionId={actionId}
        actionValue={actionValue}
        details={detailData}
        actionModal
      />
      )}
    </Row>
    )
  );
};

WorkPermitDetailInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]).isRequired,
};

export default WorkPermitDetailInfo;