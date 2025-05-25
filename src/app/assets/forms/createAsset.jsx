/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-max-props-per-line */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import { ThemeProvider } from '@material-ui/core/styles';
import { Button, Divider } from '@mui/material';
import { Form, Formik } from 'formik';
import moment from 'moment';
import * as PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import { Col, Row } from 'reactstrap';

import assetIcon from '@images/icons/assetDefault.svg';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';

import { setCurrentTab } from '../../inventory/inventoryService';
import { getWorkPermitPartsData } from '../../workPermit/workPermitService';
import theme from '../../util/materialTheme';
import { last } from '../../util/staticFunctions';
import {
  createAsset,
  getAssetDetail,
  getEquipmentFilters,
  resetAddAssetInfo,
  resetReadings,
} from '../equipmentService';
import checkoutFormModel from '../formModel/checkoutFormModel';
import formInitialValues from '../formModel/formInitialValues';
import validationSchema from '../formModel/validationSchema';
import AdditionalForm from './assetAdditionalForm';
import WarrantyForm from './assetWarrantyForm';
import BasicForm from './createBasicForm';
import { checkProductId } from '../utils/utils';

const appModels = require('../../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const CreateAsset = (props) => {
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
    isAdmin,
  } = props;
  const history = useHistory();
  const dispatch = useDispatch();
  const [reload, setReload] = useState('1');
  const [
    isOpenSuccessAndErrorModalWindow,
    setIsOpenSuccessAndErrorModalWindow,
  ] = useState(false);
  const [assetRequest, setAssetRequest] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const { addAssetInfo, equipmentsDetails, updateEquipment } = useSelector(
    (state) => state.equipment,
  );
  const { partsSelected } = useSelector((state) => state.workpermit);

  useEffect(() => {
    dispatch(getWorkPermitPartsData([]));
    dispatch(resetReadings());
    dispatch(resetAddAssetInfo());
  }, []);

  useEffect(() => {
    dispatch(resetReadings());
    if (addAssetInfo && addAssetInfo.data && addAssetInfo.data.length) {
      dispatch(
        getAssetDetail(addAssetInfo.data[0], appModels.EQUIPMENT, false),
      );
    }
  }, [userInfo, addAssetInfo]);

  function getDateUtcMuI(input) {
    let local = false;
    if (input && input.$d) {
      local = moment(input.$d).format('YYYY-MM-DD');
    } else if (input && input._d) {
      local = moment(input._d).format('YYYY-MM-DD');
    } else if (input) {
      local = moment(input).format('YYYY-MM-DD');
    }
    return local;
  }

  async function submitForm(values) {
    const location = values.location_id && values.location_id.length > 0
      ? last(values.location_id)
      : false;
    const category = values.category_id.id;
    const maintenanceTeam = values.maintenance_team_id.id;
    const validationStatus = values.validation_status && values.validation_status.value
      ? values.validation_status.value
      : false;

    let validatedBy = values.validated_by && values.validated_by.id
      ? values.validated_by.id
      : false;
    let validatedOn = '';
    if (validationStatus && validationStatus === 'Valid') {
      validatedBy = !validatedBy && userInfo && userInfo.data && userInfo.data.id
        ? userInfo.data.id
        : false;
    }
    if (
      validationStatus
      && validationStatus === 'Valid'
      && (!values.validated_on || values.validated_on === '')
    ) {
      validatedOn = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    } else {
      validatedOn = values.validated_on
        ? moment(values.validated_on).utc().format('YYYY-MM-DD HH:mm:ss')
        : false;
    }
    const criticality = values.criticality && values.criticality.value
      ? values.criticality.value
      : false;

    const manufacturerId = values.manufacturer_id && values.manufacturer_id.id
      ? values.manufacturer_id.id
      : '';
    const vendorId = values.vendor_id && values.vendor_id.id ? values.vendor_id.id : '';
    const amcType = values.amc_type && values.amc_type.value ? values.amc_type.value : '';
    const customerId = values.customer_id && values.customer_id.id ? values.customer_id.id : '';
    const commodityId = values.commodity_id && values.commodity_id.id
      ? values.commodity_id.id
      : '';
    const familyId = values.family_id && values.family_id.id ? values.family_id.id : '';
    const classId = values.class_id && values.class_id.id ? values.class_id.id : '';
    const segmentId = values.segment_id && values.segment_id.id ? values.segment_id.id : '';
    const operatingHours = values.operating_hours && values.operating_hours.id
      ? values.operating_hours.id
      : '';
    const resourceCalendarId = values.resource_calendar_id && values.resource_calendar_id.id
      ? values.resource_calendar_id.id
      : '';
    const tagStatus = values.tag_status && values.tag_status.value
      ? values.tag_status.value
      : '';
    const employeeId = values.employee_id && values.employee_id.id ? values.employee_id.id : '';
    const parentId = values.parent_id && values.parent_id.id ? values.parent_id.id : '';
    const monitoredById = values.monitored_by_id
      ? values.monitored_by_id.id
      : false;
    const managedById = values.managed_by_id ? values.managed_by_id.id : false;
    const maintainedById = values.maintained_by_id
      ? values.maintained_by_id.id
      : false;

    const postData = { ...values };

    postData.location_id = location;
    postData.category_id = category;
    postData.parent_id = parentId;
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
    postData.end_of_life = values.end_of_life ? getDateUtcMuI(values.end_of_life) : false;
    postData.warranty_start_date = values.warranty_start_date ? getDateUtcMuI(values.warranty_start_date) : false;
    postData.warranty_end_date = values.warranty_end_date ? getDateUtcMuI(values.warranty_end_date) : false;
    postData.amc_start_date = values.amc_start_date ? getDateUtcMuI(values.amc_start_date) : false;
    postData.amc_end_date = values.amc_end_date ? getDateUtcMuI(values.amc_end_date) : false;
    postData.purchase_date = values.purchase_date ? getDateUtcMuI(values.purchase_date) : false;
    postData.last_service_done = values.last_service_done ? getDateUtcMuI(values.last_service_done) : false;
    postData.refilling_due_date = values.refilling_due_date ? getDateUtcMuI(values.refilling_due_date) : false;
    postData.start_date = values.start_date ? getDateUtcMuI(values.start_date) : false;
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
    if (isITAsset && isGlobalITAsset && !categoryType) {
      const typeValue = isITAsset && values.category_type && values.category_type.value
        ? values.category_type.value
        : '';
      postData.is_itasset = true;
      postData.category_type = typeValue;
    }
    // closeAddModal();
    if (!isModal) {
      setIsOpenSuccessAndErrorModalWindow(true);
      //  closeAddModal();
      const payload = { model: appModels.EQUIPMENT, values: postData };
      dispatch(createAsset(payload));
    } else {
      setIsOpenSuccessAndErrorModalWindow(true);
      const payload = { model: appModels.EQUIPMENT, values: postData };
      dispatch(createAsset(payload));
    }
  }

  function handleSubmit(values) {
    submitForm(values);
  }

  const handleReset = (resetForm) => {
    resetForm();
    dispatch(getWorkPermitPartsData([]));
    afterReset();
    setIsOpenSuccessAndErrorModalWindow(false);
    if (afterReset) afterReset();
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
      const customFilters = [
        {
          key: 'id',
          value: eid,
          label: ename,
          type: 'id',
          name: ename,
        },
      ];
      dispatch(getEquipmentFilters(customFilters));
    }
    setAssetRequest(true);
    if (afterReset) afterReset();
    setIsOpenSuccessAndErrorModalWindow(false);
    if (isGlobalITAsset) {
      history.push({ pathname: '/itasset/equipments', state: { id: eid } });
    } else if (afterReset) afterReset();
  };

  if (assetRequest) {
    if (isAdmin) {
      return <Redirect to="/facility" />;
    }
    return <Redirect to="/asset-overview/equipments" />;
  }

  return (
    <Row className="drawer-list thin-scrollbar pl-0 pr-0 mr-0 ml-0">
      <Col md="12" sm="12" lg="12" xs="12">
        <Divider />
        <Formik
          initialValues={formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid,
            dirty,
            setFieldValue,
            setFieldTouched,
            resetForm,
            validateField,
            values,
          }) => (
            <Form id={formId}>
              <div className="createFormScrollbar">
                {!isTheme ? (
                  <ThemeProvider theme={theme}>
                    <>
                      <BasicForm
                        formField={formField}
                        isGlobalITAsset={isGlobalITAsset}
                        spaceId={spaceId}
                        pathName={pathName}
                        setFieldValue={setFieldValue}
                        reloadSpace={reload}
                        values={values}
                        setFieldTouched={setFieldTouched}
                        validateField={validateField}
                      />
                      <WarrantyForm
                        formField={formField}
                        setFieldValue={setFieldValue}
                        setFieldTouched={setFieldTouched}
                        validateField={validateField}
                      />
                      <AdditionalForm
                        isITAsset={isITAsset}
                        formField={formField}
                        setFieldValue={setFieldValue}
                        setFieldTouched={setFieldTouched}
                        validateField={validateField}
                      />
                    </>
                  </ThemeProvider>
                ) : (
                  <>
                    <BasicForm
                      formField={formField}
                      spaceId={spaceId}
                      pathName={pathName}
                      setFieldValue={setFieldValue}
                      isGlobalITAsset={isGlobalITAsset}
                      reloadSpace={reload}
                      setFieldTouched={setFieldTouched}
                      validateField={validateField}
                    />
                    <WarrantyForm
                      formField={formField}
                      setFieldValue={setFieldValue}
                      setFieldTouched={setFieldTouched}
                      validateField={validateField}
                    />
                    <AdditionalForm
                      isITAsset={isITAsset}
                      formField={formField}
                      setFieldValue={setFieldValue}
                      setFieldTouched={setFieldTouched}
                      validateField={validateField}
                    />
                  </>
                )}
              </div>
              {addAssetInfo && addAssetInfo.loading && (
                <div className="text-center mt-3">
                  <Loader />
                </div>
              )}
              {addAssetInfo && addAssetInfo.err && (
                <SuccessAndErrorFormat response={addAssetInfo} />
              )}
              {updateEquipment && updateEquipment.err && (
                <SuccessAndErrorFormat response={updateEquipment} />
              )}
              <Divider style={{ marginBottom: '10px' }} />
              <>
                {!isModal
                  && addAssetInfo
                  && !addAssetInfo.data
                  && !addAssetInfo.loading
                  && updateEquipment
                  && !updateEquipment.data
                  && !updateEquipment.loading && (
                    // <div className="bg-lightblue sticky-button-1250drawer">
                    <Button
                      disabled={!editId ? (!(isValid && dirty) || !checkProductId(partsSelected)) : (!isValid || !checkProductId(partsSelected))}
                      type="button"
                      onClick={() => handleSubmit(values)}
                      variant="contained"
                      className="submit-btn float-right"
                    >
                      {!editId ? 'Create' : 'Update'}
                    </Button>
                    // </div>
                )}
                {isModal
                  && addAssetInfo
                  && !addAssetInfo.data
                  && !addAssetInfo.loading
                  && updateEquipment
                  && !updateEquipment.data
                  && !updateEquipment.loading && (
                    <div className="float-right mr-4">
                      <Button
                        disabled={!editId ? (!(isValid && dirty) || !checkProductId(partsSelected)) : (!isValid || !checkProductId(partsSelected))}
                        type="button"
                        onClick={() => handleSubmit(values)}
                        variant="contained"
                        className="submit-btn float-right"
                      >
                        {!editId ? 'Create' : 'Update'}
                      </Button>
                    </div>
                )}
              </>
              <SuccessAndErrorModalWindow
                isOpenSuccessAndErrorModalWindow={
                  isOpenSuccessAndErrorModalWindow
                }
                setIsOpenSuccessAndErrorModalWindow={
                  setIsOpenSuccessAndErrorModalWindow
                }
                type={editId ? 'update' : 'create'}
                newId={
                  equipmentsDetails
                    && equipmentsDetails.data
                    && equipmentsDetails.data.length > 0
                    ? equipmentsDetails.data[0].id
                    : false
                }
                newName={
                  equipmentsDetails
                    && equipmentsDetails.data
                    && equipmentsDetails.data.length > 0
                    ? equipmentsDetails.data[0].name
                    : false
                }
                successOrErrorData={editId ? updateEquipment : addAssetInfo}
                headerImage={assetIcon}
                headerText={isITAsset ? 'IT Asset' : 'Asset'}
                onLoadRequest={onLoadRequest}
                detailData={equipmentsDetails}
                successRedirect={handleReset.bind(null, resetForm)}
              />

            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

CreateAsset.defaultProps = {
  spaceId: false,
  pathName: false,
  isTheme: false,
  isITAsset: false,
  isAdmin: false,
  isGlobalITAsset: false,
  categoryType: false,
};

CreateAsset.propTypes = {
  afterReset: PropTypes.func.isRequired,
  closeAddModal: PropTypes.func.isRequired,
  spaceId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]),
  isModal: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
  pathName: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  isTheme: PropTypes.bool,
  isITAsset: PropTypes.bool,
  isAdmin: PropTypes.bool,
  isGlobalITAsset: PropTypes.bool,
  categoryType: PropTypes.string,
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default CreateAsset;
