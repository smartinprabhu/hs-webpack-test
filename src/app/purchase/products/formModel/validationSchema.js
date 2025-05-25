import * as Yup from 'yup';
import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    productName,
    categoryId,
    productType,
    responsible,
    unitOfMeasure,
  },
} = checkoutFormModel;

const validationSchema = Yup.object().shape({
  [productName.name]: Yup.string()
    .required(`${productName.requiredErrorMsg}`),
  [categoryId.name]: Yup.string()
    .required(`${categoryId.requiredErrorMsg}`),
  [productType.name]: Yup.string()
    .required(`${productType.requiredErrorMsg}`),
  /*[responsible.name]: Yup.string()
    .required(`${responsible.requiredErrorMsg}`),*/
  [unitOfMeasure.name]: Yup.string()
    .required(`${unitOfMeasure.requiredErrorMsg}`),
});

export default validationSchema;
