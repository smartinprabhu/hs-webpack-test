import * as Yup from 'yup';
import checkoutFormModel from './settingsCheckoutFormModel';

const {
  formField: {
},
} = checkoutFormModel;

const ProductCategoryvalidationSchema = Yup.object().shape({
});

export default ProductCategoryvalidationSchema;
