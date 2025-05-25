import * as Yup from 'yup';
import checkoutFormModel from './emailCheckoutFormModel';

const {
  formField: {
    requestState,
    isRecipients,
    typeOfOperation,
  },
} = checkoutFormModel;

const InventoryEmailValidationSchema = Yup.object().shape({
  [requestState.name]: Yup.string()
    .required(`${requestState.requiredErrorMsg}`),
  [typeOfOperation.name]: Yup.string()
    .required(`${typeOfOperation.requiredErrorMsg}`),

});

export default InventoryEmailValidationSchema;
