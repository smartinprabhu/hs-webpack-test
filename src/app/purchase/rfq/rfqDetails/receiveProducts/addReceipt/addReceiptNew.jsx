/* eslint-disable max-len */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import {
  Col, Row,
} from 'reactstrap';
import { Formik, Form } from 'formik';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import moment from 'moment';
import { Button, Box } from '@mui/material';

import Loader from '@shared/loading';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';

import incomingIcon from '@images/icons/incomingStock.svg';
import outcomingIcon from '@images/icons/outgoingStock.svg';
import transferIcon from '@images/transfers.svg';

import BasicForm from './forms/basicFormNew';
import ProductsForm from './forms/productsForm';
import ProductUpdateForm from './forms/productUpdateForm';
import ProductsInventory from './forms/productsInventory';
import AdditionalForm from './forms/additionalForm';
import validationSchema from './formModel/validationSchema';
import validationSchemaInternal from './formModel/validationSchemaInternal';
import checkoutFormModel from './formModel/checkoutFormModel';
import formInitialValues from './formModel/formInitialValues';
import {
  createReceipt,
  updateReceipt, updateRfq,
  resetUpdateRfqInfo,
  getTransferDetail,
  getTransferFilters,
  updateTransferNoStatus,
} from '../../../../purchaseService';
import { setCurrentTab } from '../../../../../inventory/inventoryService';
import {
  resetCreateTenant,
} from '../../../../../adminSetup/setupService';
import { getPartsData } from '../../../../../preventiveMaintenance/ppmService';
import {
  getArrayNewFormatUpdate, trimJsonObject,
  getArrayNewFormatUpdateDelete, extractValueObjects, getListOfModuleOperations,
  extractNameObject,
} from '../../../../../util/appUtils';
import {
  getNewTransferArray, getNewRequestArrayOpt, getNewTransferArrayCustom, checkRemovedTransfers, checkProductIdTransfer,
} from '../../../utils/utils';
import actionCodes from '../../../../../inventory/data/actionCodes.json';
import customDataDashboard from '../../../../../inventory/overview/data/customData.json';

const appModels = require('../../../../../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const defaultIcon = {
  outgoing: outcomingIcon,
  incoming: incomingIcon,
  internal: transferIcon,
};

