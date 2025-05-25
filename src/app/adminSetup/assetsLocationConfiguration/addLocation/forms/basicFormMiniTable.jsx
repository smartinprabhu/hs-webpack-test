/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  CircularProgress,
} from '@material-ui/core';
import Grid from '@mui/material/Grid';
import { useFormikContext } from 'formik';
import * as PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import addIcon from '@images/icons/plusCircleGrey.svg';

import {
  TextField, Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { Cascader, Divider } from 'antd';
import 'antd/dist/antd.css';
import {
  Spinner, Table, Row, Col,
} from 'reactstrap';

import {
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import makeStyles from '@mui/styles/makeStyles';
import { getAllSpaces, getBuildings } from '../../../../assets/equipmentService';
import MuiAutoComplete from '../../../../commonComponents/formFields/muiAutocomplete';
import {
  getCascader,
} from '../../../../helpdesk/ticketService';
import { getAssetCategoryList } from '../../../../preventiveMaintenance/ppmService';
import {
  avoidSpaceOnFirstCharacter,
  extractOptionsObject,
  generateErrorMessage,
  generatePassword,
  getAllCompanies, getArrayFromValues,
  getOldData, decimalKeyPressDown, preprocessData,
} from '../../../../util/appUtils';
import {
  infoValue, addChildrens, addChildrensAll, addParents,
} from '../../../utils/utils';
import customData from '../data/companyData.json';

const appModels = require('../../../../util/appModels').default;

const useStyles = makeStyles({
  root: {
    '& .MuiFormLabel-asterisk': {
      color: 'red',
    },
  },
});

const Basic = (props) => {
  const {
    formField: {
      spaceName,
      Type,
      BuildingValue,
      maxOccupancy,
      areaSqft,
    },
    spaceCategory,
    setFieldValue,
    setPartsData,
    partsData,
    setPartsAdd,
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    asset_category_id, parent_id,
  } = formValues;
  const [assetOpen, setAssetOpen] = useState(false);
  const [assetkeyword, setAssetKeyword] = useState('');

  const [buildingOpen, setBuildingOpen] = useState(false);
  const [buildingkeyword, setBuildingKeyword] = useState('');
  const [childValues, setChildValues] = useState([]);
  const [parentId, setParentId] = useState('');
  const [spaceId, setSpaceId] = useState(false);
  const [cascaderValues, setCascaderValues] = useState([]);
  const [childLoad, setChildLoad] = useState(false);
  const [spaceCategoryId, setSpaceCategoryId] = useState('');

  const { assetCategoriesInfo } = useSelector((state) => state.ppm);
  const {
    getFloorsInfo, spaceInfo, buildingsInfo, buildingSpaces,
  } = useSelector((state) => state.equipment);
  const {
    spaceCascader,
  } = useSelector((state) => state.ticket);
  const dispatch = useDispatch();
  const classes = useStyles();

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getBuildings(companies, appModels.SPACE, buildingkeyword, ['id', 'space_name']));
    }
  }, [userInfo, buildingkeyword, buildingOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data) {
        await dispatch(getAssetCategoryList(companies, appModels.ASSETCATEGORY, assetkeyword));
      }
    })();
  }, [userInfo]);

  const loadEmptyTd = () => {
    const newData = partsData && partsData.length ? partsData : [];
    const defaultData = userInfo && userInfo.data && userInfo.data.company;
    const defaultDataType = getArrayFromValues(assetCategoriesInfo.data, [spaceCategory], 'name');
    const BlockId = parent_id && parent_id.length ? parent_id[parent_id.length - 1] : parent_id && parent_id.id ? parent_id.id : '';
    const FloorId = parent_id && parent_id.length > 0 ? parent_id[parent_id.length - 1] : parent_id && parent_id.id ? parent_id.id : false;
    if (defaultData && defaultData.length) {
      defaultDataType = defaultData[0];
    }
    if (spaceCategory === 'Building') {
      newData.push({
        id: false,
        space_name: '',
        company_id: defaultData.id,
        max_occupancy: '',
        area_sqft: '',
        asset_category_id: defaultDataType && defaultDataType.length && defaultDataType[0],
        name: generatePassword(4),
      });
    }
    if (spaceCategory === 'Floor') {
      newData.push({
        id: false,
        space_name: '',
        company_id: defaultData.id,
        max_occupancy: '',
        area_sqft: '',
        asset_category_id: defaultDataType && defaultDataType.length && defaultDataType[0],
        name: generatePassword(4),
      });
    }
    if ((spaceCategory === 'Room') || (spaceCategory === 'Space') || (spaceCategory === 'Wing')) {
      newData.push({
        id: false,
        space_name: '',
        company_id: defaultData.id,
        max_occupancy: '',
        area_sqft: '',
        asset_category_id: defaultDataType && defaultDataType.length && defaultDataType[0],
        name: generatePassword(4),
      });
    }
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  /* useEffect(() => {
    if (assetCategoriesInfo && assetCategoriesInfo.data && assetCategoriesInfo.data.length) {
      if (spaceCategory === 'Building') {
        loadEmptyTd();
      }
      if (spaceCategory === 'Floor' && parent_id) {
        loadEmptyTd();
      }
      if (((spaceCategory === 'Room') || (spaceCategory === 'Space')) && parent_id) {
        loadEmptyTd();
      }
    }
  }, [assetCategoriesInfo]); */

  useEffect(() => {
    if ((userInfo && userInfo.data) && (buildingsInfo && buildingsInfo.data)) {
      setChildValues(addParents(buildingsInfo.data));
      if (!parent_id && buildingsInfo.data.length) {
        setFieldValue('parent_id', buildingsInfo.data[0]);
      }
    }
  }, [buildingsInfo]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (buildingSpaces && buildingSpaces.data && buildingSpaces.data.length && parentId)) {
      setChildLoad(true);
      const childData = addChildrensAll(childValues, buildingSpaces.data[0].child, parentId, spaceCategory);
      setChildValues(childData);
    }
  }, [buildingSpaces, parentId]);

  useEffect(() => {
    if (childValues) {
      setChildLoad(true);
      setCascaderValues(childValues);
    }
  }, [childValues]);

  useEffect(() => {
    if (cascaderValues && childLoad) {
      dispatch(getCascader(cascaderValues));
    }
  }, [cascaderValues, buildingSpaces, childLoad]);

  const onChange = (value, selectedOptions) => {
    setParentId('');
    if (selectedOptions && selectedOptions.length) {
      if (!selectedOptions[0].parent_id) {
        setParentId(selectedOptions[0].id);
        setSpaceId(selectedOptions[0].id);
        setSpaceCategoryId(selectedOptions[0].typeId);
        if (spaceId !== selectedOptions[0].id) {
          dispatch(getAllSpaces(selectedOptions[0].id, companies, true));
        }
      }
    }
    setFieldValue('parent_id', value);
  };

  function checkDataType(arr) {
    let res = [];
    if (arr && arr.id) {
      res = [arr.id];
    } else if (arr && arr.length) {
      res = arr;
    }
    return res;
  }

  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading) || (buildingsInfo && buildingsInfo.loading) || (buildingSpaces && buildingSpaces.loading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (buildingsInfo && buildingsInfo.err) ? generateErrorMessage(buildingsInfo) : userErrorMsg;
  const errorMsg1 = (buildingSpaces && buildingSpaces.err) ? generateErrorMessage(buildingSpaces) : userErrorMsg;

  const dropdownRender = (menus) => (
    <div>
      {menus}
      {loading && (
        <>
          <Divider style={{ margin: 0 }} />
          <div className="text-center p-2" data-testid="loading-case">
            <Spinner animation="border" size="sm" className="text-dark ml-3" variant="secondary" />
          </div>
        </>
      )}
    </div>
  );

  const loadData = () => { };

  let assetCategoryOptions = [];
  let locationOptions = [];

  if (assetCategoriesInfo && assetCategoriesInfo.loading) {
    assetCategoryOptions = [{ name: 'Loading..' }];
  }
  if (assetCategoriesInfo && assetCategoriesInfo.data) {
    const ids = ['Building', 'Floor', 'Room', 'Space'];
    const arr = [...assetCategoryOptions, ...getArrayFromValues(assetCategoriesInfo.data, ids, 'name')];
    assetCategoryOptions = [...new Map(arr.map((item) => [item.name, item])).values()];
  }

  if (locationOptions && locationOptions.loading) {
    locationOptions = [{ name: 'Loading..' }];
  }
  if (locationOptions && locationOptions.data) {
    const ids = ['Building', 'Floor', 'Room', 'Space'];
    const arr = [...assetCategoryOptions, ...getArrayFromValues(assetCategoriesInfo.data, ids, 'name')];
    assetCategoryOptions = [...new Map(arr.map((item) => [item.name, item])).values()];
  }

  const onAssetKeywordChange = (event) => {
    setAssetKeyword(event.target.value);
    setAssetOpen(false);
  };

  const onBuildingKeywordChange = (event) => {
    setBuildingKeyword(event.target.value);
    setBuildingOpen(false);
  };

  const onIcClear = () => {
    setBuildingKeyword(null);
    setFieldValue('parent_id', '');
    setBuildingOpen(false);
  };

  const buildingOptions = extractOptionsObject(buildingsInfo, parent_id);

  const onNameTextChange = (e, index, field) => {
    const newData = partsData;
    newData[index][field] = e;
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onNameChange = (e, index, field) => {
    const newData = partsData;
    newData[index][field] = e.target.value;
    setPartsData(newData);
    setPartsAdd(Math.random());
    if (field === 'space_name' && e.target.value && (index + 1) === partsData.length) {
      loadEmptyTd();
    }
  };

  const removeData = (e, index) => {
    const newData = partsData;
    const { id } = newData[index];
    if (id) {
      newData[index].isRemove = true;
      setPartsData(newData);
      setPartsAdd(Math.random());
    } else {
      newData.splice(index, 1);
      setPartsData(newData);
      setPartsAdd(Math.random());
    }
  };

  return (
    <>

      <Box
        sx={{
          width: '100%',
        }}
      >
        {((spaceCategory === 'Floor')) && (
        <Grid item xs={12} sm={6} md={6}>
          <MuiAutoComplete
            sx={{
              marginTop: 'auto',
              marginBottom: '20px',
              width: '50%',
            }}
            name={BuildingValue.name}
            label={BuildingValue.label}
            isRequired={Type.required}
            open={buildingOpen}
            size="small"
            onOpen={() => {
              setBuildingOpen(true);
              setBuildingKeyword('');
            }}
            onClose={() => {
              setBuildingOpen(false);
              setBuildingKeyword('');
            }}
            oldValue={getOldData(parent_id)}
            value={parent_id && parent_id.space_name
              ? parent_id.space_name
              : getOldData(parent_id)}
            apiError={(buildingsInfo && buildingsInfo.err) ? generateErrorMessage(buildingsInfo) : false}
            loading={buildingsInfo && buildingsInfo.loading}
            getOptionSelected={(option, value) => (value.length > 0 ? option.space_name
              === value.space_name
              : '')}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.space_name
            )}
            disableClearable
            options={buildingOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onBuildingKeywordChange}
               // label={spaceCategory === 'Floor' ? 'Building' : BuildingValue.label}
                label={(
                  <>
                    {spaceCategory === 'Floor' ? 'Building' : BuildingValue.label}
                    <span className="text-danger ml-1">*</span>
                    {infoValue('floorParent')}
                  </>
                )}
                variant="standard"
                InputLabelProps={{ shrink: true }}
                className={parent_id && parent_id.id ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      { buildingsInfo && buildingsInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                      {/* <InputAdornment position="end">
                        {parent_id.id && (
                        <IconButton onClick={onIcClear}>
                          <IoCloseOutline size={22} fontSize="small" />
                        </IconButton>
                        )}
                      </InputAdornment> */}
                    </>
                  ),
                }}
              />
            )}
          />
        </Grid>
        )}
        {((spaceCategory === 'Room') || (spaceCategory === 'Space') || (spaceCategory === 'Wing')) && (
          <Grid item xs={12} sm={6} md={6}>
            <Box
              sx={{
                width: '50%',
                marginTop: 'auto',
                marginBottom: '20px',
              }}
            >
              <Typography
                sx={{
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif !important',
                  letterSpacing: '0.00938em !important',
                  fontWeight: '400 !important',
                  fontSize: '12px !important',
                  color: '#00000099',
                  marginBottom: '5px',
                }}
              >
                { spaceCategory === 'Room' ? 'Building/Floor/Wing'
                  : spaceCategory === 'Space' ? 'Building/Floor/Wing'
                    : spaceCategory === 'Wing' ? 'Building/Floor'
                      : ''}
                <span className="text-danger ml-1">*</span>
                { spaceCategory === 'Room' ? infoValue('roomParent')
                  : spaceCategory === 'Space' ? infoValue('spaceParent')
                    : spaceCategory === 'Wing' ? infoValue('wingParent')
                      : ''}
              </Typography>
              <Cascader
                options={preprocessData(spaceCascader && spaceCascader.length > 0 ? spaceCascader : [])}
                dropdownClassName="custom-cascader-popup"
                value={spaceCascader && spaceCascader.length > 0 ? checkDataType(parent_id) : []}
                fieldNames={{ label: 'name', value: 'id', children: 'children' }}
                onChange={onChange}
                placeholder="Select Space"
                dropdownRender={dropdownRender}
                notFoundContent="No options"
                className="thin-scrollbar bg-white mb-1 ml-1 w-75"
                // loadData={loadData}
                changeOnSelect
              />
            </Box>
          </Grid>
        )}
        <Row className={spaceCategory !== 'Building' ? 'createFormScrollbar-middle' : ''}>
          <Col xs={12} sm={12} md={12} lg={12} className="">
            <Table id="spare-part">
              <thead className="bg-lightblue">
                <tr>
                  <th className="p-2 min-width-160 font-family-tab border-0 table-column-no-top z-Index-1210">
                    Name
                    <span className="text-danger ml-1">*</span>
                    { spaceCategory === 'Building' ? infoValue('buildingName')
                      : spaceCategory === 'Floor' ? infoValue('floorName')
                        : spaceCategory === 'Room' ? infoValue('roomName')
                          : spaceCategory === 'Space' ? infoValue('spaceName')
                            : spaceCategory === 'Wing' ? infoValue('wingName')
                              : ''}
                  </th>
                  <th className="p-2 min-width-160 font-family-tab border-0 table-column-no-top z-Index-1210">
                    Max Occupancy
                    { spaceCategory === 'Building' ? infoValue('buildingoccupancy')
                      : spaceCategory === 'Floor' ? infoValue('flooroccupancy')
                        : spaceCategory === 'Room' ? infoValue('roomoccupancy')
                          : spaceCategory === 'Space' ? infoValue('spaceoccupancy')
                            : spaceCategory === 'Wing' ? infoValue('wingoccupancy')
                              : ''}
                  </th>
                  <th className="p-2 min-width-160 font-family-tab border-0 table-column-no-top z-Index-1210">
                    Area Sqft
                    { spaceCategory === 'Building' ? infoValue('buildingarea')
                      : spaceCategory === 'Floor' ? infoValue('floorarea')
                        : spaceCategory === 'Room' ? infoValue('roomarea')
                          : spaceCategory === 'Space' ? infoValue('spacearea')
                            : spaceCategory === 'Wing' ? infoValue('wingarea')
                              : ''}
                  </th>
                  <th className="p-2 min-width-160 font-family-tab border-0 table-column-no-top z-Index-1210" />

                </tr>
              </thead>
              <tbody>
                <tr>
                  <th colSpan="7" className="text-left table-column-no-bg bg-white z-Index-1210">
                    <div aria-hidden="true" className="font-weight-800 bg-white text-lightblue cursor-pointer mb-1" onClick={loadEmptyTd}>
                      <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
                      <span className="mr-5 font-family-tab">
                        Add
                        {' '}
                        {spaceCategory || ''}
                      </span>
                    </div>
                  </th>
                </tr>
                {(partsData && partsData.length > 0 && partsData.map((pl, index) => (
                  <>
                    {!pl.isRemove && (
                    <tr key={index}>
                      <td className="p-2">
                        <TextField
                          variant="outlined"
                          type="text"
                          name="name"
                          size="small"
                          className="w-100"
                          value={`${customData?.facilityData?.[spaceCategory === 'Building'
                            ? 'manage_building' : spaceCategory === 'Floor'
                              ? 'manage_floor' : spaceCategory === 'Room'
                                ? 'manage_room' : spaceCategory === 'Wing'
                                  ? 'manage_wing' : spaceCategory === 'Space'
                                    ? 'manage_space' : '']?.prefix || ''}${pl?.space_name || ''}`}
                          onChange={(e) => {
                            const prefix = customData?.facilityData?.[spaceCategory === 'Building'
                              ? 'manage_building' : spaceCategory === 'Floor'
                                ? 'manage_floor' : spaceCategory === 'Room'
                                  ? 'manage_room' : spaceCategory === 'Wing'
                                    ? 'manage_wing' : spaceCategory === 'Space'
                                      ? 'manage_space' : '']?.prefix || '';
                            const newValue = e.target.value;
                            if (!newValue.startsWith(prefix)) return;
                            const updatedSpaceName = newValue.slice(prefix.length);
                            onNameChange({ target: { value: updatedSpaceName } }, index, 'space_name');
                          }}
                          onKeyDown={(e) => {
                            if (!pl?.space_name) {
                              avoidSpaceOnFirstCharacter(e);
                            }
                          }}
                          inputProps={{ maxLength: 150 }}
                        />
                      </td>
                      <td className="p-2">
                        <TextField
                          variant="outlined"
                          type="text"
                          name="name"
                          size="small"
                          className="w-100"
                          value={pl.max_occupancy}
                          onChange={(e) => onNameChange(e, index, 'max_occupancy')}
                          onKeyDown={decimalKeyPressDown}
                          inputProps={{ maxLength: 50 }}
                        />
                      </td>
                      <td className="p-2">
                        <TextField
                          variant="outlined"
                          type="text"
                          name="name"
                          size="small"
                          className="w-100"
                          value={pl.area_sqft}
                          onChange={(e) => onNameChange(e, index, 'area_sqft')}
                          onKeyDown={decimalKeyPressDown}
                          inputProps={{ maxLength: 50 }}
                        />
                      </td>
                      <td className="p-2 align-middle">
                        <span className="font-weight-400 d-inline-block" />
                        <FontAwesomeIcon className="mr-1 ml-1 cursor-pointer" size="lg" icon={faTrashAlt} onClick={(e) => { removeData(e, index); }} />
                      </td>
                    </tr>
                    )}
                  </>
                )))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Box>
    </>
  );
};

Basic.defaultProps = {
  selectedUser: undefined,
};

Basic.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setPartsData: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  partsData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  spaceCategory: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default Basic;
