/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-max-props-per-line */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import { ThemeProvider } from '@material-ui/core/styles';
import { Button } from '@mui/material';
import { Form, Formik } from 'formik';
import * as PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Col, Row } from 'reactstrap';

import assetIcon from '@images/icons/assetDefault.svg';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';

import theme from '../../util/materialTheme';
import { last } from '../../util/staticFunctions';
import checkoutFormModel from '../formModel/checkoutFormModel';
import formInitialValues from '../formModel/formInitialValues';
import validationSchema from '../formModel/validationSchema';
import AdditionalForm from './assetAdditionalForm';
import WarrantyForm from './assetWarrantyForm';
import BasicForm from './createBasicForm';
import BasicInfoForm from './createBasicInfoForm';
import LocationForm from './locationForm';
import {
  createBulkData,
} from '../../helpdesk/ticketService';
import MultipleDataAccordian from '../../commonComponents/multipleFormFields/multipleDataAccordian';
import { resetBulkAdd } from '../../helpdesk/actions';
import {
  getArrayFormatCreateSingle, trimArrayofObjectValue,
} from '../../util/appUtils';
import { checkRequiredFields } from '../../adminSetup/utils/utils';
import customData from '../../adminSetup/assetsLocationConfiguration/addLocation/data/companyData.json';

