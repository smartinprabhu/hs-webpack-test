/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, {
  useState, useEffect, useMemo, useRef,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Button, Table,
} from 'reactstrap';
import { Tooltip } from 'antd';
import FormLabel from '@mui/material/FormLabel';
import JoditEditor from 'jodit-react';
import {
  CircularProgress,
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { IoCloseOutline } from 'react-icons/io5';
import {
  Box, TextField, Dialog, DialogContent, DialogContentText, DialogActions,
} from '@mui/material';
import { useFormikContext } from 'formik';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import editIcon from '@images/icons/edit.svg';
import addIcon from '@images/icons/plusCircleBlue.svg';
import DetailViewFormat from '@shared/detailViewFormat';

import DialogHeader from '../../../commonComponents/dialogHeader';
import Page from './page';
import {
  getDefaultNoValue,
  getAllowedCompanies,
  extractOptionsObject,
  generateErrorMessage,
  getColumnArrayById,
  decimalKeyPressDown,
} from '../../../util/appUtils';
import {
  getQuestionsCount,
} from '../../../survey/utils/utils';
import {
  getSurveyPages, storePages, storeQuestions, setPageData,
} from '../../../survey/surveyService';
import {
  getAuditDepartments,
  getAuditMetrics,
  getHxAuditConfigData,
} from '../../auditService';
import MuiTextField from '../../../commonComponents/formFields/muiTextField';
import MuiAutoComplete from '../../../commonComponents/formFields/muiAutocomplete';
import { returnThemeColor } from '../../../themes/theme';
import AdvancedSearchModal from '../../forms/advancedSearchModal';

const appModels = require('../../../util/appModels').default;

const BasicForm = React.memo((props) => {
  const {
    editId,
    reload,
    values,
    isCopy,
    setFieldValue,
    formField: {
      title,
      Scope,
      code,
      departmentId,
      Objective,
      auditMetricId,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    department_id,
    audit_metric_id,
    terms_and_conditions,
    instructions_to_auditee,
    instructions_to_auditor,
  } = formValues;
  const dispatch = useDispatch();
  const [pageRemove, setPageRemove] = useState('');
  const [pageModal, showPageModal] = useState(false);
  const [editPageData, setEditPageData] = useState(false);
  const [editPageId, setEditPageId] = useState(false);
  const [editPageIndex, setEditPageIndex] = useState(false);
  const [refresh, setRefresh] = useState(reload);
  const [modalAlert, setModalAlert] = useState(false);

  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [columns, setColumns] = useState(['id', 'name']);

  const [departmentOpen, setDepartmentOpen] = useState(false);
  const [departmentKeyword, setDepartmentKeyword] = useState('');

  const [metricOpen, setMetricOpen] = useState(false);
  const [viewMetric, setViewMetric] = useState(false);
  const [metricKeyword, setMetricKeyword] = useState('');

  const {
    hxDepartmentsInfo,
    hxAuditConfig,
    hxAuditSystemDetail,
    hxSystemMetrics,
  } = useSelector((state) => state.hxAudits);
  const { userInfo, userRoles } = useSelector((state) => state.user);

  let editor = useRef(null);

  const editorConfig = useMemo(() => ({
    spellcheck: true,
    height: 200,
    minHeight: 200,
    autofocus: true,
    allowResizeY: false,
    showPlaceholder: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    disablePlugins: 'enter,add-new-line,upload,image',
    toolbarAdaptive: false,
    toolbarButtonSize: 'small',
    buttons: 'eraser,ul,ol,table,link,undo,redo,fullsize',
    events:
           {
             afterInit: (instance) => { editor = instance; },
           },
  }), []);

  const {
    pagesInfo, pageQuestionList, pageData,
  } = useSelector((state) => state.survey);

  const companies = getAllowedCompanies(userInfo);

  const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';
  const userParentId = userInfo && userInfo.data && userInfo.data.company.parent_id ? userInfo.data.company.parent_id.id : '';

  const toggleAlert = () => {
    setModalAlert(false);
  };

  useEffect(() => {
    setRefresh(refresh);
  }, [refresh]);

  const configData = hxAuditConfig && hxAuditConfig.data && hxAuditConfig.data.length ? hxAuditConfig.data[0] : false;

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company) {
      dispatch(getHxAuditConfigData(userInfo.data.company.id, appModels.HXAUDITCONFIG));
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data && departmentOpen && configData) {
      const tempLevel = configData.department_access;
      let domain = '';
      if (tempLevel === 'Site') {
        domain = `["company_id","=",${userCompanyId}]`;
      } else if (tempLevel === 'Company') {
        domain = `["company_id","in",[${userCompanyId}, ${userParentId}]]`;
      } else if (tempLevel === 'Instance') {
        domain = '"|",["company_id","=",1],["company_id","=",false]';
      }

      if (tempLevel && departmentKeyword) {
        domain = `${domain},["name","ilike","${departmentKeyword}"]`;
      }

      if (!tempLevel && departmentKeyword) {
        domain = `["name","ilike","${departmentKeyword}"]`;
      }

      dispatch(getAuditDepartments(domain, appModels.HXAUDITDEPARTMENT));
    }
  }, [userInfo, departmentKeyword, departmentOpen, hxAuditConfig]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      let domain = '';

      if (metricKeyword) {
        domain = `["name","ilike","${metricKeyword}"]`;
      }

      dispatch(getAuditMetrics(domain, appModels.HXSYSTEMMETRIC));
    }
  }, [metricKeyword]);

  useEffect(() => {
    dispatch(setPageData([]));
    if (editId && (hxAuditSystemDetail && hxAuditSystemDetail.data)) {
      if (hxAuditSystemDetail.data[0].page_ids && hxAuditSystemDetail.data[0].page_ids.length > 0) {
        dispatch(getSurveyPages(appModels.SURVEYPAGE, getColumnArrayById(hxAuditSystemDetail.data[0].page_ids, 'id')));
        setPageRemove(Math.random());
      }
    }
  }, [editId, hxAuditSystemDetail]);

  useEffect(() => {
    if (pageQuestionList && pageQuestionList.data && pageQuestionList.data.length) {
      if (pagesInfo && !pagesInfo.data) {
        const pageDataArray = pageData && pageData.length ? pageData : [];
        const arr1 = [...pageDataArray, ...pageQuestionList.data];
        const arr = [...new Map(arr1.map((item) => [item.id, item])).values()];
        dispatch(setPageData(arr));
      } else {
        dispatch(setPageData([]));
      }
    } else {
      dispatch(setPageData([]));
    }
  }, [pageQuestionList]);

  useEffect(() => {
    dispatch(setPageData(pageData));
  }, [pageRemove]);

  useEffect(() => {
    if (pagesInfo && pagesInfo.data && pagesInfo.data.length > 0 && refresh) {
      const arr = pagesInfo.data;
      dispatch(setPageData(arr));
      setPageRemove(Math.random());
      setFieldValue('page_ids', arr);
    }
  }, [pagesInfo, refresh]);

  const state = hxAuditSystemDetail && hxAuditSystemDetail.data && hxAuditSystemDetail.data.length && hxAuditSystemDetail.data.length > 0
    && hxAuditSystemDetail.data[0].state ? hxAuditSystemDetail.data[0].state : [];

  const removeData = (e, index) => {
    if (state && state.length > 0 && state[1] === 'In progress') {
      setModalAlert(true);
    } else {
      const checkData = pageData;
      const indexRemove = checkData.indexOf(checkData[index]);
      const { id } = checkData[indexRemove];
      if (id) {
        checkData[indexRemove].isRemove = true;
        dispatch(setPageData(checkData));
        setPageRemove(Math.random());
      } else {
        checkData.splice(indexRemove, 1);
        dispatch(setPageData(checkData));
        setPageRemove(Math.random());
      }
      dispatch(storePages(checkData));
    }
  };

  const onDepKeywordChange = (event) => {
    setDepartmentKeyword(event.target.value);
  };

  const onMetricKeywordChange = (event) => {
    setMetricKeyword(event.target.value);
  };

  const onInstrAuditorChange = (data) => {
    setFieldValue('instructions_to_auditor', data);
  };

  const onInstrAuditeeChange = (data) => {
    setFieldValue('instructions_to_auditee', data);
  };

  const onInstrTermsChange = (data) => {
    setFieldValue('terms_and_conditions', data);
  };

  const showDepModal = () => {
    setModelValue(appModels.HXAUDITDEPARTMENT);
    setColumns(['id', 'name']);
    setFieldName('department_id');
    setModalName('Departments List');
    let domain = '';
    const tempLevel = configData.department_access ? configData.department_access : '';
    if (tempLevel === 'Site') {
      domain = `["company_id","=",${userCompanyId}]`;
    } else if (tempLevel === 'Company') {
      domain = `["company_id","in",[${userCompanyId}, ${userParentId}]]`;
    } else if (tempLevel === 'Instance') {
      domain = '"|",["company_id","=",1],["company_id","=",false]';
    }

    setCompanyValue(domain);
    setExtraModal(true);
  };

  const onDepClear = () => {
    setDepartmentKeyword(null);
    setFieldValue('department_id', '');
    setDepartmentOpen(false);
  };

  const showMetricModal = () => {
    setModelValue(appModels.HXSYSTEMMETRIC);
    setColumns(['id', 'name']);
    setFieldName('audit_metric_id');
    setModalName('Metrics List');
    const domain = '';
    setCompanyValue(domain);
    setExtraModal(true);
  };

  const onMetricClear = () => {
    setMetricKeyword(null);
    setFieldValue('audit_metric_id', '');
    setMetricOpen(false);
  };

  const depOptions = extractOptionsObject(hxDepartmentsInfo, department_id);
  const metricOptions = extractOptionsObject(hxSystemMetrics, audit_metric_id);

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <MuiTextField
          name={title.name}
          label={title.label}
          isRequired
          setFieldValue={setFieldValue}
          type="text"
          inputProps={{ maxLength: 30 }}
          sx={{
            marginTop: 'auto',
            marginBottom: '10px',
            width: '100%',
          }}
        />
      </Box>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '3%',
          flexWrap: 'wrap',
        }}
      >
        <MuiTextField
          name={code.name}
          label={code.label}
          isRequired
          type="text"
          inputProps={{ maxLength: 10 }}
          variant="standard"
          setFieldValue={setFieldValue}
          value={values[code.name]}
          sx={{
            width: '48%',
            marginBottom: '10px',
          }}
        />

        <MuiAutoComplete
          sx={{
            width: '48%',
            marginBottom: '10px',
          }}
          name={departmentId.name}
          label={departmentId.label}
          open={departmentOpen}
          formGroupClassName="m-1"
          isRequired
          size="small"
          onOpen={() => {
            setDepartmentOpen(true);
            setDepartmentKeyword('');
          }}
          onClose={() => {
            setDepartmentOpen(false);
            setDepartmentKeyword('');
          }}
          oldValue={department_id && department_id.name ? department_id.name : ''}
          value={department_id && department_id.name ? department_id.name : ''}
          getOptionDisabled={() => hxDepartmentsInfo && hxDepartmentsInfo.loading}
          getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
          options={depOptions}
          apiError={(hxDepartmentsInfo && hxDepartmentsInfo.err) ? generateErrorMessage(hxDepartmentsInfo) : false}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={onDepKeywordChange}
              variant="standard"
              label={`${departmentId.label}`}
              required
              placeholder="Search & Select"
              className="without-padding custom-icons"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {hxDepartmentsInfo && hxDepartmentsInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                    <InputAdornment position="end">
                      {((department_id && department_id.name) || (departmentKeyword && departmentKeyword.length > 0)) && (
                      <IconButton onClick={onDepClear}>
                        <IoCloseOutline size={22} fontSize="small" />
                      </IconButton>
                      )}
                      <IconButton onClick={showDepModal}>
                        <SearchIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  </>
                ),
              }}
            />
          )}
        />

      </Box>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '3%',
          flexWrap: 'wrap',
        }}
      >
        <MuiTextField
          sx={{
            width: '48%',
            marginBottom: '10px',
          }}
          name={Scope.name}
          label={Scope.label}
          inputProps={{ maxLength: 150 }}
          setFieldValue={setFieldValue}
          variant="standard"
          value={values[Scope.name]}
        />
        <MuiTextField
          sx={{
            width: '48%',
            marginBottom: '10px',
          }}
          name={Objective.name}
          label={Objective.label}
          inputProps={{ maxLength: 150 }}
          setFieldValue={setFieldValue}
          variant="standard"
          value={values[Objective.name]}
        />

      </Box>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '3%',
          flexWrap: 'wrap',
        }}
      >
        <MuiAutoComplete
          sx={{
            width: '48%',
            marginBottom: '10px',
          }}
          name={auditMetricId.name}
          label={auditMetricId.label}
          open={metricOpen}
          formGroupClassName="m-1"
          size="small"
          onOpen={() => {
            setMetricOpen(true);
            setMetricKeyword('');
          }}
          onClose={() => {
            setMetricOpen(false);
            setMetricKeyword('');
          }}
          oldValue={audit_metric_id && audit_metric_id.name ? audit_metric_id.name : ''}
          value={audit_metric_id && audit_metric_id.name ? audit_metric_id.name : ''}
          getOptionDisabled={() => hxSystemMetrics && hxSystemMetrics.loading}
          customMessage={audit_metric_id && audit_metric_id.name && audit_metric_id.scale_line_ids && audit_metric_id.scale_line_ids.length > 0}
          customMessageContent={<span aria-hidden className="font-family-tab cursor-pointer text-info" onClick={() => setViewMetric(true)}>View Metric</span>}
          getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
          options={metricOptions}
          apiError={(hxSystemMetrics && hxSystemMetrics.err) ? generateErrorMessage(hxSystemMetrics) : false}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={onMetricKeywordChange}
              variant="standard"
              label={`${auditMetricId.label}`}
              placeholder="Search & Select"
              className="without-padding custom-icons"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {hxSystemMetrics && hxSystemMetrics.loading ? <CircularProgress color="inherit" size={20} /> : null}
                    <InputAdornment position="end">
                      {((audit_metric_id && audit_metric_id.name) || (metricKeyword && metricKeyword.length > 0)) && (
                      <IconButton onClick={onMetricClear}>
                        <IoCloseOutline size={22} fontSize="small" />
                      </IconButton>
                      )}
                      <IconButton onClick={showMetricModal}>
                        <SearchIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  </>
                ),
              }}
            />
          )}
        />
      </Box>
      {editId && (
      <Box
        sx={{
          marginTop: 'auto',
          border: `1px solid ${returnThemeColor()}`,
          padding: '15px',
          marginBottom: '10px',
        }}
      >
        <Table responsive style={{ marginBottom: '0px' }}>
          <thead className="bg-lightblue">
            <tr>
              <th className="p-2 min-width-160 font-family-tab border-0">
                Title
              </th>
              <th className="p-2 min-width-160 font-family-tab border-0">
                Items
              </th>
              <th className="p-2 min-width-100 font-family-tab border-0" align="right">
                <span className="">Action</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {!isCopy && (
            <tr>
              <td colSpan="3" className="text-left">
                <div
                  aria-hidden="true"
                  className="font-weight-800 d-inline text-lightblue cursor-pointer mt-1 mb-1"
                  onClick={() => { showPageModal(true); dispatch(storePages(pageData)); dispatch(storeQuestions([])); }}
                >
                  <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
                  <span className="mr-2 font-family-tab">Add New</span>
                </div>
              </td>
            </tr>
            )}
            {(pageData && pageData.length > 0 && pageData.map((pl, index) => (
              !pl.isRemove && (
                <tr>
                  <td>{getDefaultNoValue(pl.title)}</td>
                  <td>
                    {pl.question_ids && pl.question_ids.length && pl.question_ids.length > 0 ? getQuestionsCount(pl.question_ids) : 0}
                  </td>
                  <td>
                    {!isCopy && (
                    <>
                      <Tooltip title="Edit">
                        <img
                          aria-hidden="true"
                          src={editIcon}
                          className="cursor-pointer mr-3"
                          height="12"
                          width="12"
                          alt="edit"
                          onClick={() => { setEditPageData(pl); setEditPageId(pl.id ? pl.id : false); setEditPageIndex(index + 1); dispatch(storeQuestions([])); showPageModal(true); }}
                        />
                      </Tooltip>

                      <Tooltip title="Delete">
                        <span className="font-weight-400 d-inline-block" />
                        <FontAwesomeIcon className="mr-1 ml-1 cursor-pointer" size="sm" icon={faTrashAlt} onClick={(e) => { removeData(e, index); }} />
                      </Tooltip>
                    </>
                    )}
                  </td>
                </tr>
              )
            )))}
          </tbody>
        </Table>
      </Box>
      )}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '3%',
          flexWrap: 'wrap',
        }}
      >
        <Box
          sx={{
            width: '48%',
            marginBottom: '10px',
          }}
        >
          <p className="mb-1">
            <FormLabel className="mb-2 mt-1 font-tiny line-height-small font-family-tab" id="demo-row-radio-buttons-group-label">Instructions to Auditee</FormLabel>
          </p>
          <JoditEditor
            ref={editor}
            value={instructions_to_auditee}
            config={editorConfig}
                      // onChange={onChange}
            onBlur={onInstrAuditeeChange}
          />
        </Box>
        <Box
          sx={{
            width: '48%',
            marginBottom: '10px',
          }}
        >
          <p className="mb-1">
            <FormLabel className="mb-2 mt-1 font-tiny line-height-small font-family-tab" id="demo-row-radio-buttons-group-label">Instructions to Auditor</FormLabel>
          </p>
          <JoditEditor
            ref={editor}
            value={instructions_to_auditor}
            config={editorConfig}
                      // onChange={onChange}
            onBlur={onInstrAuditorChange}
          />
        </Box>

      </Box>
      <Box
        sx={{
          width: '100%',
        }}
      >

        <p className="mb-1">
          <FormLabel className="mb-2 mt-1 font-tiny line-height-small font-family-tab" id="demo-row-radio-buttons-group-label">Terms and Conditions</FormLabel>
        </p>
        <JoditEditor
          ref={editor}
          value={terms_and_conditions}
          config={editorConfig}
                      // onChange={onChange}
          onBlur={onInstrTermsChange}
        />

      </Box>
      <DetailViewFormat detailResponse={pageQuestionList} />
      <DetailViewFormat detailResponse={pagesInfo} />
      {pageModal && (
        <Page
          editId={editPageId}
          editData={editPageData}
          editIndex={editPageIndex}
          pageData={pageData}
          setFieldValue={setFieldValue}
          atFinish={() => { showPageModal(false); setEditPageData(false); setEditPageIndex(false); setEditPageId(false); }}
          pageModal
        />
      )}
      <Dialog open={modalAlert} fullWidth size="sm">
        <DialogHeader size="sm" title="Alert" onClose={() => toggleAlert()} response={[]} />
        <hr className="m-0" />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You can not delete the page.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => { setModalAlert(false); }}>Ok</Button>
        </DialogActions>
      </Dialog>
      <Dialog size="xl" fullWidth open={viewMetric}>
        <DialogHeader title="View Metric" onClose={() => { setViewMetric(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <p className="font-family-tab-v2 mt-2">{audit_metric_id && audit_metric_id.name ? audit_metric_id.name : ''}</p>
            <Table responsive className="mb-2 font-weight-400 border-0 assets-table" width="100%">
              <thead className="bg-gray-light">
                <tr>
                  <th className="font-family-tab-v2">Category</th>
                  <th className="p-2 cursor-default font-family-tab-v2">Condition for Final Score</th>
                </tr>
              </thead>
              <tbody>
                {audit_metric_id && audit_metric_id.scale_line_ids && audit_metric_id.scale_line_ids.length > 0 && audit_metric_id.scale_line_ids.map((sl) => (
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
      <Dialog size="lg" fullWidth open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AdvancedSearchModal
              modelName={modelValue}
              afterReset={() => { setExtraModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              placeholderName="Search"
              setFieldValue={setFieldValue}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
});

BasicForm.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  reload: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default BasicForm;
