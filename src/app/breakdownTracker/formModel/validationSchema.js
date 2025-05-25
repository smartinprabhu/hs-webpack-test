/* eslint-disable camelcase */
import * as Yup from 'yup';
import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    title,
    incidentDate,
    expectedClosureDate,
    spaceId,
    equipmentId,
    raisedOn,
    types,
    descriptionOfBreakdown,
    amcStatus,
    serviceCategoryId,
    isServiceImpacted,
    serviceImpactedIds,
    vendorName,
  },
} = checkoutFormModel;

const validationSchema = Yup.object().shape({
  [title.name]: Yup.string()
    .required(`${title.requiredErrorMsg}`),
  [incidentDate.name]: Yup.string()
    .required(`${incidentDate.requiredErrorMsg}`),
  [expectedClosureDate.name]: Yup.date()
    .required(`${expectedClosureDate.requiredErrorMsg}`),
  [raisedOn.name]: Yup.string()
    .required(`${raisedOn.requiredErrorMsg}`),
  [types.name]: Yup.string()
    .required(`${types.requiredErrorMsg}`),
  [descriptionOfBreakdown.name]: Yup.string()
    .required(`${descriptionOfBreakdown.requiredErrorMsg}`),
  [spaceId.name]: Yup.string().when('type', {
    is: 'Space',
    then: Yup.string().required('Space is required'),
  }),
  [equipmentId.name]: Yup.string().when('type', {
    is: 'Equipment',
    then: Yup.string().required('Equipment is required'),
  }),
  [serviceImpactedIds.name]: Yup.string().when('is_service_impacted', {
    is: true,
    then: Yup.string().required('Service Impacted is required'),
  }),
  [amcStatus.name]: Yup.mixed().when('type', {
    is: 'Equipment',
    then: Yup.mixed().required('AMC Status is required'),
  }),
  [serviceCategoryId.name]: Yup.string()
    .nullable()
    .required(`${serviceCategoryId.requiredErrorMsg}`),
  [vendorName.name]: Yup.string().when('amc_status', {
    is: (amc_status) => amc_status
      && (amc_status === 'Valid' || amc_status.value === 'Valid'),
    then: Yup.string().required('Vendor is required'),
  }),
});

export default validationSchema;
