/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Table,
  Col,
  Row,
  Card,
  CardBody,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import {
  Input, FormControl,
} from '@material-ui/core';
import { Tooltip } from 'antd';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import {
  Dialog, DialogContent,
} from '@mui/material';

import plusCircleMiniIcon from '@images/icons/plusCircleBlue.svg';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';

import { getPartsData, getLocationProducts, getLocationProductsCount } from '../../../../../../preventiveMaintenance/ppmService';
import {
  getDefaultNoValue, getPagesCountV2, extractTextObject, numToFloat,
  getColumnArrayByIdWithArray, getListOfModuleOperations,
} from '../../../../../../util/appUtils';
import AddProduct from '../../../../../products/addProductMini';
import {
  clearAddProduct, clearTaxesInfo, clearTableData,
} from '../../../../../purchaseService';
import actionCodes1 from '../../../../../../inventory/data/actionCodes.json';
import DialogHeader from '../../../../../../commonComponents/dialogHeader';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const SearchModalProduct = (props) => {
  const {
    afterReset,
    locationId,
    stockType,
    arrayValues,
    arrayIndex,
    productKeyword,
    setProductKeyword,
    code,
    productCategory,
  } = props;
  const limit = 50;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [selectedId, setSelected] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [isSearch, setSearch] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [modalHead, setModalHead] = useState('');

  console.log(productCategory);

  const { locationProducts, locationProductsCount } = useSelector((state) => state.ppm);

  const { userRoles } = useSelector((state) => state.user);

  const allowedOperations1 = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inventory', 'code');

  const isProductCreatable = allowedOperations1.includes(actionCodes1['Add Product']);

  const { addProductInfo } = useSelector((state) => state.purchase);

  function getType() {
    let res = false;
    if (code === 'outgoing') {
      res = 'outward';
    } else if (code === 'internal') {
      res = 'material_req';
    } else if (code === 'incoming') {
      res = 'Inward';
    }
    return res;
  }

  useEffect(() => {
    if (locationId) {
      let domains = false;
      if (!stockType) {
        domains = '[["purchase_ok","=",true],["active","=",true],["is_pantry_item","!=",true]';
        if (productCategory) {
          domains = `${domains},["categ_id","=",${productCategory}]`;
        }
        if (searchValue) {
          domains = `${domains},"|",["name","ilike","${searchValue}"],["unique_code","ilike","${searchValue}"]`;
        }
        domains = `${domains}]`;
      }
      dispatch(getLocationProducts(locationId, searchValue, offset, limit, getType(), domains, false, productCategory));
    }
  }, [locationId, offset, isSearch]);

  useEffect(() => {
    if (locationId) {
      let domains = false;
      if (!stockType) {
        domains = '[["purchase_ok","=",true],["active","=",true],["is_pantry_item","!=",true]';
        if (productCategory) {
          domains = `${domains},["categ_id","=",${productCategory}]`;
        }
        if (searchValue) {
          domains = `${domains},"|",["name","ilike","${searchValue}"],["unique_code","ilike","${searchValue}"]`;
        }
        domains = `${domains}]`;
      }
      dispatch(getLocationProductsCount(locationId, searchValue, getType(), domains, productCategory));
    }
  }, [locationId, isSearch]);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setPage(index);
    setOffset(offsetValue);
  };

  const onSearchChange = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value.length < 2 && e.key === 'Backspace') {
      setSearchValue('');
      setSearch(Math.random());
    }
    if (e.key === 'Enter') {
      setSearch(Math.random());
      setPage(0);
      setOffset(0);
    }
  };

  const onModalOpen = () => {
    setAddModal(true);
    const listName = 'Add Product';
    setModalHead(listName);
  };

  const onModalClose = () => {
    setAddModal(false);
    let domains = false;
    if (!stockType) {
      domains = '[["purchase_ok","=",true],["active","=",true],["is_pantry_item","!=",true]';
      if (productCategory) {
        domains = `${domains},["categ_id","=",${productCategory}]`;
      }
      if (searchValue) {
        domains = `${domains},"|",["name","ilike","${searchValue}"],["unique_code","ilike","${searchValue}"]`;
      }
      domains = `${domains}]`;
    }
    dispatch(getLocationProducts(locationId, searchValue, offset, limit, getType(), domains, false, productCategory));
    dispatch(getLocationProductsCount(locationId, searchValue, getType(), domains, productCategory));
  };

  const onProductClose = () => {
    dispatch(clearAddProduct());
    dispatch(clearTableData());
    dispatch(clearTaxesInfo());
  };

  const handleRowClick = (data) => {
    if (stockType || (!stockType && data.qty_on_hand)) {
      setSelected(data.id);
      if (arrayValues && arrayValues.length > 0 && arrayIndex >= 0) {
        const newData = arrayValues;
        newData[arrayIndex].product_id = data ? [data.id, data.name, parseFloat(data.qty_on_hand)] : [];
        newData[arrayIndex].product_uom = data && data.parts_uom && data.parts_uom.id ? [data.parts_uom.id, data.parts_uom.name] : [];
        dispatch(getPartsData(newData));
      }
      if (afterReset) afterReset();
    }
  };

  function isProductExists(id, qty) {
    let isAllowed = true;
    const ids = getColumnArrayByIdWithArray(arrayValues && arrayValues.length > 0 ? arrayValues : [], 'product_id');
    if (ids && (ids.indexOf(id) !== -1)) {
      isAllowed = false;
    }
    /* if (!stockType && !qty) {
      isAllowed = false;
    } */
    return isAllowed;
  }

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      if (isProductExists(assetData[i].id, assetData[i].qty_on_hand)) {
        tableTr.push(
          <tr style={!stockType && !assetData[i].qty_on_hand ? { backgroundColor: 'rgb(198 204 208)', cursor: 'unset' } : {}} className={selectedId === assetData[i].id ? 'text-info cursor-pointer' : 'cursor-pointer'} onClick={() => handleRowClick(assetData[i])} key={i}>
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].name)}</span></td>
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].unique_code)}</span></td>
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].brand)}</span></td>
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(extractTextObject(assetData[i].category))}</span></td>
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(extractTextObject(assetData[i].parts_uom))}</span></td>
            <td className="p-2"><span className="font-weight-400">{numToFloat(assetData[i].qty_on_hand)}</span></td>
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].specification)}</span></td>
          </tr>,
        );
      }
    }
    return tableTr;
  }

  const loading = (locationProducts && locationProducts.loading) || (locationProductsCount && locationProductsCount.loading);
  const existsProducts = getColumnArrayByIdWithArray(arrayValues && arrayValues.length > 0 ? arrayValues : [], 'product_id');
  let totalDataCount = locationProductsCount && locationProductsCount.data ? locationProductsCount.data : 0;
  // const validData = locationProductsCount && locationProductsCount.data && locationProductsCount.data.length ? locationProductsCount.data.data.filter((item) => (item.qty_on_hand)) : [];
  // const validDataCount = locationProductsCount && locationProductsCount.data && locationProductsCount.data.length ? locationProductsCount.data.data.filter((item) => (!item.qty_on_hand)).length : 0;

  const existsCount = existsProducts ? existsProducts.length : 0;
  /* if (!stockType) {
    existsCount += validDataCount;
  } */

  if (totalDataCount > existsCount) {
    totalDataCount = parseInt(totalDataCount) - parseInt(existsCount);
  } else if (existsCount > totalDataCount) {
    totalDataCount = parseInt(existsCount) - parseInt(totalDataCount);
  } else if (totalDataCount === existsCount) {
    totalDataCount = 0;
  }

  const pages = getPagesCountV2(totalDataCount, limit);

  return (
    <Row>
      <Col sm="12" md="12" lg="12" xs="12">
        <Card className="p-2 bg-lightblue h-100">
          <CardBody className="bg-color-white p-1 m-0">
            <Row className="pl-2 pr-2 pb-2 pt-0">
              <Col sm="12" md="7" lg="7" xs="12">
                <div className="mt-3">
                  <span className="p-0 font-weight-600 font-medium mr-2">
                    Total :
                    {' '}
                    {totalDataCount}
                  </span>
                </div>
              </Col>
              <Col sm="12" md="5" lg="5" xs="12" className="text-right">
                {isProductCreatable && stockType && (
                  <Tooltip title="Add Product" placement="top">
                    <img
                      aria-hidden="true"
                      id="Add"
                      alt="Add"
                      className="cursor-pointer mr-3 mt-2"
                      onClick={() => onModalOpen()}
                      src={plusCircleMiniIcon}
                    />
                  </Tooltip>
                )}
                <FormControl variant="standard">
                  <Input
                    id="standard-adornment-password"
                    type="text"
                    name="search"
                    className="mt-0"
                    placeholder="Search"
                    value={searchValue}
                    onChange={onSearchChange}
                    onKeyDown={onSearchChange}
                    endAdornment={(
                      <InputAdornment position="end">
                        {searchValue && (
                          <>
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => {
                                setSearchValue('');
                                setSearch(Math.random());
                                setPage(1);
                                setOffset(0);
                              }}
                            >
                              <BackspaceIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={() => {
                                setSearch(Math.random());
                                setPage(1);
                                setOffset(0);
                              }}
                            >
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          </>
                        )}
                      </InputAdornment>
                    )}
                  />
                </FormControl>
              </Col>
            </Row>
            <Row className="pl-2 pr-2 pb-2 pt-0">
              <Col sm="12" md="12" lg="12" xs="12">
                <span className="text-info font-weight-800">Quantity shown here excludes Requested Undelivered Products.</span>
              </Col>
            </Row>
            <div className="pl-1 pr-1 pt-0 comments-list thin-scrollbar">
              {(locationProducts && locationProducts.data) && (
                <Table responsive>
                  <thead className="bg-gray-light">
                    <tr>
                      <th className="p-2 min-width-100">
                        Product Name
                      </th>
                      <th className="p-2 min-width-100">
                        Product Code
                      </th>
                      <th className="p-2 min-width-100">
                        Product Brand
                      </th>
                      <th className="p-2 min-width-100">
                        Product Category
                      </th>
                      <th className="p-2 min-width-100">
                        Product UOM
                      </th>
                      <th className="p-2 min-width-100">
                        Quantity on Hand
                      </th>
                      <th className="p-2 min-width-100">
                        Product Specification
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getRow(locationProducts && locationProducts.data ? locationProducts.data : [])}
                  </tbody>
                </Table>
              )}
            </div>
            {loading || pages === 0 ? (<span />) : (
              <div className={`${classes.root} float-right`}>
                <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />
              </div>
            )}
            {loading && (
              <Loader />
            )}
            {(locationProducts && locationProducts.err) && (
              <SuccessAndErrorFormat response={locationProducts} />
            )}
          </CardBody>
        </Card>
      </Col>
      <Dialog size={(addProductInfo && addProductInfo.data) ? 'sm' : 'xl'} open={addModal}>
        <DialogHeader title={modalHead} imagePath={false} onClose={() => { onModalClose(); onProductClose(); }} response={addProductInfo} sx={{ width: '500px' }} />
        <DialogContent>
          <AddProduct
            isTheme
            isModal
            productName={productKeyword}
            setProductKeyword={setProductKeyword}
            productCategoryId={productCategory}
            reset={() => { onModalClose(); onProductClose(); }}
          />
        </DialogContent>
      </Dialog>
    </Row>
  );
};

SearchModalProduct.propTypes = {
  arrayIndex: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]),
  afterReset: PropTypes.func.isRequired,
  arrayValues: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool,
    PropTypes.string,
  ]),
  locationId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  stockType: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
};

SearchModalProduct.defaultProps = {
  arrayValues: undefined,
  arrayIndex: undefined,
};

export default SearchModalProduct;
