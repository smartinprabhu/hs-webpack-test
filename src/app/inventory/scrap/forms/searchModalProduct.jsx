/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Table,
  Col,
  Row,
  Modal,
  ModalBody,
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

import plusCircleMiniIcon from '@images/icons/plusCircleBlue.svg';

import ModalHeaderComponent from '@shared/modalHeaderComponent';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';

import { getLocationProducts, getLocationProductsCount } from '../../../preventiveMaintenance/ppmService';
import {
  getDefaultNoValue, getPagesCountV2, extractTextObject, numToFloat,
  getListOfModuleOperations,
} from '../../../util/appUtils';
import AddProduct from '../../../purchase/products/addProductMini';
import {
  clearAddProduct, clearTaxesInfo, clearTableData,
} from '../../../purchase/purchaseService';
import actionCodes1 from '../../data/actionCodes.json';

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
    fieldName,
    setFieldValue,
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

  const { locationProducts, locationProductsCount } = useSelector((state) => state.ppm);

  const { userRoles } = useSelector((state) => state.user);

  const allowedOperations1 = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inventory', 'code');

  const isProductCreatable = allowedOperations1.includes(actionCodes1['Add Product']);

  const { addProductInfo } = useSelector((state) => state.purchase);

  useEffect(() => {
    if (locationId) {
      let domains = false;
      if (!stockType) {
        domains = '[["purchase_ok","=",true],["active","=",true],["is_pantry_item","!=",true]]';
        if (searchValue) {
          domains = `[["purchase_ok","=",true],["active","=",true],["is_pantry_item","!=",true],"|",["name","ilike","${searchValue}"],["unique_code","ilike","${searchValue}"]]`;
        }
      }
      dispatch(getLocationProducts(locationId, searchValue, offset, limit, 'Outward', domains));
    }
  }, [locationId, offset, isSearch]);

  useEffect(() => {
    if (locationId) {
      let domains = false;
      if (!stockType) {
        domains = '[["purchase_ok","=",true],["active","=",true],["is_pantry_item","!=",true]]';
        if (searchValue) {
          domains = `[["purchase_ok","=",true],["active","=",true],["is_pantry_item","!=",true],"|",["name","ilike","${searchValue}"],["unique_code","ilike","${searchValue}"]]`;
        }
      }
      dispatch(getLocationProductsCount(locationId, searchValue, 'Outward', domains));
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
      domains = '[["purchase_ok","=",true],["active","=",true],["is_pantry_item","!=",true]]';
      if (searchValue) {
        domains = `[["purchase_ok","=",true],["active","=",true],["is_pantry_item","!=",true],"|",["name","ilike","${searchValue}"],["unique_code","ilike","${searchValue}"]]`;
      }
    }
    dispatch(getLocationProducts(locationId, searchValue, offset, limit, 'Outward', domains));
    dispatch(getLocationProductsCount(locationId, searchValue, 'Outward', domains));
  };

  const onProductClose = () => {
    dispatch(clearAddProduct());
    dispatch(clearTableData());
    dispatch(clearTaxesInfo());
  };

  const handleRowClick = (data) => {
    if (stockType || (!stockType && data.qty_on_hand)) {
      setSelected(data.id);
      setFieldValue(fieldName, data);
      if (afterReset) afterReset();
    }
  };

  function isProductExists(id, qty) {
    const isAllowed = true;
    /* if (!stockType && !qty) {
       isAllowed = false;
     } */
    return isAllowed;
  }

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
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
    return tableTr;
  }

  const loading = (locationProducts && locationProducts.loading) || (locationProductsCount && locationProductsCount.loading);
  let totalDataCount = locationProductsCount && locationProductsCount.data ? locationProductsCount.data : 0;
  // const validData = locationProductsCount && locationProductsCount.data && locationProductsCount.data.length ? locationProductsCount.data.data.filter((item) => (item.qty_on_hand)) : [];
  /* const validDataCount = locationProducts && locationProducts.data && locationProducts.data.length && locationProducts.data.filter((item) => (item.qty_on_hand > 0));
  totalDataCount = validDataCount && validDataCount.length && validDataCount.length; */
  const existsCount = 0;

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
            <Row className="pl-2 pr-2 pb-0 pt-0">
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
                    placeholder="Search"
                    className="mt-0"
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
                                setPage(0);
                                setOffset(0);
                              }}
                            >
                              <BackspaceIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={() => {
                                setSearch(Math.random());
                                setPage(0);
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
      <Modal size={(addProductInfo && addProductInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={addModal}>
        <ModalHeaderComponent title={modalHead} imagePath={false} closeModalWindow={() => { onModalClose(); onProductClose(); }} response={addProductInfo} />
        <ModalBody className="pt-0 mt-0">
          <AddProduct
            isTheme
            isModal
            reset={() => { onModalClose(); onProductClose(); }}
          />
        </ModalBody>
      </Modal>
    </Row>
  );
};

SearchModalProduct.propTypes = {
  fieldName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  setFieldValue: PropTypes.func.isRequired,
  afterReset: PropTypes.func.isRequired,
  locationId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  stockType: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
};

export default SearchModalProduct;
