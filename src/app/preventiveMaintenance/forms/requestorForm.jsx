/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { TextField, CircularProgress, FormHelperText } from '@material-ui/core';
import {
  Row, Col, Modal, ModalBody,
} from 'reactstrap';
import { ThemeProvider } from '@material-ui/core/styles';
import { useFormikContext } from 'formik';

import InputAdornment from '@material-ui/core/InputAdornment';
import BackspaceIcon from '@material-ui/icons/Backspace';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import { InputField, FormikAutocomplete } from '@shared/formFields';
import { getAssetCategoryList, getOperationsList } from '../ppmService';
import preventiveActions from '../data/preventiveActions.json';
import theme from '../../util/materialTheme';
import { getCategoryList, getTeamList } from '../../assets/equipmentService';
import { generateErrorMessage, getAllowedCompanies, extractOptionsObject } from '../../util/appUtils';
import {
  getppmForLabel,
  getppmScoreLabel,
  getppmLabel,
  getPriorityLabel,
} from '../utils/utils';
import SearchModal from './searchModal';
import AdvancedSearchModal from './advancedSearchModal';

const appModels = require('../../util/appModels').default;

const RequestorForm = (props) => {
  const {
    editId,
    reloadData,
    setFieldValue,
    typePPM,
    formField: {
      title,
      categoryType,
      assetCategoryId,
      equipmentCategoryId,
      Priority,
      maintenanceTeamId,
      taskId,
      PPMBy,
      timePeriod,
      schedulerType,
      SchedulerOperationType,
      ScoreType,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    category_type, asset_category_id, category_id, task_id,
    maintenance_team_id, time_period, priority, ppm_by,
    is_all_records, scheduler_operation_type, sla_score_type,
    scheduler_type,
  } = formValues;
  const dispatch = useDispatch();
  const [assetOpen, setAssetOpen] = useState(false);
  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [ppmForOpen, setPpmForOpen] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [teamOpen, setTeamOpen] = useState(false);
  const [ppmByOpen, setPpmByOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [ppmForValue, setPpmForValue] = useState(false);
  const [ppmOperationValue, setPpmOperationValue] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scoreOpen, setScoreOpen] = useState(false);
  const [operationOpen, setOperationOpen] = useState(false);
  const [assetkeyword, setAssetKeyword] = useState('');
  const [equipmentkeyword, setEquipmentkeyword] = useState('');
  const [teamKeyword, setTeamKeyword] = useState('');
  const [taskKeyword, setTaskKeyword] = useState('');
  const [refresh, setRefresh] = useState(reloadData);
  const [fieldName, setFieldName] = useState('');
  const [openEquipmentSearchModal, setOpenEquipmentSearchModal] = useState(false);
  const [modalName, setModalName] = useState('');
  const [serchFieldValue, setSearchFieldValue] = useState('');

  const [scheduleTypeOpen, setScheduleTypeOpen] = useState(false);

  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [extraModal, setExtraModal] = useState(false);
  const [companyValue, setCompanyValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name']);

  const [teamOptions, setTeamOptions] = useState([]);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const { assetCategoriesInfo, taskInfo, ppmDetail } = useSelector((state) => state.ppm);
  const { categoriesInfo, teamsInfo } = useSelector((state) => state.equipment);

  const isInspection = !!(typePPM && typePPM === 'Inspection');

  useEffect(() => {
    setTeamOptions(extractOptionsObject(teamsInfo, maintenance_team_id));
  }, [editId, teamsInfo]);

  useEffect(() => {
    setRefresh(reloadData);
  }, [reloadData]);

  function getIsAllRecordsInfo() {
    let isAll = ppmDetail && ppmDetail.data && ppmDetail.data[0].is_all_records ? 'all' : 'multiple';

    if (is_all_records === 'all') {
      isAll = 'all';
    }

    if (is_all_records === 'multiple') {
      isAll = 'multiple';
    }

    return isAll;
  }

  useEffect(() => {
    getIsAllRecordsInfo();
  }, [is_all_records]);

  useEffect(() => {
    (async () => {
      if (category_type && category_type.value) {
        setPpmForValue(category_type.value);
        if (refresh === '1') {
          setFieldValue('category_id', '');
          setFieldValue('asset_category_id', '');
          setFieldValue('task_id', '');
          setFieldValue('duration', 0);
        }
      } else if (category_type) {
        setPpmForValue(category_type);
      }
    })();
  }, [category_type, refresh]);

  useEffect(() => {
    (async () => {
      if (scheduler_operation_type && scheduler_operation_type.value) {
        setPpmOperationValue(scheduler_operation_type.value);
        if (refresh === '1') {
          setFieldValue('sla_score_type', '');
        }
      } else if (scheduler_operation_type) {
        setPpmOperationValue(scheduler_operation_type);
      }
    })();
  }, [scheduler_operation_type, refresh]);

  useEffect(() => {
    if (((category_id && category_id.id) || (asset_category_id && asset_category_id.id)) && refresh === '1') {
      setFieldValue('task_id', '');
      setFieldValue('duration', 0);
    }
  }, [category_id, refresh]);

  useEffect(() => {
    if (editId && refresh === '1') {
      const isAllRecords = ppmDetail && ppmDetail.data && ppmDetail.data[0].is_all_records ? 'all' : 'multiple';
      setFieldValue('is_all_records', isAllRecords);
    }
  }, [editId, refresh]);

  useEffect(() => {
    (async () => {
      if (task_id && task_id.order_duration) {
        setFieldValue('duration', task_id.order_duration);
      }
    })();
  }, [task_id]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && assetOpen) {
        await dispatch(getAssetCategoryList(companies, appModels.ASSETCATEGORY, assetkeyword));
      }
    })();
  }, [assetOpen, assetkeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && taskOpen && (category_type && category_type.value) && ((asset_category_id && asset_category_id.id) || (category_id && category_id.id))) {
        const categoryId = category_type.value === 'e' ? category_id.id : asset_category_id.id;
        if (categoryId) {
          await dispatch(getOperationsList(companies, appModels.TASK, taskKeyword, category_type.value, categoryId));
        }
      }
    })();
  }, [taskOpen, taskKeyword, category_type, category_id, asset_category_id]);

  useEffect(() => {
    (async () => {
      if (category_type && ((asset_category_id && asset_category_id.id) || (category_id && category_id.id))) {
        const categoryId = category_type === 'e' ? category_id.id : asset_category_id.id;
        if (categoryId) {
          await dispatch(getOperationsList(companies, appModels.TASK, taskKeyword, category_type, categoryId));
        }
      }
    })();
  }, [category_type, category_id, asset_category_id]);

  useEffect(() => {
    (async () => {
      if (userInfo.data && equipmentOpen) {
        await dispatch(getCategoryList(companies, appModels.EQUIPMENTCATEGORY, equipmentkeyword));
      }
    })();
  }, [equipmentOpen, equipmentkeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo.data && teamOpen) {
        await dispatch(getTeamList(companies, appModels.TEAM, teamKeyword));
      }
    })();
  }, [teamOpen, teamKeyword]);

  const onAssetKeywordChange = (event) => {
    setAssetKeyword(event.target.value);
  };

  const onEquipmentKeywordChange = (event) => {
    setEquipmentkeyword(event.target.value);
  };

  const onTeamKeywordChange = (event) => {
    setTeamKeyword(event.target.value);
  };

  const onTaskKeywordChange = (event) => {
    setTaskKeyword(event.target.value);
  };

  const onEquipemntSearch = () => {
    setOpenEquipmentSearchModal(true);
    setFieldName('category_id');
    setModalName('Equipment Categories');
    setSearchFieldValue('path_name');
  };

  const onEquipmentClear = () => {
    setEquipmentkeyword(null);
    setEquipmentOpen(false);
    setFieldValue('category_id', '');
  };

  const showTeamModal = () => {
    setModelValue(appModels.TEAM);
    setFieldName('maintenance_team_id');
    setModalName('Maintenance Teams');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
    setColumns(['id', 'name']);
  };

  const onTeamClear = () => {
    setTeamKeyword(null);
    setFieldValue('maintenance_team_id', '');
    setTeamOpen(false);
  };

  let categoryOptions = [];
  let assetCategoryOptions = [];
  let taskOptions = [];

  if (categoriesInfo && categoriesInfo.loading) {
    categoryOptions = [{ path_name: 'Loading..' }];
  }
  if (categoriesInfo && categoriesInfo.data) {
    categoryOptions = categoriesInfo.data;
  }
  if (category_id && category_id.length && category_id.length > 0) {
    const oldId = [{ id: category_id[0], path_name: category_id[1] }];
    const newArr = [...categoryOptions, ...oldId];
    categoryOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (categoriesInfo && categoriesInfo.err) {
    categoryOptions = [];
  }

  if (assetCategoriesInfo && assetCategoriesInfo.loading) {
    assetCategoryOptions = [{ name: 'Loading..' }];
  }
  if (assetCategoriesInfo && assetCategoriesInfo.data) {
    assetCategoryOptions = assetCategoriesInfo.data;
  }
  if (asset_category_id && asset_category_id.length && asset_category_id.length > 0) {
    const oldId = [{ id: asset_category_id[0], name: asset_category_id[1] }];
    const newArr = [...assetCategoryOptions, ...oldId];
    assetCategoryOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (assetCategoriesInfo && assetCategoriesInfo.err) {
    assetCategoryOptions = [];
  }

  if (taskInfo && taskInfo.loading) {
    taskOptions = [{ name: 'Loading..' }];
  }
  if (task_id && task_id.length && task_id.length > 0) {
    const oldId = [{ id: task_id[0], name: task_id[1] }];
    const newArr = [...taskOptions, ...oldId];
    taskOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (taskInfo && taskInfo.data) {
    taskOptions = taskInfo.data;
  }
  if (taskInfo && taskInfo.err) {
    taskOptions = [];
  }

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const oldCatId = category_id && category_id.length && category_id.length > 0 ? category_id[1] : '';

  return (
    <>
      <h5 className="mb-2 mt-2">{isInspection ? 'Inspection Information' : 'PPM Information'}</h5>
      <ThemeProvider theme={theme}>
        <Row>
          <Col xs={12} sm={6} md={6} lg={6}>
            <InputField name={title.name} placeholder="Enter Title" label={title.label} isRequired={title.required} type="text" />
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={6} md={6} lg={6}>
            <FormikAutocomplete
              name={categoryType.name}
              isRequired={categoryType.required}
              placeholder="Enter Title"
              label={categoryType.label}
              className="bg-white"
              open={ppmForOpen}
              oldValue={getppmForLabel(category_type)}
              value={category_type && category_type.label ? category_type.label : getppmForLabel(category_type)}
              size="small"
              onOpen={() => {
                setPpmForOpen(true);
              }}
              onClose={() => {
                setPpmForOpen(false);
              }}
              getOptionSelected={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={preventiveActions.ppmFor}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  className="without-padding"
                  placeholder="Select"
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
          </Col>
          <Col xs={12} sm={6} md={6} lg={6}>
            <FormikAutocomplete
              name={maintenanceTeamId.name}
              label={maintenanceTeamId.label}
              className="bg-white"
              open={teamOpen}
              size="small"
              isRequired
              oldValue={getOldData(maintenance_team_id)}
              value={maintenance_team_id && maintenance_team_id.name ? maintenance_team_id.name : getOldData(maintenance_team_id)}
              onOpen={() => {
                setTeamOpen(true);
              }}
              onClose={() => {
                setTeamOpen(false);
              }}
              loading={teamsInfo && teamsInfo.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={teamOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onTeamKeywordChange}
                  variant="outlined"
                  value={teamKeyword}
                  className={(getOldData(maintenance_team_id) || (maintenance_team_id && maintenance_team_id.id) || (teamKeyword && teamKeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {teamsInfo && teamsInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {(getOldData(maintenance_team_id) || (maintenance_team_id && maintenance_team_id.id) || (teamKeyword && teamKeyword.length > 0)) && (
                          <IconButton onClick={onTeamClear}>
                            <BackspaceIcon fontSize="small" />
                          </IconButton>
                          )}
                          <IconButton onClick={showTeamModal}>
                            <SearchIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      </>
                    ),
                  }}
                />
              )}
            />
            {(teamsInfo && teamsInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(teamsInfo)}</span></FormHelperText>)}
          </Col>
        </Row>
        <Row>
          {ppmForValue === 'ah'
            ? (
              <Col xs={12} sm={6} md={6} lg={6}>
                <FormikAutocomplete
                  name={assetCategoryId.name}
                  label={assetCategoryId.label}
                  className="bg-white"
                  open={assetOpen}
                  size="small"
                  onOpen={() => {
                    setAssetOpen(true);
                    setAssetKeyword('');
                  }}
                  onClose={() => {
                    setAssetOpen(false);
                    setAssetKeyword('');
                  }}
                  oldValue={getOldData(asset_category_id)}
                  value={asset_category_id && asset_category_id.name ? asset_category_id.name : getOldData(asset_category_id)}
                  loading={assetCategoriesInfo && assetCategoriesInfo.loading}
                  getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                  options={assetCategoryOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={onAssetKeywordChange}
                      variant="outlined"
                      className="without-padding"
                      placeholder="Search & Select"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {assetCategoriesInfo && assetCategoriesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
                {(assetCategoriesInfo && assetCategoriesInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(assetCategoriesInfo)}</span></FormHelperText>)}
              </Col>
            )
            : (
              <Col xs={12} sm={6} md={6} lg={6}>
                <FormikAutocomplete
                  name={equipmentCategoryId.name}
                  label={equipmentCategoryId.label}
                  className="bg-white"
                  open={equipmentOpen}
                  size="small"
                  oldValue={oldCatId}
                  value={category_id && category_id.path_name ? category_id.path_name : oldCatId}
                  onOpen={() => {
                    setEquipmentOpen(true);
                    setEquipmentkeyword('');
                  }}
                  onClose={() => {
                    setEquipmentOpen(false);
                    setEquipmentkeyword('');
                  }}
                  loading={categoriesInfo && categoriesInfo.loading}
                  getOptionSelected={(option, value) => (value.length > 0 ? option.path_name === value.path_name : '')}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.path_name)}
                  options={categoryOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={onEquipmentKeywordChange}
                      variant="outlined"
                      className={((oldCatId) || (category_id && category_id.id) || (equipmentkeyword && equipmentkeyword.length > 0))
                        ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                      placeholder="Search & Select"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {categoriesInfo && categoriesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                            <InputAdornment position="end">
                              {((oldCatId) || (category_id && category_id.id) || (equipmentkeyword && equipmentkeyword.length > 0)) && (
                              <IconButton onClick={onEquipmentClear}>
                                <BackspaceIcon fontSize="small" />
                              </IconButton>
                              )}
                              <IconButton onClick={onEquipemntSearch}>
                                <SearchIcon fontSize="small" />
                              </IconButton>
                            </InputAdornment>
                          </>
                        ),
                      }}
                    />
                  )}
                />
                <Modal size="xl" className="border-radius-50px modal-dialog-centered" isOpen={openEquipmentSearchModal}>
                  <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setOpenEquipmentSearchModal(false); }} />
                  <ModalBody className="mt-0 pt-0">
                    <SearchModal
                      modelName={appModels.EQUIPMENTCATEGORY}
                      afterReset={() => { setOpenEquipmentSearchModal(false); }}
                      fieldName={fieldName}
                      fields={['path_name']}
                      company=""
                      otherFieldName={category_id && category_id.id ? category_id.id : ''}
                      modalName={modalName}
                      setFieldValue={setFieldValue}
                      serchFieldValue={serchFieldValue}
                    />
                  </ModalBody>
                </Modal>
                {(categoriesInfo && categoriesInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(categoriesInfo)}</span></FormHelperText>)}
              </Col>
            )}
          <Col xs={12} sm={6} md={6} lg={6}>
            <FormikAutocomplete
              name={taskId.name}
              label={taskId.label}
              className="bg-white"
              open={taskOpen}
              isRequired={isInspection}
              size="small"
              oldValue={getOldData(task_id)}
              value={task_id && task_id.name ? task_id.name : getOldData(task_id)}
              onOpen={() => {
                setTaskOpen(true);
              }}
              onClose={() => {
                setTaskOpen(false);
              }}
              loading={taskInfo && taskInfo.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={taskOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onTaskKeywordChange}
                  variant="outlined"
                  className="without-padding"
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {taskInfo && taskInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            {(taskInfo && taskInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(taskInfo)}</span></FormHelperText>)}
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={6} md={6} lg={6}>
            <FormikAutocomplete
              name={timePeriod.name}
              label={timePeriod.label}
              className="bg-white"
              open={scheduleOpen}
              size="small"
              oldValue={time_period}
              value={time_period && time_period.label ? time_period.label : time_period}
              onOpen={() => {
                setScheduleOpen(true);
              }}
              onClose={() => {
                setScheduleOpen(false);
              }}
              getOptionSelected={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={preventiveActions.timeperiod}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  className="without-padding"
                  placeholder="Select"
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
          </Col>
          <Col xs={12} sm={6} md={6} lg={6}>
            <FormikAutocomplete
              name={Priority.name}
              label={Priority.label}
              className="bg-white"
              open={priorityOpen}
              size="small"
              onOpen={() => {
                setPriorityOpen(true);
              }}
              onClose={() => {
                setPriorityOpen(false);
              }}
              oldValue={getPriorityLabel(priority)}
              value={priority && priority.label ? priority.label : getPriorityLabel(priority)}
              getOptionSelected={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={preventiveActions.priority}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  className="without-padding"
                  placeholder="Select"
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
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={6} md={6} lg={6}>
            <FormikAutocomplete
              name={PPMBy.name}
              label={PPMBy.label}
              isRequired={PPMBy.required}
              className="bg-white"
              open={ppmByOpen}
              size="small"
              oldValue={getppmLabel(ppm_by)}
              value={ppm_by && ppm_by.label ? ppm_by.label : getppmLabel(ppm_by)}
              onOpen={() => {
                setPpmByOpen(true);
              }}
              onClose={() => {
                setPpmByOpen(false);
              }}
              getOptionSelected={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={preventiveActions.ppmBy}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  className="without-padding"
                  placeholder="Select"
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
          </Col>
          {isInspection && (
          <Col xs={12} sm={6} md={6} lg={6}>
            <FormikAutocomplete
              name={schedulerType.name}
              label={schedulerType.label}
              className="bg-white"
              isRequired
              open={scheduleTypeOpen}
              size="small"
              oldValue={scheduler_type}
              value={scheduler_type && scheduler_type.label ? scheduler_type.label : scheduler_type}
              onOpen={() => {
                setScheduleTypeOpen(true);
              }}
              onClose={() => {
                setScheduleTypeOpen(false);
              }}
              getOptionSelected={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={preventiveActions.types}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  className="without-padding"
                  placeholder="Select"
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
          </Col>
          )}
          { /* <Col>
            <Label for={type.name} className="font-weight-600 m-0">
              Type
            </Label>
            <br />
            <CheckboxFieldGroup
              name={type.name}
              checkedvalue="all"
              customvalue={getIsAllRecordsInfo()}
              id="all"
              label={type.label}
            />
            <CheckboxFieldGroup
              name={type.name}
              checkedvalue="multiple"
              customvalue={getIsAllRecordsInfo()}
              id="multiple"
              label={type.label1}
            />
          </Col> */ }
        </Row>
        <Row>
          <Col xs={12} sm={6} md={6} lg={6}>
            <FormikAutocomplete
              name={SchedulerOperationType.name}
              label={SchedulerOperationType.label}
              className="bg-white"
              open={operationOpen}
              size="small"
              oldValue={scheduler_operation_type}
              value={scheduler_operation_type && scheduler_operation_type.label ? scheduler_operation_type.label : scheduler_operation_type}
              onOpen={() => {
                setOperationOpen(true);
              }}
              onClose={() => {
                setOperationOpen(false);
              }}
              getOptionSelected={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={preventiveActions.schedulerOperation}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  className="without-padding"
                  placeholder="Select"
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
          </Col>
          <Col xs={12} sm={6} md={6} lg={6}>
            {ppmOperationValue === 'SLA Score Card'
              && (
                <FormikAutocomplete
                  name={ScoreType.name}
                  label={ScoreType.label}
                  className="bg-white"
                  open={scoreOpen}
                  size="small"
                  oldValue={getppmScoreLabel(sla_score_type)}
                  value={sla_score_type && sla_score_type.label ? sla_score_type.label : getppmScoreLabel(sla_score_type)}
                  onOpen={() => {
                    setScoreOpen(true);
                  }}
                  onClose={() => {
                    setScoreOpen(false);
                  }}
                  getOptionSelected={(option, value) => option.label === value.label}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                  options={preventiveActions.scoreType}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      className="without-padding"
                      placeholder="Select"
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
              )}
          </Col>
        </Row>
        <Modal size="xl" className="border-radius-50px modal-dialog-centered" isOpen={extraModal}>
          <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setExtraModal(false); }} />
          <ModalBody className="mt-0 pt-0">
            <AdvancedSearchModal
              modelName={modelValue}
              modalName={modalName}
              afterReset={() => { setExtraModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              otherFieldName={otherFieldName}
              otherFieldValue={otherFieldValue}
              setFieldValue={setFieldValue}
            />
          </ModalBody>
        </Modal>
      </ThemeProvider>
    </>
  );
};

RequestorForm.defaultProps = {
  editId: undefined,
  typePPM: false,
};

RequestorForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  reloadData: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  typePPM: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
};

export default RequestorForm;
