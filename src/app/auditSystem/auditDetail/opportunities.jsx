/* eslint-disable no-loop-func */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Col,
  Row,
  Table,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  Radio,
} from 'antd';
import { Drawer, Tooltip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye, faEdit, faCog, faChevronDown,
  faTimesCircle, faCheckCircle, faEnvelope, faTimes,
} from '@fortawesome/free-solid-svg-icons';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import ticketIcon from '@images/icons/ticketBlue.svg';
import DrawerHeader from '../../commonComponents/drawerHeader';

import { getAuditActions, resetAuditUpdateAction, resetAuditAction } from '../auditService';
import {
  getDefaultNoValue, getCompanyTimezoneDate,
  extractNameObject, generateErrorMessage,
} from '../../util/appUtils';
import { getStateLabel, getResponseTypeLabel } from '../utils/utils';
import {
  getTicketDetail,
} from '../../helpdesk/ticketService';
import TicketDetail from '../../helpdesk/ticketDetails/ticketDetails';
import customData from '../data/customData.json';
import Action from './actionNcItems/actions';
import UpdateAction from './forms/updateAction';
import UpdateTicketAction from './forms/updateTicketAction';

const appModels = require('../../util/appModels').default;

const faIcons = {
  START: faCheckCircle,
  CANCEL: faTimesCircle,
  CLOSE: faTimesCircle,
  CREATE: faEdit,
};

