/* eslint-disable max-len */
/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCopy, faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import {
  
  Col, Label, Row,
} from 'reactstrap';
import {
  Dialog, DialogContent, DialogContentText, DialogActions,
  Typography, Button, Autocomplete,
} from '@mui/material';
import {
  CheckboxFieldGroup,
} from '@shared/formFields';
import {
  TextField, CircularProgress, FormControl,
} from '@material-ui/core';
import { IoCloseOutline } from 'react-icons/io5';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import { useFormikContext } from 'formik';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { Autocomplete } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { AddThemeColor } from '../../../../themes/theme';
import DialogHeader from '../../../../commonComponents/dialogHeader';
import MuiTextField from '../../../../commonComponents/formFields/muiTextField';
import MuiCheckboxField from '../../../../commonComponents/formFields/muiCheckbox';
import MuiAutoComplete from '../../../../commonComponents/formFields/muiAutocomplete';
import MuiTextarea from '../../../../commonComponents/formFields/muiTextarea';
import {
  getTCList, getAccessGroup, getRecipientList, setAllowedHostId, setAllowedDomainId, getWhatsappTemplate, getVisitorGroup, setVisitorTypeId, setAssetId, getAssetGroup,
} from '../../../siteService';
import {
  copyToClipboard, extractOptionsObjectWithName, getAllCompanies, generateErrorMessage, getArrayFromValuesById,
  isArrayColumnExists, getColumnArrayById, decimalKeyPress, extractOptionsObject,
} from '../../../../util/appUtils';
import AdvancedSearchModal from './advancedSearchModal';
import SearchModalMultiple from './searchModalMultiple';

const appModels = require('../../../../util/appModels').default;

const useStyles = makeStyles((themeStyle) => ({
  margin: {
    marginBottom: themeStyle.spacing(1.25),
    width: '100%',
  },
}));

