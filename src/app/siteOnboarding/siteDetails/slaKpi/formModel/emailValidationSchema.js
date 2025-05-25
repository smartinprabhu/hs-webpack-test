import * as Yup from 'yup';
import checkoutFormModel from './emailCheckoutFormModel';

const {
  formField: {
    helpdeskState,
    mailTemplateId,
    smsTemplateId,
    recipientsName,
  },
} = checkoutFormModel;

const ProductCategoryvalidationSchema = Yup.object().shape({
  [helpdeskState.name]: Yup.string()
    .required(`${helpdeskState.requiredErrorMsg}`),
  [recipientsName.name]: Yup.string().when('is_recipients', {
    is: true,
    then: Yup.string().required('Recipients Name is required'),
  }),
  [mailTemplateId.name]: Yup.string().when('is_send_email', {
    is: true,
    then: Yup.string().required('Mail Template is required'),
  }),
});

export default ProductCategoryvalidationSchema;
