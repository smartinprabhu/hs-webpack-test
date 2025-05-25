/* eslint-disable max-len */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  CardBody,
  Col,
  Row,
  FormGroup, Label, Input,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import {
  Box, Button, Checkbox,
} from '@mui/material';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';

import idcardIcon from '@images/icons/workPermitBlack.svg';
import closeCircleRed from '@images/icons/closeCircleRed.svg';
import checkGreen from '@images/icons/checkGreen.svg';
import closeCircle from '@images/icons/closeCircle.svg';
import closeCircleWhite from '@images/icons/closeCircleWhite.svg';
import checkWhite from '@images/icons/checkWhite.svg';

import AuthService from '../util/authService';
import WpBasicDetails from './wpBasicDetails/wpBasicDetails';
import Checklists from './checklists/checklists';

import ChecklistDetails from './wpBasicDetails/checklistDetails';
import SpareParts from './wpBasicDetails/spareParts';
import CloseWp from './checklists/closeWp';
import RejectWp from './checklists/rejectWp';
import { getExportLogo } from '../util/getDynamicClientData';
import AccountIdLogin from '../auth/accountIdLogin';
import { getCustomButtonName, getCustomStatusName } from '../workPermit/utils/utils';

import {
  getDefaultNoValue,
  extractNameObject,
  getAccountIdFromUrl,
} from '../util/appUtils';
import { AddThemeColor } from '../themes/theme';

const appConfig = require('../config/appConfig').default;
const appModels = require('../util/appModels').default;

