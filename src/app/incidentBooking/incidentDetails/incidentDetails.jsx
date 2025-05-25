import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/system';
import {
  IconButton, Typography, Button, Menu,
} from '@mui/material';
import { BsThreeDotsVertical } from 'react-icons/bs';
import MenuItem from '@mui/material/MenuItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope, faCheckCircle, faSave, faTimesCircle,
  faFile, faStopCircle, faChartArea, faInfoCircle, faSignOut, faFilePdf,
} from '@fortawesome/free-solid-svg-icons';
import Drawer from '@mui/material/Drawer';
import {
  Alert,
} from 'reactstrap';
import JsZip from 'jszip';
import FileSaver from 'file-saver';

import Loader from '@shared/loading';
import TrackerCheck from '@images/sideNavImages/incident_black.svg';
import MuiTooltip from '@shared/muiTooltip';
import ErrorContent from '@shared/errorContent';

import moment from 'moment-timezone';
import AuditLog from '../../commonComponents/auditLogs';
import LogNotes from '../incidentDetail/logNotes';
import Documents from '../../commonComponents/documents';
import DetailViewHeader from '../../commonComponents/detailViewHeader';
import DetailViewTab from '../../commonComponents/detailViewTab';
import DetailViewRightPanel from '../../commonComponents/detailViewRightPanel';
import DetailViewLeftPanel from '../../commonComponents/detailViewLeftPanel';
import {
  hxincidentStatusJson,
  detailViewHeaderClass,
} from '../../commonComponents/utils/util';
import DrawerHeader from '../../commonComponents/drawerHeader';
import {
  getDefaultNoValue,
  getListOfOperations,
  extractNameObject,
  getCompanyTimezoneDate,
  TabPanelNoScroll,
  getColumnArrayById,
  getLocalTime,
  generateErrorMessage,
} from '../../util/appUtils';
import { getSLALabel } from '../../helpdesk/utils/utils';
import Tasks from '../incidentDetail/tasks';
import Injuries from '../incidentDetail/injuries';
import Checklists from '../incidentDetail/checklists';
import CorrectiveAction from '../incidentDetail/correctiveAction';
import SlaMatrix from '../incidentDetail/slaMatrix';
import customData from '../data/customData.json';
import Action from '../incidentDetail/actionItems/actions';
import actionCodes from '../data/actionCodes.json';
import AddIncident from '../addIncident';
import { getMultiModelDocumentsData, getEquipmentDocument } from '../../helpdesk/ticketService';
import InvestigationReport from '../incidentDetail/reports/investigationReport';
import LessonsLearnt from '../incidentDetail/reports/lessonsLearnt';
import {
  getIncidentDetail,
} from '../ctService';

const appModels = require('../../util/appModels').default;

const faIcons = {
  CANCEL: faTimesCircle,
  RESOLVED: faEnvelope,
  START: faCheckCircle,
  ACKNOWLEDGE: faSave,
  VALIDATED: faFile,
  PAUSE: faStopCircle,
  RESUME: faCheckCircle,
  ANALYSIS: faChartArea,
  RECOMMEND: faCheckCircle,
  SIGNOFF: faSignOut,
  INVREPORT: faFilePdf,
  INVREPORTLEARN: faFilePdf,
};

