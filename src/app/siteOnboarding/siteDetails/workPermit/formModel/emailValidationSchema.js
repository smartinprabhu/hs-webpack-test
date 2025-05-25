import * as Yup from 'yup';
import checkoutFormModel from './emailCheckoutFormModel';

const {
  formField: {
    requestState,
    isRecipients,
    messageType,
  },
} = checkoutFormModel;

const InventoryEmailValidationSchema = Yup.object().shape({
  [requestState.name]: Yup.string()
    .required(`${requestState.requiredErrorMsg}`),
  [messageType.name]: Yup.string()
    .required(`${messageType.requiredErrorMsg}`),

});

export default InventoryEmailValidationSchema;
