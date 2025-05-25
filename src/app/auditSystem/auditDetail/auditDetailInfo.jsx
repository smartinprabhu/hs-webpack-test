/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable import/no-unresolved */
import {
  faEnvelope,
  faFile,
  faPrint, faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col,
} from 'reactstrap';
import Drawer from '@mui/material/Drawer';
import {
  Button,
  IconButton,
  Menu, Tooltip,
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { Box } from '@mui/system';
import moment from 'moment-timezone';
import { BsThreeDotsVertical } from 'react-icons/bs';
import auditBlue from '@images/icons/auditBlue.svg';
import DrawerHeader from '../../commonComponents/drawerHeader';

import customData from '../data/customData.json';

import DetailViewHeader from '../../commonComponents/detailViewHeader';
import DetailViewLeftPanel from '../../commonComponents/detailViewLeftPanel';
import DetailViewTab from '../../commonComponents/detailViewTab';

import {
  auditStatusJson,
} from '../../commonComponents/utils/util';
import {
  copyMultiToClipboard,
  extractNameObject,
  getCompanyTimezoneDate,
  getDefaultNoValue, TabPanel,
} from '../../util/appUtils';
import { getAuditAssessments } from '../auditService';
import Action from './actionItems/actions';
import PrintChecklistReport from './printChecklistReport';
import PrintDetailedReport from './printDetailedReport';

import Documents from '../../commonComponents/documents';
import Checklists from './checklists';
import Opportunities from './opportunities';
import Scorecard from './scorecard';
import AddAudit from '../operations/addAudit';

const appModels = require('../../util/appModels').default;

const faIcons = {
  CLOSE: faTimesCircle,
  EMAIL: faEnvelope,
  PRINTPDF: faPrint,
  PRINTDETAIL: faFile,
};

const AuditDetailInfo = (props) => {
  const {
    detailData, setDetailModal, editModal, closeEditAudit, editId, showEditModal, setEditId,
  } = props;
  const dispatch = useDispatch();
  const defaultActionText = 'Audit Actions';
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [closeModal, showCloseModal] = useState(false);
  const [actionMethod, setActionMethod] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [value, setValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);

  const tabs = ['Scorecard', 'Audit Overview', 'Assessment', 'Actions', 'Attachments'];

  const { userInfo } = useSelector((state) => state.user);
  const {
    printReportInfo,
  } = useSelector((state) => state.purchase);

  const { auditAssessmentDetail, auditActionDetails, auditDetail } = useSelector((state) => state.audit);

  const viewData = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0] : false;

  useEffect(() => {
    if (viewData && viewData.id) {
      dispatch(getAuditAssessments(viewData.id, appModels.AUDITSURVEYINPUT));
    }
  }, [detailData]);

  const handleAuditPrint = (htmlId, fileName) => {
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
    setSelectedActions(defaultActionText);
    setSelectedActionImage('');
  };

  const handleAuditDetailReport = (htmlId, fileName) => {
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
    setSelectedActions(defaultActionText);
    setSelectedActionImage('');
  };

  const answerData = auditAssessmentDetail && auditAssessmentDetail.data && auditAssessmentDetail.data.length ? auditAssessmentDetail.data[0] : false;
  const answerChecklist = (answerData && answerData.user_input_line_ids && answerData.user_input_line_ids.length > 0) ? answerData.user_input_line_ids : [];

  const actionsData = auditActionDetails && auditActionDetails.data && auditActionDetails.data.length > 0 ? auditActionDetails.data : [];

  const switchActionItem = (action) => {
    setSelectedActions(action.displayname);
    setActionMethod(action.method);
    setSelectedActionImage(action.name);
    if (action.name === 'PRINTPDF' && answerData) {
      handleAuditPrint('audit-checklist-report', 'Audit Summary');
    }
    if (action.name === 'PRINTDETAIL' && actionsData.length) {
      handleAuditDetailReport('audit-detailed-report', 'Audit Summary');
    }
    if (action.name === 'CLOSE') {
      showCloseModal(true);
    }
    if (action.name === 'EMAIL') {
      showCloseModal(true);
    }
    setAnchorEl(null);
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const loading = detailData && detailData.loading;

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  const uuid = viewData ? viewData.uuid : false;
  // eslint-disable-next-line max-len
  const uuid2 = viewData && viewData.audit_system_id && viewData.audit_system_id.uuid ? viewData.audit_system_id.uuid : false;

  const checkTicketsStatus = (val) => (
    <Box>
      {auditStatusJson.map(
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

  return (
    !loading && viewData && (
    <>
      <Box>
        <DetailViewHeader
          mainHeader={getDefaultNoValue(viewData.name)}
          status={
              viewData.state
                ? getDefaultNoValue(checkTicketsStatus(viewData.state))
                : '-'
            }
          subHeader={(
            <>
              {getDefaultNoValue(getCompanyTimezoneDate(viewData.date, userInfo, 'datetime'))}
              {' '}
              System -
              {' '}
              {getDefaultNoValue(extractNameObject(viewData.audit_system_id, 'display_name'))}
            </>
              )}
          actionComponent={(
            <Box>
              <Tooltip title={copySuccess ? 'Copied!' : 'Copy URL'}>
                <Button
                  variant="outlined"
                  size="sm"
                  type="button"
                  className="ticket-btn"
                  sx={{
                    backgroundColor: '#fff',
                    '&:hover': {
                      backgroundColor: '#fff',
                    },
                  }}
                  onMouseLeave={() => setCopySuccess(false)}
                  onClick={() => { copyMultiToClipboard(uuid, uuid2, 'audit'); setCopySuccess(true); }}

                >
                  Copy URL
                </Button>
              </Tooltip>
              {auditDetail
                  && !auditDetail.loading
                  && auditDetail.data
                  && auditDetail.data.length > 0
                  && (
                    <Button
                      type="button"
                      className="ticket-btn"
                      onClick={() => {
                        showEditModal(true);
                        handleClose(false);
                        setEditId(viewData.id);
                      }}
                      sx={{
                        backgroundColor: '#fff',
                        '&:hover': {
                          backgroundColor: '#fff',
                        },
                      }}
                      variant="outlined"
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
                {customData && customData.actionItems.map((actions) => (
                  <MenuItem
                    sx={{
                      font: 'normal normal normal 15px Suisse Intl',
                    }}
                    id="switchLocation"
                    key={actions.id}
                    className="pl-2"
                    disabled={(actions.name === 'CLOSE' && viewData.state === 'done')
                        || (actions.name === 'EMAIL' && viewData.state === 'done')
                        || (actions.name === 'PRINTPDF' && !answerData)
                        || (actions.name === 'PRINTDETAIL' && !actionsData.length)}
                    onClick={() => switchActionItem(actions)}
                  >
                    <FontAwesomeIcon
                      className="mr-2"
                      color="primary"
                      icon={faIcons[actions.name]}
                    />
                    {actions.displayname}
                  </MenuItem>
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
              width: '100%',
            }}
          >
            <DetailViewTab
              value={value}
              handleChange={handleTabChange}
              tabs={tabs}
            />
            <TabPanel value={value} index={0}>
              <Scorecard auditDetails={viewData} />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <DetailViewLeftPanel
                panelData={[
                  {
                    header: 'Facility Information',
                    leftSideData:
                        [

                          {
                            property: 'Manager',
                            value: getDefaultNoValue(extractNameObject(viewData.facility_manager_id, 'name')),
                          },
                          {
                            property: 'Contact',
                            value: getDefaultNoValue(viewData.facility_manager_contact),
                          },
                        ],
                    rightSideData:
                        [
                          {
                            property: 'Email',
                            value: getDefaultNoValue(viewData.facility_manager_email),
                          },
                          {
                            property: 'Space',
                            value: getDefaultNoValue(extractNameObject(viewData.space_id, 'path_name')),
                          },
                        ],
                  },
                  {
                    header: 'Auditor Information',
                    leftSideData: [
                      {
                        property: 'Name',
                        value: getDefaultNoValue(extractNameObject(viewData.sys_auditor_id, 'name')),
                      },
                      {
                        property: 'Designation',
                        value: getDefaultNoValue(viewData.auditor_designation),
                      },
                      {
                        property: 'Contact',
                        value: getDefaultNoValue(viewData.auditor_contact),
                      },
                    ],
                    rightSideData: [
                      {
                        property: 'Email',
                        value: getDefaultNoValue(viewData.auditor_email),
                      },
                      {
                        property: 'Date',
                        value: getDefaultNoValue(moment.utc(viewData.date).local().format('MM/DD/YYYY hh:mm A')),
                      },

                    ],
                  },
                ]}
              />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <Checklists detailData={detailData} />
            </TabPanel>

            <TabPanel value={value} index={3}>
              <Opportunities detailData={viewData} setDetailModal={setDetailModal} />
            </TabPanel>

            <TabPanel value={value} index={4}>
              <Documents
                viewId={viewData.id}
                reference={viewData.name ? viewData.name : ''}
                resModel={appModels.SYSTEMAUDIT}
                model={appModels.DOCUMENT}
              />
            </TabPanel>
          </Box>
        </Box>
      </Box>
      <Col md="12" sm="12" lg="12" className="d-none">
        <PrintChecklistReport auditDetails={viewData} answerData={answerData} answerChecklist={answerChecklist} />
      </Col>
      <Col md="12" sm="12" lg="12" className="d-none">
        <PrintDetailedReport auditDetails={viewData} actionsData={actionsData} answerChecklist={answerChecklist} />
      </Col>
      {closeModal && (
      <Action
        atFinish={() => {
          showCloseModal(false); setSelectedActions(defaultActionText); setSelectedActionImage('');
        }}
        atCancel={() => {
          showCloseModal(false); setSelectedActions(defaultActionText); setSelectedActionImage('');
        }}
        details={detailData}
        actionModal={closeModal}
        actionMethod={actionMethod}
        displayName={selectedActions}
        message={selectedActions}
      />
      )}
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={editModal}
      >

        <DrawerHeader
          headerName="Update Audit"
          imagePath={auditBlue}
          onClose={() => { showEditModal(false); }}
        />
        <AddAudit editId={editId} closeModal={closeEditAudit} afterReset={() => { showEditModal(false); }} />
      </Drawer>
    </>
    )
  );
};

AuditDetailInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]).isRequired,
  setDetailModal: PropTypes.func.isRequired,
};

export default AuditDetailInfo;
