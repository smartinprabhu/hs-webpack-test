/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  Col,
  Row,
  Nav, NavLink,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { Formik, Form } from 'formik';
import { ThemeProvider } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';

import {
  updateCompany,
} from '../../setupService';
import BasicUpdateForm from './basicUpdateForm';
import LogosUpdateForm from './logosUpdateForm';
import SocialUpdateForm from './socialUpdateForm';
import AdditionalUpdateForm from './additionalUpdateForm';
import theme from '../../../util/materialTheme';
import {
  trimJsonObject,
} from '../../../util/appUtils';
import companyValidationSchema from './companyValidationSchema';
import tabs from './tabs.json';

const appModels = require('../../../util/appModels').default;

const currentValidationSchema = companyValidationSchema;

const CompanyDetailUpdate = () => {
  const dispatch = useDispatch();
  const [currentTab, setActive] = useState('Basic');
  const {
    updateCompanyInfo, companyDetail,
  } = useSelector((state) => state.setup);

  function handleSubmit(values) {
    const postData = {
      name: values.name,
      website: values.website,
      res_company_categ_id: values.res_company_categ_id ? values.res_company_categ_id.id : '',
      currency_id: values.currency_id ? values.currency_id.id : '',
      country_id: values.country_id ? values.country_id.id : '',
      state_id: values.state_id ? values.state_id.id : '',
      incoterm_id: values.incoterm_id ? values.incoterm_id.id : '',
      nomenclature_id: values.nomenclature_id ? values.nomenclature_id.id : '',
      company_tz: values.company_tz ? values.company_tz.value : '',
      street: values.street,
      latitude: values.latitude,
      longitude: values.longitude,
      is_parent: values.is_parent === 'yes',
      city: values.city,
      zip: values.zip,
      // code: values.code,
      phone: values.phone,
      email: values.email,
      vat: values.vat,
      company_registry: values.company_registry,
      social_twitter: values.social_twitter,
      social_facebook: values.social_facebook,
      social_github: values.social_github,
      social_linkedin: values.social_linkedin,
      social_youtube: values.social_youtube,
      social_instagram: values.social_instagram,
      theme_logo: values.theme_logo ? values.theme_logo : false,
      logo: values.theme_logo ? values.theme_logo : false,
      vendor_logo: values.vendor_logo ? values.vendor_logo : false,
      theme_icon: values.theme_icon ? values.theme_icon : false,
    };
    const id = companyDetail && companyDetail.data && companyDetail.data.length ? companyDetail.data[0].id : '';
    dispatch(updateCompany(id, postData, appModels.COMPANY));
  }

  return (
    <Row>
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          initialValues={companyDetail && companyDetail.data ? trimJsonObject(companyDetail.data[0]) : {}}
          validationSchema={currentValidationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, setFieldValue,
          }) => (
            <Form id="filter_frm">
              {(updateCompanyInfo && updateCompanyInfo.data) ? ('') : (
                <ThemeProvider theme={theme}>
                  <Nav>
                    {tabs && tabs.tabsList.map((item) => (
                      <div className="mr-5 ml-5" key={item.id}>
                        <NavLink className="nav-link-item pt-2 pb-1 pl-1 pr-1" active={currentTab === item.name} href="#" onClick={() => setActive(item.name)}>{item.name}</NavLink>
                      </div>
                    ))}
                  </Nav>
                  <br />
                  {currentTab === 'Basic' && (
                  <div className="pt-4 pr-5 pl-5 pb-5 mr-4 ml-4 audits-list thin-scrollbar">
                    <BasicUpdateForm setFieldValue={setFieldValue} />
                  </div>
                  )}
                  {currentTab === 'Advanced' && (
                  <div className="pt-1 pr-5 pl-5 pb-5 mr-2 ml-4 audits-list thin-scrollbar">
                    <Row>
                      <Col md="11" sm="11" lg="11" xs="12">
                        <AdditionalUpdateForm setFieldValue={setFieldValue} />
                        <LogosUpdateForm setFieldValue={setFieldValue} />
                        <SocialUpdateForm />
                      </Col>
                    </Row>
                  </div>
                  )}
                </ThemeProvider>
              )}
              {updateCompanyInfo && updateCompanyInfo.loading && (
              <div className="text-center mt-3">
                <Loader />
              </div>
              )}
              {(updateCompanyInfo && updateCompanyInfo.err) && (
              <SuccessAndErrorFormat response={updateCompanyInfo} />
              )}
              {(updateCompanyInfo && updateCompanyInfo.data) && (
              <SuccessAndErrorFormat response={updateCompanyInfo} successMessage="Company updated successfully.." />
              )}
              <hr />
              <div className="float-right mr-4">
                {!(updateCompanyInfo && updateCompanyInfo.data) && (
                <Button
                  disabled={!(isValid) || (updateCompanyInfo && updateCompanyInfo.loading)}
                  type="submit"
                  size="sm"
                   variant="contained"
                >
                  Update
                </Button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

export default CompanyDetailUpdate;
