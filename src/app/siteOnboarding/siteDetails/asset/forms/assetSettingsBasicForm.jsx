/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, {  } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Row, Col, Label,
} from 'reactstrap';

import {
  InputField, CheckboxField, CheckboxFieldGroup,
} from '@shared/formFields';

const appModels = require('../../../../util/appModels').default;

const ProductCategoryBasicForm = React.memo((props) => {
  const {
    editId,
    setFieldValue,
    setFieldTouched,
    formField: {
      hasSiteSpecificCategory,
      isEnableItTicket,
      attachmentLimit,
      sendEscalation,
      sendReminder,
      helpdeskFeedback,
      helpdeskSurvey,
      buttonText,
      helpdeskEmail,
      expiryDays,
      feedbackTicket,
      emailFeedback,
      enableExternalHelpdesk,
      uuidValue,
      externalUrl,
      verificationOtp,
      reviewerName,
      reviewerEmail,
      reviewerMobile,
      attachment,
      workLocation,
      mobileVisibility,
    },
  } = props;
  const dispatch = useDispatch();

  return (
    <>
      <Row className="mb-1">
        <Col xs={12} sm={4} lg={4} md={4}>
          <span className="d-inline-block pb-1 font-17 mb-2 font-weight-800 requestorForm-title">Helpdesk Communications</span>
          <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3">
            <CheckboxField
              name={hasSiteSpecificCategory.name}
              label={hasSiteSpecificCategory.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3">
            <CheckboxField
              name={isEnableItTicket.name}
              label={isEnableItTicket.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <InputField
              name={attachmentLimit.name}
              label={attachmentLimit.label}
              autoComplete="off"
              type="text"
              maxLength="30"
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3">
            <CheckboxField
              name={sendEscalation.name}
              label={sendEscalation.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3">
            <CheckboxField
              name={sendReminder.name}
              label={sendReminder.label}
            />
          </Col>
        </Col>
        <Col xs={12} sm={4} lg={4} md={4}>
          <span className="d-inline-block pb-1 font-17 mb-2 font-weight-800 requestorForm-title">Helpdesk Feedback</span>
          <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3">
            <CheckboxField
              name={helpdeskFeedback.name}
              label={helpdeskFeedback.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <InputField
              name={buttonText.name}
              label={buttonText.label}
              autoComplete="off"
              type="text"
              maxLength="30"
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3">
            <CheckboxField
              name={helpdeskEmail.name}
              label={helpdeskEmail.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <InputField
              name={expiryDays.name}
              label={expiryDays.label}
              autoComplete="off"
              type="text"
              maxLength="30"
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3">
            <CheckboxField
              name={feedbackTicket.name}
              label={feedbackTicket.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3">
            <CheckboxField
              name={emailFeedback.name}
              label={emailFeedback.label}
            />
          </Col>
        </Col>
        <Col xs={12} sm={4} lg={4} md={4}>
          <span className="d-inline-block pb-1 font-17 mb-2 font-weight-800 requestorForm-title">External Helpdesk</span>
          <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3">
            <CheckboxField
              name={enableExternalHelpdesk.name}
              label={enableExternalHelpdesk.label}
            />
          </Col>
          {/*<Col xs={12} sm={12} md={12} lg={12}>
            <InputField
              name={uuidValue.name}
              label={uuidValue.label}
              autoComplete="off"
              type="text"
              maxLength="30"
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <InputField
              name={externalUrl.name}
              label={externalUrl.label}
              autoComplete="off"
              type="text"
              maxLength="30"
            />
  </Col>*/}
          <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3">
            <CheckboxField
              name={verificationOtp.name}
              label={verificationOtp.label}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3">
            <Label for={reviewerName.name} className="m-0">
              {reviewerName.label}
            </Label>
            <br />
            <CheckboxFieldGroup
              name={reviewerName.name}
              checkedvalue="Required"
              id="Required"
              label={reviewerName.label1}
            />
            <CheckboxFieldGroup
              name={reviewerName.name}
              checkedvalue="Optional"
              id="Optional"
              label={reviewerName.label2}
            />
            <CheckboxFieldGroup
              name={reviewerName.name}
              checkedvalue="None"
              id="None"
              label={reviewerName.label3}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3">
            <Label for={reviewerEmail.name} className="m-0">
              {reviewerEmail.label}
            </Label>
            <br />
            <CheckboxFieldGroup
              name={reviewerEmail.name}
              checkedvalue="Required"
              id="Required"
              label={reviewerEmail.label1}
            />
            <CheckboxFieldGroup
              name={reviewerEmail.name}
              checkedvalue="Optional"
              id="Optional"
              label={reviewerEmail.label2}
            />
            <CheckboxFieldGroup
              name={reviewerEmail.name}
              checkedvalue="None"
              id="None"
              label={reviewerEmail.label3}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3">
            <Label for={reviewerMobile.name} className="m-0">
              {reviewerMobile.label}
            </Label>
            <br />
            <CheckboxFieldGroup
              name={reviewerMobile.name}
              checkedvalue="Required"
              id="Required"
              label={reviewerMobile.label1}
            />
            <CheckboxFieldGroup
              name={reviewerMobile.name}
              checkedvalue="Optional"
              id="Optional"
              label={reviewerMobile.label2}
            />
            <CheckboxFieldGroup
              name={reviewerMobile.name}
              checkedvalue="None"
              id="None"
              label={reviewerMobile.label3}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3">
            <Label for={attachment.name} className="m-0">
              {attachment.label}
            </Label>
            <br />
            <CheckboxFieldGroup
              name={attachment.name}
              checkedvalue="Required"
              id="Required"
              label={attachment.label1}
            />
            <CheckboxFieldGroup
              name={attachment.name}
              checkedvalue="Optional"
              id="Optional"
              label={attachment.label2}
            />
            <CheckboxFieldGroup
              name={attachment.name}
              checkedvalue="None"
              id="None"
              label={attachment.label3}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} className="ml-1 pl-3">
            <Label for={workLocation.name} className="m-0">
              {workLocation.label}
            </Label>
            <br />
            <CheckboxFieldGroup
              name={workLocation.name}
              checkedvalue="Required"
              id="Required"
              label={workLocation.label1}
            />
            <CheckboxFieldGroup
              name={workLocation.name}
              checkedvalue="Optional"
              id="Optional"
              label={workLocation.label2}
            />
            <CheckboxFieldGroup
              name={workLocation.name}
              checkedvalue="None"
              id="None"
              label={workLocation.label3}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <InputField
              name={mobileVisibility.name}
              label={mobileVisibility.label}
              autoComplete="off"
              type="text"
              maxLength="30"
            />
          </Col>
        </Col>
      </Row>
      <Row className="mb-1">
        <Col xs={12} sm={12} lg={12} md={12}>
          <span className="d-inline-block pb-1 font-17 mb-2 font-weight-800 requestorForm-title">Helpdesk State Email</span>
        </Col>
      </Row>
    </>
  );
});

ProductCategoryBasicForm.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  formField: PropTypes.objectOf([PropTypes.object, PropTypes.string]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default ProductCategoryBasicForm;
