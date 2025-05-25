/* eslint-disable no-nested-ternary */
/* eslint-disable no-undef */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  CircularProgress,
  TextField
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import {
  Dialog, DialogContent, DialogContentText,
} from '@mui/material';
import { Box } from "@mui/system";
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';


import {
  getBuildings,
  getEmployeeDataList
} from '../../../assets/equipmentService';
import DialogHeader from '../../../commonComponents/dialogHeader';
import MuiAutoComplete from "../../../commonComponents/formFields/muiAutocomplete";
import MuiCheckboxField from '../../../commonComponents/formFields/muiCheckbox';
import MuiTextField from "../../../commonComponents/formFields/muiTextField";
import { getCascader, getEquipmentList, getSpaceAllSearchList } from '../../../helpdesk/ticketService';
import { addChildrens, addParents } from '../../../helpdesk/utils/utils';
import { getOperationsList } from '../../../preventiveMaintenance/ppmService';
import {
  extractOptionsObject,
  generateErrorMessage,
  getAllowedCompanies
} from '../../../util/appUtils';
import {
  getIssuePermitChecklist,
  getNatureWork, getPrepareChecklist,
  getTypeWork,
  getVendor,
} from '../../workPermitService';
import AdditionalForm from './additionalForm';
import AdvancedSearchModal from './advancedSearchModal';
import SearchModalMultiple from './searchModalMultiple';

const appModels = require('../../../util/appModels').default;

const useStyles = makeStyles({
  option: {
    padding: 5,
    margin: 5,
    display: 'flow-root',
    '& > span': {
      marginRight: 10,
    },
  },
});

