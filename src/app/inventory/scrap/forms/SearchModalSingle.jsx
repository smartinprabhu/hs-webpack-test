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
  Modal,
  ModalBody,
} from 'reactstrap';
import Button from '@mui/material/Button';
import {
  Input, FormControl,
} from '@material-ui/core';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';


import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import ModalFormAlert from '@shared/modalFormAlert';

import {
  getExtraSelectionMultiple, getExtraSelectionMultipleCount,
} from '../../../helpdesk/ticketService';
import {
  getDefaultNoValue, getPagesCountV2, extractTextObject, numToFloat,
} from '../../../util/appUtils';
import customDataJson from '../../../purchase/rfq/data/customData.json';
import AddProduct from '../../../purchase/products/addProduct';
import {
  clearAddProduct, clearTaxesInfo, clearTableData,
} from '../../../purchase/purchaseService';
import {
  resetCreateLocation,
} from '../../inventoryService';
import AddLocation from '../../configuration/addLocation';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const SearchModalSingle = (props) => {
  const {
    modelName,
    fields,
    company,
    fieldName,
    placeholderName,
    afterReset,
    setFieldValue,
  } = props;
  const limit = 50;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [isSearch, setSearch] = useState(false);
  const [selectedId, setSelected] = useState('');

  const [addModal, setAddModal] = useState(false);
  const [modalHead, setModalHead] = useState('');

  const {
    listDataMultipleInfo, listDataMultipleCountInfo, listDataMultipleCountLoading,
  } = useSelector((state) => state.ticket);

  const { addProductInfo } = useSelector((state) => state.purchase);
  const { addLocationInfo } = useSelector((state) => state.inventory);

  useEffect(() => {
    if (modelName && fields) {
      let searchValueMultiple = '[';

      if (fieldName !== 'product_uom_id') {
        searchValueMultiple = `${searchValueMultiple}["company_id","in",[${company}]]`;
      }

      if (fieldName === 'product_id') {
        searchValueMultiple = `${searchValueMultiple},["type", "in", ["product"]],["qty_available",">",0],["is_pantry_item","=",false]`;
        if (searchValue) {
          searchValueMultiple = `${searchValueMultiple},"|","|",["name","ilike","${searchValue}"],["uom_id.name","ilike","${searchValue}"],["unique_code","ilike","${searchValue}"]`;
        }
      }

      if (searchValue && fieldName === 'product_uom_id') {
        searchValueMultiple = `[["name","ilike","${searchValue}"]`;
      }

      if (fieldName === 'location_id') {
        searchValueMultiple = `${searchValueMultiple},["usage","=","internal"]`;
        if (searchValue) {
          searchValueMultiple = `${searchValueMultiple},["name","ilike","${searchValue}"]`;
        }
      }

      if (fieldName === 'scrap_location_id') {
        searchValueMultiple = `${searchValueMultiple},["scrap_location","=",true]`;
        if (searchValue) {
          searchValueMultiple = `${searchValueMultiple},["name","ilike","${searchValue}"]`;
        }
      }

      searchValueMultiple = `${searchValueMultiple}]`;
      dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
    }
  }, [modelName, offset, isSearch]);

  useEffect(() => {
    if (modelName) {
      let searchValueMultiple = '[';

      if (fieldName !== 'product_uom_id') {
        searchValueMultiple = `${searchValueMultiple}["company_id","in",[${company}]]`;
      }

      if (fieldName === 'product_id') {
        searchValueMultiple = `${searchValueMultiple},["type", "in", ["product"]],["qty_available",">",0],["is_pantry_item","=",false]`;
        if (searchValue) {
          searchValueMultiple = `${searchValueMultiple},"|",["name","ilike","${searchValue}"],["uom_id.name","ilike","${searchValue}"]`;
        }
      }

      if (searchValue && fieldName === 'product_uom_id') {
        searchValueMultiple = `[["name","ilike","${searchValue}"]`;
      }

      if (fieldName === 'location_id') {
        searchValueMultiple = `${searchValueMultiple},["usage","=","internal"]`;
        if (searchValue) {
          searchValueMultiple = `${searchValueMultiple},["name","ilike","${searchValue}"]`;
        }
      }

      if (fieldName === 'scrap_location_id') {
        searchValueMultiple = `${searchValueMultiple},["scrap_location","=",true]`;
        if (searchValue) {
          searchValueMultiple = `${searchValueMultiple},["name","ilike","${searchValue}"]`;
        }
      }

      searchValueMultiple = `${searchValueMultiple}]`;
      dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple));
    }
  }, [modelName, isSearch]);

  const totalDataCount = listDataMultipleCountInfo && listDataMultipleCountInfo.length ? listDataMultipleCountInfo.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

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

  const handleRowClick = (data) => {
    setSelected(data.id);
    setFieldValue(fieldName, data);
    if (afterReset) afterReset();
  };

  const onModalOpen = () => {
    setAddModal(true);
    let listName = 'list';
    if (fieldName === 'scrap_location_id') {
      listName = 'Add Scrap Location';
    } else if (fieldName === 'product_id') {
      listName = 'Add Product';
    } else if (fieldName === 'location_id') {
      listName = 'Add Location';
    }
    setModalHead(listName);
  };

  const onModalClose = () => {
    setAddModal(false);
    setSearch(Math.random());
  };

  const onProductClose = () => {
    dispatch(clearAddProduct());
    dispatch(clearTableData());
    dispatch(clearTaxesInfo());
  };

  const onLocationClose = () => {
    dispatch(resetCreateLocation());
  };

  const getType = (productType) => {
    if (productType && customDataJson && customDataJson.productTypeNames && customDataJson.productTypeNames[productType]) {
      return customDataJson.productTypeNames[productType].label;
    }
    return '-';
  };

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr className={selectedId === assetData[i].id ? 'text-info cursor-pointer' : 'cursor-pointer'} onClick={() => handleRowClick(assetData[i])} key={i}>
          <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].name)}</span></td>
          {fieldName === 'product_id' && (
            <>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].unique_code)}</span></td>
              <td className="p-2"><span className="font-weight-400">{numToFloat(assetData[i].qty_available)}</span></td>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].brand)}</span></td>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(extractTextObject(assetData[i].categ_id))}</span></td>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(extractTextObject(assetData[i].uom_id))}</span></td>
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].specification)}</span></td>
            </>
          )}
        </tr>,
      );
    }
    return tableTr;
  }

  const loading = (listDataMultipleInfo && listDataMultipleInfo.loading) || (listDataMultipleCountLoading);

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
                { /* fieldName !== 'product_uom_id' && (
                <Tooltip title="Add" placement="top">
                  <img
                    aria-hidden="true"
                    id="Add"
                    alt="Add"
                    className="cursor-pointer mr-3 mt-2"
                    onClick={() => onModalOpen()}
                    src={plusCircleMiniIcon}
                  />
                </Tooltip>
                ) */ }
                <FormControl variant="standard">
                  <Input
                    id="standard-adornment-password"
                    type="text"
                    name="search"
                    placeholder={placeholderName}
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
              {(listDataMultipleInfo && listDataMultipleInfo.data) && (
                <Table responsive>
                  <thead className="bg-gray-light">
                    <tr>
                      <th className="p-2 min-width-100">
                        {fieldName === 'product_id' ? 'Product Name' : 'Name'}
                      </th>
                      {fieldName === 'product_id' && (
                        <>
                          <th className="p-2 min-width-100">
                            Product Code
                          </th>
                          <th className="p-2 min-width-160">
                            Quantity on Hand
                          </th>
                          <th className="p-2 min-width-160">
                            Product Brand
                          </th>
                          <th className="p-2 min-width-160">
                            Product Category
                          </th>
                          <th className="p-2 min-width-160">
                            Product UOM
                          </th>
                          <th className="p-2 min-width-160">
                            Product Specification
                          </th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {getRow(listDataMultipleInfo && listDataMultipleInfo.data ? listDataMultipleInfo.data : [])}
                  </tbody>
                </Table>
              )}
            </div>
            {loading || pages === 0 ? (<span />) : (
              <div className={`${classes.root} float-right`}>
                <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />
              </div>
            )}
            {listDataMultipleInfo && listDataMultipleInfo.loading && (
              <Loader />
            )}
            {(listDataMultipleInfo && listDataMultipleInfo.err) && (
              <SuccessAndErrorFormat response={listDataMultipleInfo} />
            )}
          </CardBody>
        </Card>
      </Col>
      {fieldName === 'product_id' && (
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
      )}
      {(fieldName === 'location_id' || fieldName === 'scrap_location_id') && (
        <Modal size={(addLocationInfo && addLocationInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={addModal}>
          <ModalHeaderComponent title={modalHead} imagePath={false} closeModalWindow={() => { onModalClose(); onLocationClose(); }} response={addLocationInfo} />
          <ModalBody className="pt-0 mt-0">
            <AddLocation editId={false} isTheme isModal />
            <ModalFormAlert alertResponse={addLocationInfo} alertText="Location added successfully.." />
            {addLocationInfo && addLocationInfo.data && (<hr />)}
            <div className="float-right">
              {addLocationInfo && addLocationInfo.data && (
                <Button
                  size="sm"
                  type="button"
                   variant="contained"
                  onClick={() => { onModalClose(); onLocationClose(); }}
                  disabled={addLocationInfo && addLocationInfo.loading}
                >
                  OK
                </Button>
              )}
            </div>
          </ModalBody>
        </Modal>
      )}
    </Row>
  );
};

SearchModalSingle.propTypes = {
  modelName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  fields: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  company: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  fieldName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  afterReset: PropTypes.func.isRequired,
  placeholderName: PropTypes.string.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};

export default SearchModalSingle;
