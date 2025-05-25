/* eslint-disable prefer-destructuring */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
/* eslint-disable consistent-return */
import {
  CardBody,
  Row, Col,
} from 'reactstrap';
import {
  Button,
} from '@mui/material';
import { Formik, Form } from 'formik';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import predictiveMaintenance from '@images/icons/preventiveMaintenance.svg';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import RequestorForm from './forms/requestorForm';
import ToolsForm from './forms/toolsForm';
import CheckListForm from './forms/checkListForm';
import PartsForm from './forms/partsForm';
import validationSchema from './formModel/validationSchema';
import checkoutFormModel from './formModel/checkoutFormModel';
import formInitialValues from './formModel/formInitialValues';
import {
  createPreventiveOperation,
  updatePPMOperation,
  getOperationData,
  resetCreateOperation,
  resetUpdateOperation,
  getChecklistData,
  getToolsData,
  getPartsData,
  activeStepInfo,
} from '../ppmService';
import useStyles from '../styles';
import {
  getArrayNewFormat, trimJsonObject, generateErrorMessage, getArrayNewFormatUpdateDelete, getAllowedCompanies,
} from '../../util/appUtils';
import { setCurrentTab } from '../../adminSetup/setupService';
import PpmOperationsPreviewScreen from './previewScreen/ppmOperationsPreviewScreen';

const appModels = require('../../util/appModels').default;

const { formId, formField } = checkoutFormModel;

function renderStepContent(step, setFieldValue, reload, editId) {
  switch (step) {
    case 0:
      return (
        <Row>
          <Col xs={12} sm={12} lg={12} md={12} className="bg-lightblue"><RequestorForm formField={formField} setFieldValue={setFieldValue} reloadData={reload} /></Col>
          <Col xs={12} sm={12} lg={12} md={12} className="mt-2 mb-2" />
          <Col xs={12} sm={12} lg={12} md={12} className="bg-lightblue"><CheckListForm setFieldValue={setFieldValue} formField={formField} editId={editId} /></Col>
          <Col xs={12} sm={12} lg={12} md={12} className="mt-2 mb-2" />
          <Col xs={12} sm={12} lg={12} md={12} className="bg-lightblue"><ToolsForm setFieldValue={setFieldValue} formField={formField} editId={editId} /></Col>
          <Col xs={12} sm={12} lg={12} md={12} className="mt-2 mb-2" />
          <Col xs={12} sm={12} lg={12} md={12} className="bg-lightblue"><PartsForm formField={formField} setFieldValue={setFieldValue} editId={editId} /></Col>
        </Row>
      );
    case 1:
      return (
        <Row>
          <Col lg="12">
            <PpmOperationsPreviewScreen setFieldValue={setFieldValue} />
          </Col>
        </Row>
      );
    default:
  }
}

