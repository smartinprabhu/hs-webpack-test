import * as Yup from 'yup';
import checkoutFormModel from './assetCheckoutFormModel';

const {
  formField: {
    name,
  },
} = checkoutFormModel;

const AssetvalidationSchema = Yup.object().shape({
  [name.name]: Yup.string()
    .required(`${name.requiredErrorMsg}`)
    .max(30, 'Category Name is too large'),
});

export default AssetvalidationSchema;
