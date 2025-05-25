/* eslint-disable max-len */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-trailing-spaces */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Row, Col, Table, Modal, ModalBody, ModalFooter,
} from 'reactstrap';
import Button from '@mui/material/Button';
// import { Input } from 'react-input-component';
import { Autocomplete } from '@material-ui/lab';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import {
  TextField, CircularProgress, FormHelperText, FormControl,
  Checkbox,
} from '@material-ui/core';
import uniqBy from 'lodash/unionBy';
import { makeStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import Loader from '@shared/loading';
import addIcon from '@images/icons/plusCircleBlue.svg';
import customData from '../data/customData.json';
// import theme from '../../../util/materialTheme';
import { getChecklistData } from '../../../../preventiveMaintenance/ppmService';
import { getSpaceAllSearchList, getEquipmentList } from '../../../../helpdesk/ticketService';
import { getOrderLineInfo, getRecipientList, setRecipientsLocationId } from '../../../siteService';
import {
  getArrayFromValuesById, getColumnArrayById,
  isAssociativeArray,
  getAllowedCompanies, generateErrorMessage,
} from '../../../../util/appUtils';
import SearchModal from './searchModal';
import SearchModalMultiple from './searchModalMultiple';

const appModels = require('../../../../util/appModels').default;

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

const OrderLineForm = (props) => {
  const {
    editId,
    setFieldValue,
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [checkListData, setCheckListData] = useState([]);
  const [totalListData, setTotalListData] = useState([]);
  const [checkListAdd, setCheckListAdd] = useState('');
  const [recipientListOptions, setRecipientListOptions] = useState([]);
  const [openId, setOpen] = useState('');
  const [openType, setOpenType] = useState('');
  const [recipientsKeyword, setRecipientsKeyword] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [columns, setColumns] = useState(['name']);
  const [fieldName, setFieldName] = useState('');
  const [modalName, setModalName] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [companyValue, setCompanyValue] = useState(false);
  const [extraModal, setExtraModal] = useState(false);
  const [extraMultipleModal, setExtraMultipleModal] = useState(false);
  const [arrayList, setArrayList] = useState([]);
  const [arrayIndex, setArrayIndex] = useState(false);
  const [operationData, setOperationData] = useState(false);
  const [checkedRows, setCheckRows] = useState([]);

  const [spaceKeyword, setSpaceKeyword] = useState('');
  const [spaceOptions, setSpaceOptions] = useState('');
  const [equipmentKeyword, setEquipmentKeyword] = useState('');
  const [equipmentOptions, setEquipmentOptions] = useState('');

  const [checkedValue, setCheckedValue] = useState(false);

  const [userOptions, setUserOptions] = useState([]);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const { spaceInfoList, equipmentInfo } = useSelector((state) => state.ticket);
  const {
    checklistSelected, ppmOperationData,
  } = useSelector((state) => state.ppm);
  const {
    recipientsInfo, recipientsLocationId, orderLines, gatePassSettingsInfo,
  } = useSelector((state) => state.site);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getRecipientList(companies, appModels.ALARMRECIPIENTS, recipientsKeyword));
    }
  }, [userInfo, recipientsKeyword]);

  useEffect(() => {
    dispatch(setRecipientsLocationId([]));
  }, []);

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
      dispatch(getOrderLineInfo(companies, appModels.GATEPASSCONFIGURATIONLINE, ppmOperationData.data[0].order_lines));
    }
  }, [editId, ppmOperationData]);

  useEffect(() => {
    if (editId && (orderLines && orderLines.data && orderLines.data.length)) {
      const newArrData = orderLines.data.map((cl) => ({
        ...cl,
        id: cl.id,
        state: cl.state,
        is_requestee: cl.is_requestee,
        recipients_ids: cl.recipients_ids,
      }));
      setCheckListData(newArrData);
      dispatch(getChecklistData(newArrData));
    }
  }, [editId, orderLines]);

  // useEffect(() => {
  //   if (recipientsInfo && recipientsInfo.data && recipientsInfo.data.length > 0) {
  //     const ids = getColumnArrayByIdWithArray(checklistSelected && checklistSelected.length ? checklistSelected : [], 'recipients_ids');
  //     const data = getArrayFromValuesById(recipientsInfo.data, ids, 'id');
  //     if (data && data.length > 0) {
  //       setRecipientsLocationId(data.map((cl) => ({
  //         ...cl, value: cl.id, label: cl.name,
  //       })));
  //     }
  //   }
  // }, [recipientsInfo]);

  useEffect(() => {
    if (recipientsInfo && recipientsInfo.data && recipientsInfo.data.length) {
      setUserOptions(getArrayFromValuesById(recipientsInfo.data, isAssociativeArray(recipientsLocationId || []), 'id'));
    } else if (recipientsInfo && recipientsInfo.loading) {
      setUserOptions([{ name: 'Loading...' }]);
    } else {
      setUserOptions([]);
    }
  }, [recipientsInfo]);

  useEffect(() => {
    if (checkListAdd) {
      setCheckListData(checkListData);
      dispatch(getChecklistData(checkListData));
      const ids = getColumnArrayById(totalListData && totalListData.length ? totalListData : [], 'recipients_ids');
      const data = getArrayFromValuesById(recipientsInfo && recipientsInfo.data ? recipientsInfo.data : [], ids, 'id');
      setRecipientsLocationId(data.map((cl) => ({
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
      setFieldValue('order_lines', checklistSelected);
      setTotalListData(checklistSelected);
    } else {
      setFieldValue('order_lines', []);
      setCheckListData([]);
      setTotalListData([]);
    }
  }, [checklistSelected]);

  const loadEmptyTd = () => {
    let newData = {
      state: '', is_requestee: '', recipients_ids: '',
    };
    if (editId) {
      newData = {
        state: '', is_requestee: '', recipients_ids: '', id: false,
      };
    }
    // const temp = [...checklistSelected, newData];
    setCheckListData((data) => [...data, newData]);
    // checklistSelected = [...checklistSelected, newData];
    setCheckListAdd(Math.random());
  };

  const removeData = (e, index) => {
    if (editId) {
      const newData = checklistSelected;
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
      const checkData = checklistSelected;
      checkData.splice(index, 1);
      setCheckListData(checkData);
      setCheckListAdd(Math.random());
    }
  };

  const onChangeRecipients = (e, index) => {
    const newData = checkListData;
    newData[index].recipients_ids = e;
    // newData[index].name = e.name;
    setCheckListData(newData);
    setCheckRows(e);
    // dispatch(setRecipientsLocationId(newData));
    setCheckListAdd(Math.random());
  };

  useEffect(() => {
    if (arrayIndex !== false) {
      setCheckRows([]);
      dispatch(setRecipientsLocationId([...checkListData[arrayIndex].recipients_ids]));
    }
    setCheckRows(recipientsLocationId);
  }, [arrayIndex]);

  useEffect(() => {
    if (recipientsLocationId) {
      setCheckRows(recipientsLocationId);
    }
  }, [recipientsLocationId]);

  const setRecipientsData = (data) => {
    const newData = checkListData;
    const newArray = [...newData[arrayIndex].recipients_ids, ...data];
    const unique = uniqBy(newArray, 'id');
    newData[arrayIndex].recipients_ids = unique;
    dispatch(setRecipientsLocationId(unique));
    setCheckListData(newData);
    setCheckRows(recipientsLocationId);
    setCheckListAdd(Math.random());
  };

  const onChangeType = (e, index) => {
    if (e) {
      const newData = checklistSelected;
      newData[index].state = e.value;
      setCheckListData(newData);
      setCheckListAdd(Math.random());
    } else {
      const newData = checklistSelected;
      newData[index].state = '';
      setCheckListData(newData);
      setCheckListAdd(Math.random());
    }
  };

  const onRecipientKeywordChange = (event) => {
    setRecipientsKeyword(event.target.value);
  };

  const onCheckListKeywordClear = (e, index) => {
    const newData = checkListData;
    newData[index].recipients_ids = '';
    newData[index].name = '';
    setCheckListData(newData);
    setCheckListAdd(Math.random());
    setOpen(false);
  };

  const showCheckListModal = (e, index) => {
    setModelValue(appModels.ALARMRECIPIENTS);
    setFieldName('recipients_ids');
    setModalName('Recipient List');
    setColumns(['name']);
    setCompanyValue(userInfo && userInfo.data ? userInfo.data.company.id : '');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setArrayList(checklistSelected);
    setArrayIndex(index);
    setExtraMultipleModal(true);
    setOperationData('checklist');
  };

  const handleCheckboxChange = (event, index) => {
    const newData = checkListData;
    newData[index].is_requestee = event;
    setCheckListData(newData);
    setCheckRows(event);
    setCheckListAdd(Math.random());
  };

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const getTypes = (types) => {
    const array = customData.state;
    const newArray = [];
    for (let i = 0; i < array.length; i += 1) {
      if (!types.includes(array[i].value)) {
        newArray.push(array[i]);
      }
    }
    return newArray;
  };

  const pData = checklistSelected && checklistSelected.length > 0 ? checklistSelected : [];
  const notRemovedData = pData.filter((item) => item && !item.isRemove);

  // const typeOptions = customData.state;
  const types = pData && pData.length > 0 ? getColumnArrayById(notRemovedData, 'state') : '';
  const typeOptions = types !== '' ? getTypes(types) : customData.state;
  console.log(checklistSelected);
  console.log(checkListData);
  console.log(customData.state);
  return (
    <>
      <h5 className="mb-3 mt-3">Maintenance Check List</h5>
      <Row>
        <Col xs={12} sm={12} md={12} lg={12}>
          {editId && orderLines && orderLines.loading && (
            <div className="p-3" data-testid="loading-case">
              <Loader />
            </div>
          )}
          <Table responsive id="spare-part">
            <thead className="bg-lightblue">
              <tr>
                <th className="p-2 min-width-160 border-0">
                  Status
                </th>
                <th className="p-2 min-width-160 border-0">
                  Requester
                </th>
                <th className="p-2 min-width-200 border-0">
                  Recipients
                </th>
                <th className="p-2 min-width-100 border-0">
                  <span className="invisible">Del</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {(customData.state && customData.state.length) > (checkListData && checkListData.length)
                ? (
              <tr>
                <td colSpan="5" className="text-left">
                  <Button className="border-0 bg-lightblue btn-shadow font-weight-800 text-lightblue" onClick={loadEmptyTd}>
                    <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
                    <span className="text-lightblue mr-5">Add a Line</span>
                  </Button>
                </td>
              </tr>
                ) : ''}
              {(checklistSelected && checklistSelected.length > 0 && checklistSelected.map((pl, index) => (
                <>
                  {!pl.isRemove && (
                    <tr key={index}>
                      <td>
                        <FormControl>
                          <Autocomplete
                            disableClearable={pl.state === ''}
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
                            value={pl.state && pl.state.length > 0 ? pl.state : ''}
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
                      <td className="p-2">
                        <Checkbox
                          size="small"
                          name="is_requestee"
                          id="is_requestee"
                          checked={pl.is_requestee}
                          onChange={(e, data) => { handleCheckboxChange(data, index); }}
                        />
                      </td>
                      <td>
                        <FormControl>
                          <Autocomplete
                            multiple
                            name="recipients"
                            className="bg-white min-width-200"
                            open={openId === index}
                            size="small"
                            onOpen={() => {
                              setOpen(index);
                              setRecipientsKeyword('');
                            }}
                            onClose={() => {
                              setOpen('');
                              setRecipientsKeyword('');
                            }}
                            classes={{
                              option: classes.option,
                            }}
                            value={pl.recipients_ids && pl.recipients_ids.length > 0 ? pl.recipients_ids : []}
                            defaultValue={recipientsLocationId}
                            getOptionSelected={(option, value) => option.name === value.name}
                            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                            options={userOptions}
                            onChange={(e, data) => { onChangeRecipients(data, index); }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                onChange={(e) => { onRecipientKeywordChange(e.target.value); }}
                                variant="outlined"
                                // className={pl.recipientsinfo && pl.recipientsinfo.length ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                                className={((getOldData(recipientsLocationId)) || (recipientsKeyword && recipientsKeyword.length > 0))
                                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                                placeholder="Search & Select"
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <>
                                      {(recipientsInfo && recipientsInfo.loading) && (openId === index) ? <CircularProgress color="inherit" size={20} /> : null}
                                      <InputAdornment position="end">
                                        {(pl.recipientsinfo && pl.recipientsinfo[0]) && (
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
                          {((recipientsInfo && recipientsInfo.err) && (openId === index)) && (<FormHelperText><span className="text-danger">{generateErrorMessage(recipientsInfo)}</span></FormHelperText>)}
                        </FormControl>
                      </td>
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
      <Modal size="xl" className="border-radius-50px modal-dialog-centered" isOpen={extraMultipleModal}>
        <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setExtraMultipleModal(false); }} />
        <ModalBody className="mt-0 pt-0">
          <SearchModalMultiple
            modelName={modelValue}
            afterReset={() => { setExtraMultipleModal(false); }}
            fieldName={fieldName}
            fields={columns}
            company={companyValue}
            otherFieldName={otherFieldName}
            otherFieldValue={otherFieldValue}
            setCheckedRows={setCheckRows}
            oldCheckedRows={checkedRows && checkedRows.length ? checkedRows : []}
            oldRecipientsData={recipientsLocationId && recipientsLocationId.length ? recipientsLocationId : []}
            arrayValues={arrayList}
            arrayIndex={arrayIndex}
          />
        </ModalBody>
        <ModalFooter>
          {(checkedRows && checkedRows.length && checkedRows.length > 0)
            ? (
              <Button
                type="button"
                size="sm"
                onClick={() => { setExtraMultipleModal(false); if (fieldName === 'recipients_ids') { setRecipientsData(checkedRows); } }}
                // onClick={() => setFieldId()}
                variant="contained"
              >
                {' '}
                Add
              </Button>
            ) : ''}
        </ModalFooter>
      </Modal>
    </>
  );
};

OrderLineForm.propTypes = {
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  checklistSelected: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
};

export default OrderLineForm;
