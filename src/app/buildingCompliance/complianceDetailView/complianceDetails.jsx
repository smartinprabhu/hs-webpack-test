/* eslint-disable max-len */
import {
  faCheckCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ComplianceCheck from '@images/icons/complianceCheck.svg';
import {
  Button,
  Dialog,
  DialogContent, DialogContentText,
  Divider,
  IconButton,
  Menu,
} from '@mui/material';
import Drawer from '@mui/material/Drawer';
import MenuItem from '@mui/material/MenuItem';
import { Box } from '@mui/system';
import React, { useMemo, useEffect, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import DOMPurify from 'dompurify';

import Loader from '@shared/loading';

import DetailViewHeader from '../../commonComponents/detailViewHeader';
import DetailViewLeftPanel from '../../commonComponents/detailViewLeftPanel';
import DetailViewTab from '../../commonComponents/detailViewTab';
import DialogHeader from '../../commonComponents/dialogHeader';
import Documents from '../../commonComponents/documents';
import DrawerHeader from '../../commonComponents/drawerHeader';
import {
  TabPanel,
  extractNameObject,
  getArrayToCommaValues, getCompanyTimezoneDate,
  getDefaultNoValue, getListOfModuleOperations, truncate,
  htmlToReact, convertUrlsToLinks,
} from '../../util/appUtils';
import ComplianceEvidences from '../complianceDetails/complianceEvidences';
import Logs from '../complianceDetails/logs';

import { resetActivityInfo } from '../../purchase/purchaseService';
import Archive from '../complianceDetails/actionItems/archive';
import Publish from '../complianceDetails/actionItems/publish';
import Renewal from '../complianceDetails/actionItems/renewal/renewal';
import SetToDraft from '../complianceDetails/actionItems/setToDraft';
import Unpublish from '../complianceDetails/actionItems/unpublish';
import ComplianceFormat from '../complianceDetails/complianceFormat';
import {
  getComplianceDetail,
  getComplianceEvidence,
  getComplianceConfig,
  resetComplianceState, resetRenewalDetail, resetComplianceTemplate,
} from '../complianceService';
import actionCodes from '../data/complianceActionCodes.json';
import customData from '../data/customData.json';
import CreateCompliance from '../forms/createCompliance';
import { getComplianceStateLabel } from '../utils/utils';

const appModels = require('../../util/appModels').default;

const faIcons = {
//   ESCALATETICKET: escalate,
//   ESCALATETICKETACTIVE: escalate,
};

const ComplianceDetails = ({
  onViewEditReset,
  isIncident,
  setViewModal,
  setParentTicket,
  setCurrentTicket,
}) => {
  const defaultActionText = 'Compliance Actions';

  const dispatch = useDispatch();
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    complianceDetails,
  } = useSelector((state) => state.compliance);
  const {
    createActivityInfo,
  } = useSelector((state) => state.purchase);
  const { tenantUpdateInfo } = useSelector((state) => state.setup);
  const [editId, setEditId] = useState(false);
  const [value, setValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [selectedActionImage, setSelectedActionImage] = useState('');

  const tabs = ['Compliance Overview', 'Compliance Evidences', 'Logs', 'Document References', 'Compliance Format'];

  const detailedData = complianceDetails && complianceDetails.data && complianceDetails.data.length
    ? complianceDetails.data[0]
    : false;

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const isRepeatShow = detailedData.repeat_until === 'Ends On';

  const [messageModal, showMessageModal] = useState(false);
  const [escalateModal, showEscalateModal] = useState(false);
  const [reassignModal, showReassignModal] = useState(false);
  const [closeModal, showCloseModal] = useState(false);
  const [addLink, setAddLink] = useState(false);
  const [actionText, setActionText] = useState('');
  const [actionCode, setActionCode] = useState('');
  const [actionModal, showActionModal] = useState(false);
  const [closeActionModal, showCloseActionModal] = useState(false);
  const [printModal, showPrintModal] = useState(false);
  const [printModalb, showPrintModalb] = useState(false);
  const [acceptModal, showAcceptModal] = useState(false);
  const [checkListModal, showCheckListModal] = useState(false);
  const [pauseActionModal, showPauseActionModal] = useState(false);
  const [progressActionModal, setProgressActionModal] = useState(false);
  const [shareActionModal, setShareActionModal] = useState(false);
  const [enterAction, setEnterAction] = useState(false);
  //   const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  //   const [selectedActions, setSelectedActions] = useState(defaultActionText);
  //   const [selectedActionImage, setSelectedActionImage] = useState('');
  const [publishModal, showPublishModal] = useState(false);
  const [unpublishModal, showUnpublishModal] = useState(false);
  const [renewalModal, showRenewalModal] = useState(false);
  const [draftModal, showDraftModal] = useState(false);
  const [archiveModal, showArchiveModal] = useState(false);
  const [renewalHeader, setRenewalHeader] = useState('');
  const [editModal, showEditModal] = useState(false);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Building Compliance', 'code');

  const isCreateAllowed = allowedOperations.includes(actionCodes['Add Document']);
  const isDownloadAllowed = allowedOperations.includes(actionCodes['Download Document']);
  const isDeleteAllowed = allowedOperations.includes(actionCodes['Delete Document']);

  useEffect(() => {
    if ((tenantUpdateInfo && tenantUpdateInfo.data) && (complianceDetails && complianceDetails.data)) {
      dispatch(getComplianceDetail(complianceDetails.data[0].id, appModels.BULIDINGCOMPLIANCE));
    }
  }, [tenantUpdateInfo]);

  useMemo(() => {
    if (userInfo && userInfo.data && userInfo.data.company) {
      dispatch(getComplianceConfig(userInfo.data.company.id, appModels.BCSCONFIG));
    }
  }, [userInfo]);

  useEffect(() => {
    if (selectedActions === 'Publish') {
      showPublishModal(true);
    }
    if (selectedActions === 'Unpublish') {
      showUnpublishModal(true);
    }
    if (selectedActions === 'Start Renewal') {
      showRenewalModal(true);
      setRenewalHeader('Start Renewal');
    }
    if (selectedActions === 'Complete Renewal') {
      showRenewalModal(true);
      setRenewalHeader('Complete Renewal');
    }
    if (selectedActions === 'Set as Draft') {
      showDraftModal(true);
    }
    if (selectedActions === 'Archive') {
      showArchiveModal(true);
    }
  }, [enterAction]);

  const checkActionAllowed = (actionName) => {
    let allowed = true;
    const bcsState = complianceDetails && complianceDetails.data ? complianceDetails.data[0].state : '';
    const hasExpiry = complianceDetails && complianceDetails.data ? complianceDetails.data[0].is_has_expiry : '';
    const archiveNotVisibleState = ['Draft', 'Active', 'Due For Renewal', 'Renewal In Progress', 'Expired'];
    const startRenewalNotVisibleState = ['Active', 'Due For Renewal', 'Expired'];
    if (actionName === 'Publish' && bcsState !== 'Draft') {
      allowed = false;
    }
    if (actionName === 'Unpublish' && bcsState !== 'Active') {
      allowed = false;
    }
    if (actionName === 'Start Renewal' && (!hasExpiry || !startRenewalNotVisibleState.includes(bcsState))) {
      allowed = false;
    }
    if (actionName === 'Complete Renewal' && bcsState !== 'Renewal In Progress') {
      allowed = false;
    }
    if (actionName === 'Set as Draft' && bcsState !== 'Archived') {
      allowed = false;
    }
    if (actionName === 'Archive' && !archiveNotVisibleState.includes(bcsState)) {
      allowed = false;
    }
    return allowed;
  };

  const onViewReset = () => {
    setAddLink(false);
    setViewModal(true);
    setSelectedActions(defaultActionText);
    setSelectedActionImage('');
  };

  let appliesToLocation = 'Site';
  let appliesToLocationValue = getDefaultNoValue(detailedData.company_ids && detailedData.company_ids[0] && detailedData.company_ids[0].name);
  if (detailedData.applies_to === 'Location') {
    appliesToLocation = 'Location';
    appliesToLocationValue = getDefaultNoValue(detailedData.location_ids && getArrayToCommaValues(detailedData.location_ids, 'path_name'));
  } else if (detailedData.applies_to === 'Asset') {
    appliesToLocation = 'Asset';
    appliesToLocationValue = getDefaultNoValue(detailedData.asset_ids && getArrayToCommaValues(detailedData.asset_ids, 'name'));
  }

  const switchActionItem = (action) => {
    setLocationActionOpen(!changeLocationActionOpen);
    setSelectedActions(action.displayname);
    setSelectedActionImage(action.name);
    setEnterAction(Math.random());
    setAnchorEl(null);
  };

  const ids = getArrayToCommaValues(complianceDetails && complianceDetails.data && complianceDetails.data[0].compliance_evidences_ids, 'id');

  useEffect(() => {
    if (ids) {
      dispatch(getComplianceEvidence(ids, appModels.COMPLIANCEEVIDENCES));
    }
  }, [ids, complianceDetails]);

  const complianceData = complianceDetails && (complianceDetails.data && complianceDetails.data.length > 0) ? complianceDetails.data[0] : '';
  const viewData = complianceDetails && (complianceDetails.data && complianceDetails.data.length > 0) ? complianceDetails.data[0] : false;

  const closeEditModalWindow = () => {
    showEditModal(false);
  };

  const cancelComplianceState = () => {
    dispatch(resetComplianceState());
    dispatch(resetActivityInfo());
    const viewId = viewData && viewData.id ? viewData.id : '';
    dispatch(getComplianceDetail(viewId, appModels.BULIDINGCOMPLIANCE));
  };

  const cancelRenewal = () => {
    dispatch(resetComplianceState());
    dispatch(resetActivityInfo());
    dispatch(resetRenewalDetail());
    const viewId = viewData && viewData.id ? viewData.id : '';
    dispatch(getComplianceDetail(viewId, appModels.BULIDINGCOMPLIANCE));
  };
  // {getDefaultNoValue(extractNameObject(detailedData.compliance_id, 'name'))}

  return (
    <>
      {detailedData && (
        <Box>
          <DetailViewHeader
            mainHeader={truncate(getDefaultNoValue(extractNameObject(detailedData.compliance_id, 'name')), '30')}
            status={getComplianceStateLabel(complianceData.state, complianceData.is_renewed)}
            subHeader={(
              <>
                Submitted To
                -
                {' '}
                {getDefaultNoValue(extractNameObject(detailedData.submitted_to, 'name'))}
              </>
              )}
            actionComponent={(
              <Box>
                {complianceDetails
                    && !complianceDetails.loading
                    && complianceDetails.data
                    && complianceDetails.data.length > 0
                    && allowedOperations.includes(actionCodes['Edit Compliance Obligation']) && (
                      <Button
                        type="button"
                        variant="outlined"
                        className="ticket-btn"
                        sx={{
                          backgroundColor: '#fff',
                          '&:hover': {
                            backgroundColor: '#fff',
                          },
                        }}
                        onClick={() => {
                          dispatch(resetComplianceTemplate());
                          showEditModal(true);
                          handleClose(false);
                          setEditId(complianceDetails && (complianceDetails.data && complianceDetails.data.length > 0) ? complianceDetails.data[0].id : false);
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
                  {customData
                      && customData.actionItems.map(
                        (actions) => allowedOperations.includes(
                          actionCodes[actions.displayname],
                        )
                          && checkActionAllowed(
                            actions.displayname,
                          ) && (
                            <MenuItem
                              sx={{
                                font: 'normal normal normal 15px Suisse Intl',
                              }}
                              id="switchAction"
                              className="pl-2"
                              key={actions.id}
                              onClick={() => switchActionItem(actions)}
                            >
                              <FontAwesomeIcon
                                className="mr-2"
                                icon={faIcons[actions.name]}
                              />
                              {actions.displayname}
                            </MenuItem>
                        ),
                      )}
                </Menu>
              </Box>
              )}
          />
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              height: '100%',
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
              <TabPanel value={value} index={0}>
                <DetailViewLeftPanel
                  panelData={[
                    {
                      header: 'Asset Information',
                      leftSideData:
                          [
                            {
                              property: 'Type',
                              value: getDefaultNoValue(detailedData.type),
                            },
                            {
                              property: 'Applies To',
                              value: getDefaultNoValue(detailedData.applies_to),
                            },
                            {
                              property: appliesToLocation,
                              value: appliesToLocationValue,
                            },
                          ],
                      rightSideData:
                          [
                            {
                              property: 'License Number',
                              value: getDefaultNoValue(detailedData.license_number),
                            },
                            {
                              property: 'Responsible',
                              value: getDefaultNoValue(extractNameObject(detailedData.responsible_id, 'name')),
                            },
                          ],
                    },
                    {
                      header: 'Recurrence Information',
                      leftSideData: [
                        {
                          property: 'Has Expiry ?',
                          value: <span className={detailedData.is_has_expiry ? 'text-success' : 'text-danger'}><FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={detailedData.is_has_expiry ? faCheckCircle : faTimesCircle} /></span>,
                        },
                        {
                          property: 'Next Expiry Date',
                          value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.next_expiry_date, userInfo, 'datetime')),
                        },
                        {
                          property: 'Expiry Schedule',
                          value: <span>
                            {' '}
                            {getDefaultNoValue(detailedData.expiry_schedule)}
                            {getDefaultNoValue(detailedData.expiry_schedule_type)}

                          </span>,
                        },
                      ],
                      rightSideData: [
                        {
                          property: 'Repeat Until',
                          value: getDefaultNoValue(detailedData.repeat_until),
                        },
                        {
                          property: isRepeatShow ? 'End Date' : false,
                          value: getCompanyTimezoneDate(detailedData.end_date, userInfo, 'datetime'),
                        },
                        {
                          property: 'Is Renewed ',
                          value: <span className={detailedData.is_renewed ? 'text-success' : 'text-danger'}><FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={detailedData.is_renewed ? faCheckCircle : faTimesCircle} /></span>,
                        },
                        {
                          property: !detailedData.is_renewed ? 'Renewal Lead Time' : false,
                          value: <span>
                            {' '}
                            {detailedData.renewal_lead_time ? detailedData.renewal_lead_time : 0}
                            {' '}
                            days

                          </span>,
                        },
                        {
                          property: detailedData.is_renewed ? 'Last Renewed by' : false,
                          value: getDefaultNoValue(extractNameObject(detailedData.last_renewed_by, 'name')),
                        },
                        {
                          property: detailedData.is_renewed ? 'Last Renewed On' : false,
                          value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.last_renewed_on, userInfo, 'datetime')),
                        },
                      ],
                    },
                    {
                      header: 'Additional Information',
                      leftSideData: [
                        {
                          property: 'Is Email Info ?',
                          value: <span className={detailedData.is_email_info ? 'text-success' : 'text-danger'}><FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={detailedData.is_email_info ? faCheckCircle : faTimesCircle} /></span>,
                        },
                        {
                          property: 'SLA Status',
                          value: getDefaultNoValue(detailedData.sla_status),
                        },
                        {
                          property: 'Description',
                          value: getDefaultNoValue(detailedData.description),
                        },
                        {
                          property: 'Compliance Info',
                          value: <p
                            className="font-family-tab g m-0 p-0 max-height-300 overflow-auto thin-scrollbar"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(convertUrlsToLinks(detailedData.url_link), { ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'className'] }) }}
                          />,
                        },
                      ],
                      rightSideData: [
                        {
                          property: 'Latest Version',
                          value: getDefaultNoValue(extractNameObject(detailedData.latest_version_id.compliance_obligation_id, 'name')),
                        },
                        {
                          property: 'In Progress Version',
                          value: getDefaultNoValue(extractNameObject(detailedData.in_progress_version_id.compliance_obligation_id, 'name')),
                        },
                        {
                          property: 'Company',
                          value: getDefaultNoValue(extractNameObject(detailedData.company_id, 'name')),
                        },
                      ],
                    },
                  ]}
                />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <ComplianceEvidences ids={getArrayToCommaValues(complianceDetails.data[0].compliance_evidences_ids, 'id')} />
              </TabPanel>
              <TabPanel value={value} index={2}>
                <Logs ids={getArrayToCommaValues(complianceDetails.data[0].compliance_log_ids, 'id')} />
              </TabPanel>
              <TabPanel value={value} index={3}>
                <Documents
                  viewId={detailedData.id}
                  ticketNumber={detailedData.name}
                  resModel={appModels.BULIDINGCOMPLIANCE}
                  appModuleName={appModels.BULIDINGCOMPLIANCE}
                  model={appModels.DOCUMENT}
                  isCreateAllowed={isCreateAllowed}
                  isDownloadAllowed={isDownloadAllowed}
                  isDeleteAllowed={isDeleteAllowed}
                  complianceFormat
                />
              </TabPanel>
              <TabPanel value={value} index={4}>
                <ComplianceFormat />
                <Divider />
              </TabPanel>
            </Box>
          </Box>
        </Box>
      )}
      {complianceDetails && complianceDetails.loading && <Loader />}
      {publishModal && (
      <Publish
        atFinish={() => {
          showPublishModal(false); cancelComplianceState(); setSelectedActions(defaultActionText); setSelectedActionImage('');
        }}
        complianceDetails={complianceDetails}
        publishModal
      />
      )}
      {unpublishModal && (
        <Unpublish
          atFinish={() => {
            showUnpublishModal(false); cancelComplianceState(); setSelectedActions(defaultActionText); setSelectedActionImage('');
          }}
          complianceDetails={complianceDetails}
          unpublishModal
        />
      )}
      {draftModal && (
        <SetToDraft
          atFinish={() => {
            showDraftModal(false); cancelComplianceState(); setSelectedActions(defaultActionText); setSelectedActionImage('');
          }}
          complianceDetails={complianceDetails}
          draftModal
        />
      )}
      {archiveModal && (
        <Archive
          atFinish={() => {
            showArchiveModal(false); cancelComplianceState(); setSelectedActions(defaultActionText); setSelectedActionImage('');
          }}
          complianceDetails={complianceDetails}
          archiveModal
        />
      )}
      {renewalModal
       && (
       <Dialog maxWidth="md" open={createActivityInfo}>
         <DialogHeader title={renewalHeader} onClose={() => { showRenewalModal(false); cancelRenewal(); setSelectedActions(defaultActionText); setSelectedActionImage(''); }} response={createActivityInfo} imagePath={false} />
         <DialogContent>
           <DialogContentText id="alert-dialog-description">
             <Renewal
               detail={complianceDetails}
               buttonName={renewalHeader}
               modalName={appModels.BULIDINGCOMPLIANCE}
               afterReset={() => { showRenewalModal(false); cancelRenewal(); setSelectedActions(defaultActionText); setSelectedActionImage(''); }}
             />
           </DialogContentText>
         </DialogContent>
       </Dialog>
       )}

      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={editModal}
      >
        <DrawerHeader
          headerName="Update Building Compliance"
          imagePath={ComplianceCheck}
          onClose={closeEditModalWindow}
        />
        <CreateCompliance editId={editId} closeModal={closeEditModalWindow} />
      </Drawer>
    </>
  );
};
export default ComplianceDetails;
