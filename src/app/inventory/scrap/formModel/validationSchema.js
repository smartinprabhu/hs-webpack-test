import * as Yup from 'yup';
import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    name,
    locationId,
    scrapLocationId,
    productUomId,
    scrapQty,
  },
} = checkoutFormModel;

const validationSchema = Yup.object().shape({
  [name.name]: Yup.string()
    .required(`${name.requiredErrorMsg}`)
    .max(30, 'Name is too large'),
  [locationId.name]: Yup.string()
    .nullable()
    .required(`${locationId.requiredErrorMsg}`),
  [productUomId.name]: Yup.string()
    .nullable()
    .required(`${productUomId.requiredErrorMsg}`),
  [scrapQty.name]: Yup.string()
    .required(`${scrapQty.requiredErrorMsg}`),
  [scrapLocationId.name]: Yup.string()
    .required(`${scrapLocationId.requiredErrorMsg}`),
});

export default validationSchema;
