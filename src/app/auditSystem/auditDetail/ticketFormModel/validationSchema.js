/* eslint-disable consistent-return */
import * as Yup from 'yup';
import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    categoryId,
    subCategorId,
    assetId,
    equipmentId,
  },
} = checkoutFormModel;

const validationSchema = Yup.object().shape({
  [categoryId.name]: Yup.string()
    .required(`${categoryId.requiredErrorMsg}`),
  [subCategorId.name]: Yup.string()
    .required(`${subCategorId.requiredErrorMsg}`),
  [equipmentId.name]: Yup.string().when('type_category', {
    is: 'equipment',
    then: Yup.string().required('Equipment is required'),
  }),
  [assetId.name]: Yup.string().when('type_category', {
    is: 'asset',
    then: Yup.string().required('Space is required'),
  }),
});

export default validationSchema;
