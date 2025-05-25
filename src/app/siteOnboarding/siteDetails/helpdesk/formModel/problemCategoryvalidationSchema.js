import * as Yup from 'yup';
import checkoutFormModel from './problemCategorycheckoutFormModel';

const {
  formField: {
    name,
  },
} = checkoutFormModel;

const ProductCategoryvalidationSchema = Yup.object().shape({
  [name.name]: Yup.string()
    .required(`${name.requiredErrorMsg}`)
    .max(30, 'Category Name is too large'),
});

export default ProductCategoryvalidationSchema;
