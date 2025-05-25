/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, {
  useEffect, useState, useMemo,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import { Box } from '@mui/system';
import { useHistory } from 'react-router-dom';
import {
  Typography, Dialog, DialogContent, DialogContentText,
  DialogActions, Button,
} from '@mui/material';
import {
  Progress,
} from 'reactstrap';
import { faNewspaper } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Markup } from 'interweave';
import moment from 'moment-timezone';

import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';

import DialogHeader from '../../commonComponents/dialogHeader';
import {
  getHxAuditChecklists,
  getHxAuditConfigData,
  resetUpdateHxAudit,
  updateHxAudit,
} from '../auditService';
import AuthService from '../../util/authService';
import {
  detectMob, getDefaultNoValue, getCompanyTimezoneDate, truncateFrontSlashs, truncateStars,
  getSequencedMenuItems,
} from '../../util/appUtils';
import PerformChecklists from './performChecklists';
import { AddThemeBackgroundColor } from '../../themes/theme';
import { newpercalculate } from '../../util/staticFunctions';
import {
  hxAuditStatusJson,
} from '../../commonComponents/utils/util';
import AccountIdLogin from '../../auth/accountIdLogin';

const appModels = require('../../util/appModels').default;

const ResponsiveAudit = (props) => {
  const { match } = props;
  const { params } = match;
  const { uuid } = params;

  console.log(uuid);

  const isMob = detectMob();
  const dispatch = useDispatch();
  const history = useHistory();
  const authService = AuthService();
  const isAuthenticated = authService.getRefreshToken();

  const [logs, setLogs] = useState(false);
  const [viewTitle, setViewTitle] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

  const onOpenModal = (title) => {
    setViewTitle(title);
    setViewModal(true);
  };

  const onCloseModal = () => {
    setViewTitle(false);
    setViewModal(false);
  };

  const {
    hxAuditChecklistsInfo,
    hxAuditConfig,
    hxAuditUpdate,
  } = useSelector((state) => state.hxAudits);

  const { userInfo, userRoles } = useSelector((state) => state.user);

  const menus = getSequencedMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Audit Management', 'name');

  const [taskQuestions, setTaskQuestions] = useState([]);

  useEffect(() => {
    const headerDiv = document.getElementById('main-header');
    const sidebarDiv = document.getElementById('main-sidebar');
    const sidebarCollapseDiv = document.getElementById('collapse-sidebar');
    const componentHeader = document.getElementById('component-header');
    const headerDiv2 = document.getElementById('mainHeader2');

    if (headerDiv) {
      headerDiv.style.display = 'none';
    }

    if (sidebarDiv) {
      sidebarDiv.style.display = 'none';
    }

    if (headerDiv2) {
      headerDiv2.style.display = 'none';
    }

    if (sidebarCollapseDiv) {
      sidebarCollapseDiv.style.display = 'none';
    }

    if (componentHeader) {
      componentHeader.style.width = '100%';
    }
  }, []);

  const detailData = hxAuditChecklistsInfo && hxAuditChecklistsInfo.data && hxAuditChecklistsInfo.data.length ? hxAuditChecklistsInfo.data[0] : false;

  const gpConfig = hxAuditConfig && hxAuditConfig.data && hxAuditConfig.data.length ? hxAuditConfig.data[0] : false;
  const canPerform = gpConfig && gpConfig.allow_missed_audits_to_be_performed;

  const isAllow = useMemo(() => {
    const startDate = detailData && detailData.planned_start_date ? moment.utc(detailData.planned_start_date).local().format('YYYY-MM-DD HH:mm:ss') : new Date();
    const endDate = detailData && detailData.planned_end_date ? moment.utc(detailData.planned_end_date).local().format('YYYY-MM-DD HH:mm:ss') : new Date();
    const isWithinRange = (new Date() >= new Date(startDate) && new Date(endDate) >= new Date());
    const isNotFuture = new Date() >= new Date(startDate);
    const isAllows = (canPerform && detailData.state !== 'Upcoming') || isWithinRange || isNotFuture;
    return isAllows;
  }, [hxAuditConfig, hxAuditChecklistsInfo]);

  const onBack = () => {
    if (!(hxAuditUpdate && hxAuditUpdate.data) && isAllow && (detailData.state === 'Started' || detailData.state === 'Inprogress' || detailData.state === 'Missed')) {
      setConfirmModal(true);
    } else {
      dispatch(resetUpdateHxAudit());
      const headerDiv = document.getElementById('main-header');
      const sidebarDiv = document.getElementById('main-sidebar');
      const sidebarCollapseDiv = document.getElementById('collapse-sidebar');
      const componentHeader = document.getElementById('component-header');
      const headerDiv2 = document.getElementById('mainHeader2');

      if (headerDiv) {
        headerDiv.style.display = 'flex';
      }

      if (sidebarDiv) {
        sidebarDiv.style.display = 'initial';
      }

      if (headerDiv2) {
        headerDiv2.style.display = 'flex';
      }

      if (sidebarCollapseDiv) {
        sidebarCollapseDiv.style.display = 'initial';
      }

      if (componentHeader) {
        componentHeader.style.width = '95%';
      }
      history.push({ pathname: '/audits', state: { id: uuid } });
    }
  };

  const onBackConfirm = () => {
    dispatch(resetUpdateHxAudit());
    setConfirmModal(false);
    const headerDiv = document.getElementById('main-header');
    const sidebarDiv = document.getElementById('main-sidebar');
    const sidebarCollapseDiv = document.getElementById('collapse-sidebar');
    const componentHeader = document.getElementById('component-header');
    const headerDiv2 = document.getElementById('mainHeader2');

    if (headerDiv) {
      headerDiv.style.display = 'flex';
    }

    if (sidebarDiv) {
      sidebarDiv.style.display = 'initial';
    }

    if (headerDiv2) {
      headerDiv2.style.display = 'flex';
    }

    if (sidebarCollapseDiv) {
      sidebarCollapseDiv.style.display = 'initial';
    }

    if (componentHeader) {
      componentHeader.style.width = '95%';
    }
    history.push({ pathname: '/audits', state: { id: uuid } });
  };

  const onPerformAudit = () => {
    dispatch(resetUpdateHxAudit());
    if (uuid) {
      dispatch(getHxAuditChecklists(uuid, appModels.HXAUDIT));
      if (userInfo && userInfo.data && userInfo.data.company) {
        dispatch(getHxAuditConfigData(userInfo.data.company.id, appModels.HXAUDITCONFIG));
      }
    }
  };

  const onStartAudit = () => {
    const postDataValues = {
      state: 'Inprogress',
    };
    dispatch(updateHxAudit(detailData.id, appModels.HXAUDIT, postDataValues));
  };

  useEffect(() => {
    if (uuid) {
      dispatch(getHxAuditChecklists(uuid, appModels.HXAUDIT));
      if (userInfo && userInfo.data && userInfo.data.company) {
        dispatch(getHxAuditConfigData(userInfo.data.company.id, appModels.HXAUDITCONFIG));
      }
    }
  }, [uuid]);

  const taskChecklists = detailData && detailData.checklists_lines.length ? detailData.checklists_lines : false;

  useEffect(() => {
    if (taskChecklists) {
      const newArrData = taskChecklists.map((cl) => ({
        id: cl.id,
        answer_type: cl.mro_activity_id.type,
        remarks: cl.remarks,
        answer_common: cl.answer,
        achieved_score: cl.achieved_score,
        is_na: cl.is_na,
        mro_activity_id: {
          based_on_ids: cl.mro_activity_id.based_on_ids,
          constr_error_msg: cl.mro_activity_id.constr_error_msg,
          constr_mandatory: cl.mro_activity_id.constr_mandatory,
          has_attachment: cl.mro_activity_id.has_attachment,
          applicable_score: cl.mro_activity_id.applicable_score,
          comments_allowed: cl.mro_activity_id.comments_allowed,
          is_attachment_mandatory: false,
          id: cl.mro_activity_id.id,
          is_enable_condition: cl.mro_activity_id.is_enable_condition,
          name: cl.mro_activity_id.question,
          helper_text: cl.mro_activity_id.helper_text,
          applicable_standard_ids: cl.mro_activity_id.applicable_standard_ids,
          procedure: cl.mro_activity_id.procedure,
          parent_id: cl.mro_activity_id.parent_id,
          validation_error_msg: cl.mro_activity_id.validation_error_msg,
          validation_length_max: cl.mro_activity_id.validation_length_max,
          validation_length_min: cl.mro_activity_id.validation_length_min,
          validation_max_float_value: cl.mro_activity_id.validation_max_float_value,
          validation_min_float_value: cl.mro_activity_id.validation_min_float_value,
          validation_required: cl.mro_activity_id.validation_required,
          type: cl.mro_activity_id.type,
          labels_ids: cl.mro_activity_id.labels_ids,
          sequence: cl.mro_activity_id.sequence,
        },
        mro_quest_grp_id: cl.question_group_id,
        page_id: cl.page_id,
        value_date: false,
        value_number: 0,
        value_suggested: {},
        value_suggested_ids: [],
        value_text: false,
        type: false,
      }));
      setTaskQuestions(newArrData);
    } else {
      setTaskQuestions([]);
    }
  }, [hxAuditChecklistsInfo]);

  useEffect(() => {
    if (detailData && detailData.state === 'Completed' && taskChecklists && taskChecklists.length) {
      const newArrData = taskChecklists.filter((item) => item.answer);
      const allLen = taskChecklists && taskChecklists.length;
      setLogs({ total: allLen, answer: newArrData.length });
    }
  }, [hxAuditChecklistsInfo]);

  const checkAuditStatus = (val) => (
    <Box>
      {hxAuditStatusJson.map(
        (status) => val === status.status && (
          <Box
            sx={{
              backgroundColor: status.backgroundColor,
              padding: '4px 8px 4px 8px',
              border: 'none',
              borderRadius: '4px',
              color: status.color,
              fontFamily: 'Suisse Intl',
              width: isMob ? 'auto' : 'fit-content',
            }}
          >
            {val}
          </Box>
        ),
      )}
    </Box>
  );

  const getProgressColor = (percentage) => {
    let color = 'secondary';
    if (percentage >= 1 && percentage < 30) {
      color = 'danger';
    }
    if (percentage >= 30 && percentage < 50) {
      color = 'primary';
    }
    if (percentage >= 50 && percentage < 70) {
      color = 'warning';
    }
    if (percentage >= 70 && percentage < 90) {
      color = 'info';
    }
    if (percentage >= 90) {
      color = 'success';
    }
    return color;
  };

  return (
    <>
      {(!isAuthenticated && uuid) && (
      <AccountIdLogin redirectLink={`/audit-checklists/perform/${uuid}`} />
      )}
      {(isAuthenticated && uuid) && (
      <div className="p-1">
        {hxAuditChecklistsInfo && hxAuditChecklistsInfo.loading && (
        <div className="p-5 mt-3">
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
        </div>
        )}
        {hxAuditChecklistsInfo && hxAuditChecklistsInfo.data && (
        <>
          <Box
            sx={AddThemeBackgroundColor({
              width: '100%',
              height: '100%',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            })}
          >
            {isMob && (
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  gap: '10px',
                  width: 'auto',
                  alignItems: 'center',
                  marginBottom: '5px',
                }}
              >
                <Typography
                  sx={{
                    font: 'normal normal normal 20px Suisse Intl',
                    letterSpacing: '1.05px',
                    color: '#FFFFFF',
                  }}
                >
                  {detailData.name}
                </Typography>
                {checkAuditStatus(detailData.state)}
              </Box>
              <Typography
                sx={{
                  font: 'normal normal normal 16px Suisse Intl',
                  letterSpacing: '0.63px',
                  color: '#FFFFFF',
                  marginTop: '10px',
                }}
              >
                {detailData.sequence}
              </Typography>
              <Typography
                sx={{
                  font: 'normal normal normal 14px Suisse Intl',
                  letterSpacing: '0.63px',
                  color: '#FFFFFF',
                  marginTop: '10px',
                }}
              >
                {detailData.audit_system_id && detailData.audit_system_id.name ? detailData.audit_system_id.name : ''}
              </Typography>
              <Typography
                sx={{
                  font: 'normal normal normal 14px Suisse Intl',
                  letterSpacing: '0.63px',
                  color: '#FFFFFF',
                  marginTop: '10px',
                }}
              >
                (
                {getDefaultNoValue(getCompanyTimezoneDate(detailData.planned_start_date, userInfo, 'datetime'))}
                {' '}
                -
                {' '}
                {getDefaultNoValue(getCompanyTimezoneDate(detailData.planned_end_date, userInfo, 'datetime'))}
                )
              </Typography>
            </Box>
            )}
            {!isMob && (
            <Box
              sx={{
                display: 'flex',
                gap: '10px',
                width: '100%',
                alignItems: 'center',
                marginBottom: '5px',
              }}
            >
              <Box
                sx={{
                  width: '40%',
                }}
              >
                <Typography
                  sx={{
                    font: 'normal normal normal 20px Suisse Intl',
                    letterSpacing: '1.05px',
                    color: '#FFFFFF',
                    textDecoration: 'underline',
                  }}
                  className="cursor-pointer"
                  onClick={() => onBack()}
                >
                  {detailData.name}
                </Typography>
                {checkAuditStatus(detailData.state)}
                <Typography
                  sx={{
                    font: 'normal normal normal 16px Suisse Intl',
                    letterSpacing: '0.63px',
                    color: '#FFFFFF',
                    marginTop: '10px',
                  }}
                >
                  {detailData.sequence}
                </Typography>
                <Typography
                  sx={{
                    font: 'normal normal normal 14px Suisse Intl',
                    letterSpacing: '0.63px',
                    color: '#FFFFFF',
                    marginTop: '10px',
                  }}
                >
                  {detailData.audit_system_id && detailData.audit_system_id.name ? detailData.audit_system_id.name : ''}
                  {' '}

                  (
                  {getDefaultNoValue(getCompanyTimezoneDate(detailData.planned_start_date, userInfo, 'datetime'))}
                  {' '}
                  -
                  {' '}
                  {getDefaultNoValue(getCompanyTimezoneDate(detailData.planned_end_date, userInfo, 'datetime'))}
                  )

                </Typography>
              </Box>
              <Box
                sx={{
                  width: '20%',
                }}
              >
                <h6 className="font-family-tab text-center text-white">
                  <Progress
                    value={newpercalculate(logs && logs.total ? logs.total : 0, logs && logs.answer ? logs.answer : 0)}
                    className="w-100 mb-2"
                    color={getProgressColor(newpercalculate(logs && logs.total ? logs.total : 0, logs && logs.answer ? logs.answer : 0))}
                  >
                    {newpercalculate(logs && logs.total ? logs.total : 0, logs && logs.answer ? logs.answer : 0)}
                    {' '}
                    %
                  </Progress>
                  Coverage
                  (
                  {' '}
                  {logs && logs.answer ? logs.answer : 0}
                  {' '}
                  /
                  {' '}
                  {logs && logs.total ? logs.total : 0}
                  {' '}
                  )
                </h6>
                {detailData.audit_spoc_id && detailData.audit_spoc_id.name && (
                <p className="font-family-tab text-center text-white">
                  Audit SPOC:
                  {' '}
                  {detailData.audit_spoc_id && detailData.audit_spoc_id.name ? detailData.audit_spoc_id.name : ''}
                </p>
                )}
              </Box>
              <Box
                sx={{
                  width: '40%',
                  display: 'flex',
                  marginLeft: 'auto',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <p className="font-family-tab text-white cursor-pointer mb-1 mr-2 text-white" onClick={() => onOpenModal('Instructions')}>
                  <FontAwesomeIcon
                    size="md"
                    className="height-15 mr-2"
                    style={{ color: 'white' }}
                    icon={faNewspaper}
                  />
                  Instructions
                  {' '}
                  |
                  {' '}
                </p>
                <p className="font-family-tab text-white cursor-pointer mb-1 text-white" onClick={() => onOpenModal('Terms & Conditions')}>
                  <FontAwesomeIcon
                    size="md"
                    className="height-15 mr-2"
                    style={{ color: 'white' }}
                    icon={faNewspaper}
                  />
                  Terms & Conditions
                </p>
              </Box>
            </Box>
            )}
            <Dialog fullWidth={isMob} maxWidth={isMob ? 'xl' : 'md'} open={viewModal}>
              <DialogHeader title={viewTitle} onClose={() => onCloseModal()} response={false} imagePath={false} />
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  <Markup content={truncateFrontSlashs(truncateStars(viewTitle === 'Instructions' ? detailData.instructions_to_auditor : detailData.terms_and_conditions))} />
                </DialogContentText>
              </DialogContent>
            </Dialog>
            <Dialog fullWidth={isMob} maxWidth={isMob ? 'xl' : 'md'} open={confirmModal}>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  <p className="font-family-tab text-center">Are you sure you want to leave? You have unsaved changes.</p>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  size="medium"
                  variant="contained"
                  className="reset-btn mr-1"
                  onClick={() => onBackConfirm()}
                >
                  Leave
                </Button>
                <Button
                  size="medium"
                  variant="contained"
                  className="mr-1"
                  onClick={() => setConfirmModal(false)}
                >
                  Stay
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
          {(isAllow && (detailData.state === 'Started' || detailData.state === 'Inprogress' || (detailData.state === 'Missed' && canPerform))) && (
          <PerformChecklists setLogs={setLogs} orderCheckLists={taskQuestions} detailData={detailData} />
          )}
          {(isAllow && (detailData.state === 'Upcoming')) && (
          <div className="p-3 text-center">
            <div className="text-center mt-3 mb-3">
              {(hxAuditUpdate && hxAuditUpdate.loading) && (
              <div className="text-center mt-4 mb-4">
                <Loader />
              </div>
              )}
              {(hxAuditUpdate && hxAuditUpdate.err) && (
              <div className="text-center mt-3 mb-3">
                <SuccessAndErrorFormat response={hxAuditUpdate} />
              </div>
              )}
            </div>
            {hxAuditUpdate && !hxAuditUpdate.data && (
            <Button
              size="medium"
              variant="contained"
              disabled={hxAuditUpdate && hxAuditUpdate.loading}
              className="mt-2"
              onClick={() => onStartAudit()}
            >
              Start the Audit
            </Button>
            )}
            {hxAuditUpdate && hxAuditUpdate.data && (
            <Button
              size="medium"
              variant="contained"
              className="mt-2"
              onClick={() => onPerformAudit()}
            >
              Perform the Audit
            </Button>
            )}
          </div>
          )}
          {!(detailData.state === 'Upcoming' || detailData.state === 'Started' || detailData.state === 'Inprogress' || (detailData.state === 'Missed' && canPerform)) && (
          <Stack sx={{ width: '100%', padding: '30px' }} spacing={2}>
            <Alert severity="error">{detailData.state === 'Missed' ? `Oops! The Audit can only perform from ${getDefaultNoValue(getCompanyTimezoneDate(detailData.planned_start_date, userInfo, 'datetime'))} to ${getDefaultNoValue(getCompanyTimezoneDate(detailData.planned_end_date, userInfo, 'datetime'))}` : 'The Audit already performed'}</Alert>
            <Button
              size="medium"
              variant="contained"
              className="mt-2 mr-auto"
              onClick={() => onBackConfirm()}
            >
              Go Home
            </Button>
          </Stack>
          )}
          {!isAllow && (detailData.state === 'Upcoming' || detailData.state === 'Started' || detailData.state === 'Inprogress' || (detailData.state === 'Missed' && canPerform)) && (
          <Stack sx={{ width: '100%', padding: '30px' }} spacing={2}>
            <Alert severity="error">
              {`Oops! The Audit can only perform from ${getDefaultNoValue(getCompanyTimezoneDate(detailData.planned_start_date, userInfo, 'datetime'))} to ${getDefaultNoValue(getCompanyTimezoneDate(detailData.planned_end_date, userInfo, 'datetime'))}`}
              {' '}
            </Alert>
            <Button
              size="medium"
              variant="contained"
              className="mt-2 mr-auto"
              onClick={() => onBackConfirm()}
            >
              Go Home
            </Button>
          </Stack>
          )}
        </>
        )}
        {hxAuditChecklistsInfo && hxAuditChecklistsInfo.err && (
        <Stack sx={{ width: '100%', padding: '30px' }} spacing={2}>
          <Alert severity="error">Oops something went wrong.</Alert>
          <Button
            size="medium"
            variant="contained"
            className="mt-2 mr-auto"
            onClick={() => onBackConfirm()}
          >
            Go Home
          </Button>
        </Stack>
        )}
      </div>
      )}
    </>
  );
};

ResponsiveAudit.defaultProps = {
  match: false,
};

ResponsiveAudit.propTypes = {
  match: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]),
};

export default ResponsiveAudit;
