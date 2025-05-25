/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable radix */
/* eslint-disable camelcase */
/* eslint-disable comma-dangle */
/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Row, Col, Table,
} from 'reactstrap';
import Checkbox from '@mui/material/Checkbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import SearchIcon from '@material-ui/icons/Search';
import { Autocomplete } from '@material-ui/lab';
import {
  TextField, CircularProgress, FormHelperText, FormControl,
} from '@material-ui/core';
import { useFormikContext } from 'formik';
import { Box, } from '@mui/system';
import {
  Typography, Dialog, DialogContent, DialogContentText,
} from '@mui/material';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import { IoCloseOutline } from 'react-icons/io5';

import addIcon from '@images/icons/plusCircleBlue.svg';
import SearchModalMultipleStatic from '@shared/searchModals/multiSearchModelStatic';

import DialogHeader from '../../commonComponents/dialogHeader';
import DebounceValue from '../../commonComponents/debounceValue';
import {
  getGatePassPartsData,
} from '../../gatePass/gatePassService';
import {
  getArrayFromValuesById,
  getColumnArrayById,
  getArrayFromValuesByObject,
  getColumnArrayByIdWithArray,
  generateErrorMessage,
  extractTextObject, decimalKeyPressDown,
  getAllowedCompanies,
  numToFloat,
  getDefaultNoValue,
} from '../../util/appUtils';
import { AddThemeColor } from '../../themes/theme';
import {
  getHxAuditNames,
  getHxAuditRoles,
} from '../auditService';

const appModels = require('../../util/appModels').default;

