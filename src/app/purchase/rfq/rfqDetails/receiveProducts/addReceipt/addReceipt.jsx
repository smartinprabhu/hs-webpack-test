/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import {
  Col, Row,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { Formik, Form } from 'formik';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import moment from 'moment';

import PromptIfUnSaved from '@shared/unSavedPrompt';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import InventoryBlue from '@images/icons/inventoryBlue.svg';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';

import BasicForm from './forms/basicForm';
import ProductsForm from './forms/productsForm';
import ProductUpdateForm from './forms/productUpdateForm';
import ProductsInventory from './forms/productsInventory';
import AdditionalForm from './forms/additionalForm';
import validationSchema from './formModel/validationSchema';
import checkoutFormModel from './formModel/checkoutFormModel';
import formInitialValues from './formModel/formInitialValues';
import {
  createReceipt,
  updateReceipt, updateRfq,
  resetUpdateRfqInfo,
  getTransferDetail,
  getTransferFilters,
  purchaseStateChange,
} from '../../../../purchaseService';
import { setCurrentTab } from '../../../../../inventory/inventoryService';
import { getPartsData } from '../../../../../preventiveMaintenance/ppmService';
import theme from '../../../../../util/materialTheme';
import {
  getArrayNewFormat, getArrayNewFormatUpdate, trimJsonObject,
  getArrayNewFormatUpdateDelete, extractValueObjects, extractTextObject,
} from '../../../../../util/appUtils';
import {
  getNewTransferArray, getNewRequestArrayUpdate, getNewTransferArrayNew, checkRemovedTransfers, checkArrayhasData, checkProductIdTransfer,
} from '../../../utils/utils';

const appModels = require('../../../../../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddReceipt = (props) => {
  const {
    id,
    editId,
    typeDisabled,
    afterReset,
    closeEditModal,
  } = props;
  const dispatch = useDispatch();
  const [reload, setReload] = useState('1');
  const [isToDo, setToDo] = useState(false);

  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const { userInfo } = useSelector((state) => state.user);
  const {
    addReceiptInfo, transferDetails, quotationDetails, updateReceiptInfo,
  } = useSelector((state) => state.purchase);
  const { partsSelected } = useSelector((state) => state.ppm);

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

  useEffect(() => {
    if (transferDetails && transferDetails.data && transferDetails.data.length && !id && !editId && isToDo) {
      dispatch(purchaseStateChange(transferDetails.data[0].id, 'action_confirm', appModels.STOCK));
    }
  }, [userInfo, transferDetails, isToDo]);

  useEffect(() => {
    dispatch(getPartsData([]));
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

  function handleSubmit(values) {
    if (editId) {
      setIsOpenSuccessAndErrorModalWindow(true);
      closeEditModal();
      let newMoveIdsArray = [];
      if (values.move_ids_without_package && values.move_ids_without_package.length > 0) {
        newMoveIdsArray = id ? getNewTransferArray(checkArrayhasData(values.move_ids_without_package)) : getNewRequestArrayUpdate(checkArrayhasData(values.move_ids_without_package));
      }
      const postDataValues = {
        partner_id: extractValueObjects(values.partner_id),
        picking_type_id: extractValueObjects(values.picking_type_id),
        location_dest_id: extractValueObjects(values.location_dest_id),
        location_id: extractValueObjects(values.location_id),
        scheduled_date: values.scheduled_date ? `${moment(values.scheduled_date).format('YYYY-MM-DD')} 18:29:00` : false,
        move_ids_without_package: values.move_ids_without_package && values.move_ids_without_package.length > 0 ? extractData(newMoveIdsArray) : false,
        origin: values.origin,
        priority: values.priority ? values.priority.value : '',
        note: values.note,
      };
      dispatch(updateReceipt(editId, appModels.STOCK, postDataValues));
    } else {
      setIsOpenSuccessAndErrorModalWindow(true);
      afterReset();
      const partnerId = values.partner_id.id;
      const companyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';
      const pickingTypeId = values.picking_type_id && values.picking_type_id.id
        ? values.picking_type_id.id : false;
      const locationDestId = values.location_dest_id && values.location_dest_id.id ? values.location_dest_id.id : '';
      const locationId = values.location_id && values.location_id.id ? values.location_id.id : '';
      const scheduledDate = values.scheduled_date ? `${moment(values.scheduled_date).format('YYYY-MM-DD')} 18:29:00` : false;
      const priorityValue = values.priority && values.priority.value
        ? values.priority.value : false;

      const postData = { ...values };

      postData.partner_id = partnerId;
      postData.company_id = companyId;
      postData.picking_type_id = pickingTypeId;
      postData.location_dest_id = locationDestId;
      postData.location_id = locationId;
      postData.scheduled_date = scheduledDate;
      postData.move_type = 'direct';
      postData.priority = priorityValue;

      if (values.move_ids_without_package && values.move_ids_without_package.length > 0) {
        let newMoveIdsArray = [];
        if (values.move_ids_without_package && values.move_ids_without_package.length > 0) {
          newMoveIdsArray = getNewTransferArrayNew(checkArrayhasData(values.move_ids_without_package));
        }
        postData.move_ids_without_package = getArrayNewFormat(newMoveIdsArray);
      }

      const payload = { model: appModels.STOCK, values: postData };
      dispatch(createReceipt(appModels.STOCK, payload));
    }
  }

  const handleSave = (values) => {
    const partnerId = values.partner_id.id;
    const companyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';
    const pickingTypeId = values.picking_type_id && values.picking_type_id.id
      ? values.picking_type_id.id : false;
    const locationDestId = values.location_dest_id && values.location_dest_id.id ? values.location_dest_id.id : '';
    const locationId = values.location_id && values.location_id.id ? values.location_id.id : '';
    const scheduledDate = values.scheduled_date ? `${moment(values.scheduled_date).format('YYYY-MM-DD')} 18:29:00` : false;
    const priorityValue = values.priority && values.priority.value
      ? values.priority.value : false;

    const postData = { ...values };

    postData.partner_id = partnerId;
    postData.company_id = companyId;
    postData.picking_type_id = pickingTypeId;
    postData.location_dest_id = locationDestId;
    postData.location_id = locationId;
    postData.scheduled_date = scheduledDate;
    postData.move_type = 'direct';
    postData.priority = priorityValue;

    if (values.move_ids_without_package && values.move_ids_without_package.length > 0) {
      let newMoveIdsArray = [];
      if (values.move_ids_without_package && values.move_ids_without_package.length > 0) {
        newMoveIdsArray = getNewTransferArrayNew(checkArrayhasData(values.move_ids_without_package));
      }
      postData.move_ids_without_package = getArrayNewFormat(newMoveIdsArray);
    }

    const payload = { model: appModels.STOCK, values: postData };
    setToDo(true);
    dispatch(createReceipt(appModels.STOCK, payload));
  };

  const onLoadTransfer = (eid) => {
    if (eid && transferDetails && transferDetails.data) {
      const customFilters = [{
        key: 'id',
        value: eid,
        label: transferDetails.data[0].name,
        type: 'id',
        refer_link: '/overview',
        refer_id: transferDetails.data[0].id,
        refer_label: transferDetails.data[0].name,
        refer_type: 'id',
      }];
      setToDo(false);
      if (afterReset) afterReset();
      dispatch(getTransferFilters([], [], [], customFilters));
      dispatch(setCurrentTab('Transfers'));
    }
  };

  const handleReset = (resetForm) => {
    resetForm();
    afterReset();
    setIsOpenSuccessAndErrorModalWindow(false);
    setToDo(false);
    setTimeout(() => {
      if (afterReset) afterReset();
    }, 1000);
  };

  return (
    <Row className="drawer-list thin-scrollbar pl-0 pr-0 pt-4 mr-0 ml-0">
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          enableReinitialize
          initialValues={editId && transferDetails && transferDetails.data ? trimJsonObject(transferDetails.data[0]) : formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, values, setFieldValue, resetForm, setFieldTouched,
          }) => (
            <Form id={formId}>
              <PromptIfUnSaved />
              {((addReceiptInfo && addReceiptInfo.data)
                  || (updateReceiptInfo && updateReceiptInfo.data)) ? ('') : (
                    <ThemeProvider theme={theme}>
                      {id ? (
                        <div>
                          <BasicForm formField={formField} setFieldTouched={setFieldTouched} setFieldValue={setFieldValue} editId={editId} id={id} reload={reload} />
                          {editId && transferDetails && transferDetails.data ? (
                            <ProductUpdateForm setFieldValue={setFieldValue} reload={false} />
                          )
                            : (
                              <ProductsForm setFieldValue={setFieldValue} reload={reload} />
                            )}
                        </div>
                      )
                        : (
                          <>
                            {/* <Nav>
                              {tabs && tabs.formTabs.map((item) => (
                                <div className="mr-5 ml-5" key={item.id}>
                                  <NavLink
                                    className="nav-link-item pt-2 pb-1 pl-1 pr-1"
                                    active={currentTab === item.name}
                                    href="#"
                                    onClick={() => { setActive(item.name); setReload('0'); }}
                                  >
                                    {item.name}
                                  </NavLink>
                                </div>
                              ))}
                              </Nav> */}
                            <br />
                            <div className="pt-1 pr-5 pl-2 pb-2 mr-2 ml-4">
                              <BasicForm formField={formField} editId={editId} typeDisabled={typeDisabled} setFieldTouched={setFieldTouched} setFieldValue={setFieldValue} id={false} reload={reload} />
                              <AdditionalForm formField={formField} setFieldValue={setFieldValue} />
                              {editId && transferDetails && transferDetails.data ? (
                                <ProductsInventory setFieldValue={setFieldValue} reload={reload} />
                              )
                                : (
                                  <ProductsForm setFieldValue={setFieldValue} reload={reload} />
                                )}
                            </div>
                            {/* {currentTab === 'Advanced' && (
                            <div className="pt-1 pr-5 pl-4 pb-5 mr-2 ml-4">
                              <AdditionalForm formField={formField} setFieldValue={setFieldValue} />
                            </div>
                           )} */}
                          </>
                        )}
                    </ThemeProvider>
                )}
              {((addReceiptInfo && addReceiptInfo.loading) || (transferDetails && transferDetails.loading)) && (
              <div className="text-center mt-3">
                <Loader />
              </div>
              )}
              {(addReceiptInfo && addReceiptInfo.err) && (
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
              )}
              <br />
              <div className="float-right m-4">
                {(addReceiptInfo && addReceiptInfo.data) ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="contained"
                    onClick={handleReset.bind(null, resetForm)}
                  >
                    Ok
                  </Button>
                ) : (
                  <div className="bg-lightblue sticky-button-1250drawer">
                    {id ? (
                      <Button
                        disabled={!editId ? !(isValid && dirty)
                        || ((partsSelected && !partsSelected.length > 0) || !checkProductIdTransfer(partsSelected)) : !isValid}
                        type="submit"
                        size="sm"
                        variant="contained"
                      >
                        {!editId ? 'Add' : 'Update'}
                      </Button>
                    ) : (
                      <>
                        <Button
                          disabled={!editId ? !(isValid && dirty)
                        || ((partsSelected && !partsSelected.length > 0) || !checkProductIdTransfer(partsSelected))
                            : !isValid || (checkRemovedTransfers(partsSelected && partsSelected.length ? partsSelected : []))
                          || !checkProductIdTransfer(partsSelected && partsSelected.length ? partsSelected : [])}
                          type="submit"
                          size="sm"
                          variant="contained"
                        >
                          {!editId ? 'Add' : 'Update'}
                        </Button>
                        {!editId && (
                          <Button
                            disabled={!(isValid && dirty)
                        || ((partsSelected && !partsSelected.length > 0) || !checkProductIdTransfer(partsSelected))}
                            type="button"
                            onClick={() => handleSave(values)}
                            size="sm"
                            className="ml-4"
                            variant="contained"
                          >
                            Add & Mark as ToDo
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
                type={editId ? 'update' : 'create'}
                successOrErrorData={editId ? updateReceiptInfo : addReceiptInfo}
                headerImage={InventoryBlue}
                headerText="Transfers"
                successRedirect={handleReset.bind(null, resetForm)}
              />
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

AddReceipt.propTypes = {
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
  afterReset: PropTypes.func.isRequired,
  closeEditModal: PropTypes.func.isRequired,
};
AddReceipt.defaultProps = {
  typeDisabled: false,
};

export default AddReceipt;
