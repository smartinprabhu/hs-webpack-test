/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Row, Col, Table, Modal, ModalBody,
} from 'reactstrap';
import { Autocomplete } from '@material-ui/lab';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import {
  TextField, CircularProgress, FormHelperText, FormControl,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import {
  
  Typography,
} from '@mui/material';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import Loader from '@shared/loading';
import addIcon from '@images/icons/plusCircleBlue.svg';
import { AddThemeColor } from '../../../themes/theme';
import { getPreventiveCheckList, getChecklistData, getTaskChecklists } from '../../ppmService';
import { getSpaceAllSearchList, getEquipmentList } from '../../../helpdesk/ticketService';
import '../../preventiveMaintenance.scss';
import {
  getArrayFromValuesById, getColumnArrayById,
  getColumnArrayByIdWithArray,
  getAllowedCompanies, generateErrorMessage,
} from '../../../util/appUtils';
import SearchModal from './searchModal';

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

const CheckListForm = (props) => {
  const {
    editId,
    setFieldValue,
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [checkListData, setCheckListData] = useState([]);
  const [totalListData, setTotalListData] = useState([]);
  const [checkListAdd, setCheckListAdd] = useState('');
  const [checkListOptions, setCheckListOptions] = useState([]);
  const typeOptions = [{ value: 'e', label: 'Equipment' }, { value: 'ah', label: 'Space' }];
  const [openId, setOpen] = useState('');
  const [openType, setOpenType] = useState('');
  const [checkListKeyword, setCheckListKeyword] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [columns, setColumns] = useState(['name']);
  const [fieldName, setFieldName] = useState('');
  const [modalName, setModalName] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [companyValue, setCompanyValue] = useState(false);
  const [extraModal, setExtraModal] = useState(false);
  const [arrayList, setArrayList] = useState([]);
  const [arrayIndex, setArrayIndex] = useState(false);
  const [operationData, setOperationData] = useState(false);

  const [spaceOpen, setSpaceOpen] = useState('');
  const [spaceKeyword, setSpaceKeyword] = useState('');
  const [spaceOptions, setSpaceOptions] = useState('');
  const [equipmentOpen, setEquipmentOpen] = useState('');
  const [equipmentKeyword, setEquipmentKeyword] = useState('');
  const [equipmentOptions, setEquipmentOptions] = useState('');

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const { spaceInfoList, equipmentInfo } = useSelector((state) => state.ticket);
  const {
    checkList, checklistSelected, ppmOperationData, taskCheckLists,
  } = useSelector((state) => state.ppm);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getPreventiveCheckList(companies, appModels.PPMCHECKLIST, checkListKeyword));
    }
  }, [userInfo, checkListKeyword]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const keywordTrim = spaceKeyword ? encodeURIComponent(spaceKeyword.trim()) : '';
      dispatch(getSpaceAllSearchList(companies, appModels.SPACE, keywordTrim));
    }
  }, [userInfo, spaceKeyword]);

  useEffect(() => {
    if (userInfo.data) {
      const keywordTrim = equipmentKeyword ? encodeURIComponent(equipmentKeyword.trim()) : '';
      dispatch(getEquipmentList(companies, appModels.EQUIPMENT, keywordTrim));
    }
  }, [userInfo, equipmentKeyword]);

  useEffect(() => {
    if (editId && (userInfo && userInfo.data) && (ppmOperationData && ppmOperationData.data)) {
      dispatch(getTaskChecklists(companies, appModels.TASKCHECKLIST, false, ppmOperationData.data[0].check_list_ids));
    }
  }, [editId, ppmOperationData]);

  useEffect(() => {
    if (editId && (taskCheckLists && taskCheckLists.data && taskCheckLists.data.length)) {
      const newArrData = taskCheckLists.data.map((cl) => ({
        ...cl,
        id: cl.id,
        check_list_id: cl.check_list_id,
        category_type: cl.category_type === 'e' ? ['e', 'Equipment'] : ['ah', 'Space'],
        equipment_id: cl.equipment_id,
        location_id: cl.location_id,
      }));
      setCheckListData(newArrData);
      dispatch(getChecklistData(newArrData));
    }
  }, [editId, taskCheckLists]);

  useEffect(() => {
    if (checkList && checkList.data && checkList.data.length > 0) {
      const ids = getColumnArrayByIdWithArray(checklistSelected && checklistSelected.length ? checklistSelected : [], 'check_list_id');
      const data = getArrayFromValuesById(checkList.data, ids, 'id');
      if (data && data.length > 0) {
        setCheckListOptions(data.map((cl) => ({
          ...cl, value: cl.id, label: cl.name,
        })));
      }
    }
  }, [checkList]);

  useEffect(() => {
    if (checkListAdd) {
      setCheckListData(checkListData);
      dispatch(getChecklistData(checkListData));
      const ids = getColumnArrayById(totalListData && totalListData.length ? totalListData : [], 'check_list_id');
      const data = getArrayFromValuesById(checkList && checkList.data ? checkList.data : [], ids, 'id');
      setCheckListOptions(data.map((cl) => ({
        ...cl, value: cl.id, label: cl.name,
      })));
    }
  }, [checkListAdd]);

  useEffect(() => {
    if (spaceInfoList && spaceInfoList.data && spaceInfoList.data.length > 0) {
      const { data } = spaceInfoList;
      setSpaceOptions(data.map((cl) => ({
        ...cl, value: cl.id, label: cl.path_name,
      })));
    }
  }, [spaceInfoList]);

  useEffect(() => {
    if (equipmentInfo && equipmentInfo.data && equipmentInfo.data.length > 0) {
      const { data } = equipmentInfo;
      setEquipmentOptions(data.map((cl) => ({
        ...cl, value: cl.id, label: cl.name,
      })));
    }
  }, [equipmentInfo]);

  useEffect(() => {
    if (checklistSelected && checklistSelected.length > 0) {
      setFieldValue('check_list_ids', checklistSelected);
      setTotalListData(checklistSelected);
    } else {
      setFieldValue('check_list_ids', []);
      setCheckListData([]);
      setTotalListData([]);
    }
  }, [checklistSelected]);

  const loadEmptyTd = () => {
    let newData = {
      check_list_id: '', category_type: '', equipment_id: '', location_id: '',
    };
    if (editId) {
      newData = {
        check_list_id: '', category_type: '', equipment_id: '', location_id: '', id: false,
      };
    }
    setCheckListData((data) => [...data, newData]);
    setCheckListAdd(Math.random());
  };

  const removeData = (e, index) => {
    if (editId) {
      const newData = checkListData;
      const { id } = newData[index];
      if (id) {
        newData[index].isRemove = true;
        setCheckListData(newData);
        setCheckListAdd(Math.random());
      } else {
        newData.splice(index, 1);
        setCheckListData(newData);
        setCheckListAdd(Math.random());
      }
    } else {
      const checkData = checkListData;
      checkData.splice(index, 1);
      setCheckListData(checkData);
      setCheckListAdd(Math.random());
    }
  };

  const onChangeCheckList = (e, index) => {
    const newData = checkListData;
    newData[index].check_list_id = [e.id, e.name];
    newData[index].name = e.name;
    setCheckListData(newData);
    setCheckListAdd(Math.random());
  };

  const onChangeType = (e, index) => {
    if (e) {
      const newData = checkListData;
      newData[index].category_type = [e.value, e.label];
      setCheckListData(newData);
      setCheckListAdd(Math.random());
    } else {
      const newData = checkListData;
      newData[index].category_type = '';
      setCheckListData(newData);
      setCheckListAdd(Math.random());
    }
  };

  const onChangeEquipment = (e, index) => {
    const newData = checkListData;
    newData[index].equipment_id = [e.id, e.name];
    setCheckListData(newData);
    setCheckListAdd(Math.random());
  };

  const onChangeSpace = (e, index) => {
    const newData = checkListData;
    newData[index].location_id = [e.id, e.path_name];
    setCheckListData(newData);
    setCheckListAdd(Math.random());
  };

  const onCheckListKeywordChange = (event) => {
    setCheckListKeyword(event.target.value);
  };

  const onCheckListKeywordClear = (e, index) => {
    const newData = checkListData;
    newData[index].check_list_id = '';
    newData[index].name = '';
    setCheckListData(newData);
    setCheckListAdd(Math.random());
    setOpen(false);
  };

  const onEquipmentKeywordChange = (event) => {
    setEquipmentKeyword(event.target.value);
  };

  const onEquipmentKeywordClear = (e, index) => {
    const newData = checkListData;
    newData[index].equipment_id = '';
    setCheckListData(newData);
    setCheckListAdd(Math.random());
    setOpen(false);
  };

  const onSpaceKeywordChange = (event) => {
    setSpaceKeyword(event.target.value);
  };

  const onSpaceKeywordClear = (e, index) => {
    const newData = checkListData;
    newData[index].location_id = '';
    newData[index].name = '';
    setCheckListData(newData);
    setCheckListAdd(Math.random());
    setOpen(false);
  };

  const showCheckListModal = (e, index) => {
    setModelValue(appModels.PPMCHECKLIST);
    setFieldName('check_list_id');
    setModalName('Checklists');
    setColumns(['name']);
    setCompanyValue(userInfo && userInfo.data ? userInfo.data.company.id : '');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setArrayList(checklistSelected);
    setArrayIndex(index);
    setExtraModal(true);
    setOperationData('checklist');
  };

  const showEquipmentModal = (e, index) => {
    setModelValue(appModels.EQUIPMENT);
    setFieldName('equipment_id');
    setModalName('Equipments');
    setColumns(['name', 'location_id', 'category_id']);
    setCompanyValue(userInfo && userInfo.data ? userInfo.data.company.id : '');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setArrayList(checklistSelected);
    setArrayIndex(index);
    setExtraModal(true);
    setOperationData('checklist');
  };

  const showSpaceModal = (e, index) => {
    setModelValue(appModels.SPACE);
    setFieldName('location_id');
    setModalName('Spaces');
    setColumns(['path_name', 'space_name', 'asset_category_id']);
    setCompanyValue(userInfo && userInfo.data ? userInfo.data.company.id : '');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setArrayList(checklistSelected);
    setArrayIndex(index);
    setExtraModal(true);
    setOperationData('checklist');
  };

  return (
    <>
      <Row>
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
          Maintenance Checklist
        </Typography>
        <Col xs={12} sm={12} md={12} lg={12}>
          {editId && taskCheckLists && taskCheckLists.loading && (
            <div className="p-3" data-testid="loading-case">
              <Loader />
            </div>
          )}
          <Table responsive id="spare-part">
            <thead className="bg-lightblue">
              <tr>
                <th className="p-2 min-width-160 border-0">
                  Check lists
                </th>
                <th className="p-2 min-width-160 border-0">
                  Type
                </th>
                <th className="p-2 min-width-200 border-0">
                  Asset
                </th>
                <th className="p-2 min-width-100 border-0">
                  <span className="invisible">Del</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="5" className="text-left">
                  <div aria-hidden="true" className="font-weight-800 text-lightblue cursor-pointer mt-1 mb-1" onClick={loadEmptyTd}>
                    <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
                    <span className="mr-5">
                      Add a Line
                    </span>
                  </div>
                </td>
              </tr>
              {(checklistSelected && checklistSelected.length > 0 && checklistSelected.map((pl, index) => (
                <>
                  {!pl.isRemove && (
                    <tr key={index}>
                      <td>
                        <FormControl>
                          <Autocomplete
                            name="products"
                            className="bg-white min-width-200"
                            open={openId === index}
                            size="small"
                            onOpen={() => {
                              setOpen(index);
                              setCheckListKeyword('');
                            }}
                            onClose={() => {
                              setOpen('');
                              setCheckListKeyword('');
                            }}
                            classes={{
                              option: classes.option,
                            }}
                            value={pl.check_list_id && pl.check_list_id.length ? pl.check_list_id[1] : ''}
                            getOptionSelected={(option, value) => option.label === value.label}
                            getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                            options={checkListOptions}
                            onChange={(e, data) => { onChangeCheckList(data, index); }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                onChange={onCheckListKeywordChange}
                                variant="outlined"
                                className={pl.check_list_id && pl.check_list_id.length ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                                placeholder="Search & Select"
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <>
                                      {(checkList && checkList.loading) && (openId === index) ? <CircularProgress color="inherit" size={20} /> : null}
                                      <InputAdornment position="end">
                                        {(pl.check_list_id && pl.check_list_id[0]) && (
                                        <IconButton
                                          aria-label="toggle password visibility"
                                          onClick={(e, data) => { onCheckListKeywordClear(data, index); }}
                                        >
                                          <BackspaceIcon fontSize="small" />
                                        </IconButton>
                                        )}
                                        <IconButton
                                          aria-label="toggle search visibility"
                                          onClick={(e, data) => { showCheckListModal(data, index); }}
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
                          {((checkList && checkList.err) && (openId === index)) && (<FormHelperText><span className="text-danger">{generateErrorMessage(checkList)}</span></FormHelperText>)}
                        </FormControl>
                      </td>
                      <td>
                        <FormControl>
                          <Autocomplete
                            disableClearable={pl.category_type === ''}
                            name="type"
                            className="bg-white min-width-200"
                            size="small"
                            open={openType === index}
                            onOpen={() => {
                              setOpenType(index);
                            }}
                            onClose={() => {
                              setOpenType('');
                            }}
                            onChange={(e, data) => { onChangeType(data, index); }}
                            value={pl.category_type && pl.category_type.length > 0 ? pl.category_type[1] : ''}
                            getOptionSelected={(option, value) => option.label === value.label}
                            getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                            options={typeOptions}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
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
                        </FormControl>
                      </td>
                      {pl.category_type === '' ? <td /> : ''}
                      {pl.category_type && pl.category_type.length > 0 && pl.category_type[0] === 'e'
                        ? (
                          <td>
                            <FormControl>
                              <Autocomplete
                                name="products"
                                className="bg-white min-width-200"
                                open={equipmentOpen === index}
                                size="small"
                                onOpen={() => {
                                  setEquipmentOpen(index);
                                  setEquipmentKeyword('');
                                }}
                                onClose={() => {
                                  setEquipmentOpen('');
                                  setEquipmentKeyword('');
                                }}
                                classes={{
                                  option: classes.option,
                                }}
                                value={pl.equipment_id && pl.equipment_id.length ? pl.equipment_id[1] : ''}
                                getOptionSelected={(option, value) => option.label === value.label}
                                getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                                options={equipmentOptions}
                                onChange={(e, data) => { onChangeEquipment(data, index); }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    onChange={onEquipmentKeywordChange}
                                    variant="outlined"
                                    className={pl.equipment_id && pl.equipment_id.length ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                                    placeholder="Search & Select"
                                    InputProps={{
                                      ...params.InputProps,
                                      endAdornment: (
                                        <>
                                          {(equipmentInfo && equipmentInfo.loading) && (equipmentOpen === index) ? <CircularProgress color="inherit" size={20} /> : null}
                                          <InputAdornment position="end">
                                            {(pl.equipment_id && pl.equipment_id[0]) && (
                                            <IconButton
                                              aria-label="toggle password visibility"
                                              onClick={(e, data) => { onEquipmentKeywordClear(data, index); }}
                                            >
                                              <BackspaceIcon fontSize="small" />
                                            </IconButton>
                                            )}
                                            <IconButton
                                              aria-label="toggle search visibility"
                                              onClick={(e, data) => { showEquipmentModal(data, index); }}
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
                              {((equipmentInfo && equipmentInfo.err) && (equipmentOpen === index))
                              && (<FormHelperText><span className="text-danger">{generateErrorMessage(equipmentInfo)}</span></FormHelperText>)}
                            </FormControl>
                          </td>
                        )
                        : '' }
                        {pl.category_type && pl.category_type.length > 0 && pl.category_type[0] === 'ah'
                          ? (
                            <td>
                              <FormControl>
                                <Autocomplete
                                  name="products"
                                  className="bg-white min-width-200"
                                  open={spaceOpen === index}
                                  size="small"
                                  onOpen={() => {
                                    setSpaceOpen(index);
                                    setSpaceKeyword('');
                                  }}
                                  onClose={() => {
                                    setSpaceOpen('');
                                    setSpaceKeyword('');
                                  }}
                                  classes={{
                                    option: classes.option,
                                  }}
                                  value={pl.location_id && pl.location_id.length ? pl.location_id[1] : ''}
                                  getOptionSelected={(option, value) => option.label === value.label}
                                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                                  options={spaceOptions}
                                  onChange={(e, data) => { onChangeSpace(data, index); }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      onChange={onSpaceKeywordChange}
                                      variant="outlined"
                                      className={pl.location_id && pl.location_id.length ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                                      placeholder="Search & Select"
                                      InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                          <>
                                            {(spaceInfoList && spaceInfoList.loading) && (spaceOpen === index) ? <CircularProgress color="inherit" size={20} /> : null}
                                            <InputAdornment position="end">
                                              {(pl.location_id && pl.location_id[0]) && (
                                              <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={(e, data) => { onSpaceKeywordClear(data, index); }}
                                              >
                                                <BackspaceIcon fontSize="small" />
                                              </IconButton>
                                              )}
                                              <IconButton
                                                aria-label="toggle search visibility"
                                                onClick={(e, data) => { showSpaceModal(data, index); }}
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
                                {((spaceInfoList && spaceInfoList.err) && (spaceOpen === index))
                              && (<FormHelperText><span className="text-danger">{generateErrorMessage(spaceInfoList)}</span></FormHelperText>)}
                              </FormControl>
                            </td>
                          )
                          : '' }
                      <td>
                        <span className="font-weight-400 d-inline-block" />
                        <FontAwesomeIcon className="mr-1 ml-1 cursor-pointer" size="sm" icon={faTrashAlt} onClick={(e) => { removeData(e, index); }} />
                      </td>
                    </tr>
                  )}
                </>
              )))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Modal size="xl" className="border-radius-50px modal-dialog-centered" isOpen={extraModal}>
        <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setExtraModal(false); }} />
        <ModalBody className="mt-0 pt-0">
          <SearchModal
            modelName={modelValue}
            afterReset={() => { setExtraModal(false); }}
            fieldName={fieldName}
            fields={columns}
            company={companyValue}
            otherFieldName={otherFieldName}
            otherFieldValue={otherFieldValue}
            modalName={modalName}
            setFieldValue={setFieldValue}
            arrayValues={arrayList}
            arrayIndex={arrayIndex}
            operationData={operationData}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

CheckListForm.propTypes = {
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
};

export default CheckListForm;