const AuditeeForm = (props) => {
  const {
    setFieldValue,
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    auditees_ids
  } = formValues;
  const dispatch = useDispatch();
  const [partsData, setPartsData] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [partsAdd, setPartsAdd] = useState(false);
  const [openId, setOpen] = useState('');
  const [productKeyword, setProductKeyword] = useState('');
  const debouncedProductKeyword = DebounceValue(productKeyword, 300);

  const [roleOpen, setRoleOpen] = useState('');
  const [roleKeyword, setRoleKeyword] = useState('');
  const [roleOptions, setRoleOptions] = useState([]);
  const debouncedRoleKeyword = DebounceValue(roleKeyword, 300);

  const [extraModal1, setExtraModal1] = useState(false);
  const [headers, setHeaders] = useState([]);
  const [oldValues, setOldValues] = useState([]);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [columns, setColumns] = useState(['id', 'name', 'display_name']);

  const { userInfo } = useSelector((state) => state.user);
  const { hxAuditCreate, hxAuditors, hxRoleIds } = useSelector((state) => state.hxAudits);
  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    setPartsData([]);
    dispatch(getGatePassPartsData([]));
  }, []);

  const showAuditorModal = () => {
    setFieldName('team_members_id');
    setExtraModal1(true);
    setColumns(['id', 'name']);
    setHeaders(['Name']);
    setModalName('Auditees');
  };

  useEffect(() => {
    if (partsAdd) {
      setPartsData(partsData);
      dispatch(getGatePassPartsData(partsData));
    }
  }, [partsAdd]);

  useEffect(() => {
    if (hxAuditors && hxAuditors.data && hxAuditors.data.length > 0) {
      const { data } = hxAuditors;
      setProductOptions(data.map((cl) => ({
        ...cl, value: cl.id, label: cl.name,
      })));
    } else if (hxAuditors && hxAuditors.loading) {
      setProductOptions([{ value: '', label: 'Loading...' }]);
    } else {
      setProductOptions([]);
    }
  }, [hxAuditors]);

  useEffect(() => {
    if (hxRoleIds && hxRoleIds.data && hxRoleIds.data.length > 0) {
      const { data } = hxRoleIds;
      setRoleOptions(data.map((cl) => ({
        ...cl, value: cl.id, label: cl.name,
      })));
    } else if (hxRoleIds && hxRoleIds.loading) {
      setRoleOptions([{ value: '', label: 'Loading...' }]);
    } else {
      setRoleOptions([]);
    }
  }, [hxRoleIds]);

  useEffect(() => {
    if (partsAdd) {
      setPartsData(partsData);
      const ids = getColumnArrayById(partsData && partsData.length ? partsData : [], 'team_members_id_ref');
      const data = getArrayFromValuesById(hxAuditors && hxAuditors.data ? hxAuditors.data : [], ids, 'id');
      setProductOptions(data.map((cl) => ({
        ...cl, value: cl.id, label: cl.name,
      })));
    }
  }, [partsAdd]);

  useEffect(() => {
    if (partsData) {
      setFieldValue('auditees_ids', partsData);
    }
  }, [partsData]);

  useEffect(() => {
    if (openId) {
      setProductKeyword('');
    }
  }, [openId]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      setProductOptions([{ value: '', label: 'Loading...' }]);
      setTimeout(() => {
        const data = partsData && partsData.length ? partsData.filter((item) => item.team_members_id_ref) : [];
        dispatch(getHxAuditNames(companies, appModels.TEAMMEMEBERS, debouncedProductKeyword, getColumnArrayById(data, 'team_members_id_ref'), 'member'));
      }, 500);
    }
  }, [userInfo, debouncedProductKeyword, openId]);

  useEffect(() => {
    if (extraModal1) {
      const data = partsData && partsData.length ? partsData.filter((item) => item.team_members_id_ref) : [];
      dispatch(getHxAuditNames(companies, appModels.TEAMMEMEBERS, debouncedProductKeyword, getColumnArrayById(data, 'team_members_id_ref'), 'member'));
    }
  }, [extraModal1]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      setRoleOptions([{ value: '', label: 'Loading...' }]);
      setTimeout(() => {
       // const data = partsData && partsData.length ? partsData.filter((item) => item.role_id && item.role_id.length) : [];
        dispatch(getHxAuditRoles(companies, appModels.HXAUDITROLES, debouncedRoleKeyword, [], 'auditee'));
      }, 500);
    }
  }, [userInfo, debouncedRoleKeyword, roleOpen, hxAuditCreate]);

  const loadEmptyTd = () => {
    const newData = partsData && partsData.length ? partsData : [];
    newData.push({
      id: false, team_members_id: '', is_spoc: false, role_id: '',
    });
    setPartsData(newData);
    setRoleKeyword('');
    setProductKeyword('');
    setPartsAdd(Math.random());
  };

  const onProductKeywordChange = (event, index) => {
    setProductKeyword(event.target.value);
    // setOpen(index);
  };

  const onRoleKeywordChange = (event, index) => {
    setRoleKeyword(event.target.value);
    // setRoleOpen(index);
  };

  const removeData = (e, index) => {
    const newData = partsData;
    const id = newData[index] ? newData[index] : newData[index]?.id;
    if (id) {
      newData[index].isRemove = true;
      setPartsAdd(Math.random());
    } else {
      newData = newData.splice(index, 1);
      setPartsAdd(Math.random());
    }
    const allHaveRemoveTrue = newData.every((obj) => obj.isRemove === true);
    setPartsData(allHaveRemoveTrue ? [] : newData);
  };

  const handleSpocChange = (event, index, field) => {
    const { checked } = event.target;
    const newData = partsData;
    if (checked) {
      newData[index][field] = true;
    } else {
      newData[index][field] = false;
    }
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onProductChange = (e, index) => {
    const newData = partsData;
    newData[index].team_members_id = [e?.id, e?.name];
    newData[index].team_members_id_ref = e.id;
    newData[index].is_spoc = false;
    newData[index].role_id = '';
    setPartsData(newData);
    setProductKeyword('');
    setPartsAdd(Math.random());
  };

  const onAuditeeModalChange = (data) => {
    const newData = data.filter((item) => item.name);
    const fData = newData.map((cl) => ({
      team_members_id_ref: cl.id,
      team_members_id: [cl?.id, cl?.name],
      is_spoc: false,
      role_id: '',
    }));
    const newData2 = partsData.filter((item) => item.team_members_id_ref && !item.isRemove);
    const allData = [...fData, ...newData2];
    const newData1 = [...new Map(allData.map((item) => [item.team_members_id_ref, item])).values()];
    setPartsData(newData1);
    setPartsAdd(Math.random());

    setExtraModal1(false);
  };

  const onRoleChange = (e, index) => {
    const newData = partsData;
    newData[index].role_id = [e?.id, e?.name];
    newData[index].is_spoc = e.is_spoc;
    setPartsData(newData);
    setRoleKeyword('');
    setPartsAdd(Math.random());
  };

  const onProductKeywordClear = (e, index) => {
    const newData = partsData;
    newData[index].team_members_id = '';
    newData[index].team_members_id_ref = '';
    newData[index].is_spoc = false;
    newData[index].role_id = '';
    setPartsData(newData);
    setProductKeyword('');
    setPartsAdd(Math.random());
    setOpen(false);
  };

  const onRoleKeywordClear = (e, index) => {
    const newData = partsData;
    newData[index].role_id = '';
    newData[index].is_spoc = false;
    setPartsData(newData);
    setRoleKeyword('');
    setPartsAdd(Math.random());
    setRoleOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          width: '100%',
        }}
      >
        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
          })}
        >
          Auditees Info
        </Typography>
        <Row className="instructions-scroll thin-scrollbar">
          <Col xs={12} sm={12} md={12} lg={12} className="">
            <Table id="spare-part">
              <thead className="bg-lightblue">
                <tr>
                  <th className="p-2 min-width-250 border-0 table-column z-Index-1060">
                    Name
                    {' '}
                    <span className="text-danger ml-2">*</span>
                  </th>
                  <th className="p-2 min-width-100 border-0 table-column z-Index-1060">
                    Function
                    {' '}
                    <span className="text-danger ml-2">*</span>
                  </th>
                  <th className="p-2 min-width-100 border-0 table-column z-Index-1060">
                    SPOC
                  </th>
                  <th className="p-2 min-width-100 border-0 table-column z-Index-1060">
                    <span className="">Delete</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="3" className="text-left">
                    <div aria-hidden="true" className="font-weight-800 text-lightblue cursor-pointer mt-1 mb-1" onClick={loadEmptyTd}>
                      <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
                      <span className="mr-5 font-family-tab">Add an Auditee</span>
                    </div>
                  </td>
                </tr>
                {(auditees_ids && auditees_ids.length > 0 && auditees_ids.map((pl, index) => (
                  <>
                    {!pl.isRemove && (
                      <tr key={index}>
                        <td className="p-2">
                          <FormControl>
                            <Autocomplete
                              name="products_new"
                              className="min-width-250"
                              open={openId === index}
                              size="small"
                              onOpen={() => {
                                setOpen(index);
                              }}
                              onClose={() => {
                                setOpen('');
                              }}
                              value={pl.team_members_id && pl.team_members_id.length ? pl.team_members_id[1] : ''}
                              getOptionSelected={(option, value) => (value?.length > 0 ? option.label === value.label : '')}
                              getOptionDisabled={(option, value) => option.label === 'Loading...'}
                              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                              options={productOptions}
                              onChange={(e, data) => { onProductChange(data, index); }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  onChange={(e) => onProductKeywordChange(e, index)}
                                  variant="standard"
                                  value={productKeyword}
                                  className={pl.name ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                                  placeholder="Search & Select"
                                  InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                      <>
                                        {(hxAuditors && hxAuditors.loading) && (openId === index) ? <CircularProgress color="inherit" size={20} /> : null}
                                        <InputAdornment position="end">
                                          {((pl.team_members_id && pl.team_members_id.length > 0 && pl.team_members_id[0]) || (openId === index && productKeyword)) && (
                                          <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={(e, data) => { onProductKeywordClear(data, index); }}
                                          >
                                            <IoCloseOutline size={22} fontSize="small" />
                                          </IconButton>
                                          )}
                                          <IconButton
                                            aria-label="toggle search visibility"
                                            onClick={() => { showAuditorModal(index); }}
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
                            {((hxAuditors && hxAuditors.err)
                              && (openId === index)) && (<FormHelperText><span className="text-danger">{generateErrorMessage(hxAuditors)}</span></FormHelperText>)}
                          </FormControl>
                        </td>
                        <td className="p-2">
                          <FormControl>
                            <Autocomplete
                              name="products_new"
                              className="min-width-200"
                              open={roleOpen === index}
                              size="small"
                              onOpen={() => {
                                setRoleOpen(index);
                              }}
                              onClose={() => {
                                setRoleOpen('');
                              }}
                              value={pl.role_id && pl.role_id.length ? pl.role_id[1] : ''}
                              getOptionSelected={(option, value) => (value?.length > 0 ? option.label === value.label : '')}
                              getOptionDisabled={(option, value) => option.label === 'Loading...'}
                              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                              options={roleOptions}
                              onChange={(e, data) => { onRoleChange(data, index); }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  onChange={(e) => onRoleKeywordChange(e, index)}
                                  variant="standard"
                                  value={roleKeyword}
                                  className={pl.name ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                                  placeholder="Search & Select"
                                  InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                      <>
                                        {(hxRoleIds && hxRoleIds.loading) && (roleOpen === index) ? <CircularProgress color="inherit" size={20} /> : null}
                                        <InputAdornment position="end">
                                          {((pl.role_id && pl.role_id.length > 0 && pl.role_id[0]) || (openId === index && roleKeyword)) && (
                                          <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={(e, data) => { onRoleKeywordClear(data, index); }}
                                          >
                                            <IoCloseOutline size={22} fontSize="small" />
                                          </IconButton>
                                          )}

                                        </InputAdornment>
                                      </>
                                    ),
                                  }}
                                />
                              )}
                            />
                            {((hxRoleIds && hxRoleIds.err)
                              && (roleOpen === index)) && (<FormHelperText><span className="text-danger">{generateErrorMessage(hxRoleIds)}</span></FormHelperText>)}
                          </FormControl>
                        </td>
                        <td className="pl-2 pr-2" style={{ verticalAlign: 'middle' }}>
                          <Checkbox
                            checked={pl.is_spoc}
                            onChange={(e) => handleSpocChange(e, index, 'is_spoc')}
                            size="small"
                            className="p-0"
                            inputProps={{ 'aria-label': 'controlled' }}
                          />
                        </td>
                        <td className="p-2">
                          <span className="font-weight-400 d-inline-block" />
                          <FontAwesomeIcon className="mr-1 mt-3 ml-1 cursor-pointer" size="sm" icon={faTrashAlt} onClick={(e) => { removeData(e, index); }} />
                        </td>
                      </tr>
                    )}
                  </>
                )))}
              </tbody>
            </Table>
          </Col>
          <Dialog size="xl" fullWidth open={extraModal1}>
            <DialogHeader rightButton title={modalName} imagePath={false} onClose={() => { setExtraModal1(false); }} />
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <SearchModalMultipleStatic
                  afterReset={() => { setExtraModal1(false); }}
                  fieldName={fieldName}
                  fields={columns}
                  headers={headers}
                  data={productOptions}
                  modalName={modalName}
                  dataChange={onAuditeeModalChange}
                  oldValues={oldValues}
                />
              </DialogContentText>
            </DialogContent>
          </Dialog>
        </Row>
      </Box>

    </>
  );
};

AuditeeForm.propTypes = {
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default AuditeeForm;
