import * as Yup from 'yup';
import checkoutFormModel from './tankercheckoutFormModel';

const {
  formField: {
    name,
    commodityId,
    capacityValue,
    uomId,
  },
} = checkoutFormModel;

const tankerValidationSchema = Yup.object().shape({
  [name.name]: Yup.string()
    .required(`${name.requiredErrorMsg}`)
    .max(30, 'Category Name is too large'),
  [commodityId.name]: Yup.string()
    .required(`${commodityId.requiredErrorMsg}`),
  [capacityValue.name]: Yup.string()
    .required(`${capacityValue.requiredErrorMsg}`),
  [uomId.name]: Yup.string()
    .required(`${uomId.requiredErrorMsg}`),
});

export default tankerValidationSchema;
