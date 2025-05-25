import * as Yup from 'yup';
import dayjs from 'dayjs';
import checkoutFormModel from './checkoutFormModel';

const today = dayjs().startOf('day');

const {
  formField: {
    Name,
    locationId,
    categoryId,
    maintenanceTeamId,
    amcStartDate,
    amcEndDate,
    warrantyStartDate,
    warrantyEndDate,
  },
} = checkoutFormModel;

const validationSchema = Yup.object().shape({
  [Name.name]: Yup.string()
    .required(`${Name.requiredErrorMsg}`)
    .max(100, 'Name is too large'),
  [locationId.name]: Yup.string()
    .nullable()
    .required(`${locationId.requiredErrorMsg}`),
  [categoryId.name]: Yup.string()
    .nullable()
    .required(`${categoryId.requiredErrorMsg}`),
  [maintenanceTeamId.name]: Yup.string()
    .nullable()
    .required(`${maintenanceTeamId.requiredErrorMsg}`),
  [warrantyStartDate.name]: Yup.date()
    .nullable()
    .max(today.toDate(), 'Warranty start date should be equal or lesser than current date'),
  [warrantyEndDate.name]: Yup.date()
    .nullable()
    .min(Yup.ref('warranty_start_date'), 'End date cannot be before Start date'),
  [amcStartDate.name]: Yup.date()
  .nullable()
    .max(today.toDate(), 'AMC start date should be equal or lesser than current date'),
  [amcEndDate.name]: Yup.date()
  .nullable()
    .min(Yup.ref('amc_start_date'), 'AMC end date must be after  AMC start date'),
  // [amcStartDate.name]: Yup.date()
  //   .max(new Date(), 'AMC start date should be equal or lesser than current date'),
  // [amcEndDate.name]: Yup.date()
  //   .notRequired()
  //   .min(Yup.ref('amc_start_date'), 'AMC end date must be after  AMC start date'),
  // [warrantyStartDate.name]: Yup.date()
  //   .nullable()
  //   .max(new Date(), 'Warranty start date should be equal or lesser than current date'),
  // [warrantyEndDate.name]: Yup.date()
  //   .nullable()
  //   .min(Yup.ref('warranty_start_date'), 'Warranty End date must be after warranty start date')
});

export default validationSchema;