const ProductCategoryBasicForm = React.memo((props) => {
  const {
    editId,
    setFieldValue,
    setFieldTouched,
    formField: {
      visitorEmail,
      visitorMobile,
      visitorCompany,
      visitorType,
      visitorPurpose,
      visitorPhoto,
      galleryImage,
      visitorIP,
      visitorIPNumber,
      idDetails,
      visitorBadge,
      hostCompany,
      hostEmail,
      hostName,
      enableHostEmail,
      hostDisclaimer,
      smsOTP,
      emailOTP,
      whatsappOTP,
      emailInvitation,
      smsInvitation,
      whatsappInvitation,
      enableScreen,
      checklistScreen,
      periodScreen,
      surveyScreen,
      buttonScreen,
      emailScreen,
      allowSites,
      approvalHost,
      allowedDomains,
      closeVisit,
      externalURL,
      enableTerms,
      addTerms,
      createdMessage,
      checkoutFeedback,
      surveyFeedback,
      buttonFeedback,
      emailFeedback,
      emailRequest,
      smsRequest,
      whatsappRequest,
      emailCheckIn,
      smsCheckIn,
      whatsappCheckIn,
      qrCheckIn,
      otpCheckIn,
      gracePeriodCheckIn,
      emailCheckOut,
      smsCheckOut,
      whatsappCheckOut,
      emailApproval,
      smsApproval,
      whatsappApproval,
      emailElapsed,
      smsElapsed,
      whatsappElapsed,
      visitorInvitationTemplateId,
      otpTemplateId,
      requestTemplateId,
      checkInTemplateId,
      checkOutTemplateId,
      approvalTemplateId,
      elapsedTemplateId,
      visitorAsset,
      visitorTypes,
      passHeader,
      allowedAssetType,
    },
  } = props;
  const classes = useStyles();
  const { values: formValues } = useFormikContext();
  const {
    uuid, feedback_survey, prescreen_survey, feedback_during_checkout, enable_prescreen, allowed_sites_ids, allowed_domains_host_ids, enable_public_visit_request, visitor_invitation_template_id, otp_template_id, request_template_id, check_in_template_id, check_out_template_id, approval_template_id, elapsed_template_id, is_send_visitor_invitation_whatsapp, is_send_whatsapp_message, is_send_request_whatsapp, is_send_check_in_whatsapp, is_send_check_out_whatsapp, is_send_approval_whatsapp, is_send_elapsed_whatsapp, is_allow_visitor_assets, visitor_types, visitor_allowed_asset_ids,
  } = formValues;
  const dispatch = useDispatch();
  const [typeOpen, setTypeOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryKeyword, setCategoryKeyword] = useState('');
  const [prescreenOpen, setPrescreenOpen] = useState(false);
  const [prescreenKeyword, setPrescreenKeyword] = useState('');
  const { userInfo } = useSelector((state) => state.user);
  const {
    tcInfo, accessGroupInfo, recipientsInfo, allowedHostId, allowedDomainId, whatsappInfoList, visitorGroupInfo, visitorTypeId, assetId, assetGroupInfo,
  } = useSelector((state) => state.site);

  const [userOptions, setUserOptions] = useState([]);
  const [userKeyword, setUserKeyword] = useState('');
  const [userOpen, setUserOpen] = useState(false);
  const [checkedRows, setCheckRows] = useState([]);

  const [accessOptions, setAccessOptions] = useState([]);
  const [accessKeyword, setAccessKeyword] = useState('');
  const [accessOpen, setAccessOpen] = useState(false);

  const [visitorOptions, setVisitorOptions] = useState([]);
  const [visitorKeyword, setVisitorKeyword] = useState('');
  const [visitorTypeOpen, setVisitorTypeOpen] = useState(false);

  const [assetOptions, setAssetOptions] = useState([]);
  const [assetKeyword, setAssetKeyword] = useState('');
  const [assetOpen, setAssetOpen] = useState(false);

  const [visitorTemplateOpen, setVisitorTemplateOpen] = useState(false);
  const [visitorTemplateKeyword, setVisitorTemplateKeyword] = useState('');
  const [otpTemplateOpen, setOtpTemplateOpen] = useState(false);
  const [otpTemplateKeyword, setOtpTemplateKeyword] = useState('');
  const [requestTemplateOpen, setRequestTemplateOpen] = useState(false);
  const [requestTemplateKeyword, setRequestTemplateKeyword] = useState('');
  const [checkinTemplateOpen, setCheckinTemplateOpen] = useState(false);
  const [checkinTemplateKeyword, setCheckinTemplateKeyword] = useState('');
  const [checkoutTemplateOpen, setCheckoutTemplateOpen] = useState(false);
  const [checkoutTemplateKeyword, setCheckoutTemplateKeyword] = useState('');
  const [approvalTemplateOpen, setApprovalTemplateOpen] = useState(false);
  const [approvalTemplateKeyword, setApprovalTemplateKeyword] = useState('');
  const [elapsedTemplate, setElapsedTemplateOpen] = useState(false);
  const [elapsedTemplateKeyword, setElapsedTemplateKeyword] = useState('');

  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name', 'title']);
  const [extraMultipleModal, setExtraMultipleModal] = useState(false);
  const [extraModal, setExtraModal] = useState(false);

  const companies = getAllCompanies(userInfo);

  useEffect(() => {
    if (!is_send_visitor_invitation_whatsapp) {
      setFieldValue('visitor_invitation_template_id', '');
    }
    if (!is_send_whatsapp_message) {
      setFieldValue('otp_template_id', '');
    }
    if (!is_send_request_whatsapp) {
      setFieldValue('request_template_id', '');
    }
    if (!is_send_check_in_whatsapp) {
      setFieldValue('check_in_template_id', '');
    }
    if (!is_send_check_out_whatsapp) {
      setFieldValue('check_out_template_id', '');
    }
    if (!is_send_approval_whatsapp) {
      setFieldValue('approval_template_id', '');
    }
    if (!is_send_elapsed_whatsapp) {
      setFieldValue('elapsed_template_id', '');
    }
  }, [is_send_visitor_invitation_whatsapp, is_send_whatsapp_message, is_send_request_whatsapp, is_send_check_in_whatsapp, is_send_check_out_whatsapp, is_send_approval_whatsapp, is_send_elapsed_whatsapp]);

  useEffect(() => {
    if (editId) {
      dispatch(setAllowedHostId(allowed_sites_ids));
      dispatch(setAllowedDomainId(allowed_domains_host_ids));
      dispatch(setVisitorTypeId(visitor_types));
      dispatch(setAssetId(visitor_allowed_asset_ids));
    }
  }, [editId]);

  useEffect(() => {
    if ((allowed_sites_ids && allowed_sites_ids.length > 0) || (allowed_domains_host_ids && allowed_domains_host_ids.length > 0)) {
      dispatch(setAllowedHostId(allowed_sites_ids));
      setUserKeyword(allowed_sites_ids);
      dispatch(setAllowedDomainId(allowed_domains_host_ids));
      setAccessKeyword(allowed_domains_host_ids);
    }
  }, [allowed_sites_ids, allowed_domains_host_ids]);

  useEffect(() => {
    if (allowedHostId) {
      setFieldValue('allowed_sites_ids', allowedHostId);
    }
  }, [allowedHostId]);

  useEffect(() => {
    if (allowedDomainId) {
      setFieldValue('allowed_domains_host_ids', allowedDomainId);
    }
  }, [allowedDomainId]);

  useEffect(() => {
    if (visitorTypeId) {
      setFieldValue('visitor_types', visitorTypeId);
    }
  }, [visitorTypeId]);

  useEffect(() => {
    if (assetId) {
      setFieldValue('visitor_allowed_asset_ids', assetId);
    }
  }, [assetId]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && accessOpen) {
        await dispatch(getAccessGroup(companies, appModels.HOSTDOMAINS, accessKeyword));
      }
    })();
  }, [userInfo, accessKeyword, accessOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && visitorTypeOpen) {
        await dispatch(getVisitorGroup(companies, appModels.VISITORTYPES, visitorKeyword));
      }
    })();
  }, [userInfo, visitorKeyword, visitorTypeOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && assetOpen) {
        await dispatch(getAssetGroup(companies, appModels.ASSETTYPE, visitorKeyword));
      }
    })();
  }, [userInfo, assetKeyword, assetOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && userOpen) {
        await dispatch(getRecipientList(companies, appModels.HOSTCOMPANY, userKeyword));
      }
    })();
  }, [userInfo, userKeyword, userOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && categoryOpen) {
      dispatch(getTCList(companies, appModels.SURVEY, categoryKeyword, 'title'));
    }
  }, [userInfo, categoryOpen, categoryKeyword]);

  useEffect(() => {
    if (userInfo && userInfo.data && prescreenOpen) {
      dispatch(getTCList(companies, appModels.SURVEY, prescreenKeyword, 'title'));
    }
  }, [userInfo, prescreenOpen, prescreenKeyword]);

  useEffect(() => {
    if (userInfo && userInfo.data && visitorTemplateOpen) {
      dispatch(getWhatsappTemplate(companies, appModels.WHATSAPPTEMPLATE, visitorTemplateKeyword));
    }
  }, [userInfo, visitorTemplateOpen, visitorTemplateKeyword]);

  useEffect(() => {
    if (userInfo && userInfo.data && otpTemplateOpen) {
      dispatch(getWhatsappTemplate(companies, appModels.WHATSAPPTEMPLATE, otpTemplateKeyword));
    }
  }, [userInfo, otpTemplateOpen, otpTemplateKeyword]);

  useEffect(() => {
    if (userInfo && userInfo.data && requestTemplateOpen) {
      dispatch(getWhatsappTemplate(companies, appModels.WHATSAPPTEMPLATE, requestTemplateKeyword));
    }
  }, [userInfo, requestTemplateOpen, requestTemplateKeyword]);

  useEffect(() => {
    if (userInfo && userInfo.data && checkinTemplateOpen) {
      dispatch(getWhatsappTemplate(companies, appModels.WHATSAPPTEMPLATE, checkinTemplateKeyword));
    }
  }, [userInfo, checkinTemplateOpen, checkinTemplateKeyword]);

  useEffect(() => {
    if (userInfo && userInfo.data && checkoutTemplateOpen) {
      dispatch(getWhatsappTemplate(companies, appModels.WHATSAPPTEMPLATE, checkoutTemplateKeyword));
    }
  }, [userInfo, checkoutTemplateOpen, checkoutTemplateKeyword]);

  useEffect(() => {
    if (userInfo && userInfo.data && approvalTemplateOpen) {
      dispatch(getWhatsappTemplate(companies, appModels.WHATSAPPTEMPLATE, approvalTemplateKeyword));
    }
  }, [userInfo, approvalTemplateOpen, approvalTemplateKeyword]);

  useEffect(() => {
    if (userInfo && userInfo.data && elapsedTemplate) {
      dispatch(getWhatsappTemplate(companies, appModels.WHATSAPPTEMPLATE, elapsedTemplateKeyword));
    }
  }, [userInfo, elapsedTemplate, elapsedTemplateKeyword]);

  const visitorTemplateOptions = extractOptionsObject(whatsappInfoList, visitor_invitation_template_id);
  const otpTemplateOptions = extractOptionsObject(whatsappInfoList, otp_template_id);
  const requestTemplateOptions = extractOptionsObject(whatsappInfoList, request_template_id);
  const checkinTemplateOptions = extractOptionsObject(whatsappInfoList, check_in_template_id);
  const checkoutTemplateOptions = extractOptionsObject(whatsappInfoList, check_out_template_id);
  const approvalTemplateOptions = extractOptionsObject(whatsappInfoList, approval_template_id);
  const elapsedTemplateOptions = extractOptionsObject(whatsappInfoList, elapsed_template_id);

  const categoryOptions = extractOptionsObjectWithName(tcInfo, feedback_survey, 'title');
  const prescreenOptions = extractOptionsObjectWithName(tcInfo, prescreen_survey, 'title');

  const showVisitorTemplateModal = () => {
    setModelValue(appModels.WHATSAPPTEMPLATE);
    setFieldName('visitor_invitation_template_id');
    setModalName('Templates');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
  };

  const onVisitorTemplateKeywordChange = (event) => {
    setVisitorTemplateKeyword(event.target.value);
  };

  const onVisitorTemplateKeywordClear = () => {
    setVisitorTemplateKeyword(null);
    setFieldValue('visitor_invitation_template_id', '');
    setVisitorTemplateOpen(false);
  };

  const showOtpTemplateModal = () => {
    setModelValue(appModels.WHATSAPPTEMPLATE);
    setFieldName('otp_template_id');
    setModalName('Templates');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
  };

  const onOtpTemplateKeywordChange = (event) => {
    setOtpTemplateKeyword(event.target.value);
  };

  const onOtpTemplateKeywordClear = () => {
    setOtpTemplateKeyword(null);
    setFieldValue('otp_template_id', '');
    setOtpTemplateOpen(false);
  };

  const showRequestTemplateModal = () => {
    setModelValue(appModels.WHATSAPPTEMPLATE);
    setFieldName('request_template_id');
    setModalName('Templates');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
  };

  const onRequestTemplateKeywordChange = (event) => {
    setRequestTemplateKeyword(event.target.value);
  };

  const onRequestTemplateKeywordClear = () => {
    setRequestTemplateKeyword(null);
    setFieldValue('request_template_id', '');
    setRequestTemplateOpen(false);
  };

  const showCheckinTemplateModal = () => {
    setModelValue(appModels.WHATSAPPTEMPLATE);
    setFieldName('check_in_template_id');
    setModalName('Templates');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
  };

  const onCheckinTemplateKeywordChange = (event) => {
    setCheckinTemplateKeyword(event.target.value);
  };

  const onCheckinTemplateKeywordClear = () => {
    setCheckinTemplateKeyword(null);
    setFieldValue('check_in_template_id', '');
    setCheckinTemplateOpen(false);
  };

  const showCheckoutTemplateModal = () => {
    setModelValue(appModels.WHATSAPPTEMPLATE);
    setFieldName('check_out_template_id');
    setModalName('Templates');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
  };

  const onCheckoutTemplateKeywordChange = (event) => {
    setCheckoutTemplateKeyword(event.target.value);
  };

  const onCheckoutTemplateKeywordClear = () => {
    setCheckoutTemplateKeyword(null);
    setFieldValue('check_out_template_id', '');
    setCheckoutTemplateOpen(false);
  };

  const showApprovalTemplateModal = () => {
    setModelValue(appModels.WHATSAPPTEMPLATE);
    setFieldName('approval_template_id');
    setModalName('Templates');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
  };

  const onApprovalTemplateKeywordChange = (event) => {
    setApprovalTemplateKeyword(event.target.value);
  };

  const onApprovalTemplateKeywordClear = () => {
    setApprovalTemplateKeyword(null);
    setFieldValue('approval_template_id', '');
    setApprovalTemplateOpen(false);
  };

  const showElapsedTemplateModal = () => {
    setModelValue(appModels.WHATSAPPTEMPLATE);
    setFieldName('elapsed_template_id');
    setModalName('Templates');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
  };

  const onElapsedTemplateKeywordChange = (event) => {
    setElapsedTemplateKeyword(event.target.value);
  };

  const onElapsedTemplateKeywordClear = () => {
    setElapsedTemplateKeyword(null);
    setFieldValue('elapsed_template_id', '');
    setElapsedTemplateOpen(false);
  };

  const onUserKeywordClear = () => {
    setUserKeyword(null);
    dispatch(setAllowedHostId([]));
    setCheckRows([]);
    setUserOpen(false);
  };

  function isAssociativeArray(arr) {
    let result = arr;
    if (isArrayColumnExists(arr, 'id')) {
      result = getColumnArrayById(arr, 'id');
    }
    return result;
  }

  const showUserModal = () => {
    setModelValue(appModels.HOSTCOMPANY);
    setFieldName('allowed_sites_ids');
    setModalName('Allowed Company List');
    setColumns(['id', 'name']);
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraMultipleModal(true);
  };

  useEffect(() => {
    if (recipientsInfo && recipientsInfo.data && recipientsInfo.data.length && userOpen) {
      setUserOptions(getArrayFromValuesById(recipientsInfo.data, isAssociativeArray(allowedHostId || []), 'id'));
    } else if (recipientsInfo && recipientsInfo.loading) {
      setUserOptions([{ name: 'Loading...' }]);
    } else {
      setUserOptions([]);
    }
  }, [recipientsInfo, userOpen]);

  const handleParticipants = (options) => {
    if (options && options.length && options.find((option) => option.name === 'Loading...')) {
      return false;
    }
    dispatch(setAllowedHostId(options));
    setCheckRows(options);
  };

  const onAccessKeywordClear = () => {
    setAccessKeyword(null);
    dispatch(setAllowedDomainId([]));
    setCheckRows([]);
    setAccessOpen(false);
  };

  const onVisitorKeywordClear = () => {
    setVisitorKeyword(null);
    dispatch(setVisitorTypeId([]));
    setCheckRows([]);
    setVisitorTypeOpen(false);
  };

  const onAssetKeywordClear = () => {
    setAssetKeyword(null);
    dispatch(setAssetId([]));
    setCheckRows([]);
    setAssetOpen(false);
  };

  const showAccessModal = () => {
    setModelValue(appModels.HOSTDOMAINS);
    setFieldName('allowed_domains_host_ids');
    setModalName('Allowed Domains');
    setColumns(['id', 'name']);
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraMultipleModal(true);
  };

  const showVisitorModal = () => {
    setModelValue(appModels.VISITORTYPES);
    setFieldName('visitor_types');
    setModalName('Visitor Types');
    setColumns(['id', 'name']);
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraMultipleModal(true);
  };

  const showAssetModal = () => {
    setModelValue(appModels.ASSETTYPE);
    setFieldName('visitor_allowed_asset_ids');
    setModalName('Allowed Asset Types');
    setColumns(['id', 'name']);
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraMultipleModal(true);
  };

  useEffect(() => {
    if (accessGroupInfo && accessGroupInfo.data && accessGroupInfo.data.length && accessOpen) {
      setAccessOptions(getArrayFromValuesById(accessGroupInfo.data, isAssociativeArray(allowedDomainId || []), 'id'));
    } else if (accessGroupInfo && accessGroupInfo.loading) {
      setAccessOptions([{ name: 'Loading...' }]);
    } else {
      setAccessOptions([]);
    }
  }, [accessGroupInfo, accessOpen]);

  useEffect(() => {
    if (visitorGroupInfo && visitorGroupInfo.data && visitorGroupInfo.data.length && visitorTypeOpen) {
      setVisitorOptions(getArrayFromValuesById(visitorGroupInfo.data, isAssociativeArray(visitorTypeId || []), 'id'));
    } else if (visitorGroupInfo && visitorGroupInfo.loading) {
      setVisitorOptions([{ name: 'Loading...' }]);
    } else {
      setVisitorOptions([]);
    }
  }, [visitorGroupInfo, visitorTypeOpen]);

  useEffect(() => {
    if (assetGroupInfo && assetGroupInfo.data && assetGroupInfo.data.length && assetOpen) {
      setAssetOptions(getArrayFromValuesById(assetGroupInfo.data, isAssociativeArray(assetId || []), 'id'));
    } else if (assetGroupInfo && assetGroupInfo.loading) {
      setAssetOptions([{ name: 'Loading...' }]);
    } else {
      setAssetOptions([]);
    }
  }, [assetGroupInfo, assetOpen]);

  const handleParticipantsAccess = (options) => {
    if (options && options.length && options.find((option) => option.name === 'Loading...')) {
      return false;
    }
    dispatch(setAllowedDomainId(options));
    setCheckRows(options);
  };

  const handleParticipantsVisitor = (options) => {
    if (options && options.length && options.find((option) => option.name === 'Loading...')) {
      return false;
    }
    dispatch(setVisitorTypeId(options));
    setCheckRows(options);
  };

  const handleParticipantsAsset = (options) => {
    if (options && options.length && options.find((option) => option.name === 'Loading...')) {
      return false;
    }
    dispatch(setAssetId(options));
    setCheckRows(options);
  };

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const showSearchModal = () => {
    setModelValue(appModels.SURVEY);
    setFieldName('feedback_survey');
    setModalName('Feedback Survey');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
  };

  const onCategoryKeywordChange = (event) => {
    setCategoryKeyword(event.target.value);
  };

  const onCategoryKeywordClear = () => {
    setCategoryKeyword(null);
    setFieldValue('feedback_survey', '');
    setCategoryOpen(false);
  };

  const showPrescreenModal = () => {
    setModelValue(appModels.SURVEY);
    setFieldName('prescreen_survey');
    setModalName('Prescreen Survey');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
  };

  const onPrescreenKeywordChange = (event) => {
    setPrescreenKeyword(event.target.value);
  };

  const onPrescreenKeywordClear = () => {
    setPrescreenKeyword(null);
    setFieldValue('prescreen_survey', '');
    setPrescreenOpen(false);
  };

  const setSelectedRows = (data) => {
    if (fieldName === 'allowed_sites_ids') {
      const Location = ([...allowedHostId, ...data]);
      const uniqueObjArray = [...new Map(Location.map((item) => [item.id, item])).values()];
      dispatch(setAllowedHostId(uniqueObjArray));
      setExtraMultipleModal(false);
      setCheckRows([]);
    }
    if (fieldName === 'allowed_domains_host_ids') {
      const Location = ([...allowedDomainId, ...data]);
      const uniqueObjArray = [...new Map(Location.map((item) => [item.id, item])).values()];
      dispatch(setAllowedDomainId(uniqueObjArray));
      setExtraMultipleModal(false);
      setCheckRows([]);
    }
    if (fieldName === 'visitor_types') {
      const Location = ([...visitorTypeId, ...data]);
      const uniqueObjArray = [...new Map(Location.map((item) => [item.id, item])).values()];
      dispatch(setVisitorTypeId(uniqueObjArray));
      setExtraMultipleModal(false);
      setCheckRows([]);
    }
    if (fieldName === 'visitor_allowed_asset_ids') {
      const Location = ([...assetId, ...data]);
      const uniqueObjArray = [...new Map(Location.map((item) => [item.id, item])).values()];
      dispatch(setAssetId(uniqueObjArray));
      setExtraMultipleModal(false);
      setCheckRows([]);
    }
  };

  return (
    <Row className="mb-1 requestorForm-input">
      <Col xs={12} sm={4} lg={4} md={4}>
        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
            fontSize: '16px',
            marginBottom: '5px',
            marginTop: '5px',
            paddingBottom: '4px',
            marginLeft: '5px',
          })}
        >
          General Settings
          <Tooltip title="General settings allowed for the Visitor Management module" placement="right">
            <span className="text-info">
              <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
            </span>
          </Tooltip>
        </Typography>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3">
          <MuiCheckboxField
            name={approvalHost.name}
            label={approvalHost.label}
          />
        </Col>
        <Col xs={12} sm={12} lg={12} md={12}>
          <Autocomplete
            sx={{
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            multiple
            filterSelectedOptions
            name="categoryaccess"
            open={accessOpen}
            size="small"
            className="bg-white"
            onOpen={() => {
              setAccessOpen(true);
              setAccessKeyword('');
            }}
            onClose={() => {
              setAccessOpen(false);
              setAccessKeyword('');
            }}
            value={allowed_domains_host_ids && allowed_domains_host_ids.length > 0 ? allowed_domains_host_ids : []}
            defaultValue={allowedDomainId}
            onChange={(e, options) => handleParticipantsAccess(options)}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={accessOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label={allowedDomains.label}
                className={((getOldData(allowedDomainId)) || (accessKeyword && accessKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                onChange={(e) => setAccessKeyword(e.target.value)}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {(accessGroupInfo && accessGroupInfo.loading) ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((accessKeyword && accessKeyword.length > 0) || (allowed_domains_host_ids && allowed_domains_host_ids.length > 0)) && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onAccessKeywordClear}
                        >
                          <IoCloseOutline size={22} fontSize="small" />
                        </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showAccessModal}
                        >
                          <SearchIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    </>
                  ),
                }}
              />
            )}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={closeVisit.name}
            label={closeVisit.label}
            autoComplete="off"
            type="text"
            inputProps={{
              maxLength: 2,
            }}
            onKeyPress={decimalKeyPress}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3">
          <MuiCheckboxField
            name={visitorAsset.name}
            label={visitorAsset.label}
          />
        </Col>
        {is_allow_visitor_assets
          ? (
            <Col xs={12} sm={12} lg={12} md={12}>
              <div className="m-1">
                <FormControl className={classes.margin}>
                  <Label for={allowedAssetType.name}>
                    {allowedAssetType.label}
                  </Label>
                  <Autocomplete
                    multiple
                    filterSelectedOptions
                    name="categoryaccess"
                    open={assetOpen}
                    size="small"
                    className="bg-white"
                    onOpen={() => {
                      setAssetOpen(true);
                      setAssetKeyword('');
                    }}
                    onClose={() => {
                      setAssetOpen(false);
                      setAssetKeyword('');
                    }}
                    value={visitor_allowed_asset_ids && visitor_allowed_asset_ids.length > 0 ? visitor_allowed_asset_ids : []}
                    defaultValue={assetId}
                    onChange={(e, options) => handleParticipantsAsset(options)}
                    getOptionSelected={(option, value) => option.name === value.name}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                    options={assetOptions}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        className={((getOldData(assetId)) || (assetKeyword && assetKeyword.length > 0))
                          ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                        placeholder="Search & Select"
                        onChange={(e) => setAssetKeyword(e.target.value)}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {(assetGroupInfo && assetGroupInfo.loading) ? <CircularProgress color="inherit" size={20} /> : null}
                              <InputAdornment position="end">
                                {((assetKeyword && assetKeyword.length > 0) || (visitor_allowed_asset_ids && visitor_allowed_asset_ids.length > 0)) && (
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={onAssetKeywordClear}
                                >
                                  <IoCloseOutline size={22} fontSize="small" />
                                </IconButton>
                                )}
                                <IconButton
                                  aria-label="toggle search visibility"
                                  onClick={showAssetModal}
                                >
                                  <SearchIcon fontSize="small" />
                                </IconButton>
                              </InputAdornment>
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </FormControl>
              </div>
            </Col>
          ) : ''}
        <Col xs={12} sm={12} lg={12} md={12}>
          <div className="m-1">
            <FormControl className={classes.margin}>
              <Label for={visitorTypes.name}>
                {visitorTypes.label}
              </Label>
              <Autocomplete
                multiple
                filterSelectedOptions
                name="categoryaccess"
                open={visitorTypeOpen}
                size="small"
                className="bg-white"
                onOpen={() => {
                  setVisitorTypeOpen(true);
                  setVisitorKeyword('');
                }}
                onClose={() => {
                  setVisitorTypeOpen(false);
                  setVisitorKeyword('');
                }}
                value={visitor_types && visitor_types.length > 0 ? visitor_types : []}
                defaultValue={visitorTypeId}
                onChange={(e, options) => handleParticipantsVisitor(options)}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={visitorOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    className={((getOldData(visitorTypeId)) || (visitorKeyword && visitorKeyword.length > 0))
                      ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    placeholder="Search & Select"
                    onChange={(e) => setVisitorKeyword(e.target.value)}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {(visitorGroupInfo && visitorGroupInfo.loading) ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {((visitorKeyword && visitorKeyword.length > 0) || (visitor_types && visitor_types.length > 0)) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onVisitorKeywordClear}
                              >
                                <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showVisitorModal}
                            >
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        </>
                      ),
                    }}
                  />
                )}
              />
            </FormControl>
          </div>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3">
          <MuiCheckboxField
            name={externalURL.name}
            label={externalURL.label}
          />
        </Col>
        {enable_public_visit_request
          ? (
            <Col xs={12} sm={12} md={12} lg={12} className="text-center">
              <Tooltip placement="bottom" title={copySuccess ? 'Copied!' : 'Copy URL'}>
                <Button
                  variant="contained"
                  size="sm"
                  onMouseLeave={() => setCopySuccess(false)}
                  onClick={() => { copyToClipboard(uuid, 'visitorpass'); setCopySuccess(true); }}
                  className="pb-05 pt-05 font-11 border-primary mb-1 mr-2"
                >
                  <FontAwesomeIcon className="mr-2" color="primary" size="sm" icon={faCopy} />
                  <span className="mr-2">Copy URL</span>
                </Button>
              </Tooltip>
            </Col>
          ) : ''}
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3">
          <MuiCheckboxField
            name={enableTerms.name}
            label={enableTerms.label}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextarea
            sx={{
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            fullWidth
            variant="standard"
            multiline
            name={addTerms.name}
            label={addTerms.label}
            formGroupClassName="m-1"
            type="textarea"
            maxRows="4"
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={createdMessage.name}
            label={createdMessage.label}
            autoComplete="off"
            type="text"
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={passHeader.name}
            label={passHeader.label}
            autoComplete="off"
            type="text"
          />
        </Col>
        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
            fontSize: '16px',
            marginBottom: '5px',
            marginTop: '5px',
            paddingBottom: '4px',
            marginLeft: '5px',
          })}
        >
          Feedback Settings
          {/* <Tooltip title="Select desired fields and properties for the visitor information form" placement="right">
            <span className="text-info">
              <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
            </span>
  </Tooltip> */}
        </Typography>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3">
          <MuiCheckboxField
            name={checkoutFeedback.name}
            label={checkoutFeedback.label}
          />
        </Col>
        {feedback_during_checkout ? (
          <Col xs={12} sm={12} lg={12} md={12}>
            <MuiAutoComplete
              sx={{
                marginTop: 'auto',
                marginBottom: '20px',
              }}
              name={surveyFeedback.name}
              label={surveyFeedback.label}
              labelClassName="mb-2"
              formGroupClassName="mb-1"
              open={categoryOpen}
              oldValue={getOldData(feedback_survey)}
              value={feedback_survey && feedback_survey.title ? feedback_survey.title : getOldData(feedback_survey)}
              size="small"
              onOpen={() => {
                setCategoryOpen(true);
                setCategoryKeyword('');
                setPrescreenOpen(false);
              }}
              onClose={() => {
                setCategoryOpen(false);
                setCategoryKeyword('');
              }}
              loading={tcInfo && tcInfo.loading && categoryOpen}
              getOptionSelected={(option, value) => option.title === value.title}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.title)}
              apiError={(tcInfo && tcInfo.err) ? generateErrorMessage(tcInfo) : false}
              options={categoryOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onCategoryKeywordChange}
                  label={surveyFeedback.label}
                  variant="standard"
                  value={categoryKeyword}
                  className={((getOldData(feedback_survey)) || (feedback_survey && feedback_survey.id) || (categoryKeyword && categoryKeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {tcInfo && tcInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((getOldData(feedback_survey)) || (feedback_survey && feedback_survey.id) || (categoryKeyword && categoryKeyword.length > 0)) && (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onCategoryKeywordClear}
                            >
                              <IoCloseOutline size={22} fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={showSearchModal}
                          >
                            <SearchIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      </>
                    ),
                  }}
                />
              )}
            />
          </Col>
        ) : ''}
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={buttonFeedback.name}
            label={buttonFeedback.label}
            autoComplete="off"
            type="text"
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3">
          <MuiCheckboxField
            name={emailFeedback.name}
            label={emailFeedback.label}
          />
        </Col>
      </Col>
      <Col xs={12} sm={4} lg={4} md={4}>
        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
            fontSize: '16px',
            marginBottom: '5px',
            marginTop: '5px',
            paddingBottom: '4px',
            marginLeft: '5px',
          })}
        >
          Visitor Info
          <Tooltip title="Select desired fields and properties for the visitor information form" placement="right">
            <span className="text-info">
              <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
            </span>
          </Tooltip>
        </Typography>
        <Col xs={12} sm={12} md={12} lg={12} className="pl-3">
          <Label for={visitorEmail.name} className="m-0">
            {visitorEmail.label}
          </Label>
          <br />
          <CheckboxFieldGroup
            name={visitorEmail.name}
            checkedvalue="Required"
            id="Required"
            className="ml-1"
            label={visitorEmail.label1}
          />
          <CheckboxFieldGroup
            name={visitorEmail.name}
            checkedvalue="Optional"
            id="Optional"
            label={visitorEmail.label2}
          />
          <CheckboxFieldGroup
            name={visitorEmail.name}
            checkedvalue="None"
            id="None"
            label={visitorEmail.label3}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="pl-3">
          <Label for={visitorMobile.name} className="m-0">
            {visitorMobile.label}
          </Label>
          <br />
          <CheckboxFieldGroup
            name={visitorMobile.name}
            checkedvalue="Required"
            id="Required"
            className="ml-1"
            label={visitorMobile.label1}
          />
          <CheckboxFieldGroup
            name={visitorMobile.name}
            checkedvalue="Optional"
            id="Optional"
            label={visitorMobile.label2}
          />
          <CheckboxFieldGroup
            name={visitorMobile.name}
            checkedvalue="None"
            id="None"
            label={visitorMobile.label3}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="pl-3">
          <Label for={visitorCompany.name} className="m-0">
            {visitorCompany.label}
          </Label>
          <br />
          <CheckboxFieldGroup
            name={visitorCompany.name}
            checkedvalue="Required"
            id="Required"
            className="ml-1"
            label={visitorCompany.label1}
          />
          <CheckboxFieldGroup
            name={visitorCompany.name}
            checkedvalue="Optional"
            id="Optional"
            label={visitorCompany.label2}
          />
          <CheckboxFieldGroup
            name={visitorCompany.name}
            checkedvalue="None"
            id="None"
            label={visitorCompany.label3}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="pl-3">
          <Label for={visitorType.name} className="m-0">
            {visitorType.label}
          </Label>
          <br />
          <CheckboxFieldGroup
            name={visitorType.name}
            checkedvalue="Required"
            id="Required"
            className="ml-1"
            label={visitorType.label1}
          />
          <CheckboxFieldGroup
            name={visitorType.name}
            checkedvalue="Optional"
            id="Optional"
            label={visitorType.label2}
          />
          <CheckboxFieldGroup
            name={visitorType.name}
            checkedvalue="None"
            id="None"
            label={visitorType.label3}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="pl-3">
          <Label for={visitorPurpose.name} className="m-0">
            {visitorPurpose.label}
          </Label>
          <br />
          <CheckboxFieldGroup
            name={visitorPurpose.name}
            checkedvalue="Required"
            id="Required"
            className="ml-1"
            label={visitorPurpose.label1}
          />
          <CheckboxFieldGroup
            name={visitorPurpose.name}
            checkedvalue="Optional"
            id="Optional"
            label={visitorPurpose.label2}
          />
          <CheckboxFieldGroup
            name={visitorPurpose.name}
            checkedvalue="None"
            id="None"
            label={visitorPurpose.label3}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="pl-3">
          <Label for={visitorPhoto.name} className="m-0">
            {visitorPhoto.label}
          </Label>
          <br />
          <CheckboxFieldGroup
            name={visitorPhoto.name}
            checkedvalue="Required"
            id="Required"
            className="ml-1"
            label={visitorPhoto.label1}
          />
          <CheckboxFieldGroup
            name={visitorPhoto.name}
            checkedvalue="Optional"
            id="Optional"
            label={visitorPhoto.label2}
          />
          <CheckboxFieldGroup
            name={visitorPhoto.name}
            checkedvalue="None"
            id="None"
            label={visitorPhoto.label3}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="pl-3">
          <Label for={visitorIP.name} className="m-0">
            {visitorIP.label}
          </Label>
          <br />
          <CheckboxFieldGroup
            name={visitorIP.name}
            checkedvalue="Required"
            id="Required"
            className="ml-1"
            label={visitorIP.label1}
          />
          <CheckboxFieldGroup
            name={visitorIP.name}
            checkedvalue="Optional"
            id="Optional"
            label={visitorIP.label2}
          />
          <CheckboxFieldGroup
            name={visitorIP.name}
            checkedvalue="None"
            id="None"
            label={visitorIP.label3}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="pl-3">
          <Label for={visitorIPNumber.name} className="m-0">
            {visitorIPNumber.label}
          </Label>
          <br />
          <CheckboxFieldGroup
            name={visitorIPNumber.name}
            checkedvalue="Required"
            id="Required"
            className="ml-1"
            label={visitorIPNumber.label1}
          />
          <CheckboxFieldGroup
            name={visitorIPNumber.name}
            checkedvalue="Optional"
            id="Optional"
            label={visitorIPNumber.label2}
          />
          <CheckboxFieldGroup
            name={visitorIPNumber.name}
            checkedvalue="None"
            id="None"
            label={visitorIPNumber.label3}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="pl-3">
          <Label for={idDetails.name} className="m-0">
            {idDetails.label}
          </Label>
          <br />
          <CheckboxFieldGroup
            name={idDetails.name}
            checkedvalue="Required"
            id="Required"
            className="ml-1"
            label={idDetails.label1}
          />
          <CheckboxFieldGroup
            name={idDetails.name}
            checkedvalue="Optional"
            id="Optional"
            label={idDetails.label2}
          />
          <CheckboxFieldGroup
            name={idDetails.name}
            checkedvalue="None"
            id="None"
            label={idDetails.label3}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="pl-3">
          <Label for={visitorBadge.name} className="m-0">
            {visitorBadge.label}
          </Label>
          <br />
          <CheckboxFieldGroup
            name={visitorBadge.name}
            checkedvalue="Required"
            id="Required"
            className="ml-1"
            label={visitorBadge.label1}
          />
          <CheckboxFieldGroup
            name={visitorBadge.name}
            checkedvalue="Optional"
            id="Optional"
            label={visitorBadge.label2}
          />
          <CheckboxFieldGroup
            name={visitorBadge.name}
            checkedvalue="None"
            id="None"
            label={visitorBadge.label3}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="pl-3">
          <Label for={smsOTP.name} className="m-0 mb-1">
            Visitor requires OTP verification
          </Label>
          <br />
          <div className="d-inline-flex">
            <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
              <MuiCheckboxField
                name={smsOTP.name}
                label={smsOTP.label}
              />
              <MuiCheckboxField
                name={emailOTP.name}
                label={emailOTP.label}
              />
              <MuiCheckboxField
                name={whatsappOTP.name}
                label={whatsappOTP.label}
              />
            </Col>
          </div>
        </Col>
        {
          is_send_whatsapp_message ? (
            <Col xs={12} sm={12} lg={12} md={12}>
              <MuiAutoComplete
                sx={{
                  marginTop: 'auto',
                  marginBottom: '20px',
                }}
                name={otpTemplateId.name}
                label={otpTemplateId.label}
                labelClassName="mb-2"
                formGroupClassName="mb-1"
                isRequired
                open={otpTemplateOpen}
                oldValue={getOldData(otp_template_id)}
                value={otp_template_id && otp_template_id.name ? otp_template_id.name : getOldData(otp_template_id)}
                size="small"
                onOpen={() => {
                  setOtpTemplateOpen(true);
                  setOtpTemplateKeyword('');
                }}
                onClose={() => {
                  setOtpTemplateOpen(false);
                  setOtpTemplateKeyword('');
                }}
                loading={whatsappInfoList && whatsappInfoList.loading && otpTemplateOpen}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                apiError={(whatsappInfoList && whatsappInfoList.err && otpTemplateOpen) ? generateErrorMessage(whatsappInfoList) : false}
                options={otpTemplateOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={onOtpTemplateKeywordChange}
                    variant="standard"
                    label={otpTemplateId.label}
                    value={otpTemplateKeyword}
                    className={((getOldData(otp_template_id)) || (otp_template_id && otp_template_id.id) || (otpTemplateKeyword && otpTemplateKeyword.length > 0))
                      ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    placeholder="Search & Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {otpTemplateOpen && whatsappInfoList && whatsappInfoList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {((getOldData(otp_template_id)) || (otp_template_id && otp_template_id.id) || (otpTemplateKeyword && otpTemplateKeyword.length > 0)) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onOtpTemplateKeywordClear}
                              >
                                <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showOtpTemplateModal}
                            >
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Col>
          ) : ''
        }
        <Col xs={12} sm={12} md={12} lg={12} className="pl-3">
          <Label for={smsOTP.name} className="m-0 mb-1">
            Visitor Send Invitation
          </Label>
          <br />
          <div className="d-inline-flex">
            <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
              <MuiCheckboxField
                name={emailInvitation.name}
                label={emailInvitation.label}
              />
              <MuiCheckboxField
                name={smsInvitation.name}
                label={smsInvitation.label}
              />
              <MuiCheckboxField
                name={whatsappInvitation.name}
                label={whatsappInvitation.label}
              />
            </Col>
          </div>
        </Col>
        {
          is_send_visitor_invitation_whatsapp ? (
            <Col xs={12} sm={12} lg={12} md={12}>
              <MuiAutoComplete
                sx={{
                  marginTop: 'auto',
                  marginBottom: '20px',
                }}
                name={visitorInvitationTemplateId.name}
                label={visitorInvitationTemplateId.label}
                labelClassName="mb-2"
                formGroupClassName="mb-1"
                isRequired
                open={visitorTemplateOpen}
                oldValue={getOldData(visitor_invitation_template_id)}
                value={visitor_invitation_template_id && visitor_invitation_template_id.name ? visitor_invitation_template_id.name : getOldData(visitor_invitation_template_id)}
                size="small"
                onOpen={() => {
                  setVisitorTemplateOpen(true);
                  setVisitorTemplateKeyword('');
                }}
                onClose={() => {
                  setVisitorTemplateOpen(false);
                  setVisitorTemplateKeyword('');
                }}
                loading={whatsappInfoList && whatsappInfoList.loading && visitorTemplateOpen}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                apiError={(whatsappInfoList && whatsappInfoList.err && visitorTemplateOpen) ? generateErrorMessage(whatsappInfoList) : false}
                options={visitorTemplateOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={onVisitorTemplateKeywordChange}
                    variant="standard"
                    label={visitorInvitationTemplateId.label}
                    value={visitorTemplateKeyword}
                    className={((getOldData(visitor_invitation_template_id)) || (visitor_invitation_template_id && visitor_invitation_template_id.id) || (visitorTemplateKeyword && visitorTemplateKeyword.length > 0))
                      ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    placeholder="Search & Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {visitorTemplateOpen && whatsappInfoList && whatsappInfoList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {((getOldData(visitor_invitation_template_id)) || (visitor_invitation_template_id && visitor_invitation_template_id.id) || (visitorTemplateKeyword && visitorTemplateKeyword.length > 0)) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onVisitorTemplateKeywordClear}
                              >
                                <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showVisitorTemplateModal}
                            >
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Col>
          ) : ''
        }
        <Col xs={12} sm={12} md={12} lg={12} className="pl-3 ml-1">
          <MuiCheckboxField
            name={galleryImage.name}
            label={galleryImage.label}
          />
        </Col>
      </Col>
      <Col xs={12} sm={4} lg={4} md={4}>
        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
            fontSize: '16px',
            marginBottom: '5px',
            marginTop: '5px',
            paddingBottom: '4px',
            marginLeft: '5px',
          })}
        >
          Host Info
          {/* <Tooltip title="Collecting feedbacks from the ticket requestor can be enabled using these settings. Feedbacks can also be using the automated way of reopening the tickets and notifying the maintenance team" placement="right">
            <span className="text-info">
              <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
            </span>
</Tooltip> */}
        </Typography>
        <Col xs={12} sm={12} md={12} lg={12} className="pl-3">
          <Label for={hostName.name} className="m-0">
            {hostName.label}
          </Label>
          <br />
          <CheckboxFieldGroup
            name={hostName.name}
            checkedvalue="Required"
            id="Required"
            className="ml-1"
            label={hostName.label1}
          />
          <CheckboxFieldGroup
            name={hostName.name}
            checkedvalue="Optional"
            id="Optional"
            label={hostName.label2}
          />
          <CheckboxFieldGroup
            name={hostName.name}
            checkedvalue="None"
            id="None"
            label={hostName.label3}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="pl-3">
          <Label for={hostEmail.name} className="m-0">
            {hostEmail.label}
          </Label>
          <br />
          <CheckboxFieldGroup
            name={hostEmail.name}
            checkedvalue="Required"
            id="Required"
            className="ml-1"
            label={hostEmail.label1}
          />
          <CheckboxFieldGroup
            name={hostEmail.name}
            checkedvalue="Optional"
            id="Optional"
            label={hostEmail.label2}
          />
          <CheckboxFieldGroup
            name={hostEmail.name}
            checkedvalue="None"
            id="None"
            label={hostEmail.label3}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="pl-3">
          <Label for={hostCompany.name} className="m-0">
            {hostCompany.label}
          </Label>
          <br />
          <CheckboxFieldGroup
            name={hostCompany.name}
            checkedvalue="Required"
            id="Required"
            className="ml-1"
            label={hostCompany.label1}
          />
          <CheckboxFieldGroup
            name={hostCompany.name}
            checkedvalue="Optional"
            id="Optional"
            label={hostCompany.label2}
          />
          <CheckboxFieldGroup
            name={hostCompany.name}
            checkedvalue="None"
            id="None"
            label={hostCompany.label3}
          />
        </Col>
        <Col xs={12} sm={12} lg={12} md={12}>
          <div className="m-1">
            <FormControl className={classes.margin}>
              <Label for={allowSites.name}>
                {allowSites.label}
              </Label>
              <Autocomplete
                multiple
                filterSelectedOptions
                name="categoryuser"
                open={userOpen}
                size="small"
                className="bg-white"
                onOpen={() => {
                  setUserOpen(true);
                  setUserKeyword('');
                }}
                onClose={() => {
                  setUserOpen(false);
                  setUserKeyword('');
                }}
                value={allowed_sites_ids && allowed_sites_ids.length > 0 ? allowed_sites_ids : []}
                defaultValue={allowedHostId}
                onChange={(e, options) => handleParticipants(options)}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={userOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    className={((getOldData(allowedHostId)) || (userKeyword && userKeyword.length > 0))
                      ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    placeholder="Search & Select"
                    onChange={(e) => setUserKeyword(e.target.value)}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {(recipientsInfo && recipientsInfo.loading) ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {((userKeyword && userKeyword.length > 0) || (allowed_sites_ids && allowed_sites_ids.length > 0)) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onUserKeywordClear}
                              >
                                <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showUserModal}
                            >
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        </>
                      ),
                    }}
                  />
                )}
              />
            </FormControl>
          </div>
          <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-1">
            <MuiCheckboxField
              name={enableHostEmail.name}
              label={enableHostEmail.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
            <MuiTextField
              sx={{
                marginTop: 'auto',
                marginBottom: '20px',
              }}
              name={hostDisclaimer.name}
              label={hostDisclaimer.label}
              autoComplete="off"
              type="text"
              inputProps={{
                maxLength: 30,
              }}
            />
          </Col>
        </Col>
        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
            fontSize: '16px',
            marginBottom: '5px',
            marginTop: '5px',
            paddingBottom: '4px',
            marginLeft: '5px',
          })}
        >
          Prescreening Settings
        </Typography>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3">
          <MuiCheckboxField
            name={enableScreen.name}
            label={enableScreen.label}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3">
          <MuiCheckboxField
            name={emailScreen.name}
            label={emailScreen.label}
          />
        </Col>
        {enable_prescreen ? (
          <Col xs={12} sm={12} lg={12} md={12}>
            <MuiAutoComplete
              sx={{
                marginTop: 'auto',
                marginBottom: '20px',
              }}
              name={surveyScreen.name}
              label={surveyScreen.label}
              labelClassName="mb-2"
              formGroupClassName="mb-1"
              open={prescreenOpen}
              oldValue={getOldData(prescreen_survey)}
              value={prescreen_survey && prescreen_survey.title ? prescreen_survey.title : getOldData(prescreen_survey)}
              size="small"
              onOpen={() => {
                setPrescreenOpen(true);
                setPrescreenKeyword('');
                setCategoryOpen(false);
              }}
              onClose={() => {
                setPrescreenOpen(false);
                setPrescreenKeyword('');
              }}
              loading={tcInfo && tcInfo.loading && prescreenOpen}
              getOptionSelected={(option, value) => option.title === value.title}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.title)}
              apiError={(tcInfo && tcInfo.err) ? generateErrorMessage(tcInfo) : false}
              options={prescreenOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onPrescreenKeywordChange}
                  variant="standard"
                  label={surveyScreen.label}
                  value={categoryKeyword}
                  className={((getOldData(prescreen_survey)) || (prescreen_survey && prescreen_survey.id) || (categoryKeyword && categoryKeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {tcInfo && tcInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((getOldData(prescreen_survey)) || (prescreen_survey && prescreen_survey.id) || (categoryKeyword && categoryKeyword.length > 0)) && (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onPrescreenKeywordClear}
                            >
                              <IoCloseOutline size={22} fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={showPrescreenModal}
                          >
                            <SearchIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      </>
                    ),
                  }}
                />
              )}
            />
          </Col>
        ) : ''}
        <Col xs={12} sm={12} md={12} lg={12}>
          <MuiTextField
            sx={{
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={buttonScreen.name}
            label={buttonScreen.label}
            autoComplete="off"
            type="text"
            inputProps={{
              maxLength: 30,
            }}
          />
        </Col>
      </Col>
      <Col xs={12} sm={12} md={12} lg={12} className="mb-3 mt-3 pl-2 ml-1">
               <Typography
                        sx={AddThemeColor({
                          font: 'normal normal medium 20px/24px Suisse Intl',
                          letterSpacing: '0.7px',
                          fontWeight: 500,
                          marginBottom: '10px',
                          marginTop: '10px',
                          paddingBottom: '4px',
                        })}
                      >
                        Communication  Settings
                    </Typography>
      </Col>
      <Col xs={12} sm={4} lg={4} md={4} className="mb-4">
        <Col xs={12} sm={12} md={12} lg={12} className="pl-3">
          <Label for={smsOTP.name} className="m-0">
            Send Request Created Email
          </Label>
          <br />
          <div className="d-inline-flex">
            <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
              <MuiCheckboxField
                name={emailRequest.name}
                label={emailRequest.label}
              />
              <MuiCheckboxField
                name={smsRequest.name}
                label={smsRequest.label}
              />
              <MuiCheckboxField
                name={whatsappRequest.name}
                label={whatsappRequest.label}
              />
            </Col>
          </div>
        </Col>
        {
          is_send_request_whatsapp ? (
            <Col xs={12} sm={12} lg={12} md={12}>
              <MuiAutoComplete
                sx={{
                  marginTop: 'auto',
                  marginBottom: '20px',
                }}
                name={requestTemplateId.name}
                label={requestTemplateId.label}
                labelClassName="mb-2"
                formGroupClassName="mb-1"
                isRequired
                open={requestTemplateOpen}
                oldValue={getOldData(request_template_id)}
                value={request_template_id && request_template_id.name ? request_template_id.name : getOldData(request_template_id)}
                size="small"
                onOpen={() => {
                  setRequestTemplateOpen(true);
                  setRequestTemplateKeyword('');
                }}
                onClose={() => {
                  setRequestTemplateOpen(false);
                  setRequestTemplateKeyword('');
                }}
                loading={whatsappInfoList && whatsappInfoList.loading && requestTemplateOpen}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                apiError={(whatsappInfoList && whatsappInfoList.err && requestTemplateOpen) ? generateErrorMessage(whatsappInfoList) : false}
                options={requestTemplateOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={onRequestTemplateKeywordChange}
                    variant="standard"
                    label={requestTemplateId.label}
                    value={requestTemplateKeyword}
                    className={((getOldData(request_template_id)) || (request_template_id && request_template_id.id) || (requestTemplateKeyword && requestTemplateKeyword.length > 0))
                      ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    placeholder="Search & Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {requestTemplateOpen && whatsappInfoList && whatsappInfoList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {((getOldData(request_template_id)) || (request_template_id && request_template_id.id) || (requestTemplateKeyword && requestTemplateKeyword.length > 0)) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onRequestTemplateKeywordClear}
                              >
                                <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showRequestTemplateModal}
                            >
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Col>
          ) : ''
        }
      </Col>
      <Col xs={12} sm={4} lg={4} md={4} className="mb-4">
        <Col xs={12} sm={12} md={12} lg={12} className="pl-3">
          <Label for={smsOTP.name} className="m-0">
            Send Check Out Email
          </Label>
          <br />
          <div className="d-inline-flex">
            <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
              <MuiCheckboxField
                name={emailCheckOut.name}
                label={emailCheckOut.label}
              />
              <MuiCheckboxField
                name={smsCheckOut.name}
                label={smsCheckOut.label}
              />
              <MuiCheckboxField
                name={whatsappCheckOut.name}
                label={whatsappCheckOut.label}
              />
            </Col>
          </div>
        </Col>
        {
          is_send_check_out_whatsapp ? (
            <Col xs={12} sm={12} lg={12} md={12}>
              <MuiAutoComplete
                sx={{
                  marginTop: 'auto',
                  marginBottom: '20px',
                }}
                name={checkOutTemplateId.name}
                label={checkOutTemplateId.label}
                labelClassName="mb-2"
                formGroupClassName="mb-1"
                isRequired
                open={checkoutTemplateOpen}
                oldValue={getOldData(check_out_template_id)}
                value={check_out_template_id && check_out_template_id.name ? check_out_template_id.name : getOldData(check_out_template_id)}
                size="small"
                onOpen={() => {
                  setCheckoutTemplateOpen(true);
                  setCheckoutTemplateKeyword('');
                }}
                onClose={() => {
                  setCheckoutTemplateOpen(false);
                  setCheckoutTemplateKeyword('');
                }}
                loading={whatsappInfoList && whatsappInfoList.loading && checkoutTemplateOpen}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                apiError={(whatsappInfoList && whatsappInfoList.err && checkoutTemplateOpen) ? generateErrorMessage(whatsappInfoList) : false}
                options={checkoutTemplateOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={onCheckoutTemplateKeywordChange}
                    variant="standard"
                    label={checkOutTemplateId.label}
                    value={checkoutTemplateKeyword}
                    className={((getOldData(check_out_template_id)) || (check_out_template_id && check_out_template_id.id) || (checkoutTemplateKeyword && checkoutTemplateKeyword.length > 0))
                      ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    placeholder="Search & Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {checkoutTemplateOpen && whatsappInfoList && whatsappInfoList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {((getOldData(check_out_template_id)) || (check_out_template_id && check_out_template_id.id) || (checkoutTemplateKeyword && checkoutTemplateKeyword.length > 0)) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onCheckoutTemplateKeywordClear}
                              >
                                <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showCheckoutTemplateModal}
                            >
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Col>
          ) : ''
        }
      </Col>
      <Col xs={12} sm={4} lg={4} md={4} className="mb-4">
        <Col xs={12} sm={12} md={12} lg={12} className="pl-3">
          <Label for={smsOTP.name} className="m-0">
            Send Elapsed
          </Label>
          <br />
          <div className="d-inline-flex">
            <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
              <MuiCheckboxField
                name={emailElapsed.name}
                label={emailElapsed.label}
              />
              <MuiCheckboxField
                name={smsElapsed.name}
                label={smsElapsed.label}
              />
              <MuiCheckboxField
                name={whatsappElapsed.name}
                label={whatsappElapsed.label}
              />
            </Col>
          </div>
        </Col>
        {
          is_send_elapsed_whatsapp ? (
            <Col xs={12} sm={12} lg={12} md={12}>
              <MuiAutoComplete
                sx={{
                  marginTop: 'auto',
                  marginBottom: '20px',
                }}
                name={elapsedTemplateId.name}
                label={elapsedTemplateId.label}
                labelClassName="mb-2"
                formGroupClassName="mb-1"
                isRequired
                open={elapsedTemplate}
                oldValue={getOldData(elapsed_template_id)}
                value={elapsed_template_id && elapsed_template_id.name ? elapsed_template_id.name : getOldData(elapsed_template_id)}
                size="small"
                onOpen={() => {
                  setElapsedTemplateOpen(true);
                  setElapsedTemplateKeyword('');
                }}
                onClose={() => {
                  setElapsedTemplateOpen(false);
                  setElapsedTemplateKeyword('');
                }}
                loading={whatsappInfoList && whatsappInfoList.loading && elapsedTemplate}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                apiError={(whatsappInfoList && whatsappInfoList.err && elapsedTemplate) ? generateErrorMessage(whatsappInfoList) : false}
                options={elapsedTemplateOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={onElapsedTemplateKeywordChange}
                    variant="standard"
                    label={elapsedTemplateId.label}
                    value={elapsedTemplateKeyword}
                    className={((getOldData(elapsed_template_id)) || (elapsed_template_id && elapsed_template_id.id) || (elapsedTemplateKeyword && elapsedTemplateKeyword.length > 0))
                      ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    placeholder="Search & Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {elapsedTemplate && whatsappInfoList && whatsappInfoList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {((getOldData(elapsed_template_id)) || (elapsed_template_id && elapsed_template_id.id) || (elapsedTemplateKeyword && elapsedTemplateKeyword.length > 0)) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onElapsedTemplateKeywordClear}
                              >
                                <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showElapsedTemplateModal}
                            >
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Col>
          ) : ''
        }
      </Col>
      <Col xs={12} sm={4} lg={4} md={4} className="mb-4">
        <Col xs={12} sm={12} md={12} lg={12} className="pl-3">
          <Label for={smsOTP.name} className="m-0">
            Send Approval Email
          </Label>
          <br />
          <div className="d-inline-flex">
            <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
              <MuiCheckboxField
                name={emailApproval.name}
                label={emailApproval.label}
              />
              <MuiCheckboxField
                name={smsApproval.name}
                label={smsApproval.label}
              />
              <MuiCheckboxField
                name={whatsappApproval.name}
                label={whatsappApproval.label}
              />
            </Col>
          </div>
        </Col>
        {
          is_send_approval_whatsapp ? (
            <Col xs={12} sm={12} lg={12} md={12}>
              <MuiAutoComplete
                sx={{
                  marginTop: 'auto',
                  marginBottom: '20px',
                }}
                name={approvalTemplateId.name}
                label={approvalTemplateId.label}
                isRequired
                labelClassName="mb-2"
                formGroupClassName="mb-1"
                open={approvalTemplateOpen}
                oldValue={getOldData(approval_template_id)}
                value={approval_template_id && approval_template_id.name ? approval_template_id.name : getOldData(approval_template_id)}
                size="small"
                onOpen={() => {
                  setApprovalTemplateOpen(true);
                  setApprovalTemplateKeyword('');
                }}
                onClose={() => {
                  setApprovalTemplateOpen(false);
                  setApprovalTemplateKeyword('');
                }}
                loading={whatsappInfoList && whatsappInfoList.loading && approvalTemplateOpen}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                apiError={(whatsappInfoList && whatsappInfoList.err && approvalTemplateOpen) ? generateErrorMessage(whatsappInfoList) : false}
                options={approvalTemplateOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={onApprovalTemplateKeywordChange}
                    variant="standard"
                    label={approvalTemplateId.label}
                    value={approvalTemplateKeyword}
                    className={((getOldData(approval_template_id)) || (approval_template_id && approval_template_id.id) || (approvalTemplateKeyword && approvalTemplateKeyword.length > 0))
                      ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    placeholder="Search & Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {approvalTemplateOpen && whatsappInfoList && whatsappInfoList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {((getOldData(approval_template_id)) || (approval_template_id && approval_template_id.id) || (approvalTemplateKeyword && approvalTemplateKeyword.length > 0)) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onApprovalTemplateKeywordClear}
                              >
                                <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showApprovalTemplateModal}
                            >
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Col>
          ) : ''
        }
      </Col>
      <Col xs={12} sm={4} lg={4} md={4} className="mb-4">
        <Col xs={12} sm={12} md={12} lg={12} className="pl-3">
          <Label for={smsOTP.name} className="m-0">
            Send Check In
          </Label>
          <br />
          <div className="d-inline-flex">
            <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
              <MuiCheckboxField
                name={emailCheckIn.name}
                label={emailCheckIn.label}
              />
              <MuiCheckboxField
                name={smsCheckIn.name}
                label={smsCheckIn.label}
              />
              <MuiCheckboxField
                name={whatsappCheckIn.name}
                label={whatsappCheckIn.label}
              />
            </Col>
          </div>
        </Col>
        {
          is_send_check_in_whatsapp ? (
            <Col xs={12} sm={12} lg={12} md={12}>
              <MuiAutoComplete
                sx={{
                  marginTop: 'auto',
                  marginBottom: '20px',
                }}
                name={checkInTemplateId.name}
                label={checkInTemplateId.label}
                labelClassName="mb-2"
                formGroupClassName="mb-1"
                isRequired
                open={checkinTemplateOpen}
                oldValue={getOldData(check_in_template_id)}
                value={check_in_template_id && check_in_template_id.name ? check_in_template_id.name : getOldData(check_in_template_id)}
                size="small"
                onOpen={() => {
                  setCheckinTemplateOpen(true);
                  setCheckinTemplateKeyword('');
                }}
                onClose={() => {
                  setCheckinTemplateOpen(false);
                  setCheckinTemplateKeyword('');
                }}
                loading={whatsappInfoList && whatsappInfoList.loading && checkinTemplateOpen}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                apiError={(whatsappInfoList && whatsappInfoList.err && checkinTemplateOpen) ? generateErrorMessage(whatsappInfoList) : false}
                options={checkinTemplateOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={onCheckinTemplateKeywordChange}
                    variant="standard"
                    label={checkInTemplateId.label}
                    value={checkinTemplateKeyword}
                    className={((getOldData(check_in_template_id)) || (check_in_template_id && check_in_template_id.id) || (checkinTemplateKeyword && checkinTemplateKeyword.length > 0))
                      ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    placeholder="Search & Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {checkinTemplateOpen && whatsappInfoList && whatsappInfoList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {((getOldData(check_in_template_id)) || (check_in_template_id && check_in_template_id.id) || (checkinTemplateKeyword && checkinTemplateKeyword.length > 0)) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onCheckinTemplateKeywordClear}
                              >
                                <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showCheckinTemplateModal}
                            >
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Col>
          ) : ''
        }
        <Col xs={12} sm={12} md={12} lg={12} className="pl-3">
          <div className="d-inline-flex">
            <Col xs={12} sm={12} md={12} lg={12} className="pl-1">
              <MuiCheckboxField
                name={qrCheckIn.name}
                label={qrCheckIn.label}
              />
              <MuiCheckboxField
                name={otpCheckIn.name}
                label={otpCheckIn.label}
              />
            </Col>
          </div>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="pl-3">
          <MuiTextField
            sx={{
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={gracePeriodCheckIn.name}
            label={gracePeriodCheckIn.label}
            autoComplete="off"
            type="text"
          />
        </Col>
      </Col>
      <Dialog size="xl" fullWidth open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AdvancedSearchModal
              modelName={modelValue}
              afterReset={() => { setExtraModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              otherFieldName={otherFieldName}
              otherFieldValue={otherFieldValue}
              setFieldValue={setFieldValue}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog size="xl" fullWidth open={extraMultipleModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraMultipleModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchModalMultiple
              modelName={modelValue}
              afterReset={() => { setExtraMultipleModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              otherFieldName={otherFieldName}
              otherFieldValue={otherFieldValue}
              setCheckedRows={setCheckRows}
              olCheckedRows={checkedRows && checkedRows.length ? checkedRows : []}
              oldSpaceIdData={allowedHostId && allowedHostId.length ? allowedHostId : []}
              oldAccessData={allowedDomainId && allowedDomainId.length ? allowedDomainId : []}
              oldVisitorData={visitorTypeId && visitorTypeId.length ? visitorTypeId : []}
              oldAssetData={assetId && assetId.length ? assetId : []}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {(checkedRows && checkedRows.length && checkedRows.length > 0)
            ? (
              <Button
                type="button"
                size="sm"
                onClick={() => setSelectedRows(checkedRows)}
                variant="contained"
              >
                {' '}
                Add
              </Button>
            ) : ''}
        </DialogActions>
      </Dialog>
    </Row>
  );
});

ProductCategoryBasicForm.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  formField: PropTypes.objectOf([PropTypes.object, PropTypes.string]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default ProductCategoryBasicForm;
