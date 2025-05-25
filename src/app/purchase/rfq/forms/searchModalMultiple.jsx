/* eslint-disable import/no-cycle */
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import {
  FormControl, Input,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import Pagination from '@material-ui/lab/Pagination';
import {
  Button,
  Dialog, DialogContent, DialogContentText,
} from '@mui/material';
import { Tooltip } from 'antd';
import * as PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardBody,
  Col,
  Modal, ModalBody,
  Row,
  Table,
} from 'reactstrap';

import plusCircleMiniIcon from '@images/icons/plusCircleBlue.svg';
import Loader from '@shared/loading';
import ModalFormAlert from '@shared/modalFormAlert';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import DialogHeader from '../../../commonComponents/dialogHeader';
import {
  getExtraSelectionMultiple, getExtraSelectionMultipleCount,
} from '../../../helpdesk/ticketService';
import AddOperationType from '../../../inventory/configuration/addOperationType';
import actionCodesOperation from '../../../inventory/data/actionCodes.json';
import {
  resetCreateOpType,
} from '../../../inventory/inventoryService';
import {
  extractTextObject,
  getDefaultNoValue,
  getListOfModuleOperations,
  getPagesCountV2,
} from '../../../util/appUtils';
import AddPurchaseAgreement from '../../purchaseAgreement/addPurchaseAgreement';
import actionCodesAgreement from '../../purchaseAgreement/data/actionCodes.json';
import {
  getAgreeStatusLabel,
} from '../../purchaseAgreement/utils/utils';
import AddPurchaseRequest from '../../purchaseRequest/addPurchaseRequest';
import actionCodesRequest from '../../purchaseRequest/data/actionCodes.json';
import { resetAddAgreementRequest, resetAddRequestInfo, resetAddVendorInfo } from '../../purchaseService';
// import AddVendor from '../../vendors/addVendor';
import AddVendor from '../../../adminSetup/siteConfiguration/addTenant/addCustomer';
import actionCodesVendor from '../../vendors/data/actionCodes.json';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const SearchModalMutliple = (props) => {
  const {
    modelName,
    afterReset,
    fieldName,
    fields,
    company,
    setFieldValue,
    otherFieldName,
    otherFieldValue,
  } = props;
  const limit = 50;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [selectedId, setSelected] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [addVendorModal, showAddVendorModal] = useState(false);
  const [addAgreeRequestModal, showAddAgreeRequestModal] = useState(false);
  const [addOperationModal, showAddOperationModal] = useState(false);
  const [addPurchaseRequestModal, showAddPurchaseRequestModal] = useState(false);
  const [isSearch, setSearch] = useState(false);
  const {
    addVendorInfo, addPurchaseRequestInfo, addPurchaseAgreementInfo,
  } = useSelector((state) => state.purchase);
  const { addOpTypeInfo } = useSelector((state) => state.inventory);
  const {
    createTenantinfo,
  } = useSelector((state) => state.setup);

  const {
    listDataMultipleInfo, listDataMultipleCountInfo, listDataMultipleCountLoading,
  } = useSelector((state) => state.ticket);

  const { userRoles } = useSelector((state) => state.user);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Purchase', 'code');
  const allowedOperationsInventory = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inventory', 'code');

  const isCreatableVendor = allowedOperations.includes(actionCodesVendor['Add vendors']);
  const isCreatableRequest = allowedOperations.includes(actionCodesRequest['Add Request']);
  const isCreatableAgreement = allowedOperations.includes(actionCodesAgreement['Add Agreements']);
  const isCreatableOperation = allowedOperationsInventory.includes(actionCodesOperation['Add Operation Type']);

  useEffect(() => {
    if (modelName && fields) {
      if (fieldName === 'partner_id' || fieldName === 'preferred_vendor') {
        const searchValueMultiple = `["&",["company_id","in",[${company}]], ["supplier", "=", true],"|","|",["email", "ilike", "${searchValue}"],["name", "ilike", "${searchValue}"],["mobile", "ilike", "${searchValue}"]]`;
        dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
      }
      if (fieldName === 'picking_type_id') {
        const searchValueMultiple = `["&",["id","!=",false],["code","ilike","incoming"],"|",["name", "ilike", "${searchValue}"],["warehouse_id", "ilike", "${searchValue}"]]`;
        dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
      }
      if (fieldName === 'requisition_id') {
        const searchValueMultiple = `[["company_id","in",[${company}]],["state","in", ["in_progress", "open", "ongoing"]],["${otherFieldName}", "in", [${otherFieldValue}]],"|","|","|",["name", "ilike", "${searchValue}"],["user_id", "ilike", "${searchValue}"],["type_id", "ilike", "${searchValue}"],["state", "ilike", "${searchValue}"]]`;
        dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
      }
      if (fieldName === 'request_id') {
        const searchValueMultiple = `[["company_id","in",[${company}]],"|","|","|",["requisition_name", "ilike", "${searchValue}"],["requestor_full_name", "ilike", "${searchValue}"],["site_contact_details", "ilike", "${searchValue}"],["requestor_email", "ilike", "${searchValue}"]]`;
        dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
      }
    }
  }, [modelName, offset, isSearch]);

  useEffect(() => {
    if (modelName && fields) {
      if ((addVendorInfo && addVendorInfo.data)) {
        const searchValueMultiple = `["&",["company_id","in",[${company}]], ["supplier", "=", true],"|","|",["email", "ilike", "${searchValue}"],["name", "ilike", "${searchValue}"],["mobile", "ilike", "${searchValue}"]]`;
        dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
        dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple));
      }
    }
  }, [addVendorInfo]);

  useEffect(() => {
    if (modelName && fields) {
      if ((addPurchaseAgreementInfo && addPurchaseAgreementInfo.data)) {
        const searchValueMultiple = `[["company_id","in",[${company}]],["state","in", ["in_progress", "open", "ongoing"]],["${otherFieldName}", "in", [${otherFieldValue}]],"|","|","|",["name", "ilike", "${searchValue}"],["user_id", "ilike", "${searchValue}"],["type_id", "ilike", "${searchValue}"],["state", "ilike", "${searchValue}"]]`;
        dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
        dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple));
      }
    }
  }, [addPurchaseAgreementInfo]);

  useEffect(() => {
    if (modelName && fields) {
      if ((addPurchaseRequestInfo && addPurchaseRequestInfo.data)) {
        const searchValueMultiple = `[["company_id","in",[${company}]],"|","|","|",["requisition_name", "ilike", "${searchValue}"],["requestor_full_name", "ilike", "${searchValue}"],["site_contact_details", "ilike", "${searchValue}"],["requestor_email", "ilike", "${searchValue}"]]`;
        dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
        dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple));
      }
    }
  }, [addPurchaseRequestInfo]);

  useEffect(() => {
    if (modelName && fields) {
      if ((addOpTypeInfo && addOpTypeInfo.data)) {
        const searchValueMultiple = `["&",["id","!=",false], ["code","ilike","incoming"],"|",["name", "ilike", "${searchValue}"],["warehouse_id", "ilike", "${searchValue}"]]`;
        dispatch(getExtraSelectionMultiple(company, modelName, limit, offset, fields, searchValueMultiple));
        dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple));
      }
    }
  }, [addOpTypeInfo]);

  useEffect(() => {
    if (modelName && fields) {
      if ((fieldName === 'partner_id' || fieldName === 'preferred_vendor')) {
        const searchValueMultiple = `["&",["company_id","in",[${company}]],["supplier", "=", true],"|","|",["email", "ilike", "${searchValue}"],["name", "ilike", "${searchValue}"],["mobile", "ilike", "${searchValue}"]]`;
        dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple));
      }
      if (fieldName === 'picking_type_id') {
        const searchValueMultiple = `["&",["id","!=",false], ["code","ilike","incoming"],"|",["name", "ilike", "${searchValue}"],["warehouse_id", "ilike", "${searchValue}"]]`;
        dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple));
      }
      if (fieldName === 'requisition_id') {
        let searchValueMultiple = '';
        if (otherFieldName === '') {
          searchValueMultiple = `[["company_id","in",[${company}]],["state","in", ["in_progress", "open", "ongoing"]],["name", "ilike", "${searchValue}"],"|","|","|",["name", "ilike", "${searchValue}"],["user_id", "ilike", "${searchValue}"],["type_id", "ilike", "${searchValue}"],["state", "ilike", "${searchValue}"]]`;
        } else {
          searchValueMultiple = `[["company_id","in",[${company}]],["state","in", ["in_progress", "open", "ongoing"]],["${otherFieldName}", "in", [${otherFieldValue}]],"|","|","|",["name", "ilike", "${searchValue}"],["user_id", "ilike", "${searchValue}"],["type_id", "ilike", "${searchValue}"],["state", "ilike", "${searchValue}"]]`;
        }
        dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple));
      }
      if (fieldName === 'request_id') {
        const searchValueMultiple = `[["company_id","in",[${company}]],"|","|","|",["requisition_name", "ilike", "${searchValue}"],["requestor_full_name", "ilike", "${searchValue}"],["site_contact_details", "ilike", "${searchValue}"],["requestor_email", "ilike", "${searchValue}"]]`;
        dispatch(getExtraSelectionMultipleCount(company, modelName, fields, searchValueMultiple));
      }
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
    let items = '';
    if (fieldName === 'request_id') {
      items = { id: data.id, display_name: data.display_name };
    } else {
      items = { id: data.id, name: data.name };
    }
    setFieldValue(fieldName, items);
    if (afterReset) afterReset();
  };

  const addVendorWindow = () => {
    showAddVendorModal(true);
  };

  const onReset = () => {
    dispatch(resetAddVendorInfo());
    dispatch(resetAddRequestInfo());
    dispatch(resetAddAgreementRequest());
  };

  const onOpTypeClose = () => {
    dispatch(resetCreateOpType());
  };

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr className={selectedId === assetData[i].id ? 'text-info cursor-pointer' : 'cursor-pointer'} onClick={() => handleRowClick(assetData[i])} key={i}>
          {fieldName !== 'request_id' && (
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].name)}</span></td>
          )}
          {fieldName === 'requisition_id' && (
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(extractTextObject(assetData[i].user_id))}</span></td>
          )}
          {fieldName === 'requisition_id' && (
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(extractTextObject(assetData[i].type_id))}</span></td>
          )}
          {fieldName === 'requisition_id' && (
            <td className="p-2"><span className="font-weight-400">{getAgreeStatusLabel(assetData[i].state)}</span></td>
          )}
          {fieldName === 'request_id' && (
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].requisition_name)}</span></td>
          )}
          {fieldName === 'request_id' && (
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].requestor_id)}</span></td>
          )}
          {fieldName === 'request_id' && (
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].site_spoc)}</span></td>
          )}
          {fieldName === 'request_id' && (
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].site_contact_details)}</span></td>
          )}
          {fieldName === 'request_id' && (
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].requestor_email)}</span></td>
          )}
          {fieldName === 'request_id' && (
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].bill_to_address)}</span></td>
          )}
          {(fieldName === 'partner_id' || fieldName === 'preferred_vendor') && (
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].email)}</span></td>
          )}
          {(fieldName === 'partner_id' || fieldName === 'preferred_vendor') && (
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].mobile)}</span></td>
          )}
          {fieldName === 'picking_type_id' && (
            <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(assetData[i].warehouse_id ? assetData[i].warehouse_id[1] : '')}</span></td>
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
                    {!listDataMultipleInfo.loaading && (listDataMultipleInfo && listDataMultipleInfo.data) && (totalDataCount)}
                  </span>
                </div>
              </Col>
              <Col sm="12" md="5" lg="5" xs="12" className="text-right">
                {isCreatableVendor && (fieldName === 'partner_id' || fieldName === 'preferred_vendor') && (
                  <Tooltip title="Add" placement="top">
                    <img
                      aria-hidden="true"
                      id="Add"
                      alt="Add"
                      className="cursor-pointer mr-3 mt-2"
                      onClick={addVendorWindow}
                      src={plusCircleMiniIcon}
                    />
                  </Tooltip>
                )}
                {isCreatableAgreement && fieldName === 'requisition_id' && (
                  <Tooltip title="Add" placement="top">
                    <img
                      aria-hidden="true"
                      id="Add"
                      alt="Add"
                      className="cursor-pointer mr-3 mt-2"
                      onClick={() => {
                        showAddAgreeRequestModal(true);
                      }}
                      src={plusCircleMiniIcon}
                    />
                  </Tooltip>
                )}
                {isCreatableRequest && fieldName === 'request_id' && (
                  <Tooltip title="Add" placement="top">
                    <img
                      aria-hidden="true"
                      id="Add"
                      alt="Add"
                      className="cursor-pointer mr-3 mt-2"
                      onClick={() => {
                        showAddPurchaseRequestModal(true);
                      }}
                      src={plusCircleMiniIcon}
                    />
                  </Tooltip>
                )}
                {isCreatableOperation && fieldName === 'picking_type_id' && (
                  <Tooltip title="Add" placement="top">
                    <img
                      aria-hidden="true"
                      id="Add"
                      alt="Add"
                      className="cursor-pointer mr-3 mt-2"
                      onClick={() => {
                        showAddOperationModal(true);
                      }}
                      src={plusCircleMiniIcon}
                    />
                  </Tooltip>
                )}
                <FormControl variant="standard">
                  <Input
                    id="standard-adornment-password"
                    type="text"
                    name="search"
                    placeholder="search"
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
              {(listDataMultipleInfo && listDataMultipleInfo.data) && (
                <Table responsive>
                  <thead className="bg-gray-light">
                    <tr>
                      {fieldName !== 'request_id' && (
                        <th className="p-2 min-width-100">
                          Name
                        </th>
                      )}
                      {fieldName === 'requisition_id' && (
                        <th className="p-2 min-width-200">
                          Purchase Representative
                        </th>
                      )}
                      {fieldName === 'requisition_id' && (
                        <th className="p-2 min-width-200">
                          Agreement Type
                        </th>
                      )}
                      {fieldName === 'requisition_id' && (
                        <th className="p-2 min-width-100">
                          Status
                        </th>
                      )}
                      {fieldName === 'request_id' && (
                        <th className="p-2 min-width-200">
                          Requision Purpose
                        </th>
                      )}
                      {fieldName === 'request_id' && (
                        <th className="p-2 min-width-200">
                          Requestor Name
                        </th>
                      )}
                      {fieldName === 'request_id' && (
                        <th className="p-2 min-width-100">
                          Site Spoc
                        </th>
                      )}
                      {fieldName === 'request_id' && (
                        <th className="p-2 min-width-200">
                          Site Contact Details
                        </th>
                      )}
                      {fieldName === 'request_id' && (
                        <th className="p-2 min-width-100">
                          Email
                        </th>
                      )}
                      {fieldName === 'request_id' && (
                        <th className="p-2 min-width-100">
                          Billing Address
                        </th>
                      )}
                      {(fieldName === 'partner_id' || fieldName === 'preferred_vendor') && (
                        <th className="p-2 min-width-100">
                          Email ID
                        </th>
                      )}
                      {(fieldName === 'partner_id' || fieldName === 'preferred_vendor') && (
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
      <Dialog size={(addVendorInfo && addVendorInfo.data) ? 'sm' : 'xl'} fullWidth={!((createTenantinfo && createTenantinfo.data))} open={addVendorModal}>
        <DialogHeader title="Add Vendor" imagePath={false} onClose={() => { showAddVendorModal(false); onReset(); }} response={createTenantinfo} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AddVendor
              setFieldValue={setFieldValue}
              requestorName=""
              updateField="vendor_id"
              type="vendor"
              afterReset={() => { showAddVendorModal(false); onReset(); }}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Modal
        size={(addPurchaseRequestInfo && addPurchaseRequestInfo.data) ? 'sm' : 'xl'}
        className="border-radius-50px modal-dialog-centered"
        isOpen={addPurchaseRequestModal}
      >
        <ModalHeaderComponent
          title="Add Purchase Request"
          imagePath={false}
          closeModalWindow={() => { showAddPurchaseRequestModal(false); onReset(); }}
          response={addPurchaseRequestInfo}
        />
        <ModalBody className="mt-0 pt-0">
          <AddPurchaseRequest
            editId={false}
            isTheme
            isModal
            afterReset={() => { showAddPurchaseRequestModal(false); onReset(); }}
          />
        </ModalBody>
      </Modal>
      <Modal size={(addPurchaseAgreementInfo && addPurchaseAgreementInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={addAgreeRequestModal}>
        <ModalHeaderComponent
          title="Add Purchase Agreement"
          imagePath={false}
          closeModalWindow={() => { showAddAgreeRequestModal(false); onReset(); }}
          response={addPurchaseAgreementInfo}
        />
        <ModalBody className="mt-0 pt-0">
          <AddPurchaseAgreement
            editId={false}
            isTheme
            isModal
            afterReset={() => { showAddAgreeRequestModal(false); onReset(); }}
          />
        </ModalBody>
      </Modal>
      {fieldName === 'picking_type_id' && (
        <Modal size={(addOpTypeInfo && addOpTypeInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={addOperationModal}>
          <ModalHeaderComponent title="Operation Types" imagePath={false} closeModalWindow={() => { showAddOperationModal(false); onOpTypeClose(); }} response={addOpTypeInfo} />
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
                  onClick={() => { showAddOperationModal(false); onOpTypeClose(); }}
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

SearchModalMutliple.propTypes = {
  modelName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  fieldName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  afterReset: PropTypes.func.isRequired,
  fields: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  otherFieldName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  otherFieldValue: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  company: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default SearchModalMutliple;
