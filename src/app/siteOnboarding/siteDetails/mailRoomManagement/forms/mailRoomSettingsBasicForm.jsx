/* eslint-disable max-len */
/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  InputField,
} from '@shared/formFields';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { useFormikContext } from 'formik';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col, Row,
} from 'reactstrap';
import {
  getAllCompanies,
} from '../../../../util/appUtils';

const appModels = require('../../../../util/appModels').default;

const useStyles = makeStyles((themeStyle) => ({
  margin: {
    marginBottom: themeStyle.spacing(1.25),
    width: '100%',
  },
}));

const MailroomBasicForm = React.memo((props) => {
  const {
    editId,
    setFieldValue,
    setFieldTouched,
    formField: {
      inboundCollectionPeriod,
      outboundCollectionPeriod,
      inboundRemainder,
      outboundRemainder,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {} = formValues;
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.user);
  const {
    siteDetails,
  } = useSelector((state) => state.site);

  const companies = getAllCompanies(userInfo);
  const companiesSiteSpecific = siteDetails && siteDetails.data && siteDetails.data.length && siteDetails.data[0].id ? siteDetails.data[0].id : getAllCompanies(userInfo);

  return (
    <Row className="mb-1 requestorForm-input">
      <Col xs={12} sm={6} lg={6} md={6}>
        <span className="d-inline-block pb-1 font-17 mb-2 font-weight-800 requestorForm-title">
          Inbound Mail Setting
        </span>
        <Col xs={12} sm={12} md={12} lg={12}>
          <InputField
            name={inboundCollectionPeriod.name}
            label={inboundCollectionPeriod.label}
            formGroupClassName="mb-1"
            type="text"
            maxLength="12"
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <InputField
            name={inboundRemainder.name}
            label={inboundRemainder.label}
            formGroupClassName="mb-1"
            type="text"
            maxLength="12"
          />
        </Col>
      </Col>
      <Col xs={12} sm={6} lg={6} md={6}>
        <span className="d-inline-block pb-1 font-17 mb-2 font-weight-800 requestorForm-title">
          Outbound Mail Setting
        </span>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3">
          <InputField
            name={outboundCollectionPeriod.name}
            label={outboundCollectionPeriod.label}
            formGroupClassName="mb-1"
            type="text"
            maxLength="12"
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3">
          <InputField
            name={outboundRemainder.name}
            label={outboundRemainder.label}
            formGroupClassName="mb-1"
            type="text"
            maxLength="12"
          />
        </Col>
      </Col>
    </Row>
  );
});

MailroomBasicForm.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  formField: PropTypes.objectOf([PropTypes.object, PropTypes.string]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default MailroomBasicForm;
