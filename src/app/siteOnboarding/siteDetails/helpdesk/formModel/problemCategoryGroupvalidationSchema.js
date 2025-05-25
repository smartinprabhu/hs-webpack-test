import * as Yup from 'yup';
import checkoutFormModel from './problemCategoryGroupcheckoutFormModel';

const {
  formField: {
    name,
    spaceCategoryIds,
    equipmentCategoryIds,
  },
} = checkoutFormModel;

const ProductCategoryvalidationSchema = Yup.object().shape({
  [name.name]: Yup.string()
    .required(`${name.requiredErrorMsg}`)
    .max(30, 'Category Name is too large'),
  [equipmentCategoryIds.name]: Yup.string().when('type_category', {
    is: 'equipment',
    then: Yup.string().required('Equipment Category is required'),
  }),
  [spaceCategoryIds.name]: Yup.string().when('type_category', {
    is: 'asset',
    then: Yup.string().required('Space Category is required'),
  }),
  [equipmentCategoryIds.name]: Yup.string().when('is_all_asset_category', {
    is: false,
    then: Yup.string().required('Equipment Category is required'),
    otherwise: Yup.string().notRequired(),
  }),
  [spaceCategoryIds.name]: Yup.string().when('is_all_asset_category', {
    is: false,
    then: Yup.string().required('Space Category is required'),
    otherwise: Yup.string().notRequired(),
  }),
});

export default ProductCategoryvalidationSchema;