const PublicWorkPermit = (props) => {
  const { match } = props;
  const { params } = match;
  const { suuid, ruuid } = params;
  const accid = getAccountIdFromUrl(props);
  const [isButtonHover, setButtonHover] = useState(false);
  const [vpConfig, setVpConfig] = useState({ loading: false, data: null, err: null });
  const [statusInfo, setStatusInfo] = useState({ loading: false, data: null, err: null });
  const [wpConfig, setWpConfig] = useState({ loading: false, data: null, err: null });
  const [taskConfig, setTaskConfig] = useState({ loading: false, data: null, err: null });

  const [checklistModal, setChecklistModal] = useState(false);
  const [loginRedirect, setLoginRedirect] = useState(false);
  const [closeModal, setCloseModal] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');
  const [rejectModal, setRejectModal] = useState(false);
  const [isAgree, setIsAgree] = useState(false);
  const [poRef, setPoRef] = useState(false);
  const [vpConfigParts, setVpConfigParts] = useState({ loading: false, data: null, err: null });

  const [rejectReason, setRejectReason] = useState('');

  const [taskQuestions, setTaskQuestions] = useState([]);

  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;

  document.title = 'HELIX SENSE | Work Permit';

  const oneSignalDiv = document.getElementById('onesignal-bell-container');
  const stickyFooter = document.getElementById('sticky_footer');

  if (oneSignalDiv) {
    oneSignalDiv.style.display = 'none';
  }

  if (stickyFooter) {
    stickyFooter.style.display = 'none';
  }

  const authService = AuthService();
  const isAuthenticated = authService.getRefreshToken();

  useEffect(() => {
    if (ruuid && !isAuthenticated && suuid) {
      setVpConfig({
        loading: true, data: null, count: 0, err: null,
      });
      const fields = '["id","name","order_state",("task_id", ["id", "name"]),"uuid","reference","vendor_poc","no_vendor_technicians","state","type","type_of_request","planned_start_time","planned_end_time","duration","vendor_email","vendor_mobile","job_description","ehs_instructions","terms_conditions",("company_id", ["id", "name"]),("order_id", ["id", "write_date", "checklist_json_data", "review_status", "name", "date_start_execution", "date_execution", ["check_list_ids", ["id", "answer_common", "type","answer_type", "value_number", "value_text", ("value_suggested", ["id", "value"]), "value_date", "write_date", ["value_suggested_ids", ["id","value"]], ("mro_activity_id", ["id", "type", "name", "sequence", "has_attachment", "is_attachment_mandatory", "constr_mandatory", "validation_required","validation_length_max","validation_length_min","validation_max_float_value","validation_min_float_value","constr_error_msg","validation_error_msg","is_enable_condition",("parent_id", ["id", "name"]),["labels_ids", ["id","value","favicon","color","emoji"]],["based_on_ids", ["id"]]]), ("user_id", ["id", "name"]), ("mro_quest_grp_id", ["id", "name"])]],["parts_lines", ["id",("parts_id", ["id", "name","qty_available"]), "parts_qty", "received_qty", "used_qty"]],["preparedness_checklist_lines", ["id", "answer_common", "type", "answer_type", "value_number", "value_text", ("value_suggested", ["id", "value"]), "value_date", "write_date", ["value_suggested_ids", ["id","value"]], ("mro_activity_id", ["id", "type", "name", "sequence", "has_attachment", "is_attachment_mandatory", "constr_mandatory", "validation_required","validation_length_max","validation_length_min","validation_max_float_value","validation_min_float_value","constr_error_msg","validation_error_msg","is_enable_condition",("parent_id", ["id", "name"]),["labels_ids", ["id","value","favicon","color","emoji"]],["based_on_ids", ["id"]]]), ("user_id", ["id", "name"]), ("mro_quest_grp_id", ["id", "name"])]]]),("maintenance_team_id", ["id", "name"]),("equipment_id", ["id", "name", ("location_id", ["id", "path_name"])]),("space_id", ["id", "name", "path_name","space_name"]),("type_work_id", ["id", "name"]),("department_id", ["id", "name"]),("vendor_id", ["id", "name"]),("requestor_id", ["id", "name"]),("nature_work_id", ["id", "name"]),["parts_lines", ["id", ("parts_id", ["id", "name","qty_available"]), ("parts_uom", ["id", "name"]), "parts_qty", "name"]]]';
      const payload = `domain=[["uuid","=","${ruuid}"]]&model=${appModels.WORKPERMIT}&fields=${fields}&offset=0&limit=1&portalDomain=${window.location.origin}`;

      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}public/api/v4/search?${payload}`,
        headers: {
          portalDomain: window.location.origin,
          accountId: accid,
        },
      };

      axios(config)
        .then((response) => setVpConfig({
          loading: false, data: response.data.data, count: response.data.length, err: null,
        }))
        .catch((error) => {
          setVpConfig({
            loading: false, data: null, count: 0, err: error,
          });
        });
    }
  }, [ruuid, isAuthenticated]);

  const detailData = vpConfig && vpConfig.data && vpConfig.data.length ? vpConfig.data[0] : '';
  const detailDataParts = vpConfigParts && vpConfigParts.data && vpConfigParts.data.length ? vpConfigParts.data[0] : false;
  const wpConfigData = wpConfig && wpConfig.data && wpConfig.data.length ? wpConfig.data[0] : '';

  const isEhs = wpConfigData && wpConfigData.is_ehs_required;
  const isReviewRequired = wpConfigData && wpConfigData.review_required;

  const isIssuePermit = isEhs && detailData.state === 'Issued Permit';
  const isValidated = (!isEhs && detailData.state === 'Issued Permit') || detailData.state === 'Validated';

  useEffect(() => {
    if (detailData && detailData.company_id && detailData.company_id.id) {
      setWpConfig({
        loading: true, data: null, count: 0, err: null,
      });

      const fields = '["id","po_reference","is_enable_type_of_work","edit_actual_start_dt","edit_actual_end_dt","is_enable_department","is_parts_required", "is_prepared_required", "is_ehs_required", "review_required","approved_button","approved_status","cancel_button","cancel_status","closed_button","closed_status","issued_permit_button","issued_permit_status","on_hold_button","on_hold_status","permit_rejected_button","permit_rejected_status","prepared_button","prepared_status","requested_button","requested_status","validated_button","validated_status","work_in_progress_button","work_in_progress_status"]';
      const payload = `domain=[["company_id","=",${detailData.company_id.id}]]&model=mro.work_permit_configuration&fields=${fields}&offset=0&limit=1&portalDomain=${window.location.origin}`;

      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}public/api/v4/search?${payload}`,
        headers: {
          portalDomain: window.location.origin,
          accountId: accid,
        },
      };

      axios(config)
        .then((response) => setWpConfig({
          loading: false, data: response.data.data, count: response.data.length, err: null,
        }))
        .catch((error) => {
          setWpConfig({
            loading: false, data: null, count: 0, err: error,
          });
        });
    }
  }, [vpConfig]);

  useEffect(() => {
    if (detailData && detailData.task_id && detailData.task_id.id) {
      setTaskConfig({
        loading: true, data: null, count: 0, err: null,
      });

      const fields = '["id", "name", ["check_list_ids", ["id", ("check_list_id", ["id", ["activity_lines", ["id","name", "sequence", "type", ("mro_quest_grp_id", ["id", "name"]),"has_attachment", "is_attachment_mandatory", "constr_mandatory", "validation_required","validation_length_max","is_multiple_line","validation_length_min","validation_max_float_value","validation_min_float_value","constr_error_msg","validation_error_msg","is_enable_condition",("parent_id", ["id", "name"]),["labels_ids", ["id","value","favicon","color","emoji"]],["based_on_ids", ["id"]]]]])]]]';
      const payload = `domain=[["id","=",${detailData.task_id.id}]]&model=mro.task&fields=${fields}&offset=0&limit=1&portalDomain=${window.location.origin}`;

      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}public/api/v4/search?${payload}`,
        headers: {
          portalDomain: window.location.origin,
          accountId: accid,
        },
      };

      axios(config)
        .then((response) => setTaskConfig({
          loading: false, data: response.data.data, count: response.data.length, err: null,
        }))
        .catch((error) => {
          setTaskConfig({
            loading: false, data: null, count: 0, err: error,
          });
        });
    }
  }, [vpConfig]);

  const taskData = taskConfig && taskConfig.data && taskConfig.data.length ? taskConfig.data[0] : false;
  const taskChecklists = taskData && taskData.check_list_ids && taskData.check_list_ids.length && taskData.check_list_ids[0].check_list_id && taskData.check_list_ids[0].check_list_id.activity_lines && taskData.check_list_ids[0].check_list_id.activity_lines.length ? taskData.check_list_ids[0].check_list_id.activity_lines : false;

  useEffect(() => {
    if (taskChecklists) {
      const newArrData = taskChecklists.map((cl) => ({
        id: cl.id,
        answer_type: cl.type,
        answer_common: false,
        mro_activity_id: {
          based_on_ids: cl.based_on_ids,
          constr_error_msg: cl.constr_error_msg,
          constr_mandatory: cl.constr_mandatory,
          has_attachment: cl.has_attachment,
          is_attachment_mandatory: cl.is_attachment_mandatory,
          id: cl.id,
          is_enable_condition: cl.is_enable_condition,
          name: cl.name,
          parent_id: cl.parent_id,
          validation_error_msg: cl.validation_error_msg,
          validation_length_max: cl.validation_length_max,
          is_multiple_line: cl.is_multiple_line,
          validation_length_min: cl.validation_length_min,
          validation_max_float_value: cl.validation_max_float_value,
          validation_min_float_value: cl.validation_min_float_value,
          validation_required: cl.validation_required,
          type: cl.type,
          labels_ids: cl.labels_ids,
          sequence: cl.sequence,
        },
        mro_quest_grp_id: cl.mro_quest_grp_id,
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
  }, [taskConfig]);

  useEffect(() => {
    if (statusInfo && statusInfo.data && suuid && ruuid && detailData && detailData.state && (isValidated || detailData.state === 'Work In Progress')) {
      setVpConfig({
        loading: true, data: null, count: 0, err: null,
      });

      const fields = '["id","name","order_state","uuid",("task_id", ["id", "name"]),"reference","vendor_poc","no_vendor_technicians","state","type","type_of_request","planned_start_time","planned_end_time","duration","vendor_email","vendor_mobile","job_description","ehs_instructions","terms_conditions",("company_id", ["id", "name"]),("order_id", ["id", "write_date", "checklist_json_data", "name", "review_status", "date_start_execution", "date_execution", ["check_list_ids", ["id", "answer_common", "type","answer_type", "value_number", "value_text", ("value_suggested", ["id", "value"]), "value_date", "write_date", ["value_suggested_ids", ["id","value"]], ("mro_activity_id", ["id", "type", "sequence", "name", "has_attachment", "is_attachment_mandatory", "constr_mandatory", "validation_required","validation_length_max","is_multiple_line","validation_length_min","validation_max_float_value","validation_min_float_value","constr_error_msg","validation_error_msg","is_enable_condition",("parent_id", ["id", "name"]),["based_on_ids", ["id"]]]), ("user_id", ["id", "name"]), ("mro_quest_grp_id", ["id", "name"])]],["parts_lines", ["id",("parts_id", ["id", "name","qty_available"]), "parts_qty", "received_qty", "used_qty"]],["preparedness_checklist_lines", ["id", "answer_common", "type", "answer_type", "value_number", "value_text", ("value_suggested", ["id", "value"]), "value_date", "write_date", ["value_suggested_ids", ["id","value"]], ("mro_activity_id", ["id", "type", "name", "sequence", "has_attachment", "is_attachment_mandatory", "constr_mandatory", "validation_required","validation_length_max","is_multiple_line","validation_length_min","validation_max_float_value","validation_min_float_value","constr_error_msg","validation_error_msg","is_enable_condition",("parent_id", ["id", "name"]),["labels_ids", ["id","value","favicon","color","emoji"]],["based_on_ids", ["id"]]]), ("user_id", ["id", "name"]), ("mro_quest_grp_id", ["id", "name"])]]]),("maintenance_team_id", ["id", "name"]),("equipment_id", ["id", "name", ("location_id", ["id", "path_name"])]),("space_id", ["id", "name", "path_name","space_name"]),("type_work_id", ["id", "name"]),("department_id", ["id", "name"]),("vendor_id", ["id", "name"]),("requestor_id", ["id", "name"]),("nature_work_id", ["id", "name"]), ["parts_lines", ["id", ("parts_id", ["id", "name","qty_available"]), ("parts_uom", ["id", "name"]), "parts_qty", "name"]]]';
      const payload = `domain=[["uuid","=","${ruuid}"]]&model=${appModels.WORKPERMIT}&fields=${fields}&offset=0&limit=1&portalDomain=${window.location.origin}`;

      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}public/api/v4/search?${payload}`,
        headers: {
          portalDomain: window.location.origin,
          accountId: accid,
        },
      };

      axios(config)
        .then((response) => setVpConfig({
          loading: false, data: response.data.data, count: response.data.length, err: null,
        }))
        .catch((error) => {
          setVpConfig({
            loading: false, data: null, count: 0, err: error,
          });
        });
    }
  }, [statusInfo]);

  const statusUpdate = (statusValue, poNum) => {
    if (ruuid) {
      setStatusInfo({ loading: true, data: null, err: null });
      let postDataValues = {
        state: statusValue,
      };

      if (poNum) {
        postDataValues = {
          state: statusValue,
          po_reference: poNum,
        };
      }

      const data = {
        uuid: ruuid,
        values: postDataValues,
      };

      const postData = new FormData();
      postData.append('values', JSON.stringify(data.values));
      if (typeof payload === 'object') {
        Object.keys(data).map((payloadObj) => {
          if (payloadObj !== 'uuid') {
            postData.append(payloadObj, data[payloadObj]);
          }
          return postData;
        });
      }
      postData.append('uuid', data.uuid);
      const config = {
        method: 'post',
        url: `${WEBAPPAPIURL}public/api/v4/wp/updateWPSStatus`,
        headers: {
          'Content-Type': 'multipart/form-data',
          portalDomain: window.location.origin,
          accountId: accid,
        },
        data: postData,
      };

      axios(config)
        .then((response) => setStatusInfo({ loading: false, data: response.data.data, err: null }))
        .catch((error) => {
          setStatusInfo({ loading: false, data: null, err: error });
        });
    }
  };

  const statusRejectUpdate = (statusValue, reason) => {
    if (ruuid) {
      setStatusInfo({ loading: true, data: null, err: null });
      const postDataValues = {
        state: statusValue,
        reason,
      };

      const data = {
        uuid: ruuid,
        values: postDataValues,
      };

      const postData = new FormData();
      postData.append('values', JSON.stringify(data.values));
      if (typeof payload === 'object') {
        Object.keys(data).map((payloadObj) => {
          if (payloadObj !== 'uuid') {
            postData.append(payloadObj, data[payloadObj]);
          }
          return postData;
        });
      }
      postData.append('uuid', data.uuid);

      const config = {
        method: 'post',
        url: `${WEBAPPAPIURL}public/api/v4/wp/updateWPSStatus`,
        headers: {
          'Content-Type': 'multipart/form-data',
          portalDomain: window.location.origin,
          accountId: accid,
        },
        data: postData,
      };

      axios(config)
        .then((response) => setStatusInfo({ loading: false, data: response.data.data, err: null }))
        .catch((error) => {
          setStatusInfo({ loading: false, data: null, err: error });
        });
    }
  };

  const onClose = () => {
    setChecklistModal(false);
  };

  const onDone = () => {
    statusUpdate('Prepared');
    setChecklistModal(false);
  };

  const onWoDone = () => {
    statusUpdate(isReviewRequired ? 'Work In Progress' : 'Closed');
    setChecklistModal(false);
  };

  const onWoClose = () => {
    setCloseModal(false);
  };

  const onCloseDone = () => {
    statusUpdate('Closed');
    setCloseModal(false);
  };

  const onRejectClose = () => {
    setRejectModal(false);
    setRejectReason('');
  };

  const onRejectDone = () => {
    setUpdateStatus('Rejected');
    statusRejectUpdate('Permit Rejected', rejectReason);
    setRejectModal(false);
  };

  const onAgreeChange = (e) => {
    if (e.target.checked) {
      setIsAgree(true);
    } else {
      setIsAgree(false);
    }
  };

  const sortSections = (dataSections) => {
    const dataSectionsNew = dataSections.sort(
      (a, b) => a.mro_activity_id.sequence - b.mro_activity_id.sequence,
    );
    return dataSectionsNew;
  };

  const onPoChange = (e) => {
    setPoRef(e.target.value);
  };

  const onSuccessChange = () => {
    if (ruuid && !isAuthenticated && suuid) {
      setVpConfigParts({
        loading: true, data: null, count: 0, err: null,
      });
      const fields = '["id","name","order_state","uuid",("task_id", ["id", "name"]),"reference","vendor_poc","no_vendor_technicians","state","type","type_of_request","planned_start_time","planned_end_time","duration","vendor_email","vendor_mobile","job_description","ehs_instructions","terms_conditions",("company_id", ["id", "name"]),("order_id", ["id", "write_date", "checklist_json_data", "review_status", "name", "date_start_execution", "date_execution", ["check_list_ids", ["id", "answer_common", "type","answer_type", "value_number", "value_text", ("value_suggested", ["id", "value"]), "value_date", "write_date", ["value_suggested_ids", ["id","value"]], ("mro_activity_id", ["id", "type", "name", "sequence", "has_attachment", "is_attachment_mandatory", "constr_mandatory", "validation_required","validation_length_max","is_multiple_line","validation_length_min","validation_max_float_value","validation_min_float_value","constr_error_msg","validation_error_msg","is_enable_condition",("parent_id", ["id", "name"]),["labels_ids", ["id","value","favicon","color","emoji"]],["based_on_ids", ["id"]]]), ("user_id", ["id", "name"]), ("mro_quest_grp_id", ["id", "name"])]],["parts_lines", ["id",("parts_id", ["id", "name","qty_available"]), "parts_qty", "received_qty", "used_qty"]],["preparedness_checklist_lines", ["id", "answer_common", "type", "answer_type", "value_number", "value_text", ("value_suggested", ["id", "value"]), "value_date", "write_date", ["value_suggested_ids", ["id","value"]], ("mro_activity_id", ["id", "type", "name", "sequence", "has_attachment", "is_attachment_mandatory", "constr_mandatory", "validation_required","validation_length_max","is_multiple_line","validation_length_min","validation_max_float_value","validation_min_float_value","constr_error_msg","validation_error_msg","is_enable_condition",("parent_id", ["id", "name"]),["labels_ids", ["id","value","favicon","color","emoji"]],["based_on_ids", ["id"]]]), ("user_id", ["id", "name"]), ("mro_quest_grp_id", ["id", "name"])]]]),("maintenance_team_id", ["id", "name"]),("equipment_id", ["id", "name", ("location_id", ["id", "path_name"])]),("space_id", ["id", "name", "path_name","space_name"]),("type_work_id", ["id", "name"]),("department_id", ["id", "name"]),("vendor_id", ["id", "name"]),("requestor_id", ["id", "name"]),("nature_work_id", ["id", "name"]),["parts_lines", ["id", ("parts_id", ["id", "name","qty_available"]), ("parts_uom", ["id", "name"]), "parts_qty", "name"]]]';
      const payload = `domain=[["uuid","=","${ruuid}"]]&model=${appModels.WORKPERMIT}&fields=${fields}&offset=0&limit=1&portalDomain=${window.location.origin}`;

      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}public/api/v4/search?${payload}`,
        headers: {
          portalDomain: window.location.origin,
          accountId: accid,
        },
      };

      axios(config)
        .then((response) => setVpConfigParts({
          loading: false, data: response.data.data, count: response.data.length, err: null,
        }))
        .catch((error) => {
          setVpConfigParts({
            loading: false, data: null, count: 0, err: error,
          });
        });
    }
  };

  function getActionName(aname) {
    let res = '';
    if (aname === 'Prepared') {
      res = 'Issue Permit';
    } else if (aname === 'Issued Permit') {
      res = 'Validate';
    } else if (aname === 'Work In Progress') {
      res = 'Review';
    }
    return res;
  }

  function getActionTitle(aname, vendor) {
    let res = '';
    if (aname === 'Requested') {
      if (getCustomStatusName('Requested', wpConfigData) !== 'Requested') {
        res = `Work Permit - ${getCustomStatusName('Requested', wpConfigData)}`;
      } else {
        res = 'Work Permit Request';
      }
    } else if (aname === 'Approved') {
      if (getCustomStatusName('Approved', wpConfigData) !== 'Approved') {
        res = `Work Permit - ${getCustomStatusName('Approved', wpConfigData)}`;
      } else {
        res = 'Work Permit Approve';
      }
    } else if (aname === 'Prepared') {
      if (getCustomStatusName('Prepared', wpConfigData) !== 'Prepared') {
        res = `Work Permit - ${getCustomStatusName('Prepared', wpConfigData)}`;
      } else {
        res = `Work Permit Readiness Questionnaire from ${vendor}`;
      }
    } else if (aname === 'Issued Permit') {
      if (!isEhs) {
        res = 'Work Permit Ready to Start';
      } else if (isEhs) {
        if (getCustomStatusName('Validated', wpConfigData) !== 'Validated') {
          res = `Work Permit - ${getCustomStatusName('Validated', wpConfigData)}`;
        } else {
          res = 'Work Permit Requires EHS Validation';
        }
      }
    } else if (aname === 'Validated') {
      res = 'Work Permit Ready to Start';
    } else if (aname === 'Work In Progress') {
      res = 'Work Permit Review';
    } else if (aname === 'Closed') {
      if (getCustomStatusName('Closed', wpConfigData) !== 'Closed') {
        res = `Work Permit - ${getCustomStatusName('Closed', wpConfigData)}`;
      } else {
        res = 'Work Permit Closed';
      }
    } else if (aname === 'Permit Rejected') {
      if (getCustomStatusName('Permit Rejected', wpConfigData) !== 'Permit Rejected') {
        res = `Work Permit - ${getCustomStatusName('Permit Rejected', wpConfigData)}`;
      } else {
        res = 'Work Permit Rejected';
      }
    }
    return res;
  }

  function getActionDesc(aname, company, vendor) {
    let res = '';
    if (aname === 'Requested') {
      res = `${company} has requested you to ${getCustomButtonName('Approve', wpConfigData)} the work permit. Please click on the link below to review and ${getCustomButtonName('Approve', wpConfigData)}/${getCustomButtonName('Permit Rejected', wpConfigData)}.`;
    } else if (aname === 'Approved' && detailData.order_id && detailData.order_id.preparedness_checklist_lines && detailData.order_id.preparedness_checklist_lines.length) {
      res = `${company} has requested ${vendor} to complete the work permit readiness checklist. Please click on the link below to complete the readiness questionnaire.`;
    } else if (aname === 'Prepared') {
      res = `The ${vendor} has submitted the readiness questionnaire. Please click on the link below to review and issue permit. This requires login to the system.`;
    } else if (aname === 'Issued Permit') {
      if (!isEhs) {
        res = `${vendor} can commence the work and complete the work. You may add the evidences of work completion on the checklist below.`;
      } else if (isEhs) {
        if (getCustomStatusName('Validated', wpConfigData) !== 'Validated') {
          res = `Work Permit - ${getCustomStatusName('Validated', wpConfigData)}. This requires login to the system for further action.`;
        } else {
          res = 'The permit requires EHS Validation. Please click on the link below to validate the readiness to perform the work. This requires login to the system.';
        }
      }
    } else if (aname === 'Validated') {
      res = `${vendor} can commence the work and complete the work. You may add the evidences of work completion on the checklist below.`;
    } else if (aname === 'Work In Progress' && detailData.order_id && !detailData.order_id.review_status) {
      res = 'Reviewer is requested to Review the work completed by the vendor. This requires login to the system.';
    } else if (aname === 'Work In Progress' && detailData.order_id && detailData.order_id.review_status) {
      res = 'Reviewer was Reviewed the work completed by the vendor. Please click on the button below to complete the Work Permit.';
    } else if (aname === 'Closed') {
      res = 'This work permit has been completed.';
    }
    return res;
  }

  if (isAuthenticated && ruuid) {
    return (
      <Redirect to={{
        pathname: `/workpermits/${ruuid}`,
        state: { referrer: 'view', ruuid },
      }}
      />
    );
  }

  /* if (!isAuthenticated && ruuid && (detailData.state === 'Prepared' || detailData.state === 'Issued Permit')) {
    return (
      <Redirect to={{
        pathname: '/visitormanagement/visitrequest',
        state: { referrer: 'view-request', ruuid },
      }}
      />
    );
  } */

  const loading = (statusInfo && statusInfo.loading);

  return (
    <>
      {(loginRedirect && !isAuthenticated && ruuid && detailData && (detailData.state === 'Work In Progress' || detailData.state === 'Prepared' || isIssuePermit)) && (
        <AccountIdLogin redirectLink={`/workpermits/${ruuid}`} />
      )}
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
        <Row className={(loginRedirect && !isAuthenticated && ruuid && detailData && (detailData.state === 'Work In Progress' || detailData.state === 'Prepared' || detailData.state === 'Issued Permit')) ? '' : 'ml-1 mr-1 external-link-tickets mt-2 mb-2 p-3'}>
          {vpConfig && vpConfig.data && vpConfig.count > 0 && !loginRedirect && (
            <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12">
              <>
                <CardBody className="p-2 mb-3 bg-ghost-white">
                  <Row className="content-center">
                    <Col md="1" sm="2" lg="1" xs="2">
                      <img src={idcardIcon} alt="buildingBlack" className="mr-2" width="35" height="35" />
                    </Col>
                    <Col md="9" sm="8" lg="8" xs="8">
                      <p className="mb-1 mt-0">
                        {getDefaultNoValue(extractNameObject(detailData.company_id, 'name'))}
                        {' '}
                        -
                        {' '}
                        {getActionTitle(detailData.state, detailData.vendor_id && detailData.vendor_id.name ? detailData.vendor_id.name : '')}
                      </p>
                    </Col>
                    <Col className="pr-3 pl-0" md="2" sm="2" lg="2" xs="2">
                      <img
                        src={getExportLogo()}
                        width="140"
                        height="auto"
                        className="d-inline-block align-top pr-2"
                        alt="Helixsense Portal"
                      />
                    </Col>
                  </Row>
                </CardBody>
                <div className="text-center mt-2 mb-2">
                  <p className="font-tiny" style={AddThemeColor({})}>{getActionDesc(detailData.state, detailData.company_id && detailData.company_id.name ? detailData.company_id.name : '', detailData.vendor_id && detailData.vendor_id.name ? detailData.vendor_id.name : '')}</p>
                  <div className="text-center mt-1 mb-1">
                    {(statusInfo && statusInfo.err) && (
                      <div className="text-center mt-3 mb-3">
                        <SuccessAndErrorFormat response={statusInfo} />
                      </div>
                    )}
                    {(statusInfo && statusInfo.loading) && (
                      <div className="text-center mt-4 mb-4">
                        <Loader />
                      </div>
                    )}
                    {statusInfo && statusInfo.data && detailData.state === 'Requested' && (
                      <>
                        <img src={checkGreen} className="mr-2" alt="Approved" width="30" height="30" />
                        <h5 className="text-success">
                          This work permit has
                          {'  '}
                          been
                          {' '}
                          {getCustomStatusName(updateStatus, wpConfigData)}
                        </h5>
                      </>
                    )}
                    {statusInfo && statusInfo.data && detailData.state === 'Approved' && (
                      <>
                        <img src={checkGreen} className="mr-2" alt="Prepared" width="30" height="30" />
                        <h5 className="text-success">
                          This work permit has
                          {'  '}
                          been
                          {' '}
                          {getCustomStatusName('Prepared', wpConfigData)}
                        </h5>
                      </>
                    )}
                    {statusInfo && statusInfo.data && isValidated && (
                      <>
                        <img src={checkGreen} className="mr-2" alt="Prepared" width="30" height="30" />
                        <h5 className="text-success">
                          This work permit has
                          {'  '}
                          been
                          {' '}
                          {getCustomStatusName('Work In Progress', wpConfigData)}
                        </h5>
                      </>
                    )}
                    {statusInfo && statusInfo.data && detailData.state === 'Work In Progress' && (detailData.order_id && !detailData.order_id.review_status) && (
                      <>
                        <img src={checkGreen} className="mr-2" alt="Prepared" width="30" height="30" />
                        <h5 className="text-success">
                          This work permit has
                          {'  '}
                          been
                          {' '}
                          {getCustomStatusName('Work In Progress', wpConfigData)}
                        </h5>
                      </>
                    )}
                    {statusInfo && statusInfo.data && detailData.state === 'Closed' && (detailData.order_id && detailData.order_id.review_status === 'Done') && (
                      <>
                        <img src={checkGreen} className="mr-2" alt="Prepared" width="30" height="30" />
                        <h5 className="text-success">
                          This work permit has
                          {'  '}
                          been
                          {' '}
                          {getCustomStatusName('Closed', wpConfigData)}
                        </h5>
                      </>
                    )}
                  </div>
                  {!loading && detailData.state === 'Requested' && (statusInfo && !statusInfo.data) && (
                    <>
                      {wpConfigData && wpConfigData.po_reference !== 'None' && (
                        <FormGroup>
                          <Label for="poRef">
                            PO Reference
                            {wpConfigData.po_reference === 'Required' && (
                              <span className="ml-1">*</span>
                            )}
                          </Label>
                          <Input type="text" name="poRef" maxLength={20} onChange={onPoChange} />
                        </FormGroup>
                      )}
                      <Button
                        size="medium"
                        onClick={() => { setRejectReason(''); setRejectModal(true); }}
                        disabled={statusInfo && statusInfo.loading}
                        onMouseLeave={() => setButtonHover(false)}
                        onMouseEnter={() => setButtonHover(true)}
                        variant="contained"
                        color="error"
                      >
                        <span className="page-actions-header content-center">
                          <img src={isButtonHover ? closeCircleWhite : closeCircle} className="mr-2" alt="Deny" width="13" height="13" />
                          <span>{getCustomButtonName('Permit Rejected', wpConfigData)}</span>
                        </span>
                      </Button>
                      <Button
                        size="medium"
                        disabled={(statusInfo && statusInfo.loading) || (wpConfigData && wpConfigData.po_reference === 'Required' && !poRef)}
                        onClick={() => { setUpdateStatus('Approved'); statusUpdate('Approved', poRef); }}
                        variant="contained"
                      >
                        <img src={checkWhite} className="mr-2" alt="Approved" width="13" height="13" />
                        <span>{getCustomButtonName('Approve', wpConfigData)}</span>
                      </Button>
                      <div className="text-grey font-tiny mt-3">
                        NB: After
                        {' '}
                        {getCustomStatusName('Approved', wpConfigData)}
                        , the vendor will receive an email with link to update readiness checklist.
                      </div>
                    </>
                  )}
                  {!loading && detailData.state === 'Approved' && (statusInfo && !statusInfo.data) ? (
                    <>
                      {detailData.order_id && detailData.order_id.preparedness_checklist_lines && detailData.order_id.preparedness_checklist_lines.length ? (
                        <>
                          <Button
                            size="medium"
                            disabled={!(isAgree)}
                            onClick={() => setChecklistModal(true)}
                            variant="contained"
                          >
                            <span>Complete Readiness Checklist</span>
                          </Button>
                          {!isAgree && (
                            <p className="text-danger font-tiny mt-2">
                              Read and agree Terms & Conditions given below to complete readiness checklist.
                            </p>
                          )}
                        </>
                      )
                        : (
                          <Button
                            size="medium"
                            disabled={!(isAgree)}
                            variant="contained"
                            onClick={() => onDone()}
                          >
                            <span>{getCustomButtonName('Prepare', wpConfigData)}</span>
                          </Button>
                        )}
                    </>
                  ) : ''}
                  {!loading && isValidated && (statusInfo && !statusInfo.data) && (
                    <Button
                      size="medium"
                      onClick={() => setChecklistModal(true)}
                      variant="contained"
                    >
                      <span>Fill Work Checklist</span>
                    </Button>
                  )}
                  {!loading && (detailData) && detailData.state === 'Work In Progress' && detailData.order_id && detailData.order_id.review_status === 'Done' && (
                    <Button
                      size="medium"
                      onClick={() => setCloseModal(true)}
                      variant="contained"
                    >
                      <span>Complete Work</span>
                    </Button>
                  )}
                  {!loading && ((detailData.state === 'Work In Progress' && detailData.order_id && !detailData.order_id.review_status) || detailData.state === 'Prepared' || isIssuePermit) && (
                    <Button
                      size="medium"
                      onClick={() => setLoginRedirect(true)}
                      variant="contained"
                    >
                      <span>{getCustomButtonName(getActionName(detailData.state), wpConfigData)}</span>
                    </Button>
                  )}
                </div>
                <hr className="mt-0" />
                <div className="mt-2">
                  <WpBasicDetails detailData={vpConfig} wpConfigData={wpConfigData} />
                  {!loading && detailData.state === 'Approved' && (statusInfo && !statusInfo.data) && (
                    <div className="text-center m-2">
                      <Checkbox onChange={onAgreeChange} />
                      <Label>I Agree</Label>
                    </div>
                  )}
                  {(detailData.state === 'Requested' && wpConfigData && wpConfigData.is_parts_required) && (
                    <>
                      <hr className="mb-1 mt-1" />
                      <SpareParts
                        workPermitDetail={detailDataParts ? vpConfigParts : vpConfig}
                        workPermitConfig={wpConfigData}
                        ruuid={ruuid}
                        accid={accid}
                        updateStatus={updateStatus}
                        atSuccess={() => onSuccessChange()}
                      />
                    </>
                  )}
                  {((detailData.state === 'Prepared' || detailData.state === 'Work In Progress') && wpConfigData && wpConfigData.is_prepared_required && detailData.order_id && detailData.order_id.preparedness_checklist_lines && detailData.order_id.preparedness_checklist_lines.length > 0) && (
                    <>
                      <hr className="mb-1 mt-1" />
                      <ChecklistDetails
                        title="Readiness Checklists"
                        checklistJsonData={false}
                        checklists={detailData.order_id.preparedness_checklist_lines}
                        orderStatus={detailData.order_state}
                        orderDate={detailData.order_id.write_date}
                        accid={accid}
                      />
                    </>
                  )}
                  {(detailData.state === 'Closed' || detailData.state === 'Work In Progress') && (
                    <>
                      <hr className="mb-1 mt-1" />
                      <ChecklistDetails
                        title="Work Checklists"
                        checklistJsonData={detailData.order_id && detailData.order_id.checklist_json_data ? detailData.order_id.checklist_json_data : false}
                        checklists={detailData.order_id && detailData.order_id.check_list_ids ? detailData.order_id.check_list_ids : []}
                        orderStatus={detailData.order_state}
                        orderDate={detailData.order_id.write_date}
                        accid={accid}
                      />
                    </>
                  )}
                  {checklistModal && detailData.state === 'Approved' && wpConfigData && wpConfigData.is_prepared_required && (statusInfo && !statusInfo.data) && (
                    <Checklists
                      orderCheckLists={detailData.order_id && detailData.order_id.preparedness_checklist_lines ? sortSections(detailData.order_id.preparedness_checklist_lines) : []}
                      detailData={detailData}
                      atReject={() => onClose()}
                      atDone={() => onDone()}
                      statusInfo={statusInfo}
                      wpConfigData={wpConfigData}
                      spareParts={detailData.order_id && detailData.order_id.parts_lines ? detailData.order_id.parts_lines : []}
                      fieldValue="preparedness_checklist_lines"
                      accid={accid}
                    />
                  )}
                  {checklistModal && isValidated && (statusInfo && !statusInfo.data) && (
                    <Checklists
                      orderCheckLists={detailData.order_id && detailData.order_id.check_list_ids && detailData.order_id.check_list_ids.length > 0 ? sortSections(detailData.order_id.check_list_ids) : taskQuestions}
                      detailData={detailData}
                      atReject={() => onClose()}
                      atDone={() => onWoDone()}
                      statusInfo={statusInfo}
                      wpConfigData={wpConfigData}
                      accid={accid}
                      spareParts={detailData.order_id && detailData.order_id.parts_lines ? detailData.order_id.parts_lines : []}
                      fieldValue="check_list_ids"
                    />
                  )}
                  {closeModal && (detailData.order_state === 'done' && detailData.state === 'Work In Progress') && (
                    <CloseWp
                      detailData={detailData}
                      wpConfigData={wpConfigData}
                      atReject={() => onWoClose()}
                      atDone={() => onCloseDone()}
                      accid={accid}
                    />
                  )}
                  {rejectModal && (detailData.state === 'Requested') && (
                    <RejectWp
                      detailData={detailData}
                      atReject={() => onRejectClose()}
                      wpConfigData={wpConfigData}
                      atDone={() => onRejectDone()}
                      setMessage={setRejectReason}
                    />
                  )}
                </div>
              </>
            </Col>
          )}
          {vpConfig && vpConfig.data && !vpConfig.count && (
            <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12">
              <div className="text-center mt-3 mb-3">
                <img src={closeCircleRed} className="mr-2" alt="invalid" width="40" height="40" />
                <h4 className="text-danger">Oops! Your request is invalid</h4>
              </div>
            </Col>
          )}
          {(vpConfig && vpConfig.loading) && (
            <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12">
              <div className="text-center mt-4 mb-4">
                <Loader />
              </div>
            </Col>
          )}
          {vpConfig && vpConfig.err && !vpConfig.count && (
            <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12">
              <div className="text-center mt-3 mb-3">
                <img src={closeCircleRed} className="mr-2" alt="invalid" width="40" height="40" />
                <h4 className="text-danger">Oops! Your request is invalid</h4>
              </div>
            </Col>
          )}
        </Row>
      </Box>
    </>
  );
};

PublicWorkPermit.defaultProps = {
  match: false,
  params: false,
  suuid: false,
  ruuid: false,
};

PublicWorkPermit.propTypes = {
  match: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]),
  params: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]),
  suuid: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]),
  ruuid: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]),
};

export default PublicWorkPermit;
