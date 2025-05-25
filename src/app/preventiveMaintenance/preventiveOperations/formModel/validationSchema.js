import * as Yup from 'yup';
import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    title,
    categoryType,
    maintenanceType,
  },
} = checkoutFormModel;

export default [
  Yup.object().shape({
    [title.name]: Yup.string()
      .required(`${title.requiredErrorMsg}`)
      .max(50, 'Title is too large'),
    [categoryType.name]: Yup.string()
      .nullable()
      .required(`${categoryType.requiredErrorMsg}`),
    [maintenanceType.name]: Yup.string()
      .nullable()
      .required(`${maintenanceType.requiredErrorMsg}`),
  }),
];
