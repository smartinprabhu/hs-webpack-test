import * as Yup from 'yup';
import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    purchaseRepresentative,
    agreementType,
  },
} = checkoutFormModel;

const validationSchema = Yup.object().shape({
  [purchaseRepresentative.name]: Yup.string()
    .nullable()
    .required(`${purchaseRepresentative.requiredErrorMsg}`),
  [agreementType.name]: Yup.string()
    .nullable()
    .required(`${agreementType.requiredErrorMsg}`),
});

export default validationSchema;
