/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import {
  Col, Row,
} from 'reactstrap';
import { Formik, Form } from 'formik';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import { FormControl, Button, Box } from "@mui/material";

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import InventoryBlue from '@images/icons/inventoryBlue.svg';

import BasicForm from './forms/basicLocationForm';
import AdvanceForm from './forms/advanceForm';
import validationSchema from './formModel/locationValidationSchema';
import locationFormModel from './formModel/locationFormModel';
import formInitialValues from './formModel/locationFormInitialValues';
import {
  trimJsonObject,
  extractValueObjects,
} from '../../util/appUtils';

import { createLocation, updateLocation } from '../inventoryService';

const appModels = require('../../util/appModels').default;

const { formId, formField } = locationFormModel;

const AddLocation = (props) => {
  const {
    editId, afterReset, isModal,
    isTheme,
  } = props;
  const dispatch = useDispatch();
  const [currentTab, setActive] = useState('Basic');
  const [reload, setReload] = useState('1');
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const {
    locationDetails,
    addLocationInfo,
    updateLocationInfo,
  } = useSelector((state) => state.inventory);

  function handleSubmit(values) {
    if (editId) {
      setIsOpenSuccessAndErrorModalWindow(true);
      const postData = {
        name: values.name,
        usage: extractValueObjects(values.usage),
        scrap_location: values.scrap_location,
        return_location: values.return_location,
        posx: values.posx,
        posy: values.posy,
        posz: values.posz,
        barcode: values.barcode ? values.barcode : false,
        comment: values.comment,
        location_id: extractValueObjects(values.location_id),
        partner_id: extractValueObjects(values.partner_id),
        company_id: extractValueObjects(values.company_id),
      };
      dispatch(updateLocation(editId, appModels.STOCKLOCATION, postData));
    } else {
      if (!isModal) {
        setIsOpenSuccessAndErrorModalWindow(true);
      }
      const { name } = values;
      const usage = extractValueObjects(values.usage);
      const { posx } = values;
      const scrapLocation = values.scrap_location;
      const returnLocation = values.return_location;
      const { posy } = values;
      const { posz } = values;
      const barcode = values.barcode ? values.barcode : false;
      const { comment } = values;
      const partnerId = extractValueObjects(values.partner_id);
      const locationId = extractValueObjects(values.location_id);
      const companyId = extractValueObjects(values.company_id);

      const postData = { ...values };

      postData.name = name;
      postData.usage = usage;
      postData.scrap_location = scrapLocation;
      postData.return_location = returnLocation;
      postData.posx = posx;
      postData.posy = posy;
      postData.posz = posz;
      postData.barcode = barcode;
      postData.comment = comment;
      postData.location_id = locationId;
      postData.partner_id = partnerId;
      postData.company_id = companyId;

      const payload = { model: appModels.STOCKLOCATION, values: postData };
      dispatch(createLocation(appModels.STOCKLOCATION, payload));
    }
  }

  const handleReset = (resetForm) => {
    resetForm();
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
          initialValues={editId && locationDetails && locationDetails.data ? trimJsonObject(locationDetails.data[0]) : formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, setFieldValue, setFieldTouched, resetForm,
          }) => (
            <Form id={formId}>
              {(addLocationInfo && !addLocationInfo.data && !addLocationInfo.loading) && (
                <>
                  <Box
                    sx={{
                      width: "100%",
                    }}
                  >
                    <FormControl
                      sx={{
                        width: "100%",
                        padding: "10px 0px 20px 30px",
                        borderTop: '1px solid #0000001f',
                      }}
                    >
                      <Box sx={{ width: "100%", display: 'flex', gap: '35px' }}>
                        {!isTheme && (
                          <>
                            <BasicForm formField={formField} setFieldValue={setFieldValue} reload={reload} setFieldTouched={setFieldTouched} />
                            <AdvanceForm formField={formField} setFieldValue={setFieldValue} reload={reload} />
                          </>
                        )}
                        {isTheme && (
                          <>
                            <BasicForm formField={formField} setFieldValue={setFieldValue} reload={reload} setFieldTouched={setFieldTouched} />
                            <AdvanceForm formField={formField} setFieldValue={setFieldValue} reload={reload} />
                          </>
                        )}
                      </Box>
                    </FormControl>
                  </Box>
                </>
              )}
              {(addLocationInfo && addLocationInfo.err) && (
                <SuccessAndErrorFormat response={addLocationInfo} />
              )}
              {(updateLocationInfo && updateLocationInfo.err) && (
                <SuccessAndErrorFormat response={updateLocationInfo} />
              )}
              {!isModal && (addLocationInfo && !addLocationInfo.data && !addLocationInfo.loading) && (
                <>
                  <div className="bg-lightblue sticky-button-736drawer">
                    <Button
                      disabled={!editId ? !(isValid && dirty) : !isValid}
                      type="submit"
                      variant='contained'
                    >
                      {!editId ? 'Create' : 'Update'}
                    </Button>
                  </div>
                </>
              )}
              {isModal && (addLocationInfo && !addLocationInfo.data && !addLocationInfo.loading) && (
                <>
                  <hr />
                  <div className="float-right">
                    <Button
                      disabled={!editId ? !(isValid && dirty) : !isValid}
                      type="submit"
                      variant='contained'
                    >
                      {!editId ? 'Create' : 'Update'}
                    </Button>
                  </div>
                </>
              )}
              {!isModal
                ? (
                  <SuccessAndErrorModalWindow
                    isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                    setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                    type={editId ? 'update' : 'create'}
                    successOrErrorData={editId ? updateLocationInfo : addLocationInfo}
                    headerImage={InventoryBlue}
                    headerText="Location"
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

AddLocation.propTypes = {
  afterReset: PropTypes.func.isRequired,
  closeAddModal: PropTypes.func.isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  isTheme: PropTypes.bool,
  isModal: PropTypes.bool,
};

AddLocation.defaultProps = {
  isTheme: false,
  isModal: false,
};

export default AddLocation;
