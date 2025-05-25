/* eslint-disable prefer-destructuring */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  Card,
  CardBody,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { Formik, Form } from 'formik';
import { ThemeProvider } from '@material-ui/core/styles';
import * as PropTypes from 'prop-types';
import axios from 'axios';
import moment from 'moment';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';

import checkGreen from '@images/icons/checkGreen.svg';
import validationSchema from './mainFormModel/validationSchema';
import mainFormModel from './mainFormModel/formModel';
import formInitialValues from './mainFormModel/formInitialValues';
import theme from '../util/materialTheme';

import { getDefaultNoValue, getLocalTime } from '../util/appUtils';
import { getTabName } from '../util/getDynamicClientData';
import VisitorCreate from './visitorCreate';

const { formId, formField } = mainFormModel;
const appConfig = require('../config/appConfig').default;

const VisitorPreview = (props) => {
  const {
    onNext,
    detailData,
    onReset,
    hostDetails,
    accid,
  } = props;
  const [createInfo, setCreateInfo] = useState({ loading: false, data: null, err: null });
  const [visitorDetail, setVisitorDetail] = useState(false);

  const hostName = hostDetails && hostDetails.host_name ? hostDetails.host_name : '';
  const hostEmail = hostDetails && hostDetails.host_email ? hostDetails.host_email : '';

  const WEBAPPAPIURL = `${window.location.origin}/`;

  document.title = `${getTabName()} ${window.location.pathname.replace('/', '| ')}`;

  function handleSubmit(values) {
    setCreateInfo({
      loading: true, data: null, count: 0, err: null,
    });
    const data = {
      visitor_name: values.visitor_name,
      email: values.email,
      phone: values.phone,
      planned_in: values.planned_in ? moment(values.planned_in).utc().format('YYYY-MM-DD HH:mm:ss') : false,
      host_name: hostName,
      host_email: hostEmail,
    };

    setVisitorDetail(data);

    const postValues = {
      visitor_name: values.visitor_name,
      email: values.email,
      phone: values.phone,
      planned_in: values.planned_in ? moment(values.planned_in).utc().format('YYYY-MM-DD HH:mm:ss') : false,
      host_name: hostName,
      host_email: hostEmail,
    };

    // const context = { lang: 'en_US' };

    const payload = { uuid: detailData.uuid, values: postValues };

    const postData = new FormData();
    postData.append('values', JSON.stringify(payload.values));
    postData.append('uuid', payload.uuid);

    const config = {
      method: 'post',
      url: `${WEBAPPAPIURL}public/api/v4/vms/createHostRequest`,
      headers: {
        'Content-Type': 'multipart/form-data',
        portalDomain: window.location.origin,
        accountId: accid,
      },
      data: postData,
    };

    axios(config)
      .then((response) => setCreateInfo({
        loading: false, data: response.data.data, count: response.data.status, err: response.data.error,
      }))
      .catch((error) => {
        setCreateInfo({
          loading: false, data: null, count: 0, err: error,
        });
      });
  }

  const resetRequest = () => {
    onReset();
    onNext();
  };

  return (
    <Formik
      initialValues={formInitialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        isValid, dirty, setFieldValue, setFieldTouched,
      }) => (
        <Form id={formId}>
          {(createInfo && !createInfo.count && !createInfo.loading) && (
            <ThemeProvider theme={theme}>
              <VisitorCreate
                onNext={onNext}
                formField={formField}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                detailData={detailData}
              />
            </ThemeProvider>
          )}
          {(createInfo && createInfo.data && !createInfo.count) && (
            <div className="text-center mt-5">
              <SuccessAndErrorFormat response={createInfo} />
            </div>
          )}
          {(createInfo && createInfo.loading) && (
            <div className="text-center mt-3">
              <Loader />
            </div>
          )}
          {(createInfo && createInfo.data && createInfo.data.id) && (
            <div className="mt-2">
              {visitorDetail && (
              <Card className="bg-lightblue mb-2" id="print_report">
                <CardBody className="p-3">
                  <p className="mb-0">
                    <span className="font-weight-400">Visitor Name : </span>
                    <span className="font-weight-800 ml-1">{getDefaultNoValue(visitorDetail.visitor_name)}</span>
                  </p>
                  <p className="mb-0">
                    <span className="font-weight-400">Visitor Mobile : </span>
                    <span className="font-weight-800 ml-1">{getDefaultNoValue(visitorDetail.phone)}</span>
                  </p>
                  <p className="mb-0">
                    <span className="font-weight-400">Visitor Email : </span>
                    <span className="font-weight-800 ml-1">{getDefaultNoValue(visitorDetail.email)}</span>
                  </p>
                  <p className="mb-0">
                    <span className="font-weight-400">Visit On : </span>
                    <span className="font-weight-800 ml-1">{getLocalTime(visitorDetail.planned_in)}</span>
                  </p>

                  <div className="text-center p-2">
                    <img src={checkGreen} className="mr-2" alt="Approved" width="20" height="20" />
                    <span className="text-success">
                      Visit Invitation has been created and sent successfully to
                      {' '}
                      {visitorDetail.visitor_name}
                      .
                    </span>
                  </div>

                </CardBody>
              </Card>
              )}
              <div className="float-right">
                <Button
                  type="button"
                  size="md"
                  onClick={() => resetRequest()}
                   variant="contained"
                >
                  <span>Ok</span>
                </Button>
              </div>
            </div>
          )}
          {(createInfo && !createInfo.count && !createInfo.loading) && (
            <>
              <hr />
              <div className="float-right mt-1">
                <Button
                  type="button"
                  size="md"
                  className="mr-2 btn-cancel"
                  onClick={() => resetRequest()}
                   variant="contained"
                >
                  <span>Cancel</span>
                </Button>
                <Button
                  disabled={(!(isValid && dirty) || (createInfo && createInfo.loading))}
                  type="submit"
                  size="md"
                   variant="contained"
                >
                  <span>Submit</span>
                </Button>
              </div>
            </>
          )}
        </Form>
      )}
    </Formik>
  );
};

VisitorPreview.propTypes = {
  onNext: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  hostDetails: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};

export default VisitorPreview;
