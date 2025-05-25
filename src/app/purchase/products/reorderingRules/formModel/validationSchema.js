import * as Yup from 'yup';
import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    name,
    productId,
    warehouse,
    location,
    leadType,
    alertQuantity,
    minQuantity,
  },
} = checkoutFormModel;

const validationSchema = Yup.object().shape({
  [productId.name]: Yup.string()
    .nullable()
    .required(`${productId.requiredErrorMsg}`),
  [warehouse.name]: Yup.string()
    .nullable()
    .required(`${warehouse.requiredErrorMsg}`),
  [location.name]: Yup.string()
    .nullable()
    .required(`${location.requiredErrorMsg}`),
  [minQuantity.name]: Yup.number()
    .required(`${minQuantity.requiredErrorMsg}`),
    [alertQuantity.name]: Yup.number()
    .required(`${alertQuantity.requiredErrorMsg}`)
    .test({
      name: 'max',
      exclusive: false,
      params: { },
      message: 'Alert Level should be greater than Reorder Level',
      test(value) {
        // You can access the product_min_qty field with `this.parent`.
        return value > this.parent.product_min_qty;
      },
    }),
  [leadType.name]: Yup.string()
    .required(`${leadType.requiredErrorMsg}`),
});

export default validationSchema;
