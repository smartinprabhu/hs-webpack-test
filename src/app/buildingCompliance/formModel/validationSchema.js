import * as Yup from 'yup';
import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    complianceTemplate,
    hasExpiry,
    expirySchedule,
    expiryScheduleType,
    repeatUntil,
    renewalLeadTime,
    nextExpiryDate,
    assetIds,
    companyId,
    location,
  },
} = checkoutFormModel;

const getAppliesTo = (applies_to, value) => {
  const appliesTo = applies_to && applies_to.value ? applies_to.value : applies_to;
  return appliesTo === value;
};

const validationSchema = Yup.object().shape({
  [complianceTemplate.name]: Yup.string()
    .nullable()
    .required(`${complianceTemplate.requiredErrorMsg}`),
  [hasExpiry.name]: Yup.boolean(),
  [nextExpiryDate.name]: Yup.date().when('is_has_expiry', {
    is: true,
    then: Yup.date().required(`${nextExpiryDate.requiredErrorMsg}`),
  }),
  [expirySchedule.name]: Yup.string().when('is_has_expiry', {
    is: true,
    then: Yup.string().required('Expiry Schedule is required').test(
      'is-greater-than-zero',
      'Expiry Schedule must be greater than zero',
      (value) => {
        const numValue = Number(value);
        return !Number.isNaN(numValue) && numValue > 0;
      },
    ),
  }),
  [expiryScheduleType.name]: Yup.string().when('is_has_expiry', {
    is: true,
    then: Yup.string().required('Expiry Schedule Type is required'),
  }),
  [repeatUntil.name]: Yup.string().when('is_has_expiry', {
    is: true,
    then: Yup.string().required('Repeat Until is required'),
  }),
  [renewalLeadTime.name]: Yup.string().when('is_has_expiry', {
    is: true,
    then: Yup.string().required('Renewal Lead Time (Days) is required'),
  }),
  [location.name]: Yup.array().when('applies_to', {
    is: (applies_to) => getAppliesTo(applies_to, 'Location'),
    then: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string(),
          id: Yup.string(),
        }),
      ).required(location.requiredErrorMsg),
  }),
  [assetIds.name]: Yup.array().when('applies_to', {
    is: (applies_to) => getAppliesTo(applies_to, 'Asset'),
    then: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string(),
          id: Yup.string(),
        }),
      ).required(assetIds.requiredErrorMsg),
  }),
  [companyId.name]: Yup.array().when('applies_to', {
    is: (applies_to) => getAppliesTo(applies_to, 'Site'),
    then: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string(),
          id: Yup.string(),
        }),
      ).required(companyId.requiredErrorMsg),
  }),
});

export default validationSchema;
