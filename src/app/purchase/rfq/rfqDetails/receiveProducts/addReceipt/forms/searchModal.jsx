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
import Button from '@mui/material/Button';
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
import ModalFormAlert from '@shared/modalFormAlert';

import {
  getExtraSelection, getExtraSelectionCount,
} from '../../../../../../helpdesk/ticketService';
import { getPartsData } from '../../../../../../preventiveMaintenance/ppmService';
import {
  getDefaultNoValue, getPagesCountV2, extractTextObject, numToFloat,
  getColumnArrayByIdWithArray, extractValueObjects, getListOfModuleOperations,
} from '../../../../../../util/appUtils';
import customDataJson from '../../../../data/customData.json';
import AddPartner from '../../../../../../adminSetup/siteConfiguration/addTenant/addCustomer';
import AddProduct from '../../../../../products/addProductMini';
import {
  clearAddProduct, clearTaxesInfo, clearTableData,
} from '../../../../../purchaseService';
import {
  resetCreateLocation,
  resetCreateOpType,
} from '../../../../../../inventory/inventoryService';
import AddLocation from '../../../../../../inventory/configuration/addLocation';
import AddOperationType from '../../../../../../inventory/configuration/addOperationType';
import actionCodes from '../../../../../../adminSetup/data/actionCodes.json';
import actionCodes1 from '../../../../../../inventory/data/actionCodes.json';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const SearchModal = (props) => {
  const {
    modelName,
    afterReset,
    fieldName,
    fields,
    company,
    otherFieldName,
    otherFieldValue,
    srcLocation,
    destLocation,
    setFieldValue,
    arrayValues,
    arrayIndex,
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

  const {
    listDataInfo, listDataCountInfo, listDataCountLoading,
  } = useSelector((state) => state.ticket);

  const { userRoles } = useSelector((state) => state.user);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Admin Setup', 'code');
  const allowedOperations1 = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inventory', 'code');

  const isOpCreatable = false; // allowedOperations1.includes(actionCodes1['Add Operation Type']);

  const isLocCreatable = false;// allowedOperations1.includes(actionCodes1['Add Location']);

  const isProductCreatable = allowedOperations1.includes(actionCodes1['Add Product']);

  const { createTenantinfo } = useSelector((state) => state.setup);
  const { addProductInfo } = useSelector((state) => state.purchase);
  const { addLocationInfo, addOpTypeInfo } = useSelector((state) => state.inventory);

  useEffect(() => {
    if (modelName && fields) {
      dispatch(getExtraSelection(company, modelName, limit, offset, fields, searchValue, otherFieldName, otherFieldValue));
    }
  }, [modelName, offset, isSearch]);

  useEffect(() => {
    if (modelName) {
      dispatch(getExtraSelectionCount(company, modelName, searchValue, otherFieldName, otherFieldValue));
    }
  }, [modelName, isSearch]);

  const getType = (productType) => {
    if (productType && customDataJson && customDataJson.productTypeNames && customDataJson.productTypeNames[productType]) {
      return customDataJson.productTypeNames[productType].label;
    }
    return '-';
  };

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
    let listName = 'list';
    if (fieldName === 'picking_type_id') {
      listName = 'Add Operation Type';
    } else if (fieldName === 'partner_id') {
      listName = 'Add Vendor';
    } else if (fieldName === 'move_ids_without_package') {
      listName = 'Add Product';
    } else if (fieldName === 'location_id') {
      listName = 'Add Source Location';
    } else if (fieldName === 'location_dest_id') {
      listName = 'Add Destionation Location';
    }
    setModalHead(listName);
  };

  const onModalClose = () => {
    setAddModal(false);
    dispatch(getExtraSelectionCount(company, modelName, searchValue, otherFieldName, otherFieldValue));
    dispatch(getExtraSelection(company, modelName, limit, offset, fields, searchValue, otherFieldName, otherFieldValue));
  };

  const onProductClose = () => {
    dispatch(clearAddProduct());
    dispatch(clearTableData());
    dispatch(clearTaxesInfo());
  };

  const onLocationClose = () => {
    dispatch(resetCreateLocation());
  };

  const onOpTypeClose = () => {
    dispatch(resetCreateOpType());
  };

  const handleRowClick = (data) => {
    setSelected(data.id);
    if (arrayValues && arrayValues.length > 0 && arrayIndex >= 0) {
      const newData = arrayValues;
      newData[arrayIndex].product_id = [data.id, data.name];
      newData[arrayIndex].name = data.name;
      newData[arrayIndex].product_id_ref = data ? data.id : '';
      newData[arrayIndex].product_uom = data && data.uom_id ? [data.uom_id[0], data.uom_id[1]] : [];
      newData[arrayIndex].product_uom_ref = data && data.uom_id ? data.uom_id[0] : '';
      dispatch(getPartsData(newData));
    } else if (fieldName === 'picking_type_id') {
      const items = {
        id: data.id, name: data.name, default_location_src_id: data.default_location_src_id, default_location_dest_id: data.default_location_dest_id,
      };
      setFieldValue(fieldName, items);
    } else {
      const items = { id: data.id, name: data.name };
      setFieldValue(fieldName, items);
      if (fieldName === 'location_id') {
        setFieldValue('location_dest_id', '');
      }
    }
    if (afterReset) afterReset();
  };

  function isProductExists(id) {
    let isAllowed = true;
    if (fieldName === 'move_ids_without_package') {
      const ids = getColumnArrayByIdWithArray(arrayValues && arrayValues.length > 0 ? arrayValues : [], 'product_id');
      if (ids && (ids.indexOf(id) !== -1)) {
        isAllowed = false;
      }
    }
    if (fieldName === 'location_id') {
      const ids = destLocation ? extractValueObjects(destLocation) : false;
      if (ids === id) {
        isAllowed = false;
      }
    }
    if (fieldName === 'location_dest_id') {
      const ids = srcLocation ? extractValueObjects(srcLocation) : false;
      if (ids === id) {
        isAllowed = false;
      }
    }
    return isAllowed;
  }

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      if (isProductExists(assetData[i].id)) {
        tableTr.push(
          <tr className={selectedId === assetData[i].id ? 'text-info cursor-pointer' : 'cursor-pointer'} onClick={() => handleRowClick(assetData[i])} key={i}>
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].name)}</span></td>
            {fieldName === 'move_ids_without_package' && (
              <td className="p-2"><span className="font-weight-400">{getType(assetData[i].type)}</span></td>
            )}
            {fieldName === 'move_ids_without_package' && (
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(extractTextObject(assetData[i].uom_id))}</span></td>
            )}
            {fieldName === 'move_ids_without_package' && (
              <td className="p-2"><span className="font-weight-400">{numToFloat(assetData[i].qty_available)}</span></td>
            )}
            {fieldName === 'partner_id' && (
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].email)}</span></td>
            )}
            {fieldName === 'partner_id' && (
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].mobile)}</span></td>
            )}
            {fieldName === 'picking_type_id' && (
              <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].warehouse_id ? assetData[i].warehouse_id[1] : '')}</span></td>
            )}
          </tr>,
        );
      }
    }
    return tableTr;
  }

  const loading = (listDataInfo && listDataInfo.loading) || (listDataCountLoading);
  const existsProducts = getColumnArrayByIdWithArray(arrayValues && arrayValues.length > 0 ? arrayValues : [], 'product_id');
  let totalDataCount = listDataCountInfo && listDataCountInfo.length ? listDataCountInfo.length : 0;
  if (fieldName === 'move_ids_without_package') {
    const existsCount = existsProducts ? existsProducts.length : 0;
    if (totalDataCount > existsCount) {
      totalDataCount = parseInt(totalDataCount) - parseInt(existsCount);
    } else if (existsCount > totalDataCount) {
      totalDataCount = parseInt(existsCount) - parseInt(totalDataCount);
    } else if (totalDataCount === existsCount) {
      totalDataCount = 0;
    }
  }
  if (fieldName === 'location_dest_id') {
    const ids = srcLocation ? extractValueObjects(srcLocation) : false;
    if (totalDataCount > 1 && ids) {
      totalDataCount = parseInt(totalDataCount) - 1;
    } else if (totalDataCount === 1 && ids) {
      totalDataCount = 0;
    }
  }

  if (fieldName === 'location_id') {
    const ids = destLocation ? extractValueObjects(destLocation) : false;
    if (totalDataCount > 1 && ids) {
      totalDataCount = parseInt(totalDataCount) - 1;
    } else if (totalDataCount === 1 && ids) {
      totalDataCount = 0;
    }
  }

  const pages = getPagesCountV2(totalDataCount, limit);

  const isAddVendor = allowedOperations.includes(actionCodes['Add Tenant']);

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
                    {!loading && totalDataCount}
                  </span>
                </div>
              </Col>
              <Col sm="12" md="5" lg="5" xs="12" className="text-right">
                {fieldName === 'partner_id' && isAddVendor && (
                  <Tooltip title="Add Vendor" placement="top">
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
                {fieldName === 'picking_type_id' && isOpCreatable && (
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
                )}
                {(fieldName === 'location_id' || fieldName === 'location_dest_id') && isLocCreatable && (
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
                )}
                {fieldName === 'move_ids_without_package' && isProductCreatable && (
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
                )}

                <FormControl variant="standard">
                  <Input
                    id="standard-adornment-password"
                    type="text"
                    name="search"
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

            <div className="pl-1 pr-1 pt-0 comments-list thin-scrollbar">
              {(listDataInfo && listDataInfo.data && !loading) && (
                <Table responsive>
                  <thead className="bg-gray-light">
                    <tr>
                      <th className="p-2 min-width-100">
                        {fieldName === 'move_ids_without_package' ? 'Product Name' : 'Name'}
                      </th>
                      {fieldName === 'move_ids_without_package' && (
                        <th className="p-2 min-width-100">
                          Product Type
                        </th>
                      )}
                      {fieldName === 'move_ids_without_package' && (
                        <th className="p-2 min-width-100">
                          Product UOM
                        </th>
                      )}
                      {fieldName === 'move_ids_without_package' && (
                        <th className="p-2 min-width-100">
                          Quantity on Hand
                        </th>
                      )}
                      {fieldName === 'partner_id' && (
                        <th className="p-2 min-width-100">
                          Email ID
                        </th>
                      )}
                      {fieldName === 'partner_id' && (
                        <th className="p-2 min-width-100">
                          Mobile
                        </th>
                      )}
                      {fieldName === 'picking_type_id' && (
                        <th className="p-2 min-width-100">
                          Warehouse
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {getRow(listDataInfo && listDataInfo.data ? listDataInfo.data : [])}
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
            {(listDataInfo && listDataInfo.err) && (
              <SuccessAndErrorFormat response={listDataInfo} />
            )}
          </CardBody>
        </Card>
      </Col>
      {fieldName === 'partner_id' && (
        <Modal size={(createTenantinfo && createTenantinfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={addModal}>
          <ModalHeaderComponent title={modalHead} imagePath={false} closeModalWindow={() => onModalClose()} response={createTenantinfo} />
          <ModalBody className="pt-0 mt-0">
            <AddPartner
              type="vendor"
              updateField="partner_id"
              setFieldValue={setFieldValue}
              afterReset={() => onModalClose()}
            />
          </ModalBody>
        </Modal>
      )}
      {fieldName === 'move_ids_without_package' && (
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
      {(fieldName === 'location_id' || fieldName === 'location_dest_id') && (
        <Modal size={(addLocationInfo && addLocationInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={addModal}>
          <ModalHeaderComponent title={modalHead} imagePath={false} closeModalWindow={() => { onModalClose(); onLocationClose(); }} response={addLocationInfo} />
          <ModalBody className="pt-0 mt-0">
            <AddLocation editId={false} isTheme />
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
      {fieldName === 'picking_type_id' && (
        <Modal size={(addOpTypeInfo && addOpTypeInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={addModal}>
          <ModalHeaderComponent title={modalHead} imagePath={false} closeModalWindow={() => { onModalClose(); onOpTypeClose(); }} response={addOpTypeInfo} />
          <ModalBody className="pt-0 mt-0">
            <AddOperationType editId={false} isTheme />
            <ModalFormAlert alertResponse={addOpTypeInfo} alertText="Operations Type added successfully.." />
            {addOpTypeInfo && addOpTypeInfo.data && (<hr />)}
            <div className="float-right">
              {addOpTypeInfo && addOpTypeInfo.data && (
                <Button
                  size="sm"
                  type="button"
                  variant="contained"
                  onClick={() => { onModalClose(); onOpTypeClose(); }}
                  disabled={addOpTypeInfo && addOpTypeInfo.loading}
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

SearchModal.propTypes = {
  modelName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  fieldName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  arrayIndex: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]),
  afterReset: PropTypes.func.isRequired,
  fields: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  arrayValues: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool,
    PropTypes.string,
  ]),
  company: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  otherFieldName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  otherFieldValue: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  srcLocation: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool,
    PropTypes.string,
  ]),
  destLocation: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool,
    PropTypes.string,
  ]),
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

SearchModal.defaultProps = {
  arrayValues: undefined,
  arrayIndex: undefined,
  srcLocation: undefined,
  destLocation: undefined,
};

export default SearchModal;
