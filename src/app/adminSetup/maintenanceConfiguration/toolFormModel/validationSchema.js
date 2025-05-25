/* eslint-disable import/no-unresolved */
import * as Yup from 'yup';
import toolFormModel from './toolFormModel';

const {
  formField: {
    nameValue,
    toolCostUnit,
  },
} = toolFormModel;

const validationSchema = Yup.object().shape({
  [nameValue.name]: Yup.string()
    .required(`${nameValue.requiredErrorMsg}`)
    .max(30, 'Name is too large'),
  [toolCostUnit.name]: Yup.string()
    .required(`${toolCostUnit.requiredErrorMsg}`),
});

export default validationSchema;
