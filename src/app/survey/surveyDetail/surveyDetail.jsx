import {
  faCopy,
  faFilePdf,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import chartIcon from '@images/chart.svg';
import survey from '@images/icons/surveyAction.svg';
import ticketIconBlack from '@images/icons/ticketBlack.svg';
import listIcon from '@images/list.svg';
import SurveyIcon from '@images/sideNavImages/survey_black.svg';
import {
  Button,
  Dialog, DialogActions, DialogContent, DialogContentText,
  IconButton, Menu, Divider,
} from '@mui/material';
import Drawer from '@mui/material/Drawer';
import MenuItem from '@mui/material/MenuItem';
import { Box } from '@mui/system';
import CopyUrl from '@shared/copyUrl';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import { Tooltip } from 'antd';
import moment from 'moment-timezone';
import * as PropTypes from 'prop-types';
import QRCode from 'qrcode.react';
import React, { useEffect, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import DetailViewHeader from '../../commonComponents/detailViewHeader';
import DetailViewLeftPanel from '../../commonComponents/detailViewLeftPanel';
import DetailViewTab from '../../commonComponents/detailViewTab';
import DrawerHeader from '../../commonComponents/drawerHeader';
import AuditLog from '../../assets/assetDetails/auditLog';
import AddSurvey from '../addSurvey';

import DialogHeader from '../../commonComponents/dialogHeader';
import { surveyStatusJson } from '../../commonComponents/utils/util';
import {
  resetUpdateWarehouse,
  setInitialValues,
} from '../../inventory/inventoryService';
import {
  getSurveyDetail,
  getSurveyDomains,
  getSurveyLocations,
  getSurveyRecipients,
  getSurveyTenants,
  resetAddSurvey,
  resetDeleteAnswers,
  resetPageData,
  resetStorePages,
  resetStoreQuestions,
  resetUpdateSurvey,
  setActive,
} from '../surveyService';

import {
  TabPanel,
  extractIdObject,
  extractTextObject,
  getColumnArrayById,
  getCompanyTimezoneDate,
  getDefaultNoValue,
  getListOfModuleOperations,
  getPathName,
  savePdfContentData,
  truncate,
} from '../../util/appUtils';

import {
  resetUpdateParts, updatePartsOrder,
} from '../../workorders/workorderService';
import {
  getSelectedDays,
} from '../../preventiveMaintenance/utils/utils';
import actionCodes from '../data/actionCodes.json';
import {
  getRecurrentLabel,
  getTypeLabel,
} from '../utils/utils';
import AnswerDetails from './answerDetails';
import AnswersReport from './answersReport';
import Questions from './questions';

const appConfig = require('../../config/appConfig').default;
const appModels = require('../../util/appModels').default;


const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;
const tabs = ['Survey Overview', 'Questions', 'Audit Logs'];

const checkSurveyStatus = (val) => (
  <Box>
    {surveyStatusJson.map(
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
        </Box>
      ),
    )}
  </Box>
);

const SurveyDetail = (props) => {
  const dispatch = useDispatch();
  const { viewAnswers, viewId } = props;
  const {
    surveyAnswerReport, surveyDetails, surveyStatus, surveyLocations, surveyTenants, surveyDomains, surveyRecipients,
  } = useSelector((state) => state.survey);
  const defaultActionText = 'Survey Actions';
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [changeLocationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const changeLocationDropdownToggle = () => setLocationDropdownOpen(!changeLocationDropdownOpen);
  const [actionId, setActionId] = useState('');
  const [actionValue, setActionValue] = useState('');

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const [actionModal, showActionModal] = useState(false);
  const [modal, setModal] = useState(actionModal);
  const [editId, setEditId] = useState(false);
  const [editModal, showEditModal] = useState(false);
  const [copyModal, showCopyModal] = useState(false);
  const [value, setValue] = useState(0);
  const [editLink, setEditLink] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { updatePartsOrderInfo } = useSelector((state) => state.workorder);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Survey', 'code');
  const isAnswers = allowedOperations.includes(actionCodes['View Answers']);

  const sizeValue = 400;

  const switchStatus = (status, statusName) => {
    setActionId(status);
    setSelectedActions(statusName);
    setActionValue(statusName);
    showActionModal(true);
    handleClose();
  };

  const [viewAnswerss, setViewAnswers] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [answerModal, setAnswerModal] = useState(false);

  const cancelStateChange = () => {
    dispatch(resetUpdateParts());
  };
  const [copySuccess, setCopySuccess] = useState(false);
  const [summaryModal, showSummaryModal] = useState(false);
  const [pdfLoader, setPDFLoader] = useState(false);
  const [exportType, setExportType] = useState();
  const [pdfFileName, setPdfFileName] = useState();

  const detailData = surveyDetails && (surveyDetails.data && surveyDetails.data.length > 0) ? surveyDetails.data[0] : '';
  const loading = surveyDetails && surveyDetails.loading;
  const stageId = detailData.stage_id ? extractIdObject(detailData.stage_id) : '';

  const { actionResultInfo } = useSelector((state) => state.inventory);
  const isResult = actionResultInfo && actionResultInfo.data && (actionResultInfo.data.data || actionResultInfo.data.status);

  const handleAnswerView = () => {
    dispatch(setActive('Today'));
    setAnswerModal(true);// if (afterReset) afterReset();
  };

  const locationOptions = detailData && detailData.location_ids && detailData.location_ids.length > 0 ? detailData.location_ids : [];
  const tenantOptions = detailData && detailData.tenant_ids && detailData.tenant_ids.length > 0 ? detailData.tenant_ids : [];
  const recipientsOptions = detailData && detailData.recipients_ids && detailData.recipients_ids.length > 0 ? detailData.recipients_ids : [];

  useEffect(() => {
    if (locationOptions && locationOptions.length) {
      dispatch(getSurveyLocations(appModels.LOCATION, locationOptions));
    }
  }, [detailData]);

  useEffect(() => {
    if (tenantOptions && tenantOptions.length) {
      dispatch(getSurveyTenants(appModels.PARTNER, tenantOptions));
    }
  }, [detailData]);

  useEffect(() => {
    if (recipientsOptions && recipientsOptions.length) {
      dispatch(getSurveyRecipients(appModels.PARTNER, recipientsOptions));
    }
  }, [detailData]);

  useEffect(() => {
    if (detailData && detailData.allowed_domains_host_ids) {
      dispatch(getSurveyDomains('survey.host.domains', detailData.allowed_domains_host_ids));
    }
  }, [detailData]);

  useEffect(() => {
    const questionsLength = surveyAnswerReport && surveyAnswerReport.data && surveyAnswerReport.data.survey_dict
      && surveyAnswerReport.data.survey_dict.page_ids.length && surveyAnswerReport.data.survey_dict.page_ids[0] && surveyAnswerReport.data.survey_dict.page_ids[0].question_ids && surveyAnswerReport.data.survey_dict.page_ids[0].question_ids.length;
    setTimeout(() => {
      setPDFLoader(false);
    }, questionsLength * 1000);
  }, [pdfLoader]);

  useEffect(() => {
    if (exportType === 'pdf') {
      const surveyTitle = surveyDetails && (surveyDetails.data && surveyDetails.data.length > 0) ? truncate(surveyDetails.data[0].title, 35) : 'Survey';
      savePdfContentData(`${surveyTitle}-Answer Summary Report `, 'Survey-Answers-Summary', 'answer-elements', 'tables', 'print-survey-report-pdf', surveyAnswerReport, companyName);
    }
    setExportType();
    setPDFLoader(false);
  }, [exportType]);

  const onReset = () => {
    dispatch(setActive('This month'));
  };

  const handleQrPrint = () => {
    setTimeout(() => {
      const div = document.getElementById('print_qr_survey_link');
      // Create a window object.
      const win = window.open('', '_blank'); // Open the window. Its a popup window.
      document.title = 'QR Code';
      win.document.write(div.innerHTML); // Write contents in the new window.
      win.document.close();
      win.print();
    }, 500);
  };

  /* function checkActionAllowed(actionName) {
    let allowed = true;
    const whState = surveyDetails && surveyDetails.data ? surveyDetails.data[0].active : '';
    if (whState === 'done') {
      allowed = false;
    }
    if (actionName === 'Start' && (whState === 'cancel' || whState === 'confirm' || !isStartable)) {
      allowed = false;
    }
    if (actionName === 'Validate' && (whState === 'cancel' || whState === 'draft' || !isValidatable)) {
      allowed = false;
    }
    if (actionName === 'Set to Draft' && (whState === 'cancel' || whState === 'draft')) {
      allowed = false;
    }
    return allowed;
  } */

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const onUpdateReset = () => {
    showEditModal(false);
    dispatch(resetUpdateSurvey());
    dispatch(resetAddSurvey());
    dispatch(resetStorePages([]));
    dispatch(resetPageData([]));
    dispatch(resetDeleteAnswers());
    dispatch(resetStoreQuestions());
    dispatch(resetUpdateWarehouse());
    dispatch(getSurveyDetail(detailData.id, appModels.SURVEY));
  };

  const onUpdateClose = () => {
    showEditModal(false);
    dispatch(resetUpdateSurvey());
    dispatch(resetAddSurvey());
    dispatch(resetStorePages([]));
    dispatch(resetPageData([]));
    dispatch(resetDeleteAnswers());
    dispatch(resetStoreQuestions());
    dispatch(resetUpdateWarehouse());
  };

  const toggle = () => {
    setAnchorEl(null);
    setModal(!modal);
    showActionModal(false);
    dispatch(resetUpdateParts());
    dispatch(resetUpdateSurvey());
    dispatch(getSurveyDetail(detailData.id, appModels.SURVEY));
  };

  const toggleClose = () => {
    setAnchorEl(null);
    setModal(!modal);
    dispatch(resetUpdateParts());
    dispatch(resetUpdateSurvey());
    showActionModal(false);
  };

  const handleStateChange = (id, status) => {
    setAnchorEl(null);
    const values = { stage_id: status };
    dispatch(updatePartsOrder(id, values, appModels.SURVEY));
  };

  const getDay = (rule) => {
    let day = '';
    if (rule !== 'weekly') {
      day = getDefaultNoValue(detailData.day);
    } else {
      day = getSelectedDays(detailData.mo, detailData.tu, detailData.we, detailData.th, detailData.fr, detailData.sa, detailData.su).length > 0
        ? getSelectedDays(detailData.mo, detailData.tu, detailData.we, detailData.th, detailData.fr, detailData.sa, detailData.su) : '';
    }
    return day;
  };

  function handlePdfDownload(detailData) {
    setPDFLoader(true);
    setExportType('pdf');
    setPdfFileName(detailData.title);
  }
  const uuid = detailData.uuid ? detailData.uuid : false;
  const currentStatus = detailData && detailData.stage_id && detailData.stage_id.length > 0 ? detailData.stage_id[1] : false;

  const surveyRequestData = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0] : '';
  const onAnswerReset = () => {
    setAnswerModal(false);
  };
  const onSummaryReset = () => {
    showSummaryModal(false);
  };

  function copyToClipboard(uuid, name) {
    const isBasePath = !!window.location.pathname.includes('/v3');
    const val = isBasePath ? `${WEBAPPAPIURL}${name}/v3/${uuid}` : `${WEBAPPAPIURL}${name}/${uuid}`;
    const copyText = document.getElementById('myInput');
    copyText.select();
    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.value);
    // Alert the copied text
  }

  const isStatusEditable = surveyDetails
    && surveyDetails.data
    && surveyDetails.data.length
    && surveyDetails.data[0].stage_id
    && surveyDetails.data[0].stage_id.length > 0
    && surveyDetails.data[0].stage_id[1] === 'Draft';

  return (
    <>
      {loading && <Loader />}
      {detailData && (
        <Box>

          <DetailViewHeader
            mainHeader={getDefaultNoValue((detailData.title))}
            status={
                detailData.stage_id && detailData.stage_id.length
                  ? checkSurveyStatus(detailData.stage_id[1])
                  : '-'
              }
            subHeader={(
              <>
                {detailData.create_date
                    && userInfo.data
                    && userInfo.data.timezone
                  ? moment
                    .utc(detailData.create_date)
                    .local()
                    .tz(userInfo.data.timezone)
                    .format('yyyy MMM Do, hh:mm A')
                  : '-'}
                {' '}

              </>
              )}
            actionComponent={(
              <Box>
                {viewAnswers && (currentStatus !== 'Draft') && surveyDetails && !surveyDetails.loading && (
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
                  onClick={() => { handlePdfDownload(detailData); }}
                >
                  <FontAwesomeIcon className="mr-2" color="primary" size="sm" icon={faFilePdf} />
                  <span className="mr-2">PDF Download</span>
                  {pdfLoader === true ? (
                    <Spinner size="sm" color="light" className="mr-2" />
                  ) : ('')}
                </Button>
                )}

                {!viewAnswers && surveyDetails && !surveyDetails.loading && (
                <>
                  {isAnswers && (currentStatus !== 'Draft') && (
                  <>
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
                      onClick={() => { dispatch(setActive('Today')); showSummaryModal(true); }}
                    >
                      <img src={chartIcon} className="cursor-pointer mr-1" alt="close" aria-hidden="true" height={18} width={18} />
                      <span className="mr-2">Answers Summary</span>
                    </Button>

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
                      onClick={() => handleAnswerView()}
                    >
                      <img src={listIcon} className="cursor-pointer mr-1" alt="close" aria-hidden="true" height={15} width={15} />
                      <span className="mr-2">View Answers</span>
                    </Button>

                  </>
                  )}
                  {(currentStatus !== 'Draft' && currentStatus !== 'Closed' && !detailData.is_send_email) && (
                  <Tooltip placement="bottom" title={copySuccess ? 'Copied!' : 'Copy URL'}>
                    <input type="hidden" value={`${WEBAPPAPIURL}survey/${uuid}`} id="myInput" />
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
                      onClick={() => showCopyModal(true)}
                    >
                      <FontAwesomeIcon className="mr-2" color="primary" size="sm" icon={faCopy} />
                      <span className="mr-2">Copy URL</span>
                    </Button>
                  </Tooltip>
                  )}
                </>
                )}

                {surveyDetails
                    && !surveyDetails.loading && isStatusEditable
                    && allowedOperations.includes(actionCodes['Edit Survey']) && (
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
                          showEditModal(true);
                          handleClose(false);
                          setEditId(detailData.id);
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

                  {surveyStatus && surveyStatus.data && surveyStatus.data.length
                      && surveyStatus.data.map(
                        (actions) => (
                          <MenuItem
                            sx={{
                              font: 'normal normal normal 15px Suisse Intl',
                            }}
                            id="switchLocation"
                            className="pl-2"
                            key={actions.id}
                            onClick={() => switchStatus(actions.id, actions.name)}
                            disabled={stageId === actions.id}
                          >
                            {actions.name === 'Published' ? 'Publish' : actions.name}
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
                      header: 'GENERAL INFORMATION',
                      leftSideData:
                          [
                            {
                              property: 'Created On',
                              value: getDefaultNoValue(getCompanyTimezoneDate(detailData.create_date, userInfo, 'datetime')),
                            },
                            {
                              property: 'Reviewer Email',
                              value: <span className="text-capitalize">{getDefaultNoValue(detailData.has_reviwer_email)}</span>,
                            },
                            {
                              property: 'Disclaimer',
                              value: getDefaultNoValue(detailData.has_disclaimer),
                            },
                            {
                              property: 'Feedback Text',
                              value: getDefaultNoValue(detailData.feedback_text),
                            },
                            {
                              property: 'Time Taken for Survey (in Mins)',
                              value: (detailData.survey_time),
                            },
                            {
                              property: 'Tenant',
                              value: getDefaultNoValue(detailData.has_tenant),
                            },
                          ],
                      rightSideData:
                          [
                            {
                              property: 'Reviewers Name',
                              value: getDefaultNoValue(detailData.has_reviwer_name),
                            },
                            {
                              property: 'Reviewer Mobile',
                              value: getDefaultNoValue(detailData.has_reviwer_mobile),
                            },
                            {
                              property: 'Disclaimer Text',
                              value: getDefaultNoValue(detailData.disclaimer_text),
                            },
                            {
                              property: 'Total Score in Survey',
                              value: (detailData.total_score_survey),
                            },
                            {
                              property: 'Allowed Domains',
                              value: surveyDomains && surveyDomains.data && surveyDomains.data.length > 0 ? getColumnArrayById(surveyDomains.data, 'name').toString() : '-',
                            },
                            {
                              property: 'Successful Return to Home Page (in Seconds)',
                              value: parseInt(detailData.successful_homepage_return_time),
                            },
                          ],
                    },

                    {
                      header: 'OTHER INFORMATION',
                      leftSideData: [
                        {
                          property: 'Description',
                          value: getDefaultNoValue(detailData.description),
                        },
                        {
                          property: 'Requires Verification by OTP (SMS/Email)',
                          value: (detailData.requires_verification_by_otp ? <span className="text-capitalize">Yes</span> : <span className="text-capitalize">No</span>),
                        },
                        detailData.tenant_ids && detailData.tenant_ids.length > 0 && (
                          {
                            property: 'Tenants',
                            value: getDefaultNoValue(getPathName(surveyTenants && surveyTenants.data ? surveyTenants.data : [], 'display_name')),
                          }
                        ),
                        {
                          property: 'Send Emails',
                          value: (detailData.is_send_email ? <span className="text-capitalize">Yes</span> : <span className="text-capitalize">No</span>),
                        },
                        {
                          property: detailData.is_send_email ? 'Repeats' : '',
                          value: (detailData.is_repeats ? 'Yes' : 'No'),
                        },
                        {
                          property: detailData.is_send_email ? 'Start Date' : '',
                          value: getCompanyTimezoneDate(
                            detailData.starts_on,
                            userInfo,
                            'date',
                          ),
                        },
                        {
                          property: detailData.is_send_email ? 'Deadline (Days)' : '',
                          value: getDefaultNoValue(detailData.deadline),
                        },

                        {
                          property: detailData.is_send_email ? 'Message for Survey Answered Already' : '',
                          value: getDefaultNoValue(detailData.answered_already),
                        },
                        {
                          property: detailData.is_send_email ? 'Escalation Policy' : '',
                          value: getDefaultNoValue(extractTextObject(detailData.escalation_policy_id)),
                        },
                        {
                          property: detailData.is_send_email ? 'Campaign Email' : '',
                          value: <span className="text-capitalize">{getDefaultNoValue(extractTextObject(detailData.campaign_email_id))}</span>,
                        },
                      ],
                      rightSideData: [
                        {
                          property: 'Type',
                          value: getDefaultNoValue(getTypeLabel(detailData.category_type)),
                        },
                        {
                          property: detailData.category_type === 'e' ? 'Equipment' : '',
                          value: getDefaultNoValue(extractTextObject(detailData.equipment_id)),
                        },
                        detailData.category_type !== 'e' && !detailData.is_show_all_spaces && (
                          {
                            property: detailData.category_type !== 'e' ? 'Space' : '',
                            value: getDefaultNoValue(extractTextObject(detailData.location_id)),
                          }
                        ),
                        detailData.category_type !== 'e' && !detailData.is_show_all_spaces && (
                          {
                            property: detailData.category_type !== 'e' ? 'Locations' : '',
                            value: getDefaultNoValue(getPathName(surveyLocations && surveyLocations.data ? surveyLocations.data : [], 'path_name')),
                          }
                        ),
                        detailData.category_type !== 'e' && (
                          {
                            property: ' Show All Spaces',
                            value: detailData.is_show_all_spaces ? 'Yes' : 'No',
                          }
                        ),
                        detailData.category_type !== 'e' && (
                          {
                            property: 'Space Level',
                            value: detailData.space_level ? parseInt(detailData.space_level) : 0,
                          }
                        ),
                        {
                          property: detailData.is_send_email ? 'Repeats On' : '',
                          value: `${getDefaultNoValue(getRecurrentLabel(detailData.recurrent_rule))} ${getDay(detailData.recurrent_rule) !== '' ? ' - ' : ''} ${getDay(detailData.recurrent_rule)}`,
                        },
                        {
                          property: detailData.is_send_email ? 'Next Execution Date' : '',
                          value: getCompanyTimezoneDate(
                            detailData.next_execution_date,
                            userInfo,
                            'date',
                          ),
                        },
                        {
                          property: detailData.is_send_email ? 'Message for Deadline Elapsed' : '',
                          value: getDefaultNoValue(detailData.deadline_elapsed),
                        },
                        {
                          property: detailData.is_send_email ? 'Reminder Email' : '',
                          value: <span className="text-capitalize">{getDefaultNoValue(extractTextObject(detailData.reminder_email_id))}</span>,
                        },
                        {
                          property: detailData.is_send_email ? 'Recipients' : '',
                          value: getDefaultNoValue(getPathName(surveyRecipients && surveyRecipients.data ? surveyRecipients.data : [], 'display_name')),
                        },
                      ],
                    },

                  ]}
                />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <Questions detail={detailData} />
              </TabPanel>
              <TabPanel value={value} index={2}>
                {/* <Comments /> */}
                <AuditLog ids={detailData.message_ids} />
                <Divider />
              </TabPanel>
            </Box>

            {/* <Box
                sx={{
                  width: "25%",
                  height: "100%",
                  backgroundColor: "#F6F8FA",
                }}
              >
                <DetailViewRightPanel
                  panelOneHeader="TITLE"
                  panelOneLabel={getDefaultNoValue((detailData.title))}
                  //                  panelOneValue1={getDefaultNoValue((detailData.display_name))}
                  // panelOneValue2={getDefaultNoValue(detailData.mobile)}
                  //   panelThreeHeader="Inventory Information"
                  panelThreeData={[

                    {
                      header: "CATEGORY TYPE",
                      value: getTypeLabel(detailData.category_type),
                    },
                    {
                      header: "STATUS",
                      value:
                        detailData.stage_id && detailData.stage_id.length
                          ? checkSurveyStatus(detailData.stage_id[1])
                          : "-",
                    },

                  ]}
                />
              </Box> */}
          </Box>
          <Drawer
            PaperProps={{
              sx: { width: '30%' },
            }}
            anchor="right"
            open={copyModal}
          >
            <DrawerHeader
              headerName="Copy URL"
              imagePath={false}
              onClose={() => showCopyModal(false)}
            />
            <CopyUrl
              uuid={uuid}
              spaceOptions={surveyLocations && surveyLocations.data ? surveyLocations.data : []}
              loading={surveyLocations && surveyLocations.loading}
              moduleName="survey"
              paramName="lid"
              detailData={surveyDetails && surveyDetails.data && surveyDetails.data.length ? surveyDetails.data[0] : []}
              isShow={copyModal ? Math.random() : false}
              fieldName="Location"
            />
          </Drawer>
          <Drawer
            PaperProps={{
              sx: { width: '85%' },
            }}
            anchor="right"
            open={editModal}
          >

            <DrawerHeader
              headerName="Update Survey"
              imagePath={SurveyIcon}
              onClose={() => { onUpdateClose(); }}
            />
            <AddSurvey editId={editId} afterReset={() => { onUpdateReset(); }} />
          </Drawer>

          <Dialog maxWidth="md" open={actionModal}>
            <DialogHeader title={`${actionValue === 'Published' ? 'Publish' : actionValue}`} response={updatePartsOrderInfo} onClose={toggleClose} imagePath={ticketIconBlack} />
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#F6F8FA',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10%',
                    fontFamily: 'Suisse Intl',
                  }}
                >

                  <Card className="border-5 mt-3 ml-4 mb-4 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
                    <CardBody data-testid="success-case" className="bg-lightblue p-3">
                      <Row>
                        <Col md="3" xs="3" sm="3" lg="3">
                          <img src={survey} alt="asset" className="mt-1" width="50" height="45" />
                        </Col>
                        <Col md="8" xs="8" sm="8" lg="8">
                          <Row>
                            <h6 className="mb-1">
                              {getDefaultNoValue(detailData.title)}
                            </h6>
                          </Row>
                          <Row>
                            <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                              <span className="font-weight-800 font-side-heading mr-1">
                                Type :
                              </span>
                              <span className="font-weight-400">
                                {getDefaultNoValue(getTypeLabel(detailData.category_type))}
                              </span>
                            </Col>
                          </Row>
                          <Row>
                            <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                              <span className="font-weight-800 font-side-heading mr-1">
                                Created On :
                              </span>
                              <span className="font-weight-400">
                                {getDefaultNoValue(getCompanyTimezoneDate(detailData.create_date, userInfo, 'datetime'))}
                              </span>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </CardBody>

                  </Card>
                  <Row className="justify-content-center">
                    {updatePartsOrderInfo && updatePartsOrderInfo.data && !loading && (
                    <SuccessAndErrorFormat response={updatePartsOrderInfo} successMessage={`This survey has been ${actionValue} successfully..`} />
                    )}
                    {updatePartsOrderInfo && updatePartsOrderInfo.err && (
                    <SuccessAndErrorFormat response={updatePartsOrderInfo} />
                    )}
                    {updatePartsOrderInfo && updatePartsOrderInfo.loading && (
                    <Loader />
                    )}
                  </Row>
                </Box>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              {updatePartsOrderInfo && updatePartsOrderInfo.data
                ? ''
                : (
                  <Button
                    type="button"
                    variant="contained"
                    disabled={updatePartsOrderInfo && updatePartsOrderInfo.loading}
                    onClick={() => handleStateChange(detailData.id, actionId)}
                  >
                    {actionValue === 'Published' ? 'Publish' : actionValue}
                  </Button>
                )}
              {(updatePartsOrderInfo && updatePartsOrderInfo.data
                  && (
                    <Button
                      type="button"
                      variant="contained"
                      onClick={toggle}
                    >
                      Ok
                    </Button>
                  )
                )}
            </DialogActions>
          </Dialog>

          <Drawer
            PaperProps={{
              sx: { width: '95%' },
            }}
            anchor="right"
            open={answerModal}
          >
            <DrawerHeader
              headerName={`View Answers - ${surveyDetails && surveyDetails.data && surveyDetails.data.length > 0
                ? truncate(surveyDetails.data[0].title, 35)
                : ''}`}
              onClose={() => { onAnswerReset(); }}
            />

            <AnswerDetails detailData={detailData} afterReset={() => dispatch(setInitialValues(false, false, false, false))} closeDrawer={() => { setAnswerModal(false); setViewModal(true); }} viewId={editId} />
          </Drawer>
          <Drawer
            PaperProps={{
              sx: { width: '95%' },
            }}
            anchor="right"
            open={summaryModal}
          >
            <DrawerHeader
              headerName={`Answers Summary - ${surveyDetails && surveyDetails.data && surveyDetails.data.length > 0
                ? truncate(surveyDetails.data[0].title, 35)
                : ''}`}
              onClose={() => { onSummaryReset(); }}
              detailData={detailData}
            />
            <AnswersReport viewId={editId} detailData={detailData} />
          </Drawer>
          <div id="print_qr_survey_link" style={{ display: 'none' }}>
            <div style={{ textAlign: 'center' }}>
              <QRCode value={`${WEBAPPAPIURL}survey/${uuid}`} renderAs="svg" includeMargin level="H" size={sizeValue} />
              <p>
                Link :
                {' '}
                {`${WEBAPPAPIURL}survey/${uuid}`}
              </p>
            </div>
          </div>
          <iframe name="print_qr_survey_link_frame" title="Export" id="print_qr_survey_link_frame" width="0" height="0" frameBorder="0" src="about:blank" />
        </Box>
      )}
    </>
  );
};

SurveyDetail.propTypes = {
  viewAnswers: PropTypes.bool.isRequired,
};

export default SurveyDetail;
