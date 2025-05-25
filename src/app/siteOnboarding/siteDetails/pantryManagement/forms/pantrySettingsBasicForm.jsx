/* eslint-disable max-len */
/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  CheckboxField, InputField,
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

const PantryBasicForm = React.memo((props) => {
  const {
    editId,
    setFieldValue,
    setFieldTouched,
    formField: {
      sendOrderCreatedNot,
      sendUpdateNot,
      sendConfirmNot,
      sendDeliverNot,
      sendCancelNot,
      enableQrDelivery,
      cleaningThreshold,
      IntegrateInventory,
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
          Notifications
        </span>
        <Col xs={12} sm={6} lg={6} md={6}>
          <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3">
            <CheckboxField
              name={sendOrderCreatedNot.name}
              label={sendOrderCreatedNot.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3">
            <CheckboxField
              name={sendUpdateNot.name}
              label={sendUpdateNot.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3">
            <CheckboxField
              name={sendConfirmNot.name}
              label={sendConfirmNot.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3">
            <CheckboxField
              name={sendDeliverNot.name}
              label={sendDeliverNot.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3">
            <CheckboxField
              name={sendCancelNot.name}
              label={sendCancelNot.label}
            />
          </Col>
        </Col>
      </Col>
      <Col xs={12} sm={6} lg={6} md={6}>
        <span className="d-inline-block pb-1 font-17 mb-2 font-weight-800 requestorForm-title">
          Integrate with Inventory
        </span>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3">
          <CheckboxField
            name={IntegrateInventory.name}
            label={IntegrateInventory.label}
          />
        </Col>
      </Col>
      <Col xs={12} sm={6} lg={6} md={6}>
        <span className="d-inline-block pb-1 font-17 mb-2 font-weight-800 requestorForm-title">
          Deliver Order
        </span>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3">
          <CheckboxField
            name={enableQrDelivery.name}
            label={enableQrDelivery.label}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3">
          <InputField
            name={cleaningThreshold.name}
            label={cleaningThreshold.label}
            // isRequired={phoneNumber.required}
            formGroupClassName="mb-1"
            type="text"
            // onKeyPress={integerKeyPress}
            maxLength="12"
          />
        </Col>
      </Col>
    </Row>
  );
});

PantryBasicForm.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  formField: PropTypes.objectOf([PropTypes.object, PropTypes.string]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default PantryBasicForm;