const IncidentDetails = ({
  offset, editId, isDashboard, setEditId, onViewReset, questionValuesView, setQuestionsView, isSave, setSave, isCancel, setCancel
}) => {
  const zip = JsZip();
  const tabs = ['Summary', 'RCFA', 'Recommendations', 'Validation', 'Attachments', 'Other Info'];
  const defaultActionText = 'Incident Actions';
  const [tabsList, setTabsList] = useState(tabs);
  const [tabValue, setTabValue] = useState('Summary');
  const [editLink, setEditLink] = useState(false);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState(0);
  const [actionModal, showActionModal] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);


  const [selectedActionImage, setSelectedActionImage] = useState('');

  const dispatch = useDispatch();
  const {
    incidentHxCount, incidentHxInfo, incidentHxCountLoading, hxIncidentConfig,
    incidentHxFilters, updateIncidentNoInfo, incidentDetailsInfo, addIncidentInfo, updateIncidentInfo, incidentHxExportInfo,
  } = useSelector((state) => state.hxIncident);
  const { multiDocumentsInfo, equipmentDocuments } = useSelector((state) => state.ticket);

  const detailedData = incidentDetailsInfo && (incidentDetailsInfo.data && incidentDetailsInfo.data.length > 0) ? incidentDetailsInfo.data[0] : '';
  const configData = hxIncidentConfig && hxIncidentConfig.data && hxIncidentConfig.data.length ? hxIncidentConfig.data[0] : false;
  const inspDeata = incidentDetailsInfo && incidentDetailsInfo.data && incidentDetailsInfo.data.length ? incidentDetailsInfo.data[0] : false;
  const allowedOperations = getListOfOperations(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'code',
  );
  const isInvReport = allowedOperations.includes(actionCodes['Investigation Report']);

  const isLL = allowedOperations.includes(actionCodes['Lessons Learnt Report']);

  function isValidateUser() {
    let res = false;
    const userRoleId = userInfo && userInfo.data && userInfo.data.user_role_id ? userInfo.data.user_role_id : false;
    if (userRoleId && configData.validator_role_id && configData.validator_role_id.id && userRoleId === configData.validator_role_id.id) {
      res = true;
    }
    return res;
  }

  function isAcknowledgeUser() {
    let res = false;
    const userRoleId = userInfo && userInfo.data && userInfo.data.user_role_id ? userInfo.data.user_role_id : false;
    if (userRoleId && configData.acknowledge_role_id && configData.acknowledge_role_id.id && userRoleId === configData.acknowledge_role_id.id) {
      res = true;
    }
    return res;
  }

  function isValidUser() {
    let res = false;
    const userRoleId = userInfo && userInfo.data && userInfo.data.user_role_id ? userInfo.data.user_role_id : false;
    if (userRoleId && inspDeata.probability_id && inspDeata.probability_id.remediate_authority_id && inspDeata.probability_id.remediate_authority_id.id && userRoleId === inspDeata.probability_id.remediate_authority_id.id) {
      res = true;
    }
    return res;
  }

  useEffect(() => {
    if (updateIncidentInfo && updateIncidentInfo.data && inspDeata && inspDeata.id && isDashboard) {
      dispatch(getIncidentDetail(inspDeata.id, appModels.HXINCIDENT));
    }
  }, [updateIncidentInfo]);


  const checkIncidentStatus = (val) => (
    <Box>
      {hxincidentStatusJson.map(
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
            {status.text}
          </Box>
        ),
      )}
    </Box>
  );
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(event.target.innerText);
    setValue(newValue);
  };
  const open = Boolean(anchorEl);
  const isOtherInfo = allowedOperations.includes(actionCodes['Other Info']);

  /* useEffect(() => {
         if (detailedData) {
             if (detailedData.state === 'Reported' || detailedData.state === 'Acknowledged' || detailedData.state === 'Work in Progress') {
                 setTabsList(tabs.filter((item) => item !== 'Recommendations' && item !== 'Validation'));
                 if (detailedData.state === 'Reported' && configData.is_acknowledge_required) {
                     setTabsList(tabs.filter((item) => item !== 'RCFA' && item !== 'Recommendations' && item !== 'Validation'));
                 }
             } else if (detailedData.state !== 'Resolved' && detailedData.state !== 'Validated') {
                 setTabsList(tabs.filter((item) => item !== 'Validation'));
             } else if (detailedData.state === 'Resolved' && configData.is_validation_requiredN === false) {
                 setTabsList(tabs.filter((item) => item !== 'Validation'));
             } else {
                 setTabsList(tabs);
             }
         }
     }, [detailedData]); */

  useEffect(() => {
    if (detailedData) {
      if (detailedData.state === 'Reported' || detailedData.state === 'Acknowledged' || detailedData.state === 'Work in Progress') {
        setTabsList(tabs.filter((item) => item !== 'Recommendations' && item !== 'Validation'));
        if (detailedData.state === 'Reported' && configData.is_acknowledge_required) {
          setTabsList(tabs.filter((item) => item !== 'RCFA' && item !== 'Recommendations' && item !== 'Validation'));
        }
      } else if (detailedData.state === 'Analyzed' || detailedData.state === 'Remediated') {
        setTabsList(tabs.filter((item) => item !== 'Validation'));
        if (!detailedData.probability_id.is_analysis_required) {
          setTabsList(tabs.filter((item) => item !== 'Recommendations' && item !== 'Validation'));
        }
      } else if (detailedData.state === 'Resolved' && (!configData.is_validation_required || !(detailedData.validate_checklist_ids && detailedData.validate_checklist_ids.length))) {
        setTabsList(tabs.filter((item) => item !== 'Validation'));
        if (!detailedData.probability_id.is_analysis_required) {
          setTabsList(tabs.filter((item) => item !== 'Recommendations' && item !== 'Validation'));
        }
      } else if ((detailedData.state === 'Validated' || detailedData.state === 'Signed off' || detailedData.state === 'Cancelled') && !detailedData.probability_id.is_analysis_required) {
        setTabsList(tabs.filter((item) => item !== 'Recommendations'));
        if (!configData.is_validation_required || !(detailedData.validate_checklist_ids && detailedData.validate_checklist_ids.length)) {
          setTabsList(tabs.filter((item) => item !== 'Recommendations' && item !== 'Validation'));
        }
      } else if ((detailedData.state === 'Paused')) {
        setTabsList(tabs.filter((item) => item !== 'Validation'));
      } else {
        setTabsList(tabs);
      }
    }
  }, [detailedData, hxIncidentConfig]);

  useEffect(() => {
    if (!isOtherInfo) {
      setTabsList(tabsList.filter((item) => item !== 'Other Info'));
    } else {
      setTabsList(tabsList);
    }
  }, [userRoles]);

  useEffect(() => {
    if (detailedData) {
      if ((detailedData.state === 'Reported' && !configData.is_acknowledge_required) || detailedData.state === 'Acknowledged') {
        const index = tabsList.findIndex((element) => {
          if (element === 'RCFA') {
            return true;
          }
        });
        setValue(1);
        setTabValue('RCFA');
      } else if ((detailedData.state === 'Analyzed' || detailedData.state === 'Remediated') && detailedData.probability_id.is_analysis_required) {
        const index = tabsList.findIndex((element) => {
          if (element === 'Recommendations') {
            return true;
          }
        });
        setValue(2);
        setTabValue('Recommendations');
      } else if (detailedData.state === 'Resolved' && configData.is_validation_required && detailedData.validate_checklist_ids && detailedData.validate_checklist_ids.length) {
        const index = tabsList.findIndex((element) => {
          if (element === 'Validation') {
            return true;
          }
        });
        setValue(3);
        setTabValue('Validation');
      } else {
        const index = tabsList.findIndex((element) => {
          if (element === 'Summary') {
            return true;
          }
        });
        setTabValue('Summary');
        setValue(0);
      }
    }
  }, [detailedData, hxIncidentConfig]);

  const [actionMethod, setActionMethod] = useState(false);
  const [actionButton, setActionButton] = useState(false);
  const [actionMsg, setActionMsg] = useState(false);
  const [statusName, setStatusName] = useState(false);

  function exportImages() {
    // Generate a directory within the Zip file structure
    const img = zip.folder('attachments');

    const multiDocuments = multiDocumentsInfo && multiDocumentsInfo.data && !multiDocumentsInfo.loading ? multiDocumentsInfo.data.filter((item) => item.datas) : [];
    const singelDoc = equipmentDocuments && equipmentDocuments.data && !equipmentDocuments.loading ? equipmentDocuments.data.filter((item) => item.datas) : [];

    const multipleDocuments = [...singelDoc, ...multiDocuments];
    // Add a file to the directory, in this case an image with data URI as contents
    multipleDocuments.forEach((blob, i) => {
      img.file(blob.datas_fname, blob.datas, { base64: true });
    });

    const zipName = detailedData ? detailedData.name : false;

    // Generate the zip file asynchronously
    zip.generateAsync({ type: 'blob' })
      .then((content) => {
        // Force down of the Zip file
        FileSaver.saveAs(content, `${zipName}_Investiogation_Report_on_${getLocalTime(new Date())}.zip`);
      });
  }

  function exportImages1() {
    // Generate a directory within the Zip file structure
    const img = zip.folder('attachments');

    const multiDocuments = multiDocumentsInfo && multiDocumentsInfo.data && !multiDocumentsInfo.loading ? multiDocumentsInfo.data.filter((item) => item.datas) : [];

    // Add a file to the directory, in this case an image with data URI as contents
    multiDocuments.forEach((blob, i) => {
      img.file(blob.datas_fname, blob.datas, { base64: true });
    });

    const zipName = detailedData ? detailedData.name : false;

    // Generate the zip file asynchronously
    zip.generateAsync({ type: 'blob' })
      .then((content) => {
        // Force down of the Zip file
        FileSaver.saveAs(content, `${zipName}_Lessons_Learnt_Report_on_${getLocalTime(new Date())}.zip`);
      });
  }

  const handleAnswerPrint = (htmlId, fileName) => {
    const content = document.getElementById(htmlId);
    document.title = fileName;
    const pri = document.getElementById('print_frame').contentWindow;
    pri.document.open();
    pri.document.write(content.innerHTML);
    pri.document.close();
    setTimeout(() => {
      pri.focus();
      pri.print();
    }, 1000);
    closeAction();
  };

  const handleAnswerLassonPrint = (htmlId, fileName) => {
    const content = document.getElementById(htmlId);
    document.title = fileName;
    const pri = document.getElementById('print_frame_learn').contentWindow;
    pri.document.open();
    pri.document.write(content.innerHTML);
    pri.document.close();
    setTimeout(() => {
      pri.focus();
      pri.print();
    }, 1000);
    closeAction();
  };

  useEffect(() => {
    if (selectedActions === 'Print Investigation Report' && multiDocumentsInfo && !multiDocumentsInfo.loading && (multiDocumentsInfo.data || multiDocumentsInfo.err) && equipmentDocuments && !equipmentDocuments.loading && (equipmentDocuments.data || equipmentDocuments.err)) {
      handleAnswerPrint('print-invest-report', 'Investigation Report');
      exportImages();
    }
  }, [multiDocumentsInfo, equipmentDocuments]);

  useEffect(() => {
    if (selectedActions === 'Print Lessons Learn Report' && multiDocumentsInfo && !multiDocumentsInfo.loading && (multiDocumentsInfo.data || multiDocumentsInfo.err)) {
      handleAnswerLassonPrint('print-invest-report-learn', 'Lessons Learnt Report');
      exportImages1();
    }
  }, [multiDocumentsInfo]);

  const switchActionItem = (action) => {
    if (action.displayname !== 'Print Investigation Report' && action.displayname !== 'Print Lessons Learn Report') {
      setSelectedActions(action.displayname);
      setActionMethod(action.method);
      setActionButton(action.buttonName);
      setActionMsg(action.message);
      setStatusName(action.statusName);
      setSelectedActionImage(action.name);
      showActionModal(true);
    } else if (action.displayname === 'Print Investigation Report' && (detailedData.state === 'Resolved' || detailedData.state === 'Analyzed' || detailedData.state === 'Remediated' || detailedData.state === 'Validated' || detailedData.state === 'Signed off')) {
      setSelectedActions(action.displayname);
      setSelectedActionImage(action.name);
      const anIds = getColumnArrayById(detailedData.analysis_checklist_ids, 'id');
      const valIds = getColumnArrayById(detailedData.validate_checklist_ids, 'id');
      const checklistsIds = [...anIds, ...valIds];
      const totalIds = [...checklistsIds, ...[detailedData.id]];
      dispatch(getMultiModelDocumentsData(checklistsIds, 'hx.incident_validate_checklist', 'hx.incident_analysis_checklist', appModels.DOCUMENT));
      dispatch(getEquipmentDocument(detailedData.id, appModels.HXINCIDENT, appModels.DOCUMENT));
    } else if (action.displayname === 'Print Lessons Learn Report' && (detailedData.state === 'Validated' || detailedData.state === 'Signed off')) {
      setSelectedActions(action.displayname);
      setSelectedActionImage(action.name);
      const valIds = getColumnArrayById(detailedData.validate_checklist_ids, 'id');
      dispatch(getMultiModelDocumentsData([], 'hx.incident_validate_checklist', 'hx.incident_analysis_checklist', appModels.DOCUMENT, 'hx.incident_validate_checklist', valIds));
    }
    handleClose();
  };
  const closeAction = () => {
    showActionModal(false);
    setSelectedActions(defaultActionText);
    setSelectedActionImage('');
    setActionMethod('');
    setActionButton('');
    setStatusName('');
    setActionMsg('');
  };

  function isSignUser() {
    let res = false;
    const userRoleId = userInfo && userInfo.data && userInfo.data.user_role_id ? userInfo.data.user_role_id : false;
    if (userRoleId && configData.sign_off_role_role_id && configData.sign_off_role_role_id.id && userRoleId === configData.sign_off_role_role_id.id) {
      res = true;
    }
    return res;
  }

  const checkActionAllowed = (actionName) => {
    let allowed = true;
    const vrState = detailedData && detailedData.state ? detailedData.state : '';

    if (actionName === 'Acknowledge') {
      if (vrState !== 'Reported' || !configData.is_acknowledge_required || !isAcknowledgeUser()) {
        allowed = false;
      }
    }
    if (actionName === 'Complete Recommendation') {
      if (vrState !== 'Analyzed' || !isValidUser() || !detailedData.probability_id.is_analysis_required) {
        allowed = false;
      }
    }
    if (actionName === 'Resolve') {
      if (vrState !== 'Remediated') {
        allowed = false;
      }
      if (vrState === 'Acknowledged' && !detailedData.probability_id.is_analysis_required) {
        allowed = true;
      }
      if (vrState === 'Analyzed' && !detailedData.probability_id.is_analysis_required) {
        allowed = true;
      }
      if (vrState === 'Reported' && !configData.is_acknowledge_required && !detailedData.probability_id.is_analysis_required) {
        allowed = true;
      }
    }
    if (actionName === 'Validate') {
      if (vrState !== 'Resolved' || !configData.is_validation_required || !isValidateUser()) {
        allowed = false;
      }
    }
    if (actionName === 'Print Investigation Report') {
      if (!isInvReport || vrState === 'Acknowledged' || vrState === 'Reported' || vrState === 'Paused' || vrState === 'Cancelled') {
        allowed = false;
      }
    }
    if (actionName === 'Print Lessons Learn Report') {
      if (!isLL || vrState === 'Acknowledged' || vrState === 'Reported' || vrState === 'Analyzed' || vrState === 'Remediated' || vrState === 'Resolved' || vrState === 'Paused' || vrState === 'Cancelled') {
        allowed = false;
      }
    }
    if (actionName === 'Cancel Incident') {
      if (vrState === 'Resolved' || vrState === 'Signed off' || vrState === 'Validated' || vrState === 'Paused' || vrState === 'Cancelled') {
        allowed = false;
      }
    }
    if (actionName === 'Pause Incident') {
      if (vrState === 'Reported' || vrState === 'Signed off' || vrState === 'Acknowledged' || vrState === 'Resolved' || vrState === 'Validated' || vrState === 'Paused' || vrState === 'Cancelled') {
        allowed = false;
      }
    }
    if (actionName === 'Resume Incident') {
      if (vrState !== 'Paused') {
        allowed = false;
      }
    }
    if (actionName === 'Complete RCFA') {
      if (vrState !== 'Acknowledged' || !detailedData.probability_id.is_analysis_required) {
        allowed = false;
      }
      if (vrState === 'Reported' && !configData.is_acknowledge_required && detailedData.probability_id.is_analysis_required) {
        allowed = true;
      }
    }
    if (actionName === 'Sign off') {
      if (vrState !== 'Validated' || !configData.is_sign_off_required || !isSignUser()) {
        allowed = false;
      }
    }
    return allowed;
  };
  const totalTasks = detailedData && detailedData.analysis_ids && detailedData.analysis_ids ? detailedData.analysis_ids : [];

  const pendingTasks = totalTasks && totalTasks.length ? totalTasks.filter((item) => (item.state === 'Open' || item.state === 'Inprogress')) : false;

  const isTasksNotCleared = pendingTasks && pendingTasks.length > 0;

  const totalAnalysisQtns = detailedData && detailedData.analysis_checklist_ids && detailedData.analysis_checklist_ids ? detailedData.analysis_checklist_ids : [];
  const pendingAnalysisQtns = questionValuesView && questionValuesView.length ? questionValuesView.filter((item) => !item.answer || (item.isNew === 'yes')) : false;

  const isAnalysisChecklisNotCleared = pendingAnalysisQtns && pendingAnalysisQtns.length > 0;


  const totalValidQtns = detailedData && detailedData.validate_checklist_ids && detailedData.validate_checklist_ids ? detailedData.validate_checklist_ids : [];
  const pendingValidQtns = totalValidQtns && totalValidQtns.length ? totalValidQtns.filter((item) => !item.answer) : false;

  const isValidChecklisNotCleared = pendingAnalysisQtns && pendingAnalysisQtns.length > 0;

  function getStateName() {
    let res = '';

    if (detailedData.state === 'Reported' && !configData.is_acknowledge_required && detailedData.probability_id.is_analysis_required) {
      res = customData.status.Acknowledged.msg;
    } else if (detailedData.state === 'Reported' && configData.is_acknowledge_required && !isAcknowledgeUser()) {
      res = "User don't have the authority to do acknowledge.";
    } else if (detailedData.state === 'Acknowledged' && !detailedData.probability_id.is_analysis_required) {
      res = '';
    } else if (detailedData.state === 'Reported' && !configData.is_acknowledge_required && !detailedData.probability_id.is_analysis_required) {
      res = '';
    } else if (detailedData.state === 'Resolved' && configData.is_validation_required && isValidateUser()) {
      res = customData.status.Resolved.msg;
    } else if (detailedData.state === 'Resolved' && configData.is_validation_required && !isValidateUser()) {
      res = "User don't have the authority to do recommendation.";
    } else if (detailedData.state === 'Resolved' && !configData.is_validation_required) {
      res = '';
    } else if (detailedData.state === 'Analyzed' && detailedData.probability_id.is_analysis_required && !isValidUser()) {
      res = "User don't have the authority to do recommendation.";
    } else if (detailedData.state === 'Remediated' && detailedData.probability_id.is_analysis_required && !isValidUser()) {
      res = "User don't have the authority to do recommendation.";
    } else if (detailedData.state === 'Analyzed' && !detailedData.probability_id.is_analysis_required && !isValidUser()) {
      res = customData.status.Resolved.msg;
    } else if (detailedData.state === 'Remediated' && !detailedData.probability_id.is_analysis_required && !isValidUser()) {
      res = customData.status.Resolved.msg;
    } else {
      res = customData.status[detailedData.state].msg;
    }
    return res;
  }

  /* function getPendingQtns() {
    let res = false;
    console.log(questionValuesView);
    const data = questionValuesView.filter((item) => item.isNew === 'yes');
    if (data && data.length) {
      res = true;
    }
    return res;
  } */
  let isManagable = inspDeata && (inspDeata.state === 'Reported' || inspDeata.state === 'Acknowledged' || inspDeata.state === 'Work in Progress');
  if (tabValue === 'Validation') {
    isManagable = inspDeata && inspDeata.state === 'Resolved' && isValidateUser();
  }

  const getPendingQtns = useMemo(() => (questionValuesView && questionValuesView.length && questionValuesView.filter((item) => item.isNew === 'yes')), [questionValuesView]);


  return (
    <>
      {detailedData && (
        <>
          <Box>
            <DetailViewHeader
              mainHeader={getDefaultNoValue(detailedData.name)}
              status={detailedData.state ? checkIncidentStatus(detailedData.state) : '-'}
              subHeader={(
                <>
                  {detailedData.reported_on
                    && userInfo.data
                    && userInfo.data.timezone
                    ? moment
                      .utc(detailedData.reported_on)
                      .local()
                      .tz(userInfo.data.timezone)
                      .format('yyyy MMM Do, hh:mm A')
                    : '-'}
                  {' '}
                </>
              )}
              actionComponent={(
                <Box>

                  {incidentDetailsInfo && incidentDetailsInfo.data && incidentDetailsInfo.data.length && (incidentDetailsInfo.data[0].state === 'Reported' || incidentDetailsInfo.data[0].state === 'Work in Progress' || incidentDetailsInfo.data[0].state === 'Acknowledged') && (
                    <Button
                      type="button"
                      variant="outlined"
                      sx={{
                        backgroundColor: '#fff',
                        '&:hover': {
                          backgroundColor: '#fff',
                        },
                      }}
                      className="ticket-btn"
                      onClick={() => {
                        setEditLink(true);
                        handleClose(false);
                        setEditId(detailedData.id);
                      }}
                    >
                      Edit
                    </Button>
                  )}
                  {!(getPendingQtns && getPendingQtns.length > 0) && (
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
                  )}
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
                    {customData && customData.actionItems.map((actions) => (
                      checkActionAllowed(actions.displayname) && (
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
                height: '100%',
              }}
            >
              <Box
                sx={{
                  width: '75%',
                }}
              >
                <DetailViewTab
                  value={value}
                  handleChange={handleTabChange}
                  tabs={tabsList}
                />
                {getStateName() && (
                  <Alert color="warning" className="mt-2">
                    <MuiTooltip title={(
                      <Typography
                        sx={{ fontFamily: 'Suisse Intl' }}
                      >
                        Info
                      </Typography>
                    )}
                    >
                      <span className="text-info cursor-pointer">
                        <FontAwesomeIcon className="mr-2 custom-fav-icon" size="sm" icon={faInfoCircle} />
                      </span>
                    </MuiTooltip>
                    {getStateName()}
                    {isManagable && getPendingQtns && getPendingQtns.length > 0 && updateIncidentNoInfo && !updateIncidentNoInfo.loading ? (
                      <span className="float-right">
                        You have unsaved changes
                        <span className="text-info cursor-pointer ml-2 mr-2" onClick={() => setCancel(Math.random())}>Cancel</span>
                        <span className="text-info cursor-pointer ml-2" onClick={() => setSave(Math.random())}>Save</span>
                      </span>
                    ):''}
                  </Alert>
                )}
                {!getStateName() && (
                  <div className="mt-2" />
                )}
                {tabValue === 'Summary' && (
                  <TabPanelNoScroll tabValue={tabValue}>
                    <DetailViewLeftPanel
                      panelData={[
                        {
                          header: 'Basic Information',
                          leftSideData:
                            [{
                              property: 'Category',
                              value: getDefaultNoValue(extractNameObject(detailedData.category_id, 'name')),
                            },
                            {
                              property: 'Severity',
                              value: getDefaultNoValue(extractNameObject(detailedData.severity_id, 'name')),
                            }, {
                              property: 'Probability',
                              value: getDefaultNoValue(detailedData.probability_id && detailedData.probability_id.title_id && detailedData.probability_id.title_id.id ? extractNameObject(detailedData.probability_id.title_id, 'name') : ''),
                            }, {
                              property: 'Assigned To',
                              value: getDefaultNoValue(extractNameObject(detailedData.assigned_id, 'name')),
                            }, {
                              property: 'Company',
                              value: getDefaultNoValue(extractNameObject(detailedData.company_id, 'name')),
                            }, {
                              property: 'Incident Type',
                              value: getDefaultNoValue(extractNameObject(detailedData.incident_type_id, 'name')),
                            }, {
                              property: 'Persons Witnessed',
                              value: <span className="text-break">
                                {getDefaultNoValue(detailedData.person_witnessed)}
                              </span>,
                            },
                            {
                              property: (detailedData.state === 'Resolved' || detailedData.state === 'Validated' || detailedData.state === 'Signed off') && 'Resolution',
                              value: getDefaultNoValue(detailedData.resolution),
                            },
                            ],
                          rightSideData:
                            [{
                              property: 'Sub Category',
                              value: getDefaultNoValue(extractNameObject(detailedData.sub_category_id, 'name')),
                            },
                            {
                              property: 'Priority',
                              value: getDefaultNoValue(extractNameObject(detailedData.priority_id, 'name')),
                            }, {
                              property: 'Risk Rating',
                              value: <span style={{
                                color: '#FFF', backgroundColor: 'rgb(237, 43, 42)', boxSizing: 'border-box', display: 'inline-block', marginRight: '8px', padding: '0 7px', fontSize: '12px', lineHeight: '20px', whiteSpace: 'nowrap', border: '1px solid #d9d9d9', borderRadius: '2px', opacity: '1',
                              }}
                              >
                                {getDefaultNoValue(detailedData.probability_id && detailedData.probability_id.risk_rating_id && detailedData.probability_id.risk_rating_id.id ? extractNameObject(detailedData.probability_id.risk_rating_id, 'name') : '')}
                              </span>,
                            }, {
                              property: 'Maintenance Team',
                              value: getDefaultNoValue(extractNameObject(detailedData.maintenance_team_id, 'name')),
                            }, {
                              property: 'Target Closure Date',
                              value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.target_closure_date, userInfo, 'datetime')),
                            }, {
                              property: 'Incident On',
                              value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.incident_on, userInfo, 'datetime')),
                            }, {
                              property: 'Summary of the Incident',
                              value: <span className="text-break">{getDefaultNoValue(detailedData.description)}</span>,
                            },
                            ],
                        },
                      ]}
                    />
                  </TabPanelNoScroll>
                )}
                {tabValue === 'RCFA' && (
                  <TabPanelNoScroll tabValue={tabValue}>
                    <CorrectiveAction detailData={detailedData} />
                    {detailedData && detailedData.probability_id.is_analysis_required && (
                      <Box
                        sx={{
                          fontFamily: 'Suisse Intl',
                        }}
                      >
                        <Checklists setCancel={setCancel} isCancel={isCancel} setSave={setSave} isSave={isSave} setQuestionsView={setQuestionsView} orderCheckLists={detailedData.analysis_checklist_ids} type="initial" />
                        <br />
                        <Injuries />
                      </Box>
                    )}
                  </TabPanelNoScroll>
                )}
                {tabValue === 'Validation' && (
                  <TabPanelNoScroll tabValue={tabValue}>
                    <Checklists setCancel={setCancel} isCancel={isCancel} setSave={setSave} isSave={isSave} setQuestionsView={setQuestionsView} orderCheckLists={detailedData.validate_checklist_ids} type="validate" />
                  </TabPanelNoScroll>
                )}
                {tabValue === 'Recommendations' && (
                  <TabPanelNoScroll tabValue={tabValue}>
                    <Box
                      sx={{
                        fontFamily: 'Suisse Intl',
                      }}
                    >
                      <Tasks />
                    </Box>
                  </TabPanelNoScroll>
                )}
                {tabValue === 'Attachments' && (
                  <TabPanelNoScroll tabValue={tabValue}>
                    <Documents
                      viewId={detailedData.id}
                      reference={detailedData.name}
                      resModel={appModels.HXINCIDENT}
                      model={appModels.DOCUMENT}
                    />
                  </TabPanelNoScroll>
                )}
                {tabValue === 'Other Info' && (
                  <TabPanelNoScroll tabValue={tabValue}>
                    <DetailViewLeftPanel
                      panelData={[
                        {
                          header: 'Logs Information',
                          leftSideData:
                            [{
                              property: 'Reported By',
                              value: getDefaultNoValue(extractNameObject(detailedData.reported_by_id, 'name')),
                            },
                            {
                              property: 'Acknowledged By',
                              value: getDefaultNoValue(extractNameObject(detailedData.acknowledged_by_id, 'name')),
                            },
                            {
                              property: 'Resolved By',
                              value: getDefaultNoValue(extractNameObject(detailedData.resolved_by_id, 'name')),
                            },
                            {
                              property: 'Validated By',
                              value: getDefaultNoValue(extractNameObject(detailedData.validated_by_id, 'name')),
                            },
                            ],
                          rightSideData: [
                            {
                              property: 'Reported On',
                              value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.reported_on, userInfo, 'datetime')),
                            },
                            {
                              property: 'Acknowledged On',
                              value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.acknowledged_on, userInfo, 'datetime')),
                            },
                            {
                              property: 'Resolved On',
                              value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.resolved_on, userInfo, 'datetime')),
                            },
                            {
                              property: 'Validated On',
                              value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.validated_on, userInfo, 'datetime')),
                            }],
                        },
                      ]}
                    />
                    <Typography
                      sx={detailViewHeaderClass}
                    >
                      Escalation Matrix
                    </Typography>
                    <Box
                      sx={{
                        fontFamily: 'Suisse Intl',
                      }}
                    >
                      <SlaMatrix />
                    </Box>
                    <Typography
                      sx={detailViewHeaderClass}
                    >
                      STATUS LOGS
                    </Typography>
                    <Box
                      sx={{
                        fontFamily: 'Suisse Intl',
                      }}
                    >
                      <LogNotes />
                    </Box>
                    <Box
                      sx={{
                        fontFamily: 'Suisse Intl',
                      }}
                    >
                      <AuditLog ids={detailedData.message_ids} />
                    </Box>
                  </TabPanelNoScroll>
                )}
              </Box>
              <Box
                sx={{
                  width: '25%',
                  height: '100%',
                  backgroundColor: '#F6F8FA',
                }}
              >
                <DetailViewRightPanel
                  panelOneHeader="ASSET / SPACE"
                  panelOneLabel={detailedData.type_category && detailedData.type_category === 'equipment'
                    ? getDefaultNoValue(extractNameObject(detailedData.equipment_id, 'name'))
                    : getDefaultNoValue(extractNameObject(detailedData.asset_id, 'path_name'))}
                  panelOneValue1={detailedData.type_category && detailedData.type_category === 'equipment' ? getDefaultNoValue(detailedData.equipment_id.location_id ? extractNameObject(detailedData.equipment_id.location_id, 'path_name') : '') : ''}
                  panelThreeHeader="Incident Information"
                  panelThreeData={[
                    {
                      header: 'SLA Status',
                      value:
                        <>
                          {/* detailedData.state
                            ? checkIncidentStatus(detailedData.state)
                    : '-' */}
                          <div className="mt-2">
                            {getSLALabel(detailedData.sla_status)}
                          </div>
                        </>,

                    },
                  ]}
                />
              </Box>
            </Box>
          </Box>
          {actionModal && (
            <Action
              atFinish={() => closeAction()}
              atCancel={() => closeAction()}
              detailData={detailedData}
              actionModal={actionModal}
              actionButton={actionButton}
              actionMsg={actionMsg}
              offset={offset}
              questionValuesView={questionValuesView}
              actionMethod={actionMethod}
              displayName={selectedActions}
              statusName={statusName}
              message={selectedActionImage}
              isTasksNotCleared={isTasksNotCleared}
              isAnalysisChecklisNotCleared={isAnalysisChecklisNotCleared}
              isValidChecklisNotCleared={isValidChecklisNotCleared}
            />
          )}
          <div className="d-none">
            <InvestigationReport detailData={detailedData} isAnalysis={detailedData.probability_id.is_analysis_required} isValidate={configData.is_validation_required} />
          </div>

          <div className="d-none">
            <LessonsLearnt detailData={detailedData} isValidate={configData.is_validation_required} />
          </div>
        </>
      )}
      {incidentDetailsInfo && incidentDetailsInfo.loading && <Loader />}
      {
        incidentDetailsInfo && incidentDetailsInfo.err && (
          <ErrorContent errorTxt={generateErrorMessage(incidentDetailsInfo)} />
        )
      }
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={editLink}
      >
        <DrawerHeader
          headerName="Update Incident"
          imagePath={TrackerCheck}
          onClose={() => {
            setEditLink(false);
            //  onViewReset();
          }}
        />
        <AddIncident
          editId={editId}
          closeModal={() => setEditLink(false)}
          isShow={editLink}
        />

      </Drawer>
    </>
  );
};
export default IncidentDetails;
