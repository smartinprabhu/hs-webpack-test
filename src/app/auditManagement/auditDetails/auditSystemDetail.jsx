import {
  Button, Dialog, DialogContent, DialogContentText,
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useState, useEffect } from 'react';
import Drawer from '@mui/material/Drawer';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment-timezone';
import DOMPurify from 'dompurify';
import {
  Table,
} from 'reactstrap';

import Loader from '@shared/loading';
import TrackerCheck from '@images/icons/auditBlue.svg';

import DialogHeader from '../../commonComponents/dialogHeader';

import DrawerHeader from '../../commonComponents/drawerHeader';
import DetailViewHeader from '../../commonComponents/detailViewHeader';
import DetailViewLeftPanel from '../../commonComponents/detailViewLeftPanel';
import DetailViewTab from '../../commonComponents/detailViewTab';
import actionCodes from '../data/actionCodes.json';
import {
  hxAuditSystemStatusJson,
} from '../../commonComponents/utils/util';
import {
  resetUpdateSystem,
  resetCreateSytem,
  getHxAuditSystemDetail,
} from '../auditService';
import {
  TabPanel,
  extractNameObject,
  htmlToReact,
  getCompanyTimezoneDate,
  getDefaultNoValue,
  getListOfOperations,
} from '../../util/appUtils';
import {
  resetDeleteAnswers,
  resetPageData,
  resetStorePages,
  resetStoreQuestions,
} from '../../survey/surveyService';
import { getActionDueDays } from '../utils/utils';
import ViewChecklists from './viewChecklists';

import AddSystem from '../addSystem';
import PublishSystem from './publishSystem';
import DraftSystem from './draftSystem';

const appModels = require('../../util/appModels').default;

