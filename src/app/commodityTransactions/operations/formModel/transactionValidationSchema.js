import * as Yup from 'yup';
import checkoutFormModel from './transactionCheckoutFormModel';

const {
  formField: {
    tankerId,
    blockId,
    initialReading,
    inData,
  },
} = checkoutFormModel;

const TransactionValidationSchema = Yup.object().shape({
  [tankerId.name]: Yup.string()
    .required(`${tankerId.requiredErrorMsg}`),
  [blockId.name]: Yup.string()
    .required(`${blockId.requiredErrorMsg}`),
  [initialReading.name]: Yup.string()
    .required(`${initialReading.requiredErrorMsg}`),
  [inData.name]: Yup.string()
    .required(`${inData.requiredErrorMsg}`),
});

export default TransactionValidationSchema;
