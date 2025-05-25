/* eslint-disable radix */
/* eslint-disable no-lone-blocks */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import InventoryBlue from '@images/icons/inventoryBlue.svg';
import { ThemeProvider } from '@material-ui/core/styles';
import {
  Button,
} from '@mui/material';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import { Form, Formik } from 'formik';
import * as PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { createProductCategory, updateProductCategory } from '../../../pantryManagement/pantryService';
import {
  extractValueObjects, getAllowedCompanies, trimJsonObject,
} from '../../../util/appUtils';
import theme from '../../../util/materialTheme';
import checkoutFormModel from './formModel/spaceCheckoutFormModel';
import formInitialValues from './formModel/spaceFormInitialValues';
import validationSchema from './formModel/spaceValidationSchema';
import BasicForm from './forms/spaceCategoryBasicForm';

const appModels = require('../../../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddAssetCategory = (props) => {
  const { closeModal, editId } = props;
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const dispatch = useDispatch();
  const {
    addProductCategoryInfo,
    updateProductCategoryInfo,
  } = useSelector((state) => state.pantry);
  const {
    scInfo, siteDetails,
  } = useSelector((state) => state.site);
  const { userInfo } = useSelector((state) => state.user);

  // useEffect(() => {
  //   if (((updateProductCategoryInfo && updateProductCategoryInfo.data) || (addProductCategoryInfo && addProductCategoryInfo.data))) {
  //     dispatch(setSorting({ sortBy: 'DESC', sortField: 'create_date' }));
  //   }
  // }, [updateProductCategoryInfo, addProductCategoryInfo]);

  function handleSubmit(values) {
    if (editId) {
      setIsOpenSuccessAndErrorModalWindow(true);
      // closeModal();
      const postData = {
        name: values.name,
        sequence: values.sequence,
        allow_multiple_bookings: values.allow_multiple_bookings,
        allowed_booking_in_advance: values.allowed_booking_in_advance,
        multi_day_booking_limit: values.multi_day_booking_limit,
        is_bookable: values.is_bookable,
        file_path: values.file_path,
        parent_id: extractValueObjects(values.parent_id),
        type: extractValueObjects(values.type),
        image_medium: values.image_medium
          ? values.image_medium : '',
      };
      dispatch(updateProductCategory(editId, appModels.ASSETCATEGORY, postData));
    } else {
      setIsOpenSuccessAndErrorModalWindow(true);
      //closeModal();

      const postData = { ...values };

      postData.name = values.name;
      postData.sequence = values.sequence;
      postData.allow_multiple_bookings = values.allow_multiple_bookings;
      postData.allowed_booking_in_advance = values.allowed_booking_in_advance;
      postData.multi_day_booking_limit = values.multi_day_booking_limit;
      postData.is_bookable = values.is_bookable;
      postData.file_path = values.file_path;
      postData.parent_id = extractValueObjects(values.parent_id);
      postData.type = extractValueObjects(values.type);
      postData.image_medium = values.image_medium
        ? values.image_medium : '';
      postData.company_id = siteDetails && siteDetails.data && siteDetails.data.length && siteDetails.data[0].id ? siteDetails.data[0].id : getAllowedCompanies(userInfo);
      const payload = { model: appModels.ASSETCATEGORY, values: postData };
      dispatch(createProductCategory(appModels.ASSETCATEGORY, payload));
    }
  }

  const handleReset = (resetForm) => {
    resetForm();
    closeModal();
    setIsOpenSuccessAndErrorModalWindow(false);
    setTimeout(() => {
      if (closeModal) closeModal();
    }, 1000);
  };

  return (
    <Row className="drawer-list thin-scrollbar pl-0 pr-0 pt-4 mr-0 ml-0">
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          enableReinitialize
          initialValues={editId && scInfo && scInfo.data && scInfo.data.length ? trimJsonObject(scInfo.data[0]) : formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, setFieldValue, setFieldTouched, resetForm,
          }) => (
            <Form id={formId}>
              <ThemeProvider theme={theme}>
                <div>
                  <BasicForm formField={formField} editId={editId} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} />
                </div>
              </ThemeProvider>
              {/* {((addProductCategoryInfo && addProductCategoryInfo.loading) || (scInfo && scInfo.loading)) && (
                <div className="text-center mt-3">
                  <Loader />
                </div>
              )}
              {(addProductCategoryInfo && addProductCategoryInfo.err) && (
                <SuccessAndErrorFormat response={addProductCategoryInfo} />
              )}
              {(updateProductCategoryInfo && updateProductCategoryInfo.err) && (
                <SuccessAndErrorFormat response={updateProductCategoryInfo} />
              )}
              {((addProductCategoryInfo && addProductCategoryInfo.data) || (updateProductCategoryInfo && updateProductCategoryInfo.data)) && (
                <SuccessAndErrorFormat
                  response={addProductCategoryInfo.data ? addProductCategoryInfo : updateProductCategoryInfo}
                  successMessage={addProductCategoryInfo.data ? 'Space category added successfully..' : 'Space category details are updated successfully..'}
                />
              )} */}
              <div className="float-right m-4">
                {((addProductCategoryInfo && addProductCategoryInfo.data) || (updateProductCategoryInfo && updateProductCategoryInfo.data)) ? (
                ''
                ) : (
                  <div className="bg-lightblue sticky-button-85drawer">
                    <Button
                      disabled={!editId ? !(isValid && dirty) : !isValid}
                      type="submit"
                      size="sm"
                      variant="contained"
                    >
                      {!editId ? 'Add' : 'Update'}
                    </Button>
                  </div>
                )}
              </div>
              <SuccessAndErrorModalWindow
                isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                type={editId ? 'update' : 'create'}
                successOrErrorData={editId ? updateProductCategoryInfo : addProductCategoryInfo}
                headerImage={InventoryBlue}
                headerText="Space Category"
                successRedirect={handleReset.bind(null, resetForm)}
              />
            </Form>
          )}
        </Formik>
      </Col>

    </Row>
  );
};

AddAssetCategory.propTypes = {
  closeModal: PropTypes.func.isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
};

export default AddAssetCategory;
