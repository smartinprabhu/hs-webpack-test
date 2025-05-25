/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-shadow */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  CardBody,
  Col,
  FormGroup,
  Label,
  Row,
} from 'reactstrap';
import {
  Button,
} from '@mui/material';
import { Formik, Form } from 'formik';
import { ThemeProvider } from '@material-ui/core/styles';
import * as PropTypes from 'prop-types';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import {
  TextField,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';

import DetailViewFormat from '@shared/detailViewFormat';

import idcardIcon from '@images/icons/idcard.svg';
import buildingBlack from '@images/icons/buildingBlack.svg';
import closeCircleRed from '@images/icons/closeCircleRed.svg';
import validationSchema from './basicFormModel/validationSchema';
import basicFormModel from './basicFormModel/formModel';
import formInitialValues from './basicFormModel/formInitialValues';
import theme from '../util/materialTheme';
import VisitorPreview from './visitorPreview';
import BasicForm from './basicForm';
import AuthService from '../util/authService';
import { getExportLogo, getTabName } from '../util/getDynamicClientData';
import { detectMimeType, getAccountIdFromUrl } from '../util/appUtils';

const { formId, formField } = basicFormModel;
const appConfig = require('../config/appConfig').default;

const HostValidation = (props) => {
  const { match } = props;
  const { params } = match;
  const { uuid } = params;
  const accid = getAccountIdFromUrl(props);
  const [isNext, setNext] = useState(false);
  const [vpConfig, setVpConfig] = useState({ loading: false, data: null, err: null });
  const [visitorDetails, setVisitorDetails] = useState(false);

  const [sitesList, setSitesList] = useState({ loading: false, data: null, err: null });
  const [suuid, setSite] = useState(false);
  const [siteOpen, setSiteOpen] = useState(false);

  const WEBAPPAPIURL = `${window.location.origin}/`;

  const authService = AuthService();
  const isAuthenticated = authService.getRefreshToken();

  // const { vpConfig } = useSelector((state) => state.setup);

  document.title = `${getTabName()} ${window.location.pathname.replace('/', '| ')}`;

  const oneSignalDiv = document.getElementById('onesignal-bell-container');
  const stickyFooter = document.getElementById('sticky_footer');

  if (oneSignalDiv) {
    oneSignalDiv.style.display = 'none';
  }

  if (stickyFooter) {
    stickyFooter.style.display = 'none';
  }

  useEffect(() => {
    if (uuid && !isAuthenticated) {
      setSitesList({
        loading: true, data: null, count: 0, err: null,
      });
      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}public/api/v4/getSitesForVMS?uuid=${uuid}&portalDomain=${window.location.origin}`,
        headers: {
          portalDomain: window.location.origin,
          accountId: accid,
        },
      };
      axios(config)
        .then((response) => setSitesList({
          loading: false, data: response.data.data, count: response.data.length, err: null,
        }))
        .catch((error) => {
          setSitesList({
            loading: false, data: null, count: 0, err: error,
          });
        });
    }
  }, [uuid, isAuthenticated]);

  useEffect(() => {
    if (suuid && suuid.uuid) {
      setVpConfig({
        loading: true, data: null, count: 0, err: null,
      });
      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}public/api/v4/getVMSConfig?uuid=${suuid.uuid}&portalDomain=${window.location.origin}`,
        headers: {
          portalDomain: window.location.origin,
          accountId: accid,
        },
      };
      axios(config)
        .then((response) => setVpConfig({
          loading: false, data: response.data.data, count: response.data.length, err: null,
        }))
        .catch((error) => {
          setVpConfig({
            loading: false, data: null, count: 0, err: error,
          });
        });
    }
  }, [suuid]);

  const detailData = vpConfig && vpConfig.data ? vpConfig.data : '';
  const isValidSite = suuid && suuid.uuid && vpConfig && vpConfig.data && vpConfig.count > 0;

  function handleSubmit(values) {
    setVisitorDetails(values);
    setNext(true);
  }

  const handleReset = (resetForm) => {
    setVisitorDetails(false);
    resetForm();
  };

  const handleSiteSelect = (data) => {
    setSite(data);
  };

  function getSitesRows(data) {
    let res = [];
    if (data && data.length) {
      res = data.map((cl) => ({
        uuid: cl.uuid, name: cl.company_id.name,
      }));
    }
    return res;
  }

  if (isAuthenticated) {
    return (
      <Redirect to={{
        pathname: '/visitormanagement/visitrequest',
        state: { referrer: 'add-request' },
      }}
      />
    );
  }

  return (
    <Row className="ml-1 mr-1 external-link-tickets mt-2 mb-2 p-3">
      {sitesList && sitesList.data && sitesList.count > 0 && (
      <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12">
        <>
          <CardBody className="p-0 mb-3 bg-ghost-white">
            {isValidSite && (
            <Row className="content-center">
              <Col md="1" sm="2" lg="1" xs="2">
                <img src={buildingBlack} alt="buildingBlack" className="mr-2" width="35" height="35" />
              </Col>
              <Col md="8" sm="7" lg="8" xs="7">
                <h4 className="mb-1 mt-0">
                  Welcome to
                  {' '}
                  {detailData && detailData.company && detailData.company.name ? detailData.company.name : ''}
                </h4>
              </Col>
              <Col md="2" sm="3" lg="2" xs="3">
                <img
                  src={detailData.company && detailData.company.logo ? `data:${detectMimeType(detailData.company.logo)};base64,${detailData.company.logo}` : getExportLogo()}
                  width="70"
                  height="auto"
                  className="d-inline-block align-top pr-2"
                  alt="Helixsense Portal"
                />
              </Col>
            </Row>
            )}
            {!isValidSite && (
            <Row className="content-center">
              <Col md="1" sm="2" lg="1" xs="2">
                <img src={buildingBlack} alt="buildingBlack" className="mr-2" width="35" height="35" />
              </Col>
              <Col md="8" sm="8" lg="8" xs="8">
                <h4 className="mb-1 mt-0">
                  Welcome to
                  {' '}
                  {sitesList.data.parent_company && sitesList.data.parent_company.name ? sitesList.data.parent_company.name : ''}
                </h4>
              </Col>
            </Row>
            )}
          </CardBody>
          <h5 className="mb-0 mt-4">
            <img src={idcardIcon} alt="actions" className="mr-2 mb-2" width="30" height="30" />
            Visitor Pass
          </h5>
          <hr className="mt-0" />
          {!isValidSite && (
          <p className="text-center m-0 text-info">
            <FontAwesomeIcon
              color="info"
              className="mr-2"
              size="sm"
              icon={faInfoCircle}
            />
            {sitesList.data.external_link_text ? sitesList.data.external_link_text : ''}
          </p>
          )}
          {!isNext && (
            <Row>
              <Col md="12" sm="12" lg="12" xs="12">
                <FormGroup className="m-1">
                  <Label for="Site" className="m-0">
                    Site
                    {' '}
                    <span className="ml-1 text-danger">*</span>
                  </Label>
                  <Autocomplete
                    name="Site"
                    className="bg-white"
                    open={siteOpen}
                    value={suuid && suuid.name ? suuid.name : ''}
                    size="small"
                    onOpen={() => {
                      setSiteOpen(true);
                    }}
                    onClose={() => {
                      setSiteOpen(false);
                    }}
                    defaultValue={suuid && suuid.name ? suuid.name : ''}
                    getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                    options={getSitesRows(sitesList.data.child_site ? sitesList.data.child_site : [])}
                    onChange={(e, data) => handleSiteSelect(data)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        className="without-padding"
                        placeholder="Select Site"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </FormGroup>
              </Col>
            </Row>
          )}
          {!isNext && isValidSite && (
          <Formik
            initialValues={formInitialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              isValid, values, setFieldValue, resetForm,
            }) => (
              <Form id={formId}>
                <ThemeProvider theme={theme}>
                  <BasicForm accid={accid} visitorDetails={visitorDetails} setFieldValue={setFieldValue} formField={formField} detailData={detailData} />
                </ThemeProvider>
                <hr />
                <div className="float-right mt-1">
                  <Button
                    type="button"
                    size="md"
                    className="mr-2 submit-btn"
                    onClick={handleReset.bind(null, resetForm)}
                    variant="contained"
                  >
                    <span>Cancel</span>
                  </Button>
                  {isValid && values.host_name && (
                  <Button
                    disabled={(!(isValid) && !(values.host_name))}
                    type="submit"
                    size="md"
                    className="submit-btn"
                    variant="contained"
                  >
                    <span>Next</span>
                  </Button>
                  )}
                </div>
              </Form>
            )}
          </Formik>
          )}
          {isNext && isValidSite && (
            <VisitorPreview accid={accid} hostDetails={visitorDetails} onReset={() => setVisitorDetails(false)} onNext={() => setNext(false)} detailData={detailData} />
          )}
          {vpConfig && vpConfig.data && !vpConfig.count && (
            <div className="text-center mt-3 mb-3">
              <img src={closeCircleRed} className="mr-2" alt="invalid" width="40" height="40" />
              <h4 className="text-danger">Oops! Your site was not configured</h4>
            </div>
          )}
          <DetailViewFormat detailResponse={vpConfig} />
        </>
      </Col>
      )}
      {sitesList && sitesList.data && !sitesList.count && (
      <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12">
        <div className="text-center mt-3 mb-3">
          <img src={closeCircleRed} className="mr-2" alt="invalid" width="40" height="40" />
          <h4 className="text-danger">Oops! Your request is invalid</h4>
        </div>
      </Col>
      )}
      <DetailViewFormat detailResponse={sitesList} />
    </Row>
  );
};

HostValidation.defaultProps = {
  match: false,
};

HostValidation.propTypes = {
  match: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]),
};

export default HostValidation;
