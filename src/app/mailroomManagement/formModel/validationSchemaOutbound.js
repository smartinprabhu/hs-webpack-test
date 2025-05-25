import * as Yup from 'yup';
import checkoutFormModel from './checkoutFormModelOutbound';

const {
  formField: {
    recipientValue,
    parcelDimensions,
    sentTo,
  },
} = checkoutFormModel;

const validationSchemaOutbound = Yup.object().shape({
  [recipientValue.name]: Yup.string()
    .nullable()
    .required(`${recipientValue.requiredErrorMsg}`),
  [parcelDimensions.name]: Yup.string()
    .nullable()
    .required(`${parcelDimensions.requiredErrorMsg}`),
  [sentTo.name]: Yup.string()
    .nullable()
    .required(`${sentTo.requiredErrorMsg}`),
});
export default validationSchemaOutbound;
