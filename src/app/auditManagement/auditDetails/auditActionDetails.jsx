import {
  IconButton, Button, Divider, Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { BsThreeDotsVertical } from 'react-icons/bs';
import {
  Table,
} from 'reactstrap';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import { useSelector, useDispatch } from 'react-redux';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import moment from 'moment-timezone';
import Dialog from '@mui/material/Dialog';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle, faTimesCircle,
  faSignOut, faSignIn,
  faPauseCircle,
} from '@fortawesome/free-solid-svg-icons';
import DOMPurify from 'dompurify';

import Loader from '@shared/loading';
import auditBlue from '@images/icons/auditBlue.svg';

import DialogHeader from '../../commonComponents/dialogHeader';
import Documents from '../../commonComponents/documents';
import DrawerHeader from '../../commonComponents/drawerHeader';
import DetailViewHeader from '../../commonComponents/detailViewHeader';
import DetailViewLeftPanel from '../../commonComponents/detailViewLeftPanel';
import DetailViewTab from '../../commonComponents/detailViewTab';
import {
  detailViewHeaderClass,
  hxAuditActionStatusJson,
} from '../../commonComponents/utils/util';
import SlaMatrix from './actionDetail/slaMatrix';
import StatusLogs from './actionDetail/statusLogs';
import actionCodes from '../data/actionCodes.json';
import {
  resetUpdateHxAudit,
  resetHxAuditActionPerform,
  getHxAuditDetails,
  getHxAuditChecklistDetail,
  resetCreateHxAction,
  getHxAuditActionDetail,
} from '../auditService';
import {
  TabPanel,
  extractNameObject,
  htmlToReact,
  getCompanyTimezoneDate,
  getDefaultNoValue,
  getListOfOperations,
} from '../../util/appUtils';
import { getActionDueDays } from '../utils/utils';

import AuditDetails from './auditDetails';
import customData from '../data/customData.json';
import ManageAction from './manageAction';
import CreateNonConformity from './createNonConformity';

const faIcons = {
  CANCEL: faTimesCircle,
  ONHOLD: faPauseCircle,
  INPROGRESS: faCheckCircle,
  DRAFT: faSignIn,
  CLOSE: faSignOut,
};

const appModels = require('../../util/appModels').default;

