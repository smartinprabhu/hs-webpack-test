/* eslint-disable no-useless-escape */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import siteBlackIcon from '@images/icons/siteBlue.svg';
import { ThemeProvider } from '@material-ui/core/styles';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import { Form, Formik } from 'formik';
import * as PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { Box } from '@mui/system';
import {
  Button,
} from '@mui/material';
import {
  extractValueObjects, getColumnArrayById, trimJsonObject,
} from '../util/appUtils';
import theme from '../util/materialTheme';
import checkoutFormModel from './formModel/checkoutFormModel';
import formInitialValues from './formModel/formInitialValues';
import validationSchema from './formModel/validationSchema';
import BasicForm from './forms/basicForm';
import {
  createSite, updateSiteConfiguartions, getSiteDetail, resetAddSiteInfo, resetUpdateSiteInfo, updateSite, getSiteFilters, getAllowedModule,
} from './siteService';
import {
  setSorting,
} from '../assets/equipmentService';

const appModels = require('../util/appModels').default;

const { formId, formField } = checkoutFormModel;

const AddSite = (props) => {
  const {
    editId, closeModal, afterReset,
  } = props;
  const dispatch = useDispatch();
  const [reload] = useState('1');
  const [copyCompany, setCopyCompany] = useState('');
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);
  const { userInfo } = useSelector((state) => state.user);

  const {
    addSiteInfo, siteDetails, updateSiteInfo, onBoardCopyInfo,
  } = useSelector((state) => state.site);
  useEffect(() => {
    if ((addSiteInfo && addSiteInfo.data) || (updateSiteInfo && updateSiteInfo.data)) {
      dispatch(setSorting({ sortBy: 'DESC', sortField: 'create_date' }));
    }
  }, [updateSiteInfo, addSiteInfo]);

  useEffect(() => {
    if (addSiteInfo && addSiteInfo.data && addSiteInfo.data.length) {
      const payload = {
        new_site_id: addSiteInfo.data[0],
        copy_from_company_id: copyCompany,
        type: 'create',
      };
      dispatch(updateSiteConfiguartions(payload));
      dispatch(getSiteDetail(addSiteInfo.data[0], appModels.COMPANY));
    }
  }, [userInfo, addSiteInfo]);

  useEffect(() => {
    if (updateSiteInfo && updateSiteInfo.data && updateSiteInfo.data && editId) {
      const payload = {
        new_site_id: editId,
        copy_from_company_id: userInfo.data.company.id,
        type: 'write',
      };
      dispatch(updateSiteConfiguartions(payload));
    }
  }, [userInfo, updateSiteInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const companyId = userInfo.data.company ? userInfo.data.company : '';
      formInitialValues.parent_id = companyId;
    }
  }, [userInfo]);

  useEffect(() => {
    dispatch(resetAddSiteInfo());
  }, []);

  useEffect(() => {
    dispatch(getAllowedModule(appModels.ONBOARDMODULE));
  }, []);

  function handleSubmit(values) {
    setCopyCompany('');
    let totalArea = values.area_sqft && values.area_sqft !== '' ? values.area_sqft : '';
    totalArea = totalArea.toString().replace(/\,/g, '');
    totalArea = parseInt(totalArea, 10);

    if (editId) {
      setIsOpenSuccessAndErrorModalWindow(true);
      // closeModal();
      const allowedModuleIds = values.allowed_module_ids && values.allowed_module_ids.length && values.allowed_module_ids.length > 0
        ? [[6, 0, getColumnArrayById(values.allowed_module_ids, 'id')]] : [[6, 0, []]];
      const postData = {
        name: values.name,
        // code: values.code,
        area_sqft: totalArea,
        street: values.street,
        city: values.city,
        zip: values.zip,
        country_id: extractValueObjects(values.country_id),
        state_id: extractValueObjects(values.state_id),
        company_tz: extractValueObjects(values.company_tz),
        // parent_id: extractValueObjects(values.parent_id),
        res_company_categ_id: extractValueObjects(values.res_company_categ_id),
        company_subcateg_id: extractValueObjects(values.company_subcateg_id),
        currency_id: extractValueObjects(values.currency_id),
        allowed_module_ids: allowedModuleIds,
        module_ids: getColumnArrayById(values.allowed_module_ids, 'id'),
        region_id: extractValueObjects(values.region_id),
      };
      // setCopyCompany(extractValueObjects(values.copy_from_company_id));
      if (postData.copy_from_company_id) delete postData.copy_from_company_id;
      const payload = { new_site_id: editId, values: postData, copy_from_company_id: extractValueObjects(values.copy_from_company_id) };
      dispatch(updateSite(payload));
    } else {
      setIsOpenSuccessAndErrorModalWindow(true);
      // closeModal();
      const countryId = extractValueObjects(values.country_id);
      const regionId = extractValueObjects(values.region_id);
      const stateId = extractValueObjects(values.state_id);
      const timezone = extractValueObjects(values.company_tz);
      const parentId = extractValueObjects(values.parent_id);
      const category = extractValueObjects(values.res_company_categ_id);
      const subCategory = extractValueObjects(values.company_subcateg_id);
      const currency = extractValueObjects(values.currency_id);
      const fromCompany = extractValueObjects(values.copy_from_company_id);

      setCopyCompany(extractValueObjects(values.copy_from_company_id));

      const allowedModuleIds = values.allowed_module_ids && values.allowed_module_ids.length && values.allowed_module_ids.length > 0
        ? [[6, 0, getColumnArrayById(values.allowed_module_ids, 'id')]] : [[6, 0, []]];

      const postData = { ...values };
      if (postData.copy_from_company_id) delete postData.copy_from_company_id;
      postData.country_id = countryId;
      postData.state_id = stateId;
      postData.company_tz = timezone;
      postData.allowed_module_ids = allowedModuleIds;
      postData.parent_id = parentId;
      postData.res_company_categ_id = category;
      postData.company_subcateg_id = subCategory;
      postData.currency_id = currency;
      postData.area_sqft = totalArea;
      postData.region_id = regionId;

      const payload = { model: appModels.COMPANY, copy_from_company_id: fromCompany, values: postData };
      dispatch(createSite(appModels.COMPANY, payload));
    }
  }

  const onLoadRequest = (eid, ename) => {
    if (eid) {
      const customFilters = [{
        key: 'id',
        value: eid,
        label: ename,
        type: 'id',
      }];
      dispatch(getSiteFilters(customFilters));
    }
    if (afterReset) afterReset();
    setIsOpenSuccessAndErrorModalWindow(false);
  };

  /* const closeAddMaintenance = () => {
    closeModal();
    setIsOpenSuccessAndErrorModalWindow(false);
  }; */

  const handleReset = (resetForm) => {
    resetForm();
    closeModal();
    setIsOpenSuccessAndErrorModalWindow(false);
    setTimeout(() => {
      if (afterReset) afterReset();
    }, 1000);
  };

  const onBoardData = onBoardCopyInfo && onBoardCopyInfo.data && onBoardCopyInfo.data.length ? onBoardCopyInfo.data : [];

  return (
    <Row className="drawer-list thin-scrollbar pl-0 pr-0 pt-4 mr-0 ml-0">
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          enableReinitialize
          initialValues={editId && siteDetails && siteDetails.data ? trimJsonObject(siteDetails.data[0]) : formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, setFieldValue, setFieldTouched, resetForm,
          }) => (
            <Form id={formId}>
              <Box
                sx={{
                  padding: '20px',
                  width: '100%',
                  marginBottom: '50px',
                }}
              >
                <div className="createFormScrollbar">
                  <ThemeProvider theme={theme}>
                    <div>
                      <BasicForm formField={formField} editId={editId} setFieldValue={setFieldValue} reload={reload} initialAllowed={onBoardData} setFieldTouched={setFieldTouched} />
                    </div>
                  </ThemeProvider>
                </div>
                {(addSiteInfo && !addSiteInfo.data && !addSiteInfo.loading)
                && (updateSiteInfo && !updateSiteInfo.data && !updateSiteInfo.loading) && (
                  <div className="bg-lightblue sticky-button-85drawer">
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
              </Box>
              <SuccessAndErrorModalWindow
                isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                type={editId ? 'update' : 'create'}
                newId={siteDetails && siteDetails.data && siteDetails.data.length > 0 ? siteDetails.data[0].id : false}
                newName={siteDetails && siteDetails.data && siteDetails.data.length > 0 ? siteDetails.data[0].name : false}
                successOrErrorData={editId ? updateSiteInfo : addSiteInfo}
                headerImage={siteBlackIcon}
                headerText="Site"
                onLoadRequest={onLoadRequest}
                successRedirect={handleReset.bind(null, resetForm)}
              />
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

AddSite.propTypes = {
  closeModal: PropTypes.func.isRequired,
  afterReset: PropTypes.func.isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default AddSite;
