/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable radix */
/* eslint-disable camelcase */
/* eslint-disable comma-dangle */
/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import addIcon from '@images/icons/plusCircleBlue.svg';
import {
  CircularProgress, FormHelperText,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import BackspaceIcon from '@material-ui/icons/Backspace';
import { TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col,
  Row,
  Table
} from 'reactstrap';
import {
  getAssetTypes,
  getPartsData,
} from '../visitorManagementService';
// import {
//   getGatePassAssets,
// } from '../../preventiveMaintenance/ppmService';
import {
  decimalKeyPressDown,
  generateErrorMessage,
  getAllowedCompanies,
  getArrayFromValuesById,
  getColumnArrayById
} from '../../util/appUtils';

import MuiAutoComplete from '../../commonComponents/formFields/muiAutocomplete';
import MuiTextField from '../../commonComponents/formFields/muiTextField';
import { AddThemeColor } from '../../themes/theme';

const appModels = require('../../util/appModels').default;

const AssetInfo = (props) => {
  const {
    checkAssets,
    setFieldValue,
    partsData,
    setPartsData,
    setDataChanged,
    values,
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    visitor_assets_ids
  } = formValues;
  const dispatch = useDispatch();
  // const [partsData, setPartsData] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [partsAdd, setPartsAdd] = useState(false);
  const [openId, setOpen] = useState('');
  const [assetKeyword, setAssetKeyword] = useState('');

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);

  const {
    assetTypes, visitorConfiguration
  } = useSelector((state) => state.visitorManagement);

  const requiredCondition = visitorConfiguration && visitorConfiguration.data && visitorConfiguration.data.length ? visitorConfiguration.data[0] : false;

  useEffect(() => {
    setPartsData([]);
    dispatch(getPartsData([]));
  }, []);

  useEffect(() => {
    setDataChanged(Math.random());
  }, [visitor_assets_ids, setPartsData, partsAdd]);

  useEffect(() => {
    if (partsAdd) {
      setPartsData(partsData);
      dispatch(getPartsData(partsData));
    }
  }, [partsAdd]);

  useEffect(() => {
    if (partsData) {
      setFieldValue('visitor_assets_ids', partsData);
    }
  }, [partsData]);

  useEffect(() => {
    if (assetTypes && assetTypes.data && assetTypes.data.length > 0) {
      const { data } = assetTypes;
      setProductOptions(data.map((cl) => ({
        ...cl, value: cl.id, name: cl.name,

      })));
    }
  }, [assetTypes]);

  useEffect(() => {
    if (partsAdd) {
      setPartsData(partsData);
      const ids = getColumnArrayById(partsData && partsData.length ? partsData : [], 'visitor_asset_name_ref');
      const data = getArrayFromValuesById(assetTypes && assetTypes.data ? assetTypes.data : [], ids, 'id');
      setProductOptions(data.map((cl) => ({
        ...cl, value: cl.id, name: cl.name,
      })));
    }
  }, [partsAdd]);

  useEffect(() => {
    if (userInfo && userInfo.data && visitorConfiguration && visitorConfiguration.data && visitorConfiguration.data.length) {
      const ids = visitorConfiguration && visitorConfiguration.data && visitorConfiguration.data.length && visitorConfiguration.data[0].visitor_allowed_asset_ids && visitorConfiguration.data[0].visitor_allowed_asset_ids;
      dispatch(getAssetTypes(companies, appModels.ASSETTYPE, assetKeyword, ids));
    }
  }, [assetKeyword, visitorConfiguration]);

  const loadEmptyTd = () => {
    const newData = partsData && partsData.length ? partsData : [];
    newData.push({
      id: false, visitor_asset_name: '', asset_quantity: 1, remarks: '',
    });
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onAssetKeywordChange = (event) => {
    setAssetKeyword(event.target.value);
  };

  const onProductChange = (e, index) => {
    const newData = partsData;
    newData[index].visitor_asset_name = [e.id, e.name];
    newData[index].visitor_asset_name_ref = e.id;
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onQuantityChange = (e, index, field) => {
    const newData = partsData;
    if (field === 'parts_qty') {
      newData[index][field] = e.target.value && e.target.value >= 1 ? e.target.value : '';
    } else {
      newData[index][field] = e.target.value;
    }
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onRemarksChange = (e, index, field) => {
    const newData = partsData;
    if (field === 'remarks') {
      newData[index][field] = e.target.value;
    } else {
      newData[index][field] = e.target.value;
    }
    setPartsData(newData);
    setPartsAdd(Math.random());
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

  const onProductKeywordClear = (e, index) => {
    const newData = partsData;
    newData[index].visitor_asset_name = '';
    newData[index].visitor_asset_name_ref = '';
    setPartsData(newData);
    setPartsAdd(Math.random());
    setOpen(false);
  };

  return (
    <>
      {checkAssets && (
      <>
        <Box
          sx={{
            width: '100%',
            marginTop: '20px',
          }}
        >
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
            })}
          >
            Assets Info
          </Typography>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '3%',
              flexWrap: 'wrap',
            }}
          >

            <Row className="">
              <Col xs={12} sm={12} md={12} lg={12} className="ml-3">
                <Table responsive id="spare-part">
                  <thead className="bg-lightblue">
                    <tr>
                      <th className="p-2 min-width-160 border-0">
                        Asset
                        {' '}
                      </th>
                      <th className="p-2 min-width-160 border-0">
                        Quantity
                      </th>
                      <th className="p-2 min-width-160 border-0">
                        Remarks
                      </th>
                      <th className="p-2 min-width-160 border-0">
                        <span className="invisible">Del</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="5" className="text-left">
                        <div aria-hidden="true" className="font-weight-800 d-inline text-center text-lightblue cursor-pointer mt-1 mb-1" onClick={loadEmptyTd}>
                          <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
                          <span className="mr-2">Add an asset</span>
                        </div>
                      </td>
                    </tr>
                    {(visitor_assets_ids && visitor_assets_ids.length > 0 && visitor_assets_ids.map((pl, index) => (
                      <>
                        {!pl.isRemove && (
                        <tr key={index}>
                          <td className="p-2">
                            <MuiAutoComplete
                              sx={{
                                marginTop: '20px',
                                marginBottom: '20px',
                              }}
                              required={requiredCondition && requiredCondition.has_visitor_type === 'Required'}
                              name="products_new"
                              open={openId === index}
                              onOpen={() => {
                                setOpen(index);
                                setAssetKeyword('');
                              }}
                              onClose={() => {
                                setOpen('');
                                setAssetKeyword('');
                              }}
                              value={pl.visitor_asset_name && pl.visitor_asset_name.length ? pl.visitor_asset_name[1] : ''}
                              getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
                              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                              options={productOptions}
                              onChange={(e, data) => { onProductChange(data, index); }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="standard"
                                  value={assetKeyword}
                                  className={pl.visitor_asset_name && pl.visitor_asset_name.length ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                                  placeholder="Search & Select"
                                  InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                          <>
                                            {(assetTypes && assetTypes.loading) && (openId === index) ? <CircularProgress color="inherit" size={20} /> : null}
                                            <InputAdornment position="end">
                                    {(pl.visitor_asset_name && pl.visitor_asset_name.length > 0 && pl.visitor_asset_name) && (
                                              <IconButton
                                              aria-label="toggle password visibility"
                                              onClick={(e, data) => { onProductKeywordClear(data, index); }}
                                            >
                                              <BackspaceIcon fontSize="small" />
                                            </IconButton>
                                              )}
                                  </InputAdornment>
                                          </>
                                    ),
                                  }}
                                />
                              )}
                            />
                            {/* <FormControl>
                                                        <Autocomplete
                                                            name="products_new"
                                                            className="bg-white min-width-200"
                                                            open={openId === index}
                                                            size="small"
                                                            onOpen={() => {
                                                                setOpen(index);
                                                                setAssetKeyword('')
                                                            }}
                                                            onClose={() => {
                                                                setOpen('');
                                                                setAssetKeyword('')
                                                            }}
                                                            value={pl.visitor_asset_name && pl.visitor_asset_name.length ? pl.visitor_asset_name[1] : ''}
                                                            getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
                                                            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                                                            options={productOptions}
                                                            onChange={(e, data) => { onProductChange(data, index); }}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    onChange={onAssetKeywordChange}
                                                                    variant="outlined"
                                                                    value={assetKeyword}
                                                                    className={pl.visitor_asset_name && pl.visitor_asset_name.length ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                                                                    placeholder="Search & Select"
                                                                    InputProps={{
                                                                        ...params.InputProps,
                                                                        endAdornment: (
                                                                            <>
                                                                                {(assetTypes && assetTypes.loading) && (openId === index) ? <CircularProgress color="inherit" size={20} /> : null}
                                                                                <InputAdornment position="end">
                                                                                    {(pl.visitor_asset_name && pl.visitor_asset_name.length > 0 && pl.visitor_asset_name) && (
                                                                                        <IconButton
                                                                                            aria-label="toggle password visibility"
                                                                                            onClick={(e, data) => { onProductKeywordClear(data, index); }}
                                                                                        >
                                                                                            <BackspaceIcon fontSize="small" />
                                                                                        </IconButton>
                                                                                    )}
                                                                                </InputAdornment>
                                                                            </>
                                                                        ),
                                                                    }}
                                                                />
                                                            )}
                                                        />
                                                        {((assetTypes && assetTypes.err)
                                                            && (openId === index)) && (<FormHelperText><span className="text-danger">{generateErrorMessage(assetTypes)}</span></FormHelperText>)}
                                                    </FormControl> */}
                            {((assetTypes && assetTypes.err)
                                                            && (openId === index)) && (<FormHelperText><span className="text-danger">{generateErrorMessage(assetTypes)}</span></FormHelperText>)}
                          </td>
                          <td className="p-2">
                            <MuiTextField
                              sx={{
                                marginBottom: '20px',
                              }}
                              name="asset_quantity"
                              label="Asset Quantity"
                              type="text"
                              value={pl.asset_quantity}
                              onChange={(e) => onQuantityChange(e, index, 'asset_quantity')}
                              onKeyDown={decimalKeyPressDown}
                              maxLength="7"
                            />
                            {/* <Input
                                                        type="text"
                                                        onKeyPress={decimalKeyPressDown}
                                                        name="asset_quantity"
                                                        value={pl.asset_quantity}
                                                        onChange={(e) => onQuantityChange(e, index, 'asset_quantity')}
                                                        maxLength="7"
                                                    /> */}
                          </td>
                          <td className="p-2">
                            <MuiTextField
                              sx={{
                                marginBottom: '20px',
                              }}
                              name="remarks"
                              label="Remarks"
                              type="text"
                              value={pl.remarks}
                              onChange={(e) => onRemarksChange(e, index, 'remarks')}
                              maxLength="100"
                            />
                            {/*  <Input
                                                        type="text"
                                                        name="remarks"
                                                        value={pl.remarks}
                                                        onChange={(e) => onRemarksChange(e, index, 'remarks')}
                                                        maxLength="100"
                                                    /> */}
                          </td>
                          <td className="pt-4">
                            <span className="font-weight-400 d-inline-block" />
                            <FontAwesomeIcon
                              className="mr-1 ml-1 cursor-pointer"
                              size="sm"
                              icon={faTrashAlt}
                              onClick={(e) => { removeData(e, index); }}
                            />
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
        </Box>
      </>
      )}
    </>
  );
};

AssetInfo.propTypes = {
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,

};

export default AssetInfo;