const AuditActionDetails = ({ offset }) => {
  const {
    hxAuditActionDetail, hxAuditDetailsInfo, hxActionCreate, hxChecklistDetail,
  } = useSelector((state) => state.hxAudits);
  const dispatch = useDispatch();
  const history = useHistory();
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState(0);
  const open = Boolean(anchorEl);
  const [editId, setEditId] = useState(false);
  const [taskQuestions, setTaskQuestions] = useState([]);
  const [editModal, showEditModal] = useState(false);

  const [viewId, setViewId] = useState(false);
  const [viewModel, setViewModel] = useState(false);

  const [auditModal, setAuditModal] = useState(false);
  const [checklistModal, setChecklistModal] = useState(false);

  const defaultActionText = 'Gatepass Actions';

  const [actionMethod, setActionMethod] = useState(false);
  const [actionButton, setActionButton] = useState(false);
  const [actionMsg, setActionMsg] = useState(false);
  const [statusName, setStatusName] = useState(false);

  const [actionModal, showActionModal] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [selectedActionImage, setSelectedActionImage] = useState('');

  const detailedData = hxAuditActionDetail && hxAuditActionDetail.data && hxAuditActionDetail.data.length ? hxAuditActionDetail.data[0] : '';
  const tabs = ['Overview', 'Status Logs', 'Attachments', 'Escalation Matrix'];

  const allowedOperations = getListOfOperations(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'code',
  );

  const isEditable = (detailedData && detailedData.state !== 'Closed' && detailedData.state !== 'Cancelled') && allowedOperations.includes(actionCodes['Edit Audit Action']);

  const checkActionAllowed = (actionName) => {
    let allowed = true;
    const vrState = detailedData && detailedData.state ? detailedData.state : '';

    if (actionName === 'Move Into In-Progress') {
      if (vrState !== 'Open' && vrState !== 'On Hold') {
        allowed = false;
      }
    }
    if (actionName === 'Put On-Hold') {
      if (vrState !== 'In Progress') {
        allowed = false;
      }
    }
    if (actionName === 'Set to Draft') {
      if (vrState !== 'In Progress' && vrState !== 'Closed') {
        allowed = false;
      }
    }
    if (actionName === 'Cancel') {
      if (vrState !== 'Open' && vrState !== 'In Progress') {
        allowed = false;
      }
    }
    if (actionName === 'Close') {
      if (vrState !== 'Open' && vrState !== 'In Progress') {
        allowed = false;
      }
    }
    return allowed;
  };

  const openAudit = (auditId) => {
    if (auditId) {
      dispatch(getHxAuditDetails(auditId, appModels.HXAUDIT));
      setAuditModal(true);
    }
  };

  const openChecklist = (qtnId, auditId) => {
    if (qtnId && auditId && auditId.id) {
      dispatch(getHxAuditChecklistDetail(auditId.id, qtnId));
      setChecklistModal(true);
    }
  };

  const checkDisable = (actionName) => {
    if (!detailedData || !detailedData.deadline) return false;

    const actionsToDisable = ['Move Into In-Progress', 'Put On-Hold', 'Cancel', 'Close', 'Set to Draft']; // Actions to check
    const endDate = moment.utc(detailedData.deadline).local().startOf('day'); // Convert deadline to local date (ignoring time)
    const today = moment().startOf('day'); // Current date (ignoring time)

    // Check if the action is within the range and belongs to the actionsToDisable list
    const isAllow = endDate.isSameOrAfter(today);
    return actionsToDisable.includes(actionName) && !isAllow;
  };

  const checkAuditStatus = (val) => (
    <Box>
      {hxAuditActionStatusJson.map(
        (status) => val === status.status && (
        <Box
          sx={{
            backgroundColor: status.backgroundColor,
            padding: '4px 8px 4px 8px',
            border: 'none',
            borderRadius: '4px',
            color: status.color,
            fontFamily: 'Suisse Intl',
          }}
        >
          {val}
          {' '}
          {val !== 'Closed' ? getActionDueDays(detailedData.deadline) : ''}
        </Box>
        ),
      )}
    </Box>
  );

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeAction = () => {
    showActionModal(false);
    dispatch(resetUpdateHxAudit());
    dispatch(resetHxAuditActionPerform());
    setSelectedActions(defaultActionText);
    setSelectedActionImage('');
    setActionMethod('');
    setActionButton('');
    setStatusName('');
    setActionMsg('');
  };

  const switchActionItem = (action) => {
    dispatch(resetUpdateHxAudit());
    dispatch(resetHxAuditActionPerform());
    setSelectedActions(action.displayname);
    setActionMethod(action.method);
    setActionButton(action.displayname);
    setActionMsg(action.message);
    setSelectedActionImage(action.name);
    showActionModal(true);
    handleClose();
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const closeEditWindow = () => {
    if (editId && hxActionCreate && hxActionCreate.data) {
      dispatch(getHxAuditActionDetail(editId, appModels.HXAUDITACTION));
    }
    dispatch(resetCreateHxAction());
    setEditId(false);
    showEditModal(false);
  };

  /* const closeEditReset = () => {
    showEditModal(false);
    if (editId && hxAuditUpdate && hxAuditUpdate.data) {
      dispatch(getHxAuditDetails(editId, appModels.HXAUDIT));
    }
    dispatch(resetUpdateHxAudit());
  }; */

  function getTableHeight(dataLength) {
    let res = 150;
    const rowHeight = 40; // Approximate height of a single row in pixels
    const maxHeight = 150; // Max height based on viewport
    const rowCount = dataLength && dataLength > 0 ? dataLength + 1 : 1;
    // Calculate the height
    res = Math.min(rowCount * rowHeight, maxHeight);
    return res;
  }

  const checklistData = hxChecklistDetail.data && hxChecklistDetail.data.length > 0 ? hxChecklistDetail.data[0] : false;

  return (
    <>
      {detailedData && (
      <Box>
        <DetailViewHeader
          mainHeader={`${getDefaultNoValue(detailedData.type)}`}
          subHeader=""
          status={
                            detailedData.state ? checkAuditStatus(detailedData.state) : '-'
                        }
          actionComponent={(
            <Box>
              {hxAuditActionDetail
                                    && !hxAuditActionDetail.loading
                                    && isEditable && (
                                    <Button
                                      type="button"
                                      className="ticket-btn"
                                      sx={{
                                        backgroundColor: '#fff',
                                        '&:hover': {
                                          backgroundColor: '#fff',
                                        },
                                      }}
                                      variant="outlined"
                                      onClick={() => {
                                        setEditId(hxAuditActionDetail && (hxAuditActionDetail.data && hxAuditActionDetail.data.length > 0) ? hxAuditActionDetail.data[0].id : false);
                                        showEditModal(true);
                                        dispatch(resetCreateHxAction());
                                      }}
                                    >
                                      Edit
                                    </Button>
              )}
              <IconButton
                sx={{
                  margin: '0px 5px 0px 5px',
                }}
                id="demo-positioned-button"
                aria-controls={open ? 'demo-positioned-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleMenuClick}
              >
                <BsThreeDotsVertical color="#ffffff" />
              </IconButton>
              <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
                {customData && customData.actionItems2.map((actions) => (

                  checkActionAllowed(actions.displayname) && (
                    <MenuItem
                      sx={{
                        font: 'normal normal normal 15px Suisse Intl',
                      }}
                      id="switchAction"
                      className="pl-2"
                      key={actions.id}
                      disabled={checkDisable(actions.displayname)}
                      onClick={() => switchActionItem(actions)}
                    >
                      <FontAwesomeIcon
                        className="mr-2"
                        icon={faIcons[actions.name]}
                      />
                      {detailedData.state === 'Closed' && actions.displayname === 'Set to Draft' ? 'Reopen' : actions.displayname}
                    </MenuItem>
                  )
                ))}
              </Menu>
            </Box>
                          )}
        />
        <Box
          sx={{
            width: '100%',
            display: 'flex',
          }}
        >
          <Box
            sx={{
              width: '100%',
            }}
          >
            <DetailViewTab
              value={value}
              handleChange={handleTabChange}
              tabs={tabs}
            />
            {detailedData && detailedData.type && detailedData.type === 'Non-conformity' && (
            <Stack>
              <Alert severity={!detailedData.repeated_count_site && !detailedData.repeated_count_company ? 'info' : 'warning'}>

                {detailedData.repeated_count_site > 0 && detailedData.repeated_count_company > 0 && (
                <p className="font-family-tab mb-0">
                  Warning: This non-compliance has been reported
                  {' '}
                  {detailedData.repeated_count_site > 1 ? detailedData.repeated_count_site : 'once'}
                  {' '}
                  {detailedData.repeated_count_site > 1 ? 'times' : ''}
                  {' '}
                  at this location and
                  {' '}
                  {detailedData.repeated_count_company > 1 ? detailedData.repeated_count_company : 'once'}
                  {' '}
                  {detailedData.repeated_count_company > 1 ? 'times' : ''}
                  {' '}
                  across all locations!
                </p>
                )}
                {!detailedData.repeated_count_site && detailedData.repeated_count_company > 0 && (
                <p className="font-family-tab mb-0">
                  Warning: This non-compliance has been reported
                  {' '}
                  {detailedData.repeated_count_company > 1 ? detailedData.repeated_count_company : 'once'}
                  {' '}
                  {detailedData.repeated_count_company > 1 ? 'times' : ''}
                  {' '}
                  across all locations!
                </p>
                )}
                {!detailedData.repeated_count_site && !detailedData.repeated_count_company && (
                <p className="font-family-tab mb-0">
                  Info: This non-compliance is being reported once across all locations!
                </p>
                )}
              </Alert>
            </Stack>
            )}
            <TabPanel value={value} index={0}>
              <DetailViewLeftPanel
                panelData={[
                  {
                    header: 'General Information',
                    leftSideData: [
                      {
                        property: 'Severity',
                        value: getDefaultNoValue(detailedData.severity),
                      },
                      {
                        property: 'Deadline',
                        value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.deadline, userInfo, 'date')),
                      },
                      {
                        property: 'Responsible',
                        value: getDefaultNoValue(extractNameObject(detailedData.responsible_id, 'name')),
                      },
                      {
                        property: 'Company',
                        value: getDefaultNoValue(extractNameObject(detailedData.company_id, 'name')),
                      },
                    ],
                    rightSideData: [
                      {
                        property: 'Category',
                        value: getDefaultNoValue(extractNameObject(detailedData.category_id, 'name')),
                      },
                      {
                        property: 'Audit',
                        value: <span onClick={() => openAudit(detailedData.audit_id && detailedData.audit_id.id ? detailedData.audit_id.id : false)} className="text-info cursor-pointer font-family-tab">{getDefaultNoValue(extractNameObject(detailedData.audit_id, 'name'))}</span>,
                      },
                      {
                        property: 'Checklist',
                        value: <span onClick={() => openChecklist(detailedData.question_id && detailedData.question_id.id ? detailedData.question_id.id : false, detailedData.audit_id)} className="text-info cursor-pointer font-family-tab">{getDefaultNoValue(extractNameObject(detailedData.question_id, 'question'))}</span>,
                      },
                      {
                        property: 'SLA Status',
                        value: getDefaultNoValue(detailedData.sla_status),
                      },
                    ],
                  },
                  {
                    header: 'Detail Information',
                    leftSideData: [
                      {
                        property: 'Description',
                        value: <p
                          className="text-capital font-side-heading m-0 p-0 max-height-80 overflow-auto thin-scrollbar"
                          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlToReact(detailedData.description), { USE_PROFILES: { html: true } }) }}
                        />,
                      },
                    ],
                    rightSideData: [
                      {
                        property: 'Resolution',
                        value: <p
                          className="text-capital font-side-heading m-0 p-0 max-height-80 overflow-auto thin-scrollbar"
                          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlToReact(detailedData.resolution), { USE_PROFILES: { html: true } }) }}
                        />,
                      },
                    ],
                  },
                ]}
              />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <StatusLogs />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <Documents
                viewId={detailedData.id}
                ticketNumber={detailedData.name}
                resModel={appModels.HXAUDITACTION}
                model={appModels.DOCUMENT}
              />
              <Divider />

            </TabPanel>
            <TabPanel value={value} index={3}>
              <SlaMatrix />
            </TabPanel>
          </Box>
          {actionModal && (
          <ManageAction
            atFinish={() => closeAction()}
            atCancel={() => closeAction()}
            detailData={detailedData}
            actionModal={actionModal}
            actionButton={actionButton}
            actionMsg={actionMsg}
            offset={offset}
            actionMethod={actionMethod}
            displayName={selectedActions}
            message={selectedActionImage}
          />
          )}
          <Dialog maxWidth="md" open={editModal}>
            <DialogHeader title="Update Audit Action" onClose={() => closeEditWindow()} response={false} imagePath={false} />
            <CreateNonConformity
              onRemarksSaveClose={false}
              qtnDataId={editId}
              currentAnswer={false}
              currentRemarks={false}
              onMessageChange={false}
              qtnName={false}
              editData={detailedData}
              type={detailedData && detailedData.type}
              onClose={() => closeEditWindow()}
              auditId={detailedData && detailedData.audit_id && detailedData.audit_id.id}
              qtnId={false}
            />
          </Dialog>
          <Dialog maxWidth="md" open={checklistModal}>
            <DialogHeader title={getDefaultNoValue(extractNameObject(detailedData.question_id, 'question'))} onClose={() => setChecklistModal(false)} response={false} imagePath={false} />
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {hxChecklistDetail && hxChecklistDetail.loading && (
                <Loader />
                )}
                {hxChecklistDetail && !hxChecklistDetail.loading && checklistData && (
                <div>
                  <DetailViewLeftPanel
                    panelData={[
                      {
                        header: 'General Information',
                        leftSideData: [
                          {
                            property: 'Category',
                            value: <span className="font-size-13 font-family-tab">{getDefaultNoValue(extractNameObject(checklistData.page_id, 'title'))}</span>,
                          },
                          {
                            property: 'Section',
                            value: <span className="font-size-13 font-family-tab">{getDefaultNoValue(extractNameObject(checklistData.question_group_id, 'name'))}</span>,
                          },
                          {
                            property: 'Response',
                            value: <span className="font-size-13 font-family-tab">{getDefaultNoValue(checklistData.answer)}</span>,
                          },
                          {
                            property: 'Remarks',
                            value: <span className="font-size-13 font-family-tab">{getDefaultNoValue(checklistData.remarks)}</span>,
                          },
                        ],
                        rightSideData: [
                          {
                            property: 'Info',
                            value: <span className="font-size-13 font-family-tab">{getDefaultNoValue(extractNameObject(checklistData.mro_activity_id, 'helper_text'))}</span>,
                          },
                          {
                            property: 'Procedure',
                            value: <span className="font-size-13 font-family-tab">{getDefaultNoValue(extractNameObject(checklistData.mro_activity_id, 'procedure'))}</span>,
                          },
                          {
                            property: 'Score',
                            value: <span className="font-size-13 font-family-tab">{parseFloat(checklistData.achieved_score).toFixed(2)}</span>,
                          },

                        ],
                      },
                    ]}
                  />
                  {(checklistData.mro_activity_id && checklistData.mro_activity_id.applicable_standard_ids && checklistData.mro_activity_id.applicable_standard_ids.length > 0) && (
                  <>
                    <Typography
                      sx={detailViewHeaderClass}
                    >
                      Applicable Standards
                    </Typography>
                    <div style={{ height: `${getTableHeight(checklistData.mro_activity_id.applicable_standard_ids.length)}px` }} className="small-table-scroll thin-scrollbar">
                      <Table id="spare-part" className="mb-0" responsive bordered>
                        <thead className="bg-lightblue">
                          <tr>
                            <th className="p-2 min-width-140 border-0 table-column z-Index-1060 font-family-tab">
                              Title
                            </th>
                            <th className="p-2 min-width-160 border-0 table-column z-Index-1060 font-family-tab">
                              Disclosure
                            </th>
                            <th className="p-2 min-width-160 border-0 table-column z-Index-1060 font-family-tab">
                              Standard
                            </th>
                            <th className="p-2 min-width-160 border-0 table-column z-Index-1060 font-family-tab">
                              Description
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {checklistData.mro_activity_id.applicable_standard_ids.map((as) => (
                            <tr key={as.id}>
                              <td className="p-2 font-weight-400 font-family-tab">{as.name}</td>
                              <td className="p-2 font-weight-400 font-family-tab">{as.disclosure}</td>
                              <td className="p-2 font-weight-400 font-family-tab">{as.standard_id && as.standard_id.name ? as.standard_id.name : '-'}</td>
                              <td className="p-2 font-weight-400 font-family-tab">{as.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>

                    </div>
                  </>
                  )}
                </div>
                )}
                {hxChecklistDetail && hxChecklistDetail.err && (
                <p className="font-family-tab">No Data</p>
                )}
              </DialogContentText>
            </DialogContent>
          </Dialog>
          <Drawer
            PaperProps={{
              sx: { width: '85%' },
            }}
            anchor="right"
            open={auditModal}
          >
            <DrawerHeader
              headerName={hxAuditDetailsInfo && (hxAuditDetailsInfo.data && hxAuditDetailsInfo.data.length > 0)
                ? `${'Audit'}${' - '}${hxAuditDetailsInfo.data[0].name}` : 'Audit'}
              imagePath={auditBlue}
              onClose={() => setAuditModal(false)}
            />
            <AuditDetails offset={offset} />
          </Drawer>
        </Box>
      </Box>
      )}
      {hxAuditActionDetail && hxAuditActionDetail.loading && <Loader />}
    </>
  );
};
export default AuditActionDetails;
