/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import addIcon from '@images/icons/plusCircleBlue.svg';
import { CircularProgress, TextField } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col, Row, Table,
} from 'reactstrap';
import { IoCloseOutline } from 'react-icons/io5';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent, DialogContentText,
  Typography,
  Grid,
  Autocomplete,
} from '@mui/material';
import { AddThemeColor } from '../../../../themes/theme';
import DialogHeader from '../../../../commonComponents/dialogHeader';
import MuiAutoComplete from '../../../../commonComponents/formFields/muiAutocomplete';
import MuiCheckboxField from '../../../../commonComponents/formFields/muiCheckbox';
import MuiTextField from '../../../../commonComponents/formFields/muiTextField';
import {
  getAllCompanies, getArrayFromValuesById, getColumnArrayById, isArrayColumnExists,
} from '../../../../util/appUtils';
import {
  getEqipmentCategory, getSpaceCategory, setEquipmentId, setProblemCategoryId,
} from '../../../siteService';
import {
  typeCtegoryLabelFunction,
} from '../../../utils/utils';
import customData from '../data/customData.json';
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
      name,
      typeCategory,
      isAllAssetCategory,
      equipmentCategoryIds,
      spaceCategoryIds,
      isAllCategory,
    },
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const { values: formValues } = useFormikContext();
  const {
    equipment_category_ids, type_category, space_category_ids, is_all_category, problem_category_ids, is_all_asset_category,
  } = formValues;
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name', 'cat_display_name']);
  const [extraModal, setExtraModal] = useState(false);
  const [extraMultipleModal, setExtraMultipleModal] = useState(false);

  const [typeOpen, setTypeOpen] = useState(false);

  const [checkedRows, setCheckRows] = useState([]);

  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [equipmentKeyword, setEquipmentKeyword] = useState('');
  // const [equipmentId, setEquipmentId] = useState(equipment_category_ids);
  const [equipmentOptions, setEquipmentOptions] = useState([]);

  const [spaceCategoryId, setSpaceCategoryId] = useState(space_category_ids);
  const [spaceCategoryOpen, setSpaceCategoryOpen] = useState(false);
  const [spaceCategoryKeyword, setSpaceCategoryKeyword] = useState('');
  const [spaceCategoryOptions, setSpaceCategoryOptions] = useState([]);

  // const [problemCategoryId, setProblemCategoryId] = useState(problem_category_ids);

  const { userInfo } = useSelector((state) => state.user);
  const {
    tcInfo, accessGroupInfo, equipmentInfo, spaceCategoryInfo, equipmentId, problemCategoryId,
  } = useSelector((state) => state.site);

  const companies = getAllCompanies(userInfo);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && equipmentOpen) {
        dispatch(getEqipmentCategory(companies, appModels.EQUIPMENTCATEGORY, equipmentKeyword));
      }
    })();
  }, [userInfo, equipmentKeyword, equipmentOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && spaceCategoryOpen) {
        dispatch(getSpaceCategory(companies, appModels.ASSETCATEGORY, spaceCategoryKeyword));
      }
    })();
  }, [userInfo, spaceCategoryKeyword, spaceCategoryOpen]);

  useEffect(() => {
    if (editId) {
      dispatch(setEquipmentId(equipment_category_ids));
      setSpaceCategoryId(space_category_ids);
      dispatch(setProblemCategoryId(problem_category_ids));
    }
  }, [editId]);

  useEffect(() => {
    if (type_category && !editId) {
      dispatch(setEquipmentId([]));
      setSpaceCategoryId([]);
      dispatch(setProblemCategoryId([]));
    }
  }, [type_category]);

  useEffect(() => {
    if (is_all_category) {
      dispatch(setProblemCategoryId([]));
    }
  }, [is_all_category]);

  useEffect(() => {
    if (is_all_asset_category) {
      dispatch(setEquipmentId([]));
      setSpaceCategoryId([]);
    }
  }, [is_all_asset_category]);

  useEffect(() => {
    if (equipmentId) {
      setFieldValue('equipment_category_ids', equipmentId);
    }
  }, [equipmentId]);

  useEffect(() => {
    if (spaceCategoryId) {
      setFieldValue('space_category_ids', spaceCategoryId);
    }
  }, [spaceCategoryId]);

  useEffect(() => {
    if (problemCategoryId) {
      setFieldValue('problem_category_ids', problemCategoryId);
    }
  }, [problemCategoryId]);

  function isAssociativeArray(arr) {
    let result = arr;
    if (isArrayColumnExists(arr, 'id')) {
      result = getColumnArrayById(arr, 'id');
    }
    return result;
  }

  useEffect(() => {
    if (equipmentInfo && equipmentInfo.data && equipmentInfo.data.length && equipmentOpen) {
      setEquipmentOptions(getArrayFromValuesById(equipmentInfo.data, isAssociativeArray(equipmentId || []), 'id'));
    } else if (equipmentInfo && equipmentInfo.loading) {
      setEquipmentOptions([{ name: 'Loading...' }]);
    } else {
      setEquipmentOptions([]);
    }
  }, [equipmentInfo, equipmentOpen]);

  useEffect(() => {
    if (spaceCategoryInfo && spaceCategoryInfo.data && spaceCategoryInfo.data.length && spaceCategoryOpen) {
      setSpaceCategoryOptions(getArrayFromValuesById(spaceCategoryInfo.data, isAssociativeArray(spaceCategoryId || []), 'id'));
    } else if (spaceCategoryInfo && spaceCategoryInfo.loading) {
      setSpaceCategoryOptions([{ name: 'Loading...' }]);
    } else {
      setSpaceCategoryOptions([]);
    }
  }, [spaceCategoryInfo, spaceCategoryOpen]);

  const handleEquipment = (options) => {
    if (options && options.length && options.find((option) => option.name === 'Loading...')) {
      return false;
    }
    dispatch(setEquipmentId(options));
    setCheckRows(options);
  };

  const handleSpaceCategory = (options) => {
    if (options && options.length && options.find((option) => option.name === 'Loading...')) {
      return false;
    }
    setSpaceCategoryId(options);
    setCheckRows(options);
  };

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const setEquipmentKeywordSearch = (event) => {
    setEquipmentKeyword(event.target.value);
  };

  const setSpaceCategoryKeywordSearch = (event) => {
    setSpaceCategoryKeyword(event.target.value);
  };

  const onEquipmentKeywordClear = () => {
    setEquipmentKeyword(null);
    dispatch(setEquipmentId([]));
    setCheckRows([]);
    setEquipmentOpen(false);
  };

  const onSpaceCategoryKeywordClear = () => {
    setSpaceCategoryKeyword(null);
    setSpaceCategoryId([]);
    setCheckRows([]);
    setSpaceCategoryOpen(false);
  };

  const showEquipmentModal = () => {
    setModelValue(appModels.EQUIPMENTCATEGORY);
    setFieldName('equipment_category_ids');
    setModalName('Equipment Category List');
    setColumns(['id', 'name']);
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraMultipleModal(true);
  };

  const showSpaceCategoryModal = () => {
    setModelValue(appModels.ASSETCATEGORY);
    setFieldName('space_category_ids');
    setModalName('Space Category List');
    setColumns(['id', 'name']);
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraMultipleModal(true);
  };

  const showProblemCategoryModal = () => {
    setModelValue(appModels.TICKETCATEGORY);
    setFieldName('problem_category_ids');
    setModalName('Problem Category List');
    setColumns(['id', 'name', 'cat_display_name', 'company_id']);
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraMultipleModal(true);
  };

  const removeData = (e, index) => {
    const newData = problem_category_ids;
    const { id } = newData[index];
    if (id) {
      // newData[index].isRemove = true;
      // newData.filter((item) => item.id !== id);
      newData.splice(index, 1);
      dispatch(setProblemCategoryId(newData));
      setFieldValue('problem_category_ids', newData);
    } else {
      newData.splice(index, 1);
      dispatch(setProblemCategoryId(newData));
    }
  };

  const setFieldId = () => {
    setExtraMultipleModal(false);
    if (fieldName === 'equipment_category_ids') {
      const temp = (checkedRows.filter((item) => item.fieldName === fieldName));
      dispatch(setEquipmentId([...equipment_category_ids, ...temp]));
      setCheckRows([]);
    }
    if (fieldName === 'space_category_ids') {
      const temp = (checkedRows.filter((item) => item.fieldName === fieldName));
      setSpaceCategoryId([...space_category_ids, ...temp]);
      setCheckRows([]);
    }
    if (fieldName === 'problem_category_ids') {
      const temp = (checkedRows.filter((item) => item.fieldName === fieldName));
      dispatch(setProblemCategoryId([...problem_category_ids, ...temp]));
      setCheckRows([]);
    }
  };

  console.log(equipment_category_ids);

  return (
    <>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 4 }}>
        <Grid item xs={12} sm={6} md={6}>
          <MuiTextField
            sx={{
              marginBottom: '28px',
            }}
            name={name.name}
            label={name.label}
            autoComplete="off"
            isRequired
            type="text"
              // formGroupClassName="m-1"
            inputProps={{
              maxLength: 30,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <h6 className="mt-2 pt-2" />
          <MuiCheckboxField
            name={isAllAssetCategory.name}
            label={isAllAssetCategory.label}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <MuiAutoComplete
            sx={{
              marginBottom: '15px',
            }}
            name={typeCategory.name}
            label={typeCategory.label}
            className="bg-white"
            open={typeOpen}
            disableClearable
            oldvalue={typeCtegoryLabelFunction(type_category)}
            value={type_category && type_category.label ? type_category.label : typeCtegoryLabelFunction(type_category)}
            size="small"
            onOpen={() => {
              setTypeOpen(true);
            }}
            onClose={() => {
              setTypeOpen(false);
            }}
            getOptionSelected={(option, value) => option.label === value.label}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
            options={customData.typePCG}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                className="without-padding"
                label={typeCategory.label}
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
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          {(((type_category.value || type_category) !== 'asset' || (type_category.value || type_category) === 'equipment') && !is_all_asset_category)
            ? (
              <MuiAutoComplete
                sx={{
                  marginBottom: '20px',
                }}
                multiple
                filterSelectedOptions
                name="equipmentCategoryIds"
                open={equipmentOpen}
                size="small"
                className="bg-white"
                onOpen={() => {
                  setEquipmentOpen(true);
                  setEquipmentKeyword('');
                }}
                onClose={() => {
                  setEquipmentOpen(false);
                  setEquipmentKeyword('');
                }}
                value={equipment_category_ids && equipment_category_ids.length > 0 ? equipment_category_ids : []}
                defaultValue={equipmentId}
                onChange={(e, options) => handleEquipment(options)}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={equipmentOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    required
                    label={equipmentCategoryIds.label}
                    className={((getOldData(equipment_category_ids)) || (equipmentKeyword && equipmentKeyword.length > 0))
                      ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    placeholder="Search & Select"
                    onChange={(e) => setEquipmentKeywordSearch(e.target.value)}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {(equipmentInfo && equipmentInfo.loading) ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {((equipmentKeyword && equipmentKeyword.length > 0) || (equipment_category_ids && equipment_category_ids.length > 0)) && (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onEquipmentKeywordClear}
                            >
                               <IoCloseOutline size={22} fontSize="small" />
                            </IconButton>
                            )}
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showEquipmentModal}
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
            ) : ''}
          {((((type_category.value || type_category) !== 'equipment'
            && (type_category.value || type_category) === 'asset') || (type_category.value || type_category) === 'equipment_space') && !is_all_asset_category)
            ? (
              <Autocomplete
                sx={{
                  marginBottom: '20px',
                }}
                multiple
                filterSelectedOptions
                name="spaceCategoryIds"
                open={spaceCategoryOpen}
                size="small"
                className="bg-white"
                onOpen={() => {
                  setSpaceCategoryOpen(true);
                  setSpaceCategoryKeyword('');
                }}
                onClose={() => {
                  setSpaceCategoryOpen(false);
                  setSpaceCategoryKeyword('');
                }}
                value={space_category_ids && space_category_ids.length > 0 ? space_category_ids : []}
                defaultValue={spaceCategoryId}
                onChange={(e, options) => handleSpaceCategory(options)}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={spaceCategoryOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    required
                    label={spaceCategoryIds.label}
                    className={((getOldData(spaceCategoryId)) || (spaceCategoryKeyword && spaceCategoryKeyword.length > 0))
                      ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    placeholder="Search & Select"
                    onChange={(e) => setSpaceCategoryKeywordSearch(e.target.value)}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {(spaceCategoryInfo && spaceCategoryInfo.loading) ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {((spaceCategoryKeyword && spaceCategoryKeyword.length > 0) || (space_category_ids && space_category_ids.length > 0)) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onSpaceCategoryKeywordClear}
                              >
                                 <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showSpaceCategoryModal}
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
            ) : ''}
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <h6 className="mt-2 pt-2" />
          <MuiCheckboxField
            sx={{
              marginBottom: '20px',
            }}
            name={isAllCategory.name}
            label={isAllCategory.label}
          />
        </Grid>
      </Grid>
      {!is_all_category && (
        <>
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
            Problem Category
          </Typography>
          <Row className="">
            <Col xs={12} sm={12} md={12} lg={12} className="ml-3">
              <Table responsive id="spare-part">
                <thead className="bg-lightblue">
                  <tr>
                    <th className="p-2 min-width-160 border-0">
                      Category Name
                    </th>
                    <th className="p-2 min-width-160 border-0">
                      Category Display Name
                    </th>
                    {/* <th className="p-2 min-width-160 border-0">
                      Company
      </th> */}
                    <th className="p-2 min-width-160 border-0">
                      <span className="invisible">Del</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="7" className="text-left">
                      <div aria-hidden="true" className="font-weight-800 text-lightblue cursor-pointer mt-1 mb-1" onClick={showProblemCategoryModal}>
                        <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
                        <span className="mr-5">Add a Line</span>
                      </div>
                    </td>
                  </tr>
                  {(problem_category_ids && problem_category_ids.length > 0 && problem_category_ids.map((pl, index) => (
                    <>
                      {!pl.isRemove && (
                        <tr key={index}>
                          <td className="p-2">
                            {pl.name}
                          </td>
                          <td className="p-2">
                            {pl.cat_display_name}
                          </td>
                          {/* <td className="p-2">
                            {pl.company_id && pl.company_id.name ? pl.company_id.name : extractTextObject(pl.company_id)}
                      </td> */}
                          <td className="p-2">
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
        </>
      )}
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
              oldEqipmentData={equipmentId && equipmentId.length ? equipmentId : []}
              oldCatData={spaceCategoryId && spaceCategoryId.length ? spaceCategoryId : []}
              oldProblemData={problemCategoryId && problemCategoryId.length ? problemCategoryId : []}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {(checkedRows && checkedRows.length && checkedRows.length > 0)
            ? (
              <Button
                type="button"
                size="sm"
                onClick={() => setFieldId()}
                variant="contained"
              >
                {' '}
                Add
              </Button>
            ) : ''}
        </DialogActions>
      </Dialog>
    </>
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