const Opportunities = (props) => {
  const {
    detailData,
    setDetailModal,
  } = props;

  const dispatch = useDispatch();

  const [viewId, setViewId] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [type, setType] = useState('all');

  const defaultActionText = 'Actions';
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const [enterAction, setEnterAction] = useState(false);

  const [actionText, setActionText] = useState('');
  const [actionButton, setActionButton] = useState('');
  const [actionModal, showActionModal] = useState(false);
  const [actionValue, setActionValue] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [selectedId, setSelectedId] = useState(false);
  const [selectedData, setSelectedData] = useState({});

  const [editId, setEditId] = useState(false);
  const [editModal, showEditModal] = useState(false);

  const [editModal1, showEditModal1] = useState(false);

  const { userInfo } = useSelector((state) => state.user);

  const {
    ticketDetail,
  } = useSelector((state) => state.ticket);

  const { auditActionDetails, updateAuditAction, auditAction } = useSelector((state) => state.audit);

  const actionsData = auditActionDetails && auditActionDetails.data && auditActionDetails.data.length > 0 ? auditActionDetails.data : [];

  const showEditView1 = (id, data) => {
    setSelectedData(data);
    setEditId(id);
    dispatch(resetAuditAction());
    showEditModal1(true);
  };

  useEffect(() => {
    if (customData && customData.actionNCTypes && customData.actionNCTypes[selectedActions]) {
      setActionText(customData.actionNCTypes[selectedActions].text);
      setActionButton(customData.actionNCTypes[selectedActions].button);
      setActionValue(customData.actionNCTypes[selectedActions].value);
      setActionMessage(customData.actionNCTypes[selectedActions].msg);
      showActionModal(true);
    }
  }, [enterAction]);

  const changeLocationActionToggle = (id) => {
    setSelectedId(id);
    setLocationActionOpen(!changeLocationActionOpen);
  };

  const switchActionItem = (action, data) => {
    if (selectedId === data.id) {
      setLocationActionOpen(!changeLocationActionOpen);
      setSelectedActions(action.displayname);
      setSelectedActionImage(action.name);
      setSelectedData(data);
      setEnterAction(Math.random());
    }
  };

  const switchActionItemData = (displayname, name, data) => {
    setLocationActionOpen(!changeLocationActionOpen);
    setSelectedActions(displayname);
    setSelectedActionImage(name);
    setSelectedData(data);
    setEnterAction(Math.random());
  };

  const checkDisable = (actionName, state, ticket) => {
    let allowed = false;
    if (actionName === 'Start' && state !== 'open' && state !== 'done' && state !== 'cancelled') {
      allowed = true;
    } else if (actionName === 'Close' && state !== 'done' && state !== 'cancelled') {
      allowed = true;
    } else if (actionName === 'Cancel' && state !== 'done' && state !== 'cancelled') {
      allowed = true;
    } else if (actionName === 'Create Ticket' && state !== 'done' && state !== 'cancelled' && !ticket.id) {
      allowed = true;
    }
    return allowed;
  };

  function getNCCount() {
    let res = 0;
    const data = actionsData.filter((item) => item.type_action === 'non_conformity');
    if (data && data.length) {
      res = data.length;
    }
    return res;
  }

  function getIOCount() {
    let res = 0;
    const data = actionsData.filter((item) => item.type_action === 'improvement');
    if (data && data.length) {
      res = data.length;
    }
    return res;
  }

  useEffect(() => {
    if (viewId) {
      dispatch(getTicketDetail(viewId, appModels.HELPDESK));
    }
  }, [viewId]);

  useEffect(() => {
    if (detailData.id) {
      dispatch(getAuditActions(detailData.id, appModels.AUDITACTION, 'improvement'));
    }
  }, [detailData]);

  useEffect(() => {
    if (updateAuditAction && updateAuditAction.data && detailData && detailData.id) {
      dispatch(getAuditActions(detailData.id, appModels.AUDITACTION, 'improvement'));
    }
  }, [updateAuditAction]);

  useEffect(() => {
    if (auditAction && auditAction.data && detailData && detailData.id) {
      dispatch(getAuditActions(detailData.id, appModels.AUDITACTION, 'improvement'));
    }
  }, [auditAction]);

  const loading = auditActionDetails && auditActionDetails.loading;
  const isErr = auditActionDetails && auditActionDetails.err;

  const showDetailsView = (id) => {
    setViewId(id);
    setViewModal(true);
  };

  const showEditView = (id, data) => {
    dispatch(resetAuditUpdateAction());
    setSelectedData(data);
    setEditId(id);
    showEditModal(true);
  };

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      if (type === assetData[i].type_action || type === 'all') {
        tableTr.push(
          <tr key={i}>
            <td
              className="p-2 font-weight-800"
            >
              {getDefaultNoValue(assetData[i].name)}
            </td>
            <td className="p-2">{getDefaultNoValue(getResponseTypeLabel(assetData[i].type_action))}</td>
            <td className="p-2">{getDefaultNoValue(extractNameObject(assetData[i].user_id, 'name'))}</td>
            <td className="p-2">{getDefaultNoValue(getStateLabel(assetData[i].state))}</td>
            <td className="p-2">{getDefaultNoValue(getCompanyTimezoneDate(assetData[i].date_deadline, userInfo, 'date'))}</td>
            <td className="p-2">
              <Tooltip title="Edit">
                <FontAwesomeIcon size="sm" className="mr-2 cursor-pointer" icon={faEdit} />
              </Tooltip>
              {assetData[i].helpdesk_id && assetData[i].helpdesk_id.id && (
              <Tooltip title="View Ticket">
                <FontAwesomeIcon size="sm" className="mr-2 cursor-pointer" icon={faEye} onClick={() => showDetailsView(assetData[i].helpdesk_id.id)} />
              </Tooltip>
              )}
              <div className="mr-2 mt-1">
                <ButtonDropdown isOpen={changeLocationActionOpen} toggle={() => changeLocationActionToggle(assetData[i].id)} className="actionTableDropdown">
                  <DropdownToggle
                    caret
                    className={selectedActionImage !== '' ? 'bg-white text-navy-blue text-left pb-05 pt-05 font-11 rounded-pill'
                      : 'pb-05 pt-05 font-11 rounded-pill btn-navyblue text-left'}
                  >
                    {selectedActionImage !== ''
                      ? (
                        <FontAwesomeIcon
                          className="mr-2"
                          color="primary"
                          icon={faIcons[`${selectedActionImage}`]}
                        />
                      ) : ''}
                    <span className="font-weight-700">
                      {!selectedActionImage && (
                      <FontAwesomeIcon size="sm" color="primary" className="mr-2 mt-1" icon={faCog} />
                      )}
                      <FontAwesomeIcon size="sm" color="primary" className="float-right ml-2 mt-1" icon={faChevronDown} />
                    </span>
                  </DropdownToggle>
                  {selectedId === assetData[i].id && (
                  <DropdownMenu>
                    {customData && customData.actionNCItems.map((actions) => (
                      <DropdownItem
                        id="switchAction"
                        className="pl-2"
                        key={actions.id}
                        disabled={!checkDisable(actions.displayname, assetData[i].state, assetData[i].helpdesk_id)}
                        onClick={() => switchActionItem(actions, assetData[i])}
                      >
                        <FontAwesomeIcon
                          className="mr-2"
                          icon={faIcons[actions.name]}
                        />
                        {actions.displayname}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                  )}
                </ButtonDropdown>
              </div>
            </td>
          </tr>,
        );
      }
    }
    return tableTr;
  }

  const onViewReset = () => {
    setViewId(false);
    setViewModal(false);
  };

  const handleCheckboxChange = (event) => {
    const { checked, value } = event.target;
    if (checked && value) {
      setType(value);
    } else {
      setType('improvement');
    }
  };

  const closeEditAudit = () => {
    dispatch(resetAuditUpdateAction());
    showEditModal(false);
    setEditId(false);
  };

  const closeEditAudit1 = () => {
    if (document.getElementById('auditTicketActionform')) {
      document.getElementById('auditTicketActionform').reset();
    }
    dispatch(resetAuditAction());
    showEditModal1(false);
  };

  return (
    <Row>
      <Col sm="12" md="12" lg="12" xs="12" className="p-3 bg-white">
        {(!loading && auditActionDetails && auditActionDetails.data && auditActionDetails.data.length > 0) && (
          <div>
            <div className="p-2">
              <Radio.Group onChange={(e) => handleCheckboxChange(e)} defaultValue="all">
                <Radio.Button value="all">
                  All (
                  {auditActionDetails.data.length}
                  )
                </Radio.Button>
                <Radio.Button value="improvement">
                  Improvements (
                  {getIOCount()}
                  )
                </Radio.Button>
                <Radio.Button value="non_conformity">
                  Non-Compliances (
                  {getNCCount()}
                  )
                </Radio.Button>
              </Radio.Group>
            </div>
            <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
              <thead className="bg-gray-light">
                <tr>
                  <th className="p-2 min-width-160">
                    Observation/Non-Compliance
                  </th>
                  <th className="p-2 min-width-160">
                    Response Type
                  </th>
                  <th className="p-2 min-width-160">
                    Responsible
                  </th>
                  <th className="p-2 min-width-160">
                    Status
                  </th>
                  <th className="p-2 min-width-160">
                    Deadline
                  </th>
                  <th className="p-2 min-width-160">
                    Manage
                  </th>
                </tr>
              </thead>
              <tbody>
                {auditActionDetails && auditActionDetails.data.map((pt) => (
                  (type === pt.type_action || type === 'all') && (
                    <tr key={pt.id}>
                      <td
                        className="p-2 font-weight-800"
                      >
                        {getDefaultNoValue(pt.name)}
                      </td>
                      <td className="p-2">{getDefaultNoValue(getResponseTypeLabel(pt.type_action))}</td>
                      <td className="p-2">{getDefaultNoValue(extractNameObject(pt.user_id, 'name'))}</td>
                      <td className="p-2">{getDefaultNoValue(getStateLabel(pt.state))}</td>
                      <td className="p-2">{getDefaultNoValue(getCompanyTimezoneDate(pt.date_deadline, userInfo, 'date'))}</td>
                      <td className="p-2">
                        <Tooltip title="View Ticket">
                          <FontAwesomeIcon
                            size="sm"
                            className={pt.helpdesk_id && pt.helpdesk_id.id ? 'mr-2 cursor-pointer' : 'mr-2 cursor-pointer invisible'}
                            icon={faEye}
                            onClick={() => showDetailsView(pt.helpdesk_id.id)}
                          />
                        </Tooltip>
                        {pt.state !== 'done' && pt.state !== 'cancelled' && (
                        <>
                          <Tooltip title="Edit">
                            <FontAwesomeIcon size="sm" className="mr-2 cursor-pointer" icon={faEdit} onClick={() => showEditView(pt.id, pt)} />
                          </Tooltip>
                          <span className="ml-2">
                            <ButtonDropdown isOpen={changeLocationActionOpen && selectedId === pt.id} toggle={() => changeLocationActionToggle(pt.id)} className="actionTableDropdown">
                              <DropdownToggle
                                caret
                                className="pb-05 pt-05 font-11 rounded-pill btn-navyblue text-left"
                              >
                                <span className="font-weight-700">
                                  <FontAwesomeIcon size="sm" color="primary" className="mr-1 mt-1" icon={faCog} />
                                </span>
                              </DropdownToggle>
                              <DropdownMenu>
                                {checkDisable('Start', pt.state, pt.helpdesk_id) && (
                                <DropdownItem
                                  id="switchAction"
                                  className="pl-2"
                                  onClick={() => switchActionItemData('Start', 'START', pt)}
                                >

                                  <FontAwesomeIcon size="sm" color="success" className="mr-2 cursor-pointer" icon={faCheckCircle} />
                                  <span>Start</span>

                                </DropdownItem>
                                )}

                                {checkDisable('Create Ticket', pt.state, pt.helpdesk_id) && (
                                <DropdownItem
                                  id="switchAction"
                                  className="pl-2"
                                  onClick={() => showEditView1(pt.id, pt)}
                                >

                                  <FontAwesomeIcon size="sm" className="mr-2 cursor-pointer" icon={faEnvelope} />
                                  <span>Create Ticket</span>

                                </DropdownItem>
                                )}

                                {checkDisable('Close', pt.state, pt.helpdesk_id) && (
                                <DropdownItem
                                  id="switchAction"
                                  className="pl-2"
                                  onClick={() => switchActionItemData('Close', 'CLOSE', pt)}
                                >

                                  <FontAwesomeIcon size="sm" color="danger" className="mr-2 cursor-pointer" icon={faTimesCircle} />
                                  <span>Close</span>

                                </DropdownItem>
                                )}

                                {checkDisable('Cancel', pt.state, pt.helpdesk_id) && (
                                <DropdownItem
                                  id="switchAction"
                                  className="pl-2"
                                  onClick={() => switchActionItemData('Cancel', 'CANCEL', pt)}
                                >

                                  <FontAwesomeIcon size="sm" color="danger" className="mr-2 cursor-pointer" icon={faTimes} />
                                  <span>Cancel</span>

                                </DropdownItem>
                                )}
                              </DropdownMenu>
                            </ButtonDropdown>
                          </span>
                        </>
                        )}
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </Table>
            <hr className="m-0" />
          </div>
        )}
        {loading && (
          <div className="loader" data-testid="loading-case">
            <Loader />
          </div>
        )}
        {isErr && (
          <ErrorContent errorTxt={generateErrorMessage(isErr)} />
        )}
        {!isErr && auditActionDetails && auditActionDetails.data && auditActionDetails.data.length === 0 && (
          <ErrorContent errorTxt="No Data Found" />
        )}
        {actionModal && (
          <Action
            atFinish={() => {
              showActionModal(false); setSelectedActions(defaultActionText); setSelectedActionImage('');
            }}
            atCancel={() => {
              showActionModal(false); setSelectedActions(defaultActionText); setSelectedActionImage('');
            }}
            actionText={actionText}
            actionButton={actionButton}
            actionMessage={actionMessage}
            actionValue={actionValue}
            details={selectedData}
            auditId={detailData && detailData.id ? detailData.id : false}
            actionModal
          />
        )}
        <Drawer
          PaperProps={{
            sx: { width: '85%' },
          }}
          anchor="right"
          open={viewModal}
        >
          <DrawerHeader
            headerName={ticketDetail && (ticketDetail.data && ticketDetail.data.length > 0)
              ? `${'Ticket'}${' - '}${ticketDetail.data[0].ticket_number}` : 'Ticket'}
            imagePath={ticketIcon}
            isEditable={false}
            onClose={() => onViewReset()}
            onEdit={false}
            onPrev={false}
            onNext={false}
          />
          <TicketDetail isIncident={false} setViewModal={setViewModal} />
        </Drawer>
        <Drawer
          PaperProps={{
            sx: { width: '85%' },
          }}
          anchor="right"
          open={editModal}
        >
          <DrawerHeader
            headerName="Update Action"
            imagePath={false}
            onClose={closeEditAudit}
          />
          <UpdateAction editId={editId} detailData={selectedData} closeModal={closeEditAudit} />
        </Drawer>
        <Drawer
          PaperProps={{
            sx: { width: '85%' },
          }}
          anchor="right"
          open={editModal1}
        >
          <DrawerHeader
            headerName="Create Ticket"
            imagePath={false}
            onClose={closeEditAudit1}
          />
          <UpdateTicketAction editId={editId} detailData={selectedData} closeModal={closeEditAudit1} />
        </Drawer>
      </Col>
    </Row>
  );
};

Opportunities.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
  setDetailModal: PropTypes.func.isRequired,
};

export default Opportunities;