const AddReceiptNew = (props) => {
  const {
    id,
    editId,
    typeDisabled,
    afterReset,
    closeEditModal,
    code,
    isMultiLocation,
    locationId,
    locationName,
    isShow,
    pickingData,
    submitText,
    actionMsg,
  } = props;
  const dispatch = useDispatch();
  const [reload, setReload] = useState('1');
  const [isToDo, setToDo] = useState(false);
  const [moveValues, setMoveValues] = useState([]);

  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    addReceiptInfo, transferDetails, quotationDetails, updateReceiptInfo,
  } = useSelector((state) => state.purchase);
  const { partsSelected } = useSelector((state) => state.ppm);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inventory', 'code');

  const isApprovableDefault = allowedOperations.includes(actionCodes['Approve Transfer']);
  const isDeliverableDefault = allowedOperations.includes(actionCodes['Deliver Transfer']);

  const isInwardApprovable = isApprovableDefault || allowedOperations.includes(actionCodes['Approve Inward Transfer']);
  const isOutwardApprovable = isApprovableDefault || allowedOperations.includes(actionCodes['Approve Outward Transfer']);
  const isMaterialApprovable = isApprovableDefault || allowedOperations.includes(actionCodes['Approve Material Transfer']);

  const isInwardDeliverable = isDeliverableDefault || allowedOperations.includes(actionCodes['Deliver Inward Transfer']);
  const isOutwardDeliverable = isDeliverableDefault || allowedOperations.includes(actionCodes['Deliver Outward Transfer']);
  const isMaterialDeliverable = isDeliverableDefault || allowedOperations.includes(actionCodes['Deliver Material Transfer']);

  let isApprovable = false;
  let isDeliverable = false;

  if (code === 'incoming') {
    isApprovable = isInwardApprovable;
    isDeliverable = isInwardDeliverable;
  } else if (code === 'outgoing') {
    isApprovable = isOutwardApprovable;
    isDeliverable = isOutwardDeliverable;
  } else if (code === 'internal') {
    isApprovable = isMaterialApprovable;
    isDeliverable = isMaterialDeliverable;
  }
  const { inventoryStatusDashboard, operationTypeDetails } = useSelector((state) => state.inventory);

  const customNames = customDataDashboard.types;

  useEffect(() => {
    if (addReceiptInfo && addReceiptInfo.data && addReceiptInfo.data.length && id) {
      const oldIds = quotationDetails && quotationDetails.data ? quotationDetails.data[0].picking_ids : [];
      const newId = [addReceiptInfo.data[0]];
      const pickIds = [...newId, ...oldIds];
      const postData = { picking_ids: [[6, 0, pickIds]] };
      dispatch(updateRfq(id, appModels.PURCHASEORDER, postData));
      dispatch(resetUpdateRfqInfo());
    }
  }, [userInfo, addReceiptInfo]);

  useEffect(() => {
    if (addReceiptInfo && addReceiptInfo.data && addReceiptInfo.data.length && !id) {
      dispatch(getTransferDetail(addReceiptInfo.data[0], appModels.STOCK));
    }
  }, [userInfo, addReceiptInfo]);

  const handleUpdate = (updateId, values) => {
    const postDataValues = {
      dc_no: values.dc_no,
      po_no: values.po_no,
      move_lines: values.move_lines,
    };

    setMoveValues([]);
    const stockType = false;

    dispatch(updateTransferNoStatus(updateId, [postDataValues], stockType));
  };

  useEffect(() => {
    if (addReceiptInfo && addReceiptInfo.data && addReceiptInfo.data.length && !id && !editId && isToDo) {
      handleUpdate(addReceiptInfo.data[0], moveValues);
    }
  }, [addReceiptInfo, isToDo]);

  useEffect(() => {
    dispatch(getPartsData([]));
    dispatch(resetCreateTenant());
    setToDo(false);
  }, []);

  function extractData(data) {
    let result = false;
    if (id) {
      result = getArrayNewFormatUpdate(data);
    } else {
      result = getArrayNewFormatUpdateDelete(data);
    }
    return result;
  }

  function getLocationName(source, destination) {
    let res = locationName;
    if (isMultiLocation) {
      if (code === 'incoming') {
        res = extractNameObject(destination, 'name');
      } else {
        res = extractNameObject(source, 'name');
      }
    }
    return res;
  }

  function handleSubmit(values) {
    if (editId) {
      setIsOpenSuccessAndErrorModalWindow(true);
      let newMoveIdsArray = [];
      if (values.move_ids_without_package && values.move_ids_without_package.length > 0) {
        newMoveIdsArray = id ? getNewTransferArray(values.move_ids_without_package) : getNewRequestArrayOpt(values.move_ids_without_package, extractValueObjects(values.location_id), extractValueObjects(values.location_dest_id));
      }
      const postDataValues = {
        partner_id: extractValueObjects(values.partner_id),
        // picking_type_id: extractValueObjects(values.picking_type_id),
        move_ids_without_package: values.move_ids_without_package && values.move_ids_without_package.length > 0 ? extractData(newMoveIdsArray) : false,
        // origin: values.origin,
        //  priority: values.priority ? values.priority.value : '',
        dc_no: values.dc_no,
        po_no: values.po_no,
        note: values.note,
        product_categ_id: extractValueObjects(values.product_categ_id),
      };
      const postData = { ...postDataValues };

      if (code === 'incoming' && isMultiLocation) {
        postData.location_dest_id = extractValueObjects(values.location_dest_id);
      }

      if (code !== 'incoming' && isMultiLocation) {
        postData.location_id = extractValueObjects(values.location_id);
      }

      if (code === 'internal') {
        postData.use_in = extractValueObjects(values.use_in);
        postData.asset_id = extractValueObjects(values.asset_id);
        postData.space_id = extractValueObjects(values.space_id);
        postData.employee_id = extractValueObjects(values.employee_id);
        postData.department_id = extractValueObjects(values.department_id);
      }

      if (!postData.dc_no) { delete postData.dc_no; }
      if (!postData.po_no) { delete postData.po_no; }

      dispatch(updateReceipt(editId, appModels.STOCK, postData));
    } else {
      setIsOpenSuccessAndErrorModalWindow(true);
      // afterReset();
      setToDo(false);

      const postDataValues = {
        partner_id: extractValueObjects(values.partner_id),
        picking_type_id: extractValueObjects(values.picking_type_id),
        scheduled_date: values.scheduled_date ? moment(values.scheduled_date).utc().format('YYYY-MM-DD HH:mm:ss') : moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss'),
        move_lines: [],
        dc_no: values.dc_no,
        po_no: values.po_no,
        // origin: values.origin,
        //  priority: values.priority ? values.priority.value : '',
        note: values.note,
        product_categ_id: extractValueObjects(values.product_categ_id),
      };

      const postData = { ...postDataValues };

      if (values.move_ids_without_package && values.move_ids_without_package.length > 0) {
        let newMoveIdsArray = [];
        if (values.move_ids_without_package && values.move_ids_without_package.length > 0) {
          newMoveIdsArray = getNewTransferArrayCustom(values.move_ids_without_package);
        }
        postData.move_lines = newMoveIdsArray;
      }

      if (code === 'incoming' && isMultiLocation) {
        postData.location_dest_id = extractValueObjects(values.location_dest_id);
      }

      if (code !== 'incoming' && isMultiLocation) {
        postData.location_id = extractValueObjects(values.location_id);
      }

      if (code === 'internal') {
        postData.use_in = extractValueObjects(values.use_in);
        postData.asset_id = extractValueObjects(values.asset_id);
        postData.space_id = extractValueObjects(values.space_id);
        postData.employee_id = extractValueObjects(values.employee_id);
        postData.department_id = extractValueObjects(values.department_id);
      }

      const payload = { values: [postData] };
      dispatch(createReceipt(appModels.STOCK, payload));
    }
  }

  const handleSave = (values) => {
    setIsOpenSuccessAndErrorModalWindow(true);

    const postDataValues = {
      partner_id: extractValueObjects(values.partner_id),
      picking_type_id: extractValueObjects(values.picking_type_id),
      scheduled_date: values.scheduled_date ? moment(values.scheduled_date).utc().format('YYYY-MM-DD HH:mm:ss') : moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss'),
      move_lines: [],
      dc_no: values.dc_no,
      po_no: values.po_no,
      // origin: values.origin,
      //  priority: values.priority ? values.priority.value : '',
      note: values.note,
      product_categ_id: extractValueObjects(values.product_categ_id),
    };

    const postData = { ...postDataValues };

    if (values.move_ids_without_package && values.move_ids_without_package.length > 0) {
      let newMoveIdsArray = [];
      if (values.move_ids_without_package && values.move_ids_without_package.length > 0) {
        newMoveIdsArray = getNewTransferArrayCustom(values.move_ids_without_package);
      }
      postData.move_lines = newMoveIdsArray;
    }

    if (code === 'incoming' && isMultiLocation) {
      postData.location_dest_id = extractValueObjects(values.location_dest_id);
    }

    if (code !== 'incoming' && isMultiLocation) {
      postData.location_id = extractValueObjects(values.location_id);
    }

    if (code === 'internal') {
      postData.use_in = extractValueObjects(values.use_in);
      postData.asset_id = extractValueObjects(values.asset_id);
      postData.space_id = extractValueObjects(values.space_id);
      postData.employee_id = extractValueObjects(values.employee_id);
      postData.department_id = extractValueObjects(values.department_id);
    }

    setToDo(true);
    setMoveValues(postData);
    const payload = { values: [postData] };
    dispatch(createReceipt(appModels.STOCK, payload));
  };

  const onLoadTransfer = (eid, ename) => {
    if (eid && transferDetails && transferDetails.data) {
      const customFilters = [{
        key: 'id',
        value: eid,
        label: ename,
        type: 'id',
        refer_link: '/overview',
        refer_id: eid,
        refer_label: ename,
        refer_type: 'id',
      }];
      setToDo(false);
      setMoveValues([]);
      setIsOpenSuccessAndErrorModalWindow(false);
      if (afterReset) afterReset();
      dispatch(getTransferFilters(customFilters));
      dispatch(setCurrentTab(customNames[code] ? customNames[code].text : 'Transfers'));
    }
  };

  const handleReset = (resetForm) => {
    resetForm();
    afterReset();
    setIsOpenSuccessAndErrorModalWindow(false);
    setToDo(false);
    setMoveValues([]);
    setTimeout(() => {
      if (afterReset) afterReset();
    }, 1000);
  };

  const isApprovalRequired = operationTypeDetails && operationTypeDetails.data && operationTypeDetails.data.length && operationTypeDetails.data[0].is_confirmed;

  function getStatusFieldName(strName) {
    let res = '';
    if (strName === 'Requested') {
      res = 'requested_display';
    } else if (strName === 'Approved') {
      res = 'approved_display';
    } else if (strName === 'Delivered') {
      res = 'delivered_display';
    } else if (strName === 'Rejected') {
      res = 'rejected_display';
    }
    return res;
  }

  function getStatusDynamicStaus(label) {
    let newStr = label;
    const dName = getStatusFieldName(label);
    const pickingDataNew = inventoryStatusDashboard && inventoryStatusDashboard.data && inventoryStatusDashboard.data.Operations ? inventoryStatusDashboard.data.Operations : [];
    const pCode = code;
    const ogData = pickingDataNew.filter((item) => (item.code === pCode));
    if (ogData && ogData.length && dName) {
      newStr = ogData[0][dName];
    }
    return newStr;
  }

  function getStatusDynamicBtnStaus() {
    let newStr = 'Deliver';
    let fieldName = 'bn_delivered';
    if (isApprovalRequired) {
      newStr = 'Approve';
      fieldName = 'bn_approved';
    }
    const pickingDatas = inventoryStatusDashboard && inventoryStatusDashboard.data && inventoryStatusDashboard.data.Operations ? inventoryStatusDashboard.data.Operations : [];
    const pCode = code;
    const ogData = pickingDatas.filter((item) => (item.code === pCode));
    if (ogData && ogData.length && fieldName && ogData[0][fieldName]) {
      newStr = ogData[0][fieldName];
    }
    return newStr;
  }

  function getLocationId(source, destination) {
    let res = locationId;
    if (isMultiLocation) {
      if (code === 'incoming') {
        res = extractValueObjects(destination);
      } else {
        res = extractValueObjects(source);
      }
    }
    return res;
  }

  function getSubmitText() {
    let res = 'Submit';
    if (editId && !submitText) {
      res = 'Update';
    } else if (editId && submitText) {
      res = submitText;
    }
    return res;
  }

  function getSubmitText1() {
    let res = 'Submit';
    if (editId && !submitText) {
      res = 'update';
    } else if (editId && submitText) {
      res = submitText;
    }
    return res;
  }

  return (
    <Row className="drawer-list thin-scrollbar">
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          enableReinitialize
          initialValues={editId && transferDetails && transferDetails.data ? trimJsonObject(transferDetails.data[0]) : formInitialValues}
          validationSchema={code === 'internal' ? validationSchemaInternal : validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, values, setFieldValue, resetForm, setFieldTouched,
          }) => (
            <Form id={formId}>
              <Box
                sx={{
                  width: '100%',
                  padding: '20px',
                  borderTop: '1px solid #0000001f',
                }}
              >
                {id ? (
                  <>

                    <BasicForm
                      formField={formField}
                      setFieldTouched={setFieldTouched}
                      setFieldValue={setFieldValue}
                      editId={editId}
                      id={id}
                      reload={reload}
                      code={code}
                      isMultiLocation={isMultiLocation}
                      pickingData={pickingData}
                    />
                    {editId && transferDetails && transferDetails.data ? (
                      <ProductUpdateForm setFieldValue={setFieldValue} reload={false} />
                    )
                      : (
                        <ProductsForm code={code} locationName={getLocationName(values.location_id, values.location_dest_id)} locationId={getLocationId(values.location_id, values.location_dest_id)} setFieldValue={setFieldValue} reload={reload} />
                      )}
                  </>
                )
                  : (
                    <>
                      {isShow && (
                        <>
                          <BasicForm
                            formField={formField}
                            editId={editId}
                            typeDisabled={typeDisabled}
                            setFieldTouched={setFieldTouched}
                            setFieldValue={setFieldValue}
                            id={false}
                            reload={reload}
                            code={code}
                            isMultiLocation={isMultiLocation}
                            pickingData={pickingData}
                          />
                          <AdditionalForm code={code} formField={formField} editId={editId} setFieldValue={setFieldValue} />
                          {editId && transferDetails && transferDetails.data ? (
                            <ProductsInventory code={code} locationName={getLocationName(values.location_id, values.location_dest_id)} locationId={getLocationId(values.location_id, values.location_dest_id)} setFieldValue={setFieldValue} reload={reload} />
                          )
                            : (
                              <ProductsForm code={code} locationName={getLocationName(values.location_id, values.location_dest_id)} locationId={getLocationId(values.location_id, values.location_dest_id)} setFieldValue={setFieldValue} reload={reload} />
                            )}
                        </>
                      )}
                    </>
                  )}
              </Box>

              {((transferDetails && transferDetails.loading)) && (
                <div className="text-center mt-3">
                  <Loader />
                </div>
              )}
              {/* (addReceiptInfo && addReceiptInfo.err) && (
              <SuccessAndErrorFormat response={addReceiptInfo} />
              )}
              {(addReceiptInfo && addReceiptInfo.data) && (
                <>
                  <SuccessAndErrorFormat response={addReceiptInfo} successMessage="Transfer added successfully.." />
                  {!id && !editId && transferDetails && transferDetails.data && (
                  <p className="text-center mt-2 mb-0 tab_nav_link">
                    Click here to view
                    {' '}
                    {extractTextObject(transferDetails.data[0].picking_type_id)}
                    :
                    <span aria-hidden="true" className="ml-2 cursor-pointer text-info" onClick={() => onLoadTransfer(transferDetails.data[0].id)}>{transferDetails.data[0].name}</span>
                    {' '}
                    details
                  </p>
                  )}
                </>
                  ) */}
              <br />
              <div className="float-right m-4">
                {(addReceiptInfo && addReceiptInfo.data && !isToDo) ? (
                  <Button
                    variant="contained"
                    onClick={handleReset.bind(null, resetForm)}
                  >
                    Ok
                  </Button>
                ) : (
                  <div className={`bg-lightblue ${isShow ? 'sticky-button-50drawer' : ''}`}>
                    {id ? (
                      <Button
                        disabled={!editId ? !(isValid && dirty)
                          || ((partsSelected && !partsSelected.length > 0) || !checkProductIdTransfer(partsSelected)) : !isValid}
                        type="submit"
                        variant="contained"
                      >
                        {!editId ? 'Submit' : 'Update'}
                      </Button>
                    ) : (
                      <>
                        <Button
                          disabled={!editId ? !(isValid && dirty) || (addReceiptInfo && addReceiptInfo.loading)
                            || ((partsSelected && !partsSelected.length > 0) || !checkProductIdTransfer(partsSelected))
                            : !isValid || (checkRemovedTransfers(partsSelected && partsSelected.length ? partsSelected : []))
                            || !checkProductIdTransfer(partsSelected && partsSelected.length ? partsSelected : [])}
                          type="submit"
                          variant="contained"
                        >
                          {getSubmitText()}
                        </Button>
                        {!editId && ((isApprovable && isApprovalRequired) || (isDeliverable && !isApprovalRequired)) && (
                          <Button
                            disabled={!editId ? !(isValid && dirty) || (addReceiptInfo && addReceiptInfo.loading)
                              || ((partsSelected && !partsSelected.length > 0) || !checkProductIdTransfer(partsSelected))
                              : !isValid || (checkRemovedTransfers(partsSelected && partsSelected.length ? partsSelected : []))
                              || !checkProductIdTransfer(partsSelected && partsSelected.length ? partsSelected : [])}
                            onClick={() => handleSave(values)}
                            variant="contained"
                            className="ml-3"
                          >
                            Submit &
                            {' '}
                            {getStatusDynamicBtnStaus()}
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
              <SuccessAndErrorModalWindow
                isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                type={getSubmitText1()}
                successOrErrorData={editId ? updateReceiptInfo : addReceiptInfo}
                headerImage={code && defaultIcon[code] ? defaultIcon[code] : transferIcon}
                headerText={customNames[code] ? customNames[code].text : 'Transfer'}
                newId={transferDetails && transferDetails.data && transferDetails.data.length > 0 ? transferDetails.data[0].id : false}
                newName={transferDetails && transferDetails.data && transferDetails.data.length > 0 ? transferDetails.data[0].name : false}
                onLoadRequest={onLoadTransfer}
                successRedirect={handleReset.bind(null, resetForm)}
                actionMsg={isToDo ? `Created and ${getStatusDynamicStaus(isApprovalRequired ? 'Approved' : 'Delivered')}` : false}
              />
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

AddReceiptNew.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  typeDisabled: PropTypes.oneOfType([
    PropTypes.bool,
  ]),
  code: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  locationId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]),
  submitText: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  actionMsg: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  isMultiLocation: PropTypes.bool,
  isShow: PropTypes.bool,
  afterReset: PropTypes.func.isRequired,
  closeEditModal: PropTypes.func.isRequired,
  pickingData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};
AddReceiptNew.defaultProps = {
  typeDisabled: false,
  code: false,
  isMultiLocation: false,
  locationId: false,
  isShow: false,
  submitText: false,
  actionMsg: false,
  pickingData: {},
};

export default AddReceiptNew;
