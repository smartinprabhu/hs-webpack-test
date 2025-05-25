import * as Yup from 'yup';
import checkoutFormModel from './checkoutFormModelInbound';

const {
  formField: {
    recipientValue,
    parcelDimensions,
    senderValue,
  },
} = checkoutFormModel;

const validationSchemaInbound = Yup.object().shape({
  [recipientValue.name]: Yup.string()
    .nullable()
    .required(`${recipientValue.requiredErrorMsg}`),
  [senderValue.name]: Yup.string()
    .nullable()
    .required(`${senderValue.requiredErrorMsg}`),
  [parcelDimensions.name]: Yup.string()
    .nullable()
    .required(`${parcelDimensions.requiredErrorMsg}`),
});

export default validationSchemaInbound;
