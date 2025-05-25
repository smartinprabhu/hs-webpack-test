import * as Yup from 'yup';
import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    title,
    categoryId,
    subCategoryId,
    spaceId,
    equipmentId,
    raisedBy,
    types,
  },
} = checkoutFormModel;

const validationSchema = Yup.object().shape({
  [title.name]: Yup.string()
    .required(`${title.requiredErrorMsg}`),
  [categoryId.name]: Yup.string()
    .required(`${categoryId.requiredErrorMsg}`),
  [subCategoryId.name]: Yup.string()
    .required(`${subCategoryId.requiredErrorMsg}`),
  [raisedBy.name]: Yup.string()
    .required(`${raisedBy.requiredErrorMsg}`),
  [types.name]: Yup.string()
    .required(`${types.requiredErrorMsg}`),
  [spaceId.name]: Yup.string().when('type_category', {
    is: 'Space',
    then: Yup.string().required('Space is required'),
  }),
  [equipmentId.name]: Yup.string().when('type_category', {
    is: 'Equipment',
    then: Yup.string().required('Equipment is required'),
  }),
});

export default validationSchema;
