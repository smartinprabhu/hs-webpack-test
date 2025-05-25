import * as Yup from 'yup';
import checkoutFormModel from './spaceCheckoutFormModel';

const {
  formField: {
    name,
  },
} = checkoutFormModel;

const SpacevalidationSchema = Yup.object().shape({
  [name.name]: Yup.string()
    .required(`${name.requiredErrorMsg}`)
    .max(30, 'Category Name is too large'),
});

export default SpacevalidationSchema;
