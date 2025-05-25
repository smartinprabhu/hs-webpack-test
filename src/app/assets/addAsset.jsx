/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-max-props-per-line */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import {
  Col, Row,
} from 'reactstrap';
import { Formik, Form } from 'formik';
import { useHistory, Redirect } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import moment from 'moment';
import { ThemeProvider } from '@material-ui/core/styles';
import { Button } from "@mui/material";

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import assetIcon from '@images/icons/assetDefault.svg';

import BasicForm from './forms/basicForm';
import WarrantyForm from './forms/warrantyForm';
import AdditionalForm from './forms/additionalForm';
import validationSchema from './formModel/validationSchema';
import checkoutFormModel from './formModel/checkoutFormModel';
import formInitialValues from './formModel/formInitialValues';
import {
  createAsset, getAssetDetail, getEquipmentFilters, resetAddAssetInfo,
} from './equipmentService';
import theme from '../util/materialTheme';
import { last } from '../util/staticFunctions';
import {
  setCurrentTab,
} from '../inventory/inventoryService';

const appModels = require('../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddAsset = (props) => {
  const {
    afterReset,
    closeAddModal,
    isModal,
    spaceId,
    pathName,
    isTheme,
    isITAsset,
    isGlobalITAsset,
    categoryType,
    editId,
    visibility
  } = props;
  const history = useHistory();
  const dispatch = useDispatch();
  const [reload, setReload] = useState('1');
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const [assetRequest, setAssetRequest] = useState(false);
  const {
    siteDetails,
  } = useSelector((state) => state.site);
  const companyId = siteDetails && siteDetails.data && siteDetails.data.length && siteDetails.data[0].id ? siteDetails.data[0].id : false;

  const { userInfo } = useSelector((state) => state.user);
  const { addAssetInfo, equipmentsDetails, updateEquipment } = useSelector((state) => state.equipment);

  useEffect(() => {
    dispatch(resetAddAssetInfo());
  }, []);

  function handleSubmit(values) {
    const location = values.location_id && values.location_id.length > 0 ? last(values.location_id) : false;
    const category = values.category_id.id;
    const maintenanceTeam = values.maintenance_team_id.id;
    const validationStatus = values.validation_status && values.validation_status.value
      ? values.validation_status.value : false;

    let validatedBy = values.validated_by && values.validated_by.id
      ? values.validated_by.id : false;
    let validatedOn = '';
    if (validationStatus && validationStatus === 'Valid') {
      validatedBy = !validatedBy && userInfo && userInfo.data && userInfo.data.id ? userInfo.data.id : false;
    }
    if (validationStatus && validationStatus === 'Valid' && (!values.validated_on || values.validated_on === '')) {
      validatedOn = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    } else {
      validatedOn = values.validated_on ? moment(values.validated_on).utc().format('YYYY-MM-DD HH:mm:ss') : false;
    }
    const criticality = values.criticality && values.criticality.value
      ? values.criticality.value : false;

    const manufacturerId = values.manufacturer_id && values.manufacturer_id.id
      ? values.manufacturer_id.id : '';
    const vendorId = values.vendor_id && values.vendor_id.id
      ? values.vendor_id.id : '';
    const amcType = values.amc_type && values.amc_type.value
      ? values.amc_type.value : '';
    const customerId = values.customer_id && values.customer_id.id
      ? values.customer_id.id : '';
    const commodityId = values.commodity_id && values.commodity_id.id
      ? values.commodity_id.id : '';
    const familyId = values.family_id && values.family_id.id
      ? values.family_id.id : '';
    const classId = values.class_id && values.class_id.id
      ? values.class_id.id : '';
    const segmentId = values.segment_id && values.segment_id.id
      ? values.segment_id.id : '';
    const operatingHours = values.operating_hours && values.operating_hours.id
      ? values.operating_hours.id : '';
    const resourceCalendarId = values.resource_calendar_id && values.resource_calendar_id.id
      ? values.resource_calendar_id.id : '';
    const tagStatus = values.tag_status && values.tag_status.value
      ? values.tag_status.value : '';
    const employeeId = values.employee_id && values.employee_id.id
      ? values.employee_id.id : '';
    const monitoredById = values.monitored_by_id ? values.monitored_by_id.id : false;
    const managedById = values.managed_by_id ? values.managed_by_id.id : false;
    const maintainedById = values.maintained_by_id ? values.maintained_by_id.id : false;
    const postData = { ...values };

    postData.location_id = location;
    postData.category_id = category;
    postData.maintenance_team_id = maintenanceTeam;
    postData.validated_by = validatedBy;
    postData.validation_status = validationStatus;
    postData.validated_on = validatedOn;
    postData.criticality = criticality;
    postData.manufacturer_id = manufacturerId;
    postData.vendor_id = vendorId;
    postData.amc_type = amcType;
    postData.customer_id = customerId;
    postData.commodity_id = commodityId;
    postData.family_id = familyId;
    postData.class_id = classId;
    postData.segment_id = segmentId;
    postData.operating_hours = operatingHours;
    postData.resource_calendar_id = resourceCalendarId;
    postData.tag_status = tagStatus;
    postData.employee_id = employeeId;
    postData.maintained_by_id = maintainedById;
    postData.managed_by_id = managedById;
    postData.monitored_by_id = monitoredById;
    postData.category_type = false;
    if (isITAsset && categoryType === 'Component') {
      postData.is_itasset = true;
      postData.category_type = 'Component';
    }
    if (isITAsset && categoryType === 'Accessory') {
      postData.is_itasset = true;
      postData.category_type = 'Accessory';
    }
    if (isITAsset && categoryType === 'Equipment') {
      postData.is_itasset = true;
      postData.category_type = 'Equipment';
    }
    if (companyId) {
      postData.company_id = companyId;
    }
    if (isITAsset && isGlobalITAsset && !categoryType) {
      const typeValue = isITAsset && values.category_type && values.category_type.value
        ? values.category_type.value : '';
      postData.is_itasset = true;
      postData.category_type = typeValue;
    }
    if (!isModal) {
      setIsOpenSuccessAndErrorModalWindow(true);
      closeAddModal();
      const payload = { model: appModels.EQUIPMENT, values: postData };
      dispatch(createAsset(payload));
    } else {
      const payload = { model: appModels.EQUIPMENT, values: postData };
      dispatch(createAsset(payload));
    }
  }

  const handleReset = (resetForm) => {
    resetForm();
    afterReset();
    setIsOpenSuccessAndErrorModalWindow(false);
    setTimeout(() => {
      if (afterReset) afterReset();
    }, 1000);
  };

  /* const onLoadRequest = (eid, type) => {
    if (type === 'Component') {
      dispatch(setCurrentTab('Components'));
    } else if (type === 'Accessory') {
      dispatch(setCurrentTab('Accessories'));
    } else if (type === 'Equipment') {
      dispatch(setCurrentTab('Equipments'));
    }
    const filters = [{
      key: 'id', value: eid, label: 'ID', type: 'id',
    }];
    dispatch(getEquipmentFilters(filters));
    setIsOpenSuccessAndErrorModalWindow(false);
    afterReset();
    if (isGlobalITAsset) {
      history.push({ pathname: '/itasset/equipments', state: { id: eid } });
    } else if (afterReset) afterReset();
  }; */

  const onLoadRequest = (eid, ename) => {
    const newType = equipmentsDetails.data[0].category_type;
    if (newType === 'Component') {
      dispatch(setCurrentTab('Components'));
    } else if (newType === 'Accessory') {
      dispatch(setCurrentTab('Accessories'));
    } else if (newType === 'Equipment') {
      dispatch(setCurrentTab('Equipments'));
    }
    if (eid) {
      const customFilters = [{
        key: 'id',
        value: eid,
        label: ename,
        type: 'id',
      }];
      dispatch(getEquipmentFilters(customFilters));
    }
    setAssetRequest(false);
    if (afterReset) afterReset();
    setIsOpenSuccessAndErrorModalWindow(false);
    if (isGlobalITAsset) {
      history.push({ pathname: '/itasset/equipments', state: { id: eid } });
    } else if (afterReset) afterReset();
  };

  if (assetRequest) {
    return (<Redirect to="/assets/equipments" />);
  }

  return (
    <Row className="drawer-list thin-scrollbar pl-0 pr-0 mr-0 ml-0">
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          initialValues={formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, setFieldValue, setFieldTouched, resetForm,
          }) => (
            <Form id={formId}>
              {(addAssetInfo && addAssetInfo.data) ? ('') : (
                <>
                  {!isTheme
                    ? (
                      <ThemeProvider theme={theme}>
                        <br />
                        <div>
                          <BasicForm visibility={visibility} formField={formField} isGlobalITAsset={isGlobalITAsset} spaceId={spaceId} pathName={pathName} setFieldValue={setFieldValue} reloadSpace={reload} />
                          <WarrantyForm formField={formField} setFieldValue={setFieldValue} />
                          <AdditionalForm isITAsset={isITAsset} formField={formField} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} />
                        </div>
                      </ThemeProvider>
                    )
                    : (
                      <div className="pl-0 pr-0 mr-0 ml-0">
                        <BasicForm formField={formField} spaceId={spaceId} pathName={pathName} setFieldValue={setFieldValue} isGlobalITAsset={isGlobalITAsset} reloadSpace={reload} />
                        <WarrantyForm formField={formField} setFieldValue={setFieldValue} />
                        <AdditionalForm isITAsset={isITAsset} formField={formField} setFieldValue={setFieldValue} />
                      </div>
                    )}
                </>
              )}
              {/* {addAssetInfo && addAssetInfo.loading && (
                <div className="text-center mt-3">
                  <Loader />
                </div>
              )}
              {(addAssetInfo && addAssetInfo.err) && (
                <SuccessAndErrorFormat response={addAssetInfo} />
              )}
              {(addAssetInfo && addAssetInfo.data) && (
                <>
                  <SuccessAndErrorFormat response={addAssetInfo} successMessage={isITAsset ? 'IT Asset added successfully..' : 'Asset added successfully..'} />
                  {equipmentsDetails && equipmentsDetails.data && isITAsset && (
                  <p className="text-center mt-2 mb-0 tab_nav_link">
                    Click here to view
                    {' '}
                      {isITAsset ? 'IT Asset' : 'Asset'}
                    :
                    <span
                      aria-hidden="true" className="ml-2 cursor-pointer text-info"
                      onClick={() => onLoadRequest(equipmentsDetails.data[0].id, equipmentsDetails.data[0].category_type)}
                    >
                      {equipmentsDetails.data[0].name}

                    </span>
                    {' '}
                    details
                  </p>
                  )}
                </>
              )}
              <div className="float-right">
                {(addAssetInfo && !addAssetInfo.data && !addAssetInfo.loading)
                  && (updateEquipment && !updateEquipment.data && !updateEquipment.loading) && (
                    <div className="float-right mr-4 mb-4 mt-2">
                      <Button
                        disabled={!editId ? !(isValid && dirty) : !isValid}
                        type="submit"
                        size="sm"
                         variant="contained"
                      >
                        {!editId ? 'Create' : 'Update'}
                      </Button>
                    </div>
                )}
              </div> */}

              {addAssetInfo && addAssetInfo.loading && (
                <div className="text-center mt-3">
                  <Loader />
                </div>
              )}
              {(addAssetInfo && addAssetInfo.err) && (
                <SuccessAndErrorFormat response={addAssetInfo} />
              )}
              {(updateEquipment && updateEquipment.err) && (
                <SuccessAndErrorFormat response={updateEquipment} />
              )}
              {(addAssetInfo && addAssetInfo.data) && (
                <SuccessAndErrorFormat response={addAssetInfo} successMessage={isITAsset ? 'IT Asset added successfully..' : 'Asset added successfully..'} />
              )}
              {(updateEquipment && updateEquipment.data) && (
                <SuccessAndErrorFormat response={updateEquipment} successMessage={isITAsset ? 'IT Asset Updated successfully..' : 'Asset Updated successfully..'} />
              )}
              <hr />
              <div className="float-right mr-4 mb-4">
                {(addAssetInfo && addAssetInfo.data) || (updateEquipment && updateEquipment.data) ? (
                  <Button
                    variant='contained'
                    className="submit-btn"
                    onClick={handleReset.bind(null, resetForm)}
                  >
                    ok
                  </Button>
                ) : (
                  <>
                    {!isModal && (addAssetInfo && !addAssetInfo.data && !addAssetInfo.loading)
                      && (updateEquipment && !updateEquipment.data && !updateEquipment.loading) && (
                        <div className="bg-lightblue sticky-button-1250drawer">
                          <Button
                            disabled={!editId ? !(isValid && dirty) : !isValid}
                            type="submit"
                            variant='contained'
                            className="submit-btn"
                          >
                            {!editId ? 'Create' : 'Update'}
                          </Button>
                        </div>

                      )}
                    {isModal && (addAssetInfo && !addAssetInfo.data && !addAssetInfo.loading)
                      && (updateEquipment && !updateEquipment.data && !updateEquipment.loading) && (
                        <div className="float-right mr-4">
                          <Button
                            disabled={!editId ? !(isValid && dirty) : !isValid}
                            type="submit"
                            variant='contained'
                            className="submit-btn"
                          >
                            {!editId ? 'Create' : 'Update'}
                          </Button>
                        </div>
                      )}
                  </>
                )}
              </div>

              {!isModal
                ? (
                  <SuccessAndErrorModalWindow
                    isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                    setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                    type={editId ? 'update' : 'create'}
                    newId={equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data.length > 0 ? equipmentsDetails.data[0].id : false}
                    newName={equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data.length > 0 ? equipmentsDetails.data[0].name : false}
                    successOrErrorData={editId ? updateEquipment : addAssetInfo}
                    headerImage={assetIcon}
                    headerText={isITAsset ? 'IT Asset' : 'Asset'}
                    onLoadRequest={onLoadRequest}
                    successRedirect={handleReset.bind(null, resetForm)}
                  />
                ) : ''}
            </Form>
          )}
        </Formik>
      </Col>

    </Row>
  );
};

AddAsset.defaultProps = {
  spaceId: false,
  pathName: false,
  isTheme: false,
  isITAsset: false,
  isGlobalITAsset: false,
  categoryType: false,
};

AddAsset.propTypes = {
  afterReset: PropTypes.func.isRequired,
  closeAddModal: PropTypes.func.isRequired,
  spaceId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]),
  isModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  pathName: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  isTheme: PropTypes.bool,
  isITAsset: PropTypes.bool,
  isGlobalITAsset: PropTypes.bool,
  categoryType: PropTypes.string,
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default AddAsset;