/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  CircularProgress, FormHelperText,
} from '@material-ui/core';
import Grid from '@mui/material/Grid';
import { useFormikContext } from 'formik';
import * as PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import {
  TextField, Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { Cascader, Divider } from 'antd';
import 'antd/dist/antd.css';
import {
  Spinner
} from 'reactstrap';

import ErrorContent from '@shared/errorContent';
import { getAllSpaces, getBuildings, getSpaces } from '../../../../assets/equipmentService';
import MuiAutoComplete from '../../../../commonComponents/formFields/muiAutocomplete';
import MuiTextField from '../../../../commonComponents/formFields/muiTextField';
import {
  getCascader,
} from '../../../../helpdesk/ticketService';
import { addChildrens, addParents } from '../../../../helpdesk/utils/utils';
import { getAssetCategoryList } from '../../../../preventiveMaintenance/ppmService';
import {
  extractOptionsObject,
  generateErrorMessage, getAllCompanies, getArrayFromValues,
  getOldData, integerKeyPress,
} from '../../../../util/appUtils';

const appModels = require('../../../../util/appModels').default;

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
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    asset_category_id, parent_id,
  } = formValues;
  const [assetOpen, setAssetOpen] = useState(false);
  const [assetkeyword, setAssetKeyword] = useState('');

  const [buildingOpen, setBuildingOpen] = useState(false);
  const [buildingkeyword, setBuildingKeyword] = useState('');
  const [didLoad, setDidLoad] = useState(false);
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

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);

  /*useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getBuildings(companies, appModels.SPACE));
    }
  }, []);*/

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
      const childData = addChildrens(childValues, buildingSpaces.data[0].child, parentId);
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
          dispatch(getAllSpaces(selectedOptions[0].id, companies));
        }
      }
    } else {
      setSpaceCategoryId(selectedOptions[0].typeId);
      // setFieldValue('category_id', '');
      // setFieldValue('sub_category_id', '');
    }
    setFieldValue('parent_id', value);
  };

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getBuildings(companies, appModels.SPACE, buildingkeyword));
    }
  }, [userInfo, buildingkeyword, buildingOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data) {
        await dispatch(getAssetCategoryList(companies, appModels.ASSETCATEGORY, assetkeyword));
      }
    })();
  }, [userInfo]);

  useEffect(() => {
    if (assetCategoriesInfo && assetCategoriesInfo.data && assetCategoriesInfo.data.length) {
      const defaultData = getArrayFromValues(assetCategoriesInfo.data, [spaceCategory], 'name');
      if (defaultData && defaultData.length) {
        setFieldValue('asset_category_id', defaultData[0]);
      }
    }
  }, [assetCategoriesInfo]);

  /*useEffect(() => {
    if (!didLoad && buildingsInfo && buildingsInfo.data && buildingsInfo.data.length) {
      const defaultData = buildingsInfo.data;
      if (defaultData && defaultData.length) {
        setFieldValue('parent_id', defaultData[0]);
        setDidLoad(true);
      }
    }
  }, [didLoad, buildingsInfo, getFloorsInfo]);*/

  function checkDataType(arr) {
    let res = [];
    if (arr && arr.id) {
      res = [arr.id, arr.name];
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
      {((buildingsInfo && buildingsInfo.err) || isUserError) && (
        <>
          <Divider style={{ margin: 0 }} />
          <ErrorContent errorTxt={errorMsg} />
        </>
      )}
      {((buildingSpaces && buildingSpaces.err) || isUserError) && (
        <>
          <Divider style={{ margin: 0 }} />
          <ErrorContent errorTxt={errorMsg1} />
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

  return (
    <>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 4 }}>
        <Grid item xs={12} sm={6} md={6}>
          <MuiTextField
            name={spaceName.name}
            label={spaceName.label}
            isRequired={spaceName.required}
            formGroupClassName="mb-1"
            type="text"
            inputProps={{
              maxLength: 50,
            }}
          />
        </Grid>
        {/* <Grid item xs={12} sm={6} md={6}>
          <MuiTextField
            name={shortCode.name}
            label={shortCode.label}
            isRequired={shortCode.required}
            formGroupClassName="mb-1"
            type="text"
            inputProps={{
              maxLength: 15,
            }}
          />
          </Grid> */}
        <Grid item xs={12} sm={6} md={6}>
          <MuiAutoComplete
            sx={{
              marginTop: 'auto',
              marginBottom: '10px',
            }}
            name={Type.name}
            label={Type.label}
            isRequired={Type.required}
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
            disabled
            loading={assetCategoriesInfo && assetCategoriesInfo.loading}
            getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={assetCategoryOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onAssetKeywordChange}
                label={`${Type.label}`}
                required
                variant="standard"
                className={asset_category_id && asset_category_id.id ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {assetCategoriesInfo && assetCategoriesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {/* {asset_category_id.id && (
                        <IconButton onClick={() => {
                          setAssetKeyword(null);
                          setFieldValue('asset_category_id', '');
                          setAssetOpen(false);
                        }}
                        >
                          <IoCloseOutline size={22} fontSize="small" />
                        </IconButton>
                        )} */}
                      </InputAdornment>
                    </>
                  ),
                }}
              />
            )}
          />
          {(assetCategoriesInfo && assetCategoriesInfo.err && assetOpen)
                          && (<FormHelperText><span className="text-danger">{generateErrorMessage(assetCategoriesInfo)}</span></FormHelperText>)}
        </Grid>
        {((spaceCategory === 'Floor')) && (
        <Grid item xs={12} sm={6} md={6}>
          <MuiAutoComplete
            sx={{
              marginTop: 'auto',
              marginBottom: '10px',
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
            value={parent_id && parent_id.name ? parent_id.name : getOldData(parent_id)}
            apiError={(buildingsInfo && buildingsInfo.err) ? generateErrorMessage(buildingsInfo) : false}
            loading={buildingsInfo && buildingsInfo.loading}
            getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={buildingOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onBuildingKeywordChange}
                label={spaceCategory === 'Floor' ? 'Building*' : BuildingValue.label}
                variant="standard"
                className={parent_id && parent_id.id ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {buildingsInfo && buildingsInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {parent_id.id && (
                        <IconButton onClick={onIcClear}>
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
        </Grid>
        )}
        {((spaceCategory === 'Room') || (spaceCategory === 'Space')) && (
          <Grid item xs={12} sm={6} md={6}>
            <Box
              sx={{
                width: '100%',
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
                {BuildingValue.label}
              </Typography>
              <Cascader
                options={spaceCascader && spaceCascader.length > 0 ? spaceCascader : []}
                value={spaceCascader && spaceCascader.length > 0 ? checkDataType(parent_id) : []}
                fieldNames={{ label: 'name', value: 'id', children: 'children' }}
                onChange={onChange}
                placeholder="Select Space"
                dropdownRender={dropdownRender}
                notFoundContent="No options"
                className="thin-scrollbar bg-white mb-1 ml-1"
                loadData={loadData}
                changeOnSelect
              />
            </Box>
          </Grid>
        )}
        <Grid item xs={12} sm={6} md={6}>
          <MuiTextField
            sx={{
              marginTop: 'auto',
              marginBottom: '10px',
            }}
            name={maxOccupancy.name}
            label={maxOccupancy.label}
            isRequired={maxOccupancy.required}
            type="text"
            onKeyPress={integerKeyPress}
          />

        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <MuiTextField
            sx={{
              marginTop: 'auto',
              marginBottom: '10px',
            }}
            name={areaSqft.name}
            label={areaSqft.label}
            isRequired={areaSqft.required}
            type="text"
          />

        </Grid>
      </Grid>
    </>
  );
};

Basic.defaultProps = {
  selectedUser: undefined,
};

Basic.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  selectedUser: PropTypes.any,
  reloadData: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  spaceCategory: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default Basic;
