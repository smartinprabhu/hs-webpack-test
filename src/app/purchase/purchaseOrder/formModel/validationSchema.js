import * as Yup from 'yup';
import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    partnerId,
    partnerRef,
    dateOrder,
    companyId,
    pickingTypeId,
  },
} = checkoutFormModel;

const validationSchema = Yup.object().shape({
  [partnerId.name]: Yup.string()
    .nullable()
    .required(`${partnerId.requiredErrorMsg}`),
  [partnerRef.name]: Yup.string()
    .required(`${partnerRef.requiredErrorMsg}`),
  [dateOrder.name]: Yup.string()
    .required(`${dateOrder.requiredErrorMsg}`),
  [companyId.name]: Yup.string()
    .nullable()
    .required(`${companyId.requiredErrorMsg}`),
  [pickingTypeId.name]: Yup.string()
    .nullable()
    .required(`${pickingTypeId.requiredErrorMsg}`),
});

export default validationSchema;
