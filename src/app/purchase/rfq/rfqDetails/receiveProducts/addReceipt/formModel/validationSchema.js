import * as Yup from 'yup';
import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    pickingTypeId,
    locationDestId,
    locationId,
    partnerId,
    dcNo,
    poNo,
  },
} = checkoutFormModel;

const validationSchema = Yup.object().shape({
  [pickingTypeId.name]: Yup.string()
    .nullable()
    .required(`${pickingTypeId.requiredErrorMsg}`),
  [partnerId.name]: Yup.string()
    .nullable()
    .required(' '),
  [dcNo.name]: Yup.string().when('has_dc', {
    is: 'Required',
    then: Yup.string().required(`${dcNo.requiredErrorMsg}`),
    otherwise: Yup.string(),
  }),
  [poNo.name]: Yup.string().when('has_po', {
    is: 'Required',
    then: Yup.string().required(`${poNo.requiredErrorMsg}`),
    otherwise: Yup.string(),
  }),
});

export default validationSchema;