const AuditSystemDetail = ({ offset }) => {
  const {
    hxAuditSystemDetail, hxSystemUpdate, hxSystemUpdateQtn, hxSystemCreate,
  } = useSelector((state) => state.hxAudits);
  const dispatch = useDispatch();
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState(0);
  const open = Boolean(anchorEl);
  const [editId, setEditId] = useState(false);
  const [taskQuestions, setTaskQuestions] = useState([]);
  const [editModal, showEditModal] = useState(false);

  const [viewId, setViewId] = useState(false);
  const [viewModel, setViewModel] = useState(false);

  const [viewMetric, setViewMetric] = useState(false);

  const [copyModal, showCopyModal] = useState(false);

  const [actionModal, showActionModal] = useState(false);
  const [action2Modal, showAction2Modal] = useState(false);

  const detailedData = hxAuditSystemDetail && hxAuditSystemDetail.data && hxAuditSystemDetail.data.length ? hxAuditSystemDetail.data[0] : '';
  const tabs = ['Overview', 'Checklists'];

  const allowedOperations = getListOfOperations(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'code',
  );

  const isCreateSystem = allowedOperations.includes(actionCodes['Add Audit System']);
  const isEditable = allowedOperations.includes(actionCodes['Edit Audit System']);
  const isCopySystem = allowedOperations.includes(actionCodes['Copy Audit System']);

  const checkActionAllowed = (actionName) => {
    let allowed = true;
    const vrState = detailedData && detailedData.state ? detailedData.state : '';

    if (actionName === 'Move Into In-Progress') {
      if (vrState !== 'Open' && vrState !== 'On Hold') {
        allowed = false;
      }
    }
    if (actionName === 'Put On-Hold' || actionName === 'Set to Draft') {
      if (vrState !== 'In Progress') {
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

  useEffect(() => {
    if (hxAuditSystemDetail && hxAuditSystemDetail.data && hxAuditSystemDetail.data.length && detailedData && detailedData.page_ids && detailedData.page_ids.length) {
      const newArrData = detailedData.page_ids.flatMap((item) => item.question_ids.map((question) => ({
        id: question.id,
        answer_type: question.type, // Replace with actual value if available
        remarks: null, // Replace with actual value if available
        answer_common: null, // Replace with actual value if available
        mro_quest_grp_id: question.question_group_id, // Replace with actual value if available
        achieved_score: null, // Replace with actual value if available
        page_id: {
          id: item.id,
          title: item.title,
        },
        mro_activity_id: {
          id: question.id,
          name: question.question,
          applicable_score: question.applicable_score,
          applicable_standard_ids: question.applicable_standard_ids,
          helper_text: question.helper_text,
          procedure: question.procedure,
          sequence: question.sequence,
        },
      })));

      setTaskQuestions(newArrData);
    } else {
      setTaskQuestions([]);
    }
  }, [hxAuditSystemDetail]);

  useEffect(() => {
    if (hxSystemUpdateQtn && hxSystemUpdateQtn.data) {
      dispatch(getHxAuditSystemDetail(detailedData.id, appModels.HXSYSTEM, 'noLoad'));
    }
  }, [hxSystemUpdateQtn]);

  const checkDisable = (actionName) => {
    if (!detailedData || !detailedData.deadline) return false;

    const actionsToDisable = ['Start Audit', 'Perform Audit', 'Review Audit', 'Sign off Audit']; // Actions to check
    const endDate = moment.utc(detailedData.deadline).local().startOf('day'); // Convert deadline to local date (ignoring time)
    const today = moment().startOf('day'); // Current date (ignoring time)

    // Check if the action is within the range and belongs to the actionsToDisable list
    const isAllow = endDate.isSameOrAfter(today);
    return actionsToDisable.includes(actionName) && !isAllow;
  };

  const checkAuditStatus = (val) => (
    <Box>
      {hxAuditSystemStatusJson.map(
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

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const closeEditWindow = () => {
    if (editId && !copyModal && hxSystemUpdate && hxSystemUpdate.data) {
      dispatch(getHxAuditSystemDetail(editId, appModels.HXSYSTEM));
    }
    dispatch(resetUpdateSystem());
    dispatch(resetCreateSytem());
    dispatch(resetStorePages([]));
    dispatch(resetPageData([]));
    dispatch(resetDeleteAnswers());
    dispatch(resetStoreQuestions());
    setEditId(false);
    showCopyModal(false);
    showEditModal(false);
  };

  const resetForm = () => {
    if (editId && !copyModal && hxSystemUpdate && hxSystemUpdate.data) {
      dispatch(getHxAuditSystemDetail(editId, appModels.HXSYSTEM));
    }
    if (copyModal && document.getElementById('systemForm')) {
      document.getElementById('systemForm').reset();
    }
    dispatch(resetStorePages([]));
    dispatch(resetPageData([]));
    dispatch(resetDeleteAnswers());
    dispatch(resetStoreQuestions());
    dispatch(resetUpdateSystem());
    dispatch(resetCreateSytem());
    showEditModal(false);
    showCopyModal(false);
  };

  const resetAdd = () => {
    dispatch(resetUpdateSystem());
    dispatch(resetStorePages([]));
    dispatch(resetPageData([]));
    dispatch(resetDeleteAnswers());
    dispatch(resetStoreQuestions());
    dispatch(resetCreateSytem());
  };

  const closeAction = () => {
    showActionModal(false);
    dispatch(resetUpdateSystem());
  };

  const opneAction = () => {
    dispatch(resetUpdateSystem());
    showActionModal(true);
  };

  const opneAction2 = () => {
    dispatch(resetUpdateSystem());
    showAction2Modal(true);
  };

  const closeAction2 = () => {
    showAction2Modal(false);
    dispatch(resetUpdateSystem());
  };

  const openMetric = (data) => {
    if (data && data.length > 0) {
      setViewMetric(true);
    }
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

  return (
    <>
      {detailedData && (
      <Box>
        <DetailViewHeader
          mainHeader={`${getDefaultNoValue(detailedData.name)}`}
          subHeader={getDefaultNoValue(detailedData.short_code)}
          status={
                            detailedData.state ? checkAuditStatus(detailedData.state) : '-'
                        }
          actionComponent={(
            <Box>
              {hxAuditSystemDetail
                                    && !hxAuditSystemDetail.loading
                                    && isEditable && detailedData && detailedData.state === 'Draft' && (
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
                                        setEditId(hxAuditSystemDetail && (hxAuditSystemDetail.data && hxAuditSystemDetail.data.length > 0) ? hxAuditSystemDetail.data[0].id : false);
                                        showEditModal(true);
                                        dispatch(resetStorePages([]));
                                        dispatch(resetPageData([]));
                                        dispatch(resetDeleteAnswers());
                                        dispatch(resetStoreQuestions());
                                        dispatch(resetUpdateSystem());
                                      }}
                                    >
                                      Edit
                                    </Button>
              )}
              {hxAuditSystemDetail
                                    && !hxAuditSystemDetail.loading
                                    && isCopySystem && detailedData && (detailedData.state === 'Draft' || detailedData.state === 'Published') && (
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
                                        setEditId(detailedData.id);
                                        showCopyModal(true);
                                        dispatch(resetStorePages([]));
                                        dispatch(resetPageData([]));
                                        dispatch(resetDeleteAnswers());
                                        dispatch(resetStoreQuestions());
                                        dispatch(resetCreateSytem());
                                      }}
                                    >
                                      Duplicate
                                    </Button>
              )}
              {hxAuditSystemDetail
                                    && !hxAuditSystemDetail.loading
                                   && detailedData && detailedData.state === 'Draft' && (
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
                                     onClick={() => opneAction()}
                                   >
                                     Publish
                                   </Button>
              )}
              {hxAuditSystemDetail
                                    && !hxAuditSystemDetail.loading
                                   && detailedData && detailedData.state === 'Published' && (
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
                                     onClick={() => opneAction2()}
                                   >
                                     Set to Draft
                                   </Button>
              )}

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
            <TabPanel value={value} index={0}>
              <DetailViewLeftPanel
                panelData={[
                  {
                    header: 'General Information',
                    leftSideData: [
                      {
                        property: 'Department',
                        value: getDefaultNoValue(extractNameObject(detailedData.department_id, 'name')),
                      },
                      {
                        property: 'Scope',
                        value: getDefaultNoValue(detailedData.scope),
                      },
                      {
                        property: 'Company',
                        value: getDefaultNoValue(extractNameObject(detailedData.company_id, 'name')),
                      },

                    ],
                    rightSideData: [
                      {
                        property: 'Objective',
                        value: getDefaultNoValue(detailedData.objective),
                      },
                      {
                        property: 'Metric',
                        value: <span onClick={() => openMetric(detailedData.audit_metric_id && detailedData.audit_metric_id.scale_line_ids && detailedData.audit_metric_id.scale_line_ids.length > 0 ? detailedData.audit_metric_id.scale_line_ids : false)} className="text-info cursor-pointer font-family-tab">{getDefaultNoValue(extractNameObject(detailedData.audit_metric_id, 'name'))}</span>,
                      },
                      {
                        property: 'Created On',
                        value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.create_date, userInfo, 'datetime')),
                      },
                    ],
                  },
                  {
                    header: 'Instructions',
                    leftSideData: [
                      {
                        property: 'Instructions to Auditor',
                        value: <p
                          className="text-capital font-side-heading m-0 p-0 max-height-300 overflow-auto thin-scrollbar"
                          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlToReact(detailedData.instructions_to_auditor), { USE_PROFILES: { html: true } }) }}
                        />,
                      },
                      {
                        property: 'Instructions to Auditee',
                        value: <p
                          className="text-capital font-side-heading m-0 p-0 max-height-300 overflow-auto thin-scrollbar"
                          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlToReact(detailedData.instructions_to_auditee), { USE_PROFILES: { html: true } }) }}
                        />,
                      },
                    ],
                    rightSideData: [
                      {
                        property: 'Terms and Conditions',
                        value: <p
                          className="text-capital font-side-heading m-0 p-0 max-height-300 overflow-auto thin-scrollbar"
                          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlToReact(detailedData.terms_and_conditions), { USE_PROFILES: { html: true } }) }}
                        />,
                      },
                    ],
                  },
                ]}
              />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <ViewChecklists systemId={detailedData && detailedData.id} orderCheckLists={taskQuestions} questionOnly isCreate={isCreateSystem} />
            </TabPanel>

          </Box>
          {actionModal && (
            <PublishSystem
              actionModal
              detailData={detailedData}
              atFinish={() => closeAction()}
              atCancel={() => closeAction()}
            />
          )}
          {action2Modal && (
            <DraftSystem
              actionModal={action2Modal}
              detailData={detailedData}
              atFinish={() => closeAction2()}
              atCancel={() => closeAction2()}
            />
          )}
          <Drawer
            PaperProps={{
              sx: { width: '70%' },
            }}
            anchor="right"
            open={editModal}
          >
            <DrawerHeader
              headerName="Update System"
              imagePath={TrackerCheck}
              onClose={() => closeEditWindow()}
            />
            <AddSystem
              editId={editId}
              closeModal={() => resetForm()}
              afterReset={() => resetAdd()}
              isShow={editModal}
              addModal={editModal}
              setViewId={setViewId}
              setViewModal={setViewModel}
            />
          </Drawer>
          <Dialog size="xl" fullWidth open={viewMetric}>
            <DialogHeader title="View Metric" onClose={() => { setViewMetric(false); }} />
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <p className="font-family-tab-v2 mt-2">{detailedData && detailedData.audit_metric_id && detailedData.audit_metric_id.name ? detailedData.audit_metric_id.name : ''}</p>
                <Table responsive className="mb-2 font-weight-400 border-0 assets-table" width="100%">
                  <thead className="bg-gray-light">
                    <tr>
                      <th className="font-family-tab-v2">Category</th>
                      <th className="p-2 cursor-default font-family-tab-v2">Condition for Final Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailedData && detailedData.audit_metric_id && detailedData.audit_metric_id.scale_line_ids && detailedData.audit_metric_id.scale_line_ids.length > 0 && detailedData.audit_metric_id.scale_line_ids.map((sl) => (
                      <tr key={sl.min}>
                        <td className="p-2 font-family-tab-v2" style={{ color: sl.color ? 'white' : '#374152', backgroundColor: sl.color }}>{sl.legend}</td>
                        <td className="p-2 font-family-tab-v2">
                          {`>= ${sl.min ? parseFloat(sl.min).toFixed(2) : '0.00'} % - < ${sl.max ? parseFloat(sl.max).toFixed(2) : '0.00'} %`}
                        </td>
                      </tr>
                    ))}

                  </tbody>
                </Table>
                <hr className="m-0" />
              </DialogContentText>
            </DialogContent>
          </Dialog>
          <Dialog maxWidth="lg" minWidth="lg" open={copyModal}>
            <DialogHeader title="Duplicate the System" onClose={closeEditWindow} response={hxSystemCreate} />
            <DialogContent>
              <DialogContentText id="alert-dialog-description">

                <AddSystem
                  editId={editId}
                  closeModal={() => resetForm()}
                  afterReset={() => resetAdd()}
                  isShow={copyModal}
                  addModal={copyModal}
                  setViewId={setViewId}
                  isCopy
                  isDialog
                  setViewModal={setViewModel}
                />
              </DialogContentText>
            </DialogContent>
          </Dialog>

        </Box>
      </Box>
      )}
      {hxAuditSystemDetail && hxAuditSystemDetail.loading && <Loader />}
    </>
  );
};
export default AuditSystemDetail;