const BasicForm = (props) => {
  const dispatch = useDispatch();
  const {
    setFieldValue,
    formField,
    setFieldTouched,
    editId,
    formField: {
      title,
      preparednessCheckList,
      maintenanceCheckList,
      issuePermitCheckList,
      canBeExtended,
      companyId,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    type, planned_start_time,
    duration, vendor_id, nature_work_id,
    preparedness_checklist_id, task_id, company_id, is_can_be_extended, issue_permit_checklist_id,
  } = formValues;
  const classes = useStyles();
  const [atOpen, setAtOpen] = useState(false);
  const [atKeyword, setAtKeyword] = useState('');
  const [spaceOpen, setSpaceOpen] = useState(false);
  const [spacekeyword, setSpaceKeyword] = useState('');
  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [equipmentkeyword, setEquipmentkeyword] = useState('');
  const [customerOpen, setCustomerOpen] = useState(false);
  const [customerKeyword, setCustomerKeyword] = useState('');
  const [workOpen, setWorkOpen] = useState(false);
  const [typeRequest, setTypeRequest] = useState(false);
  const [workKeyword, setWorkKeyword] = useState('');
  const [natureOpen, setNatureOpen] = useState(false);
  const [natureKeyword, setNatureKeyword] = useState('');
  const [taskOpen, setTaskOpen] = useState(false);
  const [taskKeyword, setTaskKeyword] = useState('');
  const [prepareOpen, setPrepareOpen] = useState(false);
  const [prepareKeyword, setPrepareKeyword] = useState('');
  const [issueOpen, setIssueOpen] = useState(false);
  const [issueKeyword, setIssueKeyword] = useState('');
  const [typeData, setTypeData] = useState(false);
  const [natureShow, setNatureShow] = useState(false);
  const [vendorShow, setVendorShow] = useState(false);

  const [extraModal, setExtraModal] = useState(false);
  const [extraMultipleModal, setExtraMultipleModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [columns, setColumns] = useState(['id', 'name']);

  const [parentId, setParentId] = useState('');
  const [childLoad, setChildLoad] = useState(false);
  const [cascaderValues, setCascaderValues] = useState([]);
  const [childValues, setChildValues] = useState([]);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    buildingsInfo, buildingSpaces,
  } = useSelector((state) => state.equipment);
  const {
    prepareInfo, issuePermitInfo,
  } = useSelector((state) => state.workpermit);
  const { taskInfo } = useSelector((state) => state.ppm);
  const { allowedCompanies } = useSelector((state) => state.setup);

  const userCompanies = allowedCompanies && allowedCompanies.data && allowedCompanies.data.allowed_companies && allowedCompanies.data.allowed_companies.length > 0
    ? allowedCompanies.data.allowed_companies : userInfo && userInfo.data && userInfo.data.allowed_companies && userInfo.data.allowed_companies.length > 0 ? userInfo.data.allowed_companies : [];

  useEffect(() => {
    if (userInfo && userInfo.data && spaceOpen) {
      dispatch(getBuildings(companies, appModels.SPACE));
    }
  }, [userInfo]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (buildingsInfo && buildingsInfo.data)) {
      setChildValues(addParents(buildingsInfo.data));
    }
  }, [buildingsInfo]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (buildingSpaces && buildingSpaces.data && buildingSpaces.data.length && parentId)) {
      setChildLoad(true);
      const childData = addChildrens(childValues, buildingSpaces.data[0].child, parentId);
      setChildValues(childData);
    }
  }, [buildingSpaces, parentId]);

  useEffect(() => {
    if (childValues) {
      setCascaderValues(childValues);
    }
  }, [childValues]);

  useEffect(() => {
    if (cascaderValues) {
      dispatch(getCascader(cascaderValues));
    }
  }, [cascaderValues, buildingSpaces, childLoad]);

  useEffect(() => {
    if (planned_start_time) {
      const dt = new Date(planned_start_time);
      const endDateAdd = dt.setTime(dt.getTime() + (duration * 60 * 60 * 1000));
      setFieldValue('planned_end_time', new Date(endDateAdd));
    }
  }, [planned_start_time, duration]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const empId = userInfo && userInfo.data && userInfo.data.employee && userInfo.data.employee.id ? userInfo.data.employee.id : '';
      const empName = userInfo && userInfo.data && userInfo.data.employee && userInfo.data.employee.name ? userInfo.data.employee.name : '';
      const companyIds = userInfo.data.company ? userInfo.data.company.id : '';
      setFieldValue('requestor_id', { id: empId, name: empName });
      if (!editId) {
        setFieldValue('reviewer_id', { id: empId, name: empName });
      }
      setFieldValue('company_id', companyIds);
    }
  }, [userInfo, editId]);

  let company = '';
  useEffect(() => {
    if (userInfo && userInfo.data) {
      // eslint-disable-next-line no-nested-ternary
      company = userInfo.data.company ? userInfo.data.company : '';
      setFieldValue('company_id', company);
    }
  }, [userInfo]);

  useEffect(() => {
    (async () => {
      if (type) {
        setTypeData(type);
      }
    })();
  }, [type]);

  useEffect(() => {
    if (vendor_id && Object.keys(vendor_id).length && Object.keys(vendor_id).length > 0 && vendorShow) {
      const vEmail = vendor_id.email ? vendor_id.email : '';
      const vMobile = vendor_id.mobile ? vendor_id.mobile : '';
      const vName = vendor_id.name ? vendor_id.name : '';
      setFieldValue('vendor_poc', vName);
      setFieldValue('vendor_mobile', vMobile);
      setFieldValue('vendor_email', vEmail);
    }
  }, [vendor_id, vendorShow]);

  useEffect(() => {
    if (nature_work_id && Object.keys(nature_work_id).length && Object.keys(nature_work_id).length > 0 && natureShow) {
      const tData = nature_work_id.task_id ? nature_work_id.task_id : '';
      const pData = nature_work_id.preparedness_checklist_id ? nature_work_id.preparedness_checklist_id : '';
      const aData = nature_work_id.approval_authority_id ? nature_work_id.approval_authority_id : '';
      const eAuthData = nature_work_id.ehs_authority_id ? nature_work_id.ehs_authority_id : '';
      const sdata = nature_work_id.security_office_id ? nature_work_id.security_office_id : '';
      const eData = nature_work_id.ehs_instructions ? nature_work_id.ehs_instructions : '';
      const termsData = nature_work_id.terms_conditions ? nature_work_id.terms_conditions : '';
      if (tData && Object.keys(tData).length && Object.keys(tData).length > 0) {
        setFieldValue('task_id', { id: tData.id, name: tData.name });
      }
      if (pData && Object.keys(pData).length && Object.keys(pData).length > 0) {
        setFieldValue('preparedness_checklist_id', { id: pData.id, name: pData.name });
      }
      if (aData && Object.keys(aData).length && Object.keys(aData).length > 0) {
        setFieldValue('approval_authority_id', { id: aData.id, name: aData.name });
      }
      if (eAuthData && Object.keys(eAuthData).length && Object.keys(eAuthData).length > 0) {
        setFieldValue('ehs_authority_id', { id: eAuthData.id, name: eAuthData.name });
      }
      if (sdata && Object.keys(sdata).length && Object.keys(sdata).length > 0) {
        setFieldValue('security_office_id', { id: sdata.id, name: sdata.name });
      }
      setFieldValue('ehs_instructions', eData);
      setFieldValue('terms_conditions', termsData);
    }
  }, [nature_work_id]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && atOpen) {
        await dispatch(getEmployeeDataList(companies, appModels.EMPLOYEE, atKeyword));
      }
    })();
  }, [userInfo, atKeyword, atOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && spaceOpen) {
        await dispatch(getSpaceAllSearchList(companies, appModels.SPACE, spacekeyword));
      }
    })();
  }, [spaceOpen, spacekeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo.data && equipmentOpen) {
        await dispatch(getEquipmentList(companies, appModels.EQUIPMENT, equipmentkeyword));
      }
    })();
  }, [equipmentOpen, equipmentkeyword]);

  useEffect(() => {
    if (userInfo && userInfo.data && customerOpen) {
      dispatch(getVendor(companies, appModels.PARTNER, 'supplier', customerKeyword));
    }
  }, [userInfo, customerKeyword, customerOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && workOpen) {
      dispatch(getTypeWork(companies, appModels.WORKTYPE, workKeyword));
    }
  }, [userInfo, workKeyword, workOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && natureOpen) {
      dispatch(getNatureWork(companies, appModels.NATUREWORK, natureKeyword));
    }
  }, [userInfo, natureKeyword, natureOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && taskOpen) {
        await dispatch(getOperationsList(companies, appModels.TASK, taskKeyword));
      }
    })();
  }, [userInfo, taskKeyword, taskOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && prepareOpen) {
        await dispatch(getPrepareChecklist(companies, appModels.PPMCHECKLIST, prepareKeyword));
      }
    })();
  }, [userInfo, prepareKeyword, prepareOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && issueOpen) {
        await dispatch(getIssuePermitChecklist(companies, appModels.PPMCHECKLIST, issueKeyword));
      }
    })();
  }, [userInfo, issueKeyword, issueOpen]);

  const onTaskKeywordChange = (event) => {
    setTaskKeyword(event.target.value);
  };

  const onIssueKeywordChange = (event) => {
    setIssueKeyword(event.target.value);
  };

  const onPrepareKeywordChange = (event) => {
    setPrepareKeyword(event.target.value);
  };

  const onMcClear = () => {
    setTaskKeyword(null);
    setFieldValue('task_id', '');
    setTaskOpen(false);
  };

  const showMcModal = () => {
    setModelValue(appModels.TASK);
    setColumns(['id', 'name']);
    setFieldName('task_id');
    setModalName('Maintenance Checklist');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onIcClear = () => {
    setIssueKeyword(null);
    setFieldValue('issue_permit_checklist_id', '');
    setIssueOpen(false);
  };

  const showIcModal = () => {
    setModelValue(appModels.PPMCHECKLIST);
    setColumns(['id', 'name']);
    setFieldName('issue_permit_checklist_id');
    setModalName('Issue Permit Checklist');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onPcClear = () => {
    setPrepareKeyword(null);
    setFieldValue('preparedness_checklist_id', '');
    setPrepareOpen(false);
  };

  const showPcModel = () => {
    setModelValue(appModels.PPMCHECKLIST);
    setColumns(['id', 'name']);
    setFieldName('preparedness_checklist_id');
    setModalName('Readiness Checklist');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const prepareOptions = extractOptionsObject(prepareInfo, preparedness_checklist_id);
  const taskOptions = extractOptionsObject(taskInfo, task_id);
  const issuePermitOptions = extractOptionsObject(issuePermitInfo, issue_permit_checklist_id);

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const oldCompId = company_id && company_id.length && company_id.length > 0 ? company_id[1] : '';

  return (
    <>
      <Box>
        <MuiTextField
          sx={{
            marginTop: "auto",
            marginBottom: "10px",
          }}
          name={title.name}
          label={title.label}
          isRequired
          formGroupClassName="m-1"
          type="text"
          inputProps={{ maxLength: "150" }}
        />
        <Box
          sx={{
            width: "100%",
            display: "flex",
            gap: "20px"
          }}>

          <Box
            sx={{
              width: "50%",
            }}>

            <MuiAutoComplete
              sx={{
                marginTop: "auto",
                marginBottom: "10px",
              }}
              name={maintenanceCheckList.name}
              label={maintenanceCheckList.label}
              className="bg-white"
              open={taskOpen}
              size="small"
              oldValue={getOldData(task_id)}
              value={task_id && task_id.name ? task_id.name : getOldData(task_id)}
              onOpen={() => {
                setTaskOpen(true);
              }}
              onClose={() => {
                setTaskOpen(false);
              }}
              apiError={(taskInfo && taskInfo.err) ? generateErrorMessage(taskInfo) : false}
              loading={taskInfo && taskInfo.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={taskOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={maintenanceCheckList.label}
                  onChange={onTaskKeywordChange}
                  variant="standard"
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {taskInfo && taskInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((task_id && task_id.id) || (taskKeyword && taskKeyword.length > 0)) && (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onMcClear}
                            >
                              <IoCloseOutline size={22} fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={showMcModal}
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
            <MuiAutoComplete
              sx={{
                marginTop: "auto",
                marginBottom: "10px",
              }}
              name={issuePermitCheckList.name}
              label={issuePermitCheckList.label}
              className="bg-white"
              open={issueOpen}
              size="small"
              oldValue={getOldData(issue_permit_checklist_id)}
              value={issue_permit_checklist_id && issue_permit_checklist_id.name ? issue_permit_checklist_id.name : getOldData(issue_permit_checklist_id)}
              onOpen={() => {
                setIssueOpen(true);
              }}
              onClose={() => {
                setIssueOpen(false);
              }}
              apiError={(issuePermitInfo && issuePermitInfo.err) ? generateErrorMessage(issuePermitInfo) : false}
              loading={issuePermitInfo && issuePermitInfo.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={issuePermitOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={issuePermitCheckList.label}
                  onChange={onIssueKeywordChange}
                  variant="standard"
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {issuePermitInfo && issuePermitInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((issue_permit_checklist_id && issue_permit_checklist_id.id) || (issueKeyword && issueKeyword.length > 0)) && (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onIcClear}
                            >
                              <IoCloseOutline size={22} fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={showIcModal}
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
            <MuiCheckboxField
              className="mt-2"
              name={canBeExtended.name}
              label={canBeExtended.label}
            />
          </Box>
          <Box
            sx={{
              width: "50%",
            }}>
            <MuiAutoComplete
              sx={{
                marginTop: "auto",
                marginBottom: "10px",
              }}
              name={preparednessCheckList.name}
              label={preparednessCheckList.label}
              className="bg-white"
              open={prepareOpen}
              size="small"
              isRequired
              oldValue={getOldData(preparedness_checklist_id)}
              value={preparedness_checklist_id && preparedness_checklist_id.name ? preparedness_checklist_id.name : getOldData(preparedness_checklist_id)}
              onOpen={() => {
                setPrepareOpen(true);
              }}
              onClose={() => {
                setPrepareOpen(false);
              }}
              apiError={(prepareInfo && prepareInfo.err) ? generateErrorMessage(prepareInfo) : false}
              loading={prepareInfo && prepareInfo.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={prepareOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={`${preparednessCheckList.label}`}
                  required
                  onChange={onPrepareKeywordChange}
                  variant="standard"
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {prepareInfo && prepareInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((preparedness_checklist_id && preparedness_checklist_id.id) || (prepareKeyword && prepareKeyword.length > 0)) && (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onPcClear}
                            >
                              <IoCloseOutline size={22} fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={showPcModel}
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
            <MuiAutoComplete
              sx={{
                marginTop: "auto",
                marginBottom: "10px",
              }}
              name={companyId.name}
              label={companyId.label}
              className="bg-white"
              open={companyOpen}
              size="small"
              disabled
              oldValue={oldCompId}
              value={company_id && company_id.name ? company_id.name : oldCompId}
              onOpen={() => {
                setCompanyOpen(true);
              }}
              onClose={() => {
                setCompanyOpen(false);
              }}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={userCompanies}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={`${companyId.label}`}
                  required
                  variant="standard"
                  className="without-padding custom-icons"
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Box>
        </Box>
        <AdditionalForm formField={formField} setFieldTouched={setFieldTouched} setFieldValue={setFieldValue} />
      </Box>
      <Dialog maxWidth="lg" open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} sx={{ width: '1000px' }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AdvancedSearchModal
              modelName={modelValue}
              afterReset={() => { setExtraModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              setFieldValue={setFieldValue}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog maxWidth="lg" open={extraMultipleModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraMultipleModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchModalMultiple
              modelName={modelValue}
              afterReset={() => { setExtraMultipleModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              modalName={modalName}
              otherFieldName={otherFieldName}
              otherFieldValue={otherFieldValue}
              setFieldValue={setFieldValue}
              setVendorShow={setVendorShow}
              setNatureShow={setNatureShow}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

BasicForm.propTypes = {
  formField: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  editId: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default BasicForm;