const AddPreventiveOperations = (props) => {
  const { match } = props;
  const { params } = match;
  // const { editId } = params;
  const {
    editId, closeModal, afterReset, editData,
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  // const [activeStep, setActiveStep] = useState(0);
  const [reload, setReload] = useState('1');
  const [closeOperations, setCloseOperations] = useState(false);
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);

  const {
    addPreventiveOperation, updateOperationInfo, ppmOperationData, activeStep,
  } = useSelector((state) => state.ppm);
  const { siteDetails } = useSelector((state) => state.site);
  const { userInfo } = useSelector((state) => state.user);
  const currentValidationSchema = validationSchema[activeStep];

  let steps = ['Maintenance Information', 'Summary'];

  if (editId) {
    steps = ['Maintenance Information'];
  }

  const isLastStep = activeStep === steps.length - 1;
  useEffect(() => {
    dispatch(resetCreateOperation());
    dispatch(resetUpdateOperation());
    dispatch(getChecklistData());
    dispatch(getToolsData());
    dispatch(getPartsData());
  }, []);

  useEffect(() => {
    if (editId) {
      dispatch(getOperationData(editId, appModels.TASK));
    }
  }, [editId]);

  function checkArrayhasData(array) {
    const newData = [];
    if (array.length) {
      for (let i = 0; i < array.length; i += 1) {
        const p = array[i];
        p.name = p.check_list_id[1];
        p.check_list_id = p.check_list_id[0];
        p.category_type = p.category_type ? p.category_type[0] : '';
        p.equipment_id = p.equipment_id ? p.equipment_id[0] : false;
        p.location_id = p.location_id ? p.location_id[0] : false;
        newData.push(p);
      }
    }
    return newData;
  }

  function checkArrayhasDataTool(data) {
    let result = [];
    if (data && data.length) {
      result = data.filter((item) => item.tool_id && (typeof item.tool_id === 'number'));
    }
    return result;
  }

  const checkArrayhasDataPart = (array) => {
    const newData = [];
    if (array.length) {
      for (let i = 0; i < array.length; i += 1) {
        const p = array[i];
        p.name = p.parts_id[1];
        p.parts_id = p.parts_id[0];
        newData.push(p);
      }
    }
    return newData;
  };

  async function submitForm(values, actions) {
    if (editId && ppmOperationData && ppmOperationData.data) {
      setIsOpenSuccessAndErrorModalWindow(true);
      const categoryId = ppmOperationData.data[0].category_id ? ppmOperationData.data[0].category_id[0] : '';
      const assetCategoryId = ppmOperationData.data[0].asset_category_id ? ppmOperationData.data[0].asset_category_id[0] : '';

      const postData = {
        name: values.name,
        asset_category_id: values.asset_category_id.id ? values.asset_category_id.id : assetCategoryId,
        category_id: values.category_id.id ? values.category_id.id : categoryId,
        type_category: values.type_category && values.asset_category_id.value ? values.type_category.value : ppmOperationData.data[0].type_category,
        maintenance_type: values.maintenance_type && values.maintenance_type.value ? values.maintenance_type.value : ppmOperationData.data[0].maintenance_type,
        order_duration: parseFloat(values.order_duration),
        check_list_ids: values.check_list_ids && values.check_list_ids.length > 0 ? getArrayNewFormatUpdateDelete(checkArrayhasData(values.check_list_ids)) : false,
        tool_ids: values.tool_ids && values.tool_ids.length > 0 ? getArrayNewFormatUpdateDelete(checkArrayhasDataTool(values.tool_ids)) : false,
        parts_lines: values.parts_lines && values.parts_lines.length > 0 ? getArrayNewFormatUpdateDelete(checkArrayhasDataPart(values.parts_lines)) : false,
      };
      dispatch(updatePPMOperation(editId, appModels.TASK, postData));
      dispatch(setCurrentTab('Operations'));
    } else {
      setIsOpenSuccessAndErrorModalWindow(true);
      const assetCategory = values.asset_category_id.id ? values.asset_category_id.id : false;
      const equipmentCategory = values.category_id.id ? values.category_id.id : false;
      const orderDuration = parseFloat(values.order_duration);
      const typeCategory = values.type_category && values.type_category.value ? values.type_category.value : false;
      const maintenanceType = values.maintenance_type && values.maintenance_type.value ? values.maintenance_type.value : false;
      const checkListIds = values.check_list_ids && values.check_list_ids.length > 0 ? getArrayNewFormat(checkArrayhasData(values.check_list_ids)) : false;
      const toolsId = values.tool_ids && values.tool_ids.length > 0 ? getArrayNewFormat(checkArrayhasDataTool(values.tool_ids)) : false;
      const partsId = values.parts_lines && values.parts_lines.length > 0 ? getArrayNewFormat(checkArrayhasDataPart(values.parts_lines)) : false;

      const postData = { ...values };

      postData.asset_category_id = assetCategory;
      postData.category_id = equipmentCategory;
      postData.type_category = typeCategory;
      postData.maintenance_type = maintenanceType;
      postData.check_list_ids = checkListIds;
      postData.tool_ids = toolsId;
      postData.parts_lines = partsId;
      postData.order_duration = orderDuration;
      postData.company_id = siteDetails && siteDetails.data && siteDetails.data.length && siteDetails.data[0].id ? siteDetails.data[0].id : getAllowedCompanies(userInfo);
      actions.setSubmitting(true);
      const payload = { model: appModels.TASK, values: postData };
      const createReq = await createPreventiveOperation(payload);
      dispatch(createReq);
      dispatch(setCurrentTab('Operations'));
      actions.setSubmitting(false);
    }
  }

  function handleSubmit(values, actions) {
    submitForm(values, actions);
    // if (isLastStep) {
    //   submitForm(values, actions);
    // } else {
    //   dispatch(activeStepInfo(activeStep + 1));
    //   actions.setTouched({});
    //   actions.setSubmitting(false);
    // }
  }

  function handleBack() {
    dispatch(activeStepInfo(activeStep - 1));
    setReload('0');
  }

  const closeAddOperations = () => {
    dispatch(setCurrentTab('Operations'));
    setCloseOperations(true);
  };

  const handleReset = (resetForm) => {
    resetForm();
    closeModal();
    dispatch(setCurrentTab('Operations'));
    setIsOpenSuccessAndErrorModalWindow(false);
    setTimeout(() => {
      if (closeModal) closeModal();
    }, 1000);
  };

  // if (closeOperations) {
  //   return (<Redirect to="/maintenance-configuration" />);
  // }

  const headingTxtAdd = isLastStep ? 'Summary' : 'Maintenance Operations';

  const subHeadingTextAdd = isLastStep ? 'Please check the information before submit' : 'Please enter the required information';

  const headingTxt = editId ? 'Update Maintenance Operation' : headingTxtAdd;

  const subHeadingText = editId ? 'Please check the information before update' : subHeadingTextAdd;

  return (

    <Row className=" comments-list thin-scrollbar ml-1 mr-1 mt-2 mb-2 pr-3 pl-3 pb-3 pt-0">
      <Col sm="12" md="12" lg="12" xs="12">
        <div className="p-1">
          <CardBody>
            {/* {activeStep !== steps.length && (
              <>
                <Row className="mb-0">
                  <Col md={6} xs={7} className="pr-0">
                    <Row>
                      <Col lg={1} md={1} sm={1} xs={12} className="pl-0">
                        <img src={predictiveMaintenance} className="mr-2" alt="ppm" height="30" width="30" />
                      </Col>
                      <Col lg={10} md={10} sm={10} xs={12} className="pl-0">
                        <h4 className="mb-0">
                          {headingTxt}
                        </h4>
                        <p className="tab_nav_link">
                          <span className="font-weight-300">{subHeadingText}</span>
                        </p>
                      </Col>
                    </Row>
                  </Col>
                  <Col md={6} sm={6} lg={6} xs={12} className="p-0">
                    <span className="text-right desktop-view">
                      <Button  variant="contained" size="sm" onClick={closeAddOperations} className="hoverColor bg-white pb-1 pt-1 tab_nav_link rounded-pill float-right mb-1">
                        <span>Cancel </span>
                        <FontAwesomeIcon className="ml-2" size="sm" icon={faTimesCircle} />
                      </Button>
                    </span>
                  </Col>
                </Row>
                <hr className="extend-line mt-0" />
              </>
            )} */}
            {(editId && (ppmOperationData.loading || ppmOperationData.err)) ? (
              <>
                <div />
                <div className="mb-2 mt-3 p-5" data-testid="loading-case">
                  {ppmOperationData && ppmOperationData.loading && (
                  <Loader />
                  )}

                  {ppmOperationData && ppmOperationData.err && (
                  <ErrorContent errorTxt={generateErrorMessage(ppmOperationData)} />
                  )}
                </div>
              </>
            ) : (
              <Formik
                initialValues={editId && ppmOperationData && ppmOperationData.data ? trimJsonObject(ppmOperationData.data[0]) : formInitialValues}
                validationSchema={currentValidationSchema}
                onSubmit={handleSubmit}
              >
                {({
                  isValid, dirty, setFieldValue, resetForm,
                }) => (
                  <Form id={formId}>
                    {renderStepContent(activeStep, setFieldValue, reload, editId)}
                    {/* <div className={activeStep !== steps.length ? 'bg-lightblue sticky-button-1250drawer' : 'text-center'}>
                      {activeStep !== 0 && (activeStep !== steps.length || addPreventiveOperation.err) ? (
                        <Button onClick={handleBack} variant="contained"
                        //color={activeStep !== steps.length ? 'back' : 'secondary'}
                         className={classes.button}>
                          Back
                        </Button>
                      ) : (<span />)}
                      {activeStep !== steps.length && (
                        <>
                          {isLastStep && (
                          <Button
                            type="submit"
                            disabled={!editId ? !(isValid && dirty) : false}
                            variant="contained"
                            className={classes.button}
                          >
                            {editId ? 'Update' : 'Submit'}
                          </Button>
                          )}
                          {!isLastStep && (
                          <Button
                            type="submit"
                            disabled={!(isValid && dirty)}
                            variant="contained"
                            className={classes.button}
                          >
                            Next
                          </Button>
                          )}
                        </>

                      )}
                    </div> */}
                    <div className="bg-lightblue sticky-button-85drawer">
                      <Button
                        disabled={!editId ? !(isValid && dirty) : false}
                        type="submit"
                        size="sm"
                        variant="contained"
                      >
                        {!editId ? 'Add' : 'Update'}
                      </Button>
                    </div>
                    <SuccessAndErrorModalWindow
                      isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                      setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                      type={editId ? 'update' : 'create'}
                      successOrErrorData={editId ? updateOperationInfo : addPreventiveOperation}
                      headerImage={predictiveMaintenance}
                      headerText="Maintenance Operations"
                      successRedirect={handleReset.bind(null, resetForm)}
                    />
                  </Form>
                )}
              </Formik>
            )}
          </CardBody>
          <hr className="m-0" />
        </div>
      </Col>
    </Row>
  );
};

AddPreventiveOperations.defaultProps = {
  match: false,
  editId: false,
};

AddPreventiveOperations.propTypes = {
  match: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  editId: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
};

export default AddPreventiveOperations;