const appModels = require('../../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const CreateAsset = (props) => {
  const {
    afterReset,
    isModal,
    spaceId,
    pathName,
    isITAsset,
    isGlobalITAsset,
    editId,
  } = props;
  const history = useHistory();
  const dispatch = useDispatch();
  const [reload, setReload] = useState('1');
  const [
    isOpenSuccessAndErrorModalWindow,
    setIsOpenSuccessAndErrorModalWindow,
  ] = useState(false);
  const { createBulkInfoAdd } = useSelector((state) => state.ticket);
  const [partsData, setPartsData] = useState([]);
  const [partsAdd, setPartsAdd] = useState(false);

  const { userInfo } = useSelector((state) => state.user);

  const loadEmptyTd = () => {
    const newData = partsData && partsData.length ? partsData : [];
    newData.push({
      id: 'math.Radom()',
      maintenance_team_id: '',
      category_id: '',
      name: '',
      manufacturer_id: '',
      vendor_id: '',
      amc_type: '',
      amc_cost: '0.00',
      rav: '0.00',
      customer_id: '',
      asset_id: '',
      purchase_date: null,
      purchase_value: '',
      warranty_start_date: null,
      warranty_end_date: null,
      amc_start_date: null,
      amc_end_date: null,
      validation_status: '',
      validated_on: null,
      validated_by: '',
      comment: '',
      parent_id: '',
      commodity_id: '',
      family_id: '',
      class_id: '',
      segment_id: '',
      start_date: null,
      tag_status: '',
      resource_calendar_id: '',
      employee_id: '',
      serial: '',
      model: '',
      latitude: '',
      longitude: '',
      operating_hours: '',
      xpos: '',
      ypos: '',
      make: '',
      capacity: '',
      last_service_done: null,
      refilling_due_date: null,
      criticality: '',
      equipment_number: '',
      monitored_by_id: '',
      managed_by_id: '',
      maintained_by_id: '',
      category_type: '',
      image_medium: '',
      image_small: '',
      brand: '',
      company_id: userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.id ? userInfo.data.company.id : '',
    });
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  useEffect(() => {
    loadEmptyTd();
  }, []);

  useEffect(() => {
    if (partsAdd) {
      setPartsData(partsData);
    }
  }, [partsAdd]);

  async function submitForm(values) {
    const location = values.location_id && values.location_id.length > 0
      ? last(values.location_id)
      : false;
    const newArr = partsData.map((v) => ({
      ...v,
      criticality: v.criticality && v.criticality.value ? v.criticality.value : '',
      amc_type: v.amc_type && v.amc_type.value ? v.amc_type.value : '',
      name: `${customData?.facilityData?.manage_equipment?.prefix || ''}${v.name || ''}`,
      location_id: location,
    }));
    setIsOpenSuccessAndErrorModalWindow(true);
    // const newarray = newArr.reverse();
    dispatch(createBulkData(appModels.EQUIPMENT, getArrayFormatCreateSingle(trimArrayofObjectValue(newArr, ['name', 'purchase_value', 'comment', 'serial', 'model', 'latitude', 'longitude', 'xpos', 'ypos', 'make', 'capacity', 'equipment_number', 'brand']))));
  }

  function handleSubmit(values) {
    submitForm(values);
  }

  const handleReset = (resetForm) => {
    resetForm();
    afterReset();
    dispatch(resetBulkAdd());
    setIsOpenSuccessAndErrorModalWindow(false);
    if (afterReset) afterReset();
  };

  const [expanded, setExpanded] = React.useState(false);
  const [expandedVal, setExpandVal] = React.useState(false);

  const handleChange = (panel) => {
    setExpanded(panel === expanded ? false : panel);
  };

  return (
    <Row className="pl-0 pr-0 mr-0 ml-0">
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          initialValues={formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            setFieldValue,
            setFieldTouched,
            resetForm,
            values,
          }) => (
            <Form id={formId}>
              <ThemeProvider theme={theme}>
                <div className="">
                  <LocationForm
                    formField={formField}
                    isGlobalITAsset={isGlobalITAsset}
                    spaceId={spaceId}
                    pathName={pathName}
                    setFieldValue={setFieldValue}
                    reloadSpace={reload}
                    values={values}
                    loadEmptyTd={loadEmptyTd}
                  />
                  <div className="createFormScrollbar-middle">
                    {(partsData && partsData.length > 0 && partsData.map((formData, index) => (
                      !formData.isRemove && (
                      <MultipleDataAccordian
                        className="m-3"
                        indexForm={index}
                        summary={(
                          <BasicForm
                            index={index}
                            formField={formField}
                            isGlobalITAsset={isGlobalITAsset}
                            spaceId={spaceId}
                            pathName={pathName}
                            setFieldValue={setFieldValue}
                            reloadSpace={reload}
                            values={values}
                            formData={formData}
                            setPartsAdd={setPartsAdd}
                            partsAdd={partsAdd}
                            setPartsData={setPartsData} partsData={partsData}
                          />
)}
                        detail={[
                          {
                            id: 1,
                            component: <BasicInfoForm
                              index={index}
                              formField={formField}
                              isGlobalITAsset={isGlobalITAsset}
                              spaceId={spaceId}
                              pathName={pathName}
                              setFieldValue={setFieldValue}
                              reloadSpace={reload}
                              values={values}
                              formData={formData}
                              setPartsAdd={setPartsAdd}
                              partsAdd={partsAdd}
                              setPartsData={setPartsData} partsData={partsData}
                            />,
                          },
                          {
                            id: 2,
                            component: <WarrantyForm
                              formField={formField}
                              setFieldValue={setFieldValue}
                              formData={formData}
                              setPartsAdd={setPartsAdd}
                              partsAdd={partsAdd}
                              setPartsData={setPartsData} partsData={partsData}
                              index={index}
                            />,
                          },
                          {
                            id: 3,
                            component: <AdditionalForm
                              isITAsset={isITAsset}
                              formField={formField}
                              setFieldValue={setFieldValue}
                              setFieldTouched={setFieldTouched}
                              formData={formData}
                              setPartsAdd={setPartsAdd}
                              partsAdd={partsAdd}
                              setPartsData={setPartsData} partsData={partsData}
                              index={index}
                            />,
                          },
                        ]}
                      />
                      )
                    )))}
                  </div>
                </div>
              </ThemeProvider>
              {createBulkInfoAdd && createBulkInfoAdd.loading && (
                <div className="text-center mt-3">
                  <Loader />
                </div>
              )}
              {createBulkInfoAdd && createBulkInfoAdd.err && (
                <SuccessAndErrorFormat response={createBulkInfoAdd} />
              )}
              {!isModal
                  && createBulkInfoAdd
                  && !createBulkInfoAdd.data
                  && !createBulkInfoAdd.loading && (
                    <div className="bg-lightblue sticky-button-85drawer">
                      <Button
                        disabled={(partsData && partsData.length <= 0) || (!checkRequiredFields(partsData, 'assets')) || !(values.location_id && values.location_id.length > 0)}
                        type="button"
                        onClick={() => handleSubmit(values)}
                        variant="contained"
                        className="submit-btn"
                      >
                        {!editId ? 'Create' : 'Update'}
                      </Button>
                    </div>
              )}
              <SuccessAndErrorModalWindow
                isOpenSuccessAndErrorModalWindow={
                  isOpenSuccessAndErrorModalWindow
                }
                setIsOpenSuccessAndErrorModalWindow={
                  setIsOpenSuccessAndErrorModalWindow
                }
                type="create"
                successOrErrorData={createBulkInfoAdd}
                headerImage={assetIcon}
                headerText="Equipment"
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
  spaceId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]),
  isModal: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
  pathName: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  isITAsset: PropTypes.bool,
  isGlobalITAsset: PropTypes.bool,
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default CreateAsset;
