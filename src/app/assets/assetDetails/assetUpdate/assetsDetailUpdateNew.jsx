/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-sequences */
/* eslint-disable import/no-unresolved */
import {
  FormControl,
} from '@material-ui/core';
import { Button, Divider } from '@mui/material';
import { Form, Formik } from 'formik';
import moment from 'moment';
import * as PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col,
  Row,
} from 'reactstrap';

import assetIcon from '@images/icons/assetDefault.svg';
import { Box } from '@mui/system';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import {
  trimJsonObject,
  getArrayNewFormatUpdateDeleteNew,
} from '../../../util/appUtils';
import {
  getAssetDetail,
  updateEquipmentData,
} from '../../equipmentService';
import { checkProductId } from '../../utils/utils';
import AdditionalUpdateForm from './additionalUpdateFormNew';
import AssetInfoUpdate from './assetDetailInfoUpdateNew';
import assetValidationSchema from './assetValidationSchema';
import MaintenanceUpdateForm from './maintenanceUpdateFormNew';
import ValidationUpdateForm from './validationUpdateFormNew';
import WarrantyUpdateForm from './warrantyUpdateFormNew';

const appModels = require('../../../util/appModels').default;

const currentValidationSchema = assetValidationSchema;

const AssetsDetailUpdate = (props) => {
  const {
    isITAsset, closeModal, afterReset, editId,
  } = props;
  const dispatch = useDispatch(); 
  const { partsSelected } = useSelector((state) => state.workpermit);
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const {
    equipmentsDetails, updateEquipment,
  } = useSelector((state) => state.equipment);
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if ((updateEquipment && updateEquipment.data) && (equipmentsDetails && equipmentsDetails.data)) {
      dispatch(getAssetDetail(equipmentsDetails.data[0].id, appModels.EQUIPMENT, false));
    }
  }, [updateEquipment]);

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

  function handleSubmit(values) {
    setIsOpenSuccessAndErrorModalWindow(true);
    // closeModal();
    let validatedBy = '';
    const validationStatus = values.validation_status && values.validation_status.value
      ? values.validation_status.value : false;
    if (validationStatus && validationStatus === 'Valid') {
      validatedBy = userInfo && userInfo.data && userInfo.data.id ? userInfo.data.id : '';
    }

    let validatedOn = '';

    if (validationStatus && validationStatus === 'Valid') {
      validatedOn = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    } else {
      validatedOn = values.validated_on ? moment(values.validated_on).utc().format('YYYY-MM-DD HH:mm:ss') : false;
    }

    const postData = {
      model: values.model,
      serial: values.serial,
      name: values.name,
      brand: values.brand,
      category_id: values.category_id ? values.category_id.id : '',
      manufacturer_id: values.manufacturer_id ? values.manufacturer_id.id : '',
      operating_hours: values.operating_hours ? values.operating_hours.id : '',
      commodity_id: values.commodity_id ? values.commodity_id.id : '',
      customer_id: values.customer_id ? values.customer_id.id : '',
      vendor_id: values.vendor_id ? values.vendor_id.id : '',
      resource_calendar_id: values.resource_calendar_id ? values.resource_calendar_id.id : '',
      maintenance_team_id: values.maintenance_team_id ? values.maintenance_team_id.id : '',
      start_date: values.start_date ? getDateUtcMuI(values.start_date) : false,
      warranty_end_date: values.warranty_end_date ? getDateUtcMuI(values.warranty_end_date) : false,
      purchase_date: values.purchase_date ? getDateUtcMuI(values.purchase_date) : false,
      asset_id: values.asset_id,
      amc_cost: values.amc_cost,
      rav: values.rav,
      validated_on: validatedOn,
      validated_by: values.validated_by ? values.validated_by.id : validatedBy,
      tag_status: values.tag_status ? values.tag_status.value : '',
      amc_type: values.amc_type ? values.amc_type.value : '',
      validation_status: values.validation_status ? values.validation_status.value : '',
      comment: values.comment,
      latitude: values.latitude,
      longitude: values.longitude,
      xpos: values.xpos,
      ypos: values.ypos,
      make: values.make,
      capacity: values.capacity,
      refilling_due_date: values.refilling_due_date ? getDateUtcMuI(values.refilling_due_date) : false,
      last_service_done: values.last_service_done ? getDateUtcMuI(values.last_service_done) : false,
      purchase_value: values.purchase_value,
      warranty_start_date: values.warranty_start_date ? getDateUtcMuI(values.warranty_start_date) : false,
      end_of_life: values.end_of_life ? getDateUtcMuI(values.end_of_life) : false,
      amc_start_date: values.amc_start_date ? getDateUtcMuI(values.amc_start_date) : false,
      amc_end_date: values.amc_end_date ? getDateUtcMuI(values.amc_end_date) : false,
      class_id: values.class_id ? values.class_id.id : false,
      family_id: values.family_id ? values.family_id.id : false,
      segment_id: values.segment_id ? values.segment_id.id : false,
      employee_id: values.employee_id ? values.employee_id.id : false,
      location_id: values.location_id ? values.location_id.id : false,
      equipment_number: values.equipment_number,
      qr_code: values.qr_code,
      criticality: values.criticality ? values.criticality.value : '',
      image_medium: values.image_medium ? values.image_medium : false,
      image_small: values.image_small ? values.image_small : false,
      parent_id: values.parent_id ? values.parent_id.id : false,
      monitored_by_id: values.monitored_by_id ? values.monitored_by_id.id : false,
      managed_by_id: values.managed_by_id ? values.managed_by_id.id : false,
      maintained_by_id: values.maintained_by_id ? values.maintained_by_id.id : false,
    };
    if (isITAsset) {
      postData.assignment_status = values.assignment_status ? values.assignment_status.value : false;
      postData.is_qr_tagged = values.is_qr_tagged;
      postData.is_nfc_tagged = values.is_nfc_tagged;
      postData.is_rfid_tagged = values.is_rfid_tagged;
      postData.is_virtually_tagged = values.is_virtually_tagged;
    }
    const id = equipmentsDetails && equipmentsDetails.data ? equipmentsDetails.data[0].id : '';
    dispatch(updateEquipmentData(id, postData, appModels.EQUIPMENT));
  }

  const closeAddMaintenance = (resetForm) => {
    resetForm();
    closeModal();
    setIsOpenSuccessAndErrorModalWindow(false);
    setTimeout(() => {
      if (afterReset) afterReset();
    }, 1000);
  };

  return (
    <Row className="drawer-list thin-scrollbar pl-0 pr-0 pt-4 mr-0 ml-0">
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          enableReinitialize
          initialValues={editId && equipmentsDetails && equipmentsDetails.data ? trimJsonObject(equipmentsDetails.data[0]) : {}}
          validationSchema={currentValidationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, setFieldValue, setFieldTouched, validateField, values, resetForm,
          }) => (
            <Form id="filter_frm">
              <Box
                sx={{
                  padding: '20px',
                  width: '100%',
                }}
              >
                <FormControl
                  sx={{
                    width: '100%',
                  }}
                >
                  <AssetInfoUpdate setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} validateField={validateField}/>
                  <WarrantyUpdateForm setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} validateField={validateField} />
                  <MaintenanceUpdateForm setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} validateField={validateField}/>
                  <ValidationUpdateForm setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} isITAsset={isITAsset} />
                  <AdditionalUpdateForm setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} isITAsset={isITAsset} validateField={validateField}/>
                </FormControl>
                <Divider style={{ marginBottom: '10px', marginTop: '10px' }} />
                <Box sx={{ float: 'right', marginRight: '46px' }}>
                  <Button
                    type="button"
                    variant="contained"
                    onClick={() => handleSubmit(values)}
                    disabled={(!(isValid) || (!checkProductId(partsSelected)))}
                  >
                    Update
                  </Button>
                </Box>
              </Box>
              {updateEquipment && updateEquipment.loading && (
                <div className="text-center mt-3">
                  <Loader />
                </div>
              )}
              {(updateEquipment && updateEquipment.err) && (
                <SuccessAndErrorFormat response={updateEquipment} />
              )}
              <SuccessAndErrorModalWindow
                isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                type="update"
                successOrErrorData={updateEquipment}
                headerImage={assetIcon}
                headerText={isITAsset ? 'IT Asset' : 'Asset'}
                successRedirect={closeAddMaintenance.bind(null, resetForm)}
              />
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

AssetsDetailUpdate.propTypes = {
  editId: false,
  closeModal: PropTypes.func.isRequired,
  isITAsset: PropTypes.bool,
};

AssetsDetailUpdate.defaultProps = {
  afterReset: PropTypes.func.isRequired,
  isITAsset: false,
  editId: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
};

export default AssetsDetailUpdate;
