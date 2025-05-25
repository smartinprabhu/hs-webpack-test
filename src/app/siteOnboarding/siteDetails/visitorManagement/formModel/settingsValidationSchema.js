import * as Yup from 'yup';
import checkoutFormModel from './settingsCheckoutFormModel';

const {
  formField: {
    visitorInvitationTemplateId,
    otpTemplateId,
    requestTemplateId,
    checkInTemplateId,
    checkOutTemplateId,
    approvalTemplateId,
    elapsedTemplateId,
  },
} = checkoutFormModel;

const SettingsValidationSchema = Yup.object().shape({
  [visitorInvitationTemplateId.name]: Yup.string().when('is_send_visitor_invitation_whatsapp', {
    is: true,
    then: Yup.string().required('Visitor Invitation Template is required'),
  }),
  [otpTemplateId.name]: Yup.string().when('is_send_whatsapp_message', {
    is: true,
    then: Yup.string().required('OTP Template is required'),
  }),
  [requestTemplateId.name]: Yup.string().when('is_send_request_whatsapp', {
    is: true,
    then: Yup.string().required('Request Template is required'),
  }),
  [checkInTemplateId.name]: Yup.string().when('is_send_check_in_whatsapp', {
    is: true,
    then: Yup.string().required('Checkin Template is required'),
  }),
  [checkOutTemplateId.name]: Yup.string().when('is_send_check_out_whatsapp', {
    is: true,
    then: Yup.string().required('Checkout Template is required'),
  }),
  [approvalTemplateId.name]: Yup.string().when('is_send_approval_whatsapp', {
    is: true,
    then: Yup.string().required('Approval Template is required'),
  }),
  [elapsedTemplateId.name]: Yup.string().when('is_send_elapsed_whatsapp', {
    is: true,
    then: Yup.string().required('Elapsed Template is required'),
  }),
});

export default SettingsValidationSchema;
