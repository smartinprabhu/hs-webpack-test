import * as Yup from 'yup';
import checkoutFormModel from './transactionCheckoutFormModel';

const {
  formField: {
    tankerId,
    blockId,
    initialReading,
    inData,
    outData,
    finalReading,
    amountVal,
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
  [outData.name]: Yup.string()
    .required(`${outData.requiredErrorMsg}`),
  [finalReading.name]: Yup.number()
    .required(`${finalReading.requiredErrorMsg}`)
    .test({
      name: 'max',
      exclusive: false,
      params: { },
      message: 'Final reading should be greater than or equal to initial reading',
      test(value) {
        // You can access the initial_reading field with `this.parent`.
        return value >= this.parent.initial_reading;
      },
    }),
  date_valid: Yup.string()
    .required(`${finalReading.requiredErrorMsg}`),
  [amountVal.name]: Yup.string()
    .required(`${amountVal.requiredErrorMsg}`),
});

export default TransactionValidationSchema;
