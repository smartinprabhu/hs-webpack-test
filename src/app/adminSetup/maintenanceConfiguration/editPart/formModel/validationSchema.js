import * as Yup from 'yup';
import checkoutFormModel from './checkoutFormModel';

const {
  formField: {
    productName,
    categoryId,
    productType,
    purchaseUnitOfMeasure,
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
  [purchaseUnitOfMeasure.name]: Yup.string()
    .required(`${purchaseUnitOfMeasure.requiredErrorMsg}`),
  [unitOfMeasure.name]: Yup.string()
    .required(`${unitOfMeasure.requiredErrorMsg}`),
});

export default validationSchema;
