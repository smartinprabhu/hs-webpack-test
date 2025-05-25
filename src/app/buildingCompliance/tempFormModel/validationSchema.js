import * as Yup from 'yup';
import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    name,
    complianceAct,
    complianceCategory,
    submittedTo,
    hasExpiry,
    expirySchedule,
    expiryScheduleType,
    renewalLeadTime,
  },
} = checkoutFormModel;

const validationSchema = Yup.object().shape({
  [name.name]: Yup.string()
    .nullable()
    .trim()
    .required(`${name.requiredErrorMsg}`),
  [complianceAct.name]: Yup.string()
    .nullable()
    .required(`${complianceAct.requiredErrorMsg}`),
  [complianceCategory.name]: Yup.string()
    .nullable()
    .required(`${complianceCategory.requiredErrorMsg}`),
  [submittedTo.name]: Yup.string()
    .nullable()
    .required(`${submittedTo.requiredErrorMsg}`),
  [hasExpiry.name]: Yup.boolean(),
  [expirySchedule.name]: Yup.string().when('is_has_expiry', {
    is: true,
    then: Yup.string().required('Expiry Schedule is required'),
  }),
  [expiryScheduleType.name]: Yup.string().when('is_has_expiry', {
    is: true,
    then: Yup.string().required('Expiry Schedule Type is required'),
  }),
  [renewalLeadTime.name]: Yup.string().when('is_has_expiry', {
    is: true,
    then: Yup.string().required('Renewal Lead Time (Days) is required'),
  }),
});

export default validationSchema;
