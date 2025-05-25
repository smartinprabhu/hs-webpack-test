/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Row, Col, Input, Table,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import {
  TextField,
} from '@material-ui/core';
import moment from 'moment-timezone';

import addIcon from '@images/icons/plusCircleBlue.svg';
import { FormikAutocomplete } from '@shared/formFields';
import { decimalKeyPress, getAllowedCompanies } from '../../../util/appUtils';
import {
  getVendorsList, setTableData, clearSellerIdsInfo, getSellerIds,
} from '../../purchaseService';
import { getRequiredMessageProductVendor } from '../../utils/utils';

const appModels = require('../../../util/appModels').default;

const PurchaseForm = ({ setFieldValue }) => {
  const { userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [vendorData, setVendorData] = useState([]);
  const [vendorOpen, setVendorOpen] = useState(false);
  const [data, setData] = useState(false);
  const [vendorTableData, setVendorTableData] = useState([]);
  const [removeVendorData, setVendorRemoveData] = useState([]);
  const {
    vendorsInfo, sellerIdsInfo, vendorTableInfo, productDetailsInfo,
  } = useSelector((state) => state.purchase);

  useEffect(() => {
    if (productDetailsInfo && productDetailsInfo.data && productDetailsInfo.data.length > 0 && sellerIdsInfo && !sellerIdsInfo.data) {
      const sellerIds = productDetailsInfo.data[0].seller_ids;
      dispatch(getSellerIds(appModels.SUPPLIERINFO, sellerIds));
    }
  }, [productDetailsInfo]);

  const companies = getAllowedCompanies(userInfo);

  const addVendor = () => {
    const newVendorData = vendorTableData;
    newVendorData.push({
      id: false, vendor: '', date_end: '', date_start: '', min_qty: '', price: '', value: '', newName: '',
    });
    setVendorData(newVendorData);
    setData(Math.random());
  };
  useEffect(() => {
    if (vendorData && vendorData.length) {
      setVendorData(vendorData);
      if (removeVendorData && removeVendorData.length > 0) {
        const removeDataArray = [];
        // eslint-disable-next-line array-callback-return
        removeVendorData.map((removeItem) => {
          // eslint-disable-next-line no-param-reassign
          const item = {
            id: removeItem && removeItem.id ? removeItem.id : '',
            vendor: removeItem && removeItem.vendor ? removeItem.vendor : '',
            date_end: removeItem && removeItem.date_end ? removeItem.date_end : '',
            date_start: removeItem && removeItem.date_start ? removeItem.date_start : '',
            price: removeItem && removeItem.price ? removeItem.price : '',
            name: removeItem && removeItem.name ? removeItem.name : '',
            isRemove: true,
          };
          removeDataArray.push(item);
        });
        setFieldValue('seller_ids', [...vendorData, ...removeDataArray]);
      } else {
        setFieldValue('seller_ids', vendorData);
      }
    }
  }, [vendorData, data]);

  let vendorOptions = [];
  if (vendorsInfo && vendorsInfo.loading) {
    vendorOptions = [{ name: 'Loading' }];
  }
  if (vendorsInfo && vendorsInfo.data) {
    vendorOptions = vendorsInfo.data;
  }
  if (vendorsInfo && vendorsInfo.err) {
    vendorOptions = [];
  }
  const onMinQuantityChange = (e, index) => {
    const newData = vendorTableData;
    // eslint-disable-next-line radix
    newData[index].min_qty = e.target.value ? parseInt(e.target.value) : '';
    setVendorData(newData);
    setData(Math.random());
  };

  const removeData = (e, index) => {
    const checkData = vendorTableData;
    const prevRemoveData = removeVendorData;
    setVendorRemoveData([...prevRemoveData, vendorTableData[index]]);
    const indexRemove = checkData.indexOf(checkData[index]);
    checkData.splice(indexRemove, 1);
    setVendorData(checkData);
    setData(Math.random());
  };

  const onDateStartChange = (e, index) => {
    const newData = vendorTableData;
    newData[index].date_start = e.target.value;
    setVendorData(newData);
    setData(Math.random());
  };

  const onDateEndChange = (e, index) => {
    const newData = vendorTableData;
    newData[index].date_end = e.target.value;
    setVendorData(newData);
    setData(Math.random());
  };

  const onPriceChange = (e, index) => {
    const newData = vendorTableData;
    // eslint-disable-next-line radix
    newData[index].price = e.target.value ? parseInt(e.target.value) : '';
    setVendorData(newData);
    setData(Math.random());
  };

  const onVendorChange = (value, index) => {
    const newData = vendorTableData;
    if (newData[index]) {
      newData[index].name = value.id ? value.id : '';
      newData[index].value = value;
      newData[index].newName = value.name;
      setVendorData(newData);
    }
    setData(Math.random());
  };

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getVendorsList(companies, appModels.PARTNER, 100, 0));
    }
  }, [userInfo]);

  useEffect(() => {
    if (sellerIdsInfo && sellerIdsInfo.data && sellerIdsInfo.data.length) {
      const array = vendorTableInfo;
      // eslint-disable-next-line array-callback-return
      sellerIdsInfo.data.map((sellerData) => {
        const obj = {
          id: sellerData.id,
          name: sellerData.name,
          date_end: sellerData.date_end,
          date_start: sellerData.date_start,
          min_qty: sellerData.min_qty,
          price: sellerData.price,
          newName: sellerData.name && sellerData.name.length ? sellerData.name[1] : '',
        };
        array.push(obj);
      });
      setVendorData(array);
      setFieldValue('seller_ids', array);
      setData(Math.random());
      dispatch(clearSellerIdsInfo());
    }
  }, [sellerIdsInfo]);

  useEffect(() => {
    if (vendorData && vendorData.length) {
      dispatch(setTableData(vendorData));
    }
  }, [vendorData, data]);

  useEffect(() => {
    setData(Math.random());
  }, []);

  useEffect(() => {
    if (vendorTableInfo && vendorTableInfo.length) {
      setVendorTableData(vendorTableInfo);
    }
  }, [vendorTableInfo, data]);

  const getMaxDate = (startDate) => {
    const date = new Date(startDate);
    const value = date.setDate(date.getDate() + 1);
    const maxDate = new Date(value);
    return maxDate;
  };

  return (
    <Row>
      <Col xs={12} sm={12} md={12} lg={12} className="mb-2">
        <Row className="ml-3">
          <h5>Vendors</h5>
          <div aria-hidden="true" className="font-weight-800 ml-3 text-lightblue cursor-pointer" onClick={addVendor}>
            <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
            <span className="mr-5">Add</span>
          </div>
          {(getRequiredMessageProductVendor(vendorTableData)) && (
            <div className="text-danger text-center d-inline font-11 font-weight-800">
              {getRequiredMessageProductVendor(vendorTableData)}
            </div>
          )}
        </Row>
        <Table responsive className="mx-2">
          <thead>
            <tr>
              <th className="p-2 min-width-200 border-0">
                Vendor
                <span className="ml-1 text-danger">*</span>
              </th>
              <th className="p-2 min-width-200 border-0">
                Minimal Quantity
                <span className="ml-1 text-danger">*</span>
              </th>
              <th className="p-2 min-width-100 border-0">
                Price
                <span className="ml-1 text-danger">*</span>
              </th>
              <th className="p-2 min-width-100 border-0">
                Start Date
              </th>
              <th className="p-2 min-width-100 border-0">
                End Date
              </th>
            </tr>
          </thead>
          <tbody>
            {vendorTableData && vendorTableData.length === 0 && (
              <tr>
                <td colSpan="8" className="text-left" />
              </tr>
            )}
            {vendorTableData && vendorTableData.length > 0 && vendorTableData.map((vendor, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <tr key={index}>
                <td>
                  <FormikAutocomplete
                    name="vendor"
                    label=""
                    formGroupClassName=" min-width-200"
                    labelClassName="font-weight-600"
                    open={vendorOpen === index}
                    onOpen={() => {
                      setVendorOpen(index);
                    }}
                    onClose={() => {
                      setVendorOpen('');
                    }}
                    value={vendor.value && vendor.value.name ? vendor.value.name : vendor.name && vendor.name.length ? vendor.name[1] : vendor.newName}
                    getOptionSelected={(option, value) => option.name === value.name}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                    options={vendorOptions}
                    onChange={(e, vendorItem) => onVendorChange(vendorItem, index)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        className="without-padding"
                        placeholder="Search and Select"
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
                </td>
                <td className="pt-3">
                  <Input type="input" name="product_qty" className="mt-3" value={vendor.min_qty} onChange={(e) => onMinQuantityChange(e, index)} />
                </td>
                <td className="pt-3">
                  <Input
                    type="input"
                    name="price"
                    className="mt-3"
                    value={vendor.price}
                    onKeyPress={decimalKeyPress}
                    onChange={(e) => onPriceChange(e, index)}
                  />
                </td>
                <td className="pt-3">
                  <Input type="date" name="date_start" className="mt-3" value={vendor.date_start} onChange={(e) => onDateStartChange(e, index)} min={moment(new Date()).format('YYYY-MM-DD')} />
                </td>
                <td className="pt-3">
                  <Input
                    type="date"
                    name="date_end"
                    disabled={!vendor.date_start}
                    className="mt-3"
                    value={vendor.date_end}
                    onChange={(e) => onDateEndChange(e, index)}
                    min={moment(new Date(getMaxDate(vendor.date_start))).format('YYYY-MM-DD')}
                  />
                </td>
                <td className="pt-3">
                  <span className="font-weight-400 d-inline-block" />
                  <FontAwesomeIcon className="mr-1 ml-1 mt-4 cursor-pointer" size="sm" icon={faTrashAlt} onClick={(e) => { removeData(e, index); }} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
};
PurchaseForm.propTypes = {
  setFieldValue: PropTypes.func.isRequired,
};

export default PurchaseForm;
